

'use client'
import React, { useState, useEffect, useMemo, useDeferredValue, useContext } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import TableHeader from './logTable/logTable'
import { deleteAllCookies, getCookie, setCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import Artifactdetails from './artifactdetails'
import { TotalContext, TotalContextProps } from '../globalContext'
import { dateTime } from '@gravity-ui/date-utils'
import { useRouter } from 'next/navigation'

const ParentComponent = () => {
  console.log("🚀 ~ TgService ~ codeGeneration ~ setupData:")
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'process' | 'torus'>('process')
  const [nodeData, setNodeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [app, setApp] = useState({
    code: 'oprmatrix',
    name: 'oprmatrix'
  })
  const [appGroup, setappGroup] = useState({
    code: 'AG001',
    name: 'appgroup'
  })
  const token: string = getCookie('token')
  const decodedToken: any = decodeToken(token)
  const [user, setUser] = useState<string[]>([decodedToken?.loginId])
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps
  const [range , setRange ] = useState({start: dateTime().subtract({days: 7}), end: dateTime()})
  const [ fabrics , setFabrics ] = useState<Array<string>>([])
  const [jsonViewerData, setJsonViewerData] = useState({})
  const router = useRouter()
  let landingScreen:string = 'User Screen';
  const encryptionFlagApp: boolean = false;    
  const [jsonData, setJsonData] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalDocuments: 0,
    totalPages: 0
  })
  const search = useDeferredValue(searchTerm)
  const suffixes: any = {
    DF: ['DFD'],
    UF: ['UFM', 'UFW'],
    PF: ['PFD', 'CAFD', 'PAFD'],
    API: ['MSD', 'ERD', 'APIPD', 'APICD'],
    AIF: ['AIFD'],
    CDF: ['DPD', 'IFD']
  };
  let payload:any = useMemo(() => {
    return {
      tenant: 'CT003',
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
  }, [activeTab, jsonData, search , range , fabrics, user])

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
          const systemLogResult :any  = [];
          
      for (const item of response.data.data) {
        const { AFK, CATK, AFGK, AFVK, FNK } = item;

        for (const log of item.AFSK.logInfo) {
          const { sessionInfo, errorDetails, DateAndTime } = log;

          systemLogResult.push({
            artifact: AFK,
            grpDetails: `${CATK} > ${AFGK}`,
            version: AFVK,
            fabric: FNK,
            user: sessionInfo.user,
            accessProfile: sessionInfo.accessProfile,
            profile: sessionInfo.profile,
            timeStamp: DateAndTime,
            errorCode: errorDetails.T_ErrorCode,
            errorDescription: typeof errorDetails.errorDetail === "string" ? errorDetails.errorDetail : "Get More Info",
            errorDetails,
          });
        }
      }
      if(systemLogResult.length && systemLogResult[0].errorDetails){
        setJsonViewerData(systemLogResult[0].errorDetails)
      }else{
        setJsonViewerData({})
      }
          setJsonData(prevData => ({
            ...prevData,
            data: systemLogResult,
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
        setJsonViewerData({})
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
  }, [jsonData.page, jsonData.limit, search, activeTab , range, fabrics , user])

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setJsonData(prev => ({
      ...prev,
      page: newPage,
      limit: newPageSize
    }))
  }
  const securityCheck = async () => {
  try {
    const encryptionDpd: string =
      'CK:CT003:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixtestdpd:AFVK:v1'
    const encryptionMethod: string = ''
    let introspect: any
    if (encryptionFlagApp) {
      introspect = await AxiosService.get('/UF/introspect', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          dpdKey: encryptionDpd,
          method: encryptionMethod,
          key:"Logs Screen"
        }
      })
    } else {
      introspect = await AxiosService.get('/UF/introspect', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          key:"Logs Screen"
        }
      })
    }

    if (introspect?.data?.authenticated) {
      if (!decodedToken.selectedAccessProfile) {
        router.push('/select-context')
      }
      if (introspect?.data?.updatedToken) {
        setCookie('token', introspect?.data.updatedToken)
      }
    } else {
      await deleteAllCookies()
    }
  } catch (err: any) {
    await deleteAllCookies()
  }
}

  useEffect(() => {
    if (token) {
      securityCheck()
    }
  }, [token])
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
          jsonViewerData={jsonViewerData}
          setJsonViewerData={setJsonViewerData}
        />
      )}
    </>
  )
}

export default ParentComponent
