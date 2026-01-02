'use client'
import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';



function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
} 

const Buttonview_logs = ({mainData,setRefetch,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const {vmc_msg_info_v1Props, setvmc_msg_info_v1Props}= useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false;
  const toast:any=useInfoMsg();
  const [allCode,setAllCode]=useState<any>("");
  let dfKey: string | any;
  const [loading, setLoading] = useState(false);
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
  const {api_repo_table83529, setapi_repo_table83529}= useContext(TotalContext) as TotalContextProps;
  const {api_repo_table83529Props, setapi_repo_table83529Props}= useContext(TotalContext) as TotalContextProps;
  const {api_repositorysb8178, setapi_repositorysb8178}= useContext(TotalContext) as TotalContextProps;
  const {api_repositorysb8178Props, setapi_repositorysb8178Props}= useContext(TotalContext) as TotalContextProps;
  const {source_msg_typef1a17, setsource_msg_typef1a17}= useContext(TotalContext) as TotalContextProps;
  const {versiona455f, setversiona455f}= useContext(TotalContext) as TotalContextProps;
  const {status5876f, setstatus5876f}= useContext(TotalContext) as TotalContextProps;
  const {release_date0c8e5, setrelease_date0c8e5}= useContext(TotalContext) as TotalContextProps;
  const {view_logsa4aa8, setview_logsa4aa8}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475a, setapi_repository_groupsb475a}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475aProps, setapi_repository_groupsb475aProps}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    let code :any = allCode;
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
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1",
          componentId: "659ed4f8fea94db381489765a75b8178",
          controlId: "4be91577323a4236925b9e68824a4aa8",
          isTable: false,
          from:"ButtonView Log",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return;
      }
      setAllCode(orchestrationData?.data?.code);
      let code :any = orchestrationData?.data?.code;
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
        customCode = codeExecution(code,codeStates);
        return customCode;
      }
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    eventBus.on("triggerButton", (id:any) => {
      if (id === "view_logsa4aa8") {
        buttonRef.current?.click();
      }
    });
  },[])


  const handleClick=async()=>{
    if(api_repositorysb8178Props?.validation==true && api_repositorysb8178Props?.required==true || api_repositorysb8178Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
        return;
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
    } 
    await handleMapper();
    let saveCheck=false;
    Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true;
    }});
    if (saveCheck) {   
      toast('Please verify the data', 'danger');
      return;
    }
    try{  
    // show as profile 
    let filterProps:any =  [
  {
    "key": "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "a28911cddcac48c996636b2b499c4cec",
        "object": {
          "properties.source_msg_type": "source_msg_type"
        }
      }
    ]
  }
]; 
    let filterData = await getFilterProps(filterProps,mainData);
    setvmc_msg_info_v1Props([...filterData ]);
    routes.push(getRouteScreenDetails('CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1', 'vmc_msg_info_v1'));
      // copyFormData
      // for particular controller
      setapi_repository_groupsb475a(mainData);
      setapi_repository_groupsb475aProps({...api_repository_groupsb475aProps,presetValues:mainData});
      // copyFormData
      // for particular controller
      setapi_process_log17839(mainData);
      setapi_process_log17839Props({...api_process_log17839Props,presetValues:mainData});
    }catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }
  async function handleConfirmOnClick(){
  } 


 if (view_logsa4aa8?.isHidden) {
    return <></>
  }
  
  return (
    <div 
>
      <Button 
        ref={buttonRef}
        className=""
        onClick={handleClick}
        disabled= {view_logsa4aa8?.isDisabled ? true : false}
        pin='circle-circle'
      >
                {keyset("View Log")}
      </Button>
    </div>
  )
}

export default Buttonview_logs
