'use client'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import JsonView from "react18-json-view";
import 'react18-json-view/src/style.css';
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
} from '@gravity-ui/uikit';
import { DatePicker } from '@gravity-ui/date-components';
import React, { useEffect, useState,useContext, useRef, useImperativeHandle } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { nullFilter } from '@/app/utils/nullDataFilter';
import { codeExecution } from '@/app/utils/codeExecution'
import { uf_fetchActionDetailsDto,uf_fetchRuleDetailsDto,te_refreshDto,api_paginationDto,uf_paginationDataFilterDto } from '@/app/interfaces/interfaces';
import { useRouter } from 'next/navigation';
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import i18n from '@/app/components/i18n';

import { Pagination, PaginationProps} from '@gravity-ui/uikit'


const MyTable: React.ComponentType<
  TableProps<TableDataItem> &
      WithTableSettingsProps &
    WithTableSelectionProps<TableDataItem> &
    WithTableActionsProps<TableDataItem>|any
> =
  withTableSettings
(
  withTableSorting(
      withTableSelection
  (withTableActions(Table)))
)
let colourIndicatorCols:any= [] ;
let defaultColumns = [
  {
    "id": "name",
    "name": "name",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "age",
    "name": "age",
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
let mapperData:any;
let schemaDataDFO:any;

const Tablemytable = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,refetch, setRefetch,setData,encryptionFlagCompData,paginationDetails,open, setOpen, ref }: any)=>{
  const token: string | any = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [translatedColumns,setTranslatedColumns]= useState<any>([])
  const securityData:any={
  "User": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Manager": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Employee": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "user": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
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
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const keyset:any=i18n.keyset("language")   
    const [needLockingAndRule, setNeedLockingAndRule] = useState({
      lockMode: 'Single',
      ttl: ''
    })
  const [DFkeyAndRule, setDFkeyAndRule] = React.useState({
    isRulePresent:false,
    dfKey:"",
    dfdType:""
  })  
 /////////////
   //another screen
  const {groupe162d, setgroupe162d}= useContext(TotalContext) as TotalContextProps  
  const {groupe162dProps, setgroupe162dProps}= useContext(TotalContext) as TotalContextProps  
  const {mytabled34a7, setmytabled34a7}= useContext(TotalContext) as TotalContextProps  
  const {mytabled34a7Props, setmytabled34a7Props}= useContext(TotalContext) as TotalContextProps  
  const {tabledata_id59734, settabledata_id59734}= useContext(TotalContext) as TotalContextProps  
  const {name067a9, setname067a9}= useContext(TotalContext) as TotalContextProps  
  const {agec2723, setagec2723}= useContext(TotalContext) as TotalContextProps  
  const {group23b6cd, setgroup23b6cd}= useContext(TotalContext) as TotalContextProps  
  const {group23b6cdProps, setgroup23b6cdProps}= useContext(TotalContext) as TotalContextProps  
  //////////////

  function getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  // Utility to get nested value
  function getValueByPathForNested(obj: any, path: string): any {
    const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    return keys.reduce((acc, key) => acc?.[key], obj);
  }

  // Clean the mapper path
  function extractPath(sourcekey: string): string {
    const rawPath = sourcekey.split('|').pop() ?? '';
    // remove items.properties. since your actual data has direct keys
    return rawPath
      .replace(/items\.properties\./g, '')
      .replace(/items\./g, '')
      .replace(/properties\./g, '');
  }

  const GetTableDetails = async () => {
    const orchestrationData = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: 'CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1', 
        componentId: '3e5f865971d84ca689ff416eff8d34a7',
        isTable: true,
        from :"Tablemytable",
        accessProfile:accessProfile
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (orchestrationData?.data) {
      mapperData = orchestrationData?.data?.mapper;
      schemaDataDFO = orchestrationData?.data?.schemaData;
      setAllCode(orchestrationData?.data?.code)
      if (orchestrationData?.data?.action) {
        let schemaData:any = {}
        if(orchestrationData?.data?.schemaData && orchestrationData?.data?.mappperNodeId)
        {
          orchestrationData?.data?.schemaData?.map((ele:any)=>{
            if(ele.nodeId==orchestrationData?.data?.mappperNodeId)
            {
              if (ele?.nodeType == 'datasetnode' || ele?.nodeType == 'datasetschemanode'){
              if (ele?.schema?.type == "object") {
                  schemaData = ele?.schema?.properties;
              }else if (ele?.schema?.type == "array") {
                  schemaData = ele?.schema?.items?.properties;
              }                            
              }else if (ele?.nodeType == 'apinode') {
              if (ele?.schema?.responses["200"].content["application/json"].schema?.type == "object") {
                  schemaData = ele?.schema?.responses["200"].content["application/json"].schema?.properties;
              }else if (ele?.schema?.responses["200"].content["application/json"].schema?.type == "array") {
                  schemaData = ele?.schema?.responses["200"].content["application/json"].schema?.items?.properties;
              }
              }else if (ele?.nodeType == 'dbnode') {
              let temp:any = {}
              ele?.schema.map((cols:any)=>{
                  temp[cols.name]={type:cols.type}
              })
              schemaData = temp;
              } 
            }
          })
          let altertColumns:any=[]
          let allowesColumns:any=[]
          if(Array.isArray(orchestrationData?.data?.security) )
          {
            let securityData=orchestrationData?.data?.security
            allowesColumns=defaultColumns.filter((item:any)=>{
              if(securityData.includes(item?.id))
                return item
              })
          }
          for (let i = 0; i < allowesColumns.length; i++) {
            for (let j = 0; j < mapperData.length; j++) {
              if (allowesColumns[i].id === mapperData[j]?.elementname.toLowerCase()) {
                let nodeId = mapperData[j]?.sourcekey.split("|")[1];
                let path = mapperData[j]?.sourcekey.split("|")[2];
                for (let k = 0; k < schemaDataDFO.length; k++) {
                  if (schemaDataDFO[k].nodeId === nodeId) {                    
                    altertColumns.push({...allowesColumns[i],type:getValueByPath(schemaDataDFO[k], path) || 'string'})
                  }                 
                }
              }
            }            
          }
          // allowesColumns.map((defaultRenderItem:any)=>{
          //   if(defaultRenderItem.id in schemaData)
          //   {
          //     altertColumns.push({...defaultRenderItem,type:schemaData[defaultRenderItem.id].type || 'string'})
          //   }
          // })

          altertColumns=altertColumns.filter((ele:any)=>ele?.type!= '__ActionDetails__')
          const translatedColumnsData = altertColumns.map((col:any) => ({
            ...col,
            name: keyset(col?.name), 
            }));
          setTranslatedColumns(translatedColumnsData)
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
        
        // for locking data ttl ,mode and rule
        setNeedLockingAndRule((pre: any) => ({
          ...pre,
          lockMode:orchestrationData?.data?.action?.lock?.lockMode || "",
          ttl :orchestrationData?.data?.action?.lock?.ttl || ""
        }))
        
        fetchData(orchestrationData?.data?.action?.pagination?.page,orchestrationData?.data?.action?.pagination?.count,{},{dfKey,dfdType},Object.keys(orchestrationData?.data?.rule).length!=0 && orchestrationData?.data?.rule?.nodes?.length!=0 && orchestrationData?.data?.rule?.edges?.length!=0  ? true:false)
      }
    } 
  }
  const [SearchParams,setSearchParams] = useState<any>({})

  const setLockMode=async(ids:any)=>{
    /// setmytabled34a7Props
    let postIds: any = []
    let processIds: any = []
    let selectedData:any=[]
    if(needLockingAndRule.lockMode=='Single'){
      // its for ui level selected list show for single select
      if (ids.length == 0) {
        let keys:any
        keys={}       
        Object.keys(group23b6cd).map((item: any) => {
          keys[item] = null
        }) 
        setgroup23b6cd(keys)
        keys={}       
        Object.keys(group23b6cdProps?.presetValues).map((item: any) => {
          keys[item] = null
        }) 
        setgroup23b6cdProps((pre:any)=>({...pre.presetValues,...keys}))
        setmytabled34a7Props((pre:any)=>({...pre, selectedIds:[]}))
        setgroup23b6cd({})
        setgroup23b6cdProps({...group23b6cdProps,presetValues:{}})
        return
      }

      mytabled34a7.filter((item:any,id:number)=>{
        if (ids[ids.length - 1] == id.toString()){
          selectedData?.push(allData[id])
          postIds.push(item.tabledata_id)
          processIds.push(item?.trs_process_id)
        }
      })

      //////////
        setgroup23b6cd(allData[ids])
        setgroup23b6cdProps({...group23b6cdProps,presetValues:{}})
      //////////   
      setmytabled34a7Props((pre:any)=>({...pre, selectedIds:[ids[ids.length-1]]}))      
    }
    else if(needLockingAndRule.lockMode==='Multi'){
      // its for ui level selected list show for multi select
      mytabled34a7.filter((item:any,id:number)=>{
        if (ids.includes(id.toString())){
          selectedData?.push(allData[id])
          postIds.push(item.tabledata_id) 
          processIds.push(item?.trs_process_id)
        } 
      })
      setmytabled34a7Props((pre:any)=>({...pre, selectedIds:ids}))
    }
      setgroup23b6cd(selectedData[0]||{})
      setgroup23b6cdProps({...group23b6cdProps,presetValues:selectedData[0]||{}})
    let checkedData: any = selectedPaginationData
    if (checkedData.length) {
      let itsAlreadyThere: boolean = false
      selectedPaginationData.map((item: any) => {
        if (item.page == paginationData.page) {
          itsAlreadyThere = true
        }
      })
      if (itsAlreadyThere) {
        for (let i = 0; i < checkedData.length; i++) {
          if (checkedData[i].page == paginationData.page) {
            checkedData[i].data = ids
            break
          }
        }
      } else {
        checkedData = [
          ...checkedData,
          {
            page: paginationData.page,
            data: ids
          }
        ]
      }
    } else {
      checkedData.push({
        page: paginationData.page,
        data: ids
      })
    }
    setSelectedPaginationData(checkedData)

    setLockedData({
      ...lockedData,
      processIds: processIds,
      data:selectedData,
      primaryKeys: postIds,
      lockMode: needLockingAndRule,
      ttl: needLockingAndRule.ttl
    })

  }
  const [selectedPaginationData, setSelectedPaginationData] = useState<any[]>(
      []
    )
  const [settings, setSettings] = useState<any>();
  const handleUpdate: PaginationProps['onUpdate'] = (page, pageSize) =>{
    let searchParams:any = nullFilter(SearchParams);
    setmytabled34a7Props((pre:any)=>({...pre, selectedIds:[]}))
    let checkedData: any = selectedPaginationData
    if (checkedData.length) {
      for (let i = 0; i < checkedData.length; i++) {
        if (checkedData[i].page == page) {
          setmytabled34a7Props((pre:any)=>({...pre, selectedIds:checkedData[i].data}))
        }
      }
    }
    setPaginationData(prevState => ({ ...prevState, page, pageSize }))
    fetchData(page, pageSize,searchParams,DFkeyAndRule,DFkeyAndRule?.isRulePresent,false)
  }
  async function onSelectionChange(e:any) {
    }

  async function fetchData(page:any = 1, pageSize:any = 10, searchParams = {},dfKey:any,isRulePresent:any=false,isOnLoad = false) {
    if(isRulePresent==undefined)
      isRulePresent=DFkeyAndRule?.isRulePresent||false
 
    let dstKey=dfKey?.dfKey
    dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    try {

      let api_pagination: any
      if (isRulePresent==false) {
        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          page: parseInt(page),
          count: parseInt(pageSize),
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
        if (api_pagination.data.records.length == 0 && api_pagination.data.totalRecords != 0) {
          api_paginationBody.page =  page-1
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
        setAllData(api_pagination?.data?.records)
            setPaginationData(prevState => ({
          ...prevState,
          page: page-1,
          total: api_pagination.data.totalRecords
        }))
        }
        if(api_pagination?.data?.records.length==0){ 
          setmytabled34a7([])
          setAllDataObject([])
          return
        }
      } else {
        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          page: parseInt(page),
          count: parseInt(pageSize),
          filterDetails: {
            ufKey:'CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1:UO', 
            nodeId: '3e5f865971d84ca689ff416eff8d34a7',
            elementId: '3e5f865971d84ca689ff416eff8d34a7'
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
        if (api_pagination.data.records.length == 0 && api_pagination.data.totalRecords != 0) {
          api_paginationBody.page =  page-1
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
        setAllData(api_pagination?.data?.records)
            setPaginationData(prevState => ({
          ...prevState,
          page: page-1,
          total: api_pagination.data.totalRecords
        }))
        }
        if(api_pagination?.data?.records.length==0){ 
          setmytabled34a7([])
          setAllDataObject([])
          return
        }
      }
      
      if (api_pagination?.data?.records.length > 0) {
        const mappedResult: Record<string, any>[] = api_pagination?.data?.records.map((emp:any) => {
        const result: Record<string, any> = {};

        mapperData.forEach((m:any) => {
          const path = extractPath(m.sourcekey);
          const value = getValueByPathForNested(emp, path);
          result[m.elementname] = value;
        });

        result.trs_next_status = emp.trs_next_status;
        result.trs_status = emp.trs_status;
        result.trs_process_id = emp.trs_process_id;
        result.trs_access_profile = emp.trs_access_profile;
        result.trs_org_grp_code = emp.trs_org_grp_code;
        result.trs_org_code = emp.trs_org_code;
        result.trs_role_grp_code = emp.trs_role_grp_code;
        result.trs_role_code = emp.trs_role_code;
        result.trs_ps_grp_code = emp.trs_ps_grp_code;
        result.trs_ps_code = emp.trs_ps_code;

        return result;
        });
        let uf_paginationDataFilter: any = {};
        uf_paginationDataFilter["data"] = mappedResult;
      // const uf_paginationDataFilterBody: uf_paginationDataFilterDto = {
      //   data: api_pagination.data.records,
      //   key: 'CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1',
      //   "dfdType":dfKey?.dfdType,
      //   "primaryKey":"tabledata_id"
      // }
      // if(encryptionFlagCont) {
      // uf_paginationDataFilterBody["dpdKey"] = encryptionDpd
      // uf_paginationDataFilterBody["method"] = encryptionMethod
      // }
      // const uf_paginationDataFilter = await AxiosService.post(
      //   '/UF/PaginationDataFilter',
      //   uf_paginationDataFilterBody,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // )
      if (uf_paginationDataFilter.data.length >= 0&&Array.isArray(uf_paginationDataFilter.data)) {
        let filtertedData:any=structuredClone(uf_paginationDataFilter.data)||[]
        setmytabled34a7(uf_paginationDataFilter.data||[])
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
        count:paginationDetails.pageSize,
        page:paginationDetails.page
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
    setmytabled34a7Props((pre:any)=>({...pre, selectedIds:[]}))
    setSelectedPaginationData([])
    setAllDataObject([])
  }, [mytabled34a7Props?.refresh])


  const handlePrimaryTable = () => {
    let findData = mytabled34a7Props?.selectedIds[mytabled34a7Props?.selectedIds?.length-1]
    if(Array.isArray(mytabled34a7) && mytabled34a7.length>0)
    {
      let data = mytabled34a7[findData]
      setPrimaryTableData({
        ...primaryTableData,
        primaryKey: "tabledata_id",
        value: data["tabledata_id"],
        parentData: data
      })
    }
  }

  useEffect(() => {
    if (mytabled34a7Props?.selectedIds?.length != 0) handlePrimaryTable()
  }, [mytabled34a7Props?.selectedIds])


  async function handleConfirmOnSelectionChange(){
  } 

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



  if (mytabled34a7?.isHidden) {
    return <></>
  }
  return(
    <div className="col-start-1 col-end-13 gap-">
      <Row space={3}>
        <Col>
          <Flex direction='column' >
            <MyTable
            className=""
              data={Array.isArray(allDataObject) && translatedColumns?.length ? allDataObject : []}
              columns={translatedColumns}
              edgePadding={true}
              selectedIds={mytabled34a7Props?.selectedIds}  
              onSelectionChange={setLockMode} 
              settings={settings}
              updateSettings={setSettings}
              renderRowActions={RowAction}
              wordWrap={true}
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

export default Tablemytable
