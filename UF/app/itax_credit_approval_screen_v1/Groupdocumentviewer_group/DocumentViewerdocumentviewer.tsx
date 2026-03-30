


'use client'
import React, { useContext, useEffect, useState } from "react";
import i18n from "@/app/components/i18n";
import {Text} from "@/components/Text";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import DocViewer, { FileItem } from "@/components/DocumentViewer";
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from "@/app/utils/codeExecution";
import imageNotFound from '@/app/assets/imageNotFound.png';

const DocumentViewerdocumentviewer = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {disableParam, setDisableParam} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("");
  let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
      codeStates['authorization_memo_file_group']  = authorization_memo_file_group17228,
      codeStates['setauthorization_memo_file_group'] = setauthorization_memo_file_group17228,
      codeStates['documentviewer_group']  = documentviewer_group0a3fb,
      codeStates['setdocumentviewer_group'] = setdocumentviewer_group0a3fb,
      codeStates['overall_group']  = overall_group1e6a4,
      codeStates['setoverall_group'] = setoverall_group1e6a4,
      codeStates['prndetails_group']  = prndetails_group881d8,
      codeStates['setprndetails_group'] = setprndetails_group881d8,
      codeStates['application_group']  = application_group16335,
      codeStates['setapplication_group'] = setapplication_group16335,
      codeStates['approve_table']  = approve_tableafbb9,
      codeStates['setapprove_table'] = setapprove_tableafbb9,
      codeStates['reason_group']  = reason_group39480,
      codeStates['setreason_group'] = setreason_group39480,
      customCode = codeExecution(code,codeStates);
    }
  }

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1",
          componentId: "6b54888d3233443d80bc3f86b430a3fb",
          controlId: "17749fcacda04bff8b779ae6814cd49e",
          isTable: false,
          from:"Button",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
    }catch(err){
        console.log(err);
    }
  }
  useEffect(()=>{
    handleMapper();
  },[])
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [urlFormDataMap, setUrlFormDataMap] = useState<Record<string, any>>({});
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {authorization_memo_file_group17228, setauthorization_memo_file_group17228}= useContext(TotalContext) as TotalContextProps; 
  const {authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props}= useContext(TotalContext) as TotalContextProps; 
  const {documentviewer_group0a3fb, setdocumentviewer_group0a3fb}= useContext(TotalContext) as TotalContextProps; 
  const {documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps}= useContext(TotalContext) as TotalContextProps; 
  const {reject5bd6a, setreject5bd6a}= useContext(TotalContext) as TotalContextProps; 
  const {approve79abe, setapprove79abe}= useContext(TotalContext) as TotalContextProps; 
  const {documentviewercd49e, setdocumentviewercd49e}= useContext(TotalContext) as TotalContextProps; 
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps; 
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps; 
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps; 
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps; 
  const {application_group16335, setapplication_group16335}= useContext(TotalContext) as TotalContextProps; 
  const {application_group16335Props, setapplication_group16335Props}= useContext(TotalContext) as TotalContextProps; 
  const {application_tab_groupf82f4, setapplication_tab_groupf82f4}= useContext(TotalContext) as TotalContextProps; 
  const {application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props}= useContext(TotalContext) as TotalContextProps; 
  const {approve1c1d3, setapprove1c1d3}= useContext(TotalContext) as TotalContextProps; 
  const {approve1c1d3Props, setapprove1c1d3Props}= useContext(TotalContext) as TotalContextProps; 
  const {approve_tableafbb9, setapprove_tableafbb9}= useContext(TotalContext) as TotalContextProps; 
  const {approve_tableafbb9Props, setapprove_tableafbb9Props}= useContext(TotalContext) as TotalContextProps; 
  const {reason_group39480, setreason_group39480}= useContext(TotalContext) as TotalContextProps; 
  const {reason_group39480Props, setreason_group39480Props}= useContext(TotalContext) as TotalContextProps; 
  //////////////
  const BUCKET = process.env.NEXT_PUBLIC_DFS_BUCKETNAME;
  const DFS_PATH = process.env.NEXT_PUBLIC_DFS_PATH;
  const FULL_PATH = `${BUCKET}/${DFS_PATH}`;
  const isExternalUrl = (u: string) =>
    u.startsWith('http://') || u.startsWith('https://')

  const triggerDownload = (href: string, fileName: string) => {
    const a = document.createElement('a')
    a.href = href
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  
  const handleDownload = async (file: FileItem) => {
    const { originalId, fileName, url } = file
    const downloadId = originalId || url


    try {
      if (!isExternalUrl(downloadId)) {
        // Non-external (DFS path): blob already fetched and cached in blobUrlMap
        triggerDownload(url,fileName)
        return
      }

      // External URL or no cached blob: proxy through backend to bypass CORS + force attachment
      const { data } = await AxiosService.post(
        '/UF/download',
        { id: downloadId },
        { responseType: 'blob' }
      )

      const blobUrl = URL.createObjectURL(new Blob([data]))
      triggerDownload(blobUrl, fileName)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    } catch (err) {
      console.error('Download failed', err)
    }
  }

  const extractFileName = (headers: Record<string, string>): string => {
    // Priority 1: file-name header
    if (headers['file-name']) return headers['file-name']
    // Priority 2: content-disposition
    const disposition = headers['content-disposition']
    if (disposition) {
      const match = disposition.match(/filename[*]?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i)
      if (match) return decodeURIComponent(match[1])
    }
    return 'Document'
  }
  // Helper to extract filename from URL
  const extractFileNameFromUrl = (url: string): string => {
    try {
      const pathname = new URL(url).pathname
      const name = pathname.split('/').pop()
      return name ? decodeURIComponent(name) : 'Document'
    } catch {
      return url.split('/').pop() || 'Document'
    }
  }
  const fetchData = async () => {
    // Check if scanurl is an array or a single value
    const scanurl: string = documentviewer_group0a3fb?.documentviewer;
    const scanUrls: string[] = Array.isArray(scanurl) ? scanurl : scanurl ? [scanurl] : [];

    // Filter out null, undefined, and non-string values
    const validScanUrls = scanUrls.filter(
      (item: any) => item && typeof item === 'string' && item.trim() !== ''
    )

    if (validScanUrls.length === 0) {
      setFiles([])
      return
    }

    try {
      setLoading(true);

      const fileItems = await Promise.all(
        validScanUrls.map(async (singleUrl: string): Promise<FileItem | null> => {
          // If this individual URL is external, return it directly
          if (isExternalUrl(singleUrl)) {
            return {
              url: singleUrl,
              fileName: extractFileNameFromUrl(singleUrl),
              fileType: '', // Will be detected by extension in DocViewer
              originalId: singleUrl
            }
          }
      try{
        let downloadFileBody :any =  { id: singleUrl,context:"documentviewer",enableEncryption:false };
        if (encryptionFlagCont) {
            downloadFileBody["dpdKey"] = encryptionDpd;
            downloadFileBody["method"] = encryptionMethod;
        } 
        let response : any;
        
        let getUrl : any =  await AxiosService.post('/UF/getUrlByVgphstdmId',{ id: downloadFileBody?.id })
        downloadFileBody["id"] = getUrl?.data

        if(downloadFileBody?.id?.includes(FULL_PATH) ){
          //download from DFS-getDFS
          response = await AxiosService.post(
            '/UF/getDFS',downloadFileBody,
            {
              responseType: 'blob',
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }else{
          //Download from UF-downloadFile
          response = await AxiosService.post(
            'UF/gridfs',
            downloadFileBody,
            {
              responseType: 'blob',
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }

        const contentType = response.headers['content-type'] || response.data.type || ''
        const blob = new Blob([response.data], { type: contentType })
        const blobUrl = window.URL.createObjectURL(blob)
        return {
          url: blobUrl,
          fileName: extractFileName(response.headers),
          fileType: contentType,
          originalId: singleUrl
        }
      } catch (err) {
        console.error(`Failed to fetch file: ${singleUrl}`, err)
        return null
      }
      })
    )
      // Filter out null values (failed requests)
      const validFiles = fileItems.filter((f): f is FileItem => f !== null)
      setFiles(validFiles)
    } catch (err) {
      setFiles([]);
    } finally {
      setLoading(false);
    }
    handleCustomCode()
  }

  useEffect(() => {
    fetchData();
  }, [documentviewer_group0a3fb?.documentviewer])
  
  if (documentviewercd49e?.isHidden) {
    return <></>
  }
  if (loading) {
    return (
      <div style={{gridColumn: `1 / 25`,gridRow: `12 / 226`, gap:``}}>
        Loading...
      </div>
    )
  }


  return (
    <div style={{gridColumn: `1 / 25`,gridRow: `12 / 226`, gap:``, height: `100%`}} >  
      <DocViewer 
        files={files}
        className="p-4 !border !rounded"
        onDownload={handleDownload}
        toolbarPosition ={ "top" }
        toolbarAlignment={ "center" }
      />
    </div>
  );
}

export default DocumentViewerdocumentviewer
