'use client'


import React, { useContext,useEffect } from 'react';
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import i18n from '@/app/components/i18n';

const Textitaxst_id = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const token: string = getCookie('token')
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
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
  const {viewed_details_grp73f21, setviewed_details_grp73f21}= useContext(TotalContext) as TotalContextProps;
  const {viewed_details_grp73f21Props, setviewed_details_grp73f21Props}= useContext(TotalContext) as TotalContextProps;
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
  const {prn_no_details_tablefc106, setprn_no_details_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_details_tablefc106Props, setprn_no_details_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
    try{
      if ("hasLogicCenter" in dfd_itax_source_tran_dfd_v1Props && !dfd_itax_source_tran_dfd_v1Props.hasLogicCenter) {
        const api_paginationData: any = await AxiosService.post('/UF/pagination',
          {
            key: dfd_itax_source_tran_dfd_v1Props.dstKey,
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
        setviewed_details_grp73f21((pre: any) => {
          return { ...pre, itaxst_id: api_paginationData.data.records[0]?.itaxst_id }
        })
        }
      }
      else{
      if(Array.isArray(dfd_itax_source_tran_dfd_v1Props) && dfd_itax_source_tran_dfd_v1Props && !viewed_details_grp73f21.itaxst_id){
        setviewed_details_grp73f21((pre:any)=>({...pre,itaxst_id:dfd_itax_source_tran_dfd_v1Props[0]?.itaxst_id}));
      }
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[itaxst_id1d5bd?.refresh])

  useEffect(() => {
  if(Array.isArray(dfd_itax_source_tran_dfd_v1Props) && !viewed_details_grp73f21.itaxst_id){
    setviewed_details_grp73f21((pre:any)=>({...pre,itaxst_id:dfd_itax_source_tran_dfd_v1Props[0]?.itaxst_id}));
  }
  },[dfd_itax_source_tran_dfd_v1Props])

  if (itaxst_id1d5bd?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `20 / 25`,gridRow: `1 / 9`, gap:``, height: `100%`}} >
<Text
  contentAlign={"center"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {keyset(isDynamic ? item?.itaxst_id : (viewed_details_grp73f21?.itaxst_id || ""))}
</Text>
  </div>
  )
}

export default Textitaxst_id
