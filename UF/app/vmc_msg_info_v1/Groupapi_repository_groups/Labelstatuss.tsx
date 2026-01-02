'use client'

import React, {useState, useContext,useEffect } from 'react';
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { Label } from '@/components/Label';
import { useRouter } from 'next/navigation';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import { Modal } from '@/components/Modal';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const Labelstatuss = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const [allCode,setAllCode]=useState<any>("");

 /////////////
   //another screen
  const {vmc_msg_infob41b0, setvmc_msg_infob41b0}= useContext(TotalContext) as TotalContextProps;
  const {vmc_msg_infob41b0Props, setvmc_msg_infob41b0Props}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106c, setinfo_summary_repository_group8106c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106cProps, setinfo_summary_repository_group8106cProps}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609be, setmsg_group609be}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609beProps, setmsg_group609beProps}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475a, setapi_repository_groupsb475a}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475aProps, setapi_repository_groupsb475aProps}= useContext(TotalContext) as TotalContextProps;
  const {msgnames7a309, setmsgnames7a309}= useContext(TotalContext) as TotalContextProps;
  const {versionsbeb4b, setversionsbeb4b}= useContext(TotalContext) as TotalContextProps;
  const {statuss18862, setstatuss18862}= useContext(TotalContext) as TotalContextProps;
  const {release_datesb8be1, setrelease_datesb8be1}= useContext(TotalContext) as TotalContextProps;
  const {source_msg_typea3c5a, setsource_msg_typea3c5a}= useContext(TotalContext) as TotalContextProps;
  const {version95ead, setversion95ead}= useContext(TotalContext) as TotalContextProps;
  const {status3a35d, setstatus3a35d}= useContext(TotalContext) as TotalContextProps;
  const {release_date27b40, setrelease_date27b40}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62cProps, setinfo_summary_groups8d62cProps}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",
        componentId: "862b2b2574e048eca62763b9b23b475a",
        controlId: "c3a9ff4219e54829ae52727b59618862",
        isTable: false,
        from:"labelStatus",
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
    setAllCode(orchestrationData?.data?.code);
  }catch(err){
    console.log(err)
  }
}

useEffect(()=>{
  handleMapperValue();
  setapi_repository_groupsb475a((pre:any)=>({...pre,statuss:""}));
},[statuss18862?.refresh])


const handleClick =async(e:any)=>{
  setapi_repository_groupsb475a((prev: any) => ({ ...prev, statuss: e.target.value }));
  let code = allCode;
    if (code != '') {
    let codeStates: any = {};
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
  codeExecution(code,codeStates);
  }
}


  if (statuss18862?.isHidden) {
    return <></>
  }  

  return (
    <div 
      style={{gridColumn: `7 / 9`,gridRow: `1 / 11`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Label 
        className=""
        disabled= {statuss18862?.isDisabled ? true : false}
        theme="normal"
        interactive={false}
      onClick = {handleClick}
      >
      Status
      </Label>
    </div>
  )
}

export default Labelstatuss
