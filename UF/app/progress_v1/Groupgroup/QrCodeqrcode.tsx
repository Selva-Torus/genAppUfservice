'use client'
import { useContext,useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { CommonHeaderAndTooltip } from "@/components/CommonHeaderAndTooltip";

const QrCodeqrcode =  ({checkToAdd,setCheckToAdd}:any) => {
  const token:string = getCookie('token');
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
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

  if (qrcode1c711?.isHidden) {
    return <></>
  } 
  return (
    <div 
      className="top " 
      style={{gridColumn: `19 / 23`,gridRow: `13 / 74`, gap:``, height: `100%`, objectFit: 'contain'}} >     
    <CommonHeaderAndTooltip
        needTooltip={true}  
        tooltipProps={{title:"test",placement:"bottom-start"}}
        headerPosition='top'
        headerText="header"
 >
    <QRCodeSVG 
      className=""
      style={{height: '100%', width: '100%'}}
      value={groupbffe9?.qrcode?`${groupbffe9?.qrcode}`:`hari`}

    />
    </CommonHeaderAndTooltip>
  </div>
  )
}

export default QrCodeqrcode
