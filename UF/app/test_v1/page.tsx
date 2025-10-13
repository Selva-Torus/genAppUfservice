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
import Groupmain  from "./Groupmain/Groupmain";


export default function PageTestV1() {
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={};
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
  const {forpfcheckuf_v1Props, setforpfcheckuf_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkmain,setCheckmain,]=useState(false);
  const [checkgroupa,setCheckgroupa,]=useState(false);
  const [checkgroupb,setCheckgroupb,]=useState(false);
  const [checkgroupc,setCheckgroupc,]=useState(false);
  const [checkgroupd,setCheckgroupd,]=useState(false);
  const {main6d2c7, setmain6d2c7} = useContext(TotalContext) as TotalContextProps;
  const {groupad476b, setgroupad476b} = useContext(TotalContext) as TotalContextProps;
  const {groupb66b0d, setgroupb66b0d} = useContext(TotalContext) as TotalContextProps;
  const {groupc59a19, setgroupc59a19} = useContext(TotalContext) as TotalContextProps;
  const {groupde191f, setgroupde191f} = useContext(TotalContext) as TotalContextProps;
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
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1",accessProfile:[user],from:"pageTestV1"},{
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
              key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1"  
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
              key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1"
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
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'main' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckmain(true)
            }
            if(nodes?.groupName == 'groupA' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckgroupa(true)
            }
            if(nodes?.groupName == 'groupB' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckgroupb(true)
            }
            if(nodes?.groupName == 'groupC' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckgroupc(true)
            }
            if(nodes?.groupName == 'groupD' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckgroupd(true)
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
          codeStates['main'] = main6d2c7;
          codeStates['setmain'] = setmain6d2c7;
          codeStates['groupa'] = groupad476b;
          codeStates['setgroupa'] = setgroupad476b;
          codeStates['groupb'] = groupb66b0d;
          codeStates['setgroupb'] = setgroupb66b0d;
          codeStates['groupc'] = groupc59a19;
          codeStates['setgroupc'] = setgroupc59a19;
          codeStates['groupd'] = groupde191f;
          codeStates['setgroupd'] = setgroupde191f;
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
     <div style={{"gap":"16","gridAutoRows":"100px","minHeight":"100vh","padding":"0rem","backgroundColor":"#ffffff","display":"grid","gridTemplateColumns":"repeat(12, 1fr)"}}>
        {checkmain && initialLoad &&<Groupmain  
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
    