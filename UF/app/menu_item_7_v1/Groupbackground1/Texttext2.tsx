'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Texttext2 = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  },[text285d97?.refresh])

  if (text285d97?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `4 / 6`,gridRow: `140 / 178`,gap:``, height: `100%`, overflow: 'auto'}} >
    <Text 
      className=""
      variant ="subheader-3"
      color ="primary"
    >
    Automates data pull from corporate systems using rule-based and holiday-aware schedules. 
    </Text>
  </div>
  )
}

export default Texttext2
