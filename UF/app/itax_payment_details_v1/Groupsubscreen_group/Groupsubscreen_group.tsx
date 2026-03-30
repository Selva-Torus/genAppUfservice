




'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v1  from "../GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v1/GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v1";
import GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1  from "../GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1/GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1";
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
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupsubscreen_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
    "allowedControls": [],
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
    "allowedControls": [],
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
    "allowedControls": [],
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
    "allowedControls": [],
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
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",componentId:"647be53314d8496aa8523dd0c76c0414",from:"GroupSubscreenGroup",accessProfile:accessProfile},{
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
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj,...prn_details_group00560});

    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1")){
      setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86({...ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1")){
      setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7({...ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['prn_details_group']  = prn_details_group00560,
      codeStates['setprn_details_group'] = setprn_details_group00560,
      codeStates['prn_datails_table']  = prn_datails_table2ad52,
      codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
      codeStates['subscreen_group']  = subscreen_groupc0414,
      codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['payment_type_cheque_group']  = payment_type_cheque_group239dd,
      codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['payment_type_dt_group']  = payment_type_dt_groupedf52,
      codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,

    codeExecution(code,codeStates);
    } 
  }

  function handleConfirmOnLoad(){
  }

    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const subscreen_groupc0414Ref = useRef<any>(null);
  const handleClearSearch = () => {
    subscreen_groupc0414Ref.current?.setSearchParams();
    subscreen_groupc0414Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(subscreen_groupc0414) && Object.keys(subscreen_groupc0414)?.length>0)
      {
        setsubscreen_groupc0414({})
      }
    }else 
      prevRefreshRef.current= true
  }, [subscreen_groupc0414Props?.refresh,token,prn_details_group00560[uoMapperData["cb93c52a514b4c1aa25eed90bdfb558f"]["source"]]])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '90 / 150',
      
        //rowGap: '',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(50px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '',
        columnGap: '',
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
        {(showFlag == "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1") &&allowedComponent.includes("ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1")  &&<GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v1  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}        />}
        {(showFlag == "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1") &&allowedComponent.includes("ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1")  &&<GroupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}        />}
    </div>
 )
}

export default Groupsubscreen_group
