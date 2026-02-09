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

const TextInputusername = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
  "mapper": [
    {
      "sourceKey": [
        "CK:CT309:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:myDfdData:AFVK:v1|8261569e8bf64e7d8523f01bc79f8e83|items.properties.name"
      ],
      "targetKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1|148827029a474f2db3ba030ecc17f4e1|40287b808d434e038890e4cce8457f7f"
    }
  ],
  "schemaData": {
    "type": "string"
  }
}
  const {dfd_mydfddata_v1Props, setdfd_mydfddata_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'name',type:"text"})
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
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps;
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps;
  const {save8d5a7, setsave8d5a7}= useContext(TotalContext) as TotalContextProps;
  const {username57f7f, setusername57f7f}= useContext(TotalContext) as TotalContextProps;
  const {checkboxebbe6, setcheckboxebbe6}= useContext(TotalContext) as TotalContextProps;
  const {date419b1, setdate419b1}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  

  // Validation  
    const [error, setError] = useState<string>('');
      /// vvv
      /// vvv
      /// vvv
      /// vvv
  schemaArray = [] ;
  const handleChange = async(e: any) => {
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['maingroup']  = {...maingroup7f4e1,name:newInputValue},
      codeStates['setmaingroup'] = setmaingroup7f4e1,
      codeStates['userable']  = {...userable8d616,name:newInputValue},
      codeStates['setuserable'] = setuserable8d616,
    codeExecution(code,codeStates)
    }  
    setError('')
    setValidate((pre:any)=>({...pre,name:undefined}))
    if(dynamicStateandType.type=="number"){
    setmaingroup7f4e1((prev: any) => ({ ...prev, name: +e.target.value }))
    }
    else{
    setmaingroup7f4e1((prev: any) => ({ ...prev, name: e.target.value }))
    }
  }
  const handleBlur=async () => {
    
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",
          componentId: "148827029a474f2db3ba030ecc17f4e1",
          controlId: "40287b808d434e038890e4cce8457f7f",
          isTable: false,
          from:"TextInputusername",
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
        let type:any={name:'name',type:'text'}
        type={
          name:'name',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'name',type:'text'}
        type={
          name:'name',
          type: orchestrationData?.data?.schemaData[0].schema.properties.name.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.name.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.name.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setmaingroup7f4e1((pre:any)=>({...pre,name:orchestrationData?.data?.dstData}))
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
  useEffect(() => {
  if(dfd_mydfddata_v1Props?.setSearchFilters && dfd_mydfddata_v1Props?.data)
  {
    if(Array.isArray(dfd_mydfddata_v1Props.data) && dfd_mydfddata_v1Props.data.length > 0){
      setmaingroup7f4e1((pre:any)=>({...pre,name:dfd_mydfddata_v1Props.data[0]?.name}));
    }
  }
  },[dfd_mydfddata_v1Props?.setSearchFilters])
  if (username57f7f?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `5 / 12`,gridRow: `35 / 45`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("username")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={maingroup7f4e1?.name||""}
         disabled= {username57f7f?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        validationState={validate?.name ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputusername
