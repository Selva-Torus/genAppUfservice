'use client'
import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
//////////
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TextToSpeech } from "@/components/TextToSpeech";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import { DatePicker } from '@/components/DatePicker';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
////////////
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';


const TextToSpeechOutputtext_to_speech = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
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
  "events": {},
  "mapper": []
}
  const toast:any=useInfoMsg();
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>(""); 
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'text_to_speech',type:"text"});
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  

  const handleChange = async(e: any) => {
    await handleBlur();
    if(dynamicStateandType.type=="number"){
    setgroupbffe9((prev: any) => ({ ...prev, text_to_speech: +e.target.value }))
    }
    else{
    setgroupbffe9((prev: any) => ({ ...prev, text_to_speech: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any= allCode;
     if (code != '') {
      let codeStates: any = {}
      codeStates['group']  = groupbffe9,
      codeStates['setgroup'] = setgroupbffe9,
      codeStates['usertable']  = usertable8d993,
      codeStates['setusertable'] = setusertable8d993,
      codeStates['usertable2']  = usertable2b6e16,
      codeStates['setusertable2'] = setusertable2b6e16,
    codeExecution(code,codeStates)
    }
  }

  useEffect(()=>{
    handleBlur()
  },[validateRefetch.value])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
          componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
          controlId: "679777b8f60647c887a3fafdffd7626c",
          isTable: false,
          from:"TextInputtext_to_speech",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
       
        return
      }
      setAllCode(orchestrationData?.data?.code)
      
      if(orchestrationData?.data?.schemaData){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'text_to_speech',type:'text'}
        type={
          name:'text_to_speech',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.text_to_speech.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.text_to_speech.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.text_to_speech.type
        }
        setDynamicStateandType(type);       
      }
    }
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    handleMapperValue();
    setgroupbffe9((pre:any)=>({...pre,text_to_speech:""}));
  },[text_to_speech7626c?.refresh])

  if (text_to_speech7626c?.isHidden) {
    return <></>
  }

  return (   
    <div 
      style={{
        gridColumn: `2 / 8`,
        gridRow: `199 / 222`, 
        gap:``, 
        height: `100%`, 
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <TextToSpeech
        className=""
        // label={keyset("text_to_speech")}
        needTooltip={true}  
        tooltipProps={{title:"tool",placement:"bottom-start"}}
        onUpdate= {handleChange}
        onBlur={()=>handleBlur()}
        // type={dynamicStateandType.type}
        value={groupbffe9?.text_to_speech||""}
        disabled= {text_to_speech7626c?.isDisabled ? true : false}
        placeholder = 'placeholder'      
      />
    </div>
        
  )
}

export default TextToSpeechOutputtext_to_speech
