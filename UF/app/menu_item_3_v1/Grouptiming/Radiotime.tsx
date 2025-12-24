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


const Radiotime = ({setCheckToAdd,encryptionFlagComp,encryptionFlagCompData}:any) =>{
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
      const {cf46a, setcf46a}= useContext(TotalContext) as TotalContextProps;
      const {cf46aProps, setcf46aProps}= useContext(TotalContext) as TotalContextProps;
      const {4f7b1, set4f7b1}= useContext(TotalContext) as TotalContextProps;
      const {4f7b1Props, set4f7b1Props}= useContext(TotalContext) as TotalContextProps;
      const {search676ad, setsearch676ad}= useContext(TotalContext) as TotalContextProps;
      const {search676adProps, setsearch676adProps}= useContext(TotalContext) as TotalContextProps;
      const {8394d, set8394d}= useContext(TotalContext) as TotalContextProps;
      const {8394dProps, set8394dProps}= useContext(TotalContext) as TotalContextProps;
      const {cardbb124, setcardbb124}= useContext(TotalContext) as TotalContextProps;
      const {cardbb124Props, setcardbb124Props}= useContext(TotalContext) as TotalContextProps;
      const {card4d75a4, setcard4d75a4}= useContext(TotalContext) as TotalContextProps;
      const {card4d75a4Props, setcard4d75a4Props}= useContext(TotalContext) as TotalContextProps;
      const {card108d97, setcard108d97}= useContext(TotalContext) as TotalContextProps;
      const {card108d97Props, setcard108d97Props}= useContext(TotalContext) as TotalContextProps;
      const {card23ac19, setcard23ac19}= useContext(TotalContext) as TotalContextProps;
      const {card23ac19Props, setcard23ac19Props}= useContext(TotalContext) as TotalContextProps;
      const {card393c35, setcard393c35}= useContext(TotalContext) as TotalContextProps;
      const {card393c35Props, setcard393c35Props}= useContext(TotalContext) as TotalContextProps;
      const {timing0cafc, settiming0cafc}= useContext(TotalContext) as TotalContextProps;
      const {timing0cafcProps, settiming0cafcProps}= useContext(TotalContext) as TotalContextProps;
      const {heading75dc3, setheading75dc3}= useContext(TotalContext) as TotalContextProps;
      const {time9390a, settime9390a}= useContext(TotalContext) as TotalContextProps;
      const {3397a, set3397a}= useContext(TotalContext) as TotalContextProps;
      const {e1f94, sete1f94}= useContext(TotalContext) as TotalContextProps;
      const {e12a2, sete12a2}= useContext(TotalContext) as TotalContextProps;
      const {4bb52, set4bb52}= useContext(TotalContext) as TotalContextProps;
      const {fd884, setfd884}= useContext(TotalContext) as TotalContextProps;
      const {e15cb, sete15cb}= useContext(TotalContext) as TotalContextProps;
      const {1133f, set1133f}= useContext(TotalContext) as TotalContextProps;
      const {e08fa, sete08fa}= useContext(TotalContext) as TotalContextProps;
      const {42b30, set42b30}= useContext(TotalContext) as TotalContextProps;
      const {b585c, setb585c}= useContext(TotalContext) as TotalContextProps;
      const {e6208, sete6208}= useContext(TotalContext) as TotalContextProps;
      const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
      const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard4:AFVK:v1",
          componentId: "878d15c0f15e497490b25bd54960cafc",
          controlId: "ebf4f2c75a0649288a6bfee66c89390a",
          isTable: false,
          from:"Radio",
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
    settiming0cafc((pre:any)=>({...pre,time:""}));
  },[time9390a?.refresh])
    
  const handleChange = async (checked: boolean) => {
    settiming0cafc((prev: any) => ({ ...prev, time: checked}));
  }
    const handleBlur = async (e:any)=>{
      let code:any = allCode;
      if (code == "") {
        //toast(code?.data?.errorDetails?.message, 'danger');
        //return;
      }  else if (code != '') {
        let codeStates: any = {};
      codeStates['']  = cf46a,
      codeStates['set'] = setcf46a,
      codeStates['']  = 4f7b1,
      codeStates['set'] = set4f7b1,
      codeStates['search']  = search676ad,
      codeStates['setsearch'] = setsearch676ad,
      codeStates['']  = 8394d,
      codeStates['set'] = set8394d,
      codeStates['card']  = cardbb124,
      codeStates['setcard'] = setcardbb124,
      codeStates['card4']  = card4d75a4,
      codeStates['setcard4'] = setcard4d75a4,
      codeStates['card1']  = card108d97,
      codeStates['setcard1'] = setcard108d97,
      codeStates['card2']  = card23ac19,
      codeStates['setcard2'] = setcard23ac19,
      codeStates['card3']  = card393c35,
      codeStates['setcard3'] = setcard393c35,
      codeStates['timing']  = timing0cafc,
      codeStates['settiming'] = settiming0cafc,
      codeStates['table']  = table8472d,
      codeStates['settable'] = settable8472d,
      codeExecution(code,codeStates);
      }
    }

  if (time9390a?.isHidden) {
    return <></>
  }

return (
  <div 
    className="" 
    style={{gridColumn: `1 / 7`,gridRow: `28 / 47`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Radio
      className=""
      onBlur={handleBlur}
      onClick={handleChange}
      size="l"
      disabled= {time9390a?.isDisabled ? true : false}
      content="Today, 08:30 am - 10:30 am"
      value="Today, 08:30 am - 10:30 am"
      checked={timing0cafc.time||false}
    />
  </div>
  )
}

export default Radiotime
