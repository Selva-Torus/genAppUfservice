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
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import * as v from 'valibot';

const TextInputdebtor_account = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1|5bc8f410f27248d88fc91b7fe01fb9c0|properties.dr_account"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1|4e3a333fdb93472c97f4c7ca2461c8a5|1c4c876173994040b40432ed30b0655c"
    }
  ],
  "schemaData": {
    "type": "string"
  }
}
  const {dfd_get_transaction_dfd_v1Props, setdfd_get_transaction_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
  /////////////
   //another screen
  const {payment_group1c8a5, setpayment_group1c8a5}= useContext(TotalContext) as TotalContextProps;
  const {payment_group1c8a5Props, setpayment_group1c8a5Props}= useContext(TotalContext) as TotalContextProps;
  const {channel_named9a37, setchannel_named9a37}= useContext(TotalContext) as TotalContextProps;
  const {product_code9a692, setproduct_code9a692}= useContext(TotalContext) as TotalContextProps;
  const {directionbf471, setdirectionbf471}= useContext(TotalContext) as TotalContextProps;
  const {charge_type977c5, setcharge_type977c5}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account0655c, setdebtor_account0655c}= useContext(TotalContext) as TotalContextProps;
  const {creditor_accounts82148, setcreditor_accounts82148}= useContext(TotalContext) as TotalContextProps;
  const {amountc2ae9, setamountc2ae9}= useContext(TotalContext) as TotalContextProps;
  const {currency124c5, setcurrency124c5}= useContext(TotalContext) as TotalContextProps;
  const {uuide86ae, setuuide86ae}= useContext(TotalContext) as TotalContextProps;
  const {process_type45fad, setprocess_type45fad}= useContext(TotalContext) as TotalContextProps;
  const {tran_category81c97, settran_category81c97}= useContext(TotalContext) as TotalContextProps;
  const {settlement_datea6baf, setsettlement_datea6baf}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info57b4b, setremittance_info57b4b}= useContext(TotalContext) as TotalContextProps;
  const {product_code_json46315, setproduct_code_json46315}= useContext(TotalContext) as TotalContextProps;
  const {saveb6b99, setsaveb6b99}= useContext(TotalContext) as TotalContextProps;
  const {clearf69d6, setclearf69d6}= useContext(TotalContext) as TotalContextProps;
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
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['payment_group']  = {...payment_group1c8a5,dr_account:newInputValue},
      codeStates['setpayment_group'] = setpayment_group1c8a5,
    codeExecution(code,codeStates);
    }  
    setError('');
    setValidate((pre:any)=>({...pre,dr_account:undefined}));
    if(dynamicStateandType.type=="number"){
    setpayment_group1c8a5((prev: any) => ({ ...prev, dr_account: +e.target.value }));
    }
    else{
    setpayment_group1c8a5((prev: any) => ({ ...prev, dr_account: e.target.value }));
    }
  }
  const handleBlur=async () => {
    
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",
          componentId: "4e3a333fdb93472c97f4c7ca2461c8a5",
          controlId: "1c4c876173994040b40432ed30b0655c",
          isTable: false,
          from:"TextInputdebtor_account",
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
      if(orchestrationData?.data?.schemaData[0].nodeType=='apinode'){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'dr_account',type:'text'};
        type={
          name:'dr_account',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type
        }
        setDynamicStateandType(type);
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'dr_account',type:'text'};
        type={
          name:'dr_account',
          type: orchestrationData?.data?.schemaData[0].schema.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.dr_account.type
        }
        setDynamicStateandType(type);
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setpayment_group1c8a5((pre:any)=>({...pre,dr_account:orchestrationData?.data?.dstData}))
      }
    }
    catch(err)
    {
      console.log(err);
    }
  }

  useEffect(()=>{
      handleMapperValue();
      handleBlur();
  },[validateRefetch.value])
  useEffect(() => {
  if(dfd_get_transaction_dfd_v1Props?.setSearchFilters && dfd_get_transaction_dfd_v1Props?.data)
  {
    if(Array.isArray(dfd_get_transaction_dfd_v1Props.data) && dfd_get_transaction_dfd_v1Props.data.length > 0){
      setpayment_group1c8a5((pre:any)=>({...pre,dr_account:dfd_get_transaction_dfd_v1Props.data[0]?.dr_account}));
    }
  }
  },[dfd_get_transaction_dfd_v1Props?.setSearchFilters])
  if (debtor_account0655c?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `1 / 7`,gridRow: `21 / 40`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={payment_group1c8a5?.dr_account||""}
         disabled= {debtor_account0655c?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="Debtor Account"
        validationState={validate?.dr_account ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputdebtor_account
