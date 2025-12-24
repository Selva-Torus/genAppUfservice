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
import Textthird  from "./Textthird";
import Textfour  from "./Textfour";
import Iconicon1  from "./Iconicon1";
import Iconicon2  from "./Iconicon2";
import Iconicon3  from "./Iconicon3";
import Iconicon4  from "./Iconicon4";
import Texttext2  from "./Texttext2";
import Texttext1  from "./Texttext1";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupbackground1 = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {backgorunde9308, setbackgorunde9308}= useContext(TotalContext) as TotalContextProps;
  const {backgorunde9308Props, setbackgorunde9308Props}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8a, setbackground10bc8a}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8aProps, setbackground10bc8aProps}= useContext(TotalContext) as TotalContextProps;
  const {thirde7680, setthirde7680}= useContext(TotalContext) as TotalContextProps;
  const {four05c92, setfour05c92}= useContext(TotalContext) as TotalContextProps;
  const {icon190895, seticon190895}= useContext(TotalContext) as TotalContextProps;
  const {icon2398a3, seticon2398a3}= useContext(TotalContext) as TotalContextProps;
  const {icon379355, seticon379355}= useContext(TotalContext) as TotalContextProps;
  const {icon4c9c0e, seticon4c9c0e}= useContext(TotalContext) as TotalContextProps;
  const {text285d97, settext285d97}= useContext(TotalContext) as TotalContextProps;
  const {text16d8c2, settext16d8c2}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Veracious:AFVK:v1",componentId:"612784f75f094475b337e4efaad0bc8a",from:"GroupBackground1",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("third")){
      setthirde7680({...thirde7680,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("four")){
      setfour05c92({...four05c92,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("icon1")){
      seticon190895({...icon190895,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("icon2")){
      seticon2398a3({...icon2398a3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("icon3")){
      seticon379355({...icon379355,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("icon4")){
      seticon4c9c0e({...icon4c9c0e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("text2")){
      settext285d97({...text285d97,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("text1")){
      settext16d8c2({...text16d8c2,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['backgorund']  = backgorunde9308,
      codeStates['setbackgorund'] = setbackgorunde9308,
      codeStates['background1']  = background10bc8a,
      codeStates['setbackground1'] = setbackground10bc8a,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const background10bc8aRef = useRef<any>(null);
  const handleClearSearch = () => {
    background10bc8aRef.current?.setSearchParams();
    background10bc8aRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(background10bc8a) && Object.keys(background10bc8a)?.length>0)
      {
        setbackground10bc8a({})
      }
    }else 
      prevRefreshRef.current= true
  }, [background10bc8aProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '125 / 470',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'',
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
          {allowedControls.includes("third") ?<Textthird   /* e7680 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("four") ?<Textfour   /* 05c92 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("icon1")?<Iconicon1 /* 90895 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("icon2")?<Iconicon2 /* 398a3 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("icon3")?<Iconicon3 /* 79355 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("icon4")?<Iconicon4 /* c9c0e */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("text2") ?<Texttext2   /* 85d97 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("text1") ?<Texttext1   /* 6d8c2 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupbackground1
