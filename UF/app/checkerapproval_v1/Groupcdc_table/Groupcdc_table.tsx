

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
import Tablecdc_table  from './Tablecdc_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupcdc_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_cdc_checker_action_dfd_v1Props, setdfd_cdc_checker_action_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "setup_cd",
      "api_nm",
      "api_endpt",
      "pdt_cd",
      "http_mthd",
      "aprl_id"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "setup_cd",
      "api_nm",
      "api_endpt",
      "pdt_cd",
      "http_mthd",
      "aprl_id"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "setup_cd",
      "api_nm",
      "api_endpt",
      "pdt_cd",
      "http_mthd",
      "aprl_id"
    ],
    "allowedGroups": [
      "canvas",
      "cdc_group",
      "details_group",
      "table_group",
      "cdc_table"
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
  const {cdc_group2e1e4, setcdc_group2e1e4}= useContext(TotalContext) as TotalContextProps;
  const {cdc_group2e1e4Props, setcdc_group2e1e4Props}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbe, setdetails_group46bbe}= useContext(TotalContext) as TotalContextProps;
  const {details_group46bbeProps, setdetails_group46bbeProps}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951, settable_group05951}= useContext(TotalContext) as TotalContextProps;
  const {table_group05951Props, settable_group05951Props}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54d, setcdc_table8e54d}= useContext(TotalContext) as TotalContextProps;
  const {cdc_table8e54dProps, setcdc_table8e54dProps}= useContext(TotalContext) as TotalContextProps;
  const {setup_cd7cc97, setsetup_cd7cc97}= useContext(TotalContext) as TotalContextProps;
  const {api_nm498ae, setapi_nm498ae}= useContext(TotalContext) as TotalContextProps;
  const {api_endpt39a78, setapi_endpt39a78}= useContext(TotalContext) as TotalContextProps;
  const {pdt_cd70f76, setpdt_cd70f76}= useContext(TotalContext) as TotalContextProps;
  const {http_mthd3f6f2, sethttp_mthd3f6f2}= useContext(TotalContext) as TotalContextProps;
  const {aprl_id47e91, setaprl_id47e91}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1",componentId:"5def3a2d3cd44fd49c3d321c5de8e54d",from:"GroupCdcTable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("setup_cd")){
      setsetup_cd7cc97({...setup_cd7cc97,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("api_nm")){
      setapi_nm498ae({...api_nm498ae,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("api_endpt")){
      setapi_endpt39a78({...api_endpt39a78,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pdt_cd")){
      setpdt_cd70f76({...pdt_cd70f76,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("http_mthd")){
      sethttp_mthd3f6f2({...http_mthd3f6f2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("aprl_id")){
      setaprl_id47e91({...aprl_id47e91,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const cdc_table8e54dRef = useRef<any>(null);
  const handleClearSearch = () => {
    cdc_table8e54dRef.current?.setSearchParams();
    cdc_table8e54dRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(cdc_table8e54d) && Object.keys(cdc_table8e54d)?.length>0)
      {
        setcdc_table8e54d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [cdc_table8e54dProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '3 / 172',
      
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
        <CommonHeaderAndTooltip
          headerPosition='top'
          headerText="Checker_Action_Table"
        >
        <div className='flex flex-col h-full'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tablecdc_table lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={cdc_table8e54dRef} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Groupcdc_table
