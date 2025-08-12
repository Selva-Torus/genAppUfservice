'use client'
import { Grid } from "@gravity-ui/page-constructor";
import { useLanguage } from "../components/languageContext";
import React,{ useContext } from "react";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto,te_refreshDto,te_dfDto } from '@/app/interfaces/interfaces';
import { codeExecution } from "../utils/codeExecution";
import { useEffect, useState } from "react";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from "../globalContext";
import decodeToken from "../components/decodeToken";
import { Icon, Button,Text } from '@gravity-ui/uikit';
import { ChevronLeft } from '@gravity-ui/icons';
import { useRouter } from 'next/navigation';
import Groupform  from "./Groupform/Groupform";
import Grouppostgres  from "./Grouppostgres/Grouppostgres";


export default function PageFormitemV1() {
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "Employee": {
    "allowedGroups": [
      "form",
      "postgres"
    ]
  },
  "userTemplate": {
    "allowedGroups": [
      "form",
      "postgres"
    ]
  }
};
  const code:any="";
  //const language=useLanguage();
  const routes = useRouter();
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const toast=useInfoMsg();
  const baseUrl:any=process.env.NEXT_PUBLIC_API_BASE_URL;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const [primaryTableData, setPrimaryTableData] = useState<any>({primaryKey:"",value:"",compName:""});
  const [checkToAdd, setCheckToAdd] = useState<any>({});
  const [dropdownData, setDropdownData] = useState<any>({});
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token);
  const user = decodedTokenObj?.selectedAccessProfile;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {showprofile_v1Props, setshowprofile_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkform,setCheckform,]=useState(false);
  const [checkpostgres,setCheckpostgres,]=useState(false);
  const {formdaeb3, setformdaeb3} = useContext(TotalContext) as TotalContextProps;
  const {postgres7f5c4, setpostgres7f5c4} = useContext(TotalContext) as TotalContextProps;
   

  const {vesseldfd_v1Props, setvesseldfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {v_billingdfd_v1Props, setv_billingdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
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
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct003/cg/tg2/v11';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct003/cg/tg2/v11';
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

        ///////
        let vesseldfd_v1Body:te_refreshDto={
          key: "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:vesselDFD:AFVK:v1"+":",
          refreshFlag: "Y",
          count:actionDetails?.pagination?.count || 10,
          page:actionDetails?.pagination?.page || 1
        }
        if (encryptionFlagPage) {          
          vesseldfd_v1Body["dpdKey"] = encryptionDpd;
          vesseldfd_v1Body["method"] = encryptionMethod;
        }
        if(showprofile_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< showprofile_v1Props.length;i++){
            if(showprofile_v1Props[i].DFDkey == "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:vesselDFD:AFVK:v1"){
              delete showprofile_v1Props[i].DFDkey;
              filterData.push(showprofile_v1Props[i])
            }           
          }
          vesseldfd_v1Body['filterData'] = filterData;
        }
        const vesseldfd_v1Data:any=await AxiosService.post("/te/eventEmitter",vesseldfd_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(vesseldfd_v1Data?.data?.error == true){
          toast(vesseldfd_v1Data?.data?.errorDetails?.message, 'danger');        
        }else{
          setvesseldfd_v1Props(vesseldfd_v1Data?.data?.dataset?.data || []);
        }
        let v_billingdfd_v1Body:te_refreshDto={
          key: "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:v_billingDFD:AFVK:v1"+":",
          refreshFlag: "Y",
          count:actionDetails?.pagination?.count || 10,
          page:actionDetails?.pagination?.page || 1
        }
        if (encryptionFlagPage) {          
          v_billingdfd_v1Body["dpdKey"] = encryptionDpd;
          v_billingdfd_v1Body["method"] = encryptionMethod;
        }
        if(showprofile_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< showprofile_v1Props.length;i++){
            if(showprofile_v1Props[i].DFDkey == "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:v_billingDFD:AFVK:v1"){
              delete showprofile_v1Props[i].DFDkey;
              filterData.push(showprofile_v1Props[i])
            }           
          }
          v_billingdfd_v1Body['filterData'] = filterData;
        }
        const v_billingdfd_v1Data:any=await AxiosService.post("/te/eventEmitter",v_billingdfd_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(v_billingdfd_v1Data?.data?.error == true){
          toast(v_billingdfd_v1Data?.data?.errorDetails?.message, 'danger');        
        }else{
          setv_billingdfd_v1Props(v_billingdfd_v1Data?.data?.dataset?.data || []);
        }
        /////////
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['form'] = formdaeb3;
          codeStates['setform'] = setformdaeb3;
          codeStates['postgres'] = postgres7f5c4;
          codeStates['setpostgres'] = setpostgres7f5c4;
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
      <Grid containerClass="grid grid-cols-12 gap-2 " >
        {securityData[accessProfile]?.allowedGroups?.includes("form") && initialLoad && <Groupform  
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
        
        {securityData[accessProfile]?.allowedGroups?.includes("postgres") && initialLoad && <Grouppostgres  
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
    