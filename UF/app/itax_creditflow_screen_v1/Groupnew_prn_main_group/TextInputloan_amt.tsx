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
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import * as v from 'valibot';
///////////////
////////////

const TextInputloan_amt = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1|e94f0b0bfd204105bf68851e77eecc7b|properties.loan_amt"
      ],
      "targetKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1|f1099583e1124434b28d0c4b0be21910|d7b15cf967124ff78270b830b4e3440e"
    }
  ],
  "schemaData": {
    "type": "number"
  },
  "dataType": "number"
}
  const decodedTokenObj:any = decodeToken(token);
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const toast : Function = useInfoMsg()
  const keyset : Function = i18n.keyset("language");
  const [allCode,setAllCode]=useState<string>("");
  let schemaArray :string[] =[];
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'loan_amt',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {new_prn_main_group21910, setnew_prn_main_group21910}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910Props, setnew_prn_main_group21910Props}= useContext(TotalContext) as TotalContextProps;
  const {transaction_details_label6f776, settransaction_details_label6f776}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id19a2c, setitaxst_id19a2c}= useContext(TotalContext) as TotalContextProps;
  const {prnno_label2284a, setprnno_label2284a}= useContext(TotalContext) as TotalContextProps;
  const {eslip_noe1f20, seteslip_noe1f20}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labela8526, setpayment_type_labela8526}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdown5d344, setpayment_type_dropdown5d344}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label99095, setdebit_account_no_label99095}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no9ec5d, setdebit_account_no9ec5d}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_full_name_labeld7111, settax_payers_full_name_labeld7111}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name8bf4d, settax_payer_full_name8bf4d}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_label46f0a, setdebit_amount_label46f0a}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountbbf1f, setdebit_amountbbf1f}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt_labeleacfe, setloan_amt_labeleacfe}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt3440e, setloan_amt3440e}= useContext(TotalContext) as TotalContextProps;
  const {auth_memo_labelf0a0e, setauth_memo_labelf0a0e}= useContext(TotalContext) as TotalContextProps;
  const {filename4f410, setfilename4f410}= useContext(TotalContext) as TotalContextProps;
  const {memo_documentuploader51a64, setmemo_documentuploader51a64}= useContext(TotalContext) as TotalContextProps;
  const {clear14cbd, setclear14cbd}= useContext(TotalContext) as TotalContextProps;
  const {submitc9c9c, setsubmitc9c9c}= useContext(TotalContext) as TotalContextProps;
  

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
      setValidate((pre:any)=>({...pre,ITAX_CreditFlow_Screen_v1:{...pre?.ITAX_CreditFlow_Screen_v1,loan_amt:undefined}}));
    if(dynamicStateandType.type=="number"){
    setnew_prn_main_group21910((prev: any) => ({ ...prev, loan_amt: +e.target.value }));
    }
    else{
    setnew_prn_main_group21910((prev: any) => ({ ...prev, loan_amt: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['new_prn_main_group']  = {...new_prn_main_group21910,loan_amt:newInputValue},
      codeStates['setnew_prn_main_group'] = setnew_prn_main_group21910,
    codeExecution(code,codeStates);
    }  
     try{
        let copyFormhandlerData :any = {}

    }catch(err:any){
      console.error(err);
    }
  }
  const handleBlur=async () => {
      let validate:any
     try{
        let copyFormhandlerData :any = {}

    }catch(err:any){
      console.error(err);
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1",
          componentId: "f1099583e1124434b28d0c4b0be21910",
          controlId: "d7b15cf967124ff78270b830b4e3440e",
          isTable: false,
          from:"TextInputloan_amt",
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
      setAllCode(orchestrationData?.data?.code);
      if (orchestrationData?.data?.dataType ==='integer' || orchestrationData?.data?.dataType ==='number') {
        setDynamicStateandType({name:'loan_amt', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'loan_amt',type:'text'};
      //   type={
      //     name:'loan_amt',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.loan_amt.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.loan_amt.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.loan_amt.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'loan_amt',type:'text'};
      //   type={
      //     name:'loan_amt',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.loan_amt.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.loan_amt.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.loan_amt.type
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
  if(dfd_itax_source_tran_dfd_v1Props?.setSearchFilters && dfd_itax_source_tran_dfd_v1Props?.data)
  {
    if(Array.isArray(dfd_itax_source_tran_dfd_v1Props.data) && dfd_itax_source_tran_dfd_v1Props.data.length > 0){
      setnew_prn_main_group21910((pre:any)=>({...pre,loan_amt:dfd_itax_source_tran_dfd_v1Props.data[0]?.loan_amt}));
    }
  }
  },[dfd_itax_source_tran_dfd_v1Props?.setSearchFilters])
  if (loan_amt3440e?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `13 / 25`,gridRow: `67 / 77`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={new_prn_main_group21910?.loan_amt||""}
        numberFormat={dynamicStateandType.type === "number" ? "" : "none"}
         disabled= {loan_amt3440e?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly={true}
        view='normal'
        contentAlign={"left"}
      errorMessage={error}
        validationState={validate?.ITAX_CreditFlow_Screen_v1?.loan_amt ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputloan_amt
