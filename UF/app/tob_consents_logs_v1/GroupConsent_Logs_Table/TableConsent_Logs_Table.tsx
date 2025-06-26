"use client"
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import JsonView from "react18-json-view";
import {
  Col,
  Flex,
  Row,
  Table,
  TableDataItem,
  TableProps,
  withTableSettings,
  WithTableSettingsProps,
  withTableSorting,
  withTableSelection,
  WithTableSelectionProps,
  RenderRowActionsProps,
  withTableActions,
  WithTableActionsProps
} from '@gravity-ui/uikit'
import { DatePicker } from '@gravity-ui/date-components'
import React, { useEffect, useState,useContext } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from "@/app/components/infoMsgHandler"
import { getCookie } from "@/app/components/cookieMgment"
import { nullFilter } from '@/app/utils/nullDataFilter';
import { codeExecution } from '@/app/utils/codeExecution'
import { uf_fetchActionDetailsDto,uf_fetchRuleDetailsDto,te_refreshDto,api_paginationDto,uf_paginationDataFilterDto } from '@/app/interfaces/interfaces';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { Pagination, PaginationProps} from '@gravity-ui/uikit'


const MyTable: React.ComponentType<
  TableProps<TableDataItem> &
      WithTableSettingsProps &
    WithTableActionsProps<TableDataItem>|any
> =
  withTableSettings
(
  withTableSorting(
  (withTableActions(Table)))
)
let defaultColumns = 
[
  {
    "id": "baseconsentid",
    "name": "Base Consent ID",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "interactionid",
    "name": "Interaction ID",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "permissions",
    "name": "Permissions",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "status",
    "name": "Status",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "revokedby",
    "name": "Revoked By",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "expirationdatetime",
    "name": "Expiration Date & Time",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  }
] ;
for (let i = 0; i < defaultColumns.length; i++) {
  defaultColumns[i].id = defaultColumns[i].id.toLowerCase();
}
function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
} 

