

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import Groupfailure_queue_table  from "../Groupfailure_queue_table/Groupfailure_queue_table";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupfailure_queue_tab = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_get_transaction_dfd_v1Props, setdfd_get_transaction_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Maker": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
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
  const {transaction_groupcc5ac, settransaction_groupcc5ac}= useContext(TotalContext) as TotalContextProps;
  const {transaction_groupcc5acProps, settransaction_groupcc5acProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125, settab_group05125}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125Props, settab_group05125Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07, setview_all_tab71a07}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07Props, setview_all_tab71a07Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4, setview_all_table648c4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4Props, setview_all_table648c4Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090, setfailure_queue_tab11090}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090Props, setfailure_queue_tab11090Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9, setfailure_queue_table449a9}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9Props, setfailure_queue_table449a9Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",componentId:"47934c15ac4c49d882d739d85d011090",from:"GroupFailureQueueTab",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("failure_queue_table")){
      setfailure_queue_table449a9({...failure_queue_table449a9,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['transaction_group']  = transaction_groupcc5ac,
      codeStates['settransaction_group'] = settransaction_groupcc5ac,
      codeStates['view_all_table']  = view_all_table648c4,
      codeStates['setview_all_table'] = setview_all_table648c4,
      codeStates['failure_queue_table']  = failure_queue_table449a9,
      codeStates['setfailure_queue_table'] = setfailure_queue_table449a9,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const failure_queue_tab11090Ref = useRef<any>(null);
  const handleClearSearch = () => {
    failure_queue_tab11090Ref.current?.setSearchParams();
    failure_queue_tab11090Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(failure_queue_tab11090) && Object.keys(failure_queue_tab11090)?.length>0)
      {
        setfailure_queue_tab11090({})
      }
    }else 
      prevRefreshRef.current= true
  }, [failure_queue_tab11090Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 2',
        gridRow: '1 / 2',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(8px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '8px',
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
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
        {allowedComponent.includes("failure_queue_table")  &&<Groupfailure_queue_table  
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
    </div>
 )
}

export default Groupfailure_queue_tab
