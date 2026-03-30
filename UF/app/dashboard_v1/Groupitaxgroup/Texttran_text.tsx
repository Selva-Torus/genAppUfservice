'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texttran_text = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {itaxgroup732e5, setitaxgroup732e5}= useContext(TotalContext) as TotalContextProps;
  const {itaxgroup732e5Props, setitaxgroup732e5Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_text6efd4, settran_text6efd4}= useContext(TotalContext) as TotalContextProps;
  const {overall_dashboard54180, setoverall_dashboard54180}= useContext(TotalContext) as TotalContextProps;
  const {overall_dashboard54180Props, setoverall_dashboard54180Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_total_transactionse00c2, setgrp_total_transactionse00c2}= useContext(TotalContext) as TotalContextProps;
  const {grp_total_transactionse00c2Props, setgrp_total_transactionse00c2Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_initiated2f421, setgrp_prn_initiated2f421}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_initiated2f421Props, setgrp_prn_initiated2f421Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_approvedb95cb, setgrp_prn_approvedb95cb}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_approvedb95cbProps, setgrp_prn_approvedb95cbProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_pendingfe0e2, setgrp_credit_pendingfe0e2}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_pendingfe0e2Props, setgrp_credit_pendingfe0e2Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_approved7e3bd, setgrp_credit_approved7e3bd}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_approved7e3bdProps, setgrp_credit_approved7e3bdProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_payment_completed34dec, setgrp_payment_completed34dec}= useContext(TotalContext) as TotalContextProps;
  const {grp_payment_completed34decProps, setgrp_payment_completed34decProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_bar_chart02e16, setgrp_bar_chart02e16}= useContext(TotalContext) as TotalContextProps;
  const {grp_bar_chart02e16Props, setgrp_bar_chart02e16Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_pie_chart2415d, setgrp_pie_chart2415d}= useContext(TotalContext) as TotalContextProps;
  const {grp_pie_chart2415dProps, setgrp_pie_chart2415dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[tran_text6efd4?.refresh])

  if (tran_text6efd4?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 5`,gridRow: `1 / 10`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="header-1"
  color="primary"
>
      {keyset("Transaction Overview")}
</Text>
  </div>
  )
}

export default Texttran_text
