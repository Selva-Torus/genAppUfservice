


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

const DocumentViewerdocumentviewer = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}:any) => {
  const token:string = getCookie('token'); 
  const {disableParam, setDisableParam} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("");

   const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1",
          componentId: "2f07f01a54904a4c93e25f47cda01c61",
          controlId: "9b8e4edd435448ab98f68a59ea29df1d",
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
  const {overallgroup01c61, setoverallgroup01c61}= useContext(TotalContext) as TotalContextProps; 
  const {overallgroup01c61Props, setoverallgroup01c61Props}= useContext(TotalContext) as TotalContextProps; 
  const {controlgroupda197, setcontrolgroupda197}= useContext(TotalContext) as TotalContextProps; 
  const {controlgroupda197Props, setcontrolgroupda197Props}= useContext(TotalContext) as TotalContextProps; 
  const {control_tab_groupbc3e2, setcontrol_tab_groupbc3e2}= useContext(TotalContext) as TotalContextProps; 
  const {control_tab_groupbc3e2Props, setcontrol_tab_groupbc3e2Props}= useContext(TotalContext) as TotalContextProps; 
  const {button_group74f3e, setbutton_group74f3e}= useContext(TotalContext) as TotalContextProps; 
  const {button_group74f3eProps, setbutton_group74f3eProps}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_infofd0aa, setrtgs_infofd0aa}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_infofd0aaProps, setrtgs_infofd0aaProps}= useContext(TotalContext) as TotalContextProps; 
  const {allcontrols71c54, setallcontrols71c54}= useContext(TotalContext) as TotalContextProps; 
  const {allcontrols71c54Props, setallcontrols71c54Props}= useContext(TotalContext) as TotalContextProps; 
  const {commoninfof4607, setcommoninfof4607}= useContext(TotalContext) as TotalContextProps; 
  const {commoninfof4607Props, setcommoninfof4607Props}= useContext(TotalContext) as TotalContextProps; 
  const {basicinfo3d198, setbasicinfo3d198}= useContext(TotalContext) as TotalContextProps; 
  const {basicinfo3d198Props, setbasicinfo3d198Props}= useContext(TotalContext) as TotalContextProps; 
  const {additionalinfod2894, setadditionalinfod2894}= useContext(TotalContext) as TotalContextProps; 
  const {additionalinfod2894Props, setadditionalinfod2894Props}= useContext(TotalContext) as TotalContextProps; 
  const {listgroupdcdbd, setlistgroupdcdbd}= useContext(TotalContext) as TotalContextProps; 
  const {listgroupdcdbdProps, setlistgroupdcdbdProps}= useContext(TotalContext) as TotalContextProps; 
  const {list_tab_groupd6905, setlist_tab_groupd6905}= useContext(TotalContext) as TotalContextProps; 
  const {list_tab_groupd6905Props, setlist_tab_groupd6905Props}= useContext(TotalContext) as TotalContextProps; 
  const {document_list38c6e, setdocument_list38c6e}= useContext(TotalContext) as TotalContextProps; 
  const {document_list38c6eProps, setdocument_list38c6eProps}= useContext(TotalContext) as TotalContextProps; 
  const {doclisttable56e97, setdoclisttable56e97}= useContext(TotalContext) as TotalContextProps; 
  const {doclisttable56e97Props, setdoclisttable56e97Props}= useContext(TotalContext) as TotalContextProps; 
  const {validation_listae827, setvalidation_listae827}= useContext(TotalContext) as TotalContextProps; 
  const {validation_listae827Props, setvalidation_listae827Props}= useContext(TotalContext) as TotalContextProps; 
  const {valdnlisttable17ec7, setvaldnlisttable17ec7}= useContext(TotalContext) as TotalContextProps; 
  const {valdnlisttable17ec7Props, setvaldnlisttable17ec7Props}= useContext(TotalContext) as TotalContextProps; 
  const {comment_list72944, setcomment_list72944}= useContext(TotalContext) as TotalContextProps; 
  const {comment_list72944Props, setcomment_list72944Props}= useContext(TotalContext) as TotalContextProps; 
  const {cmntlisttable02d0e, setcmntlisttable02d0e}= useContext(TotalContext) as TotalContextProps; 
  const {cmntlisttable02d0eProps, setcmntlisttable02d0eProps}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_lista0a19, setrtgs_lista0a19}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_lista0a19Props, setrtgs_lista0a19Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_grpcf7d8, setrtgs_list_grpcf7d8}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_grpcf7d8Props, setrtgs_list_grpcf7d8Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_table7b8d6, setrtgs_list_table7b8d6}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_table7b8d6Props, setrtgs_list_table7b8d6Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_tab_grp024e1, setrtgs_list_tab_grp024e1}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_tab_grp024e1Props, setrtgs_list_tab_grp024e1Props}= useContext(TotalContext) as TotalContextProps; 
  const {documnt_list03a06, setdocumnt_list03a06}= useContext(TotalContext) as TotalContextProps; 
  const {documnt_list03a06Props, setdocumnt_list03a06Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_doc_table_grp8a593, setrtgs_list_doc_table_grp8a593}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_doc_table_grp8a593Props, setrtgs_list_doc_table_grp8a593Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_lst_doc_list_tablee57bb, setrtgs_lst_doc_list_tablee57bb}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_lst_doc_list_tablee57bbProps, setrtgs_lst_doc_list_tablee57bbProps}= useContext(TotalContext) as TotalContextProps; 
  const {validtn_lista5b14, setvalidtn_lista5b14}= useContext(TotalContext) as TotalContextProps; 
  const {validtn_lista5b14Props, setvalidtn_lista5b14Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_validtn_list_grpc5569, setrtgs_list_validtn_list_grpc5569}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_validtn_list_grpc5569Props, setrtgs_list_validtn_list_grpc5569Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_validtn_table39a42, setrtgs_list_validtn_table39a42}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_validtn_table39a42Props, setrtgs_list_validtn_table39a42Props}= useContext(TotalContext) as TotalContextProps; 
  const {cmnt_listebbbc, setcmnt_listebbbc}= useContext(TotalContext) as TotalContextProps; 
  const {cmnt_listebbbcProps, setcmnt_listebbbcProps}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_cmnt_list_grpb5728, setrtgs_list_cmnt_list_grpb5728}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_cmnt_list_grpb5728Props, setrtgs_list_cmnt_list_grpb5728Props}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_cmnts_list15716, setrtgs_list_cmnts_list15716}= useContext(TotalContext) as TotalContextProps; 
  const {rtgs_list_cmnts_list15716Props, setrtgs_list_cmnts_list15716Props}= useContext(TotalContext) as TotalContextProps; 
  const {documentviewer9df1d, setdocumentviewer9df1d}= useContext(TotalContext) as TotalContextProps; 
  //////////////
   let customCode:any;
  const handleCustomCode=async () => {
    let code:any=allCode||''
    if (code != '') {
      let codeStates: any = {};
        codeStates['overallgroup'] = overallgroup01c61,
        codeStates['setoverallgroup'] = setoverallgroup01c61,
        codeStates['overallgroup01c61'] = overallgroup01c61Props,
        codeStates['setoverallgroup01c61'] = setoverallgroup01c61Props,
        codeStates['controlgroup'] = controlgroupda197,
        codeStates['setcontrolgroup'] = setcontrolgroupda197,
        codeStates['controlgroupda197'] = controlgroupda197Props,
        codeStates['setcontrolgroupda197'] = setcontrolgroupda197Props,
        codeStates['control_tab_group'] = control_tab_groupbc3e2,
        codeStates['setcontrol_tab_group'] = setcontrol_tab_groupbc3e2,
        codeStates['control_tab_groupbc3e2'] = control_tab_groupbc3e2Props,
        codeStates['setcontrol_tab_groupbc3e2'] = setcontrol_tab_groupbc3e2Props,
        codeStates['button_group'] = button_group74f3e,
        codeStates['setbutton_group'] = setbutton_group74f3e,
        codeStates['button_group74f3e'] = button_group74f3eProps,
        codeStates['setbutton_group74f3e'] = setbutton_group74f3eProps,
        codeStates['rtgs_info'] = rtgs_infofd0aa,
        codeStates['setrtgs_info'] = setrtgs_infofd0aa,
        codeStates['rtgs_infofd0aa'] = rtgs_infofd0aaProps,
        codeStates['setrtgs_infofd0aa'] = setrtgs_infofd0aaProps,
        codeStates['allcontrols'] = allcontrols71c54,
        codeStates['setallcontrols'] = setallcontrols71c54,
        codeStates['allcontrols71c54'] = allcontrols71c54Props,
        codeStates['setallcontrols71c54'] = setallcontrols71c54Props,
        codeStates['commoninfo'] = commoninfof4607,
        codeStates['setcommoninfo'] = setcommoninfof4607,
        codeStates['commoninfof4607'] = commoninfof4607Props,
        codeStates['setcommoninfof4607'] = setcommoninfof4607Props,
        codeStates['basicinfo'] = basicinfo3d198,
        codeStates['setbasicinfo'] = setbasicinfo3d198,
        codeStates['basicinfo3d198'] = basicinfo3d198Props,
        codeStates['setbasicinfo3d198'] = setbasicinfo3d198Props,
        codeStates['additionalinfo'] = additionalinfod2894,
        codeStates['setadditionalinfo'] = setadditionalinfod2894,
        codeStates['additionalinfod2894'] = additionalinfod2894Props,
        codeStates['setadditionalinfod2894'] = setadditionalinfod2894Props,
        codeStates['listgroup'] = listgroupdcdbd,
        codeStates['setlistgroup'] = setlistgroupdcdbd,
        codeStates['listgroupdcdbd'] = listgroupdcdbdProps,
        codeStates['setlistgroupdcdbd'] = setlistgroupdcdbdProps,
        codeStates['list_tab_group'] = list_tab_groupd6905,
        codeStates['setlist_tab_group'] = setlist_tab_groupd6905,
        codeStates['list_tab_groupd6905'] = list_tab_groupd6905Props,
        codeStates['setlist_tab_groupd6905'] = setlist_tab_groupd6905Props,
        codeStates['document_list'] = document_list38c6e,
        codeStates['setdocument_list'] = setdocument_list38c6e,
        codeStates['document_list38c6e'] = document_list38c6eProps,
        codeStates['setdocument_list38c6e'] = setdocument_list38c6eProps,
        codeStates['doclisttable'] = doclisttable56e97,
        codeStates['setdoclisttable'] = setdoclisttable56e97,
        codeStates['doclisttable56e97'] = doclisttable56e97Props,
        codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
        codeStates['validation_list'] = validation_listae827,
        codeStates['setvalidation_list'] = setvalidation_listae827,
        codeStates['validation_listae827'] = validation_listae827Props,
        codeStates['setvalidation_listae827'] = setvalidation_listae827Props,
        codeStates['valdnlisttable'] = valdnlisttable17ec7,
        codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
        codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
        codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
        codeStates['comment_list'] = comment_list72944,
        codeStates['setcomment_list'] = setcomment_list72944,
        codeStates['comment_list72944'] = comment_list72944Props,
        codeStates['setcomment_list72944'] = setcomment_list72944Props,
        codeStates['cmntlisttable'] = cmntlisttable02d0e,
        codeStates['setcmntlisttable'] = setcmntlisttable02d0e,
        codeStates['cmntlisttable02d0e'] = cmntlisttable02d0eProps,
        codeStates['setcmntlisttable02d0e'] = setcmntlisttable02d0eProps,
        codeStates['rtgs_list'] = rtgs_lista0a19,
        codeStates['setrtgs_list'] = setrtgs_lista0a19,
        codeStates['rtgs_lista0a19'] = rtgs_lista0a19Props,
        codeStates['setrtgs_lista0a19'] = setrtgs_lista0a19Props,
        codeStates['rtgs_list_grp'] = rtgs_list_grpcf7d8,
        codeStates['setrtgs_list_grp'] = setrtgs_list_grpcf7d8,
        codeStates['rtgs_list_grpcf7d8'] = rtgs_list_grpcf7d8Props,
        codeStates['setrtgs_list_grpcf7d8'] = setrtgs_list_grpcf7d8Props,
        codeStates['rtgs_list_table'] = rtgs_list_table7b8d6,
        codeStates['setrtgs_list_table'] = setrtgs_list_table7b8d6,
        codeStates['rtgs_list_table7b8d6'] = rtgs_list_table7b8d6Props,
        codeStates['setrtgs_list_table7b8d6'] = setrtgs_list_table7b8d6Props,
        codeStates['rtgs_list_tab_grp'] = rtgs_list_tab_grp024e1,
        codeStates['setrtgs_list_tab_grp'] = setrtgs_list_tab_grp024e1,
        codeStates['rtgs_list_tab_grp024e1'] = rtgs_list_tab_grp024e1Props,
        codeStates['setrtgs_list_tab_grp024e1'] = setrtgs_list_tab_grp024e1Props,
        codeStates['documnt_list'] = documnt_list03a06,
        codeStates['setdocumnt_list'] = setdocumnt_list03a06,
        codeStates['documnt_list03a06'] = documnt_list03a06Props,
        codeStates['setdocumnt_list03a06'] = setdocumnt_list03a06Props,
        codeStates['rtgs_list_doc_table_grp'] = rtgs_list_doc_table_grp8a593,
        codeStates['setrtgs_list_doc_table_grp'] = setrtgs_list_doc_table_grp8a593,
        codeStates['rtgs_list_doc_table_grp8a593'] = rtgs_list_doc_table_grp8a593Props,
        codeStates['setrtgs_list_doc_table_grp8a593'] = setrtgs_list_doc_table_grp8a593Props,
        codeStates['rtgs_lst_doc_list_table'] = rtgs_lst_doc_list_tablee57bb,
        codeStates['setrtgs_lst_doc_list_table'] = setrtgs_lst_doc_list_tablee57bb,
        codeStates['rtgs_lst_doc_list_tablee57bb'] = rtgs_lst_doc_list_tablee57bbProps,
        codeStates['setrtgs_lst_doc_list_tablee57bb'] = setrtgs_lst_doc_list_tablee57bbProps,
        codeStates['validtn_list'] = validtn_lista5b14,
        codeStates['setvalidtn_list'] = setvalidtn_lista5b14,
        codeStates['validtn_lista5b14'] = validtn_lista5b14Props,
        codeStates['setvalidtn_lista5b14'] = setvalidtn_lista5b14Props,
        codeStates['rtgs_list_validtn_list_grp'] = rtgs_list_validtn_list_grpc5569,
        codeStates['setrtgs_list_validtn_list_grp'] = setrtgs_list_validtn_list_grpc5569,
        codeStates['rtgs_list_validtn_list_grpc5569'] = rtgs_list_validtn_list_grpc5569Props,
        codeStates['setrtgs_list_validtn_list_grpc5569'] = setrtgs_list_validtn_list_grpc5569Props,
        codeStates['rtgs_list_validtn_table'] = rtgs_list_validtn_table39a42,
        codeStates['setrtgs_list_validtn_table'] = setrtgs_list_validtn_table39a42,
        codeStates['rtgs_list_validtn_table39a42'] = rtgs_list_validtn_table39a42Props,
        codeStates['setrtgs_list_validtn_table39a42'] = setrtgs_list_validtn_table39a42Props,
        codeStates['cmnt_list'] = cmnt_listebbbc,
        codeStates['setcmnt_list'] = setcmnt_listebbbc,
        codeStates['cmnt_listebbbc'] = cmnt_listebbbcProps,
        codeStates['setcmnt_listebbbc'] = setcmnt_listebbbcProps,
        codeStates['rtgs_list_cmnt_list_grp'] = rtgs_list_cmnt_list_grpb5728,
        codeStates['setrtgs_list_cmnt_list_grp'] = setrtgs_list_cmnt_list_grpb5728,
        codeStates['rtgs_list_cmnt_list_grpb5728'] = rtgs_list_cmnt_list_grpb5728Props,
        codeStates['setrtgs_list_cmnt_list_grpb5728'] = setrtgs_list_cmnt_list_grpb5728Props,
        codeStates['rtgs_list_cmnts_list'] = rtgs_list_cmnts_list15716,
        codeStates['setrtgs_list_cmnts_list'] = setrtgs_list_cmnts_list15716,
        codeStates['rtgs_list_cmnts_list15716'] = rtgs_list_cmnts_list15716Props,
        codeStates['setrtgs_list_cmnts_list15716'] = setrtgs_list_cmnts_list15716Props,
        codeStates['documentviewer'] = documentviewer9df1d,
        codeStates['setdocumentviewer'] = setdocumentviewer9df1d,
      customCode = codeExecution(code,codeStates);
    }
  }  
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
    const scanurl: string = overallgroup01c61?.documentviewer;
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
  }, [overallgroup01c61?.documentviewer])
  
  if (documentviewer9df1d?.isHidden) {
    return <></>
  }
  if (loading) {
    return (
      <div style={{gridColumn: `17 / 25`,gridRow: `1 / 246`, gap:``}}>
        Loading...
      </div>
    )
  }


  return (
    <div style={{gridColumn: `17 / 25`,gridRow: `1 / 246`, gap:``, height: `100%`}} >  
      <DocViewer 
        files={files}
        className=""
        onDownload={handleDownload}
        toolbarPosition ={ "top" }
        toolbarAlignment={ "center" }
      />
    </div>
  );
}

export default DocumentViewerdocumentviewer
