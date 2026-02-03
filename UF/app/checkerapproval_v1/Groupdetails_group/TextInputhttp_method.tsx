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

const TextInputhttp_method = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1|0ffd283841c3428d98777604be56573c|properties.httpmethod"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1|2eff021532cd4b80834bce1263346bbe|fa37ce1f9fb645c9b6af97f5f91a99b9"
    }
  ],
  "schemaData": {
    "type": "string"
  }
}
  const {dfd_cdc_checker_action_dfd_v1Props, setdfd_cdc_checker_action_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'httpmethod',type:"text"})
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
  const {cdc_group2e1e4, setcdc_group2e1e4}= useContext(TotalContext) as TotalContextProps;
  const {cdc_group2e1e4Props, setcdc_group2e1e4Props}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbe, setdetails_group46bbe}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbeProps, setdetails_group46bbeProps}= useContext(TotalContext) as TotalContextProps;
  const {checker_detail4e9af, setchecker_detail4e9af}= useContext(TotalContext) as TotalContextProps;
  const {api_endpointa0340, setapi_endpointa0340}= useContext(TotalContext) as TotalContextProps;
  const {setup_code4eedf, setsetup_code4eedf}= useContext(TotalContext) as TotalContextProps;
  const {api_namebdd52, setapi_namebdd52}= useContext(TotalContext) as TotalContextProps;
  const {approve_id82664, setapprove_id82664}= useContext(TotalContext) as TotalContextProps;
  const {product_key121a1, setproduct_key121a1}= useContext(TotalContext) as TotalContextProps;
  const {http_methoda99b9, sethttp_methoda99b9}= useContext(TotalContext) as TotalContextProps;
  const {approve20de7, setapprove20de7}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951, settable_group05951}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951Props, settable_group05951Props}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54d, setcdc_table8e54d}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54dProps, setcdc_table8e54dProps}= useContext(TotalContext) as TotalContextProps;
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
      codeStates['cdc_group']  = {...cdc_group2e1e4,httpmethod:newInputValue},
      codeStates['setcdc_group'] = setcdc_group2e1e4,
      codeStates['details_group']  = {...details_group46bbe,httpmethod:newInputValue},
      codeStates['setdetails_group'] = setdetails_group46bbe,
      codeStates['table_group']  = {...table_group05951,httpmethod:newInputValue},
      codeStates['settable_group'] = settable_group05951,
      codeStates['cdc_table']  = {...cdc_table8e54d,httpmethod:newInputValue},
      codeStates['setcdc_table'] = setcdc_table8e54d,
    codeExecution(code,codeStates)
    }  
    setError('')
    setValidate((pre:any)=>({...pre,httpmethod:undefined}))
    if(dynamicStateandType.type=="number"){
    setdetails_group46bbe((prev: any) => ({ ...prev, httpmethod: +e.target.value }))
    }
    else{
    setdetails_group46bbe((prev: any) => ({ ...prev, httpmethod: e.target.value }))
    }
  }
  const handleBlur=async () => {
    
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1",
          componentId: "2eff021532cd4b80834bce1263346bbe",
          controlId: "fa37ce1f9fb645c9b6af97f5f91a99b9",
          isTable: false,
          from:"TextInputhttp_method",
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
        let type:any={name:'httpmethod',type:'text'}
        type={
          name:'httpmethod',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.httpmethod.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.httpmethod.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.httpmethod.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'httpmethod',type:'text'}
        type={
          name:'httpmethod',
          type: orchestrationData?.data?.schemaData[0].schema.properties.httpmethod.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.httpmethod.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.httpmethod.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setdetails_group46bbe((pre:any)=>({...pre,httpmethod:orchestrationData?.data?.dstData}))
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
  if(dfd_cdc_checker_action_dfd_v1Props?.setSearchFilters && dfd_cdc_checker_action_dfd_v1Props?.data)
  {
    if(Array.isArray(dfd_cdc_checker_action_dfd_v1Props.data) && dfd_cdc_checker_action_dfd_v1Props.data.length > 0){
      setdetails_group46bbe((pre:any)=>({...pre,httpmethod:dfd_cdc_checker_action_dfd_v1Props.data[0]?.httpmethod}));
    }
  }
  },[dfd_cdc_checker_action_dfd_v1Props?.setSearchFilters])
  if (http_methoda99b9?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `9 / 17`,gridRow: `45 / 67`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={details_group46bbe?.httpmethod||""}
         disabled= {http_methoda99b9?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="HTTP Method"
        validationState={validate?.httpmethod ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputhttp_method
