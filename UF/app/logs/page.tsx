

'use client'
import React, { useState, useEffect, useMemo, useDeferredValue, useContext } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import TableHeader from './logTable/logTable'
import { getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import Artifactdetails from './artifactdetails'
import { TotalContext, TotalContextProps } from '../globalContext'
import { dateTime } from '@gravity-ui/date-utils'

const ParentComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'process' | 'torus'>('process')
  const [nodeData, setNodeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [app, setApp] = useState({
    code: 'TOB002',
    name: 'TOBApp'
  })
  const [appGroup, setappGroup] = useState({
    code: 'TOB001',
    name: 'TOB'
  })
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  const [user, setUser] = useState<string[]>([decodedTokenObj?.loginId])
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps
  const [range , setRange ] = useState({start: dateTime().subtract({days: 4}), end: dateTime()})
  const [ fabrics , setFabrics ] = useState<Array<string>>([])

  const [jsonData, setJsonData] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalDocuments: 0,
    totalPages: 0
  })
  const search = useDeferredValue(searchTerm)

  const suffixes: any = {
  DF: ["DFD"],
  UF: ["UFM", "UFW"],
  PF: ["PFD"],
  API: ["APID", "ERD"],
  AIF: ["AIFD"],
  CDF: ["DPD", "IFD"],
};  

  let payload:any = useMemo(() => {
    return {
      tenant: 'CT242',
      fabric: fabrics.length > 0 ? fabrics.flatMap((prefix: any) =>
              suffixes[prefix]
                ? suffixes[prefix].map((suffix: any) => `${prefix}-${suffix}`)
                : []
          ) : [],
      appgroup: appGroup,
      app: app,
      user: user,
      FromDate: range.start.format('YYYY-MM-DD'),
      ToDate: range.end.format('YYYY-MM-DD'),
      page: jsonData.page,
      limit: jsonData.limit,
      searchParam: search
    }
  }, [activeTab, jsonData, search , range , fabrics , user])  

  const fetchData = async (signal: AbortSignal) => {
    try {
      if (encAppFalg.flag) {
        payload['dpdKey'] = encAppFalg.dpd;
        payload['method'] = 'vault';
      }
      console.log('Fetching data...', payload)
      setLoading(true)
      const response = await AxiosService.post(
        `/${activeTab === 'torus' ? 'expLog' : 'prcLog'}`,
        payload,
        {
          signal: signal
        }
      )

      const result = response.data
      if (activeTab === 'torus') {
        if (result && typeof result === 'object' && 'data' in result) {
          setJsonData(prevData => ({
            ...prevData,
            data: result.data,
            page: result.page,
            limit: result.limit,
            totalDocuments: result.totalDocuments,
            totalPages: result.totalPages
          }))
        } else {
          setJsonData(prevData => ({
            ...prevData,
            data: [],
            page: 1,
            limit: 10,
            totalDocuments: 0,
            totalPages: 0
          }))
        }
      } else {
        if (result && typeof result === 'object' && 'data' in result) {
          const res = result?.data?.map((item: any) => {
            const processId = Object.keys(item['AFSK'])[0]
            const artifactKey = `CK:${item['CK']}:FNGK:AF:FNK:${item['FNK']}:CATK:${item['CATK']}:AFGK:${item['AFGK']}:AFK:${item['AFK']}:AFVK:${item['AFVK']}`
            const nodes = item['AFSK'][processId]
            const artifact = item['AFK']
            const grpDetails = `${item['CATK']} > ${item['AFGK']}`
            const fabric = item['FNK'].includes('PF')
              ? 'PROCESS'
              : item['FNK'].includes('DF')
                ? 'DATA'
                : 'UI'
            let overallStatus = 'Success'

            // Map nodes and check status in a single pass
            const nodeDetails = nodes.map((nodeObj: any) => {
              const { processInfo, DateAndTime, errorDetails } = nodeObj
              const nodeStatus = processInfo.status

              // Update the overall status if any node fails
              if (nodeStatus === 'Failed') overallStatus = 'Failed'

              return {
                nodeData: {
                  name: processInfo.nodeName,
                  request: processInfo.request,
                  response: processInfo.response,
                  subFlowInfo : processInfo.subFlowInfo ? processInfo.subFlowInfo : undefined,
                  time: DateAndTime,
                  status: nodeStatus,
                  exception: errorDetails
                },
                status: nodeStatus,
                time: DateAndTime,
                processId
              }
            })

            return {
              artifactName: {
                artifact,
                grpDetails,
                processId,
                artifactKey
              },
              fabric,
              version: item['AFVK'],
              status: overallStatus,
              user : item['USER'],
              node: nodeDetails.map((node: any) => node.nodeData),
              time: nodeDetails.map((node: any) => node.time),
              processId,
              artifact,
              grpDetails
            }
          })

          setJsonData(prevData => ({
            ...prevData,
            data: res,
            page: result.page,
            limit: result.limit,
            totalDocuments: result.totalDocuments,
            totalPages: result.totalPages
          }))
        } else {
          setJsonData(prevData => ({
            ...prevData,
            data: [],
            page: 1,
            limit: 10,
            totalDocuments: 0,
            totalPages: 0
          }))
        }
      }
      setLoading(false)
    } catch (error: any) {
      if (error?.code !== 'ERR_CANCELED') {
        setLoading(false)
        setJsonData(prevData => ({
          ...prevData,
          data: [],
          page: 1,
          limit: 10,
          totalDocuments: 0,
          totalPages: 0
        }))
      }

      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetchData(signal)

    //cleanup function
    return () => {
      controller.abort()
    }
  }, [jsonData.page, jsonData.limit, search, activeTab , range])

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setJsonData(prev => ({
      ...prev,
      page: newPage,
      limit: newPageSize
    }))
  }

  return (
    <>
      {nodeData ? (
        <Artifactdetails nodeData={nodeData} setNodeData={setNodeData} />
      ) : (
        <TableHeader
          loading={loading}
          jsonData={jsonData}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setNodeData={setNodeData}
          range={range}
          setRange={setRange}
          fabrics={fabrics}
          setFabrics={setFabrics}
          user={user}
          setUser={setUser}
        />
      )}
    </>
  )
}

export default ParentComponent
