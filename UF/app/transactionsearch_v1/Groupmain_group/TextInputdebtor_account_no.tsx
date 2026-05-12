'use client'




import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import i18n from '@/app/components/i18n';
import decodeToken from '@/app/components/decodeToken';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import UOmapperData from '@/context/dfdmapperContolnames.json'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import * as v from 'valibot';
///////////////
////////////

const TextInputdebtor_account_no = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const actionDetails : any = {
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
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1|c2a320f6a30140a487ed20c46f1763dd|properties.dr_account"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transactionSearch:AFVK:v1|526f0e58d5454270aca67c481a99066f|f2138b56e9f04f25b97ae414d73963e4"
    }
  ],
  "dfdKey": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1:",
  "schemaData": {
    "type": "string",
    "maxLength": 32,
    "nullable": true,
    "x-pg-type": "character varying",
    "x-expression": "dr_account"
  },
  "dataType": "string"
}
  const decodedTokenObj:any = decodeToken(token);
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const toast : Function = useInfoMsg()
  const keyset : Function = i18n.keyset("language");
  const [allCode,setAllCode]=useState<string>("");
  let schemaArray :string[] =[];
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'dr_account',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {main_group9066f, setmain_group9066f}= useContext(TotalContext) as TotalContextProps;
  const {main_group9066fProps, setmain_group9066fProps}= useContext(TotalContext) as TotalContextProps;
  const {search_label27572, setsearch_label27572}= useContext(TotalContext) as TotalContextProps;
  const {trs_created_date2cea8, settrs_created_date2cea8}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account_no963e4, setdebtor_account_no963e4}= useContext(TotalContext) as TotalContextProps;
  const {debtor_namee2d9f, setdebtor_namee2d9f}= useContext(TotalContext) as TotalContextProps;
  const {creditor_account_noca692, setcreditor_account_noca692}= useContext(TotalContext) as TotalContextProps;
  const {payment_currency703d2, setpayment_currency703d2}= useContext(TotalContext) as TotalContextProps;
  const {payment_amount042b1, setpayment_amount042b1}= useContext(TotalContext) as TotalContextProps;
  const {uuid29c9f, setuuid29c9f}= useContext(TotalContext) as TotalContextProps;
  const {status4bd75, setstatus4bd75}= useContext(TotalContext) as TotalContextProps;
  const {search0e695, setsearch0e695}= useContext(TotalContext) as TotalContextProps;
  const {cleareddfa, setcleareddfa}= useContext(TotalContext) as TotalContextProps;
  

  // Validation  
    const [error, setError] = useState<string>('');
  schemaArray = [] ;
    function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans : any[] = [];
    let id : string = "";
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }
  const handleChange = async(e: any) => {
      let validate:any;    
      setError('');
      setValidate((pre:any)=>({...pre,transactionSearch_v1:{...pre?.transactionSearch_v1,dr_account:undefined}}));
    if(dynamicStateandType.type=="number"){
    setmain_group9066f((prev: any) => ({ ...prev, dr_account: +e.target.value }));
    }
    else{
    setmain_group9066f((prev: any) => ({ ...prev, dr_account: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
        codeStates['main_group'] = main_group9066f,
        codeStates['setmain_group'] = setmain_group9066f,
        codeStates['main_group9066f'] = main_group9066fProps,
        codeStates['setmain_group9066f'] = setmain_group9066fProps,
        codeStates['search_label'] = search_label27572,
        codeStates['setsearch_label'] = setsearch_label27572,
        codeStates['trs_created_date'] = trs_created_date2cea8,
        codeStates['settrs_created_date'] = settrs_created_date2cea8,
        codeStates['debtor_account_no'] = debtor_account_no963e4,
        codeStates['setdebtor_account_no'] = setdebtor_account_no963e4,
        codeStates['debtor_name'] = debtor_namee2d9f,
        codeStates['setdebtor_name'] = setdebtor_namee2d9f,
        codeStates['creditor_account_no'] = creditor_account_noca692,
        codeStates['setcreditor_account_no'] = setcreditor_account_noca692,
        codeStates['payment_currency'] = payment_currency703d2,
        codeStates['setpayment_currency'] = setpayment_currency703d2,
        codeStates['payment_amount'] = payment_amount042b1,
        codeStates['setpayment_amount'] = setpayment_amount042b1,
        codeStates['uuid'] = uuid29c9f,
        codeStates['setuuid'] = setuuid29c9f,
        codeStates['status'] = status4bd75,
        codeStates['setstatus'] = setstatus4bd75,
        codeStates['search'] = search0e695,
        codeStates['setsearch'] = setsearch0e695,
        codeStates['clear'] = cleareddfa,
        codeStates['setclear'] = setcleareddfa,
    codeExecution(code,codeStates);
    }  
     try{
      setIsProcessing(true);
        let copyFormhandlerData :any = {}

    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
  const handleValidate=async (e?:any) => {
      let validate:any
  }
  
  const handleBlur=async (e?:any) => {
     try{
      setIsProcessing(true);
        let copyFormhandlerData :any = {}

    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData:any = getControlOrchestrationData(
        controlData,
        "526f0e58d5454270aca67c481a99066f",
        "f2138b56e9f04f25b97ae414d73963e4"
      );
      // const orchestrationData: any = await AxiosService.post(
      //   '/UF/Orchestration',
      //   {
      //     key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transactionSearch:AFVK:v1",
      //     componentId: "526f0e58d5454270aca67c481a99066f",
      //     controlId: "f2138b56e9f04f25b97ae414d73963e4",
      //     isTable: false,
      //     from:"TextInputdebtor_account_no",
      //     accessProfile:accessProfile
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // )
      // if(orchestrationData?.data?.error == true){
       
      //   return
      // }
      setAllCode(orchestrationData?.data?.code);
      if (orchestrationData?.data?.dataType ==='integer' || orchestrationData?.data?.dataType ==='number') {
        setDynamicStateandType({name:'dr_account', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'dr_account',type:'text'};
      //   type={
      //     name:'dr_account',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'dr_account',type:'text'};
      //   type={
      //     name:'dr_account',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }
    }
    catch(err)
    {
      console.log(err);
    }
  }

  useEffect(()=>{
      handleMapperValue();
  },[validateRefetch.value])
  useEffect(() => {
  if(dfd_transaction_v1Props?.setSearchFilters && dfd_transaction_v1Props?.data)
  {
    if(Array.isArray(dfd_transaction_v1Props.data) && dfd_transaction_v1Props.data.length > 0){
      setmain_group9066f((pre:any)=>({...pre,dr_account:dfd_transaction_v1Props.data[0]?.dr_account}));
    }
  }
  },[dfd_transaction_v1Props?.setSearchFilters])
  if (debtor_account_no963e4?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `7 / 13`,gridRow: `10 / 28`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        itsHaveCurrency={false}
        type={dynamicStateandType.type}
        value={main_group9066f?.dr_account||""}
         disabled= {debtor_account_no963e4?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="Debtor Account No"
      errorMessage={error}
        validationState={validate?.transactionSearch_v1?.dr_account ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputdebtor_account_no
