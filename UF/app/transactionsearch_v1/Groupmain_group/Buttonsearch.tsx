'use client'




import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import UOmapperData from '@/context/dfdmapperContolnames.json';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable  from '@/app/utils/evaluateDecisionTable';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { getGridPositionFromOrder } from '@/app/utils/getGridPositionFromOrder';
import { Scan } from '@/app/utils/scanService';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { XMLParser } from 'fast-xml-parser'

    

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
 

const Buttonsearch = ({ lockedData, setLockedData, tableData, setTableData, primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: { lockedData:any,setLockedData:any,tableData:any,setTableData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any,controlData:any}) => {
  const token:string = getCookie('token');
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const decodedTokenObj:any = decodeToken(token);
  const createdBy : string = decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();

  let code:string = "";
  const prevRefreshRef = useRef(false);
  const [ruleData,setRulseData]=useState<any>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const savedData=useRef<Record<string, any>>({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast : Function=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState<boolean>(true);
  const [styleSate, setStyleSate] = useState<any>({})
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState<boolean>(false);
  const routes : AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData : any = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<string>("");
  const [gridPosition, setGridPosition] = useState<any>({ gridColumn: '1 / 3', gridRow: '1 / 12' });
  ////showComponentAsPopup || showArtifactAsModal
    
 /////////////
   //another screen

  const {main_group9066f, setmain_group9066f}= useContext(TotalContext) as TotalContextProps;
  const {main_group9066fProps, setmain_group9066fProps}= useContext(TotalContext) as TotalContextProps;
  const {search_label27572, setsearch_label27572}= useContext(TotalContext) as TotalContextProps;
  const {trs_created_date2cea8, settrs_created_date2cea8}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account_no963e4, setdebtor_account_no963e4}= useContext(TotalContext) as TotalContextProps;
  const {debtor_namee2d9f, setdebtor_namee2d9f}= useContext(TotalContext) as TotalContextProps;
  const {creditor_account_noca692, setcreditor_account_noca692}= useContext(TotalContext) as TotalContextProps;
  const {payment_currency703d2, setpayment_currency703d2}= useContext(TotalContext) as TotalContextProps;
  const {payment_amount042b1, setpayment_amount042b1}= useContext(TotalContext) as TotalContextProps;
  const {uuid29c9f, setuuid29c9f}= useContext(TotalContext) as TotalContextProps;
  const {status4bd75, setstatus4bd75}= useContext(TotalContext) as TotalContextProps;
  const {search0e695, setsearch0e695}= useContext(TotalContext) as TotalContextProps;
  const {cleareddfa, setcleareddfa}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87, setview_all_tablec9e87}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87Props, setview_all_tablec9e87Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  // keep update group state in ref to access latest state value
  const main_group9066fRef = useRef(main_group9066f);
  useEffect(() => {
    main_group9066fRef.current = main_group9066f;
  }, [main_group9066f]);
  
  //group props in ref to access latest props value
  const main_group9066fPropsRef = useRef(main_group9066fProps);
  useEffect(() => {
    main_group9066fPropsRef.current = main_group9066fProps;
  }, [main_group9066fProps]);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
        codeStates['main_group'] = main_group9066f,
        codeStates['setmain_group'] = setmain_group9066f,
        codeStates['main_group9066f'] = main_group9066fProps,
        codeStates['setmain_group9066f'] = setmain_group9066fProps,
        codeStates['search_label'] = search_label27572,
        codeStates['setsearch_label'] = setsearch_label27572,
        codeStates['trs_created_date'] = trs_created_date2cea8,
        codeStates['settrs_created_date'] = settrs_created_date2cea8,
        codeStates['debtor_account_no'] = debtor_account_no963e4,
        codeStates['setdebtor_account_no'] = setdebtor_account_no963e4,
        codeStates['debtor_name'] = debtor_namee2d9f,
        codeStates['setdebtor_name'] = setdebtor_namee2d9f,
        codeStates['creditor_account_no'] = creditor_account_noca692,
        codeStates['setcreditor_account_no'] = setcreditor_account_noca692,
        codeStates['payment_currency'] = payment_currency703d2,
        codeStates['setpayment_currency'] = setpayment_currency703d2,
        codeStates['payment_amount'] = payment_amount042b1,
        codeStates['setpayment_amount'] = setpayment_amount042b1,
        codeStates['uuid'] = uuid29c9f,
        codeStates['setuuid'] = setuuid29c9f,
        codeStates['status'] = status4bd75,
        codeStates['setstatus'] = setstatus4bd75,
        codeStates['search'] = search0e695,
        codeStates['setsearch'] = setsearch0e695,
        codeStates['clear'] = cleareddfa,
        codeStates['setclear'] = setcleareddfa,
        codeStates['view_all_table'] = view_all_tablec9e87,
        codeStates['setview_all_table'] = setview_all_tablec9e87,
        codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
        codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
        codeStates['failure_queue_table'] = failure_queue_tablea476f,
        codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
        codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
        codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
        codeStates['success_queue_table'] = success_queue_table63aae,
        codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
        codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
        codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
        codeStates['return_queue_table'] = return_queue_table267f0,
        codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
        codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
        codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const {transactionsearch_v1, settransactionsearch_v1} = useContext(TotalContext) as TotalContextProps;
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "526f0e58d5454270aca67c481a99066f",
        "b7e783cb935e4e2c99233c9b3460e695"
      );
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
      setPaginationData((pre: any) => ({
      ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 1,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 1000
    }))

    /////////
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "search0e695") {
        handleClick();
      }
    });
  },[currentToken,memoryVariables])

  useEffect(()=>{
  },[search0e695?.refresh])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans : any[] = [];
    let id : string = "";
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }

