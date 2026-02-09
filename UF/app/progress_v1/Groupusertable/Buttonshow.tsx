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
import PageBindranscreenpage from '@/app/bindranscreen_v1/bindranscreen_v1page';



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

const Buttonshow = ({mainData,setRefetch,encryptionFlagCompData}:any) => {
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
  const {bindranscreen_v1Props, setbindranscreen_v1Props}= useContext(TotalContext) as TotalContextProps;
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
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {ide6871, setide6871}= useContext(TotalContext) as TotalContextProps;
  const {name15d49, setname15d49}= useContext(TotalContext) as TotalContextProps;
  const {show8fe5a, setshow8fe5a}= useContext(TotalContext) as TotalContextProps;
  const {approve25433, setapprove25433}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    let code :any = allCode;
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupbffe9,
      codeStates['setgroup'] = setgroupbffe9,
      codeStates['usertable']  = usertable8d993,
      codeStates['setusertable'] = setusertable8d993,
      codeStates['usertable2']  = usertable2b6e16,
      codeStates['setusertable2'] = setusertable2b6e16,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
          componentId: "6b206cb857cf48e1be97a737f0d8d993",
          controlId: "6f6bacd622324c24840fd643e768fe5a",
          isTable: false,
          from:"Buttonshow",
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
        codeStates['group']  = groupbffe9,
        codeStates['setgroup'] = setgroupbffe9,
        codeStates['usertable']  = usertable8d993,
        codeStates['setusertable'] = setusertable8d993,
        codeStates['usertable2']  = usertable2b6e16,
        codeStates['setusertable2'] = setusertable2b6e16,
        customCode = codeExecution(code,codeStates);
        return customCode;
      }
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    eventBus.on("triggerButton", (id:any) => {
      if (id === "show8fe5a") {
        buttonRef.current?.click();
      }
    });
  },[])


  const handleClick=async()=>{
    if(usertable8d993Props?.validation==true && usertable8d993Props?.required==true || usertable8d993Props?.required==true)
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
    // showArtifactAsModal
    let filterProps:any =  []; 
    let filterData = await getFilterProps(filterProps,mainData);
    setbindranscreen_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true);
    }catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }
  async function handleConfirmOnClick(){
  } 


 if (show8fe5a?.isHidden) {
    return <></>
  }
  
  return (
    <div 
>
      <Modal 
      open={showProfileAsModalOpen} 
      onClose={() => setShowProfileAsModalOpen(false)} 
      title={""}
      className='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
        <PageBindranscreenpage/>
      </Modal>
      <Button 
        ref={buttonRef}
        className=""
        onClick={handleClick}
        view='action'
        disabled= {show8fe5a?.isDisabled ? true : false}
        pin='brick-brick'
      >
                {keyset("show")}
      </Button>
    </div>
  )
}

export default Buttonshow
