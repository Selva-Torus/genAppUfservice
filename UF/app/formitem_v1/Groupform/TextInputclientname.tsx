'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TorusTextInput } from '@/app/TorusComponents/TextInput';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Button,Text } from "@gravity-ui/uikit";
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';


const TextInputclientname = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
 const actionDetails :any = {
  "action": {
    "lock": {
      "lockMode": "",
      "name": "",
      "ttl": ""
    },
    "stateTransition": {
      "sourceQueue": "",
      "sourceStatus": "",
      "targetQueue": "",
      "targetStatus": ""
    },
    "pagination": {
      "page": "1",
      "count": "10"
    },
    "encryption": {
      "isEnabled": false,
      "selectedDpd": "",
      "encryptionMethod": ""
    },
    "events": {}
  },
  "code": "",
  "rule": {},
  "events": {
    "NDS": [],
    "NDE": []
  },
  "mapper": [
    {
      "sourceKey": [
        "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:vesselDFD:AFVK:v1|279177efdf6040008fa93b58c074a266|properties.clientname"
      ],
      "targetKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1|e5f95e127d7e42c8a14f50eca18daeb3|d1a49aa03381485faf6894b9513d83af"
    }
  ],
  "dstData": [],
  "schemaData": {
    "type": "string"
  }
}
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const token: string = getCookie('token');
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'clientname',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
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
  //////////////
  

  // Validation
  schemaArray = [] ;

  const handleChange = async(e: any) => {
    if(dynamicStateandType.type=="number"){
    setformdaeb3((prev: any) => ({ ...prev, clientname: +e.target.value }))
    }
    else{
    setformdaeb3((prev: any) => ({ ...prev, clientname: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=``;
     if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
    codeExecution(code,codeStates)
    }
  }

    useEffect(()=>{
        handleBlur()
    },[validateRefetch.value])

    if (clientnamed83af?.isHidden) {
      return <></>
    }

  return (   
    <div 
      style={{gridColumn: `1 / 3`,gridRow: `1 / 2`,marginTop: `auto`, gap:`10px`}} >
      <TorusTextInput
      className=""
        label={keyset("clientname")}
        onChange= {handleChange}
        onBlur={()=>handleBlur()}
        type={dynamicStateandType.type}
        value={formdaeb3?.clientname||""}
      disabled= {clientnamed83af?.isDisabled ? true : false}
          readOnly= {clientnamed83af?.isDisabled ? true : false}
      />
    </div>
        
  )
}
export default TextInputclientname