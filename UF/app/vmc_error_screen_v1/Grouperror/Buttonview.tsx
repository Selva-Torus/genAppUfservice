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
import PageVmcViewInfopage from '@/app/vmc_view_info_v1/vmc_view_info_v1page';



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

const Buttonview = ({mainData,setRefetch,encryptionFlagCompData}:any) => {
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
  const {vmc_view_info_v1Props, setvmc_view_info_v1Props}= useContext(TotalContext) as TotalContextProps;
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
  const {vmc_error_screen68a17, setvmc_error_screen68a17}= useContext(TotalContext) as TotalContextProps;
  const {vmc_error_screen68a17Props, setvmc_error_screen68a17Props}= useContext(TotalContext) as TotalContextProps;
  const {error81aed, seterror81aed}= useContext(TotalContext) as TotalContextProps;
  const {error81aedProps, seterror81aedProps}= useContext(TotalContext) as TotalContextProps;
  const {dateandtime1297b, setdateandtime1297b}= useContext(TotalContext) as TotalContextProps;
  const {source654ee, setsource654ee}= useContext(TotalContext) as TotalContextProps;
  const {message53ca9, setmessage53ca9}= useContext(TotalContext) as TotalContextProps;
  const {viewca8bb, setviewca8bb}= useContext(TotalContext) as TotalContextProps;
  const {vmc_viewmsg_info269e2, setvmc_viewmsg_info269e2}= useContext(TotalContext) as TotalContextProps;
  const {vmc_viewmsg_info269e2Props, setvmc_viewmsg_info269e2Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    let code :any = allCode;
    if (code != '') {
      let codeStates: any = {};
      codeStates['vmc_error_screen']  = vmc_error_screen68a17,
      codeStates['setvmc_error_screen'] = setvmc_error_screen68a17,
      codeStates['error']  = error81aed,
      codeStates['seterror'] = seterror81aed,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Error_Screen:AFVK:v1",
          componentId: "3398db28967f415f9f2c9cf58ed81aed",
          controlId: "188c40d5d4df4a1292e4defd465ca8bb",
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
        codeStates['vmc_error_screen']  = vmc_error_screen68a17,
        codeStates['setvmc_error_screen'] = setvmc_error_screen68a17,
        codeStates['error']  = error81aed,
        codeStates['seterror'] = seterror81aed,
        customCode = codeExecution(code,codeStates);
        return customCode;
      }
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    eventBus.on("triggerButton", (id:any) => {
      if (id === "viewca8bb") {
        buttonRef.current?.click();
      }
    });
  },[])


  const handleClick=async()=>{
    if(error81aedProps?.validation==true && error81aedProps?.required==true || error81aedProps?.required==true)
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
    let filterProps:any =  [
  {
    "key": "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "917cef7a59ab4ab7b53a188b0c14acd2",
        "object": {
          "properties._id": ""
        }
      }
    ]
  }
]; 
    let filterData = await getFilterProps(filterProps,mainData);
    setvmc_view_info_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true);
      // copyFormData
      // for particular controller
      setvmc_viewmsg_info269e2(mainData);
      setvmc_viewmsg_info269e2Props({...vmc_viewmsg_info269e2Props,presetValues:mainData});
    }catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }
  async function handleConfirmOnClick(){
  } 


 if (viewca8bb?.isHidden) {
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
        <PageVmcViewInfopage/>
      </Modal>
      <Button 
        ref={buttonRef}
        className=""
        onClick={handleClick}
        view='action'
        size='m'           
        disabled= {viewca8bb?.isDisabled ? true : false}
        pin='circle-circle'
      >
                {keyset("View")}
      </Button>
    </div>
  )
}

export default Buttonview
