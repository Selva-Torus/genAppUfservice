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

const TextInputprn_amount = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1|e94f0b0bfd204105bf68851e77eecc7b|properties.total_amount"
      ],
      "targetKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Details:AFVK:v1|cf8c6e9383ea49e7be4639ad0e373f21|31dbaf7533d84cfdb7ededdfe8cd22c3"
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
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'total_amount',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {view_detail_back_group50bce, setview_detail_back_group50bce}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_back_group50bceProps, setview_detail_back_group50bceProps}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21, setview_detail_group73f21}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21Props, setview_detail_group73f21Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_label348d7, setprn_label348d7}= useContext(TotalContext) as TotalContextProps;
  const {eslip_no1e386, seteslip_no1e386}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id1d5bd, setitaxst_id1d5bd}= useContext(TotalContext) as TotalContextProps;
  const {eslip_details567e2, seteslip_details567e2}= useContext(TotalContext) as TotalContextProps;
  const {prn_status_labele7b20, setprn_status_labele7b20}= useContext(TotalContext) as TotalContextProps;
  const {pin_label660ea, setpin_label660ea}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name_label86492, settax_payers_name_label86492}= useContext(TotalContext) as TotalContextProps;
  const {prn_status83532, setprn_status83532}= useContext(TotalContext) as TotalContextProps;
  const {pin7c9eb, setpin7c9eb}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name38781, settax_payers_name38781}= useContext(TotalContext) as TotalContextProps;
  const {prn_amount_labela6563, setprn_amount_labela6563}= useContext(TotalContext) as TotalContextProps;
  const {currency_label786a3, setcurrency_label786a3}= useContext(TotalContext) as TotalContextProps;
  const {prn_reg_date_labelf0c46, setprn_reg_date_labelf0c46}= useContext(TotalContext) as TotalContextProps;
  const {prn_amountd22c3, setprn_amountd22c3}= useContext(TotalContext) as TotalContextProps;
  const {currency1ef9b, setcurrency1ef9b}= useContext(TotalContext) as TotalContextProps;
  const {prn_registration_date67d15, setprn_registration_date67d15}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106, setprn_no_datails_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  

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
      setValidate((pre:any)=>({...pre,ITAX_View_Details_v1:{...pre?.ITAX_View_Details_v1,total_amount:undefined}}));
    if(dynamicStateandType.type=="number"){
    setview_detail_group73f21((prev: any) => ({ ...prev, total_amount: +e.target.value }));
    }
    else{
    setview_detail_group73f21((prev: any) => ({ ...prev, total_amount: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['view_detail_back_group']  = {...view_detail_back_group50bce,total_amount:newInputValue},
      codeStates['setview_detail_back_group'] = setview_detail_back_group50bce,
      codeStates['view_detail_group']  = {...view_detail_group73f21,total_amount:newInputValue},
      codeStates['setview_detail_group'] = setview_detail_group73f21,
      codeStates['prn_no_datails_table']  = {...prn_no_datails_tablefc106,total_amount:newInputValue},
      codeStates['setprn_no_datails_table'] = setprn_no_datails_tablefc106,
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
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Details:AFVK:v1",
          componentId: "cf8c6e9383ea49e7be4639ad0e373f21",
          controlId: "31dbaf7533d84cfdb7ededdfe8cd22c3",
          isTable: false,
          from:"TextInputprn_amount",
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
        setDynamicStateandType({name:'total_amount', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'total_amount',type:'text'};
      //   type={
      //     name:'total_amount',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.total_amount.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.total_amount.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.total_amount.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'total_amount',type:'text'};
      //   type={
      //     name:'total_amount',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.total_amount.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.total_amount.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.total_amount.type
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
      setview_detail_group73f21((pre:any)=>({...pre,total_amount:dfd_itax_source_tran_dfd_v1Props.data[0]?.total_amount}));
    }
  }
  },[dfd_itax_source_tran_dfd_v1Props?.setSearchFilters])
  if (prn_amountd22c3?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `1 / 9`,gridRow: `57 / 67`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={view_detail_group73f21?.total_amount||""}
        numberFormat={dynamicStateandType.type === "number" ? "" : "none"}
         disabled= {prn_amountd22c3?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
      errorMessage={error}
        validationState={validate?.ITAX_View_Details_v1?.total_amount ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputprn_amount
