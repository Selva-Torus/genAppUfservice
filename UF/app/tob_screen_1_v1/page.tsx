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
import GroupAPI_Report  from "./GroupAPI_Report/GroupAPI_Report";
import GroupAPI_Repo_Table  from "./GroupAPI_Repo_Table/GroupAPI_Repo_Table";
import GroupConnected_App_Table  from "./GroupConnected_App_Table/GroupConnected_App_Table";


export default function PageTobScreen1V1() {
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
  const [checkAPI_Report,setCheckAPI_Report,]=useState(false)
  const [checkAPI_Repo_Table,setCheckAPI_Repo_Table,]=useState(false)
  const [checkConnected_App_Table,setCheckConnected_App_Table,]=useState(false)
  const {API_Report360bc, setAPI_Report360bc} = useContext(TotalContext) as TotalContextProps   
  const {API_Repo_Table8836e, setAPI_Repo_Table8836e} = useContext(TotalContext) as TotalContextProps
  const {Connected_App_Tablecff73, setConnected_App_Tablecff73} = useContext(TotalContext) as TotalContextProps
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
        let orchestrationBody:any = {key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",accessProfile:[user],from:"pageTobScreen1V1"}
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
        // if(uf_dfKey.length > 0){
        //   let allEventEmitterKeys:any=eventEmitterData||[]
        //   for( const dfd_key of uf_dfKey)
        //   {
        //     let te_refreshBody:te_refreshDto={
        //       key: dfd_key,
        //       refreshFlag: "Y"
        //     }
        //     if (encryptionFlagPage) {          
        //       te_refreshBody["dpdKey"] = encryptionDpd;
        //       te_refreshBody["method"] = encryptionMethod;
        //     }
        //     const te_refresh:any=await AxiosService.post("/te/eventEmitter",te_refreshBody,{
        //       headers: {
        //         Authorization: `Bearer ${token}`
        //       }
        //     })
        //     if(te_refresh?.data?.error == true){
        //       toast(te_refresh?.data?.errorDetails?.message, 'danger')
        //       return
        //     }
        //     allEventEmitterKeys.push(te_refreshBody)
        //   }
        //   let uniqueEventEmitterKeys = allEventEmitterKeys.filter((value:any, index:any, self:any) => 
        //     index === self.findIndex((t:any) => t.key == value.key)
        //   );
        //   setEventEmitterData(uniqueEventEmitterKeys||[])
        // }
        if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'API_Report' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckAPI_Report(true)
            }
            if(nodes?.groupName == 'API_Repo_Table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckAPI_Repo_Table(true)
            }
            if(nodes?.groupName == 'Connected_App_Table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckConnected_App_Table(true)
            }
          })
        }
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['API_Report'] = API_Report360bc
          codeStates['setAPI_Report'] = setAPI_Report360bc
          codeStates['API_Repo_Table'] = API_Repo_Table8836e
          codeStates['setAPI_Repo_Table'] = setAPI_Repo_Table8836e
          codeStates['Connected_App_Table'] = Connected_App_Tablecff73
          codeStates['setConnected_App_Table'] = setConnected_App_Tablecff73
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
        {  checkAPI_Report && <GroupAPI_Report  
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
        
        {  checkAPI_Repo_Table && <GroupAPI_Repo_Table  
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
        
        {  checkConnected_App_Table && <GroupConnected_App_Table  
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
    