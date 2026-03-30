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
 

const Buttoncp_payment = ({ mainData,lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}: { mainData:any,lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any}) => {
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

  const {overallgroup4d9a0, setoverallgroup4d9a0}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup4d9a0Props, setoverallgroup4d9a0Props}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3, setitax_main_tab_group216b3}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3Props, setitax_main_tab_group216b3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_process_new_prn5597e, settab_process_new_prn5597e}= useContext(TotalContext) as TotalContextProps;
  const {tab_process_new_prn5597eProps, settab_process_new_prn5597eProps}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6, setitax_source_table1afd6}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6Props, setitax_source_table1afd6Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_credit_process_group546cc, settab_credit_process_group546cc}= useContext(TotalContext) as TotalContextProps;
  const {tab_credit_process_group546ccProps, settab_credit_process_group546ccProps}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4c, setcredit_process_table0cd4c}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4cProps, setcredit_process_table0cd4cProps}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id0eeff, setitaxst_id0eeff}= useContext(TotalContext) as TotalContextProps;
  const {prnb6d00, setprnb6d00}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code9b31c, setslip_payment_code9b31c}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_date8473b, setpayment_advice_date8473b}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pina5a64, settax_payer_pina5a64}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_namee8e84, settax_payer_full_namee8e84}= useContext(TotalContext) as TotalContextProps;
  const {total_amount99179, settotal_amount99179}= useContext(TotalContext) as TotalContextProps;
  const {cp_view07f80, setcp_view07f80}= useContext(TotalContext) as TotalContextProps;
  const {cp_log321e5, setcp_log321e5}= useContext(TotalContext) as TotalContextProps;
  const {cp_paymentcf667, setcp_paymentcf667}= useContext(TotalContext) as TotalContextProps;
  const {currency50540, setcurrency50540}= useContext(TotalContext) as TotalContextProps;
  const {trs_event_process_status332f5, settrs_event_process_status332f5}= useContext(TotalContext) as TotalContextProps;
  const {tab_view_processed_prn29a93, settab_view_processed_prn29a93}= useContext(TotalContext) as TotalContextProps;
  const {tab_view_processed_prn29a93Props, settab_view_processed_prn29a93Props}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5, setview_processed_prn_table8f5a5}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5Props, setview_processed_prn_table8f5a5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['overallgroup']  = overallgroup4d9a0,
      codeStates['setoverallgroup'] = setoverallgroup4d9a0,
      codeStates['itax_source_table']  = itax_source_table1afd6,
      codeStates['setitax_source_table'] = setitax_source_table1afd6,
      codeStates['credit_process_table']  = credit_process_table0cd4c,
      codeStates['setcredit_process_table'] = setcredit_process_table0cd4c,
      codeStates['view_processed_prn_table']  = view_processed_prn_table8f5a5,
      codeStates['setview_processed_prn_table'] = setview_processed_prn_table8f5a5,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1",
          componentId: "650d3fd3b4d54b6682fc16d68ef0cd4c",
          controlId: "202e00151b444b81be79af10e89cf667",
          isTable: false,
          from:"ButtonPayment",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
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
      if (id === "cp_paymentcf667") {
        handleClick();
      }
    });
  },[cp_paymentcf667?.refresh,currentToken])

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

 if (cp_paymentcf667?.isHidden) {
    return <></>
  }
 
  return (
    <div>
        {showFlag && <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='action'
          disabled= {cp_paymentcf667?.isDisabled ? true : false}
          pin='brick-brick'
          contentAlign={"center"}
        >
          {keyset("Payment")}
        </Button>}
      </div>
    
  )
}

export default Buttoncp_payment

