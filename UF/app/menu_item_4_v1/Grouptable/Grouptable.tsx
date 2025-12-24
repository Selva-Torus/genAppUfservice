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
import Tabletable  from './Tabletable';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {d6911, setd6911}= useContext(TotalContext) as TotalContextProps;
  const {1de70, set1de70}= useContext(TotalContext) as TotalContextProps;
  const {704c1, set704c1}= useContext(TotalContext) as TotalContextProps;
  const {63354, set63354}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1",componentId:"5a19e11c21e44cacbc28b907e3145205",from:"GroupTable",isTable : true,accessProfile:accessProfile},{
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
      setd6911({...d6911,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set1de70({...1de70,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set704c1({...704c1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set63354({...63354,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const table45205Ref = useRef<any>(null);
  const handleClearSearch = () => {
    table45205Ref.current?.setSearchParams();
    table45205Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(table45205) && Object.keys(table45205)?.length>0)
      {
        settable45205({})
      }
    }else 
      prevRefreshRef.current= true
  }, [table45205Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '2 / 13',
        gridRow: '151 / 332',
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
        {<Tabletable lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={table45205Ref}/>}
        <div
          className='flex justify-end gap-1 p-2'
          style={{
            gridColumn: `1 / 13`,
            gridRow: `1 / 16`,
            gap: ``,
            height: `100%`,
            overflow: 'auto'
          }}
        >
          <Text
            className='mr-auto ml-3'
            variant='display-1'
            wordBreak='break-all'
            color='primary'
          >
            Add Employee
          </Text>
      </div>
    </div>
 )
}

export default Grouptable
