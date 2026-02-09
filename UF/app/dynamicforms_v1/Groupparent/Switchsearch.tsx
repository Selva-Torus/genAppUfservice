
'use client'
import React, { useState, useContext, useEffect, useRef } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
import { Switch } from '@/components/Switch'
import { Text } from '@/components/Text'
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import { te_refreshDto } from '@/app/interfaces/interfaces';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@/components/Modal';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const Switchsearch = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [allCode,setAllCode]=useState<any>("");
  const [ruleCode,setRuleCode]=useState<any>("");
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const prevRefreshRef = useRef(false);
 /////////////
   //another screen
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {search2b9e0, setsearch2b9e0}= useContext(TotalContext) as TotalContextProps;
  const {fff4d19f, setfff4d19f}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "03e924560c144d3181733fca11c0e5b8",
          controlId: "c661c3e8e7ed4375bb4d76990492b9e0",
          isTable: false,
          from:"Switchsearch",
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
      setAllCode(orchestrationData?.data?.code)
      setRuleCode(orchestrationData?.data?.rule)
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(() => {
    handleMapperValue()
    setparent0e5b8((pre:any)=>({...pre,search:null}))
  },[search2b9e0?.refresh])


  const handleChange = async (checked: boolean) => {
    setparent0e5b8((prev: any) => ({ ...prev, search: checked }))
    let code:any= allCode
    if (code != '') {
      let codeStates: any = {}
            codeStates['parent']  = parent0e5b8,
            codeStates['setparent'] = setparent0e5b8,
            codeStates['form']  = form775ce,
            codeStates['setform'] = setform775ce,
            codeStates['groupfordynamicbutton']  = groupfordynamicbutton143be,
            codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
            codeStates['buttons']  = buttons60ce5,
            codeStates['setbuttons'] = setbuttons60ce5,
    codeExecution(code,codeStates)
    }
  }

  async function handleConfirmOnChange(){
  } 
  if (search2b9e0?.isHidden) {
    return <></>
  }
  return (
    <div 
      className=""
      style={{gridColumn: `13 / 24`,gridRow: `13 / 23`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Switch
        className=""
        disabled= {search2b9e0?.isDisabled ? true : false}
        content="content"
        checked={parent0e5b8?.search || false} 
        onChange={handleChange}
      />
  </div>
  )
}

export default Switchsearch



