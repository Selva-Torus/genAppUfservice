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
import Textfirst  from "./Textfirst";
import Imageimage  from "./Imageimage";
import Textsecond  from "./Textsecond";
import Buttonthird  from "./Buttonthird";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupbackgorund = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {first3cbfd, setfirst3cbfd}= useContext(TotalContext) as TotalContextProps;
  const {image7e984, setimage7e984}= useContext(TotalContext) as TotalContextProps;
  const {secondd89c4, setsecondd89c4}= useContext(TotalContext) as TotalContextProps;
  const {third76d18, setthird76d18}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8a, setbackground10bc8a}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8aProps, setbackground10bc8aProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Veracious:AFVK:v1",componentId:"a1762804fecf4c11a9bf912a71be9308",from:"GroupBackgorund",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("first")){
      setfirst3cbfd({...first3cbfd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("image")){
      setimage7e984({...image7e984,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("second")){
      setsecondd89c4({...secondd89c4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("third")){
      setthird76d18({...third76d18,isDisabled:true});
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
  const backgorunde9308Ref = useRef<any>(null);
  const handleClearSearch = () => {
    backgorunde9308Ref.current?.setSearchParams();
    backgorunde9308Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(backgorunde9308) && Object.keys(backgorunde9308)?.length>0)
      {
        setbackgorunde9308({})
      }
    }else 
      prevRefreshRef.current= true
  }, [backgorunde9308Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '3 / 124',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'',
        backgroundImage:'url("https://cdns3dfsdev.toruslowcode.com/torus/9.1/CT003/resources/images/Background.png")',
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
          {allowedControls.includes("first") ?<Textfirst   /* 3cbfd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("image")?<Imageimage /* 7e984 */ encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedControls.includes("second") ?<Textsecond   /* d89c4 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("third")  ?<Buttonthird lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
    </div>
 )
}

export default Groupbackgorund
