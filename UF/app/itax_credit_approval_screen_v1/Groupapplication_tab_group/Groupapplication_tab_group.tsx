

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Groupapprove  from "../Groupapprove/Groupapprove";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupapplication_tab_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const allStates:any=useContext(TotalContext) as TotalContextProps;
  let code:any = ``;
    const decodedTokenObj:any = decodeToken(token);

  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_source_tran_doc_dfd_v1Props, setdfd_itax_source_tran_doc_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Branch Officer": {
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
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
  const {authorization_memo_file_group17228, setauthorization_memo_file_group17228}= useContext(TotalContext) as TotalContextProps;
  const {authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fb, setdocumentviewer_group0a3fb}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335, setapplication_group16335}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335Props, setapplication_group16335Props}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4, setapplication_tab_groupf82f4}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3, setapprove1c1d3}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9, setapprove_tableafbb9}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9Props, setapprove_tableafbb9Props}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480, setreason_group39480}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480Props, setreason_group39480Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1",componentId:"05e421f79b5b408f90288f75713f82f4",from:"GroupApplicationTabGroup",accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
  code = orchestrationData?.data?.code;
  setAllCode(orchestrationData?.data?.code||"");
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
  for(let i=0;i<tabOptions?.length;i++){
    if(allowedGroups?.find((group)=>(group==tabOptions[i]?.id)))
    {
      setapplication_tab_groupf82f4((pre:any)=>({...pre,application_tab_group:tabOptions[i]?.id}));
      break;
    }
  }   
  /////////////
    if(orchestrationData?.data?.readableControls.includes("approve")){
      setapprove1c1d3({...approve1c1d3,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['allStates']  = allStates
      codeStates['value']  = "approve"

      codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
     setapplication_tab_groupf82f4((pre:any)=>({...pre,application_tab_group:"approve"}));
  }
  const handleOnChange=async(id?:string)=>{

     code = allCode
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['allStates']  = allStates,
      codeStates['value']  = id,
      codeExecution(code,codeStates);
    }
    setapplication_tab_groupf82f4((pre:any)=>({...pre,application_tab_group:id}));

  }
  const application_tab_groupf82f4Ref = useRef<any>(null);
  const handleClearSearch = () => {
    application_tab_groupf82f4Ref.current?.setSearchParams();
    application_tab_groupf82f4Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(application_tab_groupf82f4) && Object.keys(application_tab_groupf82f4)?.length>0)
      {
        setapplication_tab_groupf82f4({})
      }
    }else 
      prevRefreshRef.current= true
  }, [application_tab_groupf82f4Props?.refresh])

let tabHeaderItems : any =[
];
  let tabOptions:any=[
    {
      "id": "approve",
      "title": "Document List",
      "content": <Groupapprove
        lockedData={lockedData} 
        setLockedData={setLockedData} 
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd} 
        setCheckToAdd={setCheckToAdd}  
        refetch={refetch}
        setRefetch={setRefetch}
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
      />,
    },
  ]
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '2 / 100',
        display: 'grid',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '',
        columnGap: '',
        backgroundImage:"url('')",
        backgroundColor:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
    <Tabs
      className=""
      items={tabOptions}
      security={allowedComponent}
      direction='horizontal'
      onChange={handleOnChange}
      defaultActiveId={application_tab_groupf82f4?.application_tab_group || "approve"}
      activeTab={application_tab_groupf82f4?.application_tab_group || "approve"}
      headerAlignment='left'
          />
        </div>
 )
}

export default Groupapplication_tab_group
