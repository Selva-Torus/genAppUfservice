

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import Groupuserable  from "../Groupuserable/Groupuserable";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Buttonsave  from "./Buttonsave";
import TextInputusername  from "./TextInputusername";
import Checkboxcheckbox  from "./Checkboxcheckbox";
import DatePickerdate  from "./DatePickerdate";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupmaingroup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_mydfddata_v1Props, setdfd_mydfddata_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Template 1": {
    "allowedControls": [
      "save",
      "username",
      "checkbox"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [
      "date"
    ],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [
      "save",
      "username",
      "checkbox"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [
      "date"
    ],
    "readOnlyControls": []
  },
  "Template 3": {
    "allowedControls": [
      "save",
      "username",
      "checkbox"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [
      "date"
    ],
    "readOnlyControls": []
  },
  "User": {
    "allowedControls": [
      "save",
      "username",
      "checkbox"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [
      "date"
    ],
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
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps;
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps;
  const {save8d5a7, setsave8d5a7}= useContext(TotalContext) as TotalContextProps;
  const {username57f7f, setusername57f7f}= useContext(TotalContext) as TotalContextProps;
  const {checkboxebbe6, setcheckboxebbe6}= useContext(TotalContext) as TotalContextProps;
  const {date419b1, setdate419b1}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",componentId:"148827029a474f2db3ba030ecc17f4e1",from:"GroupMaingroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsave8d5a7({...save8d5a7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("username")){
      setusername57f7f({...username57f7f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("checkbox")){
      setcheckboxebbe6({...checkboxebbe6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("date")){
      setdate419b1({...date419b1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("userable")){
      setuserable8d616({...userable8d616,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['maingroup']  = maingroup7f4e1,
      codeStates['setmaingroup'] = setmaingroup7f4e1,
      codeStates['userable']  = userable8d616,
      codeStates['setuserable'] = setuserable8d616,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const maingroup7f4e1Ref = useRef<any>(null);
  const handleClearSearch = () => {
    maingroup7f4e1Ref.current?.setSearchParams();
    maingroup7f4e1Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(maingroup7f4e1) && Object.keys(maingroup7f4e1)?.length>0)
      {
        setmaingroup7f4e1({})
      }
    }else 
      prevRefreshRef.current= true
  }, [maingroup7f4e1Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '2 / 24',
        gridRow: '9 / 307',
      
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
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        {allowedComponent.includes("userable")  &&<Groupuserable  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          dropdownData={dropdownData} 
          setDropdownData={setDropdownData}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}        />}
        {        (("save" in ButtonGoRuleData)?ButtonGoRuleData["save"]:true) && 
          allowedControls.includes("save")  ?            <Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {allowedControls.includes("username") ?<TextInputusername   /* 57f7f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("checkbox") ?<Checkboxcheckbox   /* ebbe6 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("date") ?<DatePickerdate   /* 419b1 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupmaingroup
