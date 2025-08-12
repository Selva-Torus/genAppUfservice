'use client'
import React, { useState,useContext,useEffect,useRef } from 'react';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupOption, Modal, Text } from '@gravity-ui/uikit';
import { AxiosService } from "@/app/components/axiosService";
import { getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import ConfirmModal from '@/app/components/confirmModal';

const RadioGroupgroup2 = ({encryptionFlagCompData}:any) => {
  const prevRefreshRef = useRef(false);
  const toast:any=useInfoMsg();
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const token: string = getCookie('token');
  const [allCode,setAllCode]=useState<any>("");
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const routes = useRouter();
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const confirmMsgFlag: boolean = true;
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
  const [confirmMsg, setConfirmMsg] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({confirmMsgTitle:"",confirmMsgContent:"",confirmFun:()=>{}});    
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
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps;
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps;
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps;
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps;
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps;
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const options: RadioGroupOption[] = [
      {value: 'group2' ,content:'group2'},
      {value: 'group21' ,content:'group21'},
  ];

    useEffect(()=>{
      setformdaeb3((pre:any)=>({...pre,group2:""}));
    },[group254618?.refresh])

    const handleChange= async(e:any)=>{
    setformdaeb3((prev: any) => ({ ...prev, group2: e.target.value }));
      setConfirmMsg(true);
      setConfirmModal((pre:any)=>({...pre,
        confirmMsgTitle:"are you sure",
        confirmMsgContent:"are you sure",  
        confirmFun: handleConfirmonChange
            }))
    let code:any= ``;
      if (code == "") {
        //toast(code?.data?.errorDetails?.message, 'danger')
        //return
      }  else if (code != '') {
        let codeStates: any = {}
              codeStates['form']  = formdaeb3,
              codeStates['setform'] = setformdaeb3,
              codeStates['postgres']  = postgres7f5c4,
              codeStates['setpostgres'] = setpostgres7f5c4,
              codeStates['transactions']  = transactions10ab7,
              codeStates['settransactions'] = settransactions10ab7,
      codeExecution(code,codeStates);
      }
  }

    async function handleConfirmonChange(){
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
      "value": "transcation_id",
      "enabled": true
    }
  }
];
      let filterData = await getFilterProps(filterProps,formdaeb3);
      settransactionsuf_v1Props([...filterData ]);
    routes.push(getRouteScreenDetails('CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1', 'transactionsuf_v1'));
  }

 
  if (group254618?.isHidden) {
    return <></>
  }

return (
  <div 
  style={{gridColumn: `7 / 9`,gridRow: `2 / 3`,marginTop: `auto`, gap:`10px`}} >
      <ConfirmModal confirmMsg={confirmMsg} setConfirmMsg={setConfirmMsg} confirmMsgTitle={confirmModal.confirmMsgTitle} confirmMsgContent={confirmModal.confirmMsgContent} handleConfirm={confirmModal.confirmFun} />
      <RadioGroup
      className=""
        value={formdaeb3?.group2 || ""}    
        disabled= {group254618?.isDisabled ? true : false}
        defaultValue={options.length>0?options[0].value:""}
        options={options}
        onChange={handleChange}
      />
  </div>
  )
}
export default RadioGroupgroup2