//setSearchFilters
async function handleSearch0() {
  let mainData: any =  nullFilter(structuredClone(main_group9066f));
  let temp: any = {}
  main_group9066fProps?.needToSpread?.map((keys:any)=>{
    delete mainData?.[keys]
  })
  Object.keys(mainData)?.forEach(key => {
    temp[key] = key
  })
  let filterProps:any=[]
   let spreadedValues:any = [ 
      {
        "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
        nodeBasedData: [                          {
                            "nodeId":"c2a320f6a30140a487ed20c46f1763dd",
                            "object":{
                              ...temp
                            }
                          },
                    ]
      },
  ]
  let originalFiltervalues:any = [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.trs_created_date": "acf1d258656b47358f9b6d8a5a12cea8",
          "properties.dr_account": "f2138b56e9f04f25b97ae414d73963e4",
          "properties.dr_name": "02ea918896784a32a595a828d70e2d9f",
          "properties.cr_account": "33aedd45e57047308cb6e699151ca692",
          "properties.dr_currency": "6467c1c317e34e8fa69079e3b48703d2",
          "properties.dr_amount": "9a3236945d3940fa946c124e7c7042b1",
          "properties.parent_vgphstm_uuid": "145647b72a0f4d5baea6bcf29cb29c9f"
        }
      }
    ]
  }
];
  
  if(main_group9066fProps?.needToSpread?.length){
    filterProps = spreadedValues;
  }else{
    filterProps = originalFiltervalues;
  }
  let filterData = await getFilterProps(filterProps, mainData);
  if(Object.keys(mainData).length>0) { 
    filterData = filterData.map((item:any) => {
      const { DFDkey, ...rest } = item;
      return rest;
    });
  } else {
    filterData = [];
  }
  filterData=nullFilter(filterData)
  let te_refreshBody: te_refreshDto = {
    key: filterProps[0].key + ":",
    upId: '',
    refreshFlag: 'Y',
    filterData: filterData,
    count:paginationData.pageSize,
    page:paginationData.page
  }
  if (encryptionFlagCont) {
    te_refreshBody['dpdKey'] = encryptionDpd
    te_refreshBody['method'] = encryptionMethod
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
if(te_refresh.data.dataset=== "Bulk Data Processing"){
      const paginationFilterData = filterData.reduce((acc: any, item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'nodeId' && item[key] !== undefined) {
          acc[key] = item[key]
        }
      })
      return acc
    }, {})

    const { filterData: _, key, ...restBody } = te_refreshBody
    const paginationBody = {
      ...restBody,
      key: key
        ?.replace(':AFC:', ':AFCP:')
        .replace(':AF:', ':AFP:')
        .replace(':DF-DFD:', ':DF-DST:'),
      searchFilter: paginationFilterData
    }

    const pagination = await AxiosService.post(
      '/UF/pagination',
      paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  }
  setview_all_tablec9e87Props((prev: any) => {
    const existingFilters = prev.filterProps ?? [];
    const mergedFilters: any[] = [];
    
    const allFilters : any[] = [...existingFilters, ...filterData];
    const groupedByNodeId : any = allFilters.reduce((acc: any, item: any) => {
      const nodeId = item.nodeId;
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      Object.assign(acc[nodeId], item);
      return acc;
    }, {});
    
    const mergedData : any = Object.values(groupedByNodeId);
      return { ...prev, filterProps: mergedData };
  });
  }
