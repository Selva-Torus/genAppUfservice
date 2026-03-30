'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textview_details = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {view_detail_back_group50bce, setview_detail_back_group50bce}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_back_group50bceProps, setview_detail_back_group50bceProps}= useContext(TotalContext) as TotalContextProps;
  const {view_details5f9dd, setview_details5f9dd}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21, setview_detail_group73f21}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21Props, setview_detail_group73f21Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106, setprn_no_datails_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[view_details5f9dd?.refresh])

  if (view_details5f9dd?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 8`,gridRow: `1 / 9`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("View Details")}
</Text>
  </div>
  )
}

export default Textview_details
