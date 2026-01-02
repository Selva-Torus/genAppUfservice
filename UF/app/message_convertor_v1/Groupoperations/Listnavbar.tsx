
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

const Listnavbar = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const {dfd_mongo_navbar_v1Props, setdfd_mongo_navbar_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
  const {operations58572, setoperations58572}= useContext(TotalContext) as TotalContextProps;
  const {operations58572Props, setoperations58572Props}= useContext(TotalContext) as TotalContextProps;
  const {source95c56, setsource95c56}= useContext(TotalContext) as TotalContextProps;
  const {target64438, settarget64438}= useContext(TotalContext) as TotalContextProps;
  const {navbar8dbd9, setnavbar8dbd9}= useContext(TotalContext) as TotalContextProps;
  const {navbarmx67b58, setnavbarmx67b58}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231, setwrite_group55231}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231Props, setwrite_group55231Props}= useContext(TotalContext) as TotalContextProps;
  const {loadb02a6, setloadb02a6}= useContext(TotalContext) as TotalContextProps;
  const {convert70e2d, setconvert70e2d}= useContext(TotalContext) as TotalContextProps;
  //////////////


    let items=dfd_mongo_navbar_v1Props.map((title:any) =>( {
        "title": title?.value,
        "disabled": title?.disabled,
        "group": false
      
    }))

  let dataItems = items

const handleonItemClick=async(value:any={})=>{
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1",  componentId:"4ee6168b397247489db709a4a1658572",controlId:"0089d7a661874498967e4340b6a8dbd9",isTable:false,accessProfile:accessProfile,from:"listMT Message Types"},{
    headers: {
      Authorization: `Bearer ${token}`
  }})
   let code:any=orchestrationData?.data?.code;

    if (code != '') {
    let codeStates: any = {};
      codeStates['operations']  = operations58572,
      codeStates['setoperations'] = setoperations58572,
      codeStates['write_group']  = write_group55231,
      codeStates['setwrite_group'] = setwrite_group55231,
  codeExecution(code,codeStates);
  }
  setoperations58572((prev: any) => ({ ...prev, name: value||"" }));
  setloadb02a6((prev: any) => ({ ...prev, isDisabled: false }));
  eventBus.emit("triggerButton","loadb02a6");
  setconvert70e2d((prev: any) => ({ ...prev, isDisabled: false }));
  setloadb02a6((prev: any) => ({ ...prev, isDisabled: true }));
  // clearHandler riseListen
  // for controller
    setoperations58572((pre:any)=>({...pre,source:""}));
  // clearHandler riseListen
  // for controller
    setoperations58572((pre:any)=>({...pre,target:""}));
}
async function handleConfirmOnClick(){
}

useEffect(() => {
  if (prevRefreshRef.current) {
    setoperations58572((pre:any)=>({...pre,name:""}));
    handleonItemClick();
  }else 
  prevRefreshRef.current= true    
},[navbar8dbd9?.refresh])

if (navbar8dbd9?.isHidden) {
  return <></>;
}

return (
  <div 
    style={{gridColumn: `1 / 3`,gridRow: `4 / 105`, gap:``, height: `100%`, overflow: 'auto'}} >
    <List 
      className=""
      sortable={false}
      filterable={false}
      itemsHeight={350}
      items={dataItems}
      onItemClick={value => handleonItemClick(value?.title)}
      headerPosition='top'
      headerText="MT Message Types"
    />
  </div>
  )
}

export default Listnavbar
