'use client'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { codeExecution } from '@/app/utils/codeExecution';
import React, { useState,useEffect,useContext } from 'react'
import { List,Text } from '@gravity-ui/uikit';
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import ConfirmModal from '@/app/components/confirmModal';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';


const Listlist2 = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const token:string = getCookie('token'); 
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const toast:any=useInfoMsg();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps;
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps;
  const {clientnamed83af, setclientnamed83af}= useContext(TotalContext) as TotalContextProps;
  const {check1238c5, setcheck1238c5}= useContext(TotalContext) as TotalContextProps;
  const {radio12a158, setradio12a158}= useContext(TotalContext) as TotalContextProps;
  const {group1a5574, setgroup1a5574}= useContext(TotalContext) as TotalContextProps;
  const {card90449, setcard90449}= useContext(TotalContext) as TotalContextProps;
  const {areatext565ce, setareatext565ce}= useContext(TotalContext) as TotalContextProps;
  const {mobile5fccb, setmobile5fccb}= useContext(TotalContext) as TotalContextProps;
  const {check2f409e, setcheck2f409e}= useContext(TotalContext) as TotalContextProps;
  const {radio28c1aa, setradio28c1aa}= useContext(TotalContext) as TotalContextProps;
  const {group254618, setgroup254618}= useContext(TotalContext) as TotalContextProps;
  const {card2f1076, setcard2f1076}= useContext(TotalContext) as TotalContextProps;
  const {areatext22664f, setareatext22664f}= useContext(TotalContext) as TotalContextProps;
  const {datepicker947d2, setdatepicker947d2}= useContext(TotalContext) as TotalContextProps;
  const {datepicker24ce5c, setdatepicker24ce5c}= useContext(TotalContext) as TotalContextProps;
  const {list52c9c, setlist52c9c}= useContext(TotalContext) as TotalContextProps;
  const {list2652d3, setlist2652d3}= useContext(TotalContext) as TotalContextProps;
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps;
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps;
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps;
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps;
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps;
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [confirmMsg, setConfirmMsg] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({confirmMsgTitle:"",confirmMsgContent:"",confirmFun:()=>{}});    

const items=[
  {
    "title": "hhhh",
    "disabled": false,
    "group": false
  },
  {
    "title": "heelo",
    "disabled": false,
    "group": false
  }
] ;

const handleonItemClick=async(value:any)=>{
  setformdaeb3((prev: any) => ({ ...prev, list2: value.title||"" }));
  setConfirmMsg(true);
  setConfirmModal((pre:any)=>({...pre,
    confirmMsgTitle:"are you sure",
    confirmMsgContent:"are you sure",
    confirmFun: handleConfirmOnClick}));
   let code:any="";

    if (code != '') {
    let codeStates: any = {};
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
      codeStates['postgres']  = postgres7f5c4,
      codeStates['setpostgres'] = setpostgres7f5c4,
      codeStates['transactions']  = transactions10ab7,
      codeStates['settransactions'] = settransactions10ab7,
  codeExecution(code,codeStates);
  }
}
async function handleConfirmOnClick(){
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
      "value": "uouiopu",
      "enabled": true
    }
  }
];
  let filterData = await getFilterProps(filterProps,formdaeb3);
  settransactionsuf_v1Props([...filterData ]);
  setShowProfileAsModalOpen(true);
}
if (list2652d3?.isHidden) {
  return <></>;
}

return (
     <div 
      style={{gridColumn: `7 / 9`,gridRow: `3 / 4`,marginTop: `auto`, gap:`10px`}} >
      <ConfirmModal confirmMsg={confirmMsg} setConfirmMsg={setConfirmMsg} confirmMsgTitle={confirmModal.confirmMsgTitle} confirmMsgContent={confirmModal.confirmMsgContent} handleConfirm={confirmModal.confirmFun} />
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
      <List 
      className=""
      selectedItemIndex= {items.findIndex(item => item.title == formdaeb3.list)}
      itemsHeight={100}
      items={items}
      onItemClick={value => handleonItemClick(value)}
      renderItem={item => {
        if (item.group) {
          return (
            <div className={'group'}>
              <div className={'select-text'}>{item.title}</div>
            </div>
          )
        }
        return (
          <div className={'select'}>
            <div className={'select-text'}>{item.title}</div>
          </div>
        )
      }}
      />
    </div>
  )
}
export default Listlist2