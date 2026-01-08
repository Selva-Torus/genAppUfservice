
'use client'
import React, { useState,useContext,useEffect,useRef } from 'react';
import axios from 'axios';
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import i18n from '@/app/components/i18n';
import { AxiosService } from '@/app/components/axiosService';
import { codeExecution } from '@/app/utils/codeExecution';
import { getCookie } from '@/app/components/cookieMgment';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { Tabs } from '@/components/Tabs';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

import Pageindivitualsave_v1 from '@/app/indivitualsave_v1/indivitualsave_v1page';

const Tabsoldtab = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const prevRefreshRef = useRef(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const [open, setOpen] = React.useState(false);
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  let code:any= "";
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
  const {oldtaba33e3, setoldtaba33e3}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  const {indivitualsave_v1Props, setindivitualsave_v1Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  let ScreenItems:any=[
    {
      id: "indivitualsave_v1",
      title: "indivitualsave_v1",
      disabled: false,
      className: "!justify-center",
        content:<Pageindivitualsave_v1/>
    },
  ]
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",
          componentId: "a12c6162b8d44d718a83c60e2ff527ef",
          controlId: "81f54ec519e14404a31b964ba23a33e3",
          isTable: false,
          accessProfile:accessProfile,
          from:"tabsoldtab"
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
  },[oldtaba33e3?.refresh])

  useEffect(()=>{
    setoldtabgroup527ef((pre:any)=>({...pre,oldtab:""}));
  },[oldtaba33e3?.refresh])

  const handleCode=async () => {
    code = allCode
    if (code == "") {
      //toast(code?.data?.errorDetails?.message, 'danger');
      //return;
    }  else if (code != '') {
      let codeStates: any = {};
    codeStates['group']  = groupeca86,
    codeStates['setgroup'] = setgroupeca86,
    codeStates['oldtabgroup']  = oldtabgroup527ef,
    codeStates['setoldtabgroup'] = setoldtabgroup527ef,
    codeStates['table2']  = table2c0657,
    codeStates['settable2'] = settable2c0657,
    codeExecution(code,codeStates);
    }
  }


  const handleSelect=async(e:any)=>{
    // show as profile code
        if(e?.toLowerCase()=='indivitualsave_v1'){
          let filterProps2:any =  [];
          let filterData2 = await getFilterProps(filterProps2,oldtabgroup527ef);
          setindivitualsave_v1Props([...filterData2 ]);
        }
    }
    function handleConfirmSelect(e:any){
    }

    if (oldtaba33e3?.isHidden) {
      return <></>
    }

  return (
    <div 
       style={{gridColumn: `2 / 24`,gridRow: `16 / 103`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Tabs
        className=""
        needTooltip={true}  
        tooltipProps={{title:"tooltip",placement:"bottom-end"}}
        headerPosition='right'
        headerText="header"
        onChange={(e)=>handleSelect(e)}
        items={ScreenItems}
        defaultActiveId={"indivitualsave_v1"}
        direction='horizontal'
      />
    </div>
  )
}

export default  Tabsoldtab
