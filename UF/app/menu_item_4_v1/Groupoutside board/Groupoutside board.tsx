'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Groupheader  from "../Groupheader/Groupheader";
import Groupside  from "../Groupside/Groupside";
import Groupcard2  from "../Groupcard2/Groupcard2";
import Groupcard3  from "../Groupcard3/Groupcard3";
import Groupcard4  from "../Groupcard4/Groupcard4";
import Groupcard1  from "../Groupcard1/Groupcard1";
import Grouptable  from "../Grouptable/Grouptable";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Text  from "./Text";
import BarChartschart  from "./BarChartschart";
import LineChartsline  from "./LineChartsline";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupoutside board = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {outside board012f9, setoutside board012f9}= useContext(TotalContext) as TotalContextProps;
  const {outside board012f9Props, setoutside board012f9Props}= useContext(TotalContext) as TotalContextProps;
  const {headera5dfc, setheadera5dfc}= useContext(TotalContext) as TotalContextProps;
  const {headera5dfcProps, setheadera5dfcProps}= useContext(TotalContext) as TotalContextProps;
  const {side5fa55, setside5fa55}= useContext(TotalContext) as TotalContextProps;
  const {side5fa55Props, setside5fa55Props}= useContext(TotalContext) as TotalContextProps;
  const {152d9, set152d9}= useContext(TotalContext) as TotalContextProps;
  const {card2a34c5, setcard2a34c5}= useContext(TotalContext) as TotalContextProps;
  const {card2a34c5Props, setcard2a34c5Props}= useContext(TotalContext) as TotalContextProps;
  const {5f38e, set5f38e}= useContext(TotalContext) as TotalContextProps;
  const {5f38eProps, set5f38eProps}= useContext(TotalContext) as TotalContextProps;
  const {card35fd72, setcard35fd72}= useContext(TotalContext) as TotalContextProps;
  const {card35fd72Props, setcard35fd72Props}= useContext(TotalContext) as TotalContextProps;
  const {0cce7, set0cce7}= useContext(TotalContext) as TotalContextProps;
  const {0cce7Props, set0cce7Props}= useContext(TotalContext) as TotalContextProps;
  const {card42e38a, setcard42e38a}= useContext(TotalContext) as TotalContextProps;
  const {card42e38aProps, setcard42e38aProps}= useContext(TotalContext) as TotalContextProps;
  const {6b783, set6b783}= useContext(TotalContext) as TotalContextProps;
  const {6b783Props, set6b783Props}= useContext(TotalContext) as TotalContextProps;
  const {card1dced1, setcard1dced1}= useContext(TotalContext) as TotalContextProps;
  const {card1dced1Props, setcard1dced1Props}= useContext(TotalContext) as TotalContextProps;
  const {dd147, setdd147}= useContext(TotalContext) as TotalContextProps;
  const {dd147Props, setdd147Props}= useContext(TotalContext) as TotalContextProps;
  const {table45205, settable45205}= useContext(TotalContext) as TotalContextProps;
  const {table45205Props, settable45205Props}= useContext(TotalContext) as TotalContextProps;
  const {chartdebed, setchartdebed}= useContext(TotalContext) as TotalContextProps;
  const {line1d22d, setline1d22d}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1",componentId:"608b841ddc674195a6ec9956809012f9",from:"GroupOutsideBoard",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("header")){
      setheadera5dfc({...headera5dfc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("side")){
      setside5fa55({...side5fa55,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set152d9({...152d9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card2")){
      setcard2a34c5({...card2a34c5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card3")){
      setcard35fd72({...card35fd72,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card4")){
      setcard42e38a({...card42e38a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("card1")){
      setcard1dced1({...card1dced1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("table")){
      settable45205({...table45205,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("chart")){
      setchartdebed({...chartdebed,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("line")){
      setline1d22d({...line1d22d,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['outside board']  = outside board012f9,
      codeStates['setoutside board'] = setoutside board012f9,
      codeStates['header']  = headera5dfc,
      codeStates['setheader'] = setheadera5dfc,
      codeStates['side']  = side5fa55,
      codeStates['setside'] = setside5fa55,
      codeStates['card2']  = card2a34c5,
      codeStates['setcard2'] = setcard2a34c5,
      codeStates['']  = 5f38e,
      codeStates['set'] = set5f38e,
      codeStates['card3']  = card35fd72,
      codeStates['setcard3'] = setcard35fd72,
      codeStates['']  = 0cce7,
      codeStates['set'] = set0cce7,
      codeStates['card4']  = card42e38a,
      codeStates['setcard4'] = setcard42e38a,
      codeStates['']  = 6b783,
      codeStates['set'] = set6b783,
      codeStates['card1']  = card1dced1,
      codeStates['setcard1'] = setcard1dced1,
      codeStates['']  = dd147,
      codeStates['set'] = setdd147,
      codeStates['table']  = table45205,
      codeStates['settable'] = settable45205,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const outside board012f9Ref = useRef<any>(null);
  const handleClearSearch = () => {
    outside board012f9Ref.current?.setSearchParams();
    outside board012f9Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(outside board012f9) && Object.keys(outside board012f9)?.length>0)
      {
        setoutside board012f9({})
      }
    }else 
      prevRefreshRef.current= true
  }, [outside board012f9Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '2 / 507',
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
        {allowedComponent.includes("header")  &&<Groupheader  
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
        {allowedComponent.includes("side")  &&<Groupside  
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
        {allowedComponent.includes("card2")  &&<Groupcard2  
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
        {allowedComponent.includes("card3")  &&<Groupcard3  
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
        {allowedComponent.includes("card4")  &&<Groupcard4  
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
        {allowedComponent.includes("card1")  &&<Groupcard1  
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
          {allowedControls.includes("") ?<Text   /* 152d9 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("chart") ?<BarChartschart /* debed */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("line") ?<LineChartsline /* 1d22d */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupoutside board
