'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { Text } from "@/components/Text";
import { Tooltip } from '@/components/Tooltip';
import { codeExecution } from '@/app/utils/codeExecution'
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Imageimage =  ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [allCode,setAllCode]=useState<any>("");
  let value = "";  
 /////////////
  //another screen
  const {backgorunde9308, setbackgorunde9308}= useContext(TotalContext) as TotalContextProps;
  const {backgorunde9308Props, setbackgorunde9308Props}= useContext(TotalContext) as TotalContextProps;
  const {first3cbfd, setfirst3cbfd}= useContext(TotalContext) as TotalContextProps;
  const {image7e984, setimage7e984}= useContext(TotalContext) as TotalContextProps;
  const {secondd89c4, setsecondd89c4}= useContext(TotalContext) as TotalContextProps;
  const {third76d18, setthird76d18}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8a, setbackground10bc8a}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8aProps, setbackground10bc8aProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  if(backgorunde9308?.image){ 
  value = `${backgorunde9308?.image}`;
  } else {
  value = `${process.env.NEXT_PUBLIC_FTP_OUTPUT_HOST}https://dev.gsstvl.com/wp-content/uploads/2025/11/Banknote-amico.svg`;
  }

  const handleCode=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Veracious:AFVK:v1",  componentId:"a1762804fecf4c11a9bf912a71be9308",controlId:"01922e03170f40eb8abcd7ad63c7e984",isTable:false,accessProfile:accessProfile,from:"image"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code == '') {
      //toast(code?.message, 'danger')
      //return
    }  else if (code != '') {
        let codeStates: any = {}
            codeStates['backgorund']  = backgorunde9308,
            codeStates['setbackgorund'] = setbackgorunde9308,
            codeStates['background1']  = background10bc8a,
            codeStates['setbackground1'] = setbackground10bc8a,
      codeExecution(code,codeStates)
    }
  }

  useEffect(() => {
    setbackgorunde9308((pre:any)=>({...pre,image:""}));
    handleCode()
  }, [image7e984?.refresh])

  if (image7e984?.isHidden) {
    return <></>
  } 

  return (
    <div className=" " 
      style={{gridColumn: `9 / 12`,gridRow: `31 / 101`, gap:``, height: `100%`, overflow: 'auto'}}>
        {
          value ? (
  <img src={value} alt="no image found" 
       style={{
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--brand-color)'
              }} />
) : <img  alt="no image found"
      style={{
                borderRadius: 'var(--border-radius)',
                 border: '2px solid var(--brand-color)'
              }} />
        }
  </div>
  )
}

export default Imageimage
