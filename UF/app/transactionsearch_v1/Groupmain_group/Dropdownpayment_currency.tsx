

'use client'
import React, { useState,useContext,useEffect,useRef } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation';
import UOmapperData from '@/context/dfdmapperContolnames.json'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getCookie } from '@/app/components/cookieMgment';
import { getDropdownDetailsNew } from '@/app/utils/getMapperDetails';
import { codeExecution } from '@/app/utils/codeExecution';
import { eventBus } from '@/app/eventBus';
import { Dropdown } from '@/components/Dropdown';
import { Text } from '@/components/Text';
import {Modal} from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getMapperDetailsDto,uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import * as v from 'valibot';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
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
let dfData:any;
let dfdFlag:boolean = false;
let getMapperDetailsBindValues:Record<string, any> ={} ;
const Dropdownpayment_currency = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: any) => {
  const token: string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {dfd_combocurrencysearch_v1Props, setdfd_combocurrencysearch_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const { validate, setValidate } = useContext(
    TotalContext
  ) as TotalContextProps
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const keyset:Function=i18n.keyset("language");
  const [initialCount,setInitialCount]=useState<number>(0)
  let getMapperDetails:string[];
  let getMapperDetailsValues:string[];
  const toast:Function=useInfoMsg();
  const routes: AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef<any>(false);
  const loadingMoreRef = useRef<boolean>(false);    
  const isUserSelectionRef = useRef<boolean>(false);
  const [isDropdownDataReady, setIsDropdownDataReady] = useState<boolean>(false);
  let customecode:string="";
  const [allCode,setAllCode]=useState<string>("");
  const [ruleCode,setRuleCode]=useState<string>("");  
  const [dropdownValue, setdropdownValue] = useState<string | string[]>("");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  let items:any = [];
  //showComponentAsPopup || showArtifactAsModal
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
  //////////////
  let getMapperDetailsBody: getMapperDetailsDto;
  const [payment_currencyOptions, setpayment_currencyOptions] = useState<string[]>([]);
  let category : string
  let bindtranValue:any;
  let code:any;
  let getSourceFilterColumn:string = "";
  let copySourceFilterColumn:string = "";
  category = "";

  const getDropdownData = async(value?:any, page: number = 1, skipAutoSet: boolean = false)=>{
    let mapperValue: string =  `currency_desc`
    let mapperText: string =  `currency_code`
    bindtranValue = value;
    let searchFilterData: Record<string, any> ={};
    let dstKey:string = "";
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transactionSearch:AFVK:v1",
        componentId: "526f0e58d5454270aca67c481a99066f",
        controlId: "6467c1c317e34e8fa69079e3b48703d2",
        isTable: false,
        accessProfile:accessProfile,
        from:"dropdown"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if(orchestrationData?.data?.code)
    {
      setAllCode(orchestrationData?.data?.code)
    }
    if(dfd_combocurrencysearch_v1Props.dstKey){
      dstKey = dfd_combocurrencysearch_v1Props.dstKey
    }else{
      dstKey=orchestrationData?.data?.dfdKey?.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    }
    if (!value && "hasLogicCenter" in dfd_combocurrencysearch_v1Props && !dfd_combocurrencysearch_v1Props.hasLogicCenter && !dfdFlag) {
    const api_paginationData:any = await AxiosService.post(
      '/UF/pagination',
      {
        key:dstKey,
        page:page,
        count:PAGE_SIZE,
        searchFilter:searchFilterData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (api_paginationData?.data?.records.length === 0) {
      dfdFlag = true
    }
    if (Array.isArray(dfData)) {
      dfData = [...dfData, ...api_paginationData?.data?.records];
    } else {
      dfData = api_paginationData?.data?.records;
    }
    }else if(!value && !dfdFlag){
    const api_paginationData:any = await AxiosService.post(
      '/UF/pagination',
      {
        key:dstKey,
        page:page,
        count:PAGE_SIZE,
        searchFilter:searchFilterData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (api_paginationData?.data?.records.length === 0) {
      dfdFlag = true
    }
    if (Array.isArray(dfData)) {
      dfData = [...dfData, ...api_paginationData?.data?.records];
    } else {
      dfData = api_paginationData?.data?.records;
    }
  }

  try{
    getMapperDetails = await getDropdownDetailsNew(dfData,mapperValue,mapperText, bindtranValue, code, getSourceFilterColumn,copySourceFilterColumn)
    getMapperDetailsValues = await getDropdownDetailsNew(dfData,mapperText,mapperValue, bindtranValue, code, getSourceFilterColumn,copySourceFilterColumn)
    if(!bindtranValue){
      getMapperDetails.map((item: any) => {
        getMapperDetailsBindValues[item] = getMapperDetailsValues[getMapperDetails.indexOf(item)];
      })
    }
    if(!value){
      let temp:any[] = getMapperDetails.filter((item:any, index:any) => getMapperDetails.indexOf(item) === index)
      temp = temp.filter((ele:any)=>ele)
      setpayment_currencyOptions(temp);
      if (dfData.length < PAGE_SIZE) setHasMore(false);
    }
    } catch (error) {
      console.error("Error fetching mapper details for dropdown:", error);
    }
  }

  const loadMore = async () => {
    if (!hasMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await getDropdownData(undefined, nextPage);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
  }


  useEffect(() => {
    setCurrentPage(currentPage);
    setHasMore(true);
    setIsDropdownDataReady(false);
    getDropdownData(undefined, currentPage).then(() => {
      setIsDropdownDataReady(true);
    });
  },[payment_currency703d2?.refresh])  

  const handlechange = async(value: any) => {
    isUserSelectionRef.current = true;
    if(value.length>0){
      await getDropdownData(value)
      setmain_group9066f((prev: any) => ({ ...prev, payment_currency: getMapperDetailsBindValues[value],payment_currency703d2: value,PAYMENT_CURRENCY: getMapperDetails }))
      setIsRequredData(false)
    }else{
      let temp:any = main_group9066f;
      delete temp.payment_currency;
      delete temp.PAYMENT_CURRENCY;
      delete temp.payment_currency703d2;
      setmain_group9066f(temp);
      getDropdownData(undefined, 1, true);
      setIsRequredData(true);
    }
     setError('')
    setValidate((pre:any)=>({...pre,transactionSearch_v1:{...pre?.transactionSearch_v1,payment_currency:undefined}}));
  };

    const fetchDropdownData = async()=>{
    if(main_group9066f.payment_currency){
      if(Array.isArray(dfd_combocurrencysearch_v1Props)){
        if(dfd_combocurrencysearch_v1Props?.find((item: any) => item.currency_code === main_group9066f.payment_currency)){
          setdropdownValue([dfd_combocurrencysearch_v1Props?.find((item: any) => item.currency_code === main_group9066f.payment_currency)?.currency_desc])
        }else{
          setdropdownValue([main_group9066f.payment_currency])
        }
      }else{
        let dstKey:string = dfd_combocurrencysearch_v1Props.dstKey;
        const api_paginationData:any = await AxiosService.post(
        '/UF/pagination',
        {
          key:dstKey,
          page:currentPage,
          count:PAGE_SIZE,
          searchFilter:{currency_code:main_group9066f.payment_currency}
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (api_paginationData?.data?.error == true) {
        toast(api_paginationData?.data?.errorDetails?.message, 'danger')
        return
      }
      if(api_paginationData?.data?.records?.find((item: any) => item.currency_code === main_group9066f.payment_currency)){
        setdropdownValue([api_paginationData?.data?.records?.find((item: any) => item.currency_code === main_group9066f.payment_currency)?.currency_desc ])
      }else{
        setdropdownValue([main_group9066f.payment_currency])
      }   
      }
    }
  }

  useEffect(() => {
    if (!isDropdownDataReady) return;
    if (isUserSelectionRef.current) {
      isUserSelectionRef.current = false;
      return;
    }
    fetchDropdownData();
  },[main_group9066f.payment_currency, isDropdownDataReady])

  useEffect(() => {
    if(Array.isArray(dfd_combocurrencysearch_v1Props) && dfd_combocurrencysearch_v1Props?.length == 1){
    // setmain_group9066f((pre:any)=>({...pre,payment_currency:dfd_combocurrencysearch_v1Props[0]?.payment_currency}))
    }
  },[dfd_combocurrencysearch_v1Props])

  const selected=useRef({})
  const handleClick=async(value?:any)=>{
    if (value.length > 0) {
      let temp:any=[];
      if(Array.isArray(value)){
        for( let val of value){
          if(Array.isArray(val)){
            temp.push(val)
          }else{
            temp.push(val)
          }        
        }
      }
      setmain_group9066f((prev: any) => ({ ...prev, payment_currency: getMapperDetailsBindValues[value]}))
         setIsRequredData(false)
    } else {
       setmain_group9066f((prev: any) => ({ ...prev, payment_currency: '', payment_currency703d2: '' }))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,transactionSearch_v1:{...pre?.transactionSearch_v1,payment_currency:undefined}}));
   
    //dynamic 
    let selectedObj=dfData?.find((items:any)=>(items?.currency_code==getMapperDetailsBindValues[value] && items?.currency_desc==value)) || {}
    selected.current={
      ...selectedObj||{},
      currency_desc:value,
      currency_code:getMapperDetailsBindValues[value]
    }
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}      
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
        codeStates['selected']  = selected
    codeExecution(customecode,codeStates)
    }
    if(value.length==0){ 
      return
    }
    try{
    setIsProcessing(true);
    let copyFormhandlerData :any = {}
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
   
  const { validateRefetch, setValidateRefetch } = useContext(
    TotalContext
  ) as TotalContextProps
  //validation
  let schemaArray = [] ;
  const handleBlur = async () => {
    //validation
  }

    useEffect(()=>{
        handleBlur()
    },[validateRefetch.value])

  useEffect(() => {
    if(initialCount!=0)
     setmain_group9066f((pre:any)=>({...pre,payment_currency:""}))
    else
      setInitialCount(1)
  },[payment_currency703d2?.refresh])

  if (payment_currency703d2?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `1 / 7`,
        gridRow: `29 / 47`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown   
        className=""    
        disabled= {payment_currency703d2?.isDisabled ? true : false}
        contentAlign={"center"}
        headerPosition='top'
        headerText={
          <>
            Payment Currency
            {isRequredData && <span style={{ color: 'red' }}> *</span>}
          </>
        }
        static={true}
        staticProps={payment_currencyOptions}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        placeholder={keyset("")} 
        filterable={true} 
        hasClear={true} 
        onChange={handlechange} 
        value={main_group9066f?.payment_currency703d2 ? [main_group9066f?.payment_currency703d2] : (main_group9066f?.payment_currency ? dropdownValue : [])}
        />
    </div>
  );
};

export default Dropdownpayment_currency;
