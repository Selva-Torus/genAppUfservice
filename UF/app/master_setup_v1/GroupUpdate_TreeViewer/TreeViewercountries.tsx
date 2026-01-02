'use client'
import React, { useContext, useEffect, useState } from "react";
import i18n from "@/app/components/i18n";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";

import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import imageNotFound from '@/app/assets/imageNotFound.png';
import { TreeViewer } from "@/components/TreeViewer";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const TreeViewercountries = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
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
  const {add_master_setup46681, setadd_master_setup46681}= useContext(TotalContext) as TotalContextProps;
  const {add_master_setup46681Props, setadd_master_setup46681Props}= useContext(TotalContext) as TotalContextProps;
  const {master_setup8bca5, setmaster_setup8bca5}= useContext(TotalContext) as TotalContextProps;
  const {master_setup8bca5Props, setmaster_setup8bca5Props}= useContext(TotalContext) as TotalContextProps;
  const {backscheme_setupae907, setbackscheme_setupae907}= useContext(TotalContext) as TotalContextProps;
  const {backscheme_setupae907Props, setbackscheme_setupae907Props}= useContext(TotalContext) as TotalContextProps;
  const {update_treeviewer4efee, setupdate_treeviewer4efee}= useContext(TotalContext) as TotalContextProps;
  const {update_treeviewer4efeeProps, setupdate_treeviewer4efeeProps}= useContext(TotalContext) as TotalContextProps;
  const {countriescfe3b, setcountriescfe3b}= useContext(TotalContext) as TotalContextProps;
  const {_id0e762, set_id0e762}= useContext(TotalContext) as TotalContextProps;
  const {update12a05, setupdate12a05}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperDetails=async()=>{
    try{
      let code:any;
      const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{
        key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1",  componentId:"a36acb1c9ccb4d8e976bdd406ac4efee",
        controlId:"198b7addc2db4c16a4bd714afeccfe3b",isTable:false,
        accessProfile:accessProfile,from:"TreeViewerbankscheme_treeviewer"},{
        headers: {
          Authorization: `Bearer ${token}`
      }})
      let dfdKey:any=""
      if( orchestrationData?.data?.mapper?.length && orchestrationData?.data?.mapper[0]?.sourceKey?.length){
        dfdKey = orchestrationData?.data?.mapper[0]?.sourceKey[0]?.split("|")?.at(0)
      }
      if(dfdKey=='')
        return
    let te_refreshBody:te_refreshDto={
          key: dfdKey+":",
          refreshFlag: "Y",                
          count:1000,
          page:1
        }
    if (encryptionFlagCont) {
      te_refreshBody["dpdKey"] = encryptionDpd;
      te_refreshBody["method"] = encryptionMethod;
    }
    const te_refreshData:any=await AxiosService.post("/te/eventEmitter",te_refreshBody,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(te_refreshData?.data?.error == true){
      toast(te_refreshData?.data?.errorDetails?.message, 'danger')
    }else{
      setupdate_treeviewer4efee({...update_treeviewer4efee, countries:te_refreshData?.data?.dataset?.data || []})
        }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperDetails()
  },[])

  function handleClick(data:any,path:string){
    data=path.replace('/','')
  }

  if (countriescfe3b?.isHidden) {
    return <></>
  }  return (
    <div 
      style={{gridColumn: `1 / 11`,gridRow: `1 / 58`, gap:``, height: `100%`, overflow: 'auto'}} >  
      <div className='flex overflow-auto'>
      <TreeViewer className="" mainData={update_treeviewer4efee?.countries} data={update_treeviewer4efee?.countries}  handleClick={handleClick} isEditable={false} path={''} setData={setupdate_treeviewer4efee}/>
      </div>
    </div>
  );
}

export default TreeViewercountries

