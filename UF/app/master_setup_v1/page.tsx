'use client'
import { useLanguage } from "../components/languageContext";
import React,{ useContext,useEffect,useState,useRef } from "react";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto,te_refreshDto,te_dfDto,api_paginationDto } from '@/app/interfaces/interfaces';
import { codeExecution } from "../utils/codeExecution";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from "../globalContext";
import decodeToken from "../components/decodeToken";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import clsx from "clsx";
import Groupadd_master_setup  from "./Groupadd_master_setup/Groupadd_master_setup";


export default function PageMasterSetupV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "EQBAdmin": {
    "allowedGroups": [
      "canvas",
      "add_master_setup",
      "master_setup",
      "backscheme_setup",
      "update_treeviewer"
    ]
  },
  "EQBOperator": {
    "allowedGroups": [
      "canvas",
      "add_master_setup",
      "master_setup",
      "backscheme_setup",
      "update_treeviewer"
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
  const screenName:string = "master_setup";
  const user = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {add_master_setup_v1Props, setadd_master_setup_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkadd_master_setup,setCheckadd_master_setup,]=useState(false);
  const [checkmaster_setup,setCheckmaster_setup,]=useState(false);
  const [checkbackscheme_setup,setCheckbackscheme_setup,]=useState(false);
  const [checkupdate_treeviewer,setCheckupdate_treeviewer,]=useState(false);
  const {add_master_setup46681, setadd_master_setup46681} = useContext(TotalContext) as TotalContextProps;
  const {master_setup8bca5, setmaster_setup8bca5} = useContext(TotalContext) as TotalContextProps;
  const {backscheme_setupae907, setbackscheme_setupae907} = useContext(TotalContext) as TotalContextProps;
  const {update_treeviewer4efee, setupdate_treeviewer4efee} = useContext(TotalContext) as TotalContextProps;
  const {dfd_master_setup_v1Props, setdfd_master_setup_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const [paginationData,setPaginationData]=useState<any>({count:10,page:1})
    const prevRefreshRef = useRef({
      master_setup_v1:false,
    });
    async function master_setup_v1(pagination:any){
        let master_setup_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          master_setup_v1Body["dpdKey"] = encryptionDpd;
          master_setup_v1Body["method"] = encryptionMethod;
        }
        if(add_master_setup_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< add_master_setup_v1Props.length;i++){
            if(add_master_setup_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1"){
              delete add_master_setup_v1Props[i].DFDkey;
              filterData.push(add_master_setup_v1Props[i])
            }           
          }
          master_setup_v1Body['filterData'] = filterData;
        }
        const master_setup_v1Data:any=await AxiosService.post("/te/eventEmitter",master_setup_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (master_setup_v1Data?.data?.dataset) {
          setdfd_master_setup_v1Props(master_setup_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=master_setup_v1Body?.key || ""
        dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");

        const api_paginationBody: api_paginationDto = {
          key: dstKey,
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        // if(encryptionFlagCont) {
        // api_paginationBody["dpdKey"] = encryptionDpd
        // api_paginationBody["method"] = encryptionMethod
        // }
        const api_paginationData:any = await AxiosService.post(
          '/UF/pagination',
          api_paginationBody,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (api_paginationData?.data?.error == true) {
          toast(api_paginationData?.data?.errorDetails?.message, 'danger')
          return
        }
        setdfd_master_setup_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.master_setup_v1) {
      master_setup_v1(paginationData)
    }else 
      prevRefreshRef.current.master_setup_v1= true
  },[refetch?.master_setup_v1])

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1",accessProfile:[user],from:"pageMasterSetupV1"},{
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1"  
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct261/ag001/a001/v1';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct261/ag001/a001/v1';
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1"
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
    await master_setup_v1(pagination)
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'add_master_setup' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckadd_master_setup(true)
            }
            if(nodes?.groupName == 'master_setup' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckmaster_setup(true)
            }
            if(nodes?.groupName == 'backscheme_setup' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckbackscheme_setup(true)
            }
            if(nodes?.groupName == 'Update_TreeViewer' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckupdate_treeviewer(true)
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
          codeStates['add_master_setup'] = add_master_setup46681;
          codeStates['setadd_master_setup'] = setadd_master_setup46681;
          codeStates['master_setup'] = master_setup8bca5;
          codeStates['setmaster_setup'] = setmaster_setup8bca5;
          codeStates['backscheme_setup'] = backscheme_setupae907;
          codeStates['setbackscheme_setup'] = setbackscheme_setupae907;
          codeStates['update_treeviewer'] = update_treeviewer4efee;
          codeStates['setupdate_treeviewer'] = setupdate_treeviewer4efee;
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
  const handleOnload=()=>{
  }

  useEffect(() => {    
    setMemoryVariables((prev: any) => ({
      ...prev,
      screenName: screenName,    
    }))
    securityCheck();
    handleOnload();
  }, [])
  return (
    <>
     <div className={clsx("",
        "w-full",
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
      )}
     style={{
        gridColumn: '',
        gridRow: '',
        gridAutoRows: '4px',
        columnGap: '0px',
        rowGap: '0px',
        display: "grid",
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: '',
        height: '',
        overflow: '',
        backgroundColor:'#ffffff',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: '',
        color: textStyle,
       // minHeight: '100vh',
        ...(isHighContrast && {
          fontWeight: '500',
          borderWidth: '2px'
      })
      }}>
        {checkadd_master_setup && initialLoad &&<Groupadd_master_setup  
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
    