
'use client'
import React, { useState,useContext,useEffect,useRef } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { AxiosService } from "@/app/components/axiosService";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/app/components/cookieMgment';
import { getDropdownDetails } from '@/app/utils/getMapperDetails';
import { codeExecution } from '@/app/utils/codeExecution';
import { eventBus } from '@/app/eventBus';
import { Dropdown } from '@/components/Dropdown';
import { Text } from '@/components/Text';
import {Modal} from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import * as v from 'valibot'


const Dropdownaccounttype = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { validate, setValidate } = useContext(
    TotalContext
  ) as TotalContextProps
  const keyset:any=i18n.keyset("language");
  const [initialCount,setInitialCount]=useState(0)
  let getMapperDetails:any;
  const toast=useInfoMsg();
  const routes = useRouter();
  const [isRequredData,setIsRequredData]=useState(false)
  const [error, setError] = useState<string>('')
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef(false);
  let customecode:any="";
  const [allCode,setAllCode]=useState<any>("");
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
  const handleStaticValue=(data:any)=>{
    setSelectedItem(data)
  }
  const [selectedItem, setSelectedItem] = React.useState<string[]>([]); 
  const items = [
   'SME',
   'Retail',
   'Corporate',
  ];
   // const options = items.map(item => ({
  //  value: item.key,
  //  content: item.text
