




'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import Tableprn_datails_table  from './Tableprn_datails_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupprn_datails_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_itax_source_tran_dtl_dfd_v1Props, setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagComp: boolean = encryptionFlagPageData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData?.method;
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  };
  const [showFlag, setShowFlag] = React.useState<string>("");
  const securityData:any={
  "Branch Officer": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
};
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const [ButtonGoRuleData,setButtonGoRuleData]=useState<any>({})
 /////////////
   //another screen
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {tax_code9c2db, settax_code9c2db}= useContext(TotalContext) as TotalContextProps;
  const {tax_component9766e, settax_component9766e}= useContext(TotalContext) as TotalContextProps;
  const {tax_period17a7c, settax_period17a7c}= useContext(TotalContext) as TotalContextProps;
  const {amount4e1d5, setamount4e1d5}= useContext(TotalContext) as TotalContextProps;
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
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",componentId:"ac216b419d2f4aa29d6767a9b622ad52",from:"GroupPrnDatailsTable",isTable : true,accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
  code = orchestrationData?.data?.code;
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
  if(orchestrationData?.data?.rule?.nodes?.length > 0){
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});

    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("tax_code")){
      settax_code9c2db({...tax_code9c2db,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_component")){
      settax_component9766e({...tax_component9766e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_period")){
      settax_period17a7c({...tax_period17a7c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("amount")){
      setamount4e1d5({...amount4e1d5,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const prn_datails_table2ad52Ref = useRef<any>(null);
  const handleClearSearch = () => {
    prn_datails_table2ad52Ref.current?.setSearchParams();
    prn_datails_table2ad52Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(prn_datails_table2ad52) && Object.keys(prn_datails_table2ad52)?.length>0)
      {
        setprn_datails_table2ad52({})
      }
    }else 
      prevRefreshRef.current= true
  }, [prn_datails_table2ad52Props?.refresh,token])


  const renderBUttons=()=>{
    return (
          <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '9 / 66',
      
        //rowGap: '0px',
        overflow: 'visible',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
      <div className='flex flex-col h-full w-full min-w-0 overflow-auto'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tableprn_datails_table headerButtonsRenders={renderBUttons}
        lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={prn_datails_table2ad52Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData} setIsProcessing={setIsProcessing}/>}
      </div>
      </div>
    </div>
 )
}

export default Groupprn_datails_table
