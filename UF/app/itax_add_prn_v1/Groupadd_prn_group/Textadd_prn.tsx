'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textadd_prn = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {add_prn_group1a4d8, setadd_prn_group1a4d8}= useContext(TotalContext) as TotalContextProps;
  const {add_prn_group1a4d8Props, setadd_prn_group1a4d8Props}= useContext(TotalContext) as TotalContextProps;
  const {add_prnadd8d, setadd_prnadd8d}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_labelefcac, setprn_no_labelefcac}= useContext(TotalContext) as TotalContextProps;
  const {prn_no972eb, setprn_no972eb}= useContext(TotalContext) as TotalContextProps;
  const {cleara7662, setcleara7662}= useContext(TotalContext) as TotalContextProps;
  const {saveda692, setsaveda692}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[add_prnadd8d?.refresh])

  if (add_prnadd8d?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 12`,gridRow: `1 / 9`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Add PRN Details")}
</Text>
  </div>
  )
}

export default Textadd_prn
