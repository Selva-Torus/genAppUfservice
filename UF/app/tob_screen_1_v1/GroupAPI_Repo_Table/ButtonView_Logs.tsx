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
 

const ButtonView_Logs =  ({mainData,setRefetch,encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
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
  let code:any;
  const {API_Report360bc, setAPI_Report360bc} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Report360bcContainValidataion, setAPI_Report360bcContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Repo_Table8836e, setAPI_Repo_Table8836e} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Repo_Table8836eContainValidataion, setAPI_Repo_Table8836eContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Connected_App_Tablecff73, setConnected_App_Tablecff73} = useContext(TotalContext) as TotalContextProps
  const {isConnected_App_Tablecff73ContainValidataion, setConnected_App_Tablecff73ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;

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
            codeStates['API_Report']  = API_Report360bc,
            codeStates['setAPI_Report'] = setAPI_Report360bc,
            codeStates['API_Repo_Table']  = API_Repo_Table8836e,
            codeStates['setAPI_Repo_Table'] = setAPI_Repo_Table8836e,
            codeStates['Connected_App_Table']  = Connected_App_Tablecff73,
            codeStates['setConnected_App_Table'] = setConnected_App_Tablecff73,
            codeStates['Info_Group']  = Info_Groupaab7f,
            codeStates['setInfo_Group'] = setInfo_Groupaab7f,
            codeStates['Summary_Table']  = Summary_Table98cb0,
            codeStates['setSummary_Table'] = setSummary_Table98cb0,
            codeStates['API_Process_Log_Table']  = API_Process_Log_Table4f441,
            codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441,
            codeStates['API_Info']  = API_Info80710,
            codeStates['setAPI_Info'] = setAPI_Info80710,
        customCode = codeExecution(code,codeStates)
        return customCode
    }
  }
  const handleMapper=async () => {
    try{
      let orchestrationBody : any= {
        key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",
        componentId: "3dde18f1597841a992060519b608836e",
        controlId: "a1ca5cee6599422a9af2516c60c316db",
        isTable: false,
        from:"ButtonView_Logs",
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
      if (id === "View_Logs316db") {
        buttonRef.current?.click();
      }
    });

  },[])

  useEffect(()=>{
        setDisable((prev: any) => ({ ...prev, buttonView_Logs316db:false }));
  },[refresh.buttonView_Logs316db])

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
    if(isAPI_Repo_Table8836eContainValidataion?.validation==true && isAPI_Repo_Table8836eContainValidataion?.required==true || isAPI_Repo_Table8836eContainValidataion?.required==true)
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
    // show as profile code
    routes.push("/tob_api_info_v1")
            // setFormData
              // for particular controller
              setInfo_Groupaab7f(mainData)
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
      codeStates['API_Report']  = API_Report360bc,
      codeStates['setAPI_Report'] = setAPI_Report360bc,
      codeStates['API_Repo_Table']  = API_Repo_Table8836e,
      codeStates['setAPI_Repo_Table'] = setAPI_Repo_Table8836e,
      codeStates['Connected_App_Table']  = Connected_App_Tablecff73,
      codeStates['setConnected_App_Table'] = setConnected_App_Tablecff73,
      codeStates['Info_Group']  = Info_Groupaab7f,
      codeStates['setInfo_Group'] = setInfo_Groupaab7f,
      codeStates['Summary_Table']  = Summary_Table98cb0,
      codeStates['setSummary_Table'] = setSummary_Table98cb0,
      codeStates['API_Process_Log_Table']  = API_Process_Log_Table4f441,
      codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441,
      codeStates['API_Info']  = API_Info80710,
      codeStates['setAPI_Info'] = setAPI_Info80710,
      codeExecution(code,codeStates)
    }
  }
  async function handleConfirmOnClick(){
  } 


 if (hide.buttonView_Logs316db) {
    return <></>
  }
  return (
    <div>
        <TorusButton 
          ref={buttonRef}
          className="w-full"
          onClick={handleClick}
          onBlur={handleBlur}
          view='outlined-utility'
          disabled={disable.buttonView_Logs316db|| false }
        >
              {keyset("View_Logs")}
        </TorusButton>
    </div>
  )
}
export default ButtonView_Logs