
'use client'
import React, { useContext, useEffect,useState } from 'react'  
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { Label } from '@gravity-ui/uikit';
import {Text} from "@gravity-ui/uikit";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import  TorusDocumentUploader  from '@/app/TorusComponents/Documentuploader';
import { codeExecution } from '@/app/utils/codeExecution';
import i18n from '@/app/components/i18n';

const Documentuploadername = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const keyset: any = i18n.keyset('language');
  const [allCode,setAllCode]=useState<any>("");
   /////////////
   //another screen
  const {groupe162d, setgroupe162d}= useContext(TotalContext) as TotalContextProps;
  const {groupe162dProps, setgroupe162dProps}= useContext(TotalContext) as TotalContextProps;
  const {save1f20e, setsave1f20e}= useContext(TotalContext) as TotalContextProps;
  const {nameed81e, setnameed81e}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7, setmytabled34a7}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7Props, setmytabled34a7Props}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cd, setgroup23b6cd}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cdProps, setgroup23b6cdProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleClick = async (file:any) => {
    setgroupe162d((prev: any) => ({ ...prev, name: file }))
  }

  if (nameed81e?.isHidden) {
    return <></>
  }

  return (
    <div 
      style={{gridColumn: `10 / 12`,gridRow: `15 / 25`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TorusDocumentUploader
        className=""
        id="nameed81e"
        value={groupe162d.name}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1 // 1MB
        }}
        onChange={handleClick}
        preview={true}
        draggable={true}
        singleSelect={false}
        DbType={"DFS"}
        enableEncryption={"true"}
        fileNamingPreference={"use_system_generated_name"}
      />
    </div>
  )
}

export default Documentuploadername





