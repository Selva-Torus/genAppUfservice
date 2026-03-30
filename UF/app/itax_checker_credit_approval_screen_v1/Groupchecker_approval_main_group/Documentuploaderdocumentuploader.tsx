
'use client'
import React, { useContext, useEffect,useState } from 'react'  
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import DocumentUploader from '@/components/DocumentUploader';
import { codeExecution } from '@/app/utils/codeExecution';
import i18n from '@/app/components/i18n';
import { Text } from '@/components/Text';

const Documentuploaderdocumentuploader = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [uploaderType,setUploaderType]=useState<string>("string");
  const [allCode,setAllCode]=useState<any>("");
  let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
      codeStates['checker_approval_main_group']  = checker_approval_main_groupff981,
      codeStates['setchecker_approval_main_group'] = setchecker_approval_main_groupff981,
      customCode = codeExecution(code,codeStates);
    }
  }

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Checker_Credit_Approval_Screen:AFVK:v1",
          componentId: "69e68eaa0404477da2d103ecf51ff981",
          controlId: "c4e64851465647ccac06876526168dcb",
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
  const {checker_approval_main_groupff981, setchecker_approval_main_groupff981}= useContext(TotalContext) as TotalContextProps;
  const {checker_approval_main_groupff981Props, setchecker_approval_main_groupff981Props}= useContext(TotalContext) as TotalContextProps;
  const {upload_file_label93f14, setupload_file_label93f14}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_ida5acc, setitaxst_ida5acc}= useContext(TotalContext) as TotalContextProps;
  const {documentuploader68dcb, setdocumentuploader68dcb}= useContext(TotalContext) as TotalContextProps;
  const {file_name456cb, setfile_name456cb}= useContext(TotalContext) as TotalContextProps;
  const {cancel68e13, setcancel68e13}= useContext(TotalContext) as TotalContextProps;
  const {credit_approve89f9a, setcredit_approve89f9a}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleClick = async (file:any) => {
    setchecker_approval_main_groupff981((prev: any) => ({ ...prev, documentuploader: file }))
          let fileNames: any = [];
          for (let l = 0; l < file.length; l++) {
            fileNames.push(file[l].file.name)
          }
    setchecker_approval_main_groupff981((prev: any) => ({ ...prev, file_name: fileNames.join(",") }));
      handleCustomCode()
    }

  if (documentuploader68dcb?.isHidden) {
    return <></>
  }

  return (
    <div   
      style={{gridColumn: `1 / 25`,gridRow: `10 / 62`, gap:``, height: `100%`, overflow: 'auto'}} >
      <DocumentUploader
        className=""
        id="documentuploader68dcb"
        value={checker_approval_main_groupff981?.documentuploader}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1 // 1MB
        }}
        contentAlign={"center"}
        onChange={handleClick}
        preview={true}
        draggable={true}
        singleSelect={singleSelect}
        disabled= {documentuploader68dcb?.isDisabled ? true : false}
        viewType="onScreen"
        DbType={"mongodb"}
        enableEncryption={""}
        fileNamingPreference={"use_system_generated_name"}
      />
    </div>
  )
}

export default Documentuploaderdocumentuploader





