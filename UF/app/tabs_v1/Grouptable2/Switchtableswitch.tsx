
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

const Switchtableswitch = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
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
  const {groupeca86, setgroupeca86}= useContext(TotalContext) as TotalContextProps;
  const {groupeca86Props, setgroupeca86Props}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646, settabgroupe7646}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646Props, settabgroupe7646Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3, settab_header_12cce3}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3Props, settab_header_12cce3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783, settab_header_214783}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783Props, settab_header_214783Props}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527ef, setoldtabgroup527ef}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527efProps, setoldtabgroup527efProps}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914Props, settab29f914Props}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  const {ids24da4, setids24da4}= useContext(TotalContext) as TotalContextProps;
  const {name5545c, setname5545c}= useContext(TotalContext) as TotalContextProps;
  const {tableswitch7580d, settableswitch7580d}= useContext(TotalContext) as TotalContextProps;
  const {tablebutton03e79, settablebutton03e79}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",
          componentId: "b901da00e7f54fc5b5c8181aee8c0657",
          controlId: "f698dcb8a14d470eb0c54db49ef7580d",
          isTable: false,
          from:"Switchtableswitch",
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
    settable2c0657((pre:any)=>({...pre,tableswitch:null}))
  },[tableswitch7580d?.refresh])


  const handleChange = async (checked: boolean) => {
    settable2c0657((prev: any) => ({ ...prev, tableswitch: checked }))
    let code:any= allCode
    if (code != '') {
      let codeStates: any = {}
            codeStates['group']  = groupeca86,
            codeStates['setgroup'] = setgroupeca86,
            codeStates['oldtabgroup']  = oldtabgroup527ef,
            codeStates['setoldtabgroup'] = setoldtabgroup527ef,
            codeStates['table2']  = table2c0657,
            codeStates['settable2'] = settable2c0657,
    codeExecution(code,codeStates)
    }
  }

  if (tableswitch7580d?.isHidden) {
    return <></>
  }
  return (
    <div 
      className=""
      style={{gridColumn: ` / `,gridRow: ` / `, gap:``, height: `100%`, overflow: 'auto'}} >
      <Switch
        className=""
        disabled= {tableswitch7580d?.isDisabled ? true : false}
        content="content"
        checked={table2c0657?.tableswitch || false} 
        onChange={handleChange}
      />
  </div>
  )
}

export default Switchtableswitch



