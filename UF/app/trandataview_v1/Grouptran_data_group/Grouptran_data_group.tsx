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
import Groupreq_data_group  from "../Groupreq_data_group/Groupreq_data_group";
import Groupres_data_group  from "../Groupres_data_group/Groupres_data_group";
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
import Texttransaction_log_label  from "./Texttransaction_log_label";
import Dividerdivider_top  from "./Dividerdivider_top";
import Dividerdivider_bottom  from "./Dividerdivider_bottom";
import Buttoncancel_btn  from "./Buttoncancel_btn";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptran_data_group = ({lockedData={},setLockedData,primaryTableData={},tableData=[],setTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData: groupDataProp={}, controlData: controlDataProp={}}:any)=> {
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
      "transaction_log_label",
      "divider_top",
      "divider_bottom",
      "cancel_btn"
    ],
    "allowedGroups": [
      "canvas",
      "tran_data_group",
      "req_data_group",
      "res_data_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operational Officer": {
    "allowedControls": [
      "transaction_log_label",
      "divider_top",
      "divider_bottom",
      "cancel_btn"
    ],
    "allowedGroups": [
      "canvas",
      "tran_data_group",
      "req_data_group",
      "res_data_group"
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
  const {tran_data_group84f25, settran_data_group84f25}= useContext(TotalContext) as TotalContextProps;
  const {tran_data_group84f25Props, settran_data_group84f25Props}= useContext(TotalContext) as TotalContextProps;
  const {transaction_log_label7b760, settransaction_log_label7b760}= useContext(TotalContext) as TotalContextProps;
  const {divider_topf46a0, setdivider_topf46a0}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7, setreq_data_group8d4d7}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7Props, setreq_data_group8d4d7Props}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75a, setres_data_group9d75a}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75aProps, setres_data_group9d75aProps}= useContext(TotalContext) as TotalContextProps;
  const {divider_bottom6920d, setdivider_bottom6920d}= useContext(TotalContext) as TotalContextProps;
  const {cancel_btn5e840, setcancel_btn5e840}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [ruleData,setRuleData]=useState<any>([])
  const [open, setOpen] = React.useState(false);
  const {trandataview_v1, settrandataview_v1} = useContext(TotalContext) as TotalContextProps;
  const checkOrchestrationData = async (): Promise<{ groupData: any; controlData: any }> => {
  if (Object.keys(groupData).length > 0) {
    return { groupData, controlData } 
  };
  const data: any = await fetchBatchData(
    'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:tranDataView:AFVK:v1',
    [user],
    'GroupTranDataGroup',
    token
  );
    const resolved = { groupData: data.groupData || {}, controlData: data.controlData || {} };
    setGroupData(resolved.groupData);
    setControlData(resolved.controlData);
    return resolved;
  };
  async function securityCheck() {
  const { groupData: currentGroupData } = await checkOrchestrationData();
  let orchestrationData:any = getGroupOrchestrationData(currentGroupData, "548f837ab1014476af45ffa25dd84f25");
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
    settran_data_group84f25Props((pre:any)=>({...pre,isHaveRule:true}))
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});
    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("transaction_log_label")){
      settransaction_log_label7b760({...transaction_log_label7b760,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("divider_top")){
      setdivider_topf46a0({...divider_topf46a0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("req_data_group")){
      setreq_data_group8d4d7({...req_data_group8d4d7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("res_data_group")){
      setres_data_group9d75a({...res_data_group9d75a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("divider_bottom")){
      setdivider_bottom6920d({...divider_bottom6920d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cancel_btn")){
      setcancel_btn5e840({...cancel_btn5e840,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
        codeStates['tran_data_group'] = tran_data_group84f25,
        codeStates['settran_data_group'] = settran_data_group84f25,
        codeStates['tran_data_group84f25'] = tran_data_group84f25Props,
        codeStates['settran_data_group84f25'] = settran_data_group84f25Props,
        codeStates['transaction_log_label'] = transaction_log_label7b760,
        codeStates['settransaction_log_label'] = settransaction_log_label7b760,
        codeStates['divider_top'] = divider_topf46a0,
        codeStates['setdivider_top'] = setdivider_topf46a0,
        codeStates['req_data_group'] = req_data_group8d4d7,
        codeStates['setreq_data_group'] = setreq_data_group8d4d7,
        codeStates['req_data_group8d4d7'] = req_data_group8d4d7Props,
        codeStates['setreq_data_group8d4d7'] = setreq_data_group8d4d7Props,
        codeStates['res_data_group'] = res_data_group9d75a,
        codeStates['setres_data_group'] = setres_data_group9d75a,
        codeStates['res_data_group9d75a'] = res_data_group9d75aProps,
        codeStates['setres_data_group9d75a'] = setres_data_group9d75aProps,
        codeStates['divider_bottom'] = divider_bottom6920d,
        codeStates['setdivider_bottom'] = setdivider_bottom6920d,
        codeStates['cancel_btn'] = cancel_btn5e840,
        codeStates['setcancel_btn'] = setcancel_btn5e840,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const handleOnClick= async (selectedItem:any, selectedIndex?: number)=>{

  }
  const tran_data_group84f25Ref = useRef<any>(null);
  const handleClearSearch = () => {
    tran_data_group84f25Ref.current?.setSearchParams();
    tran_data_group84f25Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tran_data_group84f25) && Object.keys(tran_data_group84f25)?.length>0)
      {
        settran_data_group84f25({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tran_data_group84f25Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 205',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '0px',
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
        {allowedComponent.includes("req_data_group")  &&<Groupreq_data_group  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          tableData={tableData}
          setTableData={setTableData}
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}
          groupData={groupData}
          controlData={controlData}        />}
        {allowedComponent.includes("res_data_group")  &&<Groupres_data_group  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          tableData={tableData}
          setTableData={setTableData}
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}
          groupData={groupData}
          controlData={controlData}        />}
          {allowedControls.includes("transaction_log_label") ?<Texttransaction_log_label   /* 7b760 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("divider_top") ?<Dividerdivider_top   /* f46a0 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("divider_bottom") ?<Dividerdivider_bottom   /* 6920d */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {        ((ruleData?.length>0 && "cancel_btn" in ButtonGoRuleData)?ButtonGoRuleData["cancel_btn"]:true) && 
          allowedControls.includes("cancel_btn")  ?            <Buttoncancel_btn tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} controlData={controlData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Grouptran_data_group
