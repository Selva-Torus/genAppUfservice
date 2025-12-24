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

const Cardcard4 = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
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
  const {overall05a6d, setoverall05a6d}= useContext(TotalContext) as TotalContextProps  
  const {overall05a6dProps, setoverall05a6dProps}= useContext(TotalContext) as TotalContextProps  
  const {card119379, setcard119379}= useContext(TotalContext) as TotalContextProps  
  const {card234061, setcard234061}= useContext(TotalContext) as TotalContextProps  
  const {card31630c, setcard31630c}= useContext(TotalContext) as TotalContextProps  
  const {card480a32, setcard480a32}= useContext(TotalContext) as TotalContextProps  
  const {card5e0759, setcard5e0759}= useContext(TotalContext) as TotalContextProps  
  const {bar9c49f, setbar9c49f}= useContext(TotalContext) as TotalContextProps  
  const {pie5e484, setpie5e484}= useContext(TotalContext) as TotalContextProps  
  const {table5cf93, settable5cf93}= useContext(TotalContext) as TotalContextProps  
  const {table5cf93Props, settable5cf93Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
 
  
  const handleMapperDetails=async()=>{
    try{
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:OpenBanking:AFVK:v1",  componentId:"f0f6a573e6b64b268dd38ea18e005a6d",controlId:"39fb9073f4cd476fb218730832c80a32",isTable:false,accessProfile:accessProfile,from:"cardMoon Bank"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code = orchestrationData?.data?.code
    if (code != '') {
          let codeStates: any = {}
          codeStates['overall']  = overall05a6d,
          codeStates['setoverall'] = setoverall05a6d,
          codeStates['table']  = table5cf93,
          codeStates['settable'] = settable5cf93,
        codeExecution(code,codeStates)
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleClick=async(value:any)=>{
  }


useEffect(() => {
    setoverall05a6d((pre:any)=>({...pre,card4:""}));
  },[card480a32?.refresh])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   // boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (card480a32?.isHidden) {
    return <></>
  }  
  return (
    <div 
    style={{gridColumn: `9 / 11`,gridRow: `61 / 112`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Card 
      style={style}
      className=""      
      size="l"
      theme="utility"
      view="filled"
      disabled= {card480a32?.isDisabled ? true : false}
      onClick={handleClick}  
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-3' className='truncate ' >
        Moon Bank
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
{overall05a6d?.card4?overall05a6d?.card4:"0"}
      </Text>
    </div>
      </Card>
    </div>
  )
}

export default Cardcard4
