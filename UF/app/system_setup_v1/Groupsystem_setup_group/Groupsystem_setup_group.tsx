

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
import Dropdownproduct_code  from "./Dropdownproduct_code";
import TextInputsetup_code  from "./TextInputsetup_code";
import TextInputinterface_product  from "./TextInputinterface_product";
import Dropdowncategory  from "./Dropdowncategory";
import Dropdownsub_category  from "./Dropdownsub_category";
import TextInputpurpose  from "./TextInputpurpose";
import DynamicJsonFormsystem_setup_dynamic_form  from "./DynamicJsonFormsystem_setup_dynamic_form";
import ButtonCancel  from "./ButtonCancel";
import ButtonSave  from "./ButtonSave";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupsystem_setup_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_master_system_setup_dfd_v1Props, setdfd_master_system_setup_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "product_code",
      "setup_code",
      "interface_product",
      "category",
      "sub_category",
      "purpose",
      "system_setup_dynamic_form",
      "cancel",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "system_setup_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "product_code",
      "setup_code",
      "interface_product",
      "category",
      "sub_category",
      "purpose",
      "system_setup_dynamic_form",
      "cancel",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "system_setup_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "product_code",
      "setup_code",
      "interface_product",
      "category",
      "sub_category",
      "purpose",
      "system_setup_dynamic_form",
      "cancel",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "system_setup_group"
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
  const {system_setup_group2af15, setsystem_setup_group2af15}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_group2af15Props, setsystem_setup_group2af15Props}= useContext(TotalContext) as TotalContextProps;
  const {product_code523b7, setproduct_code523b7}= useContext(TotalContext) as TotalContextProps;
  const {setup_code88cd6, setsetup_code88cd6}= useContext(TotalContext) as TotalContextProps;
  const {interface_productd9133, setinterface_productd9133}= useContext(TotalContext) as TotalContextProps;
  const {category80c2f, setcategory80c2f}= useContext(TotalContext) as TotalContextProps;
  const {sub_categoryd81c5, setsub_categoryd81c5}= useContext(TotalContext) as TotalContextProps;
  const {purpose3b7f4, setpurpose3b7f4}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_dynamic_formf3526, setsystem_setup_dynamic_formf3526}= useContext(TotalContext) as TotalContextProps;
  const {cancelad32e, setcancelad32e}= useContext(TotalContext) as TotalContextProps;
  const {save3a1b8, setsave3a1b8}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1",componentId:"723ad64155fe45adba8c526f1ce2af15",from:"GroupSystemSetupGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_code523b7({...product_code523b7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("setup_code")){
      setsetup_code88cd6({...setup_code88cd6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("interface_product")){
      setinterface_productd9133({...interface_productd9133,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("category")){
      setcategory80c2f({...category80c2f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("sub_category")){
      setsub_categoryd81c5({...sub_categoryd81c5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("purpose")){
      setpurpose3b7f4({...purpose3b7f4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("system_setup_dynamic_form")){
      setsystem_setup_dynamic_formf3526({...system_setup_dynamic_formf3526,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cancel")){
      setcancelad32e({...cancelad32e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsave3a1b8({...save3a1b8,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['system_setup_group']  = system_setup_group2af15,
      codeStates['setsystem_setup_group'] = setsystem_setup_group2af15,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const system_setup_group2af15Ref = useRef<any>(null);
  const handleClearSearch = () => {
    system_setup_group2af15Ref.current?.setSearchParams();
    system_setup_group2af15Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(system_setup_group2af15) && Object.keys(system_setup_group2af15)?.length>0)
      {
        setsystem_setup_group2af15({})
      }
    }else 
      prevRefreshRef.current= true
  }, [system_setup_group2af15Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 139',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '6px',
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
        {allowedControls.includes("product_code") ?<Dropdownproduct_code   /* 523b7 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("setup_code") ?<TextInputsetup_code   /* 88cd6 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("interface_product") ?<TextInputinterface_product   /* d9133 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("category") ?<Dropdowncategory   /* 80c2f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("sub_category") ?<Dropdownsub_category   /* d81c5 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("purpose") ?<TextInputpurpose   /* 3b7f4 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("system_setup_dynamic_form") ?<DynamicJsonFormsystem_setup_dynamic_form   /* f3526 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("cancel" in ButtonGoRuleData)?ButtonGoRuleData["cancel"]:true) && 
          allowedControls.includes("cancel")  ?            <ButtonCancel lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("save" in ButtonGoRuleData)?ButtonGoRuleData["save"]:true) && 
          allowedControls.includes("save")  ?            <ButtonSave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Groupsystem_setup_group
