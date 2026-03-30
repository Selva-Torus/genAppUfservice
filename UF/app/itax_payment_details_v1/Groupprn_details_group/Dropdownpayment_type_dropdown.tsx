

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
const Dropdownpayment_type_dropdown = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: any) => {
  const token: string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
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
  let customecode:string="setpayment_type_cheque_group((pre)=>({...pre,debit_amount:+pre?.total_amount+500+(500*.16)}))\r\n \r\nsetpayment_type_dt_group((pre)=>({...pre,debit_amount:+pre?.total_amount+500+(500*.16)}))";
  const [allCode,setAllCode]=useState<string>("");
  const [ruleCode,setRuleCode]=useState<string>("");  
  const [dropdownValue, setdropdownValue] = useState<string | string[]>("");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  let items:any = []
  //showComponentAsPopup || showArtifactAsModal
 /////////////
   //another screen
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_details7320a, setprn_details7320a}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_details5a762, setpayment_details5a762}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labelb5c98, setpayment_type_labelb5c98}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdownb558f, setpayment_type_dropdownb558f}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414Props, setsubscreen_groupc0414Props}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props}= useContext(TotalContext) as TotalContextProps;
  const {clear47c6a, setclear47c6a}= useContext(TotalContext) as TotalContextProps;
  const {make_payment3a4e8, setmake_payment3a4e8}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleStaticValue=(data:any)=>{
    setSelectedItem(data)
  }
  const [selectedItem, setSelectedItem] = useState('');
  items = [
   'Cheque',
   'Direct Transfer',
  ];

  useEffect(() => {
  if(prn_details_group00560?.payment_type_dropdown=="" || prn_details_group00560?.payment_type_dropdown==undefined || prn_details_group00560?.payment_type_dropdown==null ){
    setSelectedItem("");
  }
  },[prn_details_group00560?.payment_type_dropdown])
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",
          componentId: "4725fb7b4b994db2bb5cd1ad08100560",
          controlId: "cb93c52a514b4c1aa25eed90bdfb558f",
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
      if(orchestrationData?.data?.rule?.nodes?.length>0){
        setRuleCode(orchestrationData?.data?.rule)        
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[payment_type_dropdownb558f?.refresh])

  const selected=useRef({})
  const handleClick=async(value?:any)=>{
    if (value.length > 0) {
      let temp:any=[]
      if(Array.isArray(value)){
        for( let val of value){
          if(Array.isArray(val)){
            temp.push(val)
          }else{
            temp.push(val)
          }        
        }
      }
      setprn_details_group00560((prev: any) => ({ ...prev, payment_type_dropdown: value}))
         setIsRequredData(false)
    } else {
       setprn_details_group00560((prev: any) => ({ ...prev, payment_type_dropdown: ''}))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,ITAX_Payment_Details_v1:{...pre?.ITAX_Payment_Details_v1,payment_type_dropdown:undefined}}));
   
    selected.current=value
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}      
        codeStates['prn_details_group'] = prn_details_group00560,
        codeStates['setprn_details_group'] = setprn_details_group00560,
        codeStates['selected']  = selected,
        codeStates['prn_details_group00560'] = prn_details_group00560Props,
        codeStates['setprn_details_group00560'] = setprn_details_group00560Props,
        codeStates['selected']  = selected,
        codeStates['prn_details'] = prn_details7320a,
        codeStates['setprn_details'] = setprn_details7320a,
        codeStates['selected']  = selected,
        codeStates['prn_datails_table'] = prn_datails_table2ad52,
        codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
        codeStates['selected']  = selected,
        codeStates['prn_datails_table2ad52'] = prn_datails_table2ad52Props,
        codeStates['setprn_datails_table2ad52'] = setprn_datails_table2ad52Props,
        codeStates['selected']  = selected,
        codeStates['payment_details'] = payment_details5a762,
        codeStates['setpayment_details'] = setpayment_details5a762,
        codeStates['selected']  = selected,
        codeStates['payment_type_label'] = payment_type_labelb5c98,
        codeStates['setpayment_type_label'] = setpayment_type_labelb5c98,
        codeStates['selected']  = selected,
        codeStates['payment_type_dropdown'] = payment_type_dropdownb558f,
        codeStates['setpayment_type_dropdown'] = setpayment_type_dropdownb558f,
        codeStates['selected']  = selected,
        codeStates['subscreen_group'] = subscreen_groupc0414,
        codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
        codeStates['selected']  = selected,
        codeStates['subscreen_groupc0414'] = subscreen_groupc0414Props,
        codeStates['setsubscreen_groupc0414'] = setsubscreen_groupc0414Props,
        codeStates['selected']  = selected,
        codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
        codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
        codeStates['selected']  = selected,
        codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props,
        codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props,
        codeStates['selected']  = selected,
        codeStates['payment_type_cheque_group'] = payment_type_cheque_group239dd,
        codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
        codeStates['selected']  = selected,
        codeStates['payment_type_cheque_group239dd'] = payment_type_cheque_group239ddProps,
        codeStates['setpayment_type_cheque_group239dd'] = setpayment_type_cheque_group239ddProps,
        codeStates['selected']  = selected,
        codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
        codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
        codeStates['selected']  = selected,
        codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props,
        codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props,
        codeStates['selected']  = selected,
        codeStates['payment_type_dt_group'] = payment_type_dt_groupedf52,
        codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,
        codeStates['selected']  = selected,
        codeStates['payment_type_dt_groupedf52'] = payment_type_dt_groupedf52Props,
        codeStates['setpayment_type_dt_groupedf52'] = setpayment_type_dt_groupedf52Props,
        codeStates['selected']  = selected,
        codeStates['clear'] = clear47c6a,
        codeStates['setclear'] = setclear47c6a,
        codeStates['selected']  = selected,
        codeStates['make_payment'] = make_payment3a4e8,
        codeStates['setmake_payment'] = setmake_payment3a4e8,
        codeStates['selected']  = selected,
    codeExecution(customecode,codeStates)
    }
    if(value.length==0){ 
      return
    }
    try{
    let copyFormhandlerData :any = {}
    }catch(err){
      console.log(err)
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
     setprn_details_group00560((pre:any)=>({...pre,payment_type_dropdown:""}))
    else
      setInitialCount(1)
  },[payment_type_dropdownb558f?.refresh])

  if (payment_type_dropdownb558f?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `13 / 25`,
        gridRow: `77 / 90`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown
        className=""
        placeholder={keyset("")} 
        filterable={true}
        hasClear={true}
        static={true}
        staticProps={items}
        disabled= {payment_type_dropdownb558f?.isDisabled ? true : false}
        contentAlign={"center"}
        value={prn_details_group00560?.payment_type_dropdown ?prn_details_group00560?.payment_type_dropdown: []}
        onChange={handleClick} 
      /> 
    </div>
  );
};

export default Dropdownpayment_type_dropdown;
