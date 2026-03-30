
'use client'
import React, { useContext, useEffect,useState } from 'react'  
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import DocumentUploader from '@/components/DocumentUploader';
import { codeExecution } from '@/app/utils/codeExecution';
import i18n from '@/app/components/i18n';
import { Text } from '@/components/Text';

const Documentuploadermemo_documentuploader = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [uploaderType,setUploaderType]=useState<string>("string");
  const [allCode,setAllCode]=useState<any>("");
  let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
      codeStates['new_prn_main_group']  = new_prn_main_group21910,
      codeStates['setnew_prn_main_group'] = setnew_prn_main_group21910,
      customCode = codeExecution(code,codeStates);
    }
  }

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1",
          componentId: "f1099583e1124434b28d0c4b0be21910",
          controlId: "215bb82121c04923889c2305a4051a64",
          isTable: false,
          from:"Button",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
      setUploaderType(orchestrationData?.data?.dataType)
    }catch(err){
        console.log(err);
    }
  }
  useEffect(()=>{
    handleMapper();
  },[])
  const keyset: any = i18n.keyset('language');
  const singleSelect = uploaderType === "string[]" ? false : true;
   /////////////
   //another screen
  const {new_prn_main_group21910, setnew_prn_main_group21910}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910Props, setnew_prn_main_group21910Props}= useContext(TotalContext) as TotalContextProps;
  const {transaction_details_label6f776, settransaction_details_label6f776}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id19a2c, setitaxst_id19a2c}= useContext(TotalContext) as TotalContextProps;
  const {prnno_label2284a, setprnno_label2284a}= useContext(TotalContext) as TotalContextProps;
  const {eslip_noe1f20, seteslip_noe1f20}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labela8526, setpayment_type_labela8526}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdown5d344, setpayment_type_dropdown5d344}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label99095, setdebit_account_no_label99095}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no9ec5d, setdebit_account_no9ec5d}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_full_name_labeld7111, settax_payers_full_name_labeld7111}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name8bf4d, settax_payer_full_name8bf4d}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_label46f0a, setdebit_amount_label46f0a}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountbbf1f, setdebit_amountbbf1f}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt_labeleacfe, setloan_amt_labeleacfe}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt3440e, setloan_amt3440e}= useContext(TotalContext) as TotalContextProps;
  const {auth_memo_labelf0a0e, setauth_memo_labelf0a0e}= useContext(TotalContext) as TotalContextProps;
  const {filename4f410, setfilename4f410}= useContext(TotalContext) as TotalContextProps;
  const {memo_documentuploader51a64, setmemo_documentuploader51a64}= useContext(TotalContext) as TotalContextProps;
  const {clear14cbd, setclear14cbd}= useContext(TotalContext) as TotalContextProps;
  const {submitc9c9c, setsubmitc9c9c}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleClick = async (file:any) => {
    setnew_prn_main_group21910((prev: any) => ({ ...prev, memo_documentuploader: file }))
          let fileNames: any = [];
          for (let l = 0; l < file.length; l++) {
            fileNames.push(file[l].file.name)
          }
    setnew_prn_main_group21910((prev: any) => ({ ...prev, filename: fileNames.join(",") }));
      handleCustomCode()
    }

  if (memo_documentuploader51a64?.isHidden) {
    return <></>
  }

  return (
    <div   
      style={{gridColumn: `1 / 25`,gridRow: `88 / 145`, gap:``, height: `100%`, overflow: 'auto'}} >
      <DocumentUploader
        className=""
        id="memo_documentuploader51a64"
        value={new_prn_main_group21910?.memo_documentuploader}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1 // 1MB
        }}
        contentAlign={"center"}
        onChange={handleClick}
        preview={true}
        draggable={true}
        singleSelect={singleSelect}
        disabled= {memo_documentuploader51a64?.isDisabled ? true : false}
        viewType="onScreen"
        DbType={"mongodb"}
        enableEncryption={""}
        fileNamingPreference={"keep_original_file_name"}
      />
    </div>
  )
}

export default Documentuploadermemo_documentuploader





