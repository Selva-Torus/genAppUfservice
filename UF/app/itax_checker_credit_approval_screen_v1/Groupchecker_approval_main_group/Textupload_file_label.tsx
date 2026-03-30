'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textupload_file_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const token: string = getCookie('token')
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const keyset:any=i18n.keyset("language");
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {checker_approval_main_groupff981, setchecker_approval_main_groupff981}= useContext(TotalContext) as TotalContextProps;
  const {checker_approval_main_groupff981Props, setchecker_approval_main_groupff981Props}= useContext(TotalContext) as TotalContextProps;
  const {upload_file_label93f14, setupload_file_label93f14}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_ida5acc, setitaxst_ida5acc}= useContext(TotalContext) as TotalContextProps;
  const {documentuploader68dcb, setdocumentuploader68dcb}= useContext(TotalContext) as TotalContextProps;
  const {file_name456cb, setfile_name456cb}= useContext(TotalContext) as TotalContextProps;
  const {cancel68e13, setcancel68e13}= useContext(TotalContext) as TotalContextProps;
  const {credit_approve89f9a, setcredit_approve89f9a}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[upload_file_label93f14?.refresh])

  if (upload_file_label93f14?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 17`,gridRow: `1 / 8`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Upload File")}
</Text>
  </div>
  )
}

export default Textupload_file_label
