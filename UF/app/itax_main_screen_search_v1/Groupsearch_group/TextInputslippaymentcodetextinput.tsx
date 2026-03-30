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

const TextInputslippaymentcodetextinput = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1|e94f0b0bfd204105bf68851e77eecc7b|properties.slip_payment_code"
      ],
      "targetKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Main_Screen_Search:AFVK:v1|67a3af3c7cf8400e86a421b514e9a617|1ff6f8469a844ac389af2eae831f76e3"
    }
  ],
  "schemaData": {
    "type": "string"
  },
  "dataType": "string"
}
  const decodedTokenObj:any = decodeToken(token);
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const toast : Function = useInfoMsg()
  const keyset : Function = i18n.keyset("language");
  const [allCode,setAllCode]=useState<string>("");
  let schemaArray :string[] =[];
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'slip_payment_code',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {search_group9a617, setsearch_group9a617}= useContext(TotalContext) as TotalContextProps;
  const {search_group9a617Props, setsearch_group9a617Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_textinput88273, setprn_textinput88273}= useContext(TotalContext) as TotalContextProps;
  const {slippaymentcodetextinputf76e3, setslippaymentcodetextinputf76e3}= useContext(TotalContext) as TotalContextProps;
  const {taxpayerfullnametextinput0ac43, settaxpayerfullnametextinput0ac43}= useContext(TotalContext) as TotalContextProps;
  const {clear43278, setclear43278}= useContext(TotalContext) as TotalContextProps;
  const {search6f0c3, setsearch6f0c3}= useContext(TotalContext) as TotalContextProps;
  

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
      setValidate((pre:any)=>({...pre,ITAX_Main_Screen_Search_v1:{...pre?.ITAX_Main_Screen_Search_v1,slip_payment_code:undefined}}));
    if(dynamicStateandType.type=="number"){
    setsearch_group9a617((prev: any) => ({ ...prev, slip_payment_code: +e.target.value }));
    }
    else{
    setsearch_group9a617((prev: any) => ({ ...prev, slip_payment_code: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['search_group']  = {...search_group9a617,slip_payment_code:newInputValue},
      codeStates['setsearch_group'] = setsearch_group9a617,
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
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Main_Screen_Search:AFVK:v1",
          componentId: "67a3af3c7cf8400e86a421b514e9a617",
          controlId: "1ff6f8469a844ac389af2eae831f76e3",
          isTable: false,
          from:"TextInputslippaymentcodetextinput",
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
        setDynamicStateandType({name:'slip_payment_code', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'slip_payment_code',type:'text'};
      //   type={
      //     name:'slip_payment_code',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.slip_payment_code.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.slip_payment_code.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.slip_payment_code.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'slip_payment_code',type:'text'};
      //   type={
      //     name:'slip_payment_code',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.slip_payment_code.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.slip_payment_code.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.slip_payment_code.type
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
      setsearch_group9a617((pre:any)=>({...pre,slip_payment_code:dfd_itax_source_tran_dfd_v1Props.data[0]?.slip_payment_code}));
    }
  }
  },[dfd_itax_source_tran_dfd_v1Props?.setSearchFilters])
  if (slippaymentcodetextinputf76e3?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `10 / 16`,gridRow: `5 / 26`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={search_group9a617?.slip_payment_code||""}
        numberFormat={dynamicStateandType.type === "number" ? "" : "none"}
         disabled= {slippaymentcodetextinputf76e3?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="Slip Payment Code"
      errorMessage={error}
        validationState={validate?.ITAX_Main_Screen_Search_v1?.slip_payment_code ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputslippaymentcodetextinput
