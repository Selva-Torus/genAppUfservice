"use client"

import { TotalContext, TotalContextProps } from '@/app/globalContext'
import JsonView from "react18-json-view";
import 'react18-json-view/src/style.css'
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
import React, { useEffect, useState,useContext, useRef } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from "@/app/components/infoMsgHandler"
import { getCookie } from "@/app/components/cookieMgment"
import { nullFilter } from '@/app/utils/nullDataFilter';
import { codeExecution } from '@/app/utils/codeExecution'
import { uf_fetchActionDetailsDto,uf_fetchRuleDetailsDto,te_refreshDto,api_paginationDto,uf_paginationDataFilterDto } from '@/app/interfaces/interfaces';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import i18n from '@/app/components/i18n';
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
let colourIndicatorCols:any= [] ;
let defaultColumns = 
[
  {
    "id": "amount",
    "name": "amount",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "transaction_type",
    "name": "transaction_type",
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
const Tabletransactions=({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,refetch, setRefetch,setData,encryptionFlagCompData }: any)=>{

  const securityData:any={
  "Employee": {
    "allowedControls": [
      "transaction_id",
      "amount",
      "transaction_type"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "userTemplate": {
    "allowedControls": [
      "transaction_id",
      "amount",
      "transaction_type"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
}
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
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
  const keyset:any=i18n.keyset("language") 
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [DFkeyAndRule, setDFkeyAndRule] = React.useState({
    isRulePresent:false,
    dfKey:"",
    dfdType:""
  })
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
 /////////////
   //another screen
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps  
  const {transaction_idb85fc, settransaction_idb85fc}= useContext(TotalContext) as TotalContextProps  
  const {amount13d15, setamount13d15}= useContext(TotalContext) as TotalContextProps  
  const {transaction_type036bb, settransaction_type036bb}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const GetTableDetails = async () => {
    let altertColumns:any=[]
    defaultColumns.map((cols:any)=>{
      let temp:any = cols
      {
        if(securityData[accessProfile].allowedControls.includes(cols.id))
        {
          altertColumns.push(temp)
        }
      }
    })
    setColumns(altertColumns) 
    // for pagination data page ,count and dfkey
    setPaginationData((pre: any) => ({
      ...pre,
      page: 1,
      pageSize: 10
    }))

    setDFkeyAndRule((pre:any)=>({
      ...pre,
        isRulePresent:false,
        dfKey:"CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1:",
        dfdType:""
    }))

    dfKey = "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1:"
    dfdType =""
    
    fetchData(1,10,{},{dfKey,dfdType},false,false)
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
    settransactions10ab7Props((pre:any)=>({...pre, selectedIds:[]}))
    let checkedData: any = selectedPaginationData
    if (checkedData.length) {
      for (let i = 0; i < checkedData.length; i++) {
        if (checkedData[i].page == page) {
          settransactions10ab7Props((pre:any)=>({...pre, selectedIds:checkedData[i].data}))
        }
      }
    }
    setPaginationData(prevState => ({ ...prevState, page, pageSize }))
    fetchData(page, pageSize,{},DFkeyAndRule,DFkeyAndRule?.isRulePresent,false)
  }

  async function fetchData(page = 1, pageSize = 10, searchParams = {},dfKey:any,isRulePresent:any=false,isOnLoad = false) {
    if(isRulePresent==undefined)
      isRulePresent=DFkeyAndRule?.isRulePresent||false
 
    let dstKey=dfKey?.dfKey
    dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    try {

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
          settransactions10ab7([])
          setAllDataObject([])
          return
        }
      } else {
        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          page: page,
          count: pageSize,
          filterDetails: {
            ufKey:'CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:UO', 
            nodeId: '982f5bbc3d6d429196794e7d81f10ab7',
            elementId: '982f5bbc3d6d429196794e7d81f10ab7'
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
          settransactions10ab7([])
          setAllDataObject([])
          return
        }
      }
      if (api_pagination?.data?.records.length > 0) {
      const uf_paginationDataFilterBody: uf_paginationDataFilterDto = {
        data: api_pagination.data.records,
        key: 'CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1',
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
        settransactions10ab7(uf_paginationDataFilter.data||[])
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
              if(typeof JSONType[key] === 'object' && JSONType[key] !== null && !colourIndicatorCols?.includes(key)) {
                  JSONType[key] =  <JsonView
                    theme="atom"
                    enableClipboard={true}
                    src={JSONType[key]}
                    style={{ fontSize: "0.833vw" }}
                    collapsed={true}
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
  }, [])
  async function UpdatedDataHandle() { 
    let te_refreshBody: te_refreshDto = {
        key: DFkeyAndRule?.dfKey,
        upId: upId,
        refreshFlag: "Y",
        count:1000,
        page:1
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

    fetchData(paginationData.page , paginationData.pageSize,{},DFkeyAndRule,DFkeyAndRule?.isRulePresent,true)
  }
  useEffect(() => {
    if(paginationData?.page != 0 && paginationData?.pageSize != 0 && DFkeyAndRule?.dfKey!='')
        UpdatedDataHandle()
    settransactions10ab7Props((pre:any)=>({...pre, selectedIds:[]}))
    setSelectedPaginationData([])
    setAllDataObject([])
  }, [transactions10ab7Props?.refresh])

  const handlePrimaryTable = () => {
    let findData = transactions10ab7Props?.selectedIds[transactions10ab7Props?.selectedIds?.length-1]
    if(Array.isArray(transactions10ab7) && transactions10ab7.length>0)
    {
      let data = transactions10ab7[findData]
      setPrimaryTableData({
        ...primaryTableData,
        primaryKey: "transaction_id",
        value: data["transaction_id"],
        parentData: data
      })
    }
  }
  useEffect(() => {
    if (transactions10ab7Props?.selectedIds?.length != 0) handlePrimaryTable()
  }, [transactions10ab7Props?.selectedIds])



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


  if (transactions10ab7?.isHidden) {
    return <></>
  }
  const translatedColumns = columns.map((col:any) => ({
  ...col,
  name: keyset(col?.name), 
}));
  return(
    <div className="col-start-1 col-end-13 gap-10px">
      <Row space={3}>
        <Col>
          <Flex direction='column' >
            <MyTable
            className=""
              data={Array.isArray(allDataObject) ? allDataObject : []}
              columns={translatedColumns}
              edgePadding={true}
              selectedIds={transactions10ab7Props?.selectedIds}  
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
export default Tabletransactions