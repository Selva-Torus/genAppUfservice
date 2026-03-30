'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texterror_description_label = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {view_error_detail_group21845, setview_error_detail_group21845}= useContext(TotalContext) as TotalContextProps;
  const {view_error_detail_group21845Props, setview_error_detail_group21845Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_category_label7a433, settran_category_label7a433}= useContext(TotalContext) as TotalContextProps;
  const {error_cateogry_label0e2f6, seterror_cateogry_label0e2f6}= useContext(TotalContext) as TotalContextProps;
  const {tran_category15644, settran_category15644}= useContext(TotalContext) as TotalContextProps;
  const {error_cateogryebc09, seterror_cateogryebc09}= useContext(TotalContext) as TotalContextProps;
  const {error_code_labeld6aa7, seterror_code_labeld6aa7}= useContext(TotalContext) as TotalContextProps;
  const {error_description_labelbc214, seterror_description_labelbc214}= useContext(TotalContext) as TotalContextProps;
  const {error_codeba00c, seterror_codeba00c}= useContext(TotalContext) as TotalContextProps;
  const {error_description64756, seterror_description64756}= useContext(TotalContext) as TotalContextProps;
  const {view_error_detaild4c71, setview_error_detaild4c71}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[error_description_labelbc214?.refresh])

  if (error_description_labelbc214?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `13 / 25`,gridRow: `22 / 32`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {keyset("Error Description")}
</Text>
  </div>
  )
}

export default Texterror_description_label
