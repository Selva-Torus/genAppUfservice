'use client'
import React, { useContext, useEffect, useState } from "react";
import i18n from "@/app/components/i18n";
import {Text} from "@gravity-ui/uikit";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import TorusDocViewer from "@/app/TorusComponents/Documentviewer";
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import imageNotFound from '@/app/assets/imageNotFound.png';

const DocumentViewerviewdoc = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {disableParam, setDisableParam} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = useState<string>('');
  const [documentType, setDocumentType] = useState('');
  const [otherFileFormat, setOtherFileFormat] = useState(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {groupe162d, setgroupe162d}= useContext(TotalContext) as TotalContextProps; 
  const {groupe162dProps, setgroupe162dProps}= useContext(TotalContext) as TotalContextProps; 
  const {mytabled34a7, setmytabled34a7}= useContext(TotalContext) as TotalContextProps; 
  const {mytabled34a7Props, setmytabled34a7Props}= useContext(TotalContext) as TotalContextProps; 
  const {group23b6cd, setgroup23b6cd}= useContext(TotalContext) as TotalContextProps; 
  const {group23b6cdProps, setgroup23b6cdProps}= useContext(TotalContext) as TotalContextProps; 
  const {viewdoc074a4, setviewdoc074a4}= useContext(TotalContext) as TotalContextProps; 
  //////////////
  const baseUrl = process.env.NEXT_PUBLIC_FTP_OUTPUT_HOST;
  const fetchData = async () => {
    let url: string | null = null
    if (!group23b6cd?.viewdoc) {
      setFileUrl(null);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      let downloadFileBody :any =  { id: group23b6cd?.viewdoc,context:"viewdoc"}
      if (encryptionFlagCont) {
          downloadFileBody["dpdKey"] = encryptionDpd;
          downloadFileBody["method"] = encryptionMethod;
      } 
      if(downloadFileBody?.id?.startsWith(baseUrl) ){
        const response = await AxiosService.post(
          '/UF/getDFS',downloadFileBody,
          {
            responseType: 'blob',
            headers: { 'Content-Type': 'application/json' }
          }
        )

        const blob = new Blob([response.data], {
          type: response.headers['content-type']
        })
        url = window.URL.createObjectURL(blob)
      }else{
        const response = await AxiosService.post(
          'UF/downloadFile',
          downloadFileBody,
          {
            responseType: 'blob',
            headers: { 'Content-Type': 'application/json' }
          }
        )      
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        url = URL.createObjectURL(blob);
      }
      setFileUrl(url);
      setError(null);
    } catch (err) {
      setFileUrl(null);
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [group23b6cd?.viewdoc])
  
  if (viewdoc074a4?.isHidden) {
    return <></>
  }

  if (loading) {
    return (
      <div style={{gridColumn: `3 / 5`,gridRow: `16 / 26`, gap:``}}>
        Loading...
      </div>
    )
  }
  if (error) return <div>Error: {error}</div>
  if (!fileUrl) return <div 
    style={{gridColumn: `3 / 5`,gridRow: `16 / 26`, gap:``}}>imageNotFound</div>

  return (
    <div 
      style={{gridColumn: `3 / 5`,gridRow: `16 / 26`, gap:``, height: `100%`, overflow: 'auto'}} >  
      <TorusDocViewer 
        url={fileUrl || ''}
        queryParams="HL=NL"
        viewer="url"
        viewerUrl={""}
        googleCheckInterval={500}
        googleMaxChecks={5}
        overrideLocalhost="null" 
        googleCheckContentLoaded={true}
        className="w-full h-full " 
      />
    </div>
  );
}

export default DocumentViewerviewdoc
