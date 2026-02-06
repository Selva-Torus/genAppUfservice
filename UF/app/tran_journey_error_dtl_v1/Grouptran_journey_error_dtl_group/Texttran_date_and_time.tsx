'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";

const Texttran_date_and_time = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {tran_journey_error_dtl_grouped0e7, settran_journey_error_dtl_grouped0e7}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_error_dtl_grouped0e7Props, settran_journey_error_dtl_grouped0e7Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_date_and_timec7376, settran_date_and_timec7376}= useContext(TotalContext) as TotalContextProps;
  const {tran_status9ed8a, settran_status9ed8a}= useContext(TotalContext) as TotalContextProps;
  const {trs_created_datee861b, settrs_created_datee861b}= useContext(TotalContext) as TotalContextProps;
  const {failuer_process_codee5490, setfailuer_process_codee5490}= useContext(TotalContext) as TotalContextProps;
  const {tran_process92d9c, settran_process92d9c}= useContext(TotalContext) as TotalContextProps;
  const {product_code6692d, setproduct_code6692d}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data9b55f, setview_msg_data9b55f}= useContext(TotalContext) as TotalContextProps;
  const {request_data9aa32, setrequest_data9aa32}= useContext(TotalContext) as TotalContextProps;
  const {response_data39796, setresponse_data39796}= useContext(TotalContext) as TotalContextProps;
  const {tran_log_data1b428, settran_log_data1b428}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[tran_date_and_timec7376?.refresh])

  if (tran_date_and_timec7376?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `2 / 13`,gridRow: `25 / 35`, gap:``, height: `100%`}} >
<Text
  contentAlign={"center"}
  className=""
  variant="subheader-3"
  color="primary"
>
      Transaction Date &amp; Time
</Text>
  </div>
  )
}

export default Texttran_date_and_time
