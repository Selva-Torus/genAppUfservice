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
  const {vmc_viewmsg_info0ee89, setvmc_viewmsg_info0ee89}= useContext(TotalContext) as TotalContextProps;
  const {vmc_viewmsg_info0ee89Props, setvmc_viewmsg_info0ee89Props}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810, setviewmsg_groupf2810}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810Props, setviewmsg_groupf2810Props}= useContext(TotalContext) as TotalContextProps;
  const {source78073, setsource78073}= useContext(TotalContext) as TotalContextProps;
  const {message47a32, setmessage47a32}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_View_Info:AFVK:v1",
          componentId: "a3b7e2e4348a4d71813e6eb4d67f2810",
          controlId: "42fb1bd4ced148b697976fa9c4378073",
          isTable: false,
          accessProfile:accessProfile,
          from:"textareaSource Msg"
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
  },[source78073?.refresh])
  
  useEffect(()=>{
    if (prevRefreshRef.current) {
      setviewmsg_groupf2810((pre:any)=>({...pre,source:""}))
    }else 
      prevRefreshRef.current= true
  },[source78073?.refresh])

  const handleBlur=async(e:any)=>{
    code = allCode
    if (code != '') {
      let codeStates: any = {}
      codeStates['vmc_viewmsg_info']  = vmc_viewmsg_info0ee89,
      codeStates['setvmc_viewmsg_info'] = setvmc_viewmsg_info0ee89,
      codeStates['viewmsg_group']  = viewmsg_groupf2810,
      codeStates['setviewmsg_group'] = setviewmsg_groupf2810,
    codeExecution(code,codeStates)
    }
  }
  const handleChange = async(e: any) => {
    setviewmsg_groupf2810((prev: any) => ({ ...prev, source: e?.target?.value }))
  }
  const handleFocus=async(e:any)=>{
  }
  if (source78073?.isHidden) {
    return <></>
  }
return (
  <div 
  style={{gridColumn: `1 / 7`,gridRow: `1 / 120`, gap:``, height: `100%`, overflow: 'auto'}} >
    <TextArea
      className="bg-white w-full h-full p-4 rounded-md bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none"
      onChange={handleChange}
      onBlur={handleBlur}
      disabled= {source78073?.isDisabled ? true : false}
      minRows = {20}
      maxRows = {30}
      placeholder = {'type here...'}
      size = {'m'}
      pin = {'brick-brick'}
      value = { viewmsg_groupf2810?.source != null && typeof viewmsg_groupf2810?.source =='object' ? Object.keys(viewmsg_groupf2810?.source)?.length ?  JSON.stringify(viewmsg_groupf2810?.source,null ,2):"" : viewmsg_groupf2810?.source||""}
    />
  </div>
  )
}

export default TextAreasource
