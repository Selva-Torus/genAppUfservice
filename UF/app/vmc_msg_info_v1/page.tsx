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
import Groupvmc_msg_info  from "./Groupvmc_msg_info/Groupvmc_msg_info";


export default function PageVmcMsgInfoV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "EQBAdmin": {
    "allowedGroups": [
      "info_group",
      "vmc_msg_info",
      "info_summary_repository_group",
      "msg_group",
      "api_repository_groups",
      "info_summary_groups",
      "api_process_log"
    ]
  },
  "EQBOperator": {
    "allowedGroups": [
      "msg_group"
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
  const screenName:string = "vmc_dashboard_screen";
  const user = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {vmc_msg_info_v1Props, setvmc_msg_info_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkvmc_msg_info,setCheckvmc_msg_info,]=useState(false);
  const [checkinfo_summary_repository_group,setCheckinfo_summary_repository_group,]=useState(false);
  const [checkmsg_group,setCheckmsg_group,]=useState(false);
  const [checkapi_repository_groups,setCheckapi_repository_groups,]=useState(false);
  const [checkinfo_summary_groups,setCheckinfo_summary_groups,]=useState(false);
  const [checkapi_process_log,setCheckapi_process_log,]=useState(false);
  const {vmc_msg_infob41b0, setvmc_msg_infob41b0} = useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106c, setinfo_summary_repository_group8106c} = useContext(TotalContext) as TotalContextProps;
  const {msg_group609be, setmsg_group609be} = useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475a, setapi_repository_groupsb475a} = useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c} = useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_total_calls_v1Props, setdfd_mongo_total_calls_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_repository_v1Props, setdfd_mongo_api_repository_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_process_logs_v1Props, setdfd_mongo_api_process_logs_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      mongo_total_calls_v1:false,
      mongo_api_repository_v1:false,
      mongo_api_process_logs_v1:false,
    });
    async function mongo_total_calls_v1(pagination:any){
        let mongo_total_calls_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_total_calls_v1Body["dpdKey"] = encryptionDpd;
          mongo_total_calls_v1Body["method"] = encryptionMethod;
        }
        if(vmc_msg_info_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_msg_info_v1Props.length;i++){
            if(vmc_msg_info_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1"){
              delete vmc_msg_info_v1Props[i].DFDkey;
              filterData.push(vmc_msg_info_v1Props[i])
            }           
          }
          mongo_total_calls_v1Body['filterData'] = filterData;
        }
        const mongo_total_calls_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_total_calls_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_total_calls_v1Data?.data?.dataset) {
          setdfd_mongo_total_calls_v1Props(mongo_total_calls_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_total_calls_v1Body?.key || ""
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
        setdfd_mongo_total_calls_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_total_calls_v1) {
      mongo_total_calls_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_total_calls_v1= true
  },[refetch?.mongo_total_calls_v1])
    async function mongo_api_repository_v1(pagination:any){
        let mongo_api_repository_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_api_repository_v1Body["dpdKey"] = encryptionDpd;
          mongo_api_repository_v1Body["method"] = encryptionMethod;
        }
        if(vmc_msg_info_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_msg_info_v1Props.length;i++){
            if(vmc_msg_info_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1"){
              delete vmc_msg_info_v1Props[i].DFDkey;
              filterData.push(vmc_msg_info_v1Props[i])
            }           
          }
          mongo_api_repository_v1Body['filterData'] = filterData;
        }
        const mongo_api_repository_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_api_repository_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_api_repository_v1Data?.data?.dataset) {
          setdfd_mongo_api_repository_v1Props(mongo_api_repository_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_api_repository_v1Body?.key || ""
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
        setdfd_mongo_api_repository_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_api_repository_v1) {
      mongo_api_repository_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_api_repository_v1= true
  },[refetch?.mongo_api_repository_v1])
    async function mongo_api_process_logs_v1(pagination:any){
        let mongo_api_process_logs_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Process_Logs:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_api_process_logs_v1Body["dpdKey"] = encryptionDpd;
          mongo_api_process_logs_v1Body["method"] = encryptionMethod;
        }
        if(vmc_msg_info_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_msg_info_v1Props.length;i++){
            if(vmc_msg_info_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Process_Logs:AFVK:v1"){
              delete vmc_msg_info_v1Props[i].DFDkey;
              filterData.push(vmc_msg_info_v1Props[i])
            }           
          }
          mongo_api_process_logs_v1Body['filterData'] = filterData;
        }
        const mongo_api_process_logs_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_api_process_logs_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_api_process_logs_v1Data?.data?.dataset) {
          setdfd_mongo_api_process_logs_v1Props(mongo_api_process_logs_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_api_process_logs_v1Body?.key || ""
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
        setdfd_mongo_api_process_logs_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_api_process_logs_v1) {
      mongo_api_process_logs_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_api_process_logs_v1= true
  },[refetch?.mongo_api_process_logs_v1])

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",accessProfile:[user],from:"pageVmcMsgInfoV1"},{
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1"  
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1"
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
    "count": 1000
  },
  "encryption": {
    "isEnabled": false,
    "selectedDpd": "",
    "encryptionMethod": ""
  },
  "events": {}
};
        try{
    await mongo_total_calls_v1(pagination)
    await mongo_api_repository_v1(pagination)
    await mongo_api_process_logs_v1(pagination)
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'vmc_msg_info' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckvmc_msg_info(true)
            }
            if(nodes?.groupName == 'info_summary_repository_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckinfo_summary_repository_group(true)
            }
            if(nodes?.groupName == 'msg_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckmsg_group(true)
            }
            if(nodes?.groupName == 'api_repository_groups' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckapi_repository_groups(true)
            }
            if(nodes?.groupName == 'info_summary_groups' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckinfo_summary_groups(true)
            }
            if(nodes?.groupName == 'api_process_log' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckapi_process_log(true)
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
          codeStates['vmc_msg_info'] = vmc_msg_infob41b0;
          codeStates['setvmc_msg_info'] = setvmc_msg_infob41b0;
          codeStates['info_summary_repository_group'] = info_summary_repository_group8106c;
          codeStates['setinfo_summary_repository_group'] = setinfo_summary_repository_group8106c;
          codeStates['msg_group'] = msg_group609be;
          codeStates['setmsg_group'] = setmsg_group609be;
          codeStates['api_repository_groups'] = api_repository_groupsb475a;
          codeStates['setapi_repository_groups'] = setapi_repository_groupsb475a;
          codeStates['info_summary_groups'] = info_summary_groups8d62c;
          codeStates['setinfo_summary_groups'] = setinfo_summary_groups8d62c;
          codeStates['api_process_log'] = api_process_log17839;
          codeStates['setapi_process_log'] = setapi_process_log17839;
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
    routes.push("/vmc_dashboard_screen_v1");
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
    <div className='p-2 groupStyle'>
      <Button
          onClick={handleClick}
          size='s'
          className='flex items-center gap-1 '
          icon="FaAngleLeft"
      >
        <Text variant='body-3'>Back</Text>
      </Button>
    </div>
     <div className={clsx("",
        "w-full",
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
      )}
     style={{
        gridColumn: '',
        gridRow: '',
        gridAutoRows: '4px',
        columnGap: '',
        rowGap: '',
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
        {checkvmc_msg_info && initialLoad &&<Groupvmc_msg_info  
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
    