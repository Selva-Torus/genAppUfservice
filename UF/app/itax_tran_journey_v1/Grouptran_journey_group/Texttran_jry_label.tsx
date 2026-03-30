'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texttran_jry_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {tran_journey_group30215, settran_journey_group30215}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_group30215Props, settran_journey_group30215Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_jry_labelbaee1, settran_jry_labelbaee1}= useContext(TotalContext) as TotalContextProps;
  const {transaction_journey39171, settransaction_journey39171}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[tran_jry_labelbaee1?.refresh])

  if (tran_jry_labelbaee1?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 13`,gridRow: `1 / 11`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Transaction Journey")}
</Text>
  </div>
  )
}

export default Texttran_jry_label
