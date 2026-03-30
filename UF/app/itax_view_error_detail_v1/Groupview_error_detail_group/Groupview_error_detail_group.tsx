




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
import Texttran_category_label  from "./Texttran_category_label";
import Texterror_cateogry_label  from "./Texterror_cateogry_label";
import Texttran_category  from "./Texttran_category";
import Texterror_cateogry  from "./Texterror_cateogry";
import Texterror_code_label  from "./Texterror_code_label";
import Texterror_description_label  from "./Texterror_description_label";
import Texterror_code  from "./Texterror_code";
import Texterror_description  from "./Texterror_description";
import Buttonview_error_detail  from "./Buttonview_error_detail";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupview_error_detail_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_tran_error_log_dfd_v1Props, setdfd_itax_tran_error_log_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "tran_category_label",
      "error_cateogry_label",
      "tran_category",
      "error_cateogry",
      "error_code_label",
      "error_description_label",
      "error_code",
      "error_description",
      "view_error_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_error_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "tran_category_label",
      "error_cateogry_label",
      "tran_category",
      "error_cateogry",
      "error_code_label",
      "error_description_label",
      "error_code",
      "error_description",
      "view_error_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_error_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "tran_category_label",
      "error_cateogry_label",
      "tran_category",
      "error_cateogry",
      "error_code_label",
      "error_description_label",
      "error_code",
      "error_description",
      "view_error_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_error_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "tran_category_label",
      "error_cateogry_label",
      "tran_category",
      "error_cateogry",
      "error_code_label",
      "error_description_label",
      "error_code",
      "error_description",
      "view_error_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_error_detail_group"
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
  const {view_error_detail_group21845, setview_error_detail_group21845}= useContext(TotalContext) as TotalContextProps;
  const {view_error_detail_group21845Props, setview_error_detail_group21845Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_category_label7a433, settran_category_label7a433}= useContext(TotalContext) as TotalContextProps;
  const {error_cateogry_label0e2f6, seterror_cateogry_label0e2f6}= useContext(TotalContext) as TotalContextProps;
  const {tran_category15644, settran_category15644}= useContext(TotalContext) as TotalContextProps;
  const {error_cateogryebc09, seterror_cateogryebc09}= useContext(TotalContext) as TotalContextProps;
  const {error_code_labeld6aa7, seterror_code_labeld6aa7}= useContext(TotalContext) as TotalContextProps;
  const {error_description_labelbc214, seterror_description_labelbc214}= useContext(TotalContext) as TotalContextProps;
  const {error_codeba00c, seterror_codeba00c}= useContext(TotalContext) as TotalContextProps;
  const {error_description64756, seterror_description64756}= useContext(TotalContext) as TotalContextProps;
  const {view_error_detaild4c71, setview_error_detaild4c71}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Error_Detail:AFVK:v1",componentId:"99eff584449f44b6809d3062a0321845",from:"GroupViewErrorDetailGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tran_category_label")){
      settran_category_label7a433({...tran_category_label7a433,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_cateogry_label")){
      seterror_cateogry_label0e2f6({...error_cateogry_label0e2f6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_category")){
      settran_category15644({...tran_category15644,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_cateogry")){
      seterror_cateogryebc09({...error_cateogryebc09,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_code_label")){
      seterror_code_labeld6aa7({...error_code_labeld6aa7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_description_label")){
      seterror_description_labelbc214({...error_description_labelbc214,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_code")){
      seterror_codeba00c({...error_codeba00c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_description")){
      seterror_description64756({...error_description64756,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_error_detail")){
      setview_error_detaild4c71({...view_error_detaild4c71,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['view_error_detail_group']  = view_error_detail_group21845,
      codeStates['setview_error_detail_group'] = setview_error_detail_group21845,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const view_error_detail_group21845Ref = useRef<any>(null);
  const handleClearSearch = () => {
    view_error_detail_group21845Ref.current?.setSearchParams();
    view_error_detail_group21845Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(view_error_detail_group21845) && Object.keys(view_error_detail_group21845)?.length>0)
      {
        setview_error_detail_group21845({})
      }
    }else 
      prevRefreshRef.current= true
  }, [view_error_detail_group21845Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 67',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '5px',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md p-4 !bg-[#f4f5fa] ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("tran_category_label") ?<Texttran_category_label   /* 7a433 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_cateogry_label") ?<Texterror_cateogry_label   /* 0e2f6 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_category") ?<Texttran_category   /* 15644 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_cateogry") ?<Texterror_cateogry   /* ebc09 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_code_label") ?<Texterror_code_label   /* d6aa7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_description_label") ?<Texterror_description_label   /* bc214 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_code") ?<Texterror_code   /* ba00c */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("error_description") ?<Texterror_description   /* 64756 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("view_error_detail" in ButtonGoRuleData)?ButtonGoRuleData["view_error_detail"]:true) && 
          allowedControls.includes("view_error_detail")  ?            <Buttonview_error_detail lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupview_error_detail_group
