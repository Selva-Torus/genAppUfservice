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
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
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
import { exportJsonToExcel } from '@/app/utils/jsonToExcel';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import PageTrandataviewpage2 from '@/app/trandataview_v1/trandataview_v1page';
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
 

const Buttonview_tran_log_btn = ({ lockedData, setLockedData, tableData, setTableData, primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: { lockedData:any,setLockedData:any,tableData:any,setTableData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any,controlData:any}) => {
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

  let code:string = "//  settran_data_group((pre)=>({\r\n//   ...pre,\r\n//   source_data:pre?.source_data\r\n//   }))";
  const prevRefreshRef = useRef(false);
  const [ruleData,setRulseData]=useState<any>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const savedData=useRef<Record<string, any>>({})
  const validateRef = useRef<any>(null);
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast : Function=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState<boolean>(true);
  const [styleSate, setStyleSate] = useState<any>({})
  const lockMode:any = lockedData.lockMode;
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
  const [showProfileAsModalOpen2, setShowProfileAsModalOpen2] = React.useState<boolean>(false);
    
 /////////////
   //another screen

  const {journey_details_groupd9a0e, setjourney_details_groupd9a0e}= useContext(TotalContext) as TotalContextProps;
  const {journey_details_groupd9a0eProps, setjourney_details_groupd9a0eProps}= useContext(TotalContext) as TotalContextProps;
  const {details_labelb25b2, setdetails_labelb25b2}= useContext(TotalContext) as TotalContextProps;
  const {divider_tope6917, setdivider_tope6917}= useContext(TotalContext) as TotalContextProps;
  const {transaction_date_time_label669d7, settransaction_date_time_label669d7}= useContext(TotalContext) as TotalContextProps;
  const {status_labelf3713, setstatus_labelf3713}= useContext(TotalContext) as TotalContextProps;
  const {transaction_date_time14856, settransaction_date_time14856}= useContext(TotalContext) as TotalContextProps;
  const {status88bc7, setstatus88bc7}= useContext(TotalContext) as TotalContextProps;
  const {processed_by_label542e8, setprocessed_by_label542e8}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_label3b1b7, setdebit_account_label3b1b7}= useContext(TotalContext) as TotalContextProps;
  const {processed_byd2b69, setprocessed_byd2b69}= useContext(TotalContext) as TotalContextProps;
  const {debit_account36b40, setdebit_account36b40}= useContext(TotalContext) as TotalContextProps;
  const {currency_labele21ba, setcurrency_labele21ba}= useContext(TotalContext) as TotalContextProps;
  const {credit_account_label65c7b, setcredit_account_label65c7b}= useContext(TotalContext) as TotalContextProps;
  const {currency9c8a2, setcurrency9c8a2}= useContext(TotalContext) as TotalContextProps;
  const {credit_account0d1f4, setcredit_account0d1f4}= useContext(TotalContext) as TotalContextProps;
  const {amount_labelfd725, setamount_labelfd725}= useContext(TotalContext) as TotalContextProps;
  const {transaction_reference_labelb1ca9, settransaction_reference_labelb1ca9}= useContext(TotalContext) as TotalContextProps;
  const {amount01416, setamount01416}= useContext(TotalContext) as TotalContextProps;
  const {transaction_reference500d6, settransaction_reference500d6}= useContext(TotalContext) as TotalContextProps;
  const {divider_bottom8bad5, setdivider_bottom8bad5}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data_btne6a88, setview_msg_data_btne6a88}= useContext(TotalContext) as TotalContextProps;
  const {view_tran_log_btn9cd8c, setview_tran_log_btn9cd8c}= useContext(TotalContext) as TotalContextProps;
  const {trandataview_v1Props, settrandataview_v1Props}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7, setreq_data_group8d4d7}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7Props, setreq_data_group8d4d7Props}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75a, setres_data_group9d75a}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75aProps, setres_data_group9d75aProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const pendingAutoSearch = useRef(false);
  // keep update group state in ref to access latest state value
  const journey_details_groupd9a0eRef = useRef(journey_details_groupd9a0e);
  useEffect(() => {
    journey_details_groupd9a0eRef.current = journey_details_groupd9a0e;
    if(pendingAutoSearch.current){
      pendingAutoSearch.current = false;
      handleClick();
    }
  }, [journey_details_groupd9a0e]);
  
  //group props in ref to access latest props value
  const journey_details_groupd9a0ePropsRef = useRef(journey_details_groupd9a0eProps);
  useEffect(() => {
    journey_details_groupd9a0ePropsRef.current = journey_details_groupd9a0eProps;
  }, [journey_details_groupd9a0eProps]);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
        codeStates['journey_details_group'] = journey_details_groupd9a0e,
        codeStates['setjourney_details_group'] = setjourney_details_groupd9a0e,
        codeStates['journey_details_groupd9a0e'] = journey_details_groupd9a0eProps,
        codeStates['setjourney_details_groupd9a0e'] = setjourney_details_groupd9a0eProps,
        codeStates['details_label'] = details_labelb25b2,
        codeStates['setdetails_label'] = setdetails_labelb25b2,
        codeStates['divider_top'] = divider_tope6917,
        codeStates['setdivider_top'] = setdivider_tope6917,
        codeStates['transaction_date_time_label'] = transaction_date_time_label669d7,
        codeStates['settransaction_date_time_label'] = settransaction_date_time_label669d7,
        codeStates['status_label'] = status_labelf3713,
        codeStates['setstatus_label'] = setstatus_labelf3713,
        codeStates['transaction_date_time'] = transaction_date_time14856,
        codeStates['settransaction_date_time'] = settransaction_date_time14856,
        codeStates['status'] = status88bc7,
        codeStates['setstatus'] = setstatus88bc7,
        codeStates['processed_by_label'] = processed_by_label542e8,
        codeStates['setprocessed_by_label'] = setprocessed_by_label542e8,
        codeStates['debit_account_label'] = debit_account_label3b1b7,
        codeStates['setdebit_account_label'] = setdebit_account_label3b1b7,
        codeStates['processed_by'] = processed_byd2b69,
        codeStates['setprocessed_by'] = setprocessed_byd2b69,
        codeStates['debit_account'] = debit_account36b40,
        codeStates['setdebit_account'] = setdebit_account36b40,
        codeStates['currency_label'] = currency_labele21ba,
        codeStates['setcurrency_label'] = setcurrency_labele21ba,
        codeStates['credit_account_label'] = credit_account_label65c7b,
        codeStates['setcredit_account_label'] = setcredit_account_label65c7b,
        codeStates['currency'] = currency9c8a2,
        codeStates['setcurrency'] = setcurrency9c8a2,
        codeStates['credit_account'] = credit_account0d1f4,
        codeStates['setcredit_account'] = setcredit_account0d1f4,
        codeStates['amount_label'] = amount_labelfd725,
        codeStates['setamount_label'] = setamount_labelfd725,
        codeStates['transaction_reference_label'] = transaction_reference_labelb1ca9,
        codeStates['settransaction_reference_label'] = settransaction_reference_labelb1ca9,
        codeStates['amount'] = amount01416,
        codeStates['setamount'] = setamount01416,
        codeStates['transaction_reference'] = transaction_reference500d6,
        codeStates['settransaction_reference'] = settransaction_reference500d6,
        codeStates['divider_bottom'] = divider_bottom8bad5,
        codeStates['setdivider_bottom'] = setdivider_bottom8bad5,
        codeStates['view_msg_data_btn'] = view_msg_data_btne6a88,
        codeStates['setview_msg_data_btn'] = setview_msg_data_btne6a88,
        codeStates['view_tran_log_btn'] = view_tran_log_btn9cd8c,
        codeStates['setview_tran_log_btn'] = setview_tran_log_btn9cd8c,
        codeStates['trandataview_v1'] = trandataview_v1Props,
        codeStates['settrandataview_v1'] = settrandataview_v1Props,
        codeStates['req_data_group'] = req_data_group8d4d7,
        codeStates['setreq_data_group'] = setreq_data_group8d4d7,
        codeStates['req_data_group8d4d7'] = req_data_group8d4d7Props,
        codeStates['setreq_data_group8d4d7'] = setreq_data_group8d4d7Props,
        codeStates['res_data_group'] = res_data_group9d75a,
        codeStates['setres_data_group'] = setres_data_group9d75a,
        codeStates['res_data_group9d75a'] = res_data_group9d75aProps,
        codeStates['setres_data_group9d75a'] = setres_data_group9d75aProps,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const {tranjourneydetails_v1, settranjourneydetails_v1} = useContext(TotalContext) as TotalContextProps;
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "21c6b985251b46b2a031d20162ad9a0e",
        "93e0542e5f2347658e84247e2e19cd8c"
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

    /////////
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    const handler = (id:any) => {
      if (id === "view_tran_log_btn9cd8c") {
        handleClick();
      }
    };
    eventBus.on("triggerButton", handler);
    eventBus.emit("buttonReady", "searchcc244");
    return () => {
      eventBus.off("triggerButton", handler);
    };
  },[currentToken,memoryVariables])

  useEffect(() => {
    validateRef.current = validate;  
  }, [validate]);



  useEffect(()=>{
    if (!view_tran_log_btn9cd8c?.trigger) return;
      if(view_tran_log_btn9cd8c?.trigger){
      (async()=>{
        await handleClick();
      })();
      setview_tran_log_btn9cd8c((prev:any) => ({...prev, trigger: !prev?.trigger}));
      (async()=>{
        await handleMapper();
        pendingAutoSearch.current = true;
      })();
    }
  },[view_tran_log_btn9cd8c?.trigger])

  useEffect(()=>{
    setShowProfileAsModalOpen2(false)
    if(view_tran_log_btn9cd8c?.refresh){
    (async()=>{
      await handleMapper();
      pendingAutoSearch.current = true;
    })();
    }
  },[view_tran_log_btn9cd8c?.refresh])

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
      setjourney_details_groupd9a0e((prev: any) => ({ ...prev, view_tran_log_btn: true }));
        //onClick

    // showArtifactAsModal
    let filterProps2:any =  [];
    let filterData2 = await getFilterProps(filterProps2,journey_details_groupd9a0e);
    settrandataview_v1Props([...filterData2 ]);
    setShowProfileAsModalOpen2(true);
    //bindTran
    // For group or table
    setreq_data_group8d4d7(journey_details_groupd9a0e||{})
    setreq_data_group8d4d7Props({...req_data_group8d4d7Props,presetValues:journey_details_groupd9a0e||{}})  
    //bindTran
    // For group or table
    setres_data_group9d75a(journey_details_groupd9a0e||{})
    setres_data_group9d75aProps({...res_data_group9d75aProps,presetValues:journey_details_groupd9a0e||{}})  
      await handleCustomCode();
    }catch (err: any) {
      setIsProcessing(false);
      setjourney_details_groupd9a0e((prev: any) => ({ ...prev, view_tran_log_btn: false }));
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }finally{
      setIsProcessing(false);
      setjourney_details_groupd9a0e((prev: any) => ({ ...prev, view_tran_log_btn: false }));
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

 if (view_tran_log_btn9cd8c?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{gridColumn: `14 / 24`,gridRow: `88 / 98`, gap:``, height: `100%`, overflow: 'auto'}} 
      >
      <Modal 
        open={showProfileAsModalOpen2} 
        onClose={() => setShowProfileAsModalOpen2(false)}
        showOverlay = {true}
        position = {"left"}
        modalName = "trandataview"
        className='w-[60%] h-[] bg-gray-50 overflow-auto'
      >
        <PageTrandataviewpage2/>
      </Modal>
        {showFlag && <Button 
          ref={buttonRef}
          className="   !bg-[#2b70b3] !rounded-xl"
          onClick={handleClick}
          view='action'
          disabled= {view_tran_log_btn9cd8c?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
        >
          {keyset("View Tran Log")}
        </Button>}
      </div>
    
  )
}

export default Buttonview_tran_log_btn

