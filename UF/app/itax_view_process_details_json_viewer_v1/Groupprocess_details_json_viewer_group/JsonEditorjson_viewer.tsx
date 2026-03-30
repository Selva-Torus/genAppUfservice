

'use client'
import React, { useContext, useEffect, useState } from "react";
import i18n from "@/app/components/i18n";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";

import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import imageNotFound from '@/app/assets/imageNotFound.png';
import JSONEditor from "@/components/JSONEditor";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

export default function JsonEditorjson_viewer ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) {
  const token:string = getCookie('token'); 
  const allstates:any = useContext(TotalContext) as TotalContextProps;
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
  const {process_details_json_viewer_group64f76, setprocess_details_json_viewer_group64f76}= useContext(TotalContext) as TotalContextProps;
  const {process_details_json_viewer_group64f76Props, setprocess_details_json_viewer_group64f76Props}= useContext(TotalContext) as TotalContextProps;
  const {process_details_label489c7, setprocess_details_label489c7}= useContext(TotalContext) as TotalContextProps;
  const {json_viewer235e2, setjson_viewer235e2}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const [leftDataName, setLeftDataName] = useState<any>("original")
  const [rightDataName, setRightDataName] = useState<any>("modified")
  
      const handleMapperDetails=async()=>{
    try{
      let code:any;
      const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{
        key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Process_Details_Json_Viewer:AFVK:v1",  componentId:"41c241ad74374fb79ac9ad3f42564f76",
        controlId:"531bb0c98c0c4cf0ad61b1fdc1c235e2",isTable:false,
        accessProfile:accessProfile,from:"JSONeditor"},{
        headers: {
          Authorization: `Bearer ${token}`
      }})
      if( orchestrationData?.data?.mapper?.length){
        let mappedData:any={}
        orchestrationData?.data?.mapper?.map((items:any)=>{
          if(items?.targetKey?.split("|")?.at(-1)=='original')
          {
            let dfdkey:any=''
            let dfdArtifactName:string=""
            let cols:any=[]
            items?.sourceKey?.map((sourceData: string)=>{
                if(sourceData?.split("|")?.at(-1)?.split(".")?.at(-1))
                {
                    dfdArtifactName = "dfd_" + sourceData.split(":")[11].toLowerCase()+"_"+sourceData.split('|')[0].split(":")[13].toLowerCase()+"Props";
                    dfdkey=sourceData?.split("|")?.at(0)
                    cols.push(sourceData?.split("|")?.at(-1)?.split(".")?.at(-1))
                }
            })
            mappedData['original']={ dfdkey,dfdArtifactName,cols}
          } else if(items?.targetKey?.split("|")?.at(-1)=='modified')
          {
            let dfdkey:any=''
            let dfdArtifactName:string=""
            let cols:any=[]
            items?.sourceKey?.map((sourceData: string)=>{
                if(sourceData?.split("|")?.at(-1)?.split(".")?.at(-1))
                {
                    dfdArtifactName = "dfd_" + sourceData.split(":")[11].toLowerCase()+"_"+sourceData.split('|')[0].split(":")[13].toLowerCase()+"Props";
                    dfdkey=sourceData?.split("|")?.at(0)
                    cols.push(sourceData?.split("|")?.at(-1)?.split(".")?.at(-1))
                }
            })
            mappedData['modified']={ dfdkey,dfdArtifactName,cols}
          }
        })
        let dfdData:any={}
        let original_modifiedName:any={
          ori:mappedData?.original?.cols?.at(0) || "original",
          mod:mappedData?.modified?.cols?.at(0) || "modified",
        }
        setLeftDataName(original_modifiedName.ori)
        setRightDataName(original_modifiedName.mod)
        return 
        // for future use
        if(mappedData['original']&&allstates[mappedData['original']["dfdArtifactName"]])
        {
          let tempData:any=[]
          let linkedDfdData:any = allstates[mappedData['original']["dfdArtifactName"]]||[]
          linkedDfdData?.map((items:any,index:number)=>{
            if(mappedData?.original?.cols[0]&&items[mappedData?.original?.cols[0]])
            {
              original_modifiedName.ori=mappedData?.original?.cols[0]
              tempData.push({
                [mappedData?.original?.cols[0]]:items[mappedData?.original?.cols[0]]
              })
            }
          })
          dfdData[original_modifiedName.ori]=tempData
        }
        if(mappedData['modified']&&allstates[mappedData['modified']["dfdArtifactName"]])
        {
          let tempData:any=[]
          let linkedDfdData:any = allstates[mappedData['modified']["dfdArtifactName"]]||[]
          linkedDfdData?.map((items:any,index:number)=>{
            if(mappedData?.modified?.cols[0]&&items[mappedData?.modified?.cols[0]])
            {
                original_modifiedName.mod=mappedData?.modified?.cols[0]
              
              tempData.push({
                [mappedData?.modified?.cols[0]]:items[mappedData?.modified?.cols[0]]
              })
            }
          })
           dfdData[original_modifiedName.mod]=tempData
        }

         // setprocess_details_json_viewer_group64f76((pre:any)=>({...pre,...dfdData}))
        

      }
      // let dfdKey:any=""
      // if( orchestrationData?.data?.mapper?.length && orchestrationData?.data?.mapper[0]?.sourceKey?.length){
      //   dfdKey = orchestrationData?.data?.mapper[0]?.sourceKey[0]?.split("|")?.at(0)
      // }
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    handleMapperDetails()
  },[])

  const handleChange=(data:any,whereToChange:string)=>{
    if(whereToChange == "originalData")
    {
      setprocess_details_json_viewer_group64f76((pre:any)=>({...pre,[leftDataName]:data||{}}))
    }
    if(whereToChange == "modifiedData")
    {
      setprocess_details_json_viewer_group64f76((pre:any)=>({...pre,[rightDataName]:data||{}}))
    }
  }
  return (
     <div 
      style={{gridColumn: `1 / 25`,gridRow: `11 / 155`, gap:``, height: `100%`, overflow: 'auto'}} >  
      
      <JSONEditor
        needCompare={false}
        leftData={ process_details_json_viewer_group64f76 && leftDataName in process_details_json_viewer_group64f76 ?  process_details_json_viewer_group64f76[leftDataName]:null}
        rightData={ process_details_json_viewer_group64f76 && rightDataName in process_details_json_viewer_group64f76 ? process_details_json_viewer_group64f76[rightDataName]:null}
        setLeftData={(data:any)=>handleChange(data,"originalData")}
        setRightData={(data:any)=>handleChange(data,"modifiedData")}
      />
    </div>
  )
}