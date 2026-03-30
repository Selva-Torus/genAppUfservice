'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texttax_payers_name_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {view_detail_group73f21, setview_detail_group73f21}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21Props, setview_detail_group73f21Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_label348d7, setprn_label348d7}= useContext(TotalContext) as TotalContextProps;
  const {eslip_no1e386, seteslip_no1e386}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id1d5bd, setitaxst_id1d5bd}= useContext(TotalContext) as TotalContextProps;
  const {eslip_details567e2, seteslip_details567e2}= useContext(TotalContext) as TotalContextProps;
  const {prn_status_labele7b20, setprn_status_labele7b20}= useContext(TotalContext) as TotalContextProps;
  const {pin_label660ea, setpin_label660ea}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name_label86492, settax_payers_name_label86492}= useContext(TotalContext) as TotalContextProps;
  const {prn_status83532, setprn_status83532}= useContext(TotalContext) as TotalContextProps;
  const {pin7c9eb, setpin7c9eb}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name38781, settax_payers_name38781}= useContext(TotalContext) as TotalContextProps;
  const {prn_amount_labela6563, setprn_amount_labela6563}= useContext(TotalContext) as TotalContextProps;
  const {currency_label786a3, setcurrency_label786a3}= useContext(TotalContext) as TotalContextProps;
  const {prn_reg_date_labelf0c46, setprn_reg_date_labelf0c46}= useContext(TotalContext) as TotalContextProps;
  const {prn_amountd22c3, setprn_amountd22c3}= useContext(TotalContext) as TotalContextProps;
  const {currency1ef9b, setcurrency1ef9b}= useContext(TotalContext) as TotalContextProps;
  const {prn_registration_date67d15, setprn_registration_date67d15}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106, setprn_no_datails_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[tax_payers_name_label86492?.refresh])

  if (tax_payers_name_label86492?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `17 / 25`,gridRow: `23 / 33`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-2"
  color="primary"
>
      {keyset("Taxpayer Name")}
</Text>
  </div>
  )
}

export default Texttax_payers_name_label
