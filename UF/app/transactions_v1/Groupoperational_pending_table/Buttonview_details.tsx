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
 

const Buttonview_details = ({ mainData,lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: { mainData:any,lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any,controlData:any}) => {
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
  const {scanapproveprocessui_v1Props, setscanapproveprocessui_v1Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['tran_main_group'] = tran_main_group1dc7f,
      codeStates['settran_main_group'] = settran_main_group1dc7f,
      codeStates['tran_main_group1dc7f'] = tran_main_group1dc7fProps,
      codeStates['settran_main_group1dc7f'] = settran_main_group1dc7fProps,
      codeStates['tran_tab_group'] = tran_tab_group08b64,
      codeStates['settran_tab_group'] = settran_tab_group08b64,
      codeStates['tran_tab_group08b64'] = tran_tab_group08b64Props,
      codeStates['settran_tab_group08b64'] = settran_tab_group08b64Props,
      codeStates['view_all_tab'] = view_all_tab4a963,
      codeStates['setview_all_tab'] = setview_all_tab4a963,
      codeStates['view_all_tab4a963'] = view_all_tab4a963Props,
      codeStates['setview_all_tab4a963'] = setview_all_tab4a963Props,
      codeStates['view_all_table'] = view_all_tablec9e87,
      codeStates['setview_all_table'] = setview_all_tablec9e87,
      codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
      codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
      codeStates['view_all_journey_group'] = view_all_journey_group67ce4,
      codeStates['setview_all_journey_group'] = setview_all_journey_group67ce4,
      codeStates['view_all_journey_group67ce4'] = view_all_journey_group67ce4Props,
      codeStates['setview_all_journey_group67ce4'] = setview_all_journey_group67ce4Props,
      codeStates['failure_queue_tab'] = failure_queue_tab69f01,
      codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
      codeStates['failure_queue_tab69f01'] = failure_queue_tab69f01Props,
      codeStates['setfailure_queue_tab69f01'] = setfailure_queue_tab69f01Props,
      codeStates['failure_queue_table'] = failure_queue_tablea476f,
      codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
      codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
      codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
      codeStates['failure_queue_journey_group'] = failure_queue_journey_group36aba,
      codeStates['setfailure_queue_journey_group'] = setfailure_queue_journey_group36aba,
      codeStates['failure_queue_journey_group36aba'] = failure_queue_journey_group36abaProps,
      codeStates['setfailure_queue_journey_group36aba'] = setfailure_queue_journey_group36abaProps,
      codeStates['success_queue_tab'] = success_queue_tabef582,
      codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
      codeStates['success_queue_tabef582'] = success_queue_tabef582Props,
      codeStates['setsuccess_queue_tabef582'] = setsuccess_queue_tabef582Props,
      codeStates['success_queue_table'] = success_queue_table63aae,
      codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
      codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
      codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
      codeStates['success_queue_journey_group'] = success_queue_journey_group755eb,
      codeStates['setsuccess_queue_journey_group'] = setsuccess_queue_journey_group755eb,
      codeStates['success_queue_journey_group755eb'] = success_queue_journey_group755ebProps,
      codeStates['setsuccess_queue_journey_group755eb'] = setsuccess_queue_journey_group755ebProps,
      codeStates['return_queue_tab'] = return_queue_tab5611e,
      codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
      codeStates['return_queue_tab5611e'] = return_queue_tab5611eProps,
      codeStates['setreturn_queue_tab5611e'] = setreturn_queue_tab5611eProps,
      codeStates['return_queue_table'] = return_queue_table267f0,
      codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
      codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
      codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
      codeStates['return_queue_journey_group'] = return_queue_journey_group92c55,
      codeStates['setreturn_queue_journey_group'] = setreturn_queue_journey_group92c55,
      codeStates['return_queue_journey_group92c55'] = return_queue_journey_group92c55Props,
      codeStates['setreturn_queue_journey_group92c55'] = setreturn_queue_journey_group92c55Props,
      codeStates['operational_pending_tab'] = operational_pending_tab67331,
      codeStates['setoperational_pending_tab'] = setoperational_pending_tab67331,
      codeStates['operational_pending_tab67331'] = operational_pending_tab67331Props,
      codeStates['setoperational_pending_tab67331'] = setoperational_pending_tab67331Props,
      codeStates['operational_pending_table'] = operational_pending_table0a253,
      codeStates['setoperational_pending_table'] = setoperational_pending_table0a253,
      codeStates['operational_pending_table0a253'] = operational_pending_table0a253Props,
      codeStates['setoperational_pending_table0a253'] = setoperational_pending_table0a253Props,
      codeStates['product_code_operational_pending'] = product_code_operational_pending6ecd4,
      codeStates['setproduct_code_operational_pending'] = setproduct_code_operational_pending6ecd4,
      codeStates['channel_name_operational_pending'] = channel_name_operational_pending2ab87,
      codeStates['setchannel_name_operational_pending'] = setchannel_name_operational_pending2ab87,
      codeStates['uuid_operational_pending'] = uuid_operational_pendinga8ff6,
      codeStates['setuuid_operational_pending'] = setuuid_operational_pendinga8ff6,
      codeStates['dr_account_operational_pending'] = dr_account_operational_pending5146b,
      codeStates['setdr_account_operational_pending'] = setdr_account_operational_pending5146b,
      codeStates['dr_amount_operational_pending'] = dr_amount_operational_pending70e3f,
      codeStates['setdr_amount_operational_pending'] = setdr_amount_operational_pending70e3f,
      codeStates['cr_account_operational_pending'] = cr_account_operational_pendingf9a9c,
      codeStates['setcr_account_operational_pending'] = setcr_account_operational_pendingf9a9c,
      codeStates['cr_amount_operational_pending'] = cr_amount_operational_pendingbce21,
      codeStates['setcr_amount_operational_pending'] = setcr_amount_operational_pendingbce21,
      codeStates['remittance_info_operational_pending'] = remittance_info_operational_pending282bc,
      codeStates['setremittance_info_operational_pending'] = setremittance_info_operational_pending282bc,
      codeStates['status_operational_pending'] = status_operational_pending0df81,
      codeStates['setstatus_operational_pending'] = setstatus_operational_pending0df81,
      codeStates['new_payment_chk_approve_btn'] = new_payment_chk_approve_btn770f9,
      codeStates['setnew_payment_chk_approve_btn'] = setnew_payment_chk_approve_btn770f9,
      codeStates['new_payment_chk_reject_btn'] = new_payment_chk_reject_btn4c9a0,
      codeStates['setnew_payment_chk_reject_btn'] = setnew_payment_chk_reject_btn4c9a0,
      codeStates['view_details'] = view_details00488,
      codeStates['setview_details'] = setview_details00488,
      codeStates['operational_pending_journey_group'] = operational_pending_journey_group63667,
      codeStates['setoperational_pending_journey_group'] = setoperational_pending_journey_group63667,
      codeStates['operational_pending_journey_group63667'] = operational_pending_journey_group63667Props,
      codeStates['setoperational_pending_journey_group63667'] = setoperational_pending_journey_group63667Props,
      codeStates['technical_pending_tab'] = technical_pending_tab0b23f,
      codeStates['settechnical_pending_tab'] = settechnical_pending_tab0b23f,
      codeStates['technical_pending_tab0b23f'] = technical_pending_tab0b23fProps,
      codeStates['settechnical_pending_tab0b23f'] = settechnical_pending_tab0b23fProps,
      codeStates['technical_pending_table'] = technical_pending_table84f30,
      codeStates['settechnical_pending_table'] = settechnical_pending_table84f30,
      codeStates['technical_pending_table84f30'] = technical_pending_table84f30Props,
      codeStates['settechnical_pending_table84f30'] = settechnical_pending_table84f30Props,
      codeStates['technical_pending_journey_group'] = technical_pending_journey_groupe4f03,
      codeStates['settechnical_pending_journey_group'] = settechnical_pending_journey_groupe4f03,
      codeStates['technical_pending_journey_groupe4f03'] = technical_pending_journey_groupe4f03Props,
      codeStates['settechnical_pending_journey_groupe4f03'] = settechnical_pending_journey_groupe4f03Props,
      codeStates['scanapproveprocessui_v1'] = scanapproveprocessui_v1Props,
      codeStates['setscanapproveprocessui_v1'] = setscanapproveprocessui_v1Props,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "ec0fa3b3e01145269d4d5b2823e0a253",
        "7399f283e7b640499b32d049bde00488"
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
      if (id === "view_details00488") {
        handleClick();
      }
    });
  },[currentToken,memoryVariables])

  useEffect(()=>{
  },[view_details00488?.refresh])

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
        //onClick

    // showArtifact
    let filterProps2: any =  [];
    let filterData2 = await getFilterProps(filterProps2,mainData);
    setscanapproveprocessui_v1Props([...filterData2 ]);
    routes.push(getRouteScreenDetails('CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanApproveProcessUi:AFVK:v1', 'scanapproveprocessui_v1'));
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
    async function handleConfirmOnClick(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    } 


    async function handleConfirmOnCancel(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    }

 if (view_details00488?.isHidden) {
    return <></>
  }
 
  return (
    <div>
        {showFlag && <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='action'
          disabled= {view_details00488?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
        >
          {keyset("View Details")}
        </Button>}
      </div>
    
  )
}

export default Buttonview_details

