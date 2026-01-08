

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
import QrCodeqrcode  from "./QrCodeqrcode";
import Progressprogress1  from "./Progressprogress1";
import Sliderslider2  from "./Sliderslider2";
import TreeViewertreeviewer  from "./TreeViewertreeviewer";
import Signaturesignature  from "./Signaturesignature";
import PinInputpininput  from "./PinInputpininput";
import Listlist  from "./Listlist";
import TextToSpeechOutputtext_to_speech  from "./TextToSpeechOutputtext_to_speech";
import Checkboxcheckbox  from "./Checkboxcheckbox";
import RadioButtonradiobutton  from "./RadioButtonradiobutton";
import Radioradio  from "./Radioradio";
import Imageimage  from "./Imageimage";
import Buttonbutton  from "./Buttonbutton";
import PivotTablepivottable  from "./PivotTablepivottable";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupgroup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "qrcode",
      "progress1",
      "slider2",
      "treeviewer",
      "signature",
      "pininput",
      "list",
      "text_to_speech",
      "checkbox",
      "radiobutton",
      "radio",
      "image",
      "button",
      "pivottable"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "usertable",
      "usertable2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [
      "qrcode",
      "progress1",
      "slider2",
      "treeviewer",
      "signature",
      "pininput",
      "list",
      "text_to_speech",
      "checkbox",
      "radiobutton",
      "radio",
      "image",
      "button",
      "pivottable"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "usertable",
      "usertable2"
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
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;
  const {slider2edf6a, setslider2edf6a}= useContext(TotalContext) as TotalContextProps;
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",componentId:"7a5f6e1c8f4f4801b28383ae87fbffe9",from:"GroupGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("qrcode")){
      setqrcode1c711({...qrcode1c711,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("progress1")){
      setprogress1c37ec({...progress1c37ec,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("slider2")){
      setslider2edf6a({...slider2edf6a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("treeviewer")){
      settreeviewer4d8cf({...treeviewer4d8cf,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("signature")){
      setsignatureb24c1({...signatureb24c1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pininput")){
      setpininputd19b1({...pininputd19b1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("list")){
      setliste1b9e({...liste1b9e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("text_to_speech")){
      settext_to_speech7626c({...text_to_speech7626c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("checkbox")){
      setcheckbox0cfd1({...checkbox0cfd1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("radiobutton")){
      setradiobutton81392({...radiobutton81392,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("radio")){
      setradio54f01({...radio54f01,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("image")){
      setimage3343d({...image3343d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("button")){
      setbuttonf8d11({...buttonf8d11,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pivottable")){
      setpivottable703fa({...pivottable703fa,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupbffe9,
      codeStates['setgroup'] = setgroupbffe9,
      codeStates['usertable']  = usertable8d993,
      codeStates['setusertable'] = setusertable8d993,
      codeStates['usertable2']  = usertable2b6e16,
      codeStates['setusertable2'] = setusertable2b6e16,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const groupbffe9Ref = useRef<any>(null);
  const handleClearSearch = () => {
    groupbffe9Ref.current?.setSearchParams();
    groupbffe9Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(groupbffe9) && Object.keys(groupbffe9)?.length>0)
      {
        setgroupbffe9({})
      }
    }else 
      prevRefreshRef.current= true
  }, [groupbffe9Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '3 / 480',
      
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
      className={`flex flex-col overflow-auto rounded-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        {allowedControls.includes("qrcode") ?<QrCodeqrcode   /* 1c711 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("progress1")?<Progressprogress1  /* c37ec */ isDynamic={false } index={idx} item={item} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("slider2") ?<Sliderslider2   /* edf6a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("treeviewer")?<TreeViewertreeviewer /* 4d8cf */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("signature") ?<Signaturesignature   /* b24c1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("pininput") ?<PinInputpininput   /* d19b1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("list") ?<Listlist   /* e1b9e */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("text_to_speech") ?<TextToSpeechOutputtext_to_speech   /* 7626c */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("checkbox") ?<Checkboxcheckbox   /* 0cfd1 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("radiobutton")?<RadioButtonradiobutton  /* 81392 */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("radio")?<Radioradio  /* 54f01 */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("image")?<Imageimage /* 3343d */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {        (("button" in ButtonGoRuleData)?ButtonGoRuleData["button"]:true) && 
          allowedControls.includes("button")  ?            <Buttonbutton lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {allowedControls.includes("pivottable") ?<PivotTablepivottable  /* 703fa */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupgroup
