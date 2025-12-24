'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Textfirst = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
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

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[first3cbfd?.refresh])

  if (first3cbfd?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 4`,gridRow: `31 / 60`,gap:``, height: `100%`, overflow: 'auto'}} >
    <Text 
      className=""
      variant ="display-2"
      color ="primary"
    >
    Veracious Electronic Fund Transfer Debit .
    </Text>
  </div>
  )
}

export default Textfirst
