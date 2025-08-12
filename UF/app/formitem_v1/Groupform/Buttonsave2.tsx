'use client'
import React, { useState,useEffect,useContext, useRef } from 'react'
import axios from 'axios';
import {Button,Container,Text } from '@gravity-ui/uikit';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import TorusButton from '@/app/TorusComponents/Button';
import TorusIcon from '@/app/TorusComponents/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import ConfirmModal from '@/app/components/confirmModal';



    

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
 

const Buttonsave2 =  ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keyset:any=i18n.keyset("language")
  const token:string = getCookie('token');
  const confirmMsgFlag: boolean = true
 
  const toast:any=useInfoMsg()

  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("")
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  let dfKey: string | any
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const lockMode:any = lockedData.lockMode;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [loading, setLoading] = useState(false)
  const sessionInfo:any = {
    accessToken: token,
    authToken: ''
  }
  const routes = useRouter()
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
  const [confirmMsg, setConfirmMsg] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({confirmMsgTitle:"",confirmMsgContent:"",confirmFun:()=>{}});    
  let code:any = "";
    
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


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any
  const handleCustomCode=async () => {
    if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
        customCode = codeExecution(code,codeStates)
        return customCode
    }
  }
  const handleMapper=async () => {
    try{
     
    }catch(err)
    {
        console.log(err)
    }
  }

  useEffect(()=>{
    handleMapper()
    eventBus.on("triggerButton", (id:any) => {
      if (id === "save21b74b") {
        buttonRef.current?.click();
      }
    });

  },[save21b74b?.refresh])

  const handleClick=async()=>{
    if(formdaeb3Props?.validation==true && formdaeb3Props?.required==true || formdaeb3Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
    } 
    await handleCustomCode()
    let saveCheck=false
    Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger')
      return
    }
    try{  
    setConfirmMsg(true)
    setConfirmModal((pre:any)=>({...pre,
      confirmMsgTitle:"are you sure",
      confirmMsgContent:"are you sure",
      confirmFun: handleConfirmOnClick
          }))
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger')
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger')
      setLoading(false)
    }
  }
  const handleBlur=(e:any)=>{
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
  async function handleConfirmOnClick(){
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
      "value": "transaction_id",
      "enabled": true
    }
  }
];
    let filterData = await getFilterProps(filterProps,formdaeb3);
    settransactionsuf_v1Props([...filterData ]);
    routes.push(getRouteScreenDetails('CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1', 'transactionsuf_v1'))
  } 


 if (save21b74b?.isHidden) {
    return <></>
  }

  return (
    <div 
      style={{gridColumn: `8 / 10`,gridRow: `5 / 6`,marginTop: `auto`, gap:`10px`}} >
        <ConfirmModal confirmMsg={confirmMsg} setConfirmMsg={setConfirmMsg} confirmMsgTitle={confirmModal.confirmMsgTitle} confirmMsgContent={confirmModal.confirmMsgContent} handleConfirm={confirmModal.confirmFun} />
        <TorusButton 
          ref={buttonRef}
          className="w-full "
          onClick={handleClick}
          onBlur={handleBlur}
          disabled= {save21b74b?.isDisabled ? true : false}
        >
              {keyset("save2")}
        </TorusButton>
    </div>
  )
}
export default Buttonsave2