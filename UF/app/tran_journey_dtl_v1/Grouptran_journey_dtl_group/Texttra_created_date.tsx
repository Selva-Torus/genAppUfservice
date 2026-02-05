'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";

const Texttra_created_date = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {dfd_tran_journey_dtl_v1Props, setdfd_tran_journey_dtl_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {tran_journey_dtl_group6545a, settran_journey_dtl_group6545a}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_dtl_group6545aProps, settran_journey_dtl_group6545aProps}= useContext(TotalContext) as TotalContextProps;
  const {tran_date_and_timebba58, settran_date_and_timebba58}= useContext(TotalContext) as TotalContextProps;
  const {tran_status9b4c1, settran_status9b4c1}= useContext(TotalContext) as TotalContextProps;
  const {tra_created_date34aa7, settra_created_date34aa7}= useContext(TotalContext) as TotalContextProps;
  const {failuer_process_code981ea, setfailuer_process_code981ea}= useContext(TotalContext) as TotalContextProps;
  const {tran_process55ab3, settran_process55ab3}= useContext(TotalContext) as TotalContextProps;
  const {product_code36b37, setproduct_code36b37}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data387c6, setview_msg_data387c6}= useContext(TotalContext) as TotalContextProps;
  const {view_tran_log83071, setview_tran_log83071}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      if(Array.isArray(dfd_tran_journey_dtl_v1Props) && dfd_tran_journey_dtl_v1Props){
        settran_journey_dtl_group6545a((pre:any)=>({...pre,trs_created_date:dfd_tran_journey_dtl_v1Props[0]?.trs_created_date}));
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[tra_created_date34aa7?.refresh])

  useEffect(() => {
  if(Array.isArray(dfd_tran_journey_dtl_v1Props)){
    settran_journey_dtl_group6545a((pre:any)=>({...pre,trs_created_date:dfd_tran_journey_dtl_v1Props[0]?.trs_created_date}));
  }
  },[dfd_tran_journey_dtl_v1Props])

  if (tra_created_date34aa7?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `2 / 13`,gridRow: `36 / 58`, gap:``, height: `100%`}} >
<Text
  contentAlign={"center"}
  className=""
  variant="code-inline-3"
  color="primary"
>
      {isDynamic ? item?.trs_created_date : (tran_journey_dtl_group6545a?.trs_created_date || "")}
</Text>
  </div>
  )
}

export default Texttra_created_date
