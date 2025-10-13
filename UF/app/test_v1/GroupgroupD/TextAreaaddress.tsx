'use client'
import React, { useState,useContext,useEffect, useRef } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import {TextArea,Text} from "@gravity-ui/uikit";
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { eventBus } from '@/app/eventBus';
import {Modal} from '@gravity-ui/uikit';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';


const Textareaaddress = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const prevRefreshRef = useRef(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'address',type:"string"})
  const [allCode,setAllCode]=useState<any>("")
  const toast:any=useInfoMsg()
  const routes = useRouter()
  let code:any="";
 /////////////
   //another screen
  const {main6d2c7, setmain6d2c7}= useContext(TotalContext) as TotalContextProps;
  const {main6d2c7Props, setmain6d2c7Props}= useContext(TotalContext) as TotalContextProps;
  const {groupad476b, setgroupad476b}= useContext(TotalContext) as TotalContextProps;
  const {groupad476bProps, setgroupad476bProps}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0d, setgroupb66b0d}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0dProps, setgroupb66b0dProps}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19, setgroupc59a19}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19Props, setgroupc59a19Props}= useContext(TotalContext) as TotalContextProps;
  const {groupde191f, setgroupde191f}= useContext(TotalContext) as TotalContextProps;
  const {groupde191fProps, setgroupde191fProps}= useContext(TotalContext) as TotalContextProps;
  const {address332cb, setaddress332cb}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1",
          componentId: "e486baa5a83d4ece8da9390582fe191f",
          controlId: "525d993145e74cf39059487782f332cb",
          isTable: false,
          accessProfile:accessProfile,
          from:"textareaaddress"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.schemaData){
        let allSchemas:any[]=orchestrationData?.data?.schemaData[0]?.schema||[]
        let type:any={name:'address',type:'text'}
        allSchemas.map((item:any)=>{
          if(item.name=='address')
          {
            type=item
  
          }
        })
        setDynamicStateandType(type)       
      }
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'address',type:'text'}
        type={
          name:'address',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.address.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.address.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.address.type
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
  },[address332cb?.refresh])
  
  useEffect(()=>{
    if (prevRefreshRef.current) {
      setgroupde191f((pre:any)=>({...pre,address:""}))
    }else 
      prevRefreshRef.current= true
  },[address332cb?.refresh])

  const handleBlur=async(e:any)=>{
    code = allCode
    if (code != '') {
      let codeStates: any = {}
      codeStates['main']  = main6d2c7,
      codeStates['setmain'] = setmain6d2c7,
      codeStates['groupa']  = groupad476b,
      codeStates['setgroupa'] = setgroupad476b,
      codeStates['groupb']  = groupb66b0d,
      codeStates['setgroupb'] = setgroupb66b0d,
      codeStates['groupc']  = groupc59a19,
      codeStates['setgroupc'] = setgroupc59a19,
      codeStates['groupd']  = groupde191f,
      codeStates['setgroupd'] = setgroupde191f,
    codeExecution(code,codeStates)
    }
  }
  const handleChange = async(e: any) => {
    setgroupde191f((prev: any) => ({ ...prev, address: e.value }))
  }
  const handleFocus=async(e:any)=>{
  }
  if (address332cb?.isHidden) {
    return <></>
  }
return (
  <div 
  style={{gridColumn: `2 / 11`,gridRow: `2 / 7`, gap:``, height: `100%`, overflow: 'auto'}} >
    <TextArea
      className=""
      onChange={e => handleChange(e.target)}
      onBlur={handleBlur}
      disabled= {address332cb?.isDisabled ? true : false}
      minRows = {2}
      maxRows = {5}
      placeholder = {'type here...'}
      size = {'m'}
      pin = {'brick-brick'}
      value = { groupde191f?.address != null && typeof groupde191f?.address =='object' ? Object.keys(groupde191f?.address)?.length ?  JSON.stringify(groupde191f?.address,null ,2):"" : groupde191f?.address||""}
    />
  </div>
  )
}

export default Textareaaddress
