'use client'
import i18n from '@/app/components/i18n';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import React, { useState,useContext,useEffect } from 'react';
import { codeExecution } from '@/app/utils/codeExecution';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { RadioButton } from '@/components/RadioButton';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { AxiosService } from "@/app/components/axiosService";


const RadioButtonradiobutton = ({setCheckToAdd,encryptionFlagCompData}:any) => {
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let readableControls :any = [];
  const [allCode,setAllCode]=useState<any>("");
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const keyset:any=i18n.keyset("language");
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
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

  const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
        componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
        controlId: "12fbeaaf1c29448eaf9557485cc81392",
        isTable: false,
        from:"RadioButtonradiobutton",
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
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    handleMapperValue();
    setgroupbffe9((pre:any)=>({...pre,radiobutton:""}));
  },[radiobutton81392?.refresh])

  const options = [
      {value: 'aaa' ,content:'aaaa'},
      {value: 'bbb' ,content:'test'},
  ];
  const handleChange=(e:any)=>{
setgroupbffe9((prev: any) => ({ ...prev, radiobutton: e}));
  }
  const handleBlur=(e:any)=>{
    let code: any = allCode;
      if (code == "") {
        //toast(code?.data?.errorDetails?.message, 'danger');
        //return
      }  else if (code != '') {
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

  if (radiobutton81392?.isHidden) {
    return <></>
  }
  
  return (
    <div 
      className="" 
      style={{gridColumn: `9 / 14`,gridRow: `295 / 308`, gap:``, height: `100%`, overflow: 'auto'}} >
    <RadioButton 
      className=""
        // value={groupbffe9?.radiobutton||""}
        contentAlign={"left"}
        needTooltip={true}  
        tooltipProps={{title:"tooltip",placement:"bottom-start"}}
        headerText="header"
        headerPosition="left"
        disabled= {radiobutton81392?.isDisabled ? true : false}
        defaultValue={options.length>0?options[0].value:""}
        items={options}       
        onChange={handleChange}
        onBlur={handleBlur}
    />
  </div>
  )
}

export default RadioButtonradiobutton
