'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Grouptable  from "../Grouptable/Grouptable";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Cardcard1  from "./Cardcard1";
import Cardcard2  from "./Cardcard2";
import Cardcard3  from "./Cardcard3";
import Cardcard4  from "./Cardcard4";
import Cardcard5  from "./Cardcard5";
import BarChartsbar  from "./BarChartsbar";
import PieChartspie  from "./PieChartspie";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupoverall = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {overall05a6d, setoverall05a6d}= useContext(TotalContext) as TotalContextProps;
  const {overall05a6dProps, setoverall05a6dProps}= useContext(TotalContext) as TotalContextProps;
  const {card119379, setcard119379}= useContext(TotalContext) as TotalContextProps;
  const {card234061, setcard234061}= useContext(TotalContext) as TotalContextProps;
  const {card31630c, setcard31630c}= useContext(TotalContext) as TotalContextProps;
  const {card480a32, setcard480a32}= useContext(TotalContext) as TotalContextProps;
  const {card5e0759, setcard5e0759}= useContext(TotalContext) as TotalContextProps;
  const {bar9c49f, setbar9c49f}= useContext(TotalContext) as TotalContextProps;
  const {pie5e484, setpie5e484}= useContext(TotalContext) as TotalContextProps;
  const {table5cf93, settable5cf93}= useContext(TotalContext) as TotalContextProps;
  const {table5cf93Props, settable5cf93Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:OpenBanking:AFVK:v1",componentId:"f0f6a573e6b64b268dd38ea18e005a6d",from:"GroupOverall",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("card1")){
      setcard119379({...card119379,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card2")){
      setcard234061({...card234061,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card3")){
      setcard31630c({...card31630c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card4")){
      setcard480a32({...card480a32,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card5")){
      setcard5e0759({...card5e0759,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("bar")){
      setbar9c49f({...bar9c49f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pie")){
      setpie5e484({...pie5e484,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("table")){
      settable5cf93({...table5cf93,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['overall']  = overall05a6d,
      codeStates['setoverall'] = setoverall05a6d,
      codeStates['table']  = table5cf93,
      codeStates['settable'] = settable5cf93,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const overall05a6dRef = useRef<any>(null);
  const handleClearSearch = () => {
    overall05a6dRef.current?.setSearchParams();
    overall05a6dRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(overall05a6d) && Object.keys(overall05a6d)?.length>0)
      {
        setoverall05a6d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [overall05a6dProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '1 / 337',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'#ffffff',
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
        {allowedComponent.includes("table")  &&<Grouptable  
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
        {allowedControls.includes("card1") ?<Cardcard1  /* 19379 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("card2") ?<Cardcard2  /* 34061 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("card3") ?<Cardcard3  /* 1630c */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("card4") ?<Cardcard4  /* 80a32 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("card5") ?<Cardcard5  /* e0759 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("bar") ?<BarChartsbar /* 9c49f */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("pie") ?<PieChartspie /* 5e484 */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupoverall
