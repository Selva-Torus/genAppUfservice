'use client'
import React, { useState,useContext,useEffect, useRef } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextArea } from '@/components/TextArea';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';


const TextAreasource = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any="";
  const prevRefreshRef = useRef(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'source',type:"string"})
  const [allCode,setAllCode]=useState<any>("")
  const toast:any=useInfoMsg()
  const routes = useRouter()
 /////////////
   //another screen
  const {operations58572, setoperations58572}= useContext(TotalContext) as TotalContextProps;
  const {operations58572Props, setoperations58572Props}= useContext(TotalContext) as TotalContextProps;
  const {source95c56, setsource95c56}= useContext(TotalContext) as TotalContextProps;
  const {target64438, settarget64438}= useContext(TotalContext) as TotalContextProps;
  const {navbar8dbd9, setnavbar8dbd9}= useContext(TotalContext) as TotalContextProps;
  const {navbarmx67b58, setnavbarmx67b58}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231, setwrite_group55231}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231Props, setwrite_group55231Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1",
          componentId: "4ee6168b397247489db709a4a1658572",
          controlId: "115a5fbcf7f5414aaa1c39a69e395c56",
          isTable: false,
          accessProfile:accessProfile,
          from:"textareaSource"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.schemaData){
        let allSchemas:any[]=orchestrationData?.data?.schemaData[0]?.schema||[]
        let type:any={name:'source',type:'text'}
        allSchemas.map((item:any)=>{
          if(item.name=='source')
          {
            type=item
  
          }
        })
        setDynamicStateandType(type)       
      }
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'source',type:'text'}
        type={
          name:'source',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.source.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.source.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.source.type
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
  },[source95c56?.refresh])
  
  useEffect(()=>{
    if (prevRefreshRef.current) {
      setoperations58572((pre:any)=>({...pre,source:""}))
    }else 
      prevRefreshRef.current= true
  },[source95c56?.refresh])

  const handleBlur=async(e:any)=>{
    code = allCode
    if (code != '') {
      let codeStates: any = {}
      codeStates['operations']  = operations58572,
      codeStates['setoperations'] = setoperations58572,
      codeStates['write_group']  = write_group55231,
      codeStates['setwrite_group'] = setwrite_group55231,
    codeExecution(code,codeStates)
    }
  }
  const handleChange = async(e: any) => {
    setoperations58572((prev: any) => ({ ...prev, source: e?.target?.value }))
  }
  const handleFocus=async(e:any)=>{
  }
  if (source95c56?.isHidden) {
    return <></>
  }
return (
  <div 
      className="flex flex-col  " 
  style={{gridColumn: `3 / 8`,gridRow: `1 / 167`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Text className="pb-2">SOURCE</Text>
    <TextArea
      className="bg-white w-full h-full p-4 rounded-md bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none rounded-xl shadow-md hover:shadow-lg transition"
      onChange={handleChange}
      onBlur={handleBlur}
      disabled= {source95c56?.isDisabled ? true : false}
      minRows = {35}
      maxRows = {40}
      size = {'s'}
      pin = {'round-round'}
      value = { operations58572?.source != null && typeof operations58572?.source =='object' ? Object.keys(operations58572?.source)?.length ?  JSON.stringify(operations58572?.source,null ,2):"" : operations58572?.source||""}
    />
  </div>
  )
}

export default TextAreasource
