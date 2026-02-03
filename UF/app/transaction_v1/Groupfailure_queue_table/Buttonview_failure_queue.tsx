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

const Buttonview_failure_queue = ({mainData,setRefetch,encryptionFlagCompData}:any) => {
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
  const {transaction_groupcc5ac, settransaction_groupcc5ac}= useContext(TotalContext) as TotalContextProps;
  const {transaction_groupcc5acProps, settransaction_groupcc5acProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125, settab_group05125}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125Props, settab_group05125Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07, setview_all_tab71a07}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07Props, setview_all_tab71a07Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4, setview_all_table648c4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4Props, setview_all_table648c4Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090, setfailure_queue_tab11090}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090Props, setfailure_queue_tab11090Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9, setfailure_queue_table449a9}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9Props, setfailure_queue_table449a9Props}= useContext(TotalContext) as TotalContextProps;
  const {logs_failure_queue7e78b, setlogs_failure_queue7e78b}= useContext(TotalContext) as TotalContextProps;
  const {view_failure_queue04cba, setview_failure_queue04cba}= useContext(TotalContext) as TotalContextProps;
  const {product_codea1bf6, setproduct_codea1bf6}= useContext(TotalContext) as TotalContextProps;
  const {uuidd1032, setuuidd1032}= useContext(TotalContext) as TotalContextProps;
  const {channel_name0e1ca, setchannel_name0e1ca}= useContext(TotalContext) as TotalContextProps;
  const {settlement_date202a2, setsettlement_date202a2}= useContext(TotalContext) as TotalContextProps;
  const {dr_accountf4175, setdr_accountf4175}= useContext(TotalContext) as TotalContextProps;
  const {dr_amountaa5df, setdr_amountaa5df}= useContext(TotalContext) as TotalContextProps;
  const {dr_currency3c79d, setdr_currency3c79d}= useContext(TotalContext) as TotalContextProps;
  const {cr_account6ee89, setcr_account6ee89}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info74cbb, setremittance_info74cbb}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    let code :any = allCode;
    if (code != '') {
      let codeStates: any = {};
      codeStates['transaction_group']  = transaction_groupcc5ac,
      codeStates['settransaction_group'] = settransaction_groupcc5ac,
      codeStates['view_all_table']  = view_all_table648c4,
      codeStates['setview_all_table'] = setview_all_table648c4,
      codeStates['failure_queue_table']  = failure_queue_table449a9,
      codeStates['setfailure_queue_table'] = setfailure_queue_table449a9,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",
          componentId: "7fdf1711296241a49cf31883f93449a9",
          controlId: "23740eb49ace4bfdb950182cd8f04cba",
          isTable: false,
          from:"ButtonView",
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
        codeStates['transaction_group']  = transaction_groupcc5ac,
        codeStates['settransaction_group'] = settransaction_groupcc5ac,
        codeStates['view_all_table']  = view_all_table648c4,
        codeStates['setview_all_table'] = setview_all_table648c4,
        codeStates['failure_queue_table']  = failure_queue_table449a9,
        codeStates['setfailure_queue_table'] = setfailure_queue_table449a9,
        customCode = codeExecution(code,codeStates);
        return customCode;
      }
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    eventBus.on("triggerButton", (id:any) => {
      if (id === "view_failure_queue04cba") {
        buttonRef.current?.click();
      }
    });
  },[])


  const handleClick=async()=>{
    if(failure_queue_table449a9Props?.validation==true && failure_queue_table449a9Props?.required==true || failure_queue_table449a9Props?.required==true)
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
    }catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }


 if (view_failure_queue04cba?.isHidden) {
    return <></>
  }
  
  return (
    <div 
>
      <Button 
        ref={buttonRef}
        className=""
        onClick={handleClick}
        view='action'
        disabled= {view_failure_queue04cba?.isDisabled ? true : false}
        pin='brick-brick'
      >
                {keyset("View")}
      </Button>
    </div>
  )
}

export default Buttonview_failure_queue
