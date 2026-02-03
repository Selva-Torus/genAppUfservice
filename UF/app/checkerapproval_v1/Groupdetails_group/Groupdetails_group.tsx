

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Textchecker_detail  from "./Textchecker_detail";
import TextInputapi_endpoint  from "./TextInputapi_endpoint";
import TextInputsetup_code  from "./TextInputsetup_code";
import TextInputapi_name  from "./TextInputapi_name";
import TextInputapprove_id  from "./TextInputapprove_id";
import TextInputproduct_key  from "./TextInputproduct_key";
import TextInputhttp_method  from "./TextInputhttp_method";
import Buttonapprove  from "./Buttonapprove";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupdetails_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_cdc_checker_action_dfd_v1Props, setdfd_cdc_checker_action_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const securityData:any={
  "Maker": {
    "allowedControls": [
      "checker_detail",
      "api_endpoint",
      "setup_code",
      "api_name",
      "approve_id",
      "product_key",
      "http_method",
      "approve"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "checker_detail",
      "api_endpoint",
      "setup_code",
      "api_name",
      "approve_id",
      "product_key",
      "http_method",
      "approve"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "checker_detail",
      "api_endpoint",
      "setup_code",
      "api_name",
      "approve_id",
      "product_key",
      "http_method",
      "approve"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
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
  const {cdc_group2e1e4, setcdc_group2e1e4}= useContext(TotalContext) as TotalContextProps;
  const {cdc_group2e1e4Props, setcdc_group2e1e4Props}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbe, setdetails_group46bbe}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbeProps, setdetails_group46bbeProps}= useContext(TotalContext) as TotalContextProps;
  const {checker_detail4e9af, setchecker_detail4e9af}= useContext(TotalContext) as TotalContextProps;
  const {api_endpointa0340, setapi_endpointa0340}= useContext(TotalContext) as TotalContextProps;
  const {setup_code4eedf, setsetup_code4eedf}= useContext(TotalContext) as TotalContextProps;
  const {api_namebdd52, setapi_namebdd52}= useContext(TotalContext) as TotalContextProps;
  const {approve_id82664, setapprove_id82664}= useContext(TotalContext) as TotalContextProps;
  const {product_key121a1, setproduct_key121a1}= useContext(TotalContext) as TotalContextProps;
  const {http_methoda99b9, sethttp_methoda99b9}= useContext(TotalContext) as TotalContextProps;
  const {approve20de7, setapprove20de7}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951, settable_group05951}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951Props, settable_group05951Props}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54d, setcdc_table8e54d}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54dProps, setcdc_table8e54dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1",componentId:"2eff021532cd4b80834bce1263346bbe",from:"GroupDetailsGroup",accessProfile:accessProfile},{
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
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("checker_detail")){
      setchecker_detail4e9af({...checker_detail4e9af,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("api_endpoint")){
      setapi_endpointa0340({...api_endpointa0340,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("setup_code")){
      setsetup_code4eedf({...setup_code4eedf,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("api_name")){
      setapi_namebdd52({...api_namebdd52,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("approve_id")){
      setapprove_id82664({...approve_id82664,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_key")){
      setproduct_key121a1({...product_key121a1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("http_method")){
      sethttp_methoda99b9({...http_methoda99b9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("approve")){
      setapprove20de7({...approve20de7,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['cdc_group']  = cdc_group2e1e4,
      codeStates['setcdc_group'] = setcdc_group2e1e4,
      codeStates['details_group']  = details_group46bbe,
      codeStates['setdetails_group'] = setdetails_group46bbe,
      codeStates['table_group']  = table_group05951,
      codeStates['settable_group'] = settable_group05951,
      codeStates['cdc_table']  = cdc_table8e54d,
      codeStates['setcdc_table'] = setcdc_table8e54d,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const details_group46bbeRef = useRef<any>(null);
  const handleClearSearch = () => {
    details_group46bbeRef.current?.setSearchParams();
    details_group46bbeRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(details_group46bbe) && Object.keys(details_group46bbe)?.length>0)
      {
        setdetails_group46bbe({})
      }
    }else 
      prevRefreshRef.current= true
  }, [details_group46bbeProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 93',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '0px',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md p-2 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("checker_detail") ?<Textchecker_detail   /* 4e9af */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("api_endpoint") ?<TextInputapi_endpoint   /* a0340 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("setup_code") ?<TextInputsetup_code   /* 4eedf */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("api_name") ?<TextInputapi_name   /* bdd52 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("approve_id") ?<TextInputapprove_id   /* 82664 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("product_key") ?<TextInputproduct_key   /* 121a1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("http_method") ?<TextInputhttp_method   /* a99b9 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("approve" in ButtonGoRuleData)?ButtonGoRuleData["approve"]:true) && 
          allowedControls.includes("approve")  ?            <Buttonapprove lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Groupdetails_group
