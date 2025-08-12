'use client'
import React, { useState, useContext, useEffect, useRef } from 'react' 
import { Text } from '@gravity-ui/uikit';
import { TorusCard } from '@/app/TorusComponents/Card';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { te_refreshDto } from '@/app/interfaces/interfaces';
import ConfirmModal from '@/app/components/confirmModal';
import {Modal} from '@gravity-ui/uikit';


const Cardcard2 = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const token: string = getCookie('token');
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const prevRefreshRef = useRef(false);
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
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

 
  const [confirmMsg, setConfirmMsg] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({confirmMsgTitle:"",confirmMsgContent:"",confirmFun:()=>{}});    
  

  const handleClick=async(value:any)=>{
    setConfirmMsg(true)
    setConfirmModal((pre:any)=>({...pre,
      confirmMsgTitle:"are you sure",
      confirmMsgContent:"are you sure",
      confirmFun: handleConfirmOnClick}))
  }

async  function handleConfirmOnClick(){
    // show as profile code
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
      "value": "xgfg",
      "enabled": true
    }
  }
];
    let filterData = await getFilterProps(filterProps,formdaeb3);
    settransactionsuf_v1Props([...filterData ]);
    routes.push(getRouteScreenDetails('CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1', 'transactionsuf_v1'));
  }

useEffect(() => {
    setformdaeb3((pre:any)=>({...pre,card2:""}));
  },[card2f1076?.refresh])

  const style = {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (card2f1076?.isHidden) {
    return <></>
  }  

  return (
    <div 
    style={{gridColumn: `9 / 11`,gridRow: `2 / 3`,marginTop: `auto`, gap:`10px`}} >
      <ConfirmModal confirmMsg={confirmMsg} setConfirmMsg={setConfirmMsg} confirmMsgTitle={confirmModal.confirmMsgTitle} confirmMsgContent={confirmModal.confirmMsgContent} handleConfirm={confirmModal.confirmFun} />
      <TorusCard 
      style={style}
      className="rounded-lg shadow-lg p-6 bg-white "
          disabled= {card2f1076?.isDisabled ? true : false}
      onClick={handleClick}
      type="action"
      >
      
      {/* <div className="my-4 w-3/4 border-1 border-gray-300"></div> */}
      <div className=' flex justify-center space-x-2  '>
        <Text variant='body-1' className='truncate ' >
        card2
        </Text>
        </div>
        <br/> 
      <div className='flex justify-center'>
      <Text variant ="display-1">
      {formdaeb3?.card2?formdaeb3?.card2:"0"}
      </Text>
    </div>
      </TorusCard>
    </div>
  )
}
export default Cardcard2