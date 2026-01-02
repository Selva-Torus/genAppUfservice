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

const Cardtotal_requests = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const {dfd_mongo_maindashboard_v1Props, setdfd_mongo_maindashboard_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
  const {vmc_dashboard_screen43803, setvmc_dashboard_screen43803}= useContext(TotalContext) as TotalContextProps  
  const {vmc_dashboard_screen43803Props, setvmc_dashboard_screen43803Props}= useContext(TotalContext) as TotalContextProps  
  const {maindashboard_cards0d32d, setmaindashboard_cards0d32d}= useContext(TotalContext) as TotalContextProps  
  const {maindashboard_cards0d32dProps, setmaindashboard_cards0d32dProps}= useContext(TotalContext) as TotalContextProps  
  const {most_used_msgfc11a, setmost_used_msgfc11a}= useContext(TotalContext) as TotalContextProps  
  const {active_msg28606, setactive_msg28606}= useContext(TotalContext) as TotalContextProps  
  const {total_requestsf3186, settotal_requestsf3186}= useContext(TotalContext) as TotalContextProps  
  const {error403d0, seterror403d0}= useContext(TotalContext) as TotalContextProps  
  const {line_chart_group23d18, setline_chart_group23d18}= useContext(TotalContext) as TotalContextProps  
  const {line_chart_group23d18Props, setline_chart_group23d18Props}= useContext(TotalContext) as TotalContextProps  
  const {bar_chart_group93773, setbar_chart_group93773}= useContext(TotalContext) as TotalContextProps  
  const {bar_chart_group93773Props, setbar_chart_group93773Props}= useContext(TotalContext) as TotalContextProps  
  const {api_repo_table83529, setapi_repo_table83529}= useContext(TotalContext) as TotalContextProps  
  const {api_repo_table83529Props, setapi_repo_table83529Props}= useContext(TotalContext) as TotalContextProps  
  const {api_repositorysb8178, setapi_repositorysb8178}= useContext(TotalContext) as TotalContextProps  
  const {api_repositorysb8178Props, setapi_repositorysb8178Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
 
  
  const handleMapperDetails=async()=>{
    try{
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1",  componentId:"21672813eca346948142a314edb0d32d",controlId:"8f7b5b03b14e4ef8833dde29bc3f3186",isTable:false,accessProfile:accessProfile,from:"cardTotal Requests"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code = orchestrationData?.data?.code
    if (code != '') {
          let codeStates: any = {}
          codeStates['vmc_dashboard_screen']  = vmc_dashboard_screen43803,
          codeStates['setvmc_dashboard_screen'] = setvmc_dashboard_screen43803,
          codeStates['maindashboard_cards']  = maindashboard_cards0d32d,
          codeStates['setmaindashboard_cards'] = setmaindashboard_cards0d32d,
          codeStates['line_chart_group']  = line_chart_group23d18,
          codeStates['setline_chart_group'] = setline_chart_group23d18,
          codeStates['bar_chart_group']  = bar_chart_group93773,
          codeStates['setbar_chart_group'] = setbar_chart_group93773,
          codeStates['api_repo_table']  = api_repo_table83529,
          codeStates['setapi_repo_table'] = setapi_repo_table83529,
          codeStates['api_repositorys']  = api_repositorysb8178,
          codeStates['setapi_repositorys'] = setapi_repositorysb8178,
        codeExecution(code,codeStates)
      }
    }catch(err){
      console.log(err)
    }
    try{
      if(Array.isArray(dfd_mongo_maindashboard_v1Props)){
      setmaindashboard_cards0d32d((pre:any)=>({...pre,total_requests:dfd_mongo_maindashboard_v1Props[0]?.total_requests}));
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
},[total_requestsf3186?.refresh])

useEffect(() => {
  if(Array.isArray(dfd_mongo_maindashboard_v1Props)){
    setmaindashboard_cards0d32d((pre:any)=>({...pre,total_requests:dfd_mongo_maindashboard_v1Props[0]?.total_requests}));
  }
},[dfd_mongo_maindashboard_v1Props])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   // boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (total_requestsf3186?.isHidden) {
    return <></>
  }  
  return (
    <div 
    style={{gridColumn: `7 / 10`,gridRow: `1 / 42`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Card 
      style={style}
      className=""      
      size="m"
      view="filled"
      disabled= {total_requestsf3186?.isDisabled ? true : false}
      onClick={handleClick}  
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-3' className='truncate ' >
        Total Requests
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
{maindashboard_cards0d32d?.total_requests?maindashboard_cards0d32d?.total_requests:"0"}
      </Text>
    </div>
      </Card>
    </div>
  )
}

export default Cardtotal_requests
