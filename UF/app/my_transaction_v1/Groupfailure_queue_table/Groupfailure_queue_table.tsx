'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { AxiosService } from '@/app/components/axiosService';
import { api_paginationDto, uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable, { evaluateDecisionForDynamicActions } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import Tablefailure_queue_table  from './Tablefailure_queue_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupfailure_queue_table = ({lockedData={},setLockedData,primaryTableData={},tableData=[],setTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData={}, controlData={}}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const [showFlag, setShowFlag] = React.useState<string>("");
  const securityData:any={
  "IT Team": {
    "allowedControls": [
      "product_code_failure_queue",
      "channel_name_failure_queue",
      "uuid_failure_queue",
      "dr_account_failure_queue",
      "dr_amount_failure_queue",
      "cr_account_failure_queue",
      "cr_amount_failure_queue",
      "remittance_info_failure_queue",
      "status_failure_queue"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Business Team": {
    "allowedControls": [
      "product_code_failure_queue",
      "channel_name_failure_queue",
      "uuid_failure_queue",
      "dr_account_failure_queue",
      "dr_amount_failure_queue",
      "cr_account_failure_queue",
      "cr_amount_failure_queue",
      "remittance_info_failure_queue",
      "status_failure_queue"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operation Team": {
    "allowedControls": [
      "product_code_failure_queue",
      "channel_name_failure_queue",
      "uuid_failure_queue",
      "dr_account_failure_queue",
      "dr_amount_failure_queue",
      "cr_account_failure_queue",
      "cr_amount_failure_queue",
      "remittance_info_failure_queue",
      "status_failure_queue"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
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
  const [ButtonGoRuleData,setButtonGoRuleData]=useState<any>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
 /////////////
   //another screen
  const {tran_main_group1dc7f, settran_main_group1dc7f}= useContext(TotalContext) as TotalContextProps;
  const {tran_main_group1dc7fProps, settran_main_group1dc7fProps}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64, settran_tab_group08b64}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64Props, settran_tab_group08b64Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab4a963, setview_all_tab4a963}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab4a963Props, setview_all_tab4a963Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87, setview_all_tablec9e87}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87Props, setview_all_tablec9e87Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01Props, setfailure_queue_tab69f01Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {product_code_failure_queue12297, setproduct_code_failure_queue12297}= useContext(TotalContext) as TotalContextProps;
  const {channel_name_failure_queue42953, setchannel_name_failure_queue42953}= useContext(TotalContext) as TotalContextProps;
  const {uuid_failure_queue03c86, setuuid_failure_queue03c86}= useContext(TotalContext) as TotalContextProps;
  const {dr_account_failure_queuef9d2d, setdr_account_failure_queuef9d2d}= useContext(TotalContext) as TotalContextProps;
  const {dr_amount_failure_queue95d4e, setdr_amount_failure_queue95d4e}= useContext(TotalContext) as TotalContextProps;
  const {cr_account_failure_queuea7246, setcr_account_failure_queuea7246}= useContext(TotalContext) as TotalContextProps;
  const {cr_amount_failure_queue57c4d, setcr_amount_failure_queue57c4d}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info_failure_queue09d7a, setremittance_info_failure_queue09d7a}= useContext(TotalContext) as TotalContextProps;
  const {status_failure_queue0aef8, setstatus_failure_queue0aef8}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582Props, setsuccess_queue_tabef582Props}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611eProps, setreturn_queue_tab5611eProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [ruleData,setRuleData]=useState<any>([])
  const [open, setOpen] = React.useState(false);
  const {transaction_v1, settransaction_v1} = useContext(TotalContext) as TotalContextProps;
  async function securityCheck() {
  const orchestrationData = getGroupOrchestrationData(groupData, "30d27f3c0b15480fac0a14f04f6a476f");
  code = orchestrationData?.data?.code;
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
  if(orchestrationData?.data?.rule?.nodes?.length > 0){
    setRuleData(orchestrationData?.data?.rule?.nodes)
    setfailure_queue_tablea476fProps((pre:any)=>({...pre,isHaveRule:true}))
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});
    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("product_code_failure_queue")){
      setproduct_code_failure_queue12297({...product_code_failure_queue12297,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("channel_name_failure_queue")){
      setchannel_name_failure_queue42953({...channel_name_failure_queue42953,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid_failure_queue")){
      setuuid_failure_queue03c86({...uuid_failure_queue03c86,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_account_failure_queue")){
      setdr_account_failure_queuef9d2d({...dr_account_failure_queuef9d2d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_amount_failure_queue")){
      setdr_amount_failure_queue95d4e({...dr_amount_failure_queue95d4e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_account_failure_queue")){
      setcr_account_failure_queuea7246({...cr_account_failure_queuea7246,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_amount_failure_queue")){
      setcr_amount_failure_queue57c4d({...cr_amount_failure_queue57c4d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("remittance_info_failure_queue")){
      setremittance_info_failure_queue09d7a({...remittance_info_failure_queue09d7a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status_failure_queue")){
      setstatus_failure_queue0aef8({...status_failure_queue0aef8,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const handleOnClick= async (selectedItem:any, selectedIndex?: number)=>{

  }
  const failure_queue_tablea476fRef = useRef<any>(null);
  const handleClearSearch = () => {
    failure_queue_tablea476fRef.current?.setSearchParams();
    failure_queue_tablea476fRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(failure_queue_tablea476f) && Object.keys(failure_queue_tablea476f)?.length>0)
      {
        setfailure_queue_tablea476f({})
      }
    }else 
      prevRefreshRef.current= true
  }, [failure_queue_tablea476fProps?.refresh,token])


  const renderBUttons=()=>{
    return (
          <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 197',
      
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
      <div className='flex flex-col h-full w-full min-w-0 overflow-auto'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tablefailure_queue_table headerButtonsRenders={renderBUttons}
        tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={failure_queue_tablea476fRef} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData} setIsProcessing={setIsProcessing} groupData={groupData} controlData={controlData}/>}
      </div>
      </div>
    </div>
 )
}

export default Groupfailure_queue_table
