
'use client'
import React, { useContext, useEffect,useState } from 'react'  
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import DocumentUploader from '@/components/DocumentUploader';
import { codeExecution } from '@/app/utils/codeExecution';
import i18n from '@/app/components/i18n';
import { Text } from '@/components/Text';

const Documentuploaderhh = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("");
  let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
      codeStates['parent']  = parent0e5b8,
      codeStates['setparent'] = setparent0e5b8,
      codeStates['form']  = form775ce,
      codeStates['setform'] = setform775ce,
      codeStates['groupfordynamicbutton']  = groupfordynamicbutton143be,
      codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
      codeStates['buttons']  = buttons60ce5,
      codeStates['setbuttons'] = setbuttons60ce5,
      customCode = codeExecution(code,codeStates);
    }
  }

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "03e924560c144d3181733fca11c0e5b8",
          controlId: "78798e75a39f4f7288e45aa9965eadd1",
          isTable: false,
          from:"Buttonhh",
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
      setAllCode(orchestrationData?.data?.code);
    }catch(err){
        console.log(err);
    }
  }
  useEffect(()=>{
    handleMapper();
  },[])
  const keyset: any = i18n.keyset('language');
   /////////////
   //another screen
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {hheadd1, sethheadd1}= useContext(TotalContext) as TotalContextProps;
  const {selectionapproach09360, setselectionapproach09360}= useContext(TotalContext) as TotalContextProps;
  const {options850a2, setoptions850a2}= useContext(TotalContext) as TotalContextProps;
  const {test22a10, settest22a10}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleClick = async (file:any) => {
    setparent0e5b8((prev: any) => ({ ...prev, hh: file }))
      handleCustomCode()
    }

  if (hheadd1?.isHidden) {
    return <></>
  }

  return (
    <div   
      style={{gridColumn: `20 / 22`,gridRow: `28 / 38`, gap:``, height: `100%`, overflow: 'auto'}} >
      <DocumentUploader
        className=""
        id="hheadd1"
        value={parent0e5b8.hh}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1 // 1MB
        }}
        contentAlign={"center"}
        onChange={handleClick}
        preview={true}
        draggable={true}
        singleSelect={false}
        viewType="modal"
        DbType={"mongodb"}
        enableEncryption={""}
        fileNamingPreference={"use_system_generated_name"}
      />
    </div>
  )
}

export default Documentuploaderhh





