

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
import Tablefailure_queue_table  from './Tablefailure_queue_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupfailure_queue_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
    "allowedControls": [
      "logs_failure_queue",
      "view_failure_queue",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info"
    ],
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
    "allowedControls": [
      "logs_failure_queue",
      "view_failure_queue",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info"
    ],
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
    "allowedControls": [
      "logs_failure_queue",
      "view_failure_queue",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info"
    ],
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
  const {logs_failure_queue7e78b, setlogs_failure_queue7e78b}= useContext(TotalContext) as TotalContextProps;
  const {view_failure_queue04cba, setview_failure_queue04cba}= useContext(TotalContext) as TotalContextProps;
  const {product_codea1bf6, setproduct_codea1bf6}= useContext(TotalContext) as TotalContextProps;
  const {uuidd1032, setuuidd1032}= useContext(TotalContext) as TotalContextProps;
  const {channel_name0e1ca, setchannel_name0e1ca}= useContext(TotalContext) as TotalContextProps;
  const {settlement_date202a2, setsettlement_date202a2}= useContext(TotalContext) as TotalContextProps;
  const {dr_accountf4175, setdr_accountf4175}= useContext(TotalContext) as TotalContextProps;
  const {dr_amountaa5df, setdr_amountaa5df}= useContext(TotalContext) as TotalContextProps;
  const {dr_currency3c79d, setdr_currency3c79d}= useContext(TotalContext) as TotalContextProps;
  const {cr_account6ee89, setcr_account6ee89}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info74cbb, setremittance_info74cbb}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",componentId:"7fdf1711296241a49cf31883f93449a9",from:"GroupFailureQueueTable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("logs_failure_queue")){
      setlogs_failure_queue7e78b({...logs_failure_queue7e78b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_failure_queue")){
      setview_failure_queue04cba({...view_failure_queue04cba,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_codea1bf6({...product_codea1bf6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid")){
      setuuidd1032({...uuidd1032,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("channel_name")){
      setchannel_name0e1ca({...channel_name0e1ca,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("settlement_date")){
      setsettlement_date202a2({...settlement_date202a2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_account")){
      setdr_accountf4175({...dr_accountf4175,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_amount")){
      setdr_amountaa5df({...dr_amountaa5df,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_currency")){
      setdr_currency3c79d({...dr_currency3c79d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_account")){
      setcr_account6ee89({...cr_account6ee89,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("remittance_info")){
      setremittance_info74cbb({...remittance_info74cbb,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const failure_queue_table449a9Ref = useRef<any>(null);
  const handleClearSearch = () => {
    failure_queue_table449a9Ref.current?.setSearchParams();
    failure_queue_table449a9Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(failure_queue_table449a9) && Object.keys(failure_queue_table449a9)?.length>0)
      {
        setfailure_queue_table449a9({})
      }
    }else 
      prevRefreshRef.current= true
  }, [failure_queue_table449a9Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 151',
      
        //rowGap: '0px',
        overflow: 'visible',
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
        <CommonHeaderAndTooltip
        >
        <div className='flex flex-col h-full'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tablefailure_queue_table lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={failure_queue_table449a9Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Groupfailure_queue_table
