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


const TextInputversion = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1|bfcdbb21028547269c3c5bde0907e7bc|properties.version"
      ],
      "targetKey": "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1|862b2b2574e048eca62763b9b23b475a|0aad9d69d7b44d51bf095717a5095ead"
    }
  ],
  "schemaData": {
    "type": "string"
  }
}
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'version',type:"text"})
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
  const {vmc_msg_infob41b0, setvmc_msg_infob41b0}= useContext(TotalContext) as TotalContextProps;
  const {vmc_msg_infob41b0Props, setvmc_msg_infob41b0Props}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106c, setinfo_summary_repository_group8106c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106cProps, setinfo_summary_repository_group8106cProps}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609be, setmsg_group609be}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609beProps, setmsg_group609beProps}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475a, setapi_repository_groupsb475a}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475aProps, setapi_repository_groupsb475aProps}= useContext(TotalContext) as TotalContextProps;
  const {msgnames7a309, setmsgnames7a309}= useContext(TotalContext) as TotalContextProps;
  const {versionsbeb4b, setversionsbeb4b}= useContext(TotalContext) as TotalContextProps;
  const {statuss18862, setstatuss18862}= useContext(TotalContext) as TotalContextProps;
  const {release_datesb8be1, setrelease_datesb8be1}= useContext(TotalContext) as TotalContextProps;
  const {source_msg_typea3c5a, setsource_msg_typea3c5a}= useContext(TotalContext) as TotalContextProps;
  const {version95ead, setversion95ead}= useContext(TotalContext) as TotalContextProps;
  const {status3a35d, setstatus3a35d}= useContext(TotalContext) as TotalContextProps;
  const {release_date27b40, setrelease_date27b40}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62cProps, setinfo_summary_groups8d62cProps}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps;
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
    setValidate((pre:any)=>({...pre,version:undefined}))
    if(dynamicStateandType.type=="number"){
    setapi_repository_groupsb475a((prev: any) => ({ ...prev, version: +e.target.value }))
    }
    else{
    setapi_repository_groupsb475a((prev: any) => ({ ...prev, version: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['vmc_msg_info']  = vmc_msg_infob41b0,
      codeStates['setvmc_msg_info'] = setvmc_msg_infob41b0,
      codeStates['info_summary_repository_group']  = info_summary_repository_group8106c,
      codeStates['setinfo_summary_repository_group'] = setinfo_summary_repository_group8106c,
      codeStates['msg_group']  = msg_group609be,
      codeStates['setmsg_group'] = setmsg_group609be,
      codeStates['api_repository_groups']  = api_repository_groupsb475a,
      codeStates['setapi_repository_groups'] = setapi_repository_groupsb475a,
      codeStates['info_summary_groups']  = info_summary_groups8d62c,
      codeStates['setinfo_summary_groups'] = setinfo_summary_groups8d62c,
      codeStates['api_process_log']  = api_process_log17839,
      codeStates['setapi_process_log'] = setapi_process_log17839,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",
          componentId: "862b2b2574e048eca62763b9b23b475a",
          controlId: "0aad9d69d7b44d51bf095717a5095ead",
          isTable: false,
          from:"TextInputversion",
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
        let type:any={name:'version',type:'text'}
        type={
          name:'version',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.version.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.version.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.version.type
        }
        setDynamicStateandType(type)
       
      } 
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
       if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'version',type:'text'}
        type={
          name:'version',
          type: orchestrationData?.data?.schemaData[0].schema.properties.version.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.version.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.version.type
        }
        setDynamicStateandType(type)
      }
    }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setapi_repository_groupsb475a((pre:any)=>({...pre,version:orchestrationData?.data?.dstData}))
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

  if (version95ead?.isHidden) {
    return <></>
  }
  return (   
    <div 
      style={{gridColumn: `4 / 6`,gridRow: `17 / 30`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={api_repository_groupsb475a?.version||""}
         disabled= {version95ead?.isDisabled ? true : false}
        pin='brick-brick'     
        readOnly={true}
        view='normal'
        validationState={validate?.version ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputversion
