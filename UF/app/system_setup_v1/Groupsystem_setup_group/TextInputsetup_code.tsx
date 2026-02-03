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

const TextInputsetup_code = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1|ea8268fea07e4f9e991a1536c35c8463|properties.setup_code"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1|723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6"
    }
  ],
  "schemaData": {
    "type": "string"
  }
}
  const {dfd_master_system_setup_dfd_v1Props, setdfd_master_system_setup_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'setup_code',type:"text"})
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
  const {system_setup_group2af15, setsystem_setup_group2af15}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_group2af15Props, setsystem_setup_group2af15Props}= useContext(TotalContext) as TotalContextProps;
  const {product_code523b7, setproduct_code523b7}= useContext(TotalContext) as TotalContextProps;
  const {setup_code88cd6, setsetup_code88cd6}= useContext(TotalContext) as TotalContextProps;
  const {interface_productd9133, setinterface_productd9133}= useContext(TotalContext) as TotalContextProps;
  const {category80c2f, setcategory80c2f}= useContext(TotalContext) as TotalContextProps;
  const {sub_categoryd81c5, setsub_categoryd81c5}= useContext(TotalContext) as TotalContextProps;
  const {purpose3b7f4, setpurpose3b7f4}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_dynamic_formf3526, setsystem_setup_dynamic_formf3526}= useContext(TotalContext) as TotalContextProps;
  const {cancelad32e, setcancelad32e}= useContext(TotalContext) as TotalContextProps;
  const {save3a1b8, setsave3a1b8}= useContext(TotalContext) as TotalContextProps;
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
      codeStates['system_setup_group']  = {...system_setup_group2af15,setup_code:newInputValue},
      codeStates['setsystem_setup_group'] = setsystem_setup_group2af15,
    codeExecution(code,codeStates)
    }  
    setError('')
    setValidate((pre:any)=>({...pre,setup_code:undefined}))
    if(dynamicStateandType.type=="number"){
    setsystem_setup_group2af15((prev: any) => ({ ...prev, setup_code: +e.target.value }))
    }
    else{
    setsystem_setup_group2af15((prev: any) => ({ ...prev, setup_code: e.target.value }))
    }
  }
  const handleBlur=async () => {
    
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1",
          componentId: "723ad64155fe45adba8c526f1ce2af15",
          controlId: "43e7bdcd7900488b8a0584481a488cd6",
          isTable: false,
          from:"TextInputsetup_code",
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
        let type:any={name:'setup_code',type:'text'}
        type={
          name:'setup_code',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_code.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_code.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_code.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'setup_code',type:'text'}
        type={
          name:'setup_code',
          type: orchestrationData?.data?.schemaData[0].schema.properties.setup_code.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.setup_code.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.setup_code.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setsystem_setup_group2af15((pre:any)=>({...pre,setup_code:orchestrationData?.data?.dstData}))
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
  if(dfd_master_system_setup_dfd_v1Props?.setSearchFilters && dfd_master_system_setup_dfd_v1Props?.data)
  {
    if(Array.isArray(dfd_master_system_setup_dfd_v1Props.data) && dfd_master_system_setup_dfd_v1Props.data.length > 0){
      setsystem_setup_group2af15((pre:any)=>({...pre,setup_code:dfd_master_system_setup_dfd_v1Props.data[0]?.setup_code}));
    }
  }
  },[dfd_master_system_setup_dfd_v1Props?.setSearchFilters])
  if (setup_code88cd6?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `9 / 17`,gridRow: `6 / 25`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={system_setup_group2af15?.setup_code||""}
         disabled= {setup_code88cd6?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="Setup Code"
        validationState={validate?.setup_code ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputsetup_code