//}));           

  useEffect(() => {
  if(get_accounts1a859?.accounttype=="" || get_accounts1a859?.accounttype==undefined || get_accounts1a859?.accounttype==null ){
    setSelectedItem([]);
  }
  },[get_accounts1a859?.accounttype])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1",
          componentId: "e63637758360439db9014a076931a859",
          controlId: "1fe24d20524c48feb76a8cf2bb2fc49d",
          isTable: false,
          accessProfile:accessProfile,
          from:"dropdownaccounttype"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.code)
      {
        setAllCode(orchestrationData?.data?.code)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[accounttypefc49d?.refresh])

  const selected=useRef({})
  const handleClick=async(value?:any)=>{
    if (value.length > 0) {
      let temp:any=[]
      if(Array.isArray(value)){
        for( let val of value){
          if(Array.isArray(val)){
            temp.push(val)
          }else{
            temp.push(val)
          }        
        }
      }
      setget_accounts1a859((prev: any) => ({ ...prev, accounttype: [value]}))
      setIsRequredData(false)
    } else {
      setget_accounts1a859((prev: any) => ({ ...prev, accounttype: ''}))
      setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,accounttype:undefined}))
    selected.current=value
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}
      
        codeStates['ais_group'] = ais_groupbe189,
        codeStates['setais_group'] = setais_groupbe189,
        codeStates['selected']  = selected,
        codeStates['ais_groupbe189'] = ais_groupbe189Props,
        codeStates['setais_groupbe189'] = setais_groupbe189Props,
        codeStates['selected']  = selected,
        codeStates['get_accounts'] = get_accounts1a859,
        codeStates['setget_accounts'] = setget_accounts1a859,
        codeStates['selected']  = selected,
        codeStates['get_accounts1a859'] = get_accounts1a859Props,
        codeStates['setget_accounts1a859'] = setget_accounts1a859Props,
        codeStates['selected']  = selected,
        codeStates['type'] = type16590,
        codeStates['settype'] = settype16590,
        codeStates['selected']  = selected,
        codeStates['baseconsentid'] = baseconsentid56ba8,
        codeStates['setbaseconsentid'] = setbaseconsentid56ba8,
        codeStates['selected']  = selected,
        codeStates['expirationdatetime'] = expirationdatetime2cbfb,
        codeStates['setexpirationdatetime'] = setexpirationdatetime2cbfb,
        codeStates['selected']  = selected,
        codeStates['transactionfromdatetime'] = transactionfromdatetimeaa64f,
        codeStates['settransactionfromdatetime'] = settransactionfromdatetimeaa64f,
        codeStates['selected']  = selected,
        codeStates['transactiontodatetime'] = transactiontodatetime00c33,
        codeStates['settransactiontodatetime'] = settransactiontodatetime00c33,
        codeStates['selected']  = selected,
        codeStates['accountid'] = accountidb7d92,
        codeStates['setaccountid'] = setaccountidb7d92,
        codeStates['selected']  = selected,
        codeStates['accounttype'] = accounttypefc49d,
        codeStates['setaccounttype'] = setaccounttypefc49d,
        codeStates['selected']  = selected,
        codeStates['accountsubtype'] = accountsubtypeb9399,
        codeStates['setaccountsubtype'] = setaccountsubtypeb9399,
        codeStates['selected']  = selected,
        codeStates['tradingname'] = tradingname22dd3,
        codeStates['settradingname'] = settradingname22dd3,
        codeStates['selected']  = selected,
        codeStates['legalname'] = legalnamebccff,
        codeStates['setlegalname'] = setlegalnamebccff,
        codeStates['selected']  = selected,
        codeStates['identifiertype'] = identifiertype37db2,
        codeStates['setidentifiertype'] = setidentifiertype37db2,
        codeStates['selected']  = selected,
        codeStates['identifier'] = identifiera6abf,
        codeStates['setidentifier'] = setidentifiera6abf,
        codeStates['selected']  = selected,
        codeStates['consentid'] = consentida3e0f,
        codeStates['setconsentid'] = setconsentida3e0f,
        codeStates['selected']  = selected,
        codeStates['apiname'] = apiname543a3,
        codeStates['setapiname'] = setapiname543a3,
        codeStates['selected']  = selected,
        codeStates['permissions'] = permissionsf74a7,
        codeStates['setpermissions'] = setpermissionsf74a7,
        codeStates['selected']  = selected,
        codeStates['usertype'] = usertype218a1,
        codeStates['setusertype'] = setusertype218a1,
        codeStates['selected']  = selected,
        codeStates['purpose'] = purpose3c50a,
        codeStates['setpurpose'] = setpurpose3c50a,
        codeStates['selected']  = selected,
        codeStates['url'] = urle0b3a,
        codeStates['seturl'] = seturle0b3a,
        codeStates['selected']  = selected,
        codeStates['call_get_accounts'] = call_get_accounts51bce,
        codeStates['setcall_get_accounts'] = setcall_get_accounts51bce,
        codeStates['selected']  = selected,
    codeExecution(customecode,codeStates)
    }
  }
   
  const { validateRefetch, setValidateRefetch } = useContext(
    TotalContext
  ) as TotalContextProps
  let schemaArray = [] ;
  const handleBlur = async () => {
  }

    useEffect(()=>{
        handleBlur()
    },[validateRefetch.value])
  ///////////////

  useEffect(() => {
    if(initialCount!=0)
     setget_accounts1a859((pre:any)=>({...pre,accounttype:""}))
    else
      setInitialCount(1)
  },[accounttypefc49d?.refresh])

  if (accounttypefc49d?.isHidden) {
    return <></>
  }

  return (
    <div 
className="flex flex-col  "      style={{gridColumn: `1 / 7`,gridRow: `64 / 84`, gap:``, height: `100%`, overflow: 'auto'}} >
      <div>
        <Text className="pb-2">Account Type</Text>
      </div>
      <Dropdown
        className=""
        placeholder={keyset("accounttype")} 
        filterable={true}
        hasClear={true}
        static={true}
        staticProps={items}
        disabled= {accounttypefc49d?.isDisabled ? true : false}
        width = "250"
        value={get_accounts1a859?.accounttype ?get_accounts1a859?.accounttype : []}
        onChange={handleClick} 
        validationState={validate?.accounttype ? "invalid" : undefined}
        errorMessage={error}
      /> 
      {validate?.accounttype && (
        <Text variant="caption-1" color="danger" className="mt-1">
          {error || 'This field is required'}
        </Text>
      )}
    </div>
  );
};

export default Dropdownaccounttype;