//setSearchFilters
async function handleSearch1() {
  let mainData: any =  nullFilter(structuredClone(main_group9066f));
  let temp: any = {}
  main_group9066fProps?.needToSpread?.map((keys:any)=>{
    delete mainData?.[keys]
  })
  Object.keys(mainData)?.forEach(key => {
    temp[key] = key
  })
  let filterProps:any=[]
   let spreadedValues:any = [ 
      {
        "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
        nodeBasedData: [                          {
                            "nodeId":"c2a320f6a30140a487ed20c46f1763dd",
                            "object":{
                              ...temp
                            }
                          },
                    ]
      },
  ]
  let originalFiltervalues:any = [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.trs_created_date": "acf1d258656b47358f9b6d8a5a12cea8",
          "properties.dr_account": "f2138b56e9f04f25b97ae414d73963e4",
          "properties.dr_name": "02ea918896784a32a595a828d70e2d9f",
          "properties.cr_account": "33aedd45e57047308cb6e699151ca692",
          "properties.dr_currency": "6467c1c317e34e8fa69079e3b48703d2",
          "properties.dr_amount": "9a3236945d3940fa946c124e7c7042b1",
          "properties.parent_vgphstm_uuid": "145647b72a0f4d5baea6bcf29cb29c9f"
        }
      }
    ]
  }
];
  
  if(main_group9066fProps?.needToSpread?.length){
    filterProps = spreadedValues;
  }else{
    filterProps = originalFiltervalues;
  }
  let filterData = await getFilterProps(filterProps, mainData);
  if(Object.keys(mainData).length>0) { 
    filterData = filterData.map((item:any) => {
      const { DFDkey, ...rest } = item;
      return rest;
    });
  } else {
    filterData = [];
  }
  filterData=nullFilter(filterData)
  let te_refreshBody: te_refreshDto = {
    key: filterProps[0].key + ":",
    upId: '',
    refreshFlag: 'Y',
    filterData: filterData,
    count:paginationData.pageSize,
    page:paginationData.page
  }
  if (encryptionFlagCont) {
    te_refreshBody['dpdKey'] = encryptionDpd
    te_refreshBody['method'] = encryptionMethod
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
if(te_refresh.data.dataset=== "Bulk Data Processing"){
      const paginationFilterData = filterData.reduce((acc: any, item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'nodeId' && item[key] !== undefined) {
          acc[key] = item[key]
        }
      })
      return acc
    }, {})

    const { filterData: _, key, ...restBody } = te_refreshBody
    const paginationBody = {
      ...restBody,
      key: key
        ?.replace(':AFC:', ':AFCP:')
        .replace(':AF:', ':AFP:')
        .replace(':DF-DFD:', ':DF-DST:'),
      searchFilter: paginationFilterData
    }

    const pagination = await AxiosService.post(
      '/UF/pagination',
      paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  }
  setfailure_queue_tablea476fProps((prev: any) => {
    const existingFilters = prev.filterProps ?? [];
    const mergedFilters: any[] = [];
    
    const allFilters : any[] = [...existingFilters, ...filterData];
    const groupedByNodeId : any = allFilters.reduce((acc: any, item: any) => {
      const nodeId = item.nodeId;
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      Object.assign(acc[nodeId], item);
      return acc;
    }, {});
    
    const mergedData : any = Object.values(groupedByNodeId);
      return { ...prev, filterProps: mergedData };
  });
  }
//setSearchFilters
async function handleSearch2() {
  let mainData: any =  nullFilter(structuredClone(main_group9066f));
  let temp: any = {}
  main_group9066fProps?.needToSpread?.map((keys:any)=>{
    delete mainData?.[keys]
  })
  Object.keys(mainData)?.forEach(key => {
    temp[key] = key
  })
  let filterProps:any=[]
   let spreadedValues:any = [ 
      {
        "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
        nodeBasedData: [                          {
                            "nodeId":"c2a320f6a30140a487ed20c46f1763dd",
                            "object":{
                              ...temp
                            }
                          },
                    ]
      },
  ]
  let originalFiltervalues:any = [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.trs_created_date": "acf1d258656b47358f9b6d8a5a12cea8",
          "properties.dr_account": "f2138b56e9f04f25b97ae414d73963e4",
          "properties.dr_name": "02ea918896784a32a595a828d70e2d9f",
          "properties.cr_account": "33aedd45e57047308cb6e699151ca692",
          "properties.dr_currency": "6467c1c317e34e8fa69079e3b48703d2",
          "properties.dr_amount": "9a3236945d3940fa946c124e7c7042b1",
          "properties.parent_vgphstm_uuid": "145647b72a0f4d5baea6bcf29cb29c9f"
        }
      }
    ]
  }
];
  
  if(main_group9066fProps?.needToSpread?.length){
    filterProps = spreadedValues;
  }else{
    filterProps = originalFiltervalues;
  }
  let filterData = await getFilterProps(filterProps, mainData);
  if(Object.keys(mainData).length>0) { 
    filterData = filterData.map((item:any) => {
      const { DFDkey, ...rest } = item;
      return rest;
    });
  } else {
    filterData = [];
  }
  filterData=nullFilter(filterData)
  let te_refreshBody: te_refreshDto = {
    key: filterProps[0].key + ":",
    upId: '',
    refreshFlag: 'Y',
    filterData: filterData,
    count:paginationData.pageSize,
    page:paginationData.page
  }
  if (encryptionFlagCont) {
    te_refreshBody['dpdKey'] = encryptionDpd
    te_refreshBody['method'] = encryptionMethod
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
if(te_refresh.data.dataset=== "Bulk Data Processing"){
      const paginationFilterData = filterData.reduce((acc: any, item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'nodeId' && item[key] !== undefined) {
          acc[key] = item[key]
        }
      })
      return acc
    }, {})

    const { filterData: _, key, ...restBody } = te_refreshBody
    const paginationBody = {
      ...restBody,
      key: key
        ?.replace(':AFC:', ':AFCP:')
        .replace(':AF:', ':AFP:')
        .replace(':DF-DFD:', ':DF-DST:'),
      searchFilter: paginationFilterData
    }

    const pagination = await AxiosService.post(
      '/UF/pagination',
      paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  }
  setsuccess_queue_table63aaeProps((prev: any) => {
    const existingFilters = prev.filterProps ?? [];
    const mergedFilters: any[] = [];
    
    const allFilters : any[] = [...existingFilters, ...filterData];
    const groupedByNodeId : any = allFilters.reduce((acc: any, item: any) => {
      const nodeId = item.nodeId;
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      Object.assign(acc[nodeId], item);
      return acc;
    }, {});
    
    const mergedData : any = Object.values(groupedByNodeId);
      return { ...prev, filterProps: mergedData };
  });
  }
