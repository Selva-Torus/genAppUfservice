
'use client'
import React, { useState,useContext,useEffect, useRef } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextArea } from '@/components/TextArea';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";


const TextAreareasonDesc = ({checkToAdd,setCheckToAdd,encryptionFlagCompData,setIsProcessing,controlData}:any) => {
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const decodedTokenObj:any = decodeToken(token);
  let code:string="";
  const prevRefreshRef = useRef<any>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'reasondesc',type:"string"})
  const [allCode,setAllCode] = useState<string>("")
  const toast : Function = useInfoMsg()
  const routes : AppRouterInstance = useRouter()
 /////////////
   //another screen
  const {overallgroup05ff6, setoverallgroup05ff6}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup05ff6Props, setoverallgroup05ff6Props}= useContext(TotalContext) as TotalContextProps;
  const {text9205d, settext9205d}= useContext(TotalContext) as TotalContextProps;
  const {reasondesc20b1a, setreasondesc20b1a}= useContext(TotalContext) as TotalContextProps;
  const {cancel7f45a, setcancel7f45a}= useContext(TotalContext) as TotalContextProps;
  const {continue599e4, setcontinue599e4}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData:any = getControlOrchestrationData(
        controlData,
        "8741182b2ce945e89bbf9d7810f05ff6",
        "56497782ba684d58aa261afcb0720b1a"
      );
      if(orchestrationData?.data?.schemaData){
        let allSchemas:any[]=orchestrationData?.data?.schemaData?.at(0)?.schema||[]
        let type:any={name:'reasondesc',type:'text'}
        allSchemas.map((item:any)=>{
          if(item.name=='reasondesc')
          {
            type=item
  
          }
        })
        setDynamicStateandType(type)       
      }
      if(orchestrationData?.data?.schemaData?.at(0).schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'reasondesc',type:'text'}
        type={
          name:'reasondesc',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.reasondesc.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.reasondesc.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.reasondesc.type
        }
        setDynamicStateandType(type)
       
      }
      if(orchestrationData?.data?.code)
      {
        setAllCode(orchestrationData?.data?.code)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[reasondesc20b1a?.refresh])
  
  useEffect(()=>{
    if (prevRefreshRef.current) {
      setoverallgroup05ff6((pre:any)=>({...pre,reasondesc:""}))
    }else 
      prevRefreshRef.current= true
  },[reasondesc20b1a?.refresh])

  const handleBlur=async(e:any)=>{
    code = allCode;
    if (code != '') {
      let codeStates: any = {};
        codeStates['overallgroup'] = overallgroup05ff6,
        codeStates['setoverallgroup'] = setoverallgroup05ff6,
        codeStates['overallgroup05ff6'] = overallgroup05ff6Props,
        codeStates['setoverallgroup05ff6'] = setoverallgroup05ff6Props,
        codeStates['text'] = text9205d,
        codeStates['settext'] = settext9205d,
        codeStates['reasondesc'] = reasondesc20b1a,
        codeStates['setreasondesc'] = setreasondesc20b1a,
        codeStates['cancel'] = cancel7f45a,
        codeStates['setcancel'] = setcancel7f45a,
        codeStates['continue'] = continue599e4,
        codeStates['setcontinue'] = setcontinue599e4,
    codeExecution(code,codeStates)
    }
  }
  const handleChange = async(e: any) => {
    try{
    //setIsProcessing(true);
    setoverallgroup05ff6((prev: any) => ({ ...prev, reasondesc: e?.target?.value }));
    }catch (err: any) {
    ///setIsProcessing(false);
    if(typeof err == 'string')
      toast(err, 'danger');
    else
      toast(err?.response?.data?.errorDetails?.message, 'danger');
  }finally{
    //setIsProcessing(false);
  }
  }
  const handleFocus=async(e:any)=>{
    try{
    setIsProcessing(true);
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
  if (reasondesc20b1a?.isHidden) {
    return <></>
  }
return (
  <div 
  style={{gridColumn: `3 / 23`,gridRow: `21 / 56`, gap:``, height: `100%`}} >
    <TextArea
      className=""
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled= {reasondesc20b1a?.isDisabled ? true : false}
      placeholder = {'type here...'}
      contentAlign={"left"}
      pin = {'brick-brick'}
      value = { overallgroup05ff6?.reasondesc != null && typeof overallgroup05ff6?.reasondesc =='object' ? Object.keys(overallgroup05ff6?.reasondesc)?.length ?  JSON.stringify(overallgroup05ff6?.reasondesc,null ,2):"" : overallgroup05ff6?.reasondesc||""}
    />
  </div>
  )
}

export default TextAreareasonDesc
