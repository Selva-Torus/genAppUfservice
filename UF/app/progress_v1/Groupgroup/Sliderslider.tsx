
'use client'
import React, { useState,useContext,useEffect,useRef } from 'react';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Slider } from "@/components/Slider";
import { Text } from "@/components/Text";
import { Button } from '@/components/Button';
import { Modal } from "@/components/Modal";
import i18n from '@/app/components/i18n';
import { useRouter } from 'next/navigation';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

    
const Sliderslider = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const token: string = getCookie('token');
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any="";
  const prevRefreshRef = useRef(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [allCode,setAllCode]=useState<any>("");
 /////////////
   //another screen
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const keyset:any=i18n.keyset("language");

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
          componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
          controlId: "b056432c565a41f8b4bd634a946f7242",
          isTable: false,
          accessProfile:accessProfile,
          from:"sliderslider"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.code)
      {
        setAllCode(orchestrationData?.data?.code)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[sliderf7242?.refresh])

  useEffect(() => { 
    setgroupbffe9((pre:any)=>({...pre,slider:""}))
  },[sliderf7242?.refresh])

  const handleChange = async(newValue: number) => {
    setgroupbffe9((prev: any) => ({ ...prev, slider: newValue}));
  }
  const handleBlur=async(e:any)=>{
    code = allCode
     if (code != '') {
      let codeStates: any = {};
            codeStates['group']  = groupbffe9,
            codeStates['setgroup'] = setgroupbffe9,
            codeStates['usertable']  = usertable8d993,
            codeStates['setusertable'] = setusertable8d993,
            codeStates['usertable2']  = usertable2b6e16,
            codeStates['setusertable2'] = setusertable2b6e16,
      codeExecution(code,codeStates);
    }
  }

  if (sliderf7242?.isHidden) {
    return <></>
  }
return (   
  <div 
    style={{gridColumn: `10 / 18`,gridRow: `15 / 40`, gap:``, height: `100%`, overflow: 'auto'}}>


    <Slider
      className=""
      onChange={handleChange}
      onBlur={handleBlur}
      value={typeof groupbffe9?.slider=='number' ? groupbffe9?.slider:0}
      min = {1}
      max = {100}
      step = {20}
      disabled= {sliderf7242?.isDisabled ? true : false}
      validationState='invalid'
      tooltipDisplay='on'
      needTooltip={true}  
      tooltipProps={{title:"test",placement:"top-end"}}
      headerPosition='top'
      headerText="header"
      showValue={true}
      valueLabel="slider"
      />
    </div>
        
  )
}

export default Sliderslider
