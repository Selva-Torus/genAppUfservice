'use client'
import { Grid } from "@gravity-ui/page-constructor";
import { useLanguage } from "../components/languageContext";
import React,{ useContext } from "react";
import { AxiosService } from '@/app/components/axiosService'
import { uf_authorizationCheckDto,te_refreshDto,te_dfDto } from '@/app/interfaces/interfaces';
import { codeExecution } from "../utils/codeExecution";
import { useEffect, useState } from "react";
import { useInfoMsg } from "@/app/components/infoMsgHandler"
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
import { TotalContext, TotalContextProps } from "../globalContext";
import decodeToken from "../components/decodeToken";
import GroupConsent_Logs_Table  from "./GroupConsent_Logs_Table/GroupConsent_Logs_Table";


export default function PageTobConsentsLogsV1() {
  const language=useLanguage();
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps   
  const toast=useInfoMsg()
  const baseUrl:any=process.env.NEXT_PUBLIC_API_BASE_URL
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps 
  const [primaryTableData, setPrimaryTableData] = useState<any>({primaryKey:"",value:"",compName:""})
  const [checkToAdd, setCheckToAdd] = useState<any>({})
  const [dropdownData, setDropdownData] = useState<any>({})
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.selectedAccessProfile
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const [checkConsent_Logs_Table,setCheckConsent_Logs_Table,]=useState(false)
  const {Consent_Logs_Table87d37, setConsent_Logs_Table87d37} = useContext(TotalContext) as TotalContextProps
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps
  const encryptionFlagPage: boolean = false|| encAppFalg.flag;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encAppFalg.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encAppFalg.method
  let encryptionFlagPageData :any ={
    "flag":encryptionFlagPage,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }

  async function securityCheck() {
    let encryptionData:any = {};
    if (token) {
      try {
        let introspect:any;
        if(encryptionFlagPage){
           introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              dpdKey: encryptionDpd,
              method: encryptionMethod
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear()
        deleteAllCookies()
        window.location.href = '/ct242/tob001/tob002/v1'
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger')
        localStorage.clear()
        deleteAllCookies()
        window.location.href = '/ct242/tob001/tob002/v1'
      }
      try {
        let myAccount:any;
        if(encryptionFlagPage){
         myAccount = await AxiosService.get("/UF/myAccount-for-client",{
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            dpdKey: encryptionDpd,
            method: encryptionMethod
          }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           }
         })          
        }
        if( user != "" && user != null){
          setAccessProfile([user])
        }
        let orchestrationBody:any = {key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Consents_Logs:AFVK:v1",accessProfile:[user],from:"pageTobConsentsLogsV1"}
        if (encryptionFlagPage) {          
          orchestrationBody["dpdKey"] = encryptionDpd;
          orchestrationBody["method"] = encryptionMethod;
        }
        const orchestrationData = await AxiosService.post("/UF/Orchestration",orchestrationBody,{
          headers: {
            Authorization: `Bearer ${token}`
        }})
        const uf_dfKey:string[] = orchestrationData?.data?.DFkeys;
        const code:string = orchestrationData?.data?.code;
        const security:string = orchestrationData?.data?.security; 
        const allowedGroup:any[] = orchestrationData?.data?.allowedGroup||[]
        document.cookie = `dfKey=${uf_dfKey}`
        if(uf_dfKey.length > 0){
          let allEventEmitterKeys:any=eventEmitterData||[]
          for( const dfd_key of uf_dfKey)
          {
            let te_refreshBody:te_refreshDto={
              key: dfd_key,
              refreshFlag: "Y"
            }
            if (encryptionFlagPage) {          
              te_refreshBody["dpdKey"] = encryptionDpd;
              te_refreshBody["method"] = encryptionMethod;
            }
            const te_refresh:any=await AxiosService.post("/te/eventEmitter",te_refreshBody,{
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            if(te_refresh?.data?.error == true){
              toast(te_refresh?.data?.errorDetails?.message, 'danger')
              return
            }
            allEventEmitterKeys.push(te_refreshBody)
          }
          let uniqueEventEmitterKeys = allEventEmitterKeys.filter((value:any, index:any, self:any) => 
            index === self.findIndex((t:any) => t.key == value.key)
          );
          setEventEmitterData(uniqueEventEmitterKeys||[])
        }
        if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'Consent_Logs_Table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckConsent_Logs_Table(true)
            }
          })
        }
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['Consent_Logs_Table'] = Consent_Logs_Table87d37
          codeStates['setConsent_Logs_Table'] = setConsent_Logs_Table87d37
          codeExecution(code,codeStates)
        }       
      } catch (err: any) {
        toast(err?.message, 'danger')
      }
    
    }else{
      toast('token not found','danger')
    }    
  }

  useEffect(() => {    
    securityCheck()   
  }, [])


  return (
    <>
      <Grid containerClass="grid grid-cols-12 gap-2 " >
        {  checkConsent_Logs_Table && <GroupConsent_Logs_Table  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          dropdownData={dropdownData} 
          setDropdownData={setDropdownData}
          encryptionFlagPageData={encryptionFlagPageData}        />}
        
      </Grid> 
    </>
  )
}
    