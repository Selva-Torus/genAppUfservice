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
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import PageTransactionjourneypage2 from '@/app/transactionjourney_v1/transactionjourney_v1page';
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
 

const Buttonlog_btn = ({ mainData,lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}: { mainData:any,lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any,controlData:any}) => {
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
  const [showProfileAsModalOpen2, setShowProfileAsModalOpen2] = React.useState<boolean>(false);
    
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
  const {product_code_view_allb0df6, setproduct_code_view_allb0df6}= useContext(TotalContext) as TotalContextProps;
  const {channel_name_view_all33724, setchannel_name_view_all33724}= useContext(TotalContext) as TotalContextProps;
  const {uuid_view_allc0a46, setuuid_view_allc0a46}= useContext(TotalContext) as TotalContextProps;
  const {dr_account_view_all54da6, setdr_account_view_all54da6}= useContext(TotalContext) as TotalContextProps;
  const {dr_amount_view_all88d6b, setdr_amount_view_all88d6b}= useContext(TotalContext) as TotalContextProps;
  const {cr_account_view_alld4b39, setcr_account_view_alld4b39}= useContext(TotalContext) as TotalContextProps;
  const {cr_amount_view_all19d14, setcr_amount_view_all19d14}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info_view_all82afd, setremittance_info_view_all82afd}= useContext(TotalContext) as TotalContextProps;
  const {status_view_all47e6b, setstatus_view_all47e6b}= useContext(TotalContext) as TotalContextProps;
  const {log_btnfe134, setlog_btnfe134}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01Props, setfailure_queue_tab69f01Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582Props, setsuccess_queue_tabef582Props}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611eProps, setreturn_queue_tab5611eProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  const {transactionjourney_v1Props, settransactionjourney_v1Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_group9eb2e, settran_journey_group9eb2e}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_group9eb2eProps, settran_journey_group9eb2eProps}= useContext(TotalContext) as TotalContextProps;
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
      codeStates['product_code_view_all'] = product_code_view_allb0df6,
      codeStates['setproduct_code_view_all'] = setproduct_code_view_allb0df6,
      codeStates['channel_name_view_all'] = channel_name_view_all33724,
      codeStates['setchannel_name_view_all'] = setchannel_name_view_all33724,
      codeStates['uuid_view_all'] = uuid_view_allc0a46,
      codeStates['setuuid_view_all'] = setuuid_view_allc0a46,
      codeStates['dr_account_view_all'] = dr_account_view_all54da6,
      codeStates['setdr_account_view_all'] = setdr_account_view_all54da6,
      codeStates['dr_amount_view_all'] = dr_amount_view_all88d6b,
      codeStates['setdr_amount_view_all'] = setdr_amount_view_all88d6b,
      codeStates['cr_account_view_all'] = cr_account_view_alld4b39,
      codeStates['setcr_account_view_all'] = setcr_account_view_alld4b39,
      codeStates['cr_amount_view_all'] = cr_amount_view_all19d14,
      codeStates['setcr_amount_view_all'] = setcr_amount_view_all19d14,
      codeStates['remittance_info_view_all'] = remittance_info_view_all82afd,
      codeStates['setremittance_info_view_all'] = setremittance_info_view_all82afd,
      codeStates['status_view_all'] = status_view_all47e6b,
      codeStates['setstatus_view_all'] = setstatus_view_all47e6b,
      codeStates['log_btn'] = log_btnfe134,
      codeStates['setlog_btn'] = setlog_btnfe134,
      codeStates['failure_queue_tab'] = failure_queue_tab69f01,
      codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
      codeStates['failure_queue_tab69f01'] = failure_queue_tab69f01Props,
      codeStates['setfailure_queue_tab69f01'] = setfailure_queue_tab69f01Props,
      codeStates['failure_queue_table'] = failure_queue_tablea476f,
      codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
      codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
      codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
      codeStates['success_queue_tab'] = success_queue_tabef582,
      codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
      codeStates['success_queue_tabef582'] = success_queue_tabef582Props,
      codeStates['setsuccess_queue_tabef582'] = setsuccess_queue_tabef582Props,
      codeStates['success_queue_table'] = success_queue_table63aae,
      codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
      codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
      codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
      codeStates['return_queue_tab'] = return_queue_tab5611e,
      codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
      codeStates['return_queue_tab5611e'] = return_queue_tab5611eProps,
      codeStates['setreturn_queue_tab5611e'] = setreturn_queue_tab5611eProps,
      codeStates['return_queue_table'] = return_queue_table267f0,
      codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
      codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
      codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
      codeStates['transactionjourney_v1'] = transactionjourney_v1Props,
      codeStates['settransactionjourney_v1'] = settransactionjourney_v1Props,
      codeStates['tran_journey_group'] = tran_journey_group9eb2e,
      codeStates['settran_journey_group'] = settran_journey_group9eb2e,
      codeStates['tran_journey_group9eb2e'] = tran_journey_group9eb2eProps,
      codeStates['settran_journey_group9eb2e'] = settran_journey_group9eb2eProps,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "07c6ad4e30df44ddb49e3e9542ac9e87",
        "200e102e93d34a0188219753cc0fe134"
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
      if (id === "log_btnfe134") {
        handleClick();
      }
    });
  },[currentToken,memoryVariables])

  useEffect(()=>{
    setShowProfileAsModalOpen2(false)
  },[log_btnfe134?.refresh])

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

    // showArtifactAsModal
    let filterProps2:any =  [];
    let filterData2 = await getFilterProps(filterProps2,mainData);
    settransactionjourney_v1Props([...filterData2 ]);
    setShowProfileAsModalOpen2(true);
    //bindTran
    // For group or table
    settran_journey_group9eb2e(mainData||{})
    settran_journey_group9eb2eProps({...tran_journey_group9eb2eProps,presetValues:mainData||{}})  
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

 if (log_btnfe134?.isHidden) {
    return <></>
  }
 
  return (
    <div>
      <Modal 
        open={showProfileAsModalOpen2} 
        onClose={() => setShowProfileAsModalOpen2(false)}
        showOverlay = {true}
        position = {"right"}
        modalName = "transactionjourney"
        className='w-[30%] h-[] bg-gray-50 overflow-auto'
      >
        <PageTransactionjourneypage2/>
      </Modal>
        {showFlag && <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='action'
          disabled= {log_btnfe134?.isDisabled ? true : false}
          pin='brick-brick'
          contentAlign={"center"}
        >
          {keyset("Logs")}
        </Button>}
      </div>
    
  )
}

export default Buttonlog_btn

