'use client'
import React, { useContext,useEffect } from 'react' 
import { Text } from '@gravity-ui/uikit';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
const TextConnected_Application = ({encryptionFlagCompData}:any) => {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps;
  const token:string = getCookie('token'); 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {API_Report360bc, setAPI_Report360bc} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Report360bcContainValidataion, setAPI_Report360bcContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Repo_Table8836e, setAPI_Repo_Table8836e} = useContext(TotalContext) as TotalContextProps;
  const {isAPI_Repo_Table8836eContainValidataion, setAPI_Repo_Table8836eContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Connected_App_Tablecff73, setConnected_App_Tablecff73} = useContext(TotalContext) as TotalContextProps;
  const {isConnected_App_Tablecff73ContainValidataion, setConnected_App_Tablecff73ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const handleCode=async () => {
    let code:any;
    let orchestrationBody :any = {
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",
      componentId:"4bf572e7f63547d59e62cdd358ccff73",
      controlId:"dd527e02d0374f16b4e4e9ec677fcee9",
      isTable:false,
      accessProfile:accessProfile,
      from:"TextConnected Application"
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

  if (hide.textConnected_Applicationfcee9) {
    return <></>
  }
return (
  <div className="col-start-1 col-end-7 row-start-1 row-end-1 gap-10px" >
    <Text 
    >
    Connected Application
    </Text> 
  </div>
  )
}
export default TextConnected_Application