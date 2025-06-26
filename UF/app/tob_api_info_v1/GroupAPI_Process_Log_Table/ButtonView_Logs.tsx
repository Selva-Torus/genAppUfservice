'use client'
import React, { useState,useEffect,useContext, useRef } from 'react'
import axios from 'axios';
import {Button,Container} from '@gravity-ui/uikit';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import TorusButton from '@/app/TorusComponents/Button';
import TorusIcon from '@/app/TorusComponents/Icon';
import PageTobConsentsLogspage from '@/app/tob_consents_logs_v1/tob_consents_logs_v1page';



    

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
 

const ButtonView_Logs =  ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keyset:any=i18n.keyset("language")
  const token:string = getCookie('token');
  const confirmMsgFlag: boolean = false
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps
  const toast:any=useInfoMsg()
  const {disable, setDisable} = useContext(TotalContext) as TotalContextProps
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("")
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  let dfKey: string | any
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const lockMode:any = lockedData.lockMode;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [loading, setLoading] = useState(false)
  const sessionInfo:any = {
    accessToken: token,
    authToken: ''
  }
  const routes = useRouter()
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
  let code:any;
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Consent_Logs_Table87d37, setConsent_Logs_Table87d37} = useContext(TotalContext) as TotalContextProps
  const {isConsent_Logs_Table87d37ContainValidataion, setConsent_Logs_Table87d37ContainValidataion} = useContext(TotalContext) as TotalContextProps;

  //another screen

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any
  const handleCustomCode=async () => {
    let code:any=allCode
    if (code=="") {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    }  else if (code != '') {
      let codeStates: any = {}
            codeStates['Info_Group']  = Info_Groupaab7f,
            codeStates['setInfo_Group'] = setInfo_Groupaab7f,
            codeStates['Summary_Table']  = Summary_Table98cb0,
            codeStates['setSummary_Table'] = setSummary_Table98cb0,
            codeStates['API_Process_Log_Table']  = API_Process_Log_Table4f441,
            codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441,
            codeStates['API_Info']  = API_Info80710,
            codeStates['setAPI_Info'] = setAPI_Info80710,
            codeStates['Consent_Logs_Table']  = Consent_Logs_Table87d37,
            codeStates['setConsent_Logs_Table'] = setConsent_Logs_Table87d37,
        customCode = codeExecution(code,codeStates)
        return customCode
    }
  }
  const handleMapper=async () => {
    try{
      let orchestrationBody:any = {
          key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",
          componentId: "c22f5cc4649840d08ebe8074d414f441",
          controlId: "1d7250ae637845238ec33eb9c93e088f",
          isTable: false,
          from:"ButtonView Logs",
          accessProfile:accessProfile
        }
        if (encryptionFlagCont) {
          orchestrationBody["dpdKey"] = encryptionDpd
          orchestrationBody["method"] = encryptionMethod
        } 
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        orchestrationBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code)
    }catch(err)
    {
        console.log(err)
    }
  }

  useEffect(()=>{
    handleMapper()
    eventBus.on("triggerButton", (id:any) => {
      if (id === "View_Logse088f") {
        buttonRef.current?.click();
      }
    });

  },[])

  useEffect(()=>{
        setDisable((prev: any) => ({ ...prev, buttonView_Logse088f:false }));
  },[refresh.buttonView_Logse088f])

  async function eventEmitter(){
    if (Array.isArray(eventEmitterData) || eventEmitterData.length > 0) {
      // Execute all requests in parallel using forEach
    eventEmitterData.forEach(async (element:any) => {
      try {
        if (encryptionFlagCont) {
            element["dpdKey"] = encryptionDpd
            element["method"] = encryptionMethod
          } 
        const te_refresh = await AxiosService.post("/te/eventEmitter", element, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (te_refresh?.data?.error === true) {
          toast(te_refresh?.data?.errorDetails?.message, 'danger');
        }
      } catch (error) {
        console.error("Error in eventEmitter:", error);
      }
    });
    }
  }
  const handleClick=async()=>{
    if(isAPI_Process_Log_Table4f441ContainValidataion?.validation==true && isAPI_Process_Log_Table4f441ContainValidataion?.required==true || isAPI_Process_Log_Table4f441ContainValidataion?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
    } 
    await handleCustomCode()
    let saveCheck=false
    Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger')
      return
    }
    try{  
    // showArtifactAsModal
    setShowProfileAsModalOpen(true)
    }catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger')
      setLoading(false)
    }
  }
  const handleBlur=(e:any)=>{
    let code:any=allCode
    if (code=="") {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    }  else if (code != '') {
      let codeStates: any = {}
      codeStates['Info_Group']  = Info_Groupaab7f,
      codeStates['setInfo_Group'] = setInfo_Groupaab7f,
      codeStates['Summary_Table']  = Summary_Table98cb0,
      codeStates['setSummary_Table'] = setSummary_Table98cb0,
      codeStates['API_Process_Log_Table']  = API_Process_Log_Table4f441,
      codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441,
      codeStates['API_Info']  = API_Info80710,
      codeStates['setAPI_Info'] = setAPI_Info80710,
      codeStates['Consent_Logs_Table']  = Consent_Logs_Table87d37,
      codeStates['setConsent_Logs_Table'] = setConsent_Logs_Table87d37,
      codeExecution(code,codeStates)
    }
  }
  async function handleConfirmOnClick(){
  } 


 if (hide.buttonView_Logse088f) {
    return <></>
  }
  return (
    <div className="col-start-11 col-end-13 row-start-3 row-end-3 gap-10px" >
      <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
        <div className='flex h-[30px] w-full justify-end'>
          <button
            className='flex w-[30px] justify-end'
            onClick={() => setShowProfileAsModalOpen(false)}
          >
            X
          </button>
        </div>
        <PageTobConsentsLogspage/>
      </Modal>
        <TorusButton 
          ref={buttonRef}
          className="w-full"
          onClick={handleClick}
          onBlur={handleBlur}
          disabled={disable.buttonView_Logse088f|| false }
        >
              {keyset("View Logs")}
        </TorusButton>
    </div>
  )
}
export default ButtonView_Logs