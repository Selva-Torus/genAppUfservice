'use client'



import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import * as v from 'valibot';


const TextInputtextinput = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
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
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'textinput',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
  /////////////
   //another screen
  const {groupeca86, setgroupeca86}= useContext(TotalContext) as TotalContextProps;
  const {groupeca86Props, setgroupeca86Props}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646, settabgroupe7646}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646Props, settabgroupe7646Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3, settab_header_12cce3}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3Props, settab_header_12cce3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783, settab_header_214783}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783Props, settab_header_214783Props}= useContext(TotalContext) as TotalContextProps;
  const {textinput88309, settextinput88309}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527ef, setoldtabgroup527ef}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527efProps, setoldtabgroup527efProps}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914Props, settab29f914Props}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  

  // Validation  
    const [error, setError] = useState<string>('');
      /// vvv
      /// vvv
      /// vvv
      /// vvv
  schemaArray = [] ;
  const handleChange = async(e: any) => {
    setError('')
    setValidate((pre:any)=>({...pre,textinput:undefined}))
    if(dynamicStateandType.type=="number"){
    settab_header_214783((prev: any) => ({ ...prev, textinput: +e.target.value }))
    }
    else{
    settab_header_214783((prev: any) => ({ ...prev, textinput: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['group']  = groupeca86,
      codeStates['setgroup'] = setgroupeca86,
      codeStates['oldtabgroup']  = oldtabgroup527ef,
      codeStates['setoldtabgroup'] = setoldtabgroup527ef,
      codeStates['table2']  = table2c0657,
      codeStates['settable2'] = settable2c0657,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",
          componentId: "468065e296114e2f99e5fb6690214783",
          controlId: "29f7493db4ed4c7ba165fb3f52788309",
          isTable: false,
          from:"TextInputtextinput",
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
      if(orchestrationData?.data?.schemaData[0].nodeType=='apinode'){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'textinput',type:'text'}
        type={
          name:'textinput',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.textinput.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.textinput.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.textinput.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'textinput',type:'text'}
        type={
          name:'textinput',
          type: orchestrationData?.data?.schemaData[0].schema.properties.textinput.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.textinput.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.textinput.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // settab_header_214783((pre:any)=>({...pre,textinput:orchestrationData?.data?.dstData}))
      }
    }
    catch(err)
    {
      console.log(err)
    }
  }

  useEffect(()=>{
      handleMapperValue()
      handleBlur()
  },[validateRefetch.value])

  if (textinput88309?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `18 / 24`,gridRow: `10 / 20`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("textinput")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={tab_header_214783?.textinput||""}
         disabled= {textinput88309?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        validationState={validate?.textinput ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputtextinput
