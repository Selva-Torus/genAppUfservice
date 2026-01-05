
'use client'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { codeExecution } from '@/app/utils/codeExecution';
import React, { useState,useEffect,useContext,useRef } from 'react';
import { List } from '@/components/List';
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';

const Listlist = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const prevRefreshRef = useRef(false);
  const toast:any=useInfoMsg();
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

  let items=[
  {
    "title": "aaa",
    "disabled": true,
    "group": false
  },
  {
    "title": "bbb",
    "disabled": true,
    "group": false
  }
] ;

let dataItems = items

const handleonItemClick=async(value:any={})=>{
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",  componentId:"7a5f6e1c8f4f4801b28383ae87fbffe9",controlId:"c8266b6bd4db490588139afe631e1b9e",isTable:false,accessProfile:accessProfile,from:"listlist"},{
    headers: {
      Authorization: `Bearer ${token}`
  }})
   let code:any=orchestrationData?.data?.code;

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
  setgroupbffe9((prev: any) => ({ ...prev, list: value||"" }));
}

useEffect(() => {
  if (prevRefreshRef.current) {
    setgroupbffe9((pre:any)=>({...pre,list:""}));
    handleonItemClick();
  }else 
  prevRefreshRef.current= true    
},[liste1b9e?.refresh])

if (liste1b9e?.isHidden) {
  return <></>;
}

return (
  <div 
    style={{gridColumn: `16 / 23`,gridRow: `184 / 280`, gap:``, height: `100%`, overflow: 'auto'}} >
    <List 
      className=""
      sortable={false}
      filterable={false}
      items={dataItems}
      onItemClick={value => handleonItemClick(value?.title)}
      needTooltip={true}  
      tooltipProps={{title:"tool",placement:"right-start"}}
      headerPosition='top'
      headerText="Sample Header"
      contentAlign='center'
    />
  </div>
  )
}

export default Listlist
