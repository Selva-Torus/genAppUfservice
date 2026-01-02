'use client'

import React, { useState, useContext, useEffect, useRef } from 'react'; 
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { te_refreshDto } from '@/app/interfaces/interfaces';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const Cardsuccess_rate = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const {dfd_mongo_total_calls_v1Props, setdfd_mongo_total_calls_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const token: string = getCookie('token');
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const prevRefreshRef = useRef(false);
  /////////////
   //another screen
  const {vmc_msg_infob41b0, setvmc_msg_infob41b0}= useContext(TotalContext) as TotalContextProps  
  const {vmc_msg_infob41b0Props, setvmc_msg_infob41b0Props}= useContext(TotalContext) as TotalContextProps  
  const {info_summary_repository_group8106c, setinfo_summary_repository_group8106c}= useContext(TotalContext) as TotalContextProps  
  const {info_summary_repository_group8106cProps, setinfo_summary_repository_group8106cProps}= useContext(TotalContext) as TotalContextProps  
  const {msg_group609be, setmsg_group609be}= useContext(TotalContext) as TotalContextProps  
  const {msg_group609beProps, setmsg_group609beProps}= useContext(TotalContext) as TotalContextProps  
  const {api_repository_groupsb475a, setapi_repository_groupsb475a}= useContext(TotalContext) as TotalContextProps  
  const {api_repository_groupsb475aProps, setapi_repository_groupsb475aProps}= useContext(TotalContext) as TotalContextProps  
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c}= useContext(TotalContext) as TotalContextProps  
  const {info_summary_groups8d62cProps, setinfo_summary_groups8d62cProps}= useContext(TotalContext) as TotalContextProps  
  const {total_callsfcfdc, settotal_callsfcfdc}= useContext(TotalContext) as TotalContextProps  
  const {success_rate1130c, setsuccess_rate1130c}= useContext(TotalContext) as TotalContextProps  
  const {error_ratead931, seterror_ratead931}= useContext(TotalContext) as TotalContextProps  
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps  
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
 
  
  const handleMapperDetails=async()=>{
    try{
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",  componentId:"a6d7927c980b49688fb350316df8d62c",controlId:"eeee17abe48a4142b41e156ad631130c",isTable:false,accessProfile:accessProfile,from:"cardSuccess Rate"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code = orchestrationData?.data?.code
    if (code != '') {
          let codeStates: any = {}
          codeStates['vmc_msg_info']  = vmc_msg_infob41b0,
          codeStates['setvmc_msg_info'] = setvmc_msg_infob41b0,
          codeStates['info_summary_repository_group']  = info_summary_repository_group8106c,
          codeStates['setinfo_summary_repository_group'] = setinfo_summary_repository_group8106c,
          codeStates['msg_group']  = msg_group609be,
          codeStates['setmsg_group'] = setmsg_group609be,
          codeStates['api_repository_groups']  = api_repository_groupsb475a,
          codeStates['setapi_repository_groups'] = setapi_repository_groupsb475a,
          codeStates['info_summary_groups']  = info_summary_groups8d62c,
          codeStates['setinfo_summary_groups'] = setinfo_summary_groups8d62c,
          codeStates['api_process_log']  = api_process_log17839,
          codeStates['setapi_process_log'] = setapi_process_log17839,
        codeExecution(code,codeStates)
      }
    }catch(err){
      console.log(err)
    }
    try{
      if(Array.isArray(dfd_mongo_total_calls_v1Props)){
      setinfo_summary_groups8d62c((pre:any)=>({...pre,success_rate:dfd_mongo_total_calls_v1Props[0]?.success_rate}));
  }
    }catch(err){
      console.log(err)
    }
  }

  const handleClick=async(value:any)=>{
  }


useEffect(() => {
  if (prevRefreshRef.current) {
    handleMapperDetails()
  }else 
  prevRefreshRef.current= true
},[success_rate1130c?.refresh])

useEffect(() => {
  if(Array.isArray(dfd_mongo_total_calls_v1Props)){
    setinfo_summary_groups8d62c((pre:any)=>({...pre,success_rate:dfd_mongo_total_calls_v1Props[0]?.success_rate}));
  }
},[dfd_mongo_total_calls_v1Props])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   // boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (success_rate1130c?.isHidden) {
    return <></>
  }  
  return (
    <div 
    style={{gridColumn: `5 / 9`,gridRow: `1 / 36`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Card 
      style={style}
      className="
"      
      view="filled"
      disabled= {success_rate1130c?.isDisabled ? true : false}
      onClick={handleClick}  
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-3' className='truncate ' >
        Success Rate
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
{info_summary_groups8d62c?.success_rate?info_summary_groups8d62c?.success_rate:"0"}
      </Text>
    </div>
      </Card>
    </div>
  )
}

export default Cardsuccess_rate
