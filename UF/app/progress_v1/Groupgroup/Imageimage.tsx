'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { Text } from "@/components/Text";
import { Image } from '@/components/Image';
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
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  if(groupbffe9?.image){ 
  value = `${groupbffe9?.image}`;
  } else {
  value = `${process.env.NEXT_PUBLIC_FTP_OUTPUT_HOST}/torus/9.1/resources/icons/clipboard-add-svgrepo-com.svg`;
  }

  const handleCode=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",  componentId:"7a5f6e1c8f4f4801b28383ae87fbffe9",controlId:"15059e0004264577bd76feb58603343d",isTable:false,accessProfile:accessProfile,from:"imageimage"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code == '') {
      //toast(code?.message, 'danger')
      //return
    }  else if (code != '') {
        let codeStates: any = {}
            codeStates['group']  = groupbffe9,
            codeStates['setgroup'] = setgroupbffe9,
            codeStates['usertable']  = usertable8d993,
            codeStates['setusertable'] = setusertable8d993,
            codeStates['usertable2']  = usertable2b6e16,
            codeStates['setusertable2'] = setusertable2b6e16,
      codeExecution(code,codeStates)
    }
  }

  useEffect(() => {
    setgroupbffe9((pre:any)=>({...pre,image:""}));
    handleCode()
  }, [image3343d?.refresh])

  if (image3343d?.isHidden) {
    return <></>
  } 

  return (
    <div className="  right" 
      style={{gridColumn: `16 / 23`,gridRow: `300 / 363`, gap:``, height: `100%`}}>
      <Image url={value} alt="no image found" 
      needTooltip={true}  
      tooltipProps={{title:"tool",placement:"top-end"}}
      contentAlign = 'center'
      headerText = "header"
      headerPosition = "right"
      />
  </div>
  )
}

export default Imageimage
