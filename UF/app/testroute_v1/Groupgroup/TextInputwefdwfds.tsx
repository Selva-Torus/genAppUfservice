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
import * as v from 'valibot';


const TextInputwefdwfds = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
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
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'wefdwfds',type:"text"})
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
  const {groupaaf24, setgroupaaf24}= useContext(TotalContext) as TotalContextProps;
  const {groupaaf24Props, setgroupaaf24Props}= useContext(TotalContext) as TotalContextProps;
  const {addd6f6de, setaddd6f6de}= useContext(TotalContext) as TotalContextProps;
  const {wefdwfds735d5, setwefdwfds735d5}= useContext(TotalContext) as TotalContextProps;
  const {group7bc2c, setgroup7bc2c}= useContext(TotalContext) as TotalContextProps;
  const {group7bc2cProps, setgroup7bc2cProps}= useContext(TotalContext) as TotalContextProps;
  const {dfdsfdsb8f34, setdfdsfdsb8f34}= useContext(TotalContext) as TotalContextProps;
  const {csdcsdcsd4b217, setcsdcsdcsd4b217}= useContext(TotalContext) as TotalContextProps;
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
    setValidate((pre:any)=>({...pre,wefdwfds:undefined}))
    if(dynamicStateandType.type=="number"){
    setgroupaaf24((prev: any) => ({ ...prev, wefdwfds: +e.target.value }))
    }
    else{
    setgroupaaf24((prev: any) => ({ ...prev, wefdwfds: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['group']  = groupaaf24,
      codeStates['setgroup'] = setgroupaaf24,
      codeStates['group']  = group7bc2c,
      codeStates['setgroup'] = setgroup7bc2c,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixUF:AFVK:v1",
          componentId: "02640bc58ee74454a88bcb3c267aaf24",
          controlId: "796716b9522e4c0badd65e7f091735d5",
          isTable: false,
          from:"TextInputwefdwfds",
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
      
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'wefdwfds',type:'text'}
        type={
          name:'wefdwfds',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.wefdwfds.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.wefdwfds.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.wefdwfds.type
        }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setgroupaaf24((pre:any)=>({...pre,wefdwfds:orchestrationData?.data?.dstData}))
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

  if (wefdwfds735d5?.isHidden) {
    return <></>
  }
  return (   
    <div 
      style={{gridColumn: `5 / 8`,gridRow: `5 / 22`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("dcdscsd")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={groupaaf24?.wefdwfds||""}
         disabled= {wefdwfds735d5?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly= {wefdwfds735d5?.isDisabled ? true : false}
        size='m'      
        view='normal'
        validationState={validate?.wefdwfds ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputwefdwfds
