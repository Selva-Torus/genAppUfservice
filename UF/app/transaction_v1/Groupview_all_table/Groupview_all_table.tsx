

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
// page import
import PageTranJourneypage from '@/app/tran_journey_v1/tran_journey_v1page';
import Tableview_all_table  from './Tableview_all_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupview_all_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_tran_journey_db_query_v1Props, setdfd_tran_journey_db_query_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "view_all_logs",
      "view_all_button",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info",
      "charge_type"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "view_all_logs",
      "view_all_button",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info",
      "charge_type"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "view_all_logs",
      "view_all_button",
      "product_code",
      "uuid",
      "channel_name",
      "settlement_date",
      "dr_account",
      "dr_amount",
      "dr_currency",
      "cr_account",
      "remittance_info",
      "charge_type"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
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
  const {transaction_groupcc5ac, settransaction_groupcc5ac}= useContext(TotalContext) as TotalContextProps;
  const {transaction_groupcc5acProps, settransaction_groupcc5acProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125, settab_group05125}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125Props, settab_group05125Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07, setview_all_tab71a07}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07Props, setview_all_tab71a07Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4, setview_all_table648c4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4Props, setview_all_table648c4Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_logs50c05, setview_all_logs50c05}= useContext(TotalContext) as TotalContextProps;
  const {view_all_button56968, setview_all_button56968}= useContext(TotalContext) as TotalContextProps;
  const {product_code27e26, setproduct_code27e26}= useContext(TotalContext) as TotalContextProps;
  const {uuidb02c5, setuuidb02c5}= useContext(TotalContext) as TotalContextProps;
  const {channel_name1516d, setchannel_name1516d}= useContext(TotalContext) as TotalContextProps;
  const {settlement_date32e82, setsettlement_date32e82}= useContext(TotalContext) as TotalContextProps;
  const {dr_account5a90a, setdr_account5a90a}= useContext(TotalContext) as TotalContextProps;
  const {dr_amount8f415, setdr_amount8f415}= useContext(TotalContext) as TotalContextProps;
  const {dr_currencycb231, setdr_currencycb231}= useContext(TotalContext) as TotalContextProps;
  const {cr_accountf334f, setcr_accountf334f}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info30960, setremittance_info30960}= useContext(TotalContext) as TotalContextProps;
  const {charge_type3dd6d, setcharge_type3dd6d}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090, setfailure_queue_tab11090}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090Props, setfailure_queue_tab11090Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9, setfailure_queue_table449a9}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9Props, setfailure_queue_table449a9Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_groupbe7ae, settran_journey_groupbe7ae}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_groupbe7aeProps, settran_journey_groupbe7aeProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",componentId:"3f94014a7b1249e48c966720deb648c4",from:"GroupViewAllTable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("view_all_logs")){
      setview_all_logs50c05({...view_all_logs50c05,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_all_button")){
      setview_all_button56968({...view_all_button56968,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_code27e26({...product_code27e26,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid")){
      setuuidb02c5({...uuidb02c5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("channel_name")){
      setchannel_name1516d({...channel_name1516d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("settlement_date")){
      setsettlement_date32e82({...settlement_date32e82,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_account")){
      setdr_account5a90a({...dr_account5a90a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_amount")){
      setdr_amount8f415({...dr_amount8f415,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("dr_currency")){
      setdr_currencycb231({...dr_currencycb231,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cr_account")){
      setcr_accountf334f({...cr_accountf334f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("remittance_info")){
      setremittance_info30960({...remittance_info30960,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("charge_type")){
      setcharge_type3dd6d({...charge_type3dd6d,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const view_all_table648c4Ref = useRef<any>(null);
  const handleClearSearch = () => {
    view_all_table648c4Ref.current?.setSearchParams();
    view_all_table648c4Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(view_all_table648c4) && Object.keys(view_all_table648c4)?.length>0)
      {
        setview_all_table648c4({})
      }
    }else 
      prevRefreshRef.current= true
  }, [view_all_table648c4Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 90',
      
        //rowGap: '0px',
        overflow: 'visible',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
      <Modal 
      open={showProfileAsModalOpen} 
      onClose={() => setShowProfileAsModalOpen(false)} 
      title={"Tran_Journey"}
      className='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
        <PageTranJourneypage/>
      </Modal>
        <CommonHeaderAndTooltip
        >
        <div className='flex flex-col h-full'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tableview_all_table lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={view_all_table648c4Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Groupview_all_table
