
'use client'
import React, { useContext, useEffect,useState } from 'react'  
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import DocumentUploader from '@/components/DocumentUploader';
import { codeExecution } from '@/app/utils/codeExecution';
import i18n from '@/app/components/i18n';
import { Text } from '@/components/Text';

const Documentuploadercsdcsdcsd = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {
  const token: string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("");
  let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupaaf24,
      codeStates['setgroup'] = setgroupaaf24,
      codeStates['group']  = group7bc2c,
      codeStates['setgroup'] = setgroup7bc2c,
      customCode = codeExecution(code,codeStates);
    }
  }

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixUF:AFVK:v1",
          componentId: "02640bc58ee74454a88bcb3c267aaf24",
          controlId: "05b7fa18f8d943f78d7163932cf4b217",
          isTable: false,
          from:"Buttondcsdsdc",
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
    }catch(err){
        console.log(err);
    }
  }
  useEffect(()=>{
    handleMapper();
  },[])
  const keyset: any = i18n.keyset('language');
   /////////////
   //another screen
  const {groupaaf24, setgroupaaf24}= useContext(TotalContext) as TotalContextProps;
  const {groupaaf24Props, setgroupaaf24Props}= useContext(TotalContext) as TotalContextProps;
  const {addd6f6de, setaddd6f6de}= useContext(TotalContext) as TotalContextProps;
  const {wefdwfds735d5, setwefdwfds735d5}= useContext(TotalContext) as TotalContextProps;
  const {group7bc2c, setgroup7bc2c}= useContext(TotalContext) as TotalContextProps;
  const {group7bc2cProps, setgroup7bc2cProps}= useContext(TotalContext) as TotalContextProps;
  const {dfdsfdsb8f34, setdfdsfdsb8f34}= useContext(TotalContext) as TotalContextProps;
  const {csdcsdcsd4b217, setcsdcsdcsd4b217}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleClick = async (file:any) => {
    setgroupaaf24((prev: any) => ({ ...prev, csdcsdcsd: file }))
      handleCustomCode()
    }

  if (csdcsdcsd4b217?.isHidden) {
    return <></>
  }

  return (
    <div   
      style={{gridColumn: `3 / 5`,gridRow: `53 / 63`, gap:``, height: `100%`, overflow: 'auto'}} >
      <DocumentUploader
        className=""
        id="csdcsdcsd4b217"
        value={groupaaf24.csdcsdcsd}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1 // 1MB
        }}
        onChange={handleClick}
        preview={true}
        draggable={true}
        singleSelect={false}
        viewType="modal"
        DbType={"DB"}
        enableEncryption={""}
        fileNamingPreference={"use_system_generated_name"}
      />
    </div>
  )
}

export default Documentuploadercsdcsdcsd





