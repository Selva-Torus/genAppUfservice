'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Textfour = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {background10bc8a, setbackground10bc8a}= useContext(TotalContext) as TotalContextProps;
  const {background10bc8aProps, setbackground10bc8aProps}= useContext(TotalContext) as TotalContextProps;
  const {thirde7680, setthirde7680}= useContext(TotalContext) as TotalContextProps;
  const {four05c92, setfour05c92}= useContext(TotalContext) as TotalContextProps;
  const {icon190895, seticon190895}= useContext(TotalContext) as TotalContextProps;
  const {icon2398a3, seticon2398a3}= useContext(TotalContext) as TotalContextProps;
  const {icon379355, seticon379355}= useContext(TotalContext) as TotalContextProps;
  const {icon4c9c0e, seticon4c9c0e}= useContext(TotalContext) as TotalContextProps;
  const {text285d97, settext285d97}= useContext(TotalContext) as TotalContextProps;
  const {text16d8c2, settext16d8c2}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[four05c92?.refresh])

  if (four05c92?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 8`,gridRow: `32 / 86`,gap:``, height: `100%`, overflow: 'auto'}} >
    <Text 
      className=""
      variant ="header-1"
      color ="primary"
    >
    The EFT Debits module automates the debit-side of electronic fund transfers, particularly focusing on pull-based transactions from corporate accounts. It enables rule-driven scheduling, validation, and seamless integration with core banking systems, ensuring reliable and timely debiting of customer accounts. The module supports holiday-aware processing, error handling, and compliance with transaction regulations. 
    </Text>
  </div>
  )
}

export default Textfour
