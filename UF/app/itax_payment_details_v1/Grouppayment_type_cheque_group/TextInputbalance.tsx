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

const TextInputbalance = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1|e94f0b0bfd204105bf68851e77eecc7b|properties.balance"
      ],
      "targetKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|6b1dff68ee4848a7a60e2092f2b239dd|83d1f48179894d409cf23535cd7dcbd7"
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
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'balance',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414Props, setsubscreen_groupc0414Props}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label86b10, setdebit_account_no_label86b10}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_noa9796, setdebit_account_noa9796}= useContext(TotalContext) as TotalContextProps;
  const {available_bal_label22d5b, setavailable_bal_label22d5b}= useContext(TotalContext) as TotalContextProps;
  const {balancedcbd7, setbalancedcbd7}= useContext(TotalContext) as TotalContextProps;
  const {tax_amount_label2b9ee, settax_amount_label2b9ee}= useContext(TotalContext) as TotalContextProps;
  const {total_amount46433, settotal_amount46433}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_labelf6595, setdebit_amount_labelf6595}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountf2e0e, setdebit_amountf2e0e}= useContext(TotalContext) as TotalContextProps;
  const {cheque_no_labeldb9c8, setcheque_no_labeldb9c8}= useContext(TotalContext) as TotalContextProps;
  const {cheque_nocda2a, setcheque_nocda2a}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props}= useContext(TotalContext) as TotalContextProps;
  

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
      setValidate((pre:any)=>({...pre,ITAX_Payment_Details_v1:{...pre?.ITAX_Payment_Details_v1,balance:undefined}}));
    if(dynamicStateandType.type=="number"){
    setpayment_type_cheque_group239dd((prev: any) => ({ ...prev, balance: +e.target.value }));
    }
    else{
    setpayment_type_cheque_group239dd((prev: any) => ({ ...prev, balance: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['prn_details_group']  = {...prn_details_group00560,balance:newInputValue},
      codeStates['setprn_details_group'] = setprn_details_group00560,
      codeStates['prn_datails_table']  = {...prn_datails_table2ad52,balance:newInputValue},
      codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
      codeStates['subscreen_group']  = {...subscreen_groupc0414,balance:newInputValue},
      codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1']  = {...ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,balance:newInputValue},
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['payment_type_cheque_group']  = {...payment_type_cheque_group239dd,balance:newInputValue},
      codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1']  = {...ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,balance:newInputValue},
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['payment_type_dt_group']  = {...payment_type_dt_groupedf52,balance:newInputValue},
      codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,
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
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",
          componentId: "6b1dff68ee4848a7a60e2092f2b239dd",
          controlId: "83d1f48179894d409cf23535cd7dcbd7",
          isTable: false,
          from:"TextInputbalance",
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
        setDynamicStateandType({name:'balance', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'balance',type:'text'};
      //   type={
      //     name:'balance',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.balance.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.balance.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.balance.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'balance',type:'text'};
      //   type={
      //     name:'balance',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.balance.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.balance.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.balance.type
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
      setpayment_type_cheque_group239dd((pre:any)=>({...pre,balance:dfd_itax_source_tran_dfd_v1Props.data[0]?.balance}));
    }
  }
  },[dfd_itax_source_tran_dfd_v1Props?.setSearchFilters])
  if (balancedcbd7?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `13 / 25`,gridRow: `13 / 23`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={payment_type_cheque_group239dd?.balance||""}
        numberFormat={dynamicStateandType.type === "number" ? "" : "none"}
         disabled= {balancedcbd7?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly={true}
        view='normal'
        contentAlign={"left"}
      errorMessage={error}
        validationState={validate?.ITAX_Payment_Details_v1?.balance ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputbalance
