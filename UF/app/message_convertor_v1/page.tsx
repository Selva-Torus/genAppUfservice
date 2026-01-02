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
import Groupoperations  from "./Groupoperations/Groupoperations";


export default function PageMessageConvertorV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "EQBAdmin": {
    "allowedGroups": []
  },
  "EQBOperator": {
    "allowedGroups": [
      "canvas",
      "operations",
      "write_group"
    ]
  },
  "DTBOperator": {
    "allowedGroups": [
      "canvas",
      "operations",
      "write_group"
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
  const screenName:string = "message_convertor";
  const user = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {vmc_operations_v1_v1Props, setvmc_operations_v1_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkoperations,setCheckoperations,]=useState(false);
  const [checkwrite_group,setCheckwrite_group,]=useState(false);
  const {operations58572, setoperations58572} = useContext(TotalContext) as TotalContextProps;
  const {write_group55231, setwrite_group55231} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_navbar_v1Props, setdfd_mongo_navbar_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_navbarv2_v1Props, setdfd_mongo_navbarv2_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      mongo_navbar_v1:false,
      mongo_navbarv2_v1:false,
    });
    async function mongo_navbar_v1(pagination:any){
        let mongo_navbar_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbar:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_navbar_v1Body["dpdKey"] = encryptionDpd;
          mongo_navbar_v1Body["method"] = encryptionMethod;
        }
        if(vmc_operations_v1_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_operations_v1_v1Props.length;i++){
            if(vmc_operations_v1_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbar:AFVK:v1"){
              delete vmc_operations_v1_v1Props[i].DFDkey;
              filterData.push(vmc_operations_v1_v1Props[i])
            }           
          }
          mongo_navbar_v1Body['filterData'] = filterData;
        }
        const mongo_navbar_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_navbar_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_navbar_v1Data?.data?.dataset) {
          setdfd_mongo_navbar_v1Props(mongo_navbar_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_navbar_v1Body?.key || ""
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
        setdfd_mongo_navbar_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_navbar_v1) {
      mongo_navbar_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_navbar_v1= true
  },[refetch?.mongo_navbar_v1])
    async function mongo_navbarv2_v1(pagination:any){
        let mongo_navbarv2_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbarv2:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_navbarv2_v1Body["dpdKey"] = encryptionDpd;
          mongo_navbarv2_v1Body["method"] = encryptionMethod;
        }
        if(vmc_operations_v1_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_operations_v1_v1Props.length;i++){
            if(vmc_operations_v1_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbarv2:AFVK:v1"){
              delete vmc_operations_v1_v1Props[i].DFDkey;
              filterData.push(vmc_operations_v1_v1Props[i])
            }           
          }
          mongo_navbarv2_v1Body['filterData'] = filterData;
        }
        const mongo_navbarv2_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_navbarv2_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_navbarv2_v1Data?.data?.dataset) {
          setdfd_mongo_navbarv2_v1Props(mongo_navbarv2_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_navbarv2_v1Body?.key || ""
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
        setdfd_mongo_navbarv2_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_navbarv2_v1) {
      mongo_navbarv2_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_navbarv2_v1= true
  },[refetch?.mongo_navbarv2_v1])

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1",accessProfile:[user],from:"pageMessageConvertorV1"},{
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1"  
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1"
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
    await mongo_navbar_v1(pagination)
    await mongo_navbarv2_v1(pagination)
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'operations' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckoperations(true)
            }
            if(nodes?.groupName == 'write_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckwrite_group(true)
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
          codeStates['operations'] = operations58572;
          codeStates['setoperations'] = setoperations58572;
          codeStates['write_group'] = write_group55231;
          codeStates['setwrite_group'] = setwrite_group55231;
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
        backgroundColor:bgStyle,
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
        {checkoperations && initialLoad &&<Groupoperations  
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
    