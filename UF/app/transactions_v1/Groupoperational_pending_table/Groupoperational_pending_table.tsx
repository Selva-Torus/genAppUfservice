'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { getGroupOrchestrationData, getControlOrchestrationData, fetchBatchData } from '@/app/utils/Orchestration';
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
import evaluateDecisionTable,{ evaluateDecisionForDynamicActions,eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import Tableoperational_pending_table  from './Tableoperational_pending_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupoperational_pending_table = ({lockedData={},setLockedData,primaryTableData={},tableData=[],setTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData: groupDataProp={}, controlData: controlDataProp={}}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const user : string | undefined = decodedTokenObj?.selectedAccessProfile;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  const [groupData, setGroupData] = useState<any>(groupDataProp);
  const [controlData, setControlData] = useState<any>(controlDataProp);
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_journey_v1Props, setdfd_journey_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Operational Manager": {
    "allowedControls": [
      "product_code_operational_pending",
      "channel_name_operational_pending",
      "uuid_operational_pending",
      "dr_account_operational_pending",
      "dr_amount_operational_pending",
      "cr_account_operational_pending",
      "cr_amount_operational_pending",
      "remittance_info_operational_pending",
      "status_operational_pending",
      "new_payment_chk_approve_btn",
      "new_payment_chk_reject_btn",
      "view_details"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "view_all_journey_group",
      "failure_queue_tab",
      "failure_queue_table",
      "failure_queue_journey_group",
      "success_queue_tab",
      "success_queue_table",
      "success_queue_journey_group",
      "return_queue_tab",
      "return_queue_table",
      "return_queue_journey_group",
      "operational_pending_tab",
      "operational_pending_table",
      "operational_pending_journey_group",
      "technical_pending_tab",
      "technical_pending_table",
      "technical_pending_journey_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operational Officer": {
    "allowedControls": [
      "product_code_operational_pending",
      "channel_name_operational_pending",
      "uuid_operational_pending",
      "dr_account_operational_pending",
      "dr_amount_operational_pending",
      "cr_account_operational_pending",
      "cr_amount_operational_pending",
      "remittance_info_operational_pending",
      "status_operational_pending"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "view_all_journey_group",
      "failure_queue_tab",
      "failure_queue_table",
      "failure_queue_journey_group",
      "success_queue_tab",
      "success_queue_table",
      "success_queue_journey_group",
      "return_queue_tab",
      "return_queue_table",
      "return_queue_journey_group",
      "operational_pending_tab",
      "operational_pending_table",
      "operational_pending_journey_group",
      "technical_pending_tab",
      "technical_pending_table",
      "technical_pending_journey_group"
    ],
    "blockedControls": [
      "new_payment_chk_approve_btn",
      "new_payment_chk_reject_btn",
      "view_details"
    ],
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
  const {view_all_journey_group67ce4, setview_all_journey_group67ce4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_journey_group67ce4Props, setview_all_journey_group67ce4Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01Props, setfailure_queue_tab69f01Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_journey_group36aba, setfailure_queue_journey_group36aba}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_journey_group36abaProps, setfailure_queue_journey_group36abaProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582Props, setsuccess_queue_tabef582Props}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_journey_group755eb, setsuccess_queue_journey_group755eb}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_journey_group755ebProps, setsuccess_queue_journey_group755ebProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611eProps, setreturn_queue_tab5611eProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_journey_group92c55, setreturn_queue_journey_group92c55}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_journey_group92c55Props, setreturn_queue_journey_group92c55Props}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_tab67331, setoperational_pending_tab67331}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_tab67331Props, setoperational_pending_tab67331Props}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_table0a253, setoperational_pending_table0a253}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_table0a253Props, setoperational_pending_table0a253Props}= useContext(TotalContext) as TotalContextProps;
  const {product_code_operational_pending6ecd4, setproduct_code_operational_pending6ecd4}= useContext(TotalContext) as TotalContextProps;
  const {channel_name_operational_pending2ab87, setchannel_name_operational_pending2ab87}= useContext(TotalContext) as TotalContextProps;
  const {uuid_operational_pendinga8ff6, setuuid_operational_pendinga8ff6}= useContext(TotalContext) as TotalContextProps;
  const {dr_account_operational_pending5146b, setdr_account_operational_pending5146b}= useContext(TotalContext) as TotalContextProps;
  const {dr_amount_operational_pending70e3f, setdr_amount_operational_pending70e3f}= useContext(TotalContext) as TotalContextProps;
  const {cr_account_operational_pendingf9a9c, setcr_account_operational_pendingf9a9c}= useContext(TotalContext) as TotalContextProps;
  const {cr_amount_operational_pendingbce21, setcr_amount_operational_pendingbce21}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info_operational_pending282bc, setremittance_info_operational_pending282bc}= useContext(TotalContext) as TotalContextProps;
  const {status_operational_pending0df81, setstatus_operational_pending0df81}= useContext(TotalContext) as TotalContextProps;
  const {new_payment_chk_approve_btn770f9, setnew_payment_chk_approve_btn770f9}= useContext(TotalContext) as TotalContextProps;
  const {new_payment_chk_reject_btn4c9a0, setnew_payment_chk_reject_btn4c9a0}= useContext(TotalContext) as TotalContextProps;
  const {view_details00488, setview_details00488}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_journey_group63667, setoperational_pending_journey_group63667}= useContext(TotalContext) as TotalContextProps;
  const {operational_pending_journey_group63667Props, setoperational_pending_journey_group63667Props}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_tab0b23f, settechnical_pending_tab0b23f}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_tab0b23fProps, settechnical_pending_tab0b23fProps}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_table84f30, settechnical_pending_table84f30}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_table84f30Props, settechnical_pending_table84f30Props}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_journey_groupe4f03, settechnical_pending_journey_groupe4f03}= useContext(TotalContext) as TotalContextProps;
  const {technical_pending_journey_groupe4f03Props, settechnical_pending_journey_groupe4f03Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [ruleData,setRuleData]=useState<any>([])
  const [open, setOpen] = React.useState(false);
  const {transactionproduct_v1, settransactionproduct_v1} = useContext(TotalContext) as TotalContextProps;
  const checkOrchestrationData = async (): Promise<{ groupData: any; controlData: any }> => {
  if (Object.keys(groupData).length > 0) {
    return { groupData, controlData } 
  };
  const data: any = await fetchBatchData(
    'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:transactionProduct:AFVK:v1',
    [user],
    'GroupOperationalPendingTable',
    token
  );
    const resolved = { groupData: data.groupData || {}, controlData: data.controlData || {} };
    setGroupData(resolved.groupData);
    setControlData(resolved.controlData);
    return resolved;
  };
  async function securityCheck() {
  const { groupData: currentGroupData } = await checkOrchestrationData();
  let orchestrationData:any = getGroupOrchestrationData(currentGroupData, "ec0fa3b3e01145269d4d5b2823e0a253");
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
    setoperational_pending_table0a253Props((pre:any)=>({...pre,isHaveRule:true}))
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});
    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("product_code_operational_pending")){
      setproduct_code_operational_pending6ecd4({...product_code_operational_pending6ecd4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("channel_name_operational_pending")){
      setchannel_name_operational_pending2ab87({...channel_name_operational_pending2ab87,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid_operational_pending")){
      setuuid_operational_pendinga8ff6({...uuid_operational_pendinga8ff6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_account_operational_pending")){
      setdr_account_operational_pending5146b({...dr_account_operational_pending5146b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_amount_operational_pending")){
      setdr_amount_operational_pending70e3f({...dr_amount_operational_pending70e3f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_account_operational_pending")){
      setcr_account_operational_pendingf9a9c({...cr_account_operational_pendingf9a9c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_amount_operational_pending")){
      setcr_amount_operational_pendingbce21({...cr_amount_operational_pendingbce21,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("remittance_info_operational_pending")){
      setremittance_info_operational_pending282bc({...remittance_info_operational_pending282bc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status_operational_pending")){
      setstatus_operational_pending0df81({...status_operational_pending0df81,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("new_payment_chk_approve_btn")){
      setnew_payment_chk_approve_btn770f9({...new_payment_chk_approve_btn770f9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("new_payment_chk_reject_btn")){
      setnew_payment_chk_reject_btn4c9a0({...new_payment_chk_reject_btn4c9a0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_details")){
      setview_details00488({...view_details00488,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const handleOnClick= async (selectedItem:any, selectedIndex?: number)=>{

  }
  const operational_pending_table0a253Ref = useRef<any>(null);
  const handleClearSearch = () => {
    operational_pending_table0a253Ref.current?.setSearchParams();
    operational_pending_table0a253Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(operational_pending_table0a253) && Object.keys(operational_pending_table0a253)?.length>0)
      {
        setoperational_pending_table0a253({})
      }
    }else 
      prevRefreshRef.current= true
  }, [operational_pending_table0a253Props?.refresh,token])


  const renderBUttons=()=>{
    return (
          <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 20',
        gridRow: '1 / 192',
      
        //rowGap: '0px',
        overflow: 'visible',
        backgroundColor:'#ffffff',
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
       {<Tableoperational_pending_table headerButtonsRenders={renderBUttons}
        tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={operational_pending_table0a253Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData} setIsProcessing={setIsProcessing} groupData={groupData} controlData={controlData}/>}
      </div>
      </div>
    </div>
 )
}

export default Groupoperational_pending_table
