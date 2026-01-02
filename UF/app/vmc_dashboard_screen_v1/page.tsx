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
import Groupvmc_dashboard_screen  from "./Groupvmc_dashboard_screen/Groupvmc_dashboard_screen";


export default function PageVmcDashboardScreenV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={
  "EQBAdmin": {
    "allowedGroups": [
      "canvas",
      "vmc_dashboard_screen",
      "maindashboard_cards",
      "line_chart_group",
      "bar_chart_group",
      "api_repo_table",
      "api_repositorys"
    ]
  },
  "EQBOperator": {
    "allowedGroups": []
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
  const {vmc_dashboard_screen_v1Props, setvmc_dashboard_screen_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkvmc_dashboard_screen,setCheckvmc_dashboard_screen,]=useState(false);
  const [checkmaindashboard_cards,setCheckmaindashboard_cards,]=useState(false);
  const [checkline_chart_group,setCheckline_chart_group,]=useState(false);
  const [checkbar_chart_group,setCheckbar_chart_group,]=useState(false);
  const [checkapi_repo_table,setCheckapi_repo_table,]=useState(false);
  const [checkapi_repositorys,setCheckapi_repositorys,]=useState(false);
  const {vmc_dashboard_screen43803, setvmc_dashboard_screen43803} = useContext(TotalContext) as TotalContextProps;
  const {maindashboard_cards0d32d, setmaindashboard_cards0d32d} = useContext(TotalContext) as TotalContextProps;
  const {line_chart_group23d18, setline_chart_group23d18} = useContext(TotalContext) as TotalContextProps;
  const {bar_chart_group93773, setbar_chart_group93773} = useContext(TotalContext) as TotalContextProps;
  const {api_repo_table83529, setapi_repo_table83529} = useContext(TotalContext) as TotalContextProps;
  const {api_repositorysb8178, setapi_repositorysb8178} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_line_chart_v1Props, setdfd_mongo_line_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_bar_chart_v1Props, setdfd_mongo_bar_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_maindashboard_v1Props, setdfd_mongo_maindashboard_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_repository_v1Props, setdfd_mongo_api_repository_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      mongo_line_chart_v1:false,
      mongo_bar_chart_v1:false,
      mongo_maindashboard_v1:false,
      mongo_api_repository_v1:false,
    });
    async function mongo_line_chart_v1(pagination:any){
        let mongo_line_chart_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Line_Chart:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_line_chart_v1Body["dpdKey"] = encryptionDpd;
          mongo_line_chart_v1Body["method"] = encryptionMethod;
        }
        if(vmc_dashboard_screen_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_dashboard_screen_v1Props.length;i++){
            if(vmc_dashboard_screen_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Line_Chart:AFVK:v1"){
              delete vmc_dashboard_screen_v1Props[i].DFDkey;
              filterData.push(vmc_dashboard_screen_v1Props[i])
            }           
          }
          mongo_line_chart_v1Body['filterData'] = filterData;
        }
        const mongo_line_chart_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_line_chart_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_line_chart_v1Data?.data?.dataset) {
          setdfd_mongo_line_chart_v1Props(mongo_line_chart_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_line_chart_v1Body?.key || ""
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
        setdfd_mongo_line_chart_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_line_chart_v1) {
      mongo_line_chart_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_line_chart_v1= true
  },[refetch?.mongo_line_chart_v1])
    async function mongo_bar_chart_v1(pagination:any){
        let mongo_bar_chart_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Bar_chart:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_bar_chart_v1Body["dpdKey"] = encryptionDpd;
          mongo_bar_chart_v1Body["method"] = encryptionMethod;
        }
        if(vmc_dashboard_screen_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_dashboard_screen_v1Props.length;i++){
            if(vmc_dashboard_screen_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Bar_chart:AFVK:v1"){
              delete vmc_dashboard_screen_v1Props[i].DFDkey;
              filterData.push(vmc_dashboard_screen_v1Props[i])
            }           
          }
          mongo_bar_chart_v1Body['filterData'] = filterData;
        }
        const mongo_bar_chart_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_bar_chart_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_bar_chart_v1Data?.data?.dataset) {
          setdfd_mongo_bar_chart_v1Props(mongo_bar_chart_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_bar_chart_v1Body?.key || ""
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
        setdfd_mongo_bar_chart_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_bar_chart_v1) {
      mongo_bar_chart_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_bar_chart_v1= true
  },[refetch?.mongo_bar_chart_v1])
    async function mongo_maindashboard_v1(pagination:any){
        let mongo_maindashboard_v1Body:te_refreshDto={
          key: "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          mongo_maindashboard_v1Body["dpdKey"] = encryptionDpd;
          mongo_maindashboard_v1Body["method"] = encryptionMethod;
        }
        if(vmc_dashboard_screen_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_dashboard_screen_v1Props.length;i++){
            if(vmc_dashboard_screen_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1"){
              delete vmc_dashboard_screen_v1Props[i].DFDkey;
              filterData.push(vmc_dashboard_screen_v1Props[i])
            }           
          }
          mongo_maindashboard_v1Body['filterData'] = filterData;
        }
        const mongo_maindashboard_v1Data:any=await AxiosService.post("/te/eventEmitter",mongo_maindashboard_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (mongo_maindashboard_v1Data?.data?.dataset) {
          setdfd_mongo_maindashboard_v1Props(mongo_maindashboard_v1Data?.data?.dataset?.data || []);
        }else{
         //////////////
        let dstKey:any=mongo_maindashboard_v1Body?.key || ""
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
        setdfd_mongo_maindashboard_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.mongo_maindashboard_v1) {
      mongo_maindashboard_v1(paginationData)
    }else 
      prevRefreshRef.current.mongo_maindashboard_v1= true
  },[refetch?.mongo_maindashboard_v1])
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
        if(vmc_dashboard_screen_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< vmc_dashboard_screen_v1Props.length;i++){
            if(vmc_dashboard_screen_v1Props[i].DFDkey == "CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1"){
              delete vmc_dashboard_screen_v1Props[i].DFDkey;
              filterData.push(vmc_dashboard_screen_v1Props[i])
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

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1",accessProfile:[user],from:"pageVmcDashboardScreenV1"},{
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1"  
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
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1"
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
    await mongo_line_chart_v1(pagination)
    await mongo_bar_chart_v1(pagination)
    await mongo_maindashboard_v1(pagination)
    await mongo_api_repository_v1(pagination)
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'vmc_dashboard_screen' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckvmc_dashboard_screen(true)
            }
            if(nodes?.groupName == 'maindashboard_cards' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckmaindashboard_cards(true)
            }
            if(nodes?.groupName == 'line_chart_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckline_chart_group(true)
            }
            if(nodes?.groupName == 'bar_chart_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckbar_chart_group(true)
            }
            if(nodes?.groupName == 'api_repo_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckapi_repo_table(true)
            }
            if(nodes?.groupName == 'api_repositorys' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckapi_repositorys(true)
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
          codeStates['vmc_dashboard_screen'] = vmc_dashboard_screen43803;
          codeStates['setvmc_dashboard_screen'] = setvmc_dashboard_screen43803;
          codeStates['maindashboard_cards'] = maindashboard_cards0d32d;
          codeStates['setmaindashboard_cards'] = setmaindashboard_cards0d32d;
          codeStates['line_chart_group'] = line_chart_group23d18;
          codeStates['setline_chart_group'] = setline_chart_group23d18;
          codeStates['bar_chart_group'] = bar_chart_group93773;
          codeStates['setbar_chart_group'] = setbar_chart_group93773;
          codeStates['api_repo_table'] = api_repo_table83529;
          codeStates['setapi_repo_table'] = setapi_repo_table83529;
          codeStates['api_repositorys'] = api_repositorysb8178;
          codeStates['setapi_repositorys'] = setapi_repositorysb8178;
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
        {checkvmc_dashboard_screen && initialLoad &&<Groupvmc_dashboard_screen  
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
    