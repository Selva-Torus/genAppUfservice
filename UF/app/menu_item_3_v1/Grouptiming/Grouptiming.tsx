'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Textheading  from "./Textheading";
import Radiotime  from "./Radiotime";
import Text  from "./Text";
import Text  from "./Text";
import Icon  from "./Icon";
import Radio  from "./Radio";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Radio  from "./Radio";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptiming = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const securityData:any={};
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
 /////////////
   //another screen
  const {cf46a, setcf46a}= useContext(TotalContext) as TotalContextProps;
  const {cf46aProps, setcf46aProps}= useContext(TotalContext) as TotalContextProps;
  const {4f7b1, set4f7b1}= useContext(TotalContext) as TotalContextProps;
  const {4f7b1Props, set4f7b1Props}= useContext(TotalContext) as TotalContextProps;
  const {search676ad, setsearch676ad}= useContext(TotalContext) as TotalContextProps;
  const {search676adProps, setsearch676adProps}= useContext(TotalContext) as TotalContextProps;
  const {8394d, set8394d}= useContext(TotalContext) as TotalContextProps;
  const {8394dProps, set8394dProps}= useContext(TotalContext) as TotalContextProps;
  const {cardbb124, setcardbb124}= useContext(TotalContext) as TotalContextProps;
  const {cardbb124Props, setcardbb124Props}= useContext(TotalContext) as TotalContextProps;
  const {card4d75a4, setcard4d75a4}= useContext(TotalContext) as TotalContextProps;
  const {card4d75a4Props, setcard4d75a4Props}= useContext(TotalContext) as TotalContextProps;
  const {card108d97, setcard108d97}= useContext(TotalContext) as TotalContextProps;
  const {card108d97Props, setcard108d97Props}= useContext(TotalContext) as TotalContextProps;
  const {card23ac19, setcard23ac19}= useContext(TotalContext) as TotalContextProps;
  const {card23ac19Props, setcard23ac19Props}= useContext(TotalContext) as TotalContextProps;
  const {card393c35, setcard393c35}= useContext(TotalContext) as TotalContextProps;
  const {card393c35Props, setcard393c35Props}= useContext(TotalContext) as TotalContextProps;
  const {timing0cafc, settiming0cafc}= useContext(TotalContext) as TotalContextProps;
  const {timing0cafcProps, settiming0cafcProps}= useContext(TotalContext) as TotalContextProps;
  const {heading75dc3, setheading75dc3}= useContext(TotalContext) as TotalContextProps;
  const {time9390a, settime9390a}= useContext(TotalContext) as TotalContextProps;
  const {3397a, set3397a}= useContext(TotalContext) as TotalContextProps;
  const {e1f94, sete1f94}= useContext(TotalContext) as TotalContextProps;
  const {e12a2, sete12a2}= useContext(TotalContext) as TotalContextProps;
  const {4bb52, set4bb52}= useContext(TotalContext) as TotalContextProps;
  const {fd884, setfd884}= useContext(TotalContext) as TotalContextProps;
  const {e15cb, sete15cb}= useContext(TotalContext) as TotalContextProps;
  const {1133f, set1133f}= useContext(TotalContext) as TotalContextProps;
  const {e08fa, sete08fa}= useContext(TotalContext) as TotalContextProps;
  const {42b30, set42b30}= useContext(TotalContext) as TotalContextProps;
  const {b585c, setb585c}= useContext(TotalContext) as TotalContextProps;
  const {e6208, sete6208}= useContext(TotalContext) as TotalContextProps;
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard4:AFVK:v1",componentId:"878d15c0f15e497490b25bd54960cafc",from:"GroupTiming",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("heading")){
      setheading75dc3({...heading75dc3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("time")){
      settime9390a({...time9390a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set3397a({...3397a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete1f94({...e1f94,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete12a2({...e12a2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set4bb52({...4bb52,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setfd884({...fd884,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete15cb({...e15cb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set1133f({...1133f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete08fa({...e08fa,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set42b30({...42b30,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setb585c({...b585c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete6208({...e6208,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['']  = cf46a,
      codeStates['set'] = setcf46a,
      codeStates['']  = 4f7b1,
      codeStates['set'] = set4f7b1,
      codeStates['search']  = search676ad,
      codeStates['setsearch'] = setsearch676ad,
      codeStates['']  = 8394d,
      codeStates['set'] = set8394d,
      codeStates['card']  = cardbb124,
      codeStates['setcard'] = setcardbb124,
      codeStates['card4']  = card4d75a4,
      codeStates['setcard4'] = setcard4d75a4,
      codeStates['card1']  = card108d97,
      codeStates['setcard1'] = setcard108d97,
      codeStates['card2']  = card23ac19,
      codeStates['setcard2'] = setcard23ac19,
      codeStates['card3']  = card393c35,
      codeStates['setcard3'] = setcard393c35,
      codeStates['timing']  = timing0cafc,
      codeStates['settiming'] = settiming0cafc,
      codeStates['table']  = table8472d,
      codeStates['settable'] = settable8472d,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const timing0cafcRef = useRef<any>(null);
  const handleClearSearch = () => {
    timing0cafcRef.current?.setSearchParams();
    timing0cafcRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(timing0cafc) && Object.keys(timing0cafc)?.length>0)
      {
        settiming0cafc({})
      }
    }else 
      prevRefreshRef.current= true
  }, [timing0cafcProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '8 / 13',
        gridRow: '121 / 372',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'#f4f5fa',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={clsx("",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
          {allowedControls.includes("heading") ?<Textheading   /* 75dc3 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("time")?<Radiotime  /* 9390a */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 3397a */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("") ?<Text   /* e1f94 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* e12a2 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("")?<Radio  /* 4bb52 */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* fd884 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* e15cb */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 1133f */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Radio  /* e08fa */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 42b30 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* b585c */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* e6208 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Grouptiming
