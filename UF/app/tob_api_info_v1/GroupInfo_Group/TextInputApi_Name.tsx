'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TorusTextInput } from '@/app/TorusComponents/TextInput';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Button,Text } from "@gravity-ui/uikit";
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';


const TextInputApi_Name = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const {disable, setDisable} = useContext(TotalContext) as TotalContextProps
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const token: string = getCookie('token')
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language") 
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'api_name',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps;
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps;
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  //another screen

  // Validation
  schemaArray = [] ;

  const handleChange = (e: any) => {
    if(dynamicStateandType.type=="number"){
    setInfo_Groupaab7f((prev: any) => ({ ...prev, api_name: +e.target.value }))
    }
    else{
    setInfo_Groupaab7f((prev: any) => ({ ...prev, api_name: e.target.value }))
    }
  }
  const handleBlur=async () => {
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
    codeExecution(code,codeStates)
    }
  }
 
  const handleMapperValue=async()=>{
    try{
      let orchestrationBody:any = {
          key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",
          componentId: "ed921e35e20448709154d79fac3aab7f",
          controlId: "dd4fc9c1977f48a9a0b7966c9a35264d",
          isTable: false,
          from:"TextInputApi_Name",
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
      
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'api_name',type:'text'}
        type={
          name:'api_name',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.api_name.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.api_name.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.api_name.type
      }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setInfo_Groupaab7f((pre:any)=>({...pre,api_name:orchestrationData?.data?.dstData}))
      }
    }
    catch(err)
    {
      console.log(err)
    }
  }
 
    useEffect(()=>{
      handleMapperValue()
          setDisable((prev: any) => ({ ...prev, textinputApi_Name5264d:false }));
    },[refresh.textinputApi_Name5264d])

    useEffect(()=>{
        handleBlur()
    },[validateRefetch.value])

    if (hide.textinputApi_Name5264d) {
      return <></>
    }

  return (   
    <div className="col-start-1 col-end-3 row-start-3 row-end-3 gap-10px" >
      <TorusTextInput
        label={keyset("")}
        onChange= {handleChange}
        onBlur={()=>handleBlur()}
        type={dynamicStateandType.type}
        value={Info_Groupaab7f?.api_name||""}
          disabled={disable.textinputApi_Name5264d||false}
        readOnly={true} 
      />
    </div>
        
  )
}
export default TextInputApi_Name