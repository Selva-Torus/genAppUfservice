'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import {TextArea,Text} from "@gravity-ui/uikit";
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { eventBus } from '@/app/eventBus';
import {Modal} from '@gravity-ui/uikit';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
////////////////// page import
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';


const Textareaareatext2 = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'areatext2',type:"text"})
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const token: string = getCookie('token')
  const toast:any=useInfoMsg()
  const routes = useRouter()
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  let code:any="";
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps  
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps  
  const {clientnamed83af, setclientnamed83af}= useContext(TotalContext) as TotalContextProps  
  const {check1238c5, setcheck1238c5}= useContext(TotalContext) as TotalContextProps  
  const {radio12a158, setradio12a158}= useContext(TotalContext) as TotalContextProps  
  const {group1a5574, setgroup1a5574}= useContext(TotalContext) as TotalContextProps  
  const {card90449, setcard90449}= useContext(TotalContext) as TotalContextProps  
  const {areatext565ce, setareatext565ce}= useContext(TotalContext) as TotalContextProps  
  const {mobile5fccb, setmobile5fccb}= useContext(TotalContext) as TotalContextProps  
  const {check2f409e, setcheck2f409e}= useContext(TotalContext) as TotalContextProps  
  const {radio28c1aa, setradio28c1aa}= useContext(TotalContext) as TotalContextProps  
  const {group254618, setgroup254618}= useContext(TotalContext) as TotalContextProps  
  const {card2f1076, setcard2f1076}= useContext(TotalContext) as TotalContextProps  
  const {areatext22664f, setareatext22664f}= useContext(TotalContext) as TotalContextProps  
  const {datepicker947d2, setdatepicker947d2}= useContext(TotalContext) as TotalContextProps  
  const {datepicker24ce5c, setdatepicker24ce5c}= useContext(TotalContext) as TotalContextProps  
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps  
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
    useEffect(()=>{
      setformdaeb3((pre:any)=>({...pre,areatext2:""}))
    },[areatext22664f?.refresh])

  const handleBlur=async(e:any)=>{
    if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
      codeStates['postgres']  = postgres7f5c4,
      codeStates['setpostgres'] = setpostgres7f5c4,
      codeStates['transactions']  = transactions10ab7,
      codeStates['settransactions'] = settransactions10ab7,
    codeExecution(code,codeStates)
    }
  }
  const handleChange = async(e: any) => {
    if(dynamicStateandType.type=="number"){
      setformdaeb3((prev: any) => ({ ...prev, areatext2: +e.value }))
    }
    else{
      setformdaeb3((prev: any) => ({ ...prev, areatext2: e.value }))
    }
  }
  const handleFocus=async(e:any)=>{
    // showProfileAsModal
    let filterProps =  [
  {
    "name": "DFD Key",
    "_type": "asyncSelection",
    "selectionList": [
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1",
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"
    ],
    "value": "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1",
    "enabled": true,
    "_payload": {
      "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:",
      "nodeType": "dfd-node-list"
    },
    "subSelection": {
      "name": "Node Name",
      "_type": "select",
      "selectionList": [
        {
          "key": "127a09c41a0348fc8e93c137b4a4becf",
          "label": "apinode"
        },
        {
          "key": "23d20ae929914fd896ef4ef6f33de29a",
          "label": "datasetnode"
        }
      ],
      "value": "23d20ae929914fd896ef4ef6f33de29a",
      "enabled": true
    },
    "filterKey": {
      "name": "filterKey",
      "_type": "string",
      "selectionList": [],
      "value": "transaction_id",
      "enabled": true
    }
  }
];
    let filterData = await getFilterProps(filterProps,formdaeb3);
    settransactionsuf_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true)
  }
  async function handleConfirmOnFocus(){
  }
  if (areatext22664f?.isHidden) {
    return <></>
  }

return (
  <div 
  style={{gridColumn: `11 / 13`,gridRow: `2 / 3`,marginTop: `auto`, gap:`10px`}} >
  <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
    <div className='flex h-[30px] w-full justify-end'>
      <button
        className='flex w-[30px] justify-end'
        onClick={() => setShowProfileAsModalOpen(false)}
      >
        X
      </button>
    </div>
    <PageTransactionsufpage/>
    </Modal>
  <TextArea
    className=""
    onFocus={handleFocus}
    onChange={e => handleChange(e.target)}
    onBlur={handleBlur}
    value = { formdaeb3?.areatext2 != null && typeof formdaeb3?.areatext2 =='object' ? Object.keys(formdaeb3?.areatext2)?.length ?  JSON.stringify(formdaeb3?.areatext2,null ,2):"" : formdaeb3?.areatext2||""}
      disabled= {areatext22664f?.isDisabled ? true : false}
        readOnly=  {areatext22664f?.isDisabled ? true : false}
    minRows={0}
    maxRows={0}
  />
  </div>
  )
}
export default Textareaareatext2