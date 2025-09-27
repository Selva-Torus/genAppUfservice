'use client'
import React, { useState,useEffect,useContext, useRef } from 'react'
import axios from 'axios';
import {Button,Container} from '@gravity-ui/uikit';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import TorusButton from '@/app/TorusComponents/Button';
import TorusIcon from '@/app/TorusComponents/Icon';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Text } from '@gravity-ui/uikit';



    

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
 

const Buttonsave =  ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keyset:any=i18n.keyset("language")
  const token:string = getCookie('token');
  const confirmMsgFlag: boolean = false
 
  const toast:any=useInfoMsg()

  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("")
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  let dfKey: string | any
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const lockMode:any = lockedData.lockMode;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [loading, setLoading] = useState(false)
  const sessionInfo:any = {
    accessToken: token,
    authToken: ''
  }
  const routes = useRouter()
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let code:any;
 /////////////
   //another screen
  const {root, setroot}= useContext(TotalContext) as TotalContextProps  
  const {rootProps, setrootProps}= useContext(TotalContext) as TotalContextProps  
  const {name8eedd, setname8eedd}= useContext(TotalContext) as TotalContextProps  
  const {age7d25a, setage7d25a}= useContext(TotalContext) as TotalContextProps  
  const {save3d5e3, setsave3d5e3}= useContext(TotalContext) as TotalContextProps  
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any
  const handleCustomCode=async () => {
    if (code != '') {
      let codeStates: any = {}
        customCode = codeExecution(code,codeStates)
        return customCode
    }
  }
  const handleMapper=async () => {
    try{
     
    }catch(err)
    {
        console.log(err)
    }
  }

  useEffect(()=>{
    handleMapper()
    eventBus.on("triggerButton", (id:any) => {
      if (id === "save3d5e3") {
        buttonRef.current?.click();
      }
    });

  },[save3d5e3?.refresh])

  const handleClick=async()=>{
    if(forma62ffProps?.validation==true && forma62ffProps?.required==true || forma62ffProps?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
    } 
    await handleCustomCode()
    let saveCheck=false
    Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger')
      return
    }
    try{  
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger')
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger')
      setLoading(false)
    }
  }
  const handleBlur=(e:any)=>{
    if (code != '') {
      let codeStates: any = {}
      codeStates['']  = root,
      codeStates['set'] = setroot,
      codeExecution(code,codeStates)
    }
  }


 if (save3d5e3?.isHidden) {
    return <></>
  }

  return (
    <div 
      style={{gridColumn: `10 / 11`,gridRow: `2 / 3`,marginTop: `auto`, gap:``}} >
        <TorusButton 
          ref={buttonRef}
          className="w-full "
          onClick={handleClick}
          onBlur={handleBlur}
          disabled= {save3d5e3?.isDisabled ? true : false}
        >
              {keyset("save")}
        </TorusButton>
    </div>
  )
}
export default Buttonsave