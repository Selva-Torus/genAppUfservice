'use client'

import React,{ useEffect, useState,useContext, useRef } from 'react'
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService'
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation'
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
// page import
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';


import Tablepostgres  from './Tablepostgres';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupPostgres = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData}:any) => {

  const securityData:any={
  "Employee": {
    "allowedControls": [
      "billingid",
      "billingparty"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "userTemplate": {
    "allowedControls": [],
    "blockedControls": [
      "billingid",
      "billingparty"
    ],
    "readOnlyControls": []
  }
}
  const code:any = ``
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("")
  const toast=useInfoMsg()
  const confirmMsgFlag: boolean = false
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const token:string = getCookie('token'); 
  const routes = useRouter()
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps  
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  const {billingid842ca, setbillingid842ca}= useContext(TotalContext) as TotalContextProps  
  const {billingparty7a9f7, setbillingparty7a9f7}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const encryptionFlagComp: boolean = encryptionFlagPageData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData.method
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }
  
  async function securityCheck() {

    
  /////////////
    if(securityData[accessProfile]?.['readOnlyControls'].includes("billingid")){
      setbillingid842ca({...billingid842ca,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("billingparty")){
      setbillingparty7a9f7({...billingparty7a9f7,isDisabled:true})
    }
  //////////////
  }


  const handleOnload=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(postgres7f5c4) && Object.keys(postgres7f5c4)?.length>0)
      {
        setpostgres7f5c4({})
      }
    }else 
      prevRefreshRef.current= true
  }, [postgres7f5c4Props?.refresh])

  return (
    <div className="col-start-1 col-end-13 row-start-4 row-end-6 gap-10px border border-slate-300 p-2 rounded-md groupStyle">
      <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
        <div className='flex h-[30px] w-full'>
          <div className='flex  w-[100%] justify-center font-bold text-lg'>transactionsUF</div>
          <button
            className='flex w-[30px] justify-end'
            onClick={() => setShowProfileAsModalOpen(false)}
          >
            X
          </button>
        </div>
        <PageTransactionsufpage/>
      </Modal>
      <Grid containerClass='grid grid-cols-12 gap-2 '>
        {<Tablepostgres lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}  />}
      </Grid>
    </div>             
  )
}

export default GroupPostgres