const TableConsent_Logs_Table=({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,refetch, setRefetch,setData,encryptionFlagCompData }: any)=>{
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps
  const {disable, setDisable} = useContext(TotalContext) as TotalContextProps
  const upId: string | any = getCookie('upId')
  let dfKey: string | any
  let dfdType : string | any
  const toast =useInfoMsg()
  const token: string | any = getCookie('token')
  const [open, setOpen] = React.useState(false);
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [columns,setColumns]=useState<any>([])
  const [allCode, setAllCode] = React.useState();
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const routes = useRouter()
  const [allData, setAllData] = React.useState([]);
  const [allDataObject, setAllDataObject] = React.useState([]);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [DFkeyAndRule, setDFkeyAndRule] = React.useState({
    isRulePresent:false,
    dfKey:"",
    dfdType:""
  })
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const {Consent_Logs_Table87d37, setConsent_Logs_Table87d37} = useContext(TotalContext) as TotalContextProps
  const {isConsent_Logs_Table87d37ContainValidataion, setConsent_Logs_Table87d37ContainValidataion} = useContext(TotalContext) as TotalContextProps;  
//another screen


  const GetTableDetails = async () => {
    let orchestrationBody : any = {
        key: 'CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Consents_Logs:AFVK:v1', 
        componentId: '6ec2dfdfe8384cafb6ea5d23b3087d37',
        isTable: true,
        from :"TableConsent Logs Table",
        accessProfile:accessProfile
    }
    if(encryptionFlagCont) {
    orchestrationBody["dpdKey"] = encryptionDpd
    orchestrationBody["method"] = encryptionMethod
    }
    const orchestrationData = await AxiosService.post(
      '/UF/Orchestration',
      orchestrationBody,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (orchestrationData?.data) {
      setAllCode(orchestrationData?.data?.code)
      if (orchestrationData?.data?.action) {
          if(orchestrationData?.data?.dfdNodeType=='apinode'){
          // for schema based column and type preparatiuon
          if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
            let altertColumns:any=[]
            let allSchemas:any[]=orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties
            defaultColumns.map((defaultRenderItem:any)=>{
              Object.keys(allSchemas).map((schemaItem:any)=>{
                if(defaultRenderItem.id==schemaItem)
                {
                  altertColumns.push({
                    ...defaultRenderItem,type:allSchemas[schemaItem].type.toLowerCase()=='string'?"text":allSchemas[schemaItem].type.toLowerCase()
                  })
                }
              })
            })
            if(Array.isArray(orchestrationData?.data?.security) )
            {
              let securityData=orchestrationData?.data?.security
              altertColumns=altertColumns.filter((item:any)=>{
                if(securityData.includes(item?.id))
                  return item
                })
            }
            setColumns(altertColumns) 
          }
        }
        else if(orchestrationData?.data?.dfdNodeType=='dbnode'){
          if(orchestrationData?.data?.schemaData[1]?.schema?.items?.properties){
            let altertColumns:any=[]
            let allSchemas:any[]=orchestrationData?.data?.schemaData[1]?.schema?.items?.properties
            defaultColumns.map((defaultRenderItem:any)=>{
              Object.keys(allSchemas).map((schemaItem:any)=>{
                if(defaultRenderItem.id==schemaItem)
                {
                  altertColumns.push({
                    ...defaultRenderItem,type:allSchemas[schemaItem].type.toLowerCase()=='string'?"text":allSchemas[schemaItem].type.toLowerCase()
                  })
                }
              })
            })
            if(Array.isArray(orchestrationData?.data?.security) )
            {
              let securityData=orchestrationData?.data?.security
              altertColumns=altertColumns.filter((item:any)=>{
                if(securityData.includes(item?.id))
                  return item
                })
            }
                        setColumns(altertColumns) 
          }
        }
        // for pagination data page ,count and dfkey
        setPaginationData((pre: any) => ({
          ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 0,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 0
        }))

        setDFkeyAndRule((pre:any)=>({
          ...pre,
            isRulePresent:Object.keys(orchestrationData?.data?.rule).length!=0 && orchestrationData?.data?.rule?.nodes?.length!=0 && orchestrationData?.data?.rule?.edges?.length!=0  ? true:false,
            dfKey:orchestrationData?.data?.dfKey||"",
            dfdType:orchestrationData?.data?.dfdNodeType


        }))

        dfKey = orchestrationData?.data?.dfKey
        dfdType = orchestrationData?.data?.dfdNodeType
        
        fetchData(orchestrationData?.data?.action?.pagination?.page,orchestrationData?.data?.action?.pagination?.count,{},{dfKey,dfdType},Object.keys(orchestrationData?.data?.rule).length!=0 && orchestrationData?.data?.rule?.nodes?.length!=0 && orchestrationData?.data?.rule?.edges?.length!=0  ? true:false)
      }
    }
  }

  const [SearchParams,setSearchParams] = useState<any>({})

    const setLockMode=(ids:any)=>{
      ///////////////////////////

  }
  const [selectedPaginationData, setSelectedPaginationData] = useState<any[]>(
      []
    )
  const [settings, setSettings] = useState<any>();
    

  const handleUpdate: PaginationProps['onUpdate'] = (page, pageSize) =>{
    setConsent_Logs_Table87d37ContainValidataion((pre:any)=>({...pre, selectedIds:[]}))
    let checkedData: any = selectedPaginationData
    if (checkedData.length) {
      for (let i = 0; i < checkedData.length; i++) {
        if (checkedData[i].page == page) {
          setConsent_Logs_Table87d37ContainValidataion((pre:any)=>({...pre, selectedIds:checkedData[i].data}))
        }
      }
    }
    setPaginationData(prevState => ({ ...prevState, page, pageSize }))
    fetchData(page, pageSize,{},DFkeyAndRule,DFkeyAndRule?.isRulePresent)
  }

  async function fetchData(page = 1, pageSize = 10, searchParams = {},dfKey:any,isRulePresent:any=false) {
    if(isRulePresent==undefined)
      isRulePresent=DFkeyAndRule?.isRulePresent||false

    let dstKey=dfKey?.dfKey
    dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    try {

      let te_refreshBody: te_refreshDto = {
        key: dfKey?.dfKey,
        upId: upId,
        refreshFlag: "Y"
      }
      if(encryptionFlagCont) {
      te_refreshBody["dpdKey"] = encryptionDpd
      te_refreshBody["method"] = encryptionMethod
      }
      const te_refresh: any = await AxiosService.post(
        '/te/eventEmitter',
        te_refreshBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (te_refresh?.data?.error == true) {
        toast(te_refresh?.data?.errorDetails?.message, 'danger')
        return
      }

      let api_pagination: any
      if (isRulePresent==false) {
        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          page: page,
          count: pageSize,
          searchFilter: searchParams
        }
        if(encryptionFlagCont) {
        api_paginationBody["dpdKey"] = encryptionDpd
        api_paginationBody["method"] = encryptionMethod
        }
        api_pagination = await AxiosService.post(
          '/UF/pagination',
          api_paginationBody,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (api_pagination?.data?.error == true) {
          toast(api_pagination?.data?.errorDetails?.message, 'danger')
          return
        }
        setAllData(api_pagination?.data?.records)
        setPaginationData(prevState => ({
          ...prevState,
          total: api_pagination.data.totalRecords
        }))
        if(api_pagination?.data?.records.length==0){ 
          setConsent_Logs_Table87d37([])
          setAllDataObject([])
          return
        }
      } else {
        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          page: page,
          count: pageSize,
          filterDetails: {
            ufKey:'CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Consents_Logs:AFVK:v1:UO', 
            nodeId: '6ec2dfdfe8384cafb6ea5d23b3087d37',
            elementId: '6ec2dfdfe8384cafb6ea5d23b3087d37'
          },
          searchFilter: searchParams
        }
        if(encryptionFlagCont) {
        api_paginationBody["dpdKey"] = encryptionDpd
        api_paginationBody["method"] = encryptionMethod
        }
        api_pagination = await AxiosService.post(
          '/UF/pagination',
          api_paginationBody,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (api_pagination?.data?.error == true) {
          toast(api_pagination?.data?.errorDetails?.message, 'danger')
          return
        }
        setAllData(api_pagination?.data?.records)
        setPaginationData(prevState => ({
          ...prevState,
          total: api_pagination.data.totalRecords
        }))
        if(api_pagination?.data?.records.length==0){ 
          setConsent_Logs_Table87d37([])
          setAllDataObject([])
          return
        }
      }
      if (api_pagination?.data?.records.length > 0) {
      const uf_paginationDataFilterBody: uf_paginationDataFilterDto = {
        data: api_pagination.data.records,
        key: 'CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Consents_Logs:AFVK:v1',
        "dfdType":dfKey?.dfdType
      }
      if(encryptionFlagCont) {
      uf_paginationDataFilterBody["dpdKey"] = encryptionDpd
      uf_paginationDataFilterBody["method"] = encryptionMethod
      }
      const uf_paginationDataFilter = await AxiosService.post(
        '/UF/PaginationDataFilter',
        uf_paginationDataFilterBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (uf_paginationDataFilter.data.length >= 0&&Array.isArray(uf_paginationDataFilter.data)) {
        let filtertedData:any=structuredClone(uf_paginationDataFilter.data)||[]
        setConsent_Logs_Table87d37(uf_paginationDataFilter.data||[])
        defaultColumns.map((items:any)=>{
          if(items?.isColourIndicator==true)
          {
            for(let i=0;i<filtertedData.length;i++){
              filtertedData[i]={...filtertedData[i],[items?.id]:colurIndicator(items?.colourIndicator,filtertedData[i][items?.id])}
            }
          }
        })
        for (let i = 0; i < filtertedData.length; i++) {     
          let JSONType:any=filtertedData[i] || {}
          Object.keys(JSONType).map((key: any) => {
              if(typeof JSONType[key] === 'object' && JSONType[key] !== null) {
                  JSONType[key] =  <JsonView
                    theme="atom"
                    enableClipboard={false}
                    src={JSONType[key]}
                    style={{ fontSize: "0.833vw" }}
                  />
              }
          })
          filtertedData[i] = JSONType
        }
        setAllDataObject(filtertedData)
        return
      }
      }
    } catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger')
    }
  }
  const RowAction = ({item,index}: RenderRowActionsProps<any>) => {
    let filteredData:any={}
    if(allData.length!=0)
    {
      filteredData=allData[index]||{}
    }
    return <React.Fragment>
       <div className="flex gap-2">
      </div>
    </React.Fragment>;
  };

  const colurIndicator = (keyValue:any=[], comingValue:any) => {

    let customeUI: JSX.Element | null = null;
    for (let i = 0; i < keyValue.length; i++) {
      if (keyValue[i]?.key == comingValue) {
        customeUI = (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: keyValue[i]?.colorCode }}
          />
        );
        break;
      }
    }

    return customeUI;
  };
  useEffect(() => {
    GetTableDetails()
  }, [refresh?.tableConsent_Logs_Table87d37])

  useEffect(() => {
    if(paginationData.page != 0 && paginationData.pageSize != 0)
      fetchData(paginationData.page , paginationData.pageSize,{},DFkeyAndRule,DFkeyAndRule?.isRulePresent)
    setConsent_Logs_Table87d37ContainValidataion((pre:any)=>({...pre, selectedIds:[]}))
    setSelectedPaginationData([])
    setAllDataObject([])
  }, [refetch])

  const handlePrimaryTable = () => {
    let findData = isConsent_Logs_Table87d37ContainValidataion.selectedIds[isConsent_Logs_Table87d37ContainValidataion.selectedIds.length-1]
    if(Array.isArray(Consent_Logs_Table87d37) && Consent_Logs_Table87d37.length>0)
    {
      let data = Consent_Logs_Table87d37[findData]
      setPrimaryTableData({
        ...primaryTableData,
        primaryKey: "id",
        value: data["id"],
        parentData: data
      })
    }
  }
  useEffect(() => {
    if (isConsent_Logs_Table87d37ContainValidataion.selectedIds.length != 0) handlePrimaryTable()
  }, [isConsent_Logs_Table87d37ContainValidataion.selectedIds])



  const getRowActions = () => {
  return [
    {
      text: 'Print',
      handler: () => {},
    },
    {
      text: 'Remove',
      handler: () => {},
      theme: 'danger',
    },
  ];
};


  if (hide.tableConsent_Logs_Table87d37) {
    return <></>
  }
  return(
    <div className="col-start-1 col-end-13 gap-10px">
      <Row space={3}>
        <Col>
          <Flex direction='column' >
            <MyTable
              data={Array.isArray(allDataObject) ? allDataObject : []}
              columns={columns}
              edgePadding={true}
              selectedIds={isConsent_Logs_Table87d37ContainValidataion.selectedIds}  
              onSelectionChange={setLockMode} 
              settings={settings}
              updateSettings={setSettings}
              renderRowActions={RowAction}
            
            />
              {paginationData?.page != null && paginationData?.pageSize != null && paginationData?.total != null && Array.isArray(allDataObject) && allDataObject.length>0 ?
              <Pagination
              className='flex w-full items-center justify-center'
              page={paginationData.page}
              pageSize={paginationData.pageSize}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              total={paginationData.total}
              onUpdate={handleUpdate}
              showInput={true}
              size='l'
            />:null}
          </Flex>
        </Col>
      </Row>
    </div>
  )
}
export default TableConsent_Logs_Table