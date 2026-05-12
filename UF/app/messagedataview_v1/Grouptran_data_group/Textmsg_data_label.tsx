'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textmsg_data_label = ({encryptionFlagCompData,isDynamic,item,index,setIsProcessing}:any) => {
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
  const {tran_data_group84f25, settran_data_group84f25}= useContext(TotalContext) as TotalContextProps;
  const {tran_data_group84f25Props, settran_data_group84f25Props}= useContext(TotalContext) as TotalContextProps;
  const {msg_data_label7b760, setmsg_data_label7b760}= useContext(TotalContext) as TotalContextProps;
  const {divider_topf46a0, setdivider_topf46a0}= useContext(TotalContext) as TotalContextProps;
  const {xmlviewer9fe8d, setxmlviewer9fe8d}= useContext(TotalContext) as TotalContextProps;
  const {divider_bottom6920d, setdivider_bottom6920d}= useContext(TotalContext) as TotalContextProps;
  const {cancel_btn5e840, setcancel_btn5e840}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[msg_data_label7b760?.refresh])

  if (msg_data_label7b760?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 13`,gridRow: `1 / 9`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {keyset("Message Data")}
</Text>
  </div>
  )
}

export default Textmsg_data_label
