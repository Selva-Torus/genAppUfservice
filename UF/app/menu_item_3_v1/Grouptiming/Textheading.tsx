'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Textheading = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
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
  const {heading75dc3, setheading75dc3}= useContext(TotalContext) as TotalContextProps;
  const {time9390a, settime9390a}= useContext(TotalContext) as TotalContextProps;
  const {3397a, set3397a}= useContext(TotalContext) as TotalContextProps;
  const {e1f94, sete1f94}= useContext(TotalContext) as TotalContextProps;
  const {e12a2, sete12a2}= useContext(TotalContext) as TotalContextProps;
  const {4bb52, set4bb52}= useContext(TotalContext) as TotalContextProps;
  const {fd884, setfd884}= useContext(TotalContext) as TotalContextProps;
  const {e15cb, sete15cb}= useContext(TotalContext) as TotalContextProps;
  const {1133f, set1133f}= useContext(TotalContext) as TotalContextProps;
  const {e08fa, sete08fa}= useContext(TotalContext) as TotalContextProps;
  const {42b30, set42b30}= useContext(TotalContext) as TotalContextProps;
  const {b585c, setb585c}= useContext(TotalContext) as TotalContextProps;
  const {e6208, sete6208}= useContext(TotalContext) as TotalContextProps;
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[heading75dc3?.refresh])

  if (heading75dc3?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `1 / 8`,gridRow: `9 / 22`,gap:``, height: `100%`, overflow: 'auto'}} >
    <Text 
      className=""
      variant ="display-1"
      color ="primary"
    >
    {isDynamic ? item?.heading : (timing0cafc?.heading || "")}
    </Text>
  </div>
  )
}

export default Textheading
