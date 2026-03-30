'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Texterror_cateogry = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const token: string = getCookie('token')
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_tran_error_log_dfd_v1Props, setdfd_itax_tran_error_log_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
    try{
      if ("hasLogicCenter" in dfd_itax_tran_error_log_dfd_v1Props && !dfd_itax_tran_error_log_dfd_v1Props.hasLogicCenter) {
        const api_paginationData: any = await AxiosService.post('/UF/pagination',
          {
            key: dfd_itax_tran_error_log_dfd_v1Props.dstKey,
            page: 1,
            count: 1
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if(api_paginationData.data.records?.length){
        setview_error_detail_group21845((pre: any) => {
          return { ...pre, error_cateogry: api_paginationData.data.records[0]?.error_cateogry }
        })
        }
      }
      else{
      if(Array.isArray(dfd_itax_tran_error_log_dfd_v1Props) && dfd_itax_tran_error_log_dfd_v1Props && !view_error_detail_group21845.error_cateogry){
        setview_error_detail_group21845((pre:any)=>({...pre,error_cateogry:dfd_itax_tran_error_log_dfd_v1Props[0]?.error_cateogry}));
      }
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[error_cateogryebc09?.refresh])

  useEffect(() => {
  if(Array.isArray(dfd_itax_tran_error_log_dfd_v1Props) && !view_error_detail_group21845.error_cateogry){
    setview_error_detail_group21845((pre:any)=>({...pre,error_cateogry:dfd_itax_tran_error_log_dfd_v1Props[0]?.error_cateogry}));
  }
  },[dfd_itax_tran_error_log_dfd_v1Props])

  if (error_cateogryebc09?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `13 / 25`,gridRow: `11 / 21`, gap:``, height: `100%`}} >
<Text
  contentAlign={"left"}
  className=""
  variant="subheader-2"
  color="primary"
>
      {keyset(isDynamic ? item?.error_cateogry : (view_error_detail_group21845?.error_cateogry || ""))}
</Text>
  </div>
  )
}

export default Texterror_cateogry
