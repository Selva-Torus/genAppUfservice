'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textslip_payment_code_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {authorization_memo_file_group17228, setauthorization_memo_file_group17228}= useContext(TotalContext) as TotalContextProps;
  const {authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fb, setdocumentviewer_group0a3fb}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_label62fcb, setprn_no_label62fcb}= useContext(TotalContext) as TotalContextProps;
  const {esip_no6f361, setesip_no6f361}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code_labelba3fe, setslip_payment_code_labelba3fe}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code983fc, setslip_payment_code983fc}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_date_label0a7cd, setpayment_advice_date_label0a7cd}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_datefb2ad, setpayment_advice_datefb2ad}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pin_label532eb, settax_payer_pin_label532eb}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pin2328b, settax_payer_pin2328b}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name_label0ed9c, settax_payer_full_name_label0ed9c}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_namef6644, settax_payer_full_namef6644}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_idd3e56, setitaxst_idd3e56}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335, setapplication_group16335}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335Props, setapplication_group16335Props}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4, setapplication_tab_groupf82f4}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3, setapprove1c1d3}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3Props, setapprove1c1d3Props}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9, setapprove_tableafbb9}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9Props, setapprove_tableafbb9Props}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480, setreason_group39480}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480Props, setreason_group39480Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[slip_payment_code_labelba3fe?.refresh])

  if (slip_payment_code_labelba3fe?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 13`,gridRow: `13 / 23`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {keyset("Slip Payment Code")}
</Text>
  </div>
  )
}

export default Textslip_payment_code_label
