'use client'
import { Grid } from "@gravity-ui/page-constructor";
import { useLanguage } from "../components/languageContext";
import React,{ useContext,useEffect,useState } from "react";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto,te_refreshDto,te_dfDto } from '@/app/interfaces/interfaces';
import { codeExecution } from "../utils/codeExecution";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from "../globalContext";
import decodeToken from "../components/decodeToken";
import { Icon, Button,Text } from '@gravity-ui/uikit';
import { ChevronLeft } from '@gravity-ui/icons';
import { useRouter } from 'next/navigation';
import Groupr_group  from "./Groupr_group/Groupr_group";


export default function PageReportV1() {
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "User": {
    "allowedGroups": [
      "report",
      "r_group"
    ]
  },
  "Manager": {
    "allowedGroups": [
      "report",
      "r_group"
    ]
  },
  "Employee": {
    "allowedGroups": [
      "report",
      "r_group"
    ]
  },
  "user": {
    "allowedGroups": [
      "report",
      "r_group"
    ]
  }
};
  let code:any="";
  //const language=useLanguage();
  const routes = useRouter();
  const toast=useInfoMsg();
  const [primaryTableData, setPrimaryTableData] = useState<any>({primaryKey:"",value:"",compName:""});
  const [checkToAdd, setCheckToAdd] = useState<any>({});
  const [dropdownData, setDropdownData] = useState<any>({});
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token);
  const user = decodedTokenObj?.selectedAccessProfile;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {reportcheck_v1Props, setreportcheck_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkr_group,setCheckr_group,]=useState(false);
  const {r_group358e4, setr_group358e4} = useContext(TotalContext) as TotalContextProps;
  const {dfd_fordfcheck_v1Props, setdfd_fordfcheck_v1Props} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagPage: boolean = false|| encAppFalg.flag;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encAppFalg.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encAppFalg.method;
  let encryptionFlagPageData :any ={
    "flag":encryptionFlagPage,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1",accessProfile:[user],from:"pageReportV1"},{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    const uf_dfKey:string[] = orchestrationData?.data?.DFkeys;
    const security:string = orchestrationData?.data?.security; 
    const allowedGroup:any[] = orchestrationData?.data?.allowedGroup||[];
    code = orchestrationData?.data?.code;
    const pagination:any = orchestrationData?.data?.action?.pagination;
    setpaginationDetails({
      page: +orchestrationData?.data?.action?.pagination?.page || 0,
      pageSize: +orchestrationData?.data?.action?.pagination?.count || 0
    })
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
              method: encryptionMethod,
              key:"CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1"  
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/tt407/cgfa/tg4cgfa/v1';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/tt407/cgfa/tg4cgfa/v1';
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
              method: encryptionMethod,
              key:"CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1"
            }
         })          
        }
        if( user != "" && user != null){
          setAccessProfile([user]);
        }
        let actionDetails:any = {
  "lock": {
    "lockMode": "",
    "name": "",
    "ttl": ""
  },
  "stateTransition": {
    "sourceQueue": "",
    "sourceStatus": "",
    "targetQueue": "",
    "targetStatus": ""
  },
  "pagination": {
    "page": "1",
    "count": "10"
  },
  "encryption": {
    "isEnabled": false,
    "selectedDpd": "",
    "encryptionMethod": ""
  },
  "events": {}
};
        try{
        let fordfcheck_v1Body:te_refreshDto={
          key: "CK:TT407:FNGK:AF:FNK:DF-DFD:CATK:CGFA:AFGK:TG4CGFA:AFK:forDFcheck:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          fordfcheck_v1Body["dpdKey"] = encryptionDpd;
          fordfcheck_v1Body["method"] = encryptionMethod;
        }
        if(reportcheck_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< reportcheck_v1Props.length;i++){
            if(reportcheck_v1Props[i].DFDkey == "CK:TT407:FNGK:AF:FNK:DF-DFD:CATK:CGFA:AFGK:TG4CGFA:AFK:forDFcheck:AFVK:v1"){
              delete reportcheck_v1Props[i].DFDkey;
              filterData.push(reportcheck_v1Props[i])
            }           
          }
          fordfcheck_v1Body['filterData'] = filterData;
        }
        const fordfcheck_v1Data:any=await AxiosService.post("/te/eventEmitter",fordfcheck_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          setdfd_fordfcheck_v1Props(fordfcheck_v1Data?.data?.dataset?.data || []);
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'r_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckr_group(true)
            }
          })
          }
           }catch(err:any)
          {
            if( typeof err =='string')
              toast(err, 'danger');
            else
              toast(err?.response?.data?.message, 'danger');
          }
        /////////
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['r_group'] = r_group358e4;
          codeStates['setr_group'] = setr_group358e4;
          codeExecution(code,codeStates);
        }   
        setInitialLoad(true);        
      } catch (err: any) {
        toast(err?.message, 'danger');
      }
    
    }else{
      toast('token not found','danger');
    }    
  }
  const handleClick = () => {
    routes.push("/");
  }

  useEffect(() => {    
    securityCheck();
  }, [])
  return (
    <>
     <div style={{}}>
        {checkr_group && initialLoad &&<Groupr_group  
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
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}        />}
        
          </div> 
    </>
  )
}
    