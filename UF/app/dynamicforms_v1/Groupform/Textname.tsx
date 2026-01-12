'use client'


import React, { useContext,useEffect } from 'react' 
import { Text } from '@/components/Text';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'

const Textname = ({encryptionFlagCompData,isDynamic,item,index}:any) => {
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {name228ad, setname228ad}= useContext(TotalContext) as TotalContextProps;
  const {child6747b, setchild6747b}= useContext(TotalContext) as TotalContextProps;
  const {child6747bProps, setchild6747bProps}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const handleMapperValue=async()=>{
  }

  useEffect(()=>{
    handleMapperValue()
  },[name228ad?.refresh])

  if (name228ad?.isHidden) {
    return <></>
  }

return (
  <div className="" style={{gridColumn: `4 / 20`,gridRow: `3 / 13`, gap:``, height: `100%`}} >
<Text
  contentAlign={"center"}
  className=""
  variant="subheader-3"
  color="primary"
>
      {isDynamic ? item?.name : (form775ce?.name || "")}
</Text>
  </div>
  )
}

export default Textname
