'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@gravity-ui/uikit';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
const TextAPI_ResourcePath = ({encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps;
  const token:string = getCookie('token'); 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps;
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps;
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const handleCode=async () => {
    let code:any;
    let orchestrationBody :any = {
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",
      componentId:"ed921e35e20448709154d79fac3aab7f",
      controlId:"c5ba1f12806c4e3e89f8071c7d5581bc",
      isTable:false,
      accessProfile:accessProfile,
      from:"TextAPI ResourcePath"
    }
     if(encryptionFlagCont) {
    orchestrationBody["dpdKey"] = encryptionDpd
    orchestrationBody["method"] = encryptionMethod
    }
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",orchestrationBody,{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code == '') {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
      }  else if (code != '') {
        let codeStates: any = {}
      codeExecution(code,codeStates)
      }
    }

  useEffect(() => {
     handleCode()
  }, [])

  if (hide.textAPI_ResourcePath581bc) {
    return <></>
  }
return (
  <div className="col-start-11 col-end-13 row-start-2 row-end-2 gap-" >
    <Text 
    >
    API_ResourcePath
    </Text> 
  </div>
  )
}
export default TextAPI_ResourcePath