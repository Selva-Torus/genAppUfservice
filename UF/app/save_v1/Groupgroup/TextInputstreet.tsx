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
import * as v from 'valibot';


const TextInputstreet = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
  "mapper": [
    {
      "sourceKey": [
        "CK:TT407:FNGK:AF:FNK:DF-DFD:CATK:CGFA:AFGK:TG4CGFA:AFK:forDFcheck:AFVK:v1|f250a27ce95f46e08f508b2286c68d5d|properties.address"
      ],
      "targetKey": "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:Testasample:AFVK:v1|414718cf9b784538acdbc0a9cb15384d|8696101863d94d52a9ad827018d1e063"
    }
  ],
  "schemaData": {
    "type": "object",
    "properties": {
      "street": {
        "type": "string"
      },
      "phone": {
        "type": "string"
      }
    },
    "required": [
      "street",
      "phone"
    ]
  }
}
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'street',type:"text"})
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
  const {group5384d, setgroup5384d}= useContext(TotalContext) as TotalContextProps;
  const {group5384dProps, setgroup5384dProps}= useContext(TotalContext) as TotalContextProps;
  const {save11c8e, setsave11c8e}= useContext(TotalContext) as TotalContextProps;
  const {buttonreject8b1d9, setbuttonreject8b1d9}= useContext(TotalContext) as TotalContextProps;
  const {label0cb72, setlabel0cb72}= useContext(TotalContext) as TotalContextProps;
  const {name1ef9f, setname1ef9f}= useContext(TotalContext) as TotalContextProps;
  const {age6bba1, setage6bba1}= useContext(TotalContext) as TotalContextProps;
  const {street1e063, setstreet1e063}= useContext(TotalContext) as TotalContextProps;
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
    setValidate((pre:any)=>({...pre,street:undefined}))
    if(dynamicStateandType.type=="number"){
    setgroup5384d((prev: any) => ({ ...prev, street: +e.target.value }))
    }
    else{
    setgroup5384d((prev: any) => ({ ...prev, street: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['group']  = group5384d,
      codeStates['setgroup'] = setgroup5384d,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:Testasample:AFVK:v1",
          componentId: "414718cf9b784538acdbc0a9cb15384d",
          controlId: "8696101863d94d52a9ad827018d1e063",
          isTable: false,
          from:"TextInputstreet",
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
        let type:any={name:'street',type:'text'}
        type={
          name:'street',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.street.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.street.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.street.type
        }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setgroup5384d((pre:any)=>({...pre,street:orchestrationData?.data?.dstData}))
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

  if (street1e063?.isHidden) {
    return <></>
  }
  return (   
    <div 
      style={{gridColumn: `8 / 10`,gridRow: `58 / 68`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TorusTextInput
        require={isRequredData}
        className=""
        label={keyset("street")}
        onChange= {handleChange}
        onBlur={()=>handleBlur()}
        type={dynamicStateandType.type}
        value={group5384d?.street||""}
         disabled= {street1e063?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly= {street1e063?.isDisabled ? true : false}
        size='m'      
        view='normal'
        validationState={validate?.street ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputstreet
