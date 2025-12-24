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
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  const {c6658, setc6658}= useContext(TotalContext) as TotalContextProps;
  const {2dce4, set2dce4}= useContext(TotalContext) as TotalContextProps;
  const {6ef9b, set6ef9b}= useContext(TotalContext) as TotalContextProps;
  const {ae3e1, setae3e1}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard4:AFVK:v1",componentId:"6c583af720614965a7c381226948472d",from:"GroupTable",isTable : true,accessProfile:accessProfile},{
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
      setc6658({...c6658,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set2dce4({...2dce4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      set6ef9b({...6ef9b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("")){
      setae3e1({...ae3e1,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const table8472dRef = useRef<any>(null);
  const handleClearSearch = () => {
    table8472dRef.current?.setSearchParams();
    table8472dRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(table8472d) && Object.keys(table8472d)?.length>0)
      {
        settable8472d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [table8472dProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 7',
        gridRow: '260 / 373',
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
        {<Tabletable lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={table8472dRef}/>}
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
            Patient Data
          </Text>
      </div>
    </div>
 )
}

export default Grouptable
