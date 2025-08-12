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


import Tabletransactions  from './Tabletransactions';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupTransactions = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData}:any) => {

  const securityData:any={
  "Employee": {
    "allowedControls": [
      "transaction_id",
      "amount",
      "transaction_type"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "userTemplate": {
    "allowedControls": [
      "transaction_id",
      "amount",
      "transaction_type"
    ],
    "blockedControls": [],
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
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps  
  const {transaction_idb85fc, settransaction_idb85fc}= useContext(TotalContext) as TotalContextProps  
  const {amount13d15, setamount13d15}= useContext(TotalContext) as TotalContextProps  
  const {transaction_type036bb, settransaction_type036bb}= useContext(TotalContext) as TotalContextProps  
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
    if(securityData[accessProfile]?.['readOnlyControls'].includes("transaction_id")){
      settransaction_idb85fc({...transaction_idb85fc,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("amount")){
      setamount13d15({...amount13d15,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("transaction_type")){
      settransaction_type036bb({...transaction_type036bb,isDisabled:true})
    }
  //////////////
  }


  const handleOnload=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(transactions10ab7) && Object.keys(transactions10ab7)?.length>0)
      {
        settransactions10ab7({})
      }
    }else 
      prevRefreshRef.current= true
  }, [transactions10ab7Props?.refresh])

  return (
    <div className="col-start-1 col-end-13 row-start-1 row-end-4 gap-10px border border-slate-300 p-2 rounded-md groupStyle">
      <Grid containerClass='grid grid-cols-12 gap-2 '>
        {<Tabletransactions lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}  />}
      </Grid>
    </div>             
  )
}

export default GroupTransactions