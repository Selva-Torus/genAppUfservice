

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
import { nullFilter } from '@/app/utils/nullDataFilter';
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
const Dropdowncr_bank_code = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: any) => {
  const token: string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {dfd_crbankcodedropdowndfd_v1Props, setdfd_crbankcodedropdowndfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
  const {overallgroup01c61, setoverallgroup01c61}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup01c61Props, setoverallgroup01c61Props}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197, setcontrolgroupda197}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197Props, setcontrolgroupda197Props}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2, setcontrol_tab_groupbc3e2}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2Props, setcontrol_tab_groupbc3e2Props}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3e, setbutton_group74f3e}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3eProps, setbutton_group74f3eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aa, setrtgs_infofd0aa}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aaProps, setrtgs_infofd0aaProps}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54, setallcontrols71c54}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54Props, setallcontrols71c54Props}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607, setcommoninfof4607}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607Props, setcommoninfof4607Props}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198, setbasicinfo3d198}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198Props, setbasicinfo3d198Props}= useContext(TotalContext) as TotalContextProps;
  const {basic_info216f3, setbasic_info216f3}= useContext(TotalContext) as TotalContextProps;
  const {waive_charges929e5, setwaive_charges929e5}= useContext(TotalContext) as TotalContextProps;
  const {cr_accounta818b, setcr_accounta818b}= useContext(TotalContext) as TotalContextProps;
  const {cr_namea4b34, setcr_namea4b34}= useContext(TotalContext) as TotalContextProps;
  const {cr_bank_code8a2bc, setcr_bank_code8a2bc}= useContext(TotalContext) as TotalContextProps;
  const {cr_bank_name434eb, setcr_bank_name434eb}= useContext(TotalContext) as TotalContextProps;
  const {cr_bank_bic3d26f, setcr_bank_bic3d26f}= useContext(TotalContext) as TotalContextProps;
  const {forex_currency65e0b, setforex_currency65e0b}= useContext(TotalContext) as TotalContextProps;
  const {exchange_rate88caf, setexchange_rate88caf}= useContext(TotalContext) as TotalContextProps;
  const {rate_codee56ad, setrate_codee56ad}= useContext(TotalContext) as TotalContextProps;
  const {forex_amounta58a5, setforex_amounta58a5}= useContext(TotalContext) as TotalContextProps;
  const {base_amount3b226, setbase_amount3b226}= useContext(TotalContext) as TotalContextProps;
  const {rate_ref_no82399, setrate_ref_no82399}= useContext(TotalContext) as TotalContextProps;
  const {rate_cust_idad42a, setrate_cust_idad42a}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894, setadditionalinfod2894}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894Props, setadditionalinfod2894Props}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbd, setlistgroupdcdbd}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbdProps, setlistgroupdcdbdProps}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905, setlist_tab_groupd6905}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905Props, setlist_tab_groupd6905Props}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6e, setdocument_list38c6e}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6eProps, setdocument_list38c6eProps}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97, setdoclisttable56e97}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97Props, setdoclisttable56e97Props}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827, setvalidation_listae827}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827Props, setvalidation_listae827Props}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7, setvaldnlisttable17ec7}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7Props, setvaldnlisttable17ec7Props}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944, setcomment_list72944}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944Props, setcomment_list72944Props}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0e, setcmntlisttable02d0e}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0eProps, setcmntlisttable02d0eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19, setrtgs_lista0a19}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19Props, setrtgs_lista0a19Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8, setrtgs_list_grpcf7d8}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8Props, setrtgs_list_grpcf7d8Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6, setrtgs_list_table7b8d6}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6Props, setrtgs_list_table7b8d6Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1, setrtgs_list_tab_grp024e1}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1Props, setrtgs_list_tab_grp024e1Props}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06, setdocumnt_list03a06}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06Props, setdocumnt_list03a06Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593, setrtgs_list_doc_table_grp8a593}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593Props, setrtgs_list_doc_table_grp8a593Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bb, setrtgs_lst_doc_list_tablee57bb}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bbProps, setrtgs_lst_doc_list_tablee57bbProps}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14, setvalidtn_lista5b14}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14Props, setvalidtn_lista5b14Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569, setrtgs_list_validtn_list_grpc5569}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569Props, setrtgs_list_validtn_list_grpc5569Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42, setrtgs_list_validtn_table39a42}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42Props, setrtgs_list_validtn_table39a42Props}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbc, setcmnt_listebbbc}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbcProps, setcmnt_listebbbcProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728, setrtgs_list_cmnt_list_grpb5728}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728Props, setrtgs_list_cmnt_list_grpb5728Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716, setrtgs_list_cmnts_list15716}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716Props, setrtgs_list_cmnts_list15716Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  let getMapperDetailsBody: getMapperDetailsDto;
  const [cr_bank_codeOptions, setcr_bank_codeOptions] = useState<string[]>([]);
  let category : string
  let bindtranValue:any;
  let code:any;
  let getSourceFilterColumn:string = "";
  let copySourceFilterColumn:string = "";
  category = "";

  const getDropdownData = async(value?:any, page: number = 1, skipAutoSet: boolean = false)=>{
    let mapperValue: string =  `bank_name_withsort`
    let mapperText: string =  `bank_name_withsort`
    bindtranValue = value;
    let searchFilterData: Record<string, any> ={};
    let dstKey:string = "";
    const orchestrationData :any = getControlOrchestrationData(
      controlData,
      "409b134cde0449b5a031a7686df3d198",
      "d13bcca95ca04ab3a22ae22bcdf8a2bc"
    );
    if(orchestrationData?.data?.code)
    {
      setAllCode(orchestrationData?.data?.code)
    }
    if(dfd_crbankcodedropdowndfd_v1Props.dstKey){
      dstKey = dfd_crbankcodedropdowndfd_v1Props.dstKey
    }else{
      dstKey=orchestrationData?.data?.dfdKey?.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    }
    if (!value && "hasLogicCenter" in dfd_crbankcodedropdowndfd_v1Props && !dfd_crbankcodedropdowndfd_v1Props.hasLogicCenter && !dfdFlag) {
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
      temp = temp.filter((ele:any)=>ele);
      setcr_bank_codeOptions(temp);
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
  },[cr_bank_code8a2bc?.refresh])  

  const handlechange = async(value: any) => {
    isUserSelectionRef.current = true;
    if(value.length>0){
      await getDropdownData(value)
      setbasicinfo3d198((prev: any) => ({ ...prev, sort_code: getMapperDetailsBindValues[value],cr_bank_code8a2bc: value,SORT_CODE: getMapperDetails }))
      setIsRequredData(false)
    }else{
      let temp:any = basicinfo3d198;
      delete temp.sort_code;
      delete temp.SORT_CODE;
      delete temp.cr_bank_code8a2bc;
      setbasicinfo3d198(temp);
      getDropdownData(undefined, 1, true);
      setIsRequredData(true);
    }
     setError('')
    setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,sort_code:undefined}}));
    handleClick(value)
  };

    const fetchDropdownData = async()=>{
    if(basicinfo3d198.sort_code){
      if(Array.isArray(dfd_crbankcodedropdowndfd_v1Props)){
        if(dfd_crbankcodedropdowndfd_v1Props?.find((item: any) => item.bank_name_withsort === basicinfo3d198.sort_code)){
          setdropdownValue([dfd_crbankcodedropdowndfd_v1Props?.find((item: any) => item.bank_name_withsort === basicinfo3d198.sort_code)?.bank_name_withsort])
        }else{
          setdropdownValue([basicinfo3d198.sort_code])
        }
      }else{
        let dstKey:string = dfd_crbankcodedropdowndfd_v1Props.dstKey;
        const api_paginationData:any = await AxiosService.post(
        '/UF/pagination',
        {
          key:dstKey,
          page:currentPage,
          count:PAGE_SIZE,
          searchFilter:{bank_name_withsort:basicinfo3d198.sort_code}
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
      if(api_paginationData?.data?.records?.find((item: any) => item.bank_name_withsort === basicinfo3d198.sort_code)){
        setdropdownValue([api_paginationData?.data?.records?.find((item: any) => item.bank_name_withsort === basicinfo3d198.sort_code)?.bank_name_withsort ])
      }else{
        setdropdownValue([basicinfo3d198.sort_code])
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
  },[basicinfo3d198.sort_code, isDropdownDataReady])

  useEffect(() => {
    if(Array.isArray(dfd_crbankcodedropdowndfd_v1Props) && dfd_crbankcodedropdowndfd_v1Props?.length == 1){
    // setbasicinfo3d198((pre:any)=>({...pre,sort_code:dfd_crbankcodedropdowndfd_v1Props[0]?.sort_code}))
    }
  },[dfd_crbankcodedropdowndfd_v1Props])

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
      setbasicinfo3d198((prev: any) => ({ ...prev, sort_code: getMapperDetailsBindValues[value]}))
         setIsRequredData(false)
    } else {
       setbasicinfo3d198((prev: any) => ({ ...prev, sort_code: '', cr_bank_code8a2bc: '' }))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,sort_code:undefined}}));
   
    //dynamic 
    let selectedObj=dfData?.find((items:any)=>(items?.bank_name_withsort==getMapperDetailsBindValues[value] && items?.bank_name_withsort==value)) || {}
    selected.current={
      ...selectedObj||{},
      bank_name_withsort:value,
      bank_name_withsort:getMapperDetailsBindValues[value]
    }
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}      
        codeStates['overallgroup'] = overallgroup01c61,
        codeStates['setoverallgroup'] = setoverallgroup01c61,
        codeStates['overallgroup01c61'] = overallgroup01c61Props,
        codeStates['setoverallgroup01c61'] = setoverallgroup01c61Props,
        codeStates['controlgroup'] = controlgroupda197,
        codeStates['setcontrolgroup'] = setcontrolgroupda197,
        codeStates['controlgroupda197'] = controlgroupda197Props,
        codeStates['setcontrolgroupda197'] = setcontrolgroupda197Props,
        codeStates['control_tab_group'] = control_tab_groupbc3e2,
        codeStates['setcontrol_tab_group'] = setcontrol_tab_groupbc3e2,
        codeStates['control_tab_groupbc3e2'] = control_tab_groupbc3e2Props,
        codeStates['setcontrol_tab_groupbc3e2'] = setcontrol_tab_groupbc3e2Props,
        codeStates['button_group'] = button_group74f3e,
        codeStates['setbutton_group'] = setbutton_group74f3e,
        codeStates['button_group74f3e'] = button_group74f3eProps,
        codeStates['setbutton_group74f3e'] = setbutton_group74f3eProps,
        codeStates['rtgs_info'] = rtgs_infofd0aa,
        codeStates['setrtgs_info'] = setrtgs_infofd0aa,
        codeStates['rtgs_infofd0aa'] = rtgs_infofd0aaProps,
        codeStates['setrtgs_infofd0aa'] = setrtgs_infofd0aaProps,
        codeStates['allcontrols'] = allcontrols71c54,
        codeStates['setallcontrols'] = setallcontrols71c54,
        codeStates['allcontrols71c54'] = allcontrols71c54Props,
        codeStates['setallcontrols71c54'] = setallcontrols71c54Props,
        codeStates['commoninfo'] = commoninfof4607,
        codeStates['setcommoninfo'] = setcommoninfof4607,
        codeStates['commoninfof4607'] = commoninfof4607Props,
        codeStates['setcommoninfof4607'] = setcommoninfof4607Props,
        codeStates['basicinfo'] = basicinfo3d198,
        codeStates['setbasicinfo'] = setbasicinfo3d198,
        codeStates['basicinfo3d198'] = basicinfo3d198Props,
        codeStates['setbasicinfo3d198'] = setbasicinfo3d198Props,
        codeStates['basic_info'] = basic_info216f3,
        codeStates['setbasic_info'] = setbasic_info216f3,
        codeStates['waive_charges'] = waive_charges929e5,
        codeStates['setwaive_charges'] = setwaive_charges929e5,
        codeStates['cr_account'] = cr_accounta818b,
        codeStates['setcr_account'] = setcr_accounta818b,
        codeStates['cr_name'] = cr_namea4b34,
        codeStates['setcr_name'] = setcr_namea4b34,
        codeStates['cr_bank_code'] = cr_bank_code8a2bc,
        codeStates['setcr_bank_code'] = setcr_bank_code8a2bc,
        codeStates['cr_bank_name'] = cr_bank_name434eb,
        codeStates['setcr_bank_name'] = setcr_bank_name434eb,
        codeStates['cr_bank_bic'] = cr_bank_bic3d26f,
        codeStates['setcr_bank_bic'] = setcr_bank_bic3d26f,
        codeStates['forex_currency'] = forex_currency65e0b,
        codeStates['setforex_currency'] = setforex_currency65e0b,
        codeStates['exchange_rate'] = exchange_rate88caf,
        codeStates['setexchange_rate'] = setexchange_rate88caf,
        codeStates['rate_code'] = rate_codee56ad,
        codeStates['setrate_code'] = setrate_codee56ad,
        codeStates['forex_amount'] = forex_amounta58a5,
        codeStates['setforex_amount'] = setforex_amounta58a5,
        codeStates['base_amount'] = base_amount3b226,
        codeStates['setbase_amount'] = setbase_amount3b226,
        codeStates['rate_ref_no'] = rate_ref_no82399,
        codeStates['setrate_ref_no'] = setrate_ref_no82399,
        codeStates['rate_cust_id'] = rate_cust_idad42a,
        codeStates['setrate_cust_id'] = setrate_cust_idad42a,
        codeStates['additionalinfo'] = additionalinfod2894,
        codeStates['setadditionalinfo'] = setadditionalinfod2894,
        codeStates['additionalinfod2894'] = additionalinfod2894Props,
        codeStates['setadditionalinfod2894'] = setadditionalinfod2894Props,
        codeStates['listgroup'] = listgroupdcdbd,
        codeStates['setlistgroup'] = setlistgroupdcdbd,
        codeStates['listgroupdcdbd'] = listgroupdcdbdProps,
        codeStates['setlistgroupdcdbd'] = setlistgroupdcdbdProps,
        codeStates['list_tab_group'] = list_tab_groupd6905,
        codeStates['setlist_tab_group'] = setlist_tab_groupd6905,
        codeStates['list_tab_groupd6905'] = list_tab_groupd6905Props,
        codeStates['setlist_tab_groupd6905'] = setlist_tab_groupd6905Props,
        codeStates['document_list'] = document_list38c6e,
        codeStates['setdocument_list'] = setdocument_list38c6e,
        codeStates['document_list38c6e'] = document_list38c6eProps,
        codeStates['setdocument_list38c6e'] = setdocument_list38c6eProps,
        codeStates['doclisttable'] = doclisttable56e97,
        codeStates['setdoclisttable'] = setdoclisttable56e97,
        codeStates['doclisttable56e97'] = doclisttable56e97Props,
        codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
        codeStates['validation_list'] = validation_listae827,
        codeStates['setvalidation_list'] = setvalidation_listae827,
        codeStates['validation_listae827'] = validation_listae827Props,
        codeStates['setvalidation_listae827'] = setvalidation_listae827Props,
        codeStates['valdnlisttable'] = valdnlisttable17ec7,
        codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
        codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
        codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
        codeStates['comment_list'] = comment_list72944,
        codeStates['setcomment_list'] = setcomment_list72944,
        codeStates['comment_list72944'] = comment_list72944Props,
        codeStates['setcomment_list72944'] = setcomment_list72944Props,
        codeStates['cmntlisttable'] = cmntlisttable02d0e,
        codeStates['setcmntlisttable'] = setcmntlisttable02d0e,
        codeStates['cmntlisttable02d0e'] = cmntlisttable02d0eProps,
        codeStates['setcmntlisttable02d0e'] = setcmntlisttable02d0eProps,
        codeStates['rtgs_list'] = rtgs_lista0a19,
        codeStates['setrtgs_list'] = setrtgs_lista0a19,
        codeStates['rtgs_lista0a19'] = rtgs_lista0a19Props,
        codeStates['setrtgs_lista0a19'] = setrtgs_lista0a19Props,
        codeStates['rtgs_list_grp'] = rtgs_list_grpcf7d8,
        codeStates['setrtgs_list_grp'] = setrtgs_list_grpcf7d8,
        codeStates['rtgs_list_grpcf7d8'] = rtgs_list_grpcf7d8Props,
        codeStates['setrtgs_list_grpcf7d8'] = setrtgs_list_grpcf7d8Props,
        codeStates['rtgs_list_table'] = rtgs_list_table7b8d6,
        codeStates['setrtgs_list_table'] = setrtgs_list_table7b8d6,
        codeStates['rtgs_list_table7b8d6'] = rtgs_list_table7b8d6Props,
        codeStates['setrtgs_list_table7b8d6'] = setrtgs_list_table7b8d6Props,
        codeStates['rtgs_list_tab_grp'] = rtgs_list_tab_grp024e1,
        codeStates['setrtgs_list_tab_grp'] = setrtgs_list_tab_grp024e1,
        codeStates['rtgs_list_tab_grp024e1'] = rtgs_list_tab_grp024e1Props,
        codeStates['setrtgs_list_tab_grp024e1'] = setrtgs_list_tab_grp024e1Props,
        codeStates['documnt_list'] = documnt_list03a06,
        codeStates['setdocumnt_list'] = setdocumnt_list03a06,
        codeStates['documnt_list03a06'] = documnt_list03a06Props,
        codeStates['setdocumnt_list03a06'] = setdocumnt_list03a06Props,
        codeStates['rtgs_list_doc_table_grp'] = rtgs_list_doc_table_grp8a593,
        codeStates['setrtgs_list_doc_table_grp'] = setrtgs_list_doc_table_grp8a593,
        codeStates['rtgs_list_doc_table_grp8a593'] = rtgs_list_doc_table_grp8a593Props,
        codeStates['setrtgs_list_doc_table_grp8a593'] = setrtgs_list_doc_table_grp8a593Props,
        codeStates['rtgs_lst_doc_list_table'] = rtgs_lst_doc_list_tablee57bb,
        codeStates['setrtgs_lst_doc_list_table'] = setrtgs_lst_doc_list_tablee57bb,
        codeStates['rtgs_lst_doc_list_tablee57bb'] = rtgs_lst_doc_list_tablee57bbProps,
        codeStates['setrtgs_lst_doc_list_tablee57bb'] = setrtgs_lst_doc_list_tablee57bbProps,
        codeStates['validtn_list'] = validtn_lista5b14,
        codeStates['setvalidtn_list'] = setvalidtn_lista5b14,
        codeStates['validtn_lista5b14'] = validtn_lista5b14Props,
        codeStates['setvalidtn_lista5b14'] = setvalidtn_lista5b14Props,
        codeStates['rtgs_list_validtn_list_grp'] = rtgs_list_validtn_list_grpc5569,
        codeStates['setrtgs_list_validtn_list_grp'] = setrtgs_list_validtn_list_grpc5569,
        codeStates['rtgs_list_validtn_list_grpc5569'] = rtgs_list_validtn_list_grpc5569Props,
        codeStates['setrtgs_list_validtn_list_grpc5569'] = setrtgs_list_validtn_list_grpc5569Props,
        codeStates['rtgs_list_validtn_table'] = rtgs_list_validtn_table39a42,
        codeStates['setrtgs_list_validtn_table'] = setrtgs_list_validtn_table39a42,
        codeStates['rtgs_list_validtn_table39a42'] = rtgs_list_validtn_table39a42Props,
        codeStates['setrtgs_list_validtn_table39a42'] = setrtgs_list_validtn_table39a42Props,
        codeStates['cmnt_list'] = cmnt_listebbbc,
        codeStates['setcmnt_list'] = setcmnt_listebbbc,
        codeStates['cmnt_listebbbc'] = cmnt_listebbbcProps,
        codeStates['setcmnt_listebbbc'] = setcmnt_listebbbcProps,
        codeStates['rtgs_list_cmnt_list_grp'] = rtgs_list_cmnt_list_grpb5728,
        codeStates['setrtgs_list_cmnt_list_grp'] = setrtgs_list_cmnt_list_grpb5728,
        codeStates['rtgs_list_cmnt_list_grpb5728'] = rtgs_list_cmnt_list_grpb5728Props,
        codeStates['setrtgs_list_cmnt_list_grpb5728'] = setrtgs_list_cmnt_list_grpb5728Props,
        codeStates['rtgs_list_cmnts_list'] = rtgs_list_cmnts_list15716,
        codeStates['setrtgs_list_cmnts_list'] = setrtgs_list_cmnts_list15716,
        codeStates['rtgs_list_cmnts_list15716'] = rtgs_list_cmnts_list15716Props,
        codeStates['setrtgs_list_cmnts_list15716'] = setrtgs_list_cmnts_list15716Props,
      codeStates['selected']  = selected
    codeExecution(customecode,codeStates)
    }
    if(value.length==0){ 
      return
    }
    try{
    setIsProcessing(true);
    let copyFormhandlerData :any = {}
      // copyFormData
                  // copyFormData for controller
          //copyFormhandlerData variable store state and its value
          copyFormhandlerData["setbasicinfo3d198"]={...copyFormhandlerData["setbasicinfo3d198"],[UOmapperData['eca51347c40c453caca735963ee434eb']['source']]:value}
      // copyFormData
                  // copyFormData for controller
          //copyFormhandlerData variable store state and its value
          copyFormhandlerData["setbasicinfo3d198"]={...copyFormhandlerData["setbasicinfo3d198"],[UOmapperData['c22b200afac143a4b305b1dc87c3d26f']['source']]:value}
      if("setbasicinfo3d198" in copyFormhandlerData){
        setbasicinfo3d198((pre:any)=>({...pre,...copyFormhandlerData["setbasicinfo3d198"]}) )
      }
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
   
  async function handleConfirmonClick(){
  } 
  const { validateRefetch, setValidateRefetch } = useContext(
    TotalContext
  ) as TotalContextProps
  //validation


  let schemaArray = [
  "v.string()",
  "v.nonEmpty('This field is required.')"
] ;
    const schema : any  = v.pipe(    v.string(),
    v.nonEmpty('This field is required.'),
)
  const handleBlur = async () => {
    //validation
      if(basicinfo3d198?.sort_code == "" || basicinfo3d198?.sort_code == undefined){
      basicinfo3d198.sort_code = "";
      const validate:any = v.safeParse(schema, basicinfo3d198?.sort_code);
        if(!validate.success){
          setError(validate?.issues[0]?.message);
          setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,sort_code:"invalid"}}));
        }
    }else if(basicinfo3d198?.sort_code !== ""){
    const validate:any = v.safeParse(schema, basicinfo3d198?.sort_code);
    if(!validate.success){
      setError(validate?.issues[0]?.message);
      setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,sort_code:"invalid"}}));
    }
    }
  }

    useEffect(()=>{
        if(!basicinfo3d198?.sort_code)
        { 
          setbasicinfo3d198Props((pre:any)=>({...pre,required:true}))
          setIsRequredData(true)
        }
        if(validateRefetch.init!=0)
          handleBlur()
    },[validateRefetch.value])

  useEffect(() => {
    if(initialCount!=0)
     setbasicinfo3d198((pre:any)=>({...pre,sort_code:""}))
    else
      setInitialCount(1)
  },[cr_bank_code8a2bc?.refresh])

  if (cr_bank_code8a2bc?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `13 / 19`,
        gridRow: `10 / 25`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown   
        className="!rounded-xl"    
        disabled= {cr_bank_code8a2bc?.isDisabled ? true : false}
        contentAlign={"center"}
        headerPosition='top'
        headerText={
          <>
            Cr Bank Code
            {isRequredData && <span style={{ color: 'red' }}> *</span>}
          </>
        }
        static={true}
        staticProps={cr_bank_codeOptions}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        placeholder={keyset("Select")} 
        filterable={true} 
        hasClear={true} 
        onChange={handlechange} 
        value={basicinfo3d198?.cr_bank_code8a2bc ? [basicinfo3d198?.cr_bank_code8a2bc] : (basicinfo3d198?.sort_code ? dropdownValue : [])}
        validationState={validate?.scanSaveProcessUi_v1?.sort_code ? "invalid" : undefined}
        errorMessage={error}
        />
    </div>
  );
};

export default Dropdowncr_bank_code;
