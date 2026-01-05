'use client'

import i18n from '@/app/components/i18n';
import React, { useState,useEffect,useContext,useRef } from 'react' ;
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { AxiosService } from "@/app/components/axiosService";
import { Radio } from '@/components/Radio';
import { Text } from '@/components/Text';
import { Modal } from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { eventBus } from '@/app/eventBus';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';


const Radioradio = ({setCheckToAdd,encryptionFlagComp,encryptionFlagCompData}:any) =>{
  const token:string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const prevRefreshRef = useRef(false);
  let readableControls :any=[];
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const toast:any=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("")
  const routes = useRouter();
  const keyset:any=i18n.keyset("language");
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
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
          controlId: "7da2485788af49d2beaf577a96854f01",
          isTable: false,
          from:"Radioradio",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code)
      return
    }catch(err)
      {
        console.log(err)
    }
  }
  
  useEffect(()=>{
    handleMapperValue()
    setgroupbffe9((pre:any)=>({...pre,radio:""}));
  },[radio54f01?.refresh])
    
  const handleChange = async (checked: boolean) => {
    setgroupbffe9((prev: any) => ({ ...prev, radio: checked}));
  }
    const handleBlur = async (e:any)=>{
      let code:any = allCode;
      if (code == "") {
        //toast(code?.data?.errorDetails?.message, 'danger');
        //return;
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

  if (radio54f01?.isHidden) {
    return <></>
  }

return (
  <div 
    className="" 
    style={{gridColumn: `2 / 8`,gridRow: `297 / 326`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Radio
      className=""
      onBlur={handleBlur}
      onClick={handleChange}
      contentAlign={"left"}
      needTooltip={true}  
      tooltipProps={{title:"tooltip",placement:"bottom-start"}}
      headerText="header"
      headerPosition="top"
      disabled= {radio54f01?.isDisabled ? true : false}
      content="radio"
      value="radio"
      checked={groupbffe9.radio||false}
    />
  </div>
  )
}

export default Radioradio
