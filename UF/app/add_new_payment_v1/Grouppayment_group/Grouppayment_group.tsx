

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Dropdownchannel_name  from "./Dropdownchannel_name";
import Dropdownproduct_code  from "./Dropdownproduct_code";
import Dropdowndirection  from "./Dropdowndirection";
import Dropdowncharge_type  from "./Dropdowncharge_type";
import TextInputdebtor_account  from "./TextInputdebtor_account";
import TextInputcreditor_accounts  from "./TextInputcreditor_accounts";
import TextInputamount  from "./TextInputamount";
import Dropdowncurrency  from "./Dropdowncurrency";
import TextInputuuid  from "./TextInputuuid";
import Dropdownprocess_type  from "./Dropdownprocess_type";
import Dropdowntran_category  from "./Dropdowntran_category";
import DatePickersettlement_date  from "./DatePickersettlement_date";
import TextInputremittance_info  from "./TextInputremittance_info";
import DynamicJsonFormproduct_code_json  from "./DynamicJsonFormproduct_code_json";
import ButtonSave  from "./ButtonSave";
import ButtonClear  from "./ButtonClear";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouppayment_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_get_transaction_dfd_v1Props, setdfd_get_transaction_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Maker": {
    "allowedControls": [
      "channel_name",
      "product_code",
      "direction",
      "charge_type",
      "debtor_account",
      "creditor_accounts",
      "amount",
      "currency",
      "uuid",
      "process_type",
      "tran_category",
      "settlement_date",
      "remittance_info",
      "product_code_json",
      "save",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "payment_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "channel_name",
      "product_code",
      "direction",
      "charge_type",
      "debtor_account",
      "creditor_accounts",
      "amount",
      "currency",
      "uuid",
      "process_type",
      "tran_category",
      "settlement_date",
      "remittance_info",
      "product_code_json",
      "save",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "payment_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "channel_name",
      "product_code",
      "direction",
      "charge_type",
      "debtor_account",
      "creditor_accounts",
      "amount",
      "currency",
      "uuid",
      "process_type",
      "tran_category",
      "settlement_date",
      "remittance_info",
      "product_code_json",
      "save",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "payment_group"
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
  const [ButtonGoRuleData,setButtonGoRuleData]=useState<any>({})
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
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",componentId:"4e3a333fdb93472c97f4c7ca2461c8a5",from:"GroupPaymentGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("channel_name")){
      setchannel_named9a37({...channel_named9a37,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_code9a692({...product_code9a692,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("direction")){
      setdirectionbf471({...directionbf471,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("charge_type")){
      setcharge_type977c5({...charge_type977c5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debtor_account")){
      setdebtor_account0655c({...debtor_account0655c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("creditor_accounts")){
      setcreditor_accounts82148({...creditor_accounts82148,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("amount")){
      setamountc2ae9({...amountc2ae9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency")){
      setcurrency124c5({...currency124c5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid")){
      setuuide86ae({...uuide86ae,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("process_type")){
      setprocess_type45fad({...process_type45fad,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_category")){
      settran_category81c97({...tran_category81c97,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("settlement_date")){
      setsettlement_datea6baf({...settlement_datea6baf,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("remittance_info")){
      setremittance_info57b4b({...remittance_info57b4b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code_json")){
      setproduct_code_json46315({...product_code_json46315,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsaveb6b99({...saveb6b99,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("clear")){
      setclearf69d6({...clearf69d6,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['payment_group']  = payment_group1c8a5,
      codeStates['setpayment_group'] = setpayment_group1c8a5,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const payment_group1c8a5Ref = useRef<any>(null);
  const handleClearSearch = () => {
    payment_group1c8a5Ref.current?.setSearchParams();
    payment_group1c8a5Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(payment_group1c8a5) && Object.keys(payment_group1c8a5)?.length>0)
      {
        setpayment_group1c8a5({})
      }
    }else 
      prevRefreshRef.current= true
  }, [payment_group1c8a5Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 169',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '10px',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md p-4 ${isDark ? 'text-white' : 'text-black'}`}
    >
        {allowedControls.includes("channel_name") ?<Dropdownchannel_name   /* d9a37 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("product_code") ?<Dropdownproduct_code   /* 9a692 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("direction") ?<Dropdowndirection   /* bf471 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("charge_type") ?<Dropdowncharge_type   /* 977c5 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("debtor_account") ?<TextInputdebtor_account   /* 0655c */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("creditor_accounts") ?<TextInputcreditor_accounts   /* 82148 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("amount") ?<TextInputamount   /* c2ae9 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("currency") ?<Dropdowncurrency   /* 124c5 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("uuid") ?<TextInputuuid   /* e86ae */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("process_type") ?<Dropdownprocess_type   /* 45fad */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("tran_category") ?<Dropdowntran_category   /* 81c97 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("settlement_date") ?<DatePickersettlement_date   /* a6baf */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("remittance_info") ?<TextInputremittance_info   /* 57b4b */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("product_code_json") ?<DynamicJsonFormproduct_code_json   /* 46315 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("save" in ButtonGoRuleData)?ButtonGoRuleData["save"]:true) && 
          allowedControls.includes("save")  ?            <ButtonSave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("clear" in ButtonGoRuleData)?ButtonGoRuleData["clear"]:true) && 
          allowedControls.includes("clear")  ?            <ButtonClear lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Grouppayment_group
