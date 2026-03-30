'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textprocess_details_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {process_details_json_viewer_group64f76, setprocess_details_json_viewer_group64f76}= useContext(TotalContext) as TotalContextProps;
  const {process_details_json_viewer_group64f76Props, setprocess_details_json_viewer_group64f76Props}= useContext(TotalContext) as TotalContextProps;
  const {process_details_label489c7, setprocess_details_label489c7}= useContext(TotalContext) as TotalContextProps;
  const {json_viewer235e2, setjson_viewer235e2}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[process_details_label489c7?.refresh])

  if (process_details_label489c7?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 15`,gridRow: `1 / 11`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Process Details")}
</Text>
  </div>
  )
}

export default Textprocess_details_label
