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


const TextInputIdentifier = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'identifier',type:"text"})
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
  const {ais_groupbe189, setais_groupbe189}= useContext(TotalContext) as TotalContextProps;
  const {ais_groupbe189Props, setais_groupbe189Props}= useContext(TotalContext) as TotalContextProps;
  const {get_accounts1a859, setget_accounts1a859}= useContext(TotalContext) as TotalContextProps;
  const {get_accounts1a859Props, setget_accounts1a859Props}= useContext(TotalContext) as TotalContextProps;
  const {type16590, settype16590}= useContext(TotalContext) as TotalContextProps;
  const {baseconsentid56ba8, setbaseconsentid56ba8}= useContext(TotalContext) as TotalContextProps;
  const {expirationdatetime2cbfb, setexpirationdatetime2cbfb}= useContext(TotalContext) as TotalContextProps;
  const {transactionfromdatetimeaa64f, settransactionfromdatetimeaa64f}= useContext(TotalContext) as TotalContextProps;
  const {transactiontodatetime00c33, settransactiontodatetime00c33}= useContext(TotalContext) as TotalContextProps;
  const {accountidb7d92, setaccountidb7d92}= useContext(TotalContext) as TotalContextProps;
  const {accounttypefc49d, setaccounttypefc49d}= useContext(TotalContext) as TotalContextProps;
  const {accountsubtypeb9399, setaccountsubtypeb9399}= useContext(TotalContext) as TotalContextProps;
  const {tradingname22dd3, settradingname22dd3}= useContext(TotalContext) as TotalContextProps;
  const {legalnamebccff, setlegalnamebccff}= useContext(TotalContext) as TotalContextProps;
  const {identifiertype37db2, setidentifiertype37db2}= useContext(TotalContext) as TotalContextProps;
  const {identifiera6abf, setidentifiera6abf}= useContext(TotalContext) as TotalContextProps;
  const {consentida3e0f, setconsentida3e0f}= useContext(TotalContext) as TotalContextProps;
  const {apiname543a3, setapiname543a3}= useContext(TotalContext) as TotalContextProps;
  const {permissionsf74a7, setpermissionsf74a7}= useContext(TotalContext) as TotalContextProps;
  const {usertype218a1, setusertype218a1}= useContext(TotalContext) as TotalContextProps;
  const {purpose3c50a, setpurpose3c50a}= useContext(TotalContext) as TotalContextProps;
  const {urle0b3a, seturle0b3a}= useContext(TotalContext) as TotalContextProps;
  const {call_get_accounts51bce, setcall_get_accounts51bce}= useContext(TotalContext) as TotalContextProps;
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
    setValidate((pre:any)=>({...pre,identifier:undefined}))
    if(dynamicStateandType.type=="number"){
    setget_accounts1a859((prev: any) => ({ ...prev, identifier: +e.target.value }))
    }
    else{
    setget_accounts1a859((prev: any) => ({ ...prev, identifier: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['ais_group']  = ais_groupbe189,
      codeStates['setais_group'] = setais_groupbe189,
      codeStates['get_accounts']  = get_accounts1a859,
      codeStates['setget_accounts'] = setget_accounts1a859,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1",
          componentId: "e63637758360439db9014a076931a859",
          controlId: "78896526c2f047b1ad2bea385e1a6abf",
          isTable: false,
          from:"TextInputidentifier",
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
        let type:any={name:'identifier',type:'text'}
        type={
          name:'identifier',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.identifier.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.identifier.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.identifier.type
        }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setget_accounts1a859((pre:any)=>({...pre,identifier:orchestrationData?.data?.dstData}))
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

  if (identifiera6abf?.isHidden) {
    return <></>
  }
  return (   
    <div 
className="flex flex-col "      style={{gridColumn: `7 / 13`,gridRow: `106 / 126`, gap:``, height: `100%`, overflow: 'auto'}} >
        <div>
          <Text className="pb-2">{keyset("Identifier")}
          {isRequredData && <span style={{ color: 'red' }}>*</span>}
          </Text>
        </div>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("Identifier")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={get_accounts1a859?.identifier||""}
         disabled= {identifiera6abf?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly= {identifiera6abf?.isDisabled ? true : false}
        size='m'      
        view='normal'
        validationState={validate?.identifier ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputIdentifier
