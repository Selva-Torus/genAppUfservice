'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";

const Textproduct_code = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {dfd_tran_journey_dtl_v1Props, setdfd_tran_journey_dtl_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
    try{
      if(Array.isArray(dfd_tran_journey_dtl_v1Props) && dfd_tran_journey_dtl_v1Props){
        settran_journey_error_dtl_grouped0e7((pre:any)=>({...pre,product_code:dfd_tran_journey_dtl_v1Props[0]?.product_code}));
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[product_code6692d?.refresh])

  useEffect(() => {
  if(Array.isArray(dfd_tran_journey_dtl_v1Props)){
    settran_journey_error_dtl_grouped0e7((pre:any)=>({...pre,product_code:dfd_tran_journey_dtl_v1Props[0]?.product_code}));
  }
  },[dfd_tran_journey_dtl_v1Props])

  if (product_code6692d?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `2 / 13`,gridRow: `73 / 96`, gap:``, height: `100%`}} >
<Text
  contentAlign={"center"}
  className=""
  variant="code-inline-3"
  color="primary"
>
      {isDynamic ? item?.product_code : (tran_journey_error_dtl_grouped0e7?.product_code || "")}
</Text>
  </div>
  )
}

export default Textproduct_code
