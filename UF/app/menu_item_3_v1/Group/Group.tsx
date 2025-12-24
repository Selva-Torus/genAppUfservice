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
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import Text  from "./Text";
import Icon  from "./Icon";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {99f1e, set99f1e}= useContext(TotalContext) as TotalContextProps;
  const {36aa6, set36aa6}= useContext(TotalContext) as TotalContextProps;
  const {048f8, set048f8}= useContext(TotalContext) as TotalContextProps;
  const {c403e, setc403e}= useContext(TotalContext) as TotalContextProps;
  const {8b191, set8b191}= useContext(TotalContext) as TotalContextProps;
  const {9310b, set9310b}= useContext(TotalContext) as TotalContextProps;
  const {e4c32, sete4c32}= useContext(TotalContext) as TotalContextProps;
  const {7fbe3, set7fbe3}= useContext(TotalContext) as TotalContextProps;
  const {700dd, set700dd}= useContext(TotalContext) as TotalContextProps;
  const {86102, set86102}= useContext(TotalContext) as TotalContextProps;
  const {84908, set84908}= useContext(TotalContext) as TotalContextProps;
  const {b8feb, setb8feb}= useContext(TotalContext) as TotalContextProps;
  const {f5bc7, setf5bc7}= useContext(TotalContext) as TotalContextProps;
  const {1a5f1, set1a5f1}= useContext(TotalContext) as TotalContextProps;
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
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard4:AFVK:v1",componentId:"0e41a32b9b8e43b0a1c91f805dd8394d",from:"Group",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("")){
      set99f1e({...99f1e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set36aa6({...36aa6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set048f8({...048f8,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setc403e({...c403e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set8b191({...8b191,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set9310b({...9310b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      sete4c32({...e4c32,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set7fbe3({...7fbe3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set700dd({...700dd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set86102({...86102,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set84908({...84908,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setb8feb({...b8feb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setf5bc7({...f5bc7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set1a5f1({...1a5f1,isDisabled:true});
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
  const 8394dRef = useRef<any>(null);
  const handleClearSearch = () => {
    8394dRef.current?.setSearchParams();
    8394dRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(8394d) && Object.keys(8394d)?.length>0)
      {
        set8394d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [8394dProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 3',
        gridRow: '24 / 397',
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
          {allowedControls.includes("") ?<Text   /* 99f1e */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* 36aa6 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 048f8 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* c403e */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 8b191 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* 9310b */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* e4c32 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* 7fbe3 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 700dd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* 86102 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* 84908 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* b8feb */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("") ?<Text   /* f5bc7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("")?<Icon /* 1a5f1 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
    </div>
 )
}

export default Group
