'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Texttext = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {cf46a, setcf46a}= useContext(TotalContext) as TotalContextProps;
  const {cf46aProps, setcf46aProps}= useContext(TotalContext) as TotalContextProps;
  const {4f7b1, set4f7b1}= useContext(TotalContext) as TotalContextProps;
  const {4f7b1Props, set4f7b1Props}= useContext(TotalContext) as TotalContextProps;
  const {search676ad, setsearch676ad}= useContext(TotalContext) as TotalContextProps;
  const {search676adProps, setsearch676adProps}= useContext(TotalContext) as TotalContextProps;
  const {7bc34, set7bc34}= useContext(TotalContext) as TotalContextProps;
  const {textdcf14, settextdcf14}= useContext(TotalContext) as TotalContextProps;
  const {8394d, set8394d}= useContext(TotalContext) as TotalContextProps;
  const {8394dProps, set8394dProps}= useContext(TotalContext) as TotalContextProps;
  const {cardbb124, setcardbb124}= useContext(TotalContext) as TotalContextProps;
  const {cardbb124Props, setcardbb124Props}= useContext(TotalContext) as TotalContextProps;
  const {card4d75a4, setcard4d75a4}= useContext(TotalContext) as TotalContextProps;
  const {card4d75a4Props, setcard4d75a4Props}= useContext(TotalContext) as TotalContextProps;
  const {card108d97, setcard108d97}= useContext(TotalContext) as TotalContextProps;
  const {card108d97Props, setcard108d97Props}= useContext(TotalContext) as TotalContextProps;
  const {card23ac19, setcard23ac19}= useContext(TotalContext) as TotalContextProps;
  const {card23ac19Props, setcard23ac19Props}= useContext(TotalContext) as TotalContextProps;
  const {card393c35, setcard393c35}= useContext(TotalContext) as TotalContextProps;
  const {card393c35Props, setcard393c35Props}= useContext(TotalContext) as TotalContextProps;
  const {timing0cafc, settiming0cafc}= useContext(TotalContext) as TotalContextProps;
  const {timing0cafcProps, settiming0cafcProps}= useContext(TotalContext) as TotalContextProps;
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[textdcf14?.refresh])

  if (textdcf14?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `3 / 7`,gridRow: `3 / 13`,gap:``, height: `100%`, overflow: 'auto'}} >
    <Text 
      className=""
      variant ="subheader-3"
      color ="primary"
    >
    {isDynamic ? item?.text : (search676ad?.text || "")}
    </Text>
  </div>
  )
}

export default Texttext
