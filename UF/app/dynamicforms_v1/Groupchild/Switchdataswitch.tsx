
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

const Switchdataswitch = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
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
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {child6747b, setchild6747b}= useContext(TotalContext) as TotalContextProps;
  const {child6747bProps, setchild6747bProps}= useContext(TotalContext) as TotalContextProps;
  const {dataswitch55413, setdataswitch55413}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "80a9a4eef5f54809bc99643f6c26747b",
          controlId: "18276029afa9499f87e575a028b55413",
          isTable: false,
          from:"Switchdataswitch",
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
    setchild6747b((pre:any)=>({...pre,dataswitch:null}))
  },[dataswitch55413?.refresh])


  const handleChange = async (checked: boolean) => {
    setchild6747b((prev: any) => ({ ...prev, dataswitch: checked }))
    let code:any= allCode
    if (code != '') {
      let codeStates: any = {}
            codeStates['parent']  = parent0e5b8,
            codeStates['setparent'] = setparent0e5b8,
            codeStates['form']  = form775ce,
            codeStates['setform'] = setform775ce,
            codeStates['child']  = child6747b,
            codeStates['setchild'] = setchild6747b,
    codeExecution(code,codeStates)
    }
  }

  if (dataswitch55413?.isHidden) {
    return <></>
  }
  return (
    <div 
      className=""
      style={{gridColumn: `14 / 16`,gridRow: `29 / 39`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Switch
        className=""
        disabled= {dataswitch55413?.isDisabled ? true : false}
        content="content"
        checked={child6747b?.dataswitch || false} 
        onChange={handleChange}
      />
  </div>
  )
}

export default Switchdataswitch



