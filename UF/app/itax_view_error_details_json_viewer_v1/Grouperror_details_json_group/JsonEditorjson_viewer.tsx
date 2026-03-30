

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
  const {error_details_json_groupc13f1, seterror_details_json_groupc13f1}= useContext(TotalContext) as TotalContextProps;
  const {error_details_json_groupc13f1Props, seterror_details_json_groupc13f1Props}= useContext(TotalContext) as TotalContextProps;
  const {error_details21287, seterror_details21287}= useContext(TotalContext) as TotalContextProps;
  const {json_vieweree843, setjson_vieweree843}= useContext(TotalContext) as TotalContextProps;
  //////////////

  const [leftDataName, setLeftDataName] = useState<any>("original")
  const [rightDataName, setRightDataName] = useState<any>("modified")
  
      const handleMapperDetails=async()=>{
    try{
      let code:any;
      const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{
        key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Error_Details_Json_Viewer:AFVK:v1",  componentId:"ae417651ed9145df87f45ace6edc13f1",
        controlId:"96daad843e3f43739bfb959c504ee843",isTable:false,
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

         // seterror_details_json_groupc13f1((pre:any)=>({...pre,...dfdData}))
        

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
      seterror_details_json_groupc13f1((pre:any)=>({...pre,[leftDataName]:data||{}}))
    }
    if(whereToChange == "modifiedData")
    {
      seterror_details_json_groupc13f1((pre:any)=>({...pre,[rightDataName]:data||{}}))
    }
  }
  return (
     <div 
      style={{gridColumn: `1 / 25`,gridRow: `11 / 150`, gap:``, height: `100%`, overflow: 'auto'}} >  
      
      <JSONEditor
        needCompare={false}
        leftData={ error_details_json_groupc13f1 && leftDataName in error_details_json_groupc13f1 ?  error_details_json_groupc13f1[leftDataName]:null}
        rightData={ error_details_json_groupc13f1 && rightDataName in error_details_json_groupc13f1 ? error_details_json_groupc13f1[rightDataName]:null}
        setLeftData={(data:any)=>handleChange(data,"originalData")}
        setRightData={(data:any)=>handleChange(data,"modifiedData")}
      />
    </div>
  )
}