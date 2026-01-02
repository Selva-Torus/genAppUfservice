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
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import BarChartsbar_chart  from "./BarChartsbar_chart";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupbar_chart_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_mongo_line_chart_v1Props, setdfd_mongo_line_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_bar_chart_v1Props, setdfd_mongo_bar_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_maindashboard_v1Props, setdfd_mongo_maindashboard_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_repository_v1Props, setdfd_mongo_api_repository_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "EQBAdmin": {
    "allowedControls": [
      "bar_chart"
    ],
    "allowedGroups": [
      "canvas",
      "vmc_dashboard_screen",
      "maindashboard_cards",
      "line_chart_group",
      "bar_chart_group",
      "api_repo_table",
      "api_repositorys"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [
      "bar_chart"
    ],
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
  const {vmc_dashboard_screen43803, setvmc_dashboard_screen43803}= useContext(TotalContext) as TotalContextProps;
  const {vmc_dashboard_screen43803Props, setvmc_dashboard_screen43803Props}= useContext(TotalContext) as TotalContextProps;
  const {maindashboard_cards0d32d, setmaindashboard_cards0d32d}= useContext(TotalContext) as TotalContextProps;
  const {maindashboard_cards0d32dProps, setmaindashboard_cards0d32dProps}= useContext(TotalContext) as TotalContextProps;
  const {line_chart_group23d18, setline_chart_group23d18}= useContext(TotalContext) as TotalContextProps;
  const {line_chart_group23d18Props, setline_chart_group23d18Props}= useContext(TotalContext) as TotalContextProps;
  const {bar_chart_group93773, setbar_chart_group93773}= useContext(TotalContext) as TotalContextProps;
  const {bar_chart_group93773Props, setbar_chart_group93773Props}= useContext(TotalContext) as TotalContextProps;
  const {bar_chart6e196, setbar_chart6e196}= useContext(TotalContext) as TotalContextProps;
  const {api_repo_table83529, setapi_repo_table83529}= useContext(TotalContext) as TotalContextProps;
  const {api_repo_table83529Props, setapi_repo_table83529Props}= useContext(TotalContext) as TotalContextProps;
  const {api_repositorysb8178, setapi_repositorysb8178}= useContext(TotalContext) as TotalContextProps;
  const {api_repositorysb8178Props, setapi_repositorysb8178Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1",componentId:"461923a0e17f4aa0a4a218b629893773",from:"GroupBarChartGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("bar_chart")){
      setbar_chart6e196({...bar_chart6e196,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['vmc_dashboard_screen']  = vmc_dashboard_screen43803,
      codeStates['setvmc_dashboard_screen'] = setvmc_dashboard_screen43803,
      codeStates['maindashboard_cards']  = maindashboard_cards0d32d,
      codeStates['setmaindashboard_cards'] = setmaindashboard_cards0d32d,
      codeStates['line_chart_group']  = line_chart_group23d18,
      codeStates['setline_chart_group'] = setline_chart_group23d18,
      codeStates['bar_chart_group']  = bar_chart_group93773,
      codeStates['setbar_chart_group'] = setbar_chart_group93773,
      codeStates['api_repo_table']  = api_repo_table83529,
      codeStates['setapi_repo_table'] = setapi_repo_table83529,
      codeStates['api_repositorys']  = api_repositorysb8178,
      codeStates['setapi_repositorys'] = setapi_repositorysb8178,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const bar_chart_group93773Ref = useRef<any>(null);
  const handleClearSearch = () => {
    bar_chart_group93773Ref.current?.setSearchParams();
    bar_chart_group93773Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(bar_chart_group93773) && Object.keys(bar_chart_group93773)?.length>0)
      {
        setbar_chart_group93773({})
      }
    }else 
      prevRefreshRef.current= true
  }, [bar_chart_group93773Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '7 / 13',
        gridRow: '46 / 148',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '',
        //rowGap: '',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={clsx("bg-white gap-2 p-2",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedControls.includes("bar_chart") ?<BarChartsbar_chart /* 6e196 */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupbar_chart_group
