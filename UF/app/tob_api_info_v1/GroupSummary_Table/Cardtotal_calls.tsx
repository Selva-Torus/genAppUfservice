'use client'
import React, { useState,useContext,useEffect } from 'react' 
import { Text } from '@gravity-ui/uikit';
import { TorusCard } from '@/app/TorusComponents/Card';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import {Modal} from '@gravity-ui/uikit';


const Cardtotal_calls = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps;
  const {disable, setDisable} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const token: string = getCookie('token');
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  //another screen
  

  const handleMapperDetails=async()=>{
    try{
    let code:any;
    let orchestrationDataBody:any = {
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",
      componentId:"0f31e3de309647629822428f06f98cb0",
      controlId:"04957a0ea0af4f34a5c76a50ebc2f181",
      isTable:false,
      accessProfile:accessProfile,
      from:"cardTotal Calls",
    }
    if (encryptionFlagCont) {
      orchestrationDataBody["dpdKey"] = encryptionDpd
      orchestrationDataBody["method"] = encryptionMethod
    }
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",orchestrationDataBody,{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code = orchestrationData?.data?.code
      if (code == '') {
        //toast(code?.data?.errorDetails?.message, 'danger')
        //return
      } else if (code != '') {
          let codeStates: any = {}
          codeStates['Info_Group']  = Info_Groupaab7f,
          codeStates['setInfo_Group'] = setInfo_Groupaab7f,
          codeStates['Summary_Table']  = Summary_Table98cb0,
          codeStates['setSummary_Table'] = setSummary_Table98cb0,
          codeStates['API_Process_Log_Table']  = API_Process_Log_Table4f441,
          codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441,
          codeStates['API_Info']  = API_Info80710,
          codeStates['setAPI_Info'] = setAPI_Info80710,
        codeExecution(code,codeStates)
      }
      if(Array.isArray(orchestrationData?.data?.dstData)&&orchestrationData?.data?.dstData?.length>0){
        setSummary_Table98cb0((pre:any)=>({...pre,total_calls:orchestrationData?.data?.dstData[0]?.total_calls}))
      } 
    }catch(err){
      console.log(err)
    }
  }



  useEffect(() => {
    handleMapperDetails()
        setDisable((prev: any) => ({ ...prev, cardtotal_calls2f181:false }));
  }, [refresh.cardtotal_calls2f181])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (hide.cardtotal_calls2f181) {
    return <></>
  }  
  return (
    <div className="col-start-1 col-end-5 row-start-2 row-end-2 gap-10px" >
      <TorusCard 
      style={style}
      className="rounded-lg shadow-lg p-6 bg-white"
      disabled={disable.cardtotal_calls2f181 || false}
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-1' className='truncate ' >
        Total Calls
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
      {Summary_Table98cb0?.total_calls?Summary_Table98cb0?.total_calls:"0"}
      </Text>
    </div>
      </TorusCard>
    </div>
  )
}
export default Cardtotal_calls