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
import GroupInfo_Group  from "./GroupInfo_Group/GroupInfo_Group";
import GroupSummary_Table  from "./GroupSummary_Table/GroupSummary_Table";
import GroupAPI_Process_Log_Table  from "./GroupAPI_Process_Log_Table/GroupAPI_Process_Log_Table";
import GroupAPI_Info  from "./GroupAPI_Info/GroupAPI_Info";


export default function PageTobApiInfoV1() {
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
  const [checkInfo_Group,setCheckInfo_Group,]=useState(false)
  const [checkSummary_Table,setCheckSummary_Table,]=useState(false)
  const [checkAPI_Process_Log_Table,setCheckAPI_Process_Log_Table,]=useState(false)
  const [checkAPI_Info,setCheckAPI_Info,]=useState(false)
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps   
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps   
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps   
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
        let orchestrationBody:any = {key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",accessProfile:[user],from:"pageTobApiInfoV1"}
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
            if(nodes?.groupName == 'Info_Group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckInfo_Group(true)
            }
            if(nodes?.groupName == 'Summary_Table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckSummary_Table(true)
            }
            if(nodes?.groupName == 'API_Process_Log_Table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckAPI_Process_Log_Table(true)
            }
            if(nodes?.groupName == 'API_Info' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckAPI_Info(true)
            }
          })
        }
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['Info_Group'] = Info_Groupaab7f
          codeStates['setInfo_Group'] = setInfo_Groupaab7f
          codeStates['Summary_Table'] = Summary_Table98cb0
          codeStates['setSummary_Table'] = setSummary_Table98cb0
          codeStates['API_Process_Log_Table'] = API_Process_Log_Table4f441
          codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441
          codeStates['API_Info'] = API_Info80710
          codeStates['setAPI_Info'] = setAPI_Info80710
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
        {  checkInfo_Group && <GroupInfo_Group  
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
        
        {  checkSummary_Table && <GroupSummary_Table  
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
        
        {  checkAPI_Process_Log_Table && <GroupAPI_Process_Log_Table  
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
        
        {  checkAPI_Info && <GroupAPI_Info  
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
    