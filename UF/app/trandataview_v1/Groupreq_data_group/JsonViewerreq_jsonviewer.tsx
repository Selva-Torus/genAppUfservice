
'use client'
import React, { useContext, useEffect, useState } from "react";
import i18n from "@/app/components/i18n";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { getControlOrchestrationData } from '@/app/utils/Orchestration';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import imageNotFound from '@/app/assets/imageNotFound.png';
import { JsonViewer } from "@/components/JsonViewer";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
const JsonViewerreq_jsonviewer = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}:any) => {
  const token:string = getCookie('token'); 
  const {disableParam, setDisableParam} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const [open, setOpen] = React.useState(false);

  const [url, setUrl] = useState<string>('');
  const [documentType, setDocumentType] = useState('');
  const [data, setData] = React.useState<any>("");
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
  const {tran_data_group84f25, settran_data_group84f25}= useContext(TotalContext) as TotalContextProps;
  const {tran_data_group84f25Props, settran_data_group84f25Props}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7, setreq_data_group8d4d7}= useContext(TotalContext) as TotalContextProps;
  const {req_data_group8d4d7Props, setreq_data_group8d4d7Props}= useContext(TotalContext) as TotalContextProps;
  const {req_jsonviewer8d071, setreq_jsonviewer8d071}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75a, setres_data_group9d75a}= useContext(TotalContext) as TotalContextProps;
  const {res_data_group9d75aProps, setres_data_group9d75aProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperDetails=async()=>{
    try{
      let code:any;
      const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "359f2639ce6145718dd2f74e0b98d4d7",
        "6ccd47deda5442488c4ae9feac48d071"
        );
      let dfdKey:any=""
      if( orchestrationData?.data?.mapper?.length && orchestrationData?.data?.mapper[0]?.sourceKey?.length){
        dfdKey = orchestrationData?.data?.mapper[0]?.sourceKey[0]?.split("|")?.at(0)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperDetails()
  },[])

  if (req_jsonviewer8d071?.isHidden) {
    return <></>
  }  return (
    <div 
      className="top " 
      style={{gridColumn: `1 / 25`,gridRow: `1 / 79`, gap:``, height: `100%`, overflow: 'auto'}} >  
      <JsonViewer 
        className="" 
        headerPosition='top'
        headerText="Request Data"
        data = {req_data_group8d4d7.request_data}/>
    </div>
  );
}

export default JsonViewerreq_jsonviewer

