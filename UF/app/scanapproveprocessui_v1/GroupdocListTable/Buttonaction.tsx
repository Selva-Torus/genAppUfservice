'use client'




import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import {commonSepareteDataFromTheObject, eventFunction, filterByKeys } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import UOmapperData from '@/context/dfdmapperContolnames.json';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable  from '@/app/utils/evaluateDecisionTable';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { getGridPositionFromOrder } from '@/app/utils/getGridPositionFromOrder';
import { Scan } from '@/app/utils/scanService';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { XMLParser } from 'fast-xml-parser'

    

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
 

const Buttonaction = ({ mainData,lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: { mainData:any,lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any,controlData:any}) => {
  const token:string = getCookie('token');
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const decodedTokenObj:any = decodeToken(token);
  const createdBy : string = decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();

  let code:string = "";
  const prevRefreshRef = useRef(false);
  const [ruleData,setRulseData]=useState<any>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const savedData=useRef<Record<string, any>>({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast : Function=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState<boolean>(true);
  const lockMode:any = lockedData?.lockMode;
  const [loading, setLoading] = useState<boolean>(false);
  const routes : AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData : any = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<string>("");
  const [gridPosition, setGridPosition] = useState<any>({ gridColumn: '1 / 3', gridRow: '1 / 12' });
  ////showComponentAsPopup || showArtifactAsModal
    
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
  const {document_list38c6eProps, setdocument_list38c6eProps}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97, setdoclisttable56e97}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97Props, setdoclisttable56e97Props}= useContext(TotalContext) as TotalContextProps;
  const {filename7c104, setfilename7c104}= useContext(TotalContext) as TotalContextProps;
  const {actionf530a, setactionf530a}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827, setvalidation_listae827}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827Props, setvalidation_listae827Props}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7, setvaldnlisttable17ec7}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7Props, setvaldnlisttable17ec7Props}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944, setcomment_list72944}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944Props, setcomment_list72944Props}= useContext(TotalContext) as TotalContextProps;
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


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
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
      codeStates['document_list38c6e'] = document_list38c6eProps,
      codeStates['setdocument_list38c6e'] = setdocument_list38c6eProps,
      codeStates['doclisttable'] = doclisttable56e97,
      codeStates['setdoclisttable'] = setdoclisttable56e97,
      codeStates['doclisttable56e97'] = doclisttable56e97Props,
      codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
      codeStates['filename'] = filename7c104,
      codeStates['setfilename'] = setfilename7c104,
      codeStates['action'] = actionf530a,
      codeStates['setaction'] = setactionf530a,
      codeStates['validation_list'] = validation_listae827,
      codeStates['setvalidation_list'] = setvalidation_listae827,
      codeStates['validation_listae827'] = validation_listae827Props,
      codeStates['setvalidation_listae827'] = setvalidation_listae827Props,
      codeStates['valdnlisttable'] = valdnlisttable17ec7,
      codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
      codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
      codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
      codeStates['comment_list'] = comment_list72944,
      codeStates['setcomment_list'] = setcomment_list72944,
      codeStates['comment_list72944'] = comment_list72944Props,
      codeStates['setcomment_list72944'] = setcomment_list72944Props,
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
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "0999fb419263477bb8b19cf211256e97",
        "0858bc7ef7374dc9a2ce07224d9f530a"
      );
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
      setPaginationData((pre: any) => ({
      ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 1,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 1000
    }))
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "actionf530a") {
        handleClick();
      }
    });
  },[currentToken,memoryVariables])

  useEffect(()=>{
  },[actionf530a?.refresh])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans : any[] = [];
    let id : string = "";
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }

  const handleClick=async()=>{
    try{  
      setIsProcessing(true);
      await delay(1000);
      await handleCustomCode();
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }finally{
      setIsProcessing(false);
    }
  }

 if (actionf530a?.isHidden) {
    return <></>
  }
 
  return (
    <div>
        {showFlag && <Button 
          ref={buttonRef}
          className="!bg-white  !text-black"
          onClick={handleClick}
          view='action'
          disabled={ true }
          pin='circle-circle'
          contentAlign={"center"}
          icon="MdDelete"
          iconDisplay='Icon only'
        >
          {keyset("Action")}
        </Button>}
      </div>
    
  )
}

export default Buttonaction

