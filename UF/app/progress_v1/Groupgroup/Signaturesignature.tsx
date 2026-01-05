'use client'
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Signature, SignatureRef } from '@/components/Signature';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import i18n from '@/app/components/i18n';

const Signaturesignature = ({checkToAdd,setCheckToAdd,refetch,setRefetch}:any) => {  
  const sigCanvas = useRef<SignatureRef>(null);
  const keyset: any = i18n.keyset('language');
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

  async function convertUrlToFile(dataUrl: string): Promise<{ file: File, url: string } | null> {
    try {
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const binary = atob(base64);
      const array = Uint8Array.from(binary, char => char.charCodeAt(0));
      const blob = new Blob([array], { type: mime });

      const file = new File([blob], 'signature.png', { type: mime });
      const url = URL.createObjectURL(file);

      return { file, url };
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      return null;
    }
  }

  const handleClick = async () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Signature is empty!')
      return
    }
    const dataUrl = sigCanvas.current!.toDataURL('image/png')
    const result = await convertUrlToFile(dataUrl)

    console.log('File URL: dataUrl', result)
    setgroupbffe9((prev: any) => ({ ...prev, signature: [result] }))
  }

  const handleClear = () => {
    sigCanvas.current?.clear()
  }
  if (signatureb24c1?.isHidden) {
    return <></>
  }
  useEffect(() => {
    if (typeof groupbffe9?.signature == 'object' && groupbffe9?.signature?.length == 0 || groupbffe9?.signature=="" ) {
      sigCanvas?.current?.clear();
    }
  }, [groupbffe9?.signature]);
 
 
 
  
  return (
    <div 
      style={{gridColumn: `2 / 8`,gridRow: `103 / 182`, gap:``, height: `100%`, overflow: 'auto'}} >
   
    <Signature
      className=""
      penColor='green'
      ref={sigCanvas}
      needTooltip={true}  
      tooltipProps={{title:"toolip",placement:"bottom-end"}}
      headerPosition='top'
      headerText="header"
      onEnd={handleClick}
      needClear={true}
      clearButtonText="Clear" // Optional, defaults to "Clear"
    />
  </div>
  )
}

export default Signaturesignature
