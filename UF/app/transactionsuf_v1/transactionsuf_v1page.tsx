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
import Grouptransactions  from "./Grouptransactions/Grouptransactions";


export default function PageTransactionsufV1() {
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "Employee": {
    "allowedGroups": [
      "transactions"
    ]
  },
  "userTemplate": {
    "allowedGroups": [
      "transactions"
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
  const {transactionsuf_v1Props, settransactionsuf_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checktransactions,setChecktransactions,]=useState(false);
  const {transactions10ab7, settransactions10ab7} = useContext(TotalContext) as TotalContextProps;
   

  const {transactionsdfd_v1Props, settransactionsdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {testtablecheck2_v1Props, settesttablecheck2_v1Props} = useContext(TotalContext) as TotalContextProps;
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
        let transactionsdfd_v1Body:te_refreshDto={
          key: "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1"+":",
          refreshFlag: "Y",
          count:actionDetails?.pagination?.count || 10,
          page:actionDetails?.pagination?.page || 1
        }
        if (encryptionFlagPage) {          
          transactionsdfd_v1Body["dpdKey"] = encryptionDpd;
          transactionsdfd_v1Body["method"] = encryptionMethod;
        }
        if(transactionsuf_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< transactionsuf_v1Props.length;i++){
            if(transactionsuf_v1Props[i].DFDkey == "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1"){
              delete transactionsuf_v1Props[i].DFDkey;
              filterData.push(transactionsuf_v1Props[i])
            }           
          }
          transactionsdfd_v1Body['filterData'] = filterData;
        }
        const transactionsdfd_v1Data:any=await AxiosService.post("/te/eventEmitter",transactionsdfd_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(transactionsdfd_v1Data?.data?.error == true){
          toast(transactionsdfd_v1Data?.data?.errorDetails?.message, 'danger');        
        }else{
          settransactionsdfd_v1Props(transactionsdfd_v1Data?.data?.dataset?.data || []);
        }
        let testtablecheck2_v1Body:te_refreshDto={
          key: "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"+":",
          refreshFlag: "Y",
          count:actionDetails?.pagination?.count || 10,
          page:actionDetails?.pagination?.page || 1
        }
        if (encryptionFlagPage) {          
          testtablecheck2_v1Body["dpdKey"] = encryptionDpd;
          testtablecheck2_v1Body["method"] = encryptionMethod;
        }
        if(transactionsuf_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< transactionsuf_v1Props.length;i++){
            if(transactionsuf_v1Props[i].DFDkey == "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"){
              delete transactionsuf_v1Props[i].DFDkey;
              filterData.push(transactionsuf_v1Props[i])
            }           
          }
          testtablecheck2_v1Body['filterData'] = filterData;
        }
        const testtablecheck2_v1Data:any=await AxiosService.post("/te/eventEmitter",testtablecheck2_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(testtablecheck2_v1Data?.data?.error == true){
          toast(testtablecheck2_v1Data?.data?.errorDetails?.message, 'danger');        
        }else{
          settesttablecheck2_v1Props(testtablecheck2_v1Data?.data?.dataset?.data || []);
        }
        /////////
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['transactions'] = transactions10ab7;
          codeStates['settransactions'] = settransactions10ab7;
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
        {securityData[accessProfile]?.allowedGroups?.includes("transactions") && initialLoad && <Grouptransactions  
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
    