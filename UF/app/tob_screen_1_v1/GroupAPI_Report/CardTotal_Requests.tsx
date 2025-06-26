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


const CardTotal_Requests = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
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
  const {API_Report360bc, setAPI_Report360bc} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Report360bcContainValidataion, setAPI_Report360bcContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Repo_Table8836e, setAPI_Repo_Table8836e} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Repo_Table8836eContainValidataion, setAPI_Repo_Table8836eContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Connected_App_Tablecff73, setConnected_App_Tablecff73} = useContext(TotalContext) as TotalContextProps
  const {isConnected_App_Tablecff73ContainValidataion, setConnected_App_Tablecff73ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  //another screen
  

  const handleMapperDetails=async()=>{
    try{
    let code:any;
    let orchestrationDataBody:any = {
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",
      componentId:"0ab066617ab04f1e8d7503b1655360bc",
      controlId:"07fd9228d5bc4b99b830af4428db08ba",
      isTable:false,
      accessProfile:accessProfile,
      from:"cardTOTAL REQUESTS",
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
          codeStates['API_Report']  = API_Report360bc,
          codeStates['setAPI_Report'] = setAPI_Report360bc,
          codeStates['API_Repo_Table']  = API_Repo_Table8836e,
          codeStates['setAPI_Repo_Table'] = setAPI_Repo_Table8836e,
          codeStates['Connected_App_Table']  = Connected_App_Tablecff73,
          codeStates['setConnected_App_Table'] = setConnected_App_Tablecff73,
        codeExecution(code,codeStates)
      }
      if(Array.isArray(orchestrationData?.data?.dstData)&&orchestrationData?.data?.dstData?.length>0){
        setAPI_Report360bc((pre:any)=>({...pre,total_requests:orchestrationData?.data?.dstData[0]?.total_requests}))
      } 
    }catch(err){
      console.log(err)
    }
  }



  useEffect(() => {
    handleMapperDetails()
        setDisable((prev: any) => ({ ...prev, cardTotal_Requestsb08ba:false }));
  }, [refresh.cardTotal_Requestsb08ba])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (hide.cardTotal_Requestsb08ba) {
    return <></>
  }  
  return (
    <div className="col-start-7 col-end-10 row-start-2 row-end-2 gap-10px" >
      <TorusCard 
      style={style}
      className="rounded-lg shadow-lg p-6 bg-white"
      disabled={disable.cardTotal_Requestsb08ba || false}
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-1' className='truncate ' >
        TOTAL REQUESTS
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
      {API_Report360bc?.total_requests?API_Report360bc?.total_requests:"0"}
      </Text>
    </div>
      </TorusCard>
    </div>
  )
}
export default CardTotal_Requests