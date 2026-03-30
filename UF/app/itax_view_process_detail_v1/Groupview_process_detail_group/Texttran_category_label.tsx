'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texttran_category_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {view_process_detail_groupe7fe3, setview_process_detail_groupe7fe3}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detail_groupe7fe3Props, setview_process_detail_groupe7fe3Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_category_label4bfef, settran_category_label4bfef}= useContext(TotalContext) as TotalContextProps;
  const {processing_system_labele6ddd, setprocessing_system_labele6ddd}= useContext(TotalContext) as TotalContextProps;
  const {tran_categorycab42, settran_categorycab42}= useContext(TotalContext) as TotalContextProps;
  const {processing_systemcd502, setprocessing_systemcd502}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detailf4139, setview_process_detailf4139}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[tran_category_label4bfef?.refresh])

  if (tran_category_label4bfef?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 13`,gridRow: `1 / 11`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {keyset("Tran Category")}
</Text>
  </div>
  )
}

export default Texttran_category_label
