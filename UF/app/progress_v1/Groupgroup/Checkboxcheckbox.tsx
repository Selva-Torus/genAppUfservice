
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
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;  
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;  
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;  
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;  
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;  
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;  
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;  
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;  
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;  
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;  
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;  
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;  
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;  
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;  
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;  
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;  
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;  
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;  
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;  
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;  
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
          componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
          controlId: "f0038990a59f41f4b0a5fd5b7430cfd1",
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
  },[checkbox0cfd1?.refresh])

  const handleChange=async(checked:boolean)=>{
    setgroupbffe9((prev: any) => ({ ...prev, checkbox: checked}));
  }
  
  const handleBlur=async(e:any)=>{
    code = allCode
    if (code != '') {
      let codeStates: any = {}
            codeStates['group']  = groupbffe9;
            codeStates['setgroup'] = setgroupbffe9;
            codeStates['usertable']  = usertable8d993;
            codeStates['setusertable'] = setusertable8d993;
            codeStates['usertable2']  = usertable2b6e16;
            codeStates['setusertable2'] = setusertable2b6e16;
    codeExecution(code,codeStates);
    }
  }

  if (checkbox0cfd1?.isHidden) {
    return <></>;
  }
  return (
    <div 
       style={{gridColumn: `9 / 14`,gridRow: `203 / 261`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Checkbox 
      className=""
      value={groupbffe9?.checkbox||false}
      checked={groupbffe9?.checkbox||false}
      disabled= {checkbox0cfd1?.isDisabled ? true : false}
      content = {'content'}
      title = {'title'}
      needTooltip={true}  
      tooltipProps={{title:"checkbox",placement:"right-end"}}
      headerPosition='top'
      headerText="header"
      onChange={handleChange}
      onBlur={handleBlur}
    />
    </div>
  )
}

export default Checkboxcheckbox;
