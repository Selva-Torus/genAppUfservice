
'use client'
import React, { useState,useContext,useEffect } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Text } from '@/components/Text';
import { Checkbox } from '@/components/Checkbox';
import {Modal} from '@/components/Modal';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';


const Checkboxcheckbox = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'checkbox',type:"text"})
  const toast:any=useInfoMsg();
  const routes = useRouter();
  let code:any='';
  const [allCode,setAllCode]=useState<any>("");
 /////////////
   //another screen
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps;  
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps;  
  const {save8d5a7, setsave8d5a7}= useContext(TotalContext) as TotalContextProps;  
  const {username57f7f, setusername57f7f}= useContext(TotalContext) as TotalContextProps;  
  const {checkboxebbe6, setcheckboxebbe6}= useContext(TotalContext) as TotalContextProps;  
  const {date419b1, setdate419b1}= useContext(TotalContext) as TotalContextProps;  
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps;  
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps;  
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",
          componentId: "148827029a474f2db3ba030ecc17f4e1",
          controlId: "a18d6ea239d9471caea2d246f32ebbe6",
          isTable: false,
          accessProfile:accessProfile,
          from:"checkboxcheckbox"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
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
  },[checkboxebbe6?.refresh])

  const handleChange=async(checked:boolean)=>{
    setmaingroup7f4e1((prev: any) => ({ ...prev, checkbox: checked}));
  }
  
  const handleBlur=async(e:any)=>{
    code = allCode
    if (code != '') {
      let codeStates: any = {}
            codeStates['maingroup']  = maingroup7f4e1;
            codeStates['setmaingroup'] = setmaingroup7f4e1;
            codeStates['userable']  = userable8d616;
            codeStates['setuserable'] = setuserable8d616;
    codeExecution(code,codeStates);
    }
  }

  if (checkboxebbe6?.isHidden) {
    return <></>;
  }
  return (
    <div 
       style={{gridColumn: `14 / 20`,gridRow: `57 / 67`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Checkbox 
      className=""
      value={maingroup7f4e1?.checkbox||false}
      checked={maingroup7f4e1?.checkbox||false}
      disabled= {checkboxebbe6?.isDisabled ? true : false}
      content = {'content'}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    </div>
  )
}

export default Checkboxcheckbox;
