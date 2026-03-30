'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texterror_details = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {error_details_json_groupc13f1, seterror_details_json_groupc13f1}= useContext(TotalContext) as TotalContextProps;
  const {error_details_json_groupc13f1Props, seterror_details_json_groupc13f1Props}= useContext(TotalContext) as TotalContextProps;
  const {error_details21287, seterror_details21287}= useContext(TotalContext) as TotalContextProps;
  const {json_vieweree843, setjson_vieweree843}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[error_details21287?.refresh])

  if (error_details21287?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 14`,gridRow: `1 / 11`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Error Details")}
</Text>
  </div>
  )
}

export default Texterror_details
