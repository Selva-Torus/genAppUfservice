'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import Groupdocument_list  from "../Groupdocument_list/Groupdocument_list";
import Groupvalidation_list  from "../Groupvalidation_list/Groupvalidation_list";
import Groupcomment_list  from "../Groupcomment_list/Groupcomment_list";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouplist_tab_group = ({lockedData={},setLockedData,primaryTableData={},tableData=[], setTableData ,setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData={}, controlData={}}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const allStates:any=useContext(TotalContext) as TotalContextProps;
  let code:any = ``;
    const decodedTokenObj:any = decodeToken(token);

  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_scansaveprocessdfd_v1Props, setdfd_scansaveprocessdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_crbankcodedropdowndfd_v1Props, setdfd_crbankcodedropdowndfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_forexcurrencydropdowndfd_v1Props, setdfd_forexcurrencydropdowndfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_documentlistdfd_v1Props, setdfd_documentlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_errorlistdfd_v1Props, setdfd_errorlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_transactionlistdfd_v1Props, setdfd_transactionlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Operational Manager": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "controlgroup",
      "control_tab_group",
      "button_group",
      "rtgs_info",
      "allcontrols",
      "commoninfo",
      "basicinfo",
      "additionalinfo",
      "listgroup",
      "list_tab_group",
      "document_list",
      "doclisttable",
      "validation_list",
      "valdnlisttable",
      "comment_list",
      "cmntlisttable",
      "rtgs_list",
      "rtgs_list_grp",
      "rtgs_list_table",
      "rtgs_list_tab_grp",
      "documnt_list",
      "rtgs_list_doc_table_grp",
      "rtgs_lst_doc_list_table",
      "validtn_list",
      "rtgs_list_validtn_list_grp",
      "rtgs_list_validtn_table",
      "cmnt_list",
      "rtgs_list_cmnt_list_grp",
      "rtgs_list_cmnts_list"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operational Officer": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "controlgroup",
      "control_tab_group",
      "button_group",
      "rtgs_info",
      "allcontrols",
      "commoninfo",
      "basicinfo",
      "additionalinfo",
      "listgroup",
      "list_tab_group",
      "document_list",
      "doclisttable",
      "validation_list",
      "valdnlisttable",
      "comment_list",
      "cmntlisttable",
      "rtgs_list",
      "rtgs_list_grp",
      "rtgs_list_table",
      "rtgs_list_tab_grp",
      "documnt_list",
      "rtgs_list_doc_table_grp",
      "rtgs_lst_doc_list_table",
      "validtn_list",
      "rtgs_list_validtn_list_grp",
      "rtgs_list_validtn_table",
      "cmnt_list",
      "rtgs_list_cmnt_list_grp",
      "rtgs_list_cmnts_list"
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
  const {overallgroup01c61, setoverallgroup01c61}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup01c61Props, setoverallgroup01c61Props}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197, setcontrolgroupda197}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197Props, setcontrolgroupda197Props}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2, setcontrol_tab_groupbc3e2}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2Props, setcontrol_tab_groupbc3e2Props}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3e, setbutton_group74f3e}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3eProps, setbutton_group74f3eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aa, setrtgs_infofd0aa}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aaProps, setrtgs_infofd0aaProps}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54, setallcontrols71c54}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54Props, setallcontrols71c54Props}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607, setcommoninfof4607}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607Props, setcommoninfof4607Props}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198, setbasicinfo3d198}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198Props, setbasicinfo3d198Props}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894, setadditionalinfod2894}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894Props, setadditionalinfod2894Props}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbd, setlistgroupdcdbd}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbdProps, setlistgroupdcdbdProps}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905, setlist_tab_groupd6905}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905Props, setlist_tab_groupd6905Props}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6e, setdocument_list38c6e}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97, setdoclisttable56e97}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97Props, setdoclisttable56e97Props}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827, setvalidation_listae827}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7, setvaldnlisttable17ec7}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7Props, setvaldnlisttable17ec7Props}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944, setcomment_list72944}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0e, setcmntlisttable02d0e}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0eProps, setcmntlisttable02d0eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19, setrtgs_lista0a19}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19Props, setrtgs_lista0a19Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8, setrtgs_list_grpcf7d8}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8Props, setrtgs_list_grpcf7d8Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6, setrtgs_list_table7b8d6}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6Props, setrtgs_list_table7b8d6Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1, setrtgs_list_tab_grp024e1}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1Props, setrtgs_list_tab_grp024e1Props}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06, setdocumnt_list03a06}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06Props, setdocumnt_list03a06Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593, setrtgs_list_doc_table_grp8a593}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593Props, setrtgs_list_doc_table_grp8a593Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bb, setrtgs_lst_doc_list_tablee57bb}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bbProps, setrtgs_lst_doc_list_tablee57bbProps}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14, setvalidtn_lista5b14}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14Props, setvalidtn_lista5b14Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569, setrtgs_list_validtn_list_grpc5569}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569Props, setrtgs_list_validtn_list_grpc5569Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42, setrtgs_list_validtn_table39a42}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42Props, setrtgs_list_validtn_table39a42Props}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbc, setcmnt_listebbbc}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbcProps, setcmnt_listebbbcProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728, setrtgs_list_cmnt_list_grpb5728}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728Props, setrtgs_list_cmnt_list_grpb5728Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716, setrtgs_list_cmnts_list15716}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716Props, setrtgs_list_cmnts_list15716Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = getGroupOrchestrationData(
        groupData,
        "50d3126abe5b4d3bafe42aedebcd6905"
      );
  code = orchestrationData?.data?.code;
  setAllCode(orchestrationData?.data?.code||"");
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
  for(let i=0;i<tabOptions?.length;i++){
    if(allowedGroups?.find((group)=>(group==tabOptions[i]?.id)))
    {
      setlist_tab_groupd6905((pre:any)=>({...pre,list_tab_group:tabOptions[i]?.id}));
      break;
    }
  }   
  /////////////
        setdocument_list38c6e({...document_list38c6e,isDisabled:orchestrationData?.data?.readableControls.includes("document_list")});
        setvalidation_listae827({...validation_listae827,isDisabled:orchestrationData?.data?.readableControls.includes("validation_list")});
        setcomment_list72944({...comment_list72944,isDisabled:orchestrationData?.data?.readableControls.includes("comment_list")});
  //////////////
    if (code != '') {
      let codeStates: any = {};
        codeStates['selected']  = "document_list",
        codeStates['overallgroup'] = overallgroup01c61,
        codeStates['setoverallgroup'] = setoverallgroup01c61,
        codeStates['overallgroup01c61'] = overallgroup01c61Props,
        codeStates['setoverallgroup01c61'] = setoverallgroup01c61Props,
        codeStates['controlgroup'] = controlgroupda197,
        codeStates['setcontrolgroup'] = setcontrolgroupda197,
        codeStates['controlgroupda197'] = controlgroupda197Props,
        codeStates['setcontrolgroupda197'] = setcontrolgroupda197Props,
        codeStates['control_tab_group'] = control_tab_groupbc3e2,
        codeStates['setcontrol_tab_group'] = setcontrol_tab_groupbc3e2,
        codeStates['control_tab_groupbc3e2'] = control_tab_groupbc3e2Props,
        codeStates['setcontrol_tab_groupbc3e2'] = setcontrol_tab_groupbc3e2Props,
        codeStates['button_group'] = button_group74f3e,
        codeStates['setbutton_group'] = setbutton_group74f3e,
        codeStates['button_group74f3e'] = button_group74f3eProps,
        codeStates['setbutton_group74f3e'] = setbutton_group74f3eProps,
        codeStates['rtgs_info'] = rtgs_infofd0aa,
        codeStates['setrtgs_info'] = setrtgs_infofd0aa,
        codeStates['rtgs_infofd0aa'] = rtgs_infofd0aaProps,
        codeStates['setrtgs_infofd0aa'] = setrtgs_infofd0aaProps,
        codeStates['allcontrols'] = allcontrols71c54,
        codeStates['setallcontrols'] = setallcontrols71c54,
        codeStates['allcontrols71c54'] = allcontrols71c54Props,
        codeStates['setallcontrols71c54'] = setallcontrols71c54Props,
        codeStates['commoninfo'] = commoninfof4607,
        codeStates['setcommoninfo'] = setcommoninfof4607,
        codeStates['commoninfof4607'] = commoninfof4607Props,
        codeStates['setcommoninfof4607'] = setcommoninfof4607Props,
        codeStates['basicinfo'] = basicinfo3d198,
        codeStates['setbasicinfo'] = setbasicinfo3d198,
        codeStates['basicinfo3d198'] = basicinfo3d198Props,
        codeStates['setbasicinfo3d198'] = setbasicinfo3d198Props,
        codeStates['additionalinfo'] = additionalinfod2894,
        codeStates['setadditionalinfo'] = setadditionalinfod2894,
        codeStates['additionalinfod2894'] = additionalinfod2894Props,
        codeStates['setadditionalinfod2894'] = setadditionalinfod2894Props,
        codeStates['listgroup'] = listgroupdcdbd,
        codeStates['setlistgroup'] = setlistgroupdcdbd,
        codeStates['listgroupdcdbd'] = listgroupdcdbdProps,
        codeStates['setlistgroupdcdbd'] = setlistgroupdcdbdProps,
        codeStates['list_tab_group'] = list_tab_groupd6905,
        codeStates['setlist_tab_group'] = setlist_tab_groupd6905,
        codeStates['list_tab_groupd6905'] = list_tab_groupd6905Props,
        codeStates['setlist_tab_groupd6905'] = setlist_tab_groupd6905Props,
        codeStates['document_list'] = document_list38c6e,
        codeStates['setdocument_list'] = setdocument_list38c6e,
        codeStates['doclisttable'] = doclisttable56e97,
        codeStates['setdoclisttable'] = setdoclisttable56e97,
        codeStates['doclisttable56e97'] = doclisttable56e97Props,
        codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
        codeStates['validation_list'] = validation_listae827,
        codeStates['setvalidation_list'] = setvalidation_listae827,
        codeStates['valdnlisttable'] = valdnlisttable17ec7,
        codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
        codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
        codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
        codeStates['comment_list'] = comment_list72944,
        codeStates['setcomment_list'] = setcomment_list72944,
        codeStates['cmntlisttable'] = cmntlisttable02d0e,
        codeStates['setcmntlisttable'] = setcmntlisttable02d0e,
        codeStates['cmntlisttable02d0e'] = cmntlisttable02d0eProps,
        codeStates['setcmntlisttable02d0e'] = setcmntlisttable02d0eProps,
        codeStates['rtgs_list'] = rtgs_lista0a19,
        codeStates['setrtgs_list'] = setrtgs_lista0a19,
        codeStates['rtgs_lista0a19'] = rtgs_lista0a19Props,
        codeStates['setrtgs_lista0a19'] = setrtgs_lista0a19Props,
        codeStates['rtgs_list_grp'] = rtgs_list_grpcf7d8,
        codeStates['setrtgs_list_grp'] = setrtgs_list_grpcf7d8,
        codeStates['rtgs_list_grpcf7d8'] = rtgs_list_grpcf7d8Props,
        codeStates['setrtgs_list_grpcf7d8'] = setrtgs_list_grpcf7d8Props,
        codeStates['rtgs_list_table'] = rtgs_list_table7b8d6,
        codeStates['setrtgs_list_table'] = setrtgs_list_table7b8d6,
        codeStates['rtgs_list_table7b8d6'] = rtgs_list_table7b8d6Props,
        codeStates['setrtgs_list_table7b8d6'] = setrtgs_list_table7b8d6Props,
        codeStates['rtgs_list_tab_grp'] = rtgs_list_tab_grp024e1,
        codeStates['setrtgs_list_tab_grp'] = setrtgs_list_tab_grp024e1,
        codeStates['rtgs_list_tab_grp024e1'] = rtgs_list_tab_grp024e1Props,
        codeStates['setrtgs_list_tab_grp024e1'] = setrtgs_list_tab_grp024e1Props,
        codeStates['documnt_list'] = documnt_list03a06,
        codeStates['setdocumnt_list'] = setdocumnt_list03a06,
        codeStates['documnt_list03a06'] = documnt_list03a06Props,
        codeStates['setdocumnt_list03a06'] = setdocumnt_list03a06Props,
        codeStates['rtgs_list_doc_table_grp'] = rtgs_list_doc_table_grp8a593,
        codeStates['setrtgs_list_doc_table_grp'] = setrtgs_list_doc_table_grp8a593,
        codeStates['rtgs_list_doc_table_grp8a593'] = rtgs_list_doc_table_grp8a593Props,
        codeStates['setrtgs_list_doc_table_grp8a593'] = setrtgs_list_doc_table_grp8a593Props,
        codeStates['rtgs_lst_doc_list_table'] = rtgs_lst_doc_list_tablee57bb,
        codeStates['setrtgs_lst_doc_list_table'] = setrtgs_lst_doc_list_tablee57bb,
        codeStates['rtgs_lst_doc_list_tablee57bb'] = rtgs_lst_doc_list_tablee57bbProps,
        codeStates['setrtgs_lst_doc_list_tablee57bb'] = setrtgs_lst_doc_list_tablee57bbProps,
        codeStates['validtn_list'] = validtn_lista5b14,
        codeStates['setvalidtn_list'] = setvalidtn_lista5b14,
        codeStates['validtn_lista5b14'] = validtn_lista5b14Props,
        codeStates['setvalidtn_lista5b14'] = setvalidtn_lista5b14Props,
        codeStates['rtgs_list_validtn_list_grp'] = rtgs_list_validtn_list_grpc5569,
        codeStates['setrtgs_list_validtn_list_grp'] = setrtgs_list_validtn_list_grpc5569,
        codeStates['rtgs_list_validtn_list_grpc5569'] = rtgs_list_validtn_list_grpc5569Props,
        codeStates['setrtgs_list_validtn_list_grpc5569'] = setrtgs_list_validtn_list_grpc5569Props,
        codeStates['rtgs_list_validtn_table'] = rtgs_list_validtn_table39a42,
        codeStates['setrtgs_list_validtn_table'] = setrtgs_list_validtn_table39a42,
        codeStates['rtgs_list_validtn_table39a42'] = rtgs_list_validtn_table39a42Props,
        codeStates['setrtgs_list_validtn_table39a42'] = setrtgs_list_validtn_table39a42Props,
        codeStates['cmnt_list'] = cmnt_listebbbc,
        codeStates['setcmnt_list'] = setcmnt_listebbbc,
        codeStates['cmnt_listebbbc'] = cmnt_listebbbcProps,
        codeStates['setcmnt_listebbbc'] = setcmnt_listebbbcProps,
        codeStates['rtgs_list_cmnt_list_grp'] = rtgs_list_cmnt_list_grpb5728,
        codeStates['setrtgs_list_cmnt_list_grp'] = setrtgs_list_cmnt_list_grpb5728,
        codeStates['rtgs_list_cmnt_list_grpb5728'] = rtgs_list_cmnt_list_grpb5728Props,
        codeStates['setrtgs_list_cmnt_list_grpb5728'] = setrtgs_list_cmnt_list_grpb5728Props,
        codeStates['rtgs_list_cmnts_list'] = rtgs_list_cmnts_list15716,
        codeStates['setrtgs_list_cmnts_list'] = setrtgs_list_cmnts_list15716,
        codeStates['rtgs_list_cmnts_list15716'] = rtgs_list_cmnts_list15716Props,
        codeStates['setrtgs_list_cmnts_list15716'] = setrtgs_list_cmnts_list15716Props,
      codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
     setlist_tab_groupd6905((pre:any)=>({...pre,list_tab_group:"document_list"}));
  }
  const handleOnChange=async(id?:string)=>{

     code = allCode
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['selected']  = id,
        codeStates['overallgroup'] = overallgroup01c61,
        codeStates['setoverallgroup'] = setoverallgroup01c61,
        codeStates['overallgroup01c61'] = overallgroup01c61Props,
        codeStates['setoverallgroup01c61'] = setoverallgroup01c61Props,
        codeStates['controlgroup'] = controlgroupda197,
        codeStates['setcontrolgroup'] = setcontrolgroupda197,
        codeStates['controlgroupda197'] = controlgroupda197Props,
        codeStates['setcontrolgroupda197'] = setcontrolgroupda197Props,
        codeStates['control_tab_group'] = control_tab_groupbc3e2,
        codeStates['setcontrol_tab_group'] = setcontrol_tab_groupbc3e2,
        codeStates['control_tab_groupbc3e2'] = control_tab_groupbc3e2Props,
        codeStates['setcontrol_tab_groupbc3e2'] = setcontrol_tab_groupbc3e2Props,
        codeStates['button_group'] = button_group74f3e,
        codeStates['setbutton_group'] = setbutton_group74f3e,
        codeStates['button_group74f3e'] = button_group74f3eProps,
        codeStates['setbutton_group74f3e'] = setbutton_group74f3eProps,
        codeStates['rtgs_info'] = rtgs_infofd0aa,
        codeStates['setrtgs_info'] = setrtgs_infofd0aa,
        codeStates['rtgs_infofd0aa'] = rtgs_infofd0aaProps,
        codeStates['setrtgs_infofd0aa'] = setrtgs_infofd0aaProps,
        codeStates['allcontrols'] = allcontrols71c54,
        codeStates['setallcontrols'] = setallcontrols71c54,
        codeStates['allcontrols71c54'] = allcontrols71c54Props,
        codeStates['setallcontrols71c54'] = setallcontrols71c54Props,
        codeStates['commoninfo'] = commoninfof4607,
        codeStates['setcommoninfo'] = setcommoninfof4607,
        codeStates['commoninfof4607'] = commoninfof4607Props,
        codeStates['setcommoninfof4607'] = setcommoninfof4607Props,
        codeStates['basicinfo'] = basicinfo3d198,
        codeStates['setbasicinfo'] = setbasicinfo3d198,
        codeStates['basicinfo3d198'] = basicinfo3d198Props,
        codeStates['setbasicinfo3d198'] = setbasicinfo3d198Props,
        codeStates['additionalinfo'] = additionalinfod2894,
        codeStates['setadditionalinfo'] = setadditionalinfod2894,
        codeStates['additionalinfod2894'] = additionalinfod2894Props,
        codeStates['setadditionalinfod2894'] = setadditionalinfod2894Props,
        codeStates['listgroup'] = listgroupdcdbd,
        codeStates['setlistgroup'] = setlistgroupdcdbd,
        codeStates['listgroupdcdbd'] = listgroupdcdbdProps,
        codeStates['setlistgroupdcdbd'] = setlistgroupdcdbdProps,
        codeStates['list_tab_group'] = list_tab_groupd6905,
        codeStates['setlist_tab_group'] = setlist_tab_groupd6905,
        codeStates['list_tab_groupd6905'] = list_tab_groupd6905Props,
        codeStates['setlist_tab_groupd6905'] = setlist_tab_groupd6905Props,
        codeStates['document_list'] = document_list38c6e,
        codeStates['setdocument_list'] = setdocument_list38c6e,
        codeStates['doclisttable'] = doclisttable56e97,
        codeStates['setdoclisttable'] = setdoclisttable56e97,
        codeStates['doclisttable56e97'] = doclisttable56e97Props,
        codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
        codeStates['validation_list'] = validation_listae827,
        codeStates['setvalidation_list'] = setvalidation_listae827,
        codeStates['valdnlisttable'] = valdnlisttable17ec7,
        codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
        codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
        codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
        codeStates['comment_list'] = comment_list72944,
        codeStates['setcomment_list'] = setcomment_list72944,
        codeStates['cmntlisttable'] = cmntlisttable02d0e,
        codeStates['setcmntlisttable'] = setcmntlisttable02d0e,
        codeStates['cmntlisttable02d0e'] = cmntlisttable02d0eProps,
        codeStates['setcmntlisttable02d0e'] = setcmntlisttable02d0eProps,
        codeStates['rtgs_list'] = rtgs_lista0a19,
        codeStates['setrtgs_list'] = setrtgs_lista0a19,
        codeStates['rtgs_lista0a19'] = rtgs_lista0a19Props,
        codeStates['setrtgs_lista0a19'] = setrtgs_lista0a19Props,
        codeStates['rtgs_list_grp'] = rtgs_list_grpcf7d8,
        codeStates['setrtgs_list_grp'] = setrtgs_list_grpcf7d8,
        codeStates['rtgs_list_grpcf7d8'] = rtgs_list_grpcf7d8Props,
        codeStates['setrtgs_list_grpcf7d8'] = setrtgs_list_grpcf7d8Props,
        codeStates['rtgs_list_table'] = rtgs_list_table7b8d6,
        codeStates['setrtgs_list_table'] = setrtgs_list_table7b8d6,
        codeStates['rtgs_list_table7b8d6'] = rtgs_list_table7b8d6Props,
        codeStates['setrtgs_list_table7b8d6'] = setrtgs_list_table7b8d6Props,
        codeStates['rtgs_list_tab_grp'] = rtgs_list_tab_grp024e1,
        codeStates['setrtgs_list_tab_grp'] = setrtgs_list_tab_grp024e1,
        codeStates['rtgs_list_tab_grp024e1'] = rtgs_list_tab_grp024e1Props,
        codeStates['setrtgs_list_tab_grp024e1'] = setrtgs_list_tab_grp024e1Props,
        codeStates['documnt_list'] = documnt_list03a06,
        codeStates['setdocumnt_list'] = setdocumnt_list03a06,
        codeStates['documnt_list03a06'] = documnt_list03a06Props,
        codeStates['setdocumnt_list03a06'] = setdocumnt_list03a06Props,
        codeStates['rtgs_list_doc_table_grp'] = rtgs_list_doc_table_grp8a593,
        codeStates['setrtgs_list_doc_table_grp'] = setrtgs_list_doc_table_grp8a593,
        codeStates['rtgs_list_doc_table_grp8a593'] = rtgs_list_doc_table_grp8a593Props,
        codeStates['setrtgs_list_doc_table_grp8a593'] = setrtgs_list_doc_table_grp8a593Props,
        codeStates['rtgs_lst_doc_list_table'] = rtgs_lst_doc_list_tablee57bb,
        codeStates['setrtgs_lst_doc_list_table'] = setrtgs_lst_doc_list_tablee57bb,
        codeStates['rtgs_lst_doc_list_tablee57bb'] = rtgs_lst_doc_list_tablee57bbProps,
        codeStates['setrtgs_lst_doc_list_tablee57bb'] = setrtgs_lst_doc_list_tablee57bbProps,
        codeStates['validtn_list'] = validtn_lista5b14,
        codeStates['setvalidtn_list'] = setvalidtn_lista5b14,
        codeStates['validtn_lista5b14'] = validtn_lista5b14Props,
        codeStates['setvalidtn_lista5b14'] = setvalidtn_lista5b14Props,
        codeStates['rtgs_list_validtn_list_grp'] = rtgs_list_validtn_list_grpc5569,
        codeStates['setrtgs_list_validtn_list_grp'] = setrtgs_list_validtn_list_grpc5569,
        codeStates['rtgs_list_validtn_list_grpc5569'] = rtgs_list_validtn_list_grpc5569Props,
        codeStates['setrtgs_list_validtn_list_grpc5569'] = setrtgs_list_validtn_list_grpc5569Props,
        codeStates['rtgs_list_validtn_table'] = rtgs_list_validtn_table39a42,
        codeStates['setrtgs_list_validtn_table'] = setrtgs_list_validtn_table39a42,
        codeStates['rtgs_list_validtn_table39a42'] = rtgs_list_validtn_table39a42Props,
        codeStates['setrtgs_list_validtn_table39a42'] = setrtgs_list_validtn_table39a42Props,
        codeStates['cmnt_list'] = cmnt_listebbbc,
        codeStates['setcmnt_list'] = setcmnt_listebbbc,
        codeStates['cmnt_listebbbc'] = cmnt_listebbbcProps,
        codeStates['setcmnt_listebbbc'] = setcmnt_listebbbcProps,
        codeStates['rtgs_list_cmnt_list_grp'] = rtgs_list_cmnt_list_grpb5728,
        codeStates['setrtgs_list_cmnt_list_grp'] = setrtgs_list_cmnt_list_grpb5728,
        codeStates['rtgs_list_cmnt_list_grpb5728'] = rtgs_list_cmnt_list_grpb5728Props,
        codeStates['setrtgs_list_cmnt_list_grpb5728'] = setrtgs_list_cmnt_list_grpb5728Props,
        codeStates['rtgs_list_cmnts_list'] = rtgs_list_cmnts_list15716,
        codeStates['setrtgs_list_cmnts_list'] = setrtgs_list_cmnts_list15716,
        codeStates['rtgs_list_cmnts_list15716'] = rtgs_list_cmnts_list15716Props,
        codeStates['setrtgs_list_cmnts_list15716'] = setrtgs_list_cmnts_list15716Props,
      codeExecution(code,codeStates);
    }
    setlist_tab_groupd6905((pre:any)=>({...pre,list_tab_group:id}));

  }
  const list_tab_groupd6905Ref = useRef<any>(null);
  const handleClearSearch = () => {
    list_tab_groupd6905Ref.current?.setSearchParams();
    list_tab_groupd6905Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(list_tab_groupd6905) && Object.keys(list_tab_groupd6905)?.length>0)
      {
        setlist_tab_groupd6905({})
      }
    }else 
      prevRefreshRef.current= true
  }, [list_tab_groupd6905Props?.refresh])

let tabHeaderItems : any =[
];
  let tabOptions:any=[
    {
      "id": "document_list",
      "title": "Document List",
      "content": <Groupdocument_list
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
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
    {
      "id": "validation_list",
      "title": "Validation List",
      "content": <Groupvalidation_list
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
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
    {
      "id": "comment_list",
      "title": "Comment List",
      "content": <Groupcomment_list
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
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
  ]
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 97',
        display: 'grid',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '',
        columnGap: '',
        backgroundImage:"url('')",
        backgroundColor:'#f4f5fa',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
    <Tabs
      className="!rounded-2xl p-1"
      items={tabOptions}
      security={allowedComponent}
      direction='horizontal'
      onChange={handleOnChange}
      defaultActiveId={list_tab_groupd6905?.list_tab_group || "document_list"}
      activeTab={list_tab_groupd6905?.list_tab_group || "document_list"}
      headerAlignment='left'
          />
        </div>
 )
}

export default Grouplist_tab_group