//setSearchFilters
async function handleSearch3() {
  let mainData: any =  nullFilter(structuredClone(main_group9066f));
  let temp: any = {}
  main_group9066fProps?.needToSpread?.map((keys:any)=>{
    delete mainData?.[keys]
  })
  Object.keys(mainData)?.forEach(key => {
    temp[key] = key
  })
  let filterProps:any=[]
   let spreadedValues:any = [ 
      {
        "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
        nodeBasedData: [                          {
                            "nodeId":"c2a320f6a30140a487ed20c46f1763dd",
                            "object":{
                              ...temp
                            }
                          },
                    ]
      },
  ]
  let originalFiltervalues:any = [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.trs_created_date": "acf1d258656b47358f9b6d8a5a12cea8",
          "properties.dr_account": "f2138b56e9f04f25b97ae414d73963e4",
          "properties.dr_name": "02ea918896784a32a595a828d70e2d9f",
          "properties.cr_account": "33aedd45e57047308cb6e699151ca692",
          "properties.dr_currency": "6467c1c317e34e8fa69079e3b48703d2",
          "properties.dr_amount": "9a3236945d3940fa946c124e7c7042b1",
          "properties.parent_vgphstm_uuid": "145647b72a0f4d5baea6bcf29cb29c9f"
        }
      }
    ]
  }
];
  
  if(main_group9066fProps?.needToSpread?.length){
    filterProps = spreadedValues;
  }else{
    filterProps = originalFiltervalues;
  }
  let filterData = await getFilterProps(filterProps, mainData);
  if(Object.keys(mainData).length>0) { 
    filterData = filterData.map((item:any) => {
      const { DFDkey, ...rest } = item;
      return rest;
    });
  } else {
    filterData = [];
  }
  filterData=nullFilter(filterData)
  let te_refreshBody: te_refreshDto = {
    key: filterProps[0].key + ":",
    upId: '',
    refreshFlag: 'Y',
    filterData: filterData,
    count:paginationData.pageSize,
    page:paginationData.page
  }
  if (encryptionFlagCont) {
    te_refreshBody['dpdKey'] = encryptionDpd
    te_refreshBody['method'] = encryptionMethod
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
if(te_refresh.data.dataset=== "Bulk Data Processing"){
      const paginationFilterData = filterData.reduce((acc: any, item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'nodeId' && item[key] !== undefined) {
          acc[key] = item[key]
        }
      })
      return acc
    }, {})

    const { filterData: _, key, ...restBody } = te_refreshBody
    const paginationBody = {
      ...restBody,
      key: key
        ?.replace(':AFC:', ':AFCP:')
        .replace(':AF:', ':AFP:')
        .replace(':DF-DFD:', ':DF-DST:'),
      searchFilter: paginationFilterData
    }

    const pagination = await AxiosService.post(
      '/UF/pagination',
      paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
  }
  setreturn_queue_table267f0Props((prev: any) => {
    const existingFilters = prev.filterProps ?? [];
    const mergedFilters: any[] = [];
    
    const allFilters : any[] = [...existingFilters, ...filterData];
    const groupedByNodeId : any = allFilters.reduce((acc: any, item: any) => {
      const nodeId = item.nodeId;
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      Object.assign(acc[nodeId], item);
      return acc;
    }, {});
    
    const mergedData : any = Object.values(groupedByNodeId);
      return { ...prev, filterProps: mergedData };
  });
  }
  ///////////////
  const handleClick=async()=>{
    try{  
      setIsProcessing(true);
      setmain_group9066f((prev: any) => ({ ...prev, search: true }));
      await  handleSearch0();
      await  handleSearch1();
      await  handleSearch2();
      await  handleSearch3();
        //onClick

      await handleCustomCode();
    }catch (err: any) {
      setIsProcessing(false);
      setmain_group9066f((prev: any) => ({ ...prev, search: false }));
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }finally{
      setIsProcessing(false);
      setmain_group9066f((prev: any) => ({ ...prev, search: false }));
    }
  }
    async function handleConfirmOnClick(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    } 


    async function handleConfirmOnCancel(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    }

 if (search0e695?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{gridColumn: `19 / 22`,gridRow: `49 / 59`, gap:``, height: `100%`, overflow: 'auto'}} 
      >
        {showFlag && <Button 
          ref={buttonRef}
          className="   "
          onClick={handleClick}
          view='action'
          disabled= {search0e695?.isDisabled ? true : false}
          pin='brick-brick'
          contentAlign={"center"}
        >
          {keyset("Search")}
        </Button>}
      </div>
    
  )
}

export default Buttonsearch

