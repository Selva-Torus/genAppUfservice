'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import Dropdowntype  from "./Dropdowntype";
import TextInputBaseConsentId  from "./TextInputBaseConsentId";
import DatePickerExpirationDateTime  from "./DatePickerExpirationDateTime";
import DatePickerTransactionFromDateTime  from "./DatePickerTransactionFromDateTime";
import DatePickerTransactionToDateTime  from "./DatePickerTransactionToDateTime";
import TextInputAccountId  from "./TextInputAccountId";
import Dropdownaccounttype  from "./Dropdownaccounttype";
import Dropdownaccountsubtype  from "./Dropdownaccountsubtype";
import TextInputTradingName  from "./TextInputTradingName";
import TextInputLegalName  from "./TextInputLegalName";
import DropdownIdentifierType  from "./DropdownIdentifierType";
import TextInputIdentifier  from "./TextInputIdentifier";
import TextInputConsentId  from "./TextInputConsentId";
import Dropdownapiname  from "./Dropdownapiname";
import Dropdownpermissions  from "./Dropdownpermissions";
import DropdownUserType  from "./DropdownUserType";
import DropdownPurpose  from "./DropdownPurpose";
import TextInputUrl  from "./TextInputUrl";
import ButtonCall_Get_Accounts  from "./ButtonCall_Get_Accounts";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const GroupGet_Accounts = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  let code:any = `function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0;
    let v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
let currentDate = new Date().toISOString();
let generatedConsentId = generateUUID();
setget_accounts((prev) => ({
  ...prev,
  baseconsentid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  tradingname: "GreenTech Solutions",
  expirationdatetime: currentDate,
  transactionfromdatetime: currentDate,
  transactiontodatetime: currentDate,
  legalname: "GreenTech Solutions LLC",
  identifier: "BT-UAE-09234",
  consentid: generatedConsentId,
  url: "https://api.tpp.com/webhook/callbackUrl"
}));`;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_codedescription_v1Props, setdfd_codedescription_v1Props} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagComp: boolean = encryptionFlagPageData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData?.method;
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  };
  const securityData:any={
  "Template 1": {
    "allowedControls": [
      "type",
      "baseconsentid",
      "expirationdatetime",
      "transactionfromdatetime",
      "transactiontodatetime",
      "accountid",
      "accounttype",
      "accountsubtype",
      "tradingname",
      "legalname",
      "identifiertype",
      "identifier",
      "consentid",
      "apiname",
      "permissions",
      "usertype",
      "purpose",
      "url",
      "call_get_accounts"
    ],
    "allowedGroups": [
      "canvas",
      "get_accounts"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
};
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
 /////////////
   //another screen
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
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1",componentId:"e63637758360439db9014a076931a859",from:"GroupGetAccounts",accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
  code = orchestrationData?.data?.code;
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("type")){
      settype16590({...type16590,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("baseconsentid")){
      setbaseconsentid56ba8({...baseconsentid56ba8,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("expirationdatetime")){
      setexpirationdatetime2cbfb({...expirationdatetime2cbfb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transactionfromdatetime")){
      settransactionfromdatetimeaa64f({...transactionfromdatetimeaa64f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transactiontodatetime")){
      settransactiontodatetime00c33({...transactiontodatetime00c33,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("accountid")){
      setaccountidb7d92({...accountidb7d92,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("accounttype")){
      setaccounttypefc49d({...accounttypefc49d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("accountsubtype")){
      setaccountsubtypeb9399({...accountsubtypeb9399,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tradingname")){
      settradingname22dd3({...tradingname22dd3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("legalname")){
      setlegalnamebccff({...legalnamebccff,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("identifiertype")){
      setidentifiertype37db2({...identifiertype37db2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("identifier")){
      setidentifiera6abf({...identifiera6abf,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("consentid")){
      setconsentida3e0f({...consentida3e0f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("apiname")){
      setapiname543a3({...apiname543a3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("permissions")){
      setpermissionsf74a7({...permissionsf74a7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("usertype")){
      setusertype218a1({...usertype218a1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("purpose")){
      setpurpose3c50a({...purpose3c50a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("url")){
      seturle0b3a({...urle0b3a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("call_get_accounts")){
      setcall_get_accounts51bce({...call_get_accounts51bce,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['get_accounts']  = get_accounts1a859,
      codeStates['setget_accounts'] = setget_accounts1a859,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const get_accounts1a859Ref = useRef<any>(null);
  const handleClearSearch = () => {
    get_accounts1a859Ref.current?.setSearchParams();
    get_accounts1a859Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(get_accounts1a859) && Object.keys(get_accounts1a859)?.length>0)
      {
        setget_accounts1a859({})
      }
    }else 
      prevRefreshRef.current= true
  }, [get_accounts1a859Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '2 / 12',
        gridRow: '23 / 244',
        gridAutoRows: '4px',
        columnGap: '5px',
        //rowGap: '',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        backgroundColor:'#ffffff',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`p-4 rounded-md shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        {allowedControls.includes("type") ?<Dropdowntype   /* 16590 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("baseconsentid") ?<TextInputBaseConsentId   /* 56ba8 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("expirationdatetime") ?<DatePickerExpirationDateTime   /* 2cbfb */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("transactionfromdatetime") ?<DatePickerTransactionFromDateTime   /* aa64f */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("transactiontodatetime") ?<DatePickerTransactionToDateTime   /* 00c33 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("accountid") ?<TextInputAccountId   /* b7d92 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("accounttype") ?<Dropdownaccounttype   /* fc49d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("accountsubtype") ?<Dropdownaccountsubtype   /* b9399 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("tradingname") ?<TextInputTradingName   /* 22dd3 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("legalname") ?<TextInputLegalName   /* bccff */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("identifiertype") ?<DropdownIdentifierType   /* 37db2 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("identifier") ?<TextInputIdentifier   /* a6abf */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("consentid") ?<TextInputConsentId   /* a3e0f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("apiname") ?<Dropdownapiname   /* 543a3 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("permissions") ?<Dropdownpermissions   /* f74a7 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("usertype") ?<DropdownUserType   /* 218a1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("purpose") ?<DropdownPurpose   /* 3c50a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("url") ?<TextInputUrl   /* e0b3a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("call_get_accounts")  ?<ButtonCall_Get_Accounts lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
    </div>
 )
}

export default GroupGet_Accounts
