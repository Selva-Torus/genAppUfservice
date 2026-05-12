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
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import clsx from "clsx";
import { getAftfactLevelRule } from "../utils/evaluateDecisionTable";
import { fetchBatchData } from "../utils/Orchestration";
import Grouptran_main_group  from "./Grouptran_main_group/Grouptran_main_group";


export default function PageMyTransactionV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } : { isDark: boolean; isHighContrast: boolean; bgStyle: string; textStyle: string } = useTheme();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const securityData : SecurityData = {
  "IT Team": {
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ]
  },
  "Business Team": {
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ]
  },
  "Operation Team": {
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ]
  }
};
  let code : string = "";
  //const language=useLanguage();
  const routes : AppRouterInstance = useRouter();
  const toast : Function = useInfoMsg();
  const [primaryTableData, setPrimaryTableData] = useState<PrimaryTableData>({primaryKey:"",value:"",compName:""});
  const [checkToAdd, setCheckToAdd] = useState<Record<string, any>>({});
  const allRuleData:any={
  "tran_main_group": {},
  "tran_tab_group": {
    "outbound_or_inbound": {
      "show": false
    },
    "search": {
      "show": false
    },
    "refresh": {
      "show": false
    },
    "download": {
      "show": false
    }
  },
  "view_all_tab": {},
  "view_all_table": {
    "product_code_view_all": {
      "show": false
    },
    "channel_name_view_all": {
      "show": false
    },
    "uuid_view_all": {
      "show": false
    },
    "dr_account_view_all": {
      "show": false
    },
    "dr_amount_view_all": {
      "show": false
    },
    "cr_account_view_all": {
      "show": false
    },
    "cr_amount_view_all": {
      "show": false
    },
    "remittance_info_view_all": {
      "show": false
    },
    "status_view_all": {
      "show": false
    },
    "log_btn": {
      "show": false
    }
  },
  "failure_queue_tab": {},
  "failure_queue_table": {
    "product_code_failure_queue": {
      "show": false
    },
    "channel_name_failure_queue": {
      "show": false
    },
    "uuid_failure_queue": {
      "show": false
    },
    "dr_account_failure_queue": {
      "show": false
    },
    "dr_amount_failure_queue": {
      "show": false
    },
    "cr_account_failure_queue": {
      "show": false
    },
    "cr_amount_failure_queue": {
      "show": false
    },
    "remittance_info_failure_queue": {
      "show": false
    },
    "status_failure_queue": {
      "show": false
    }
  },
  "success_queue_tab": {},
  "success_queue_table": {
    "product_code_success_queue": {
      "show": false
    },
    "channel_name_success_queue": {
      "show": false
    },
    "uuid_success_queue": {
      "show": false
    },
    "dr_account_operational_pending": {
      "show": false
    },
    "dr_amount_success_queue": {
      "show": false
    },
    "cr_account_success_queue": {
      "show": false
    },
    "cr_amount_success_queue": {
      "show": false
    },
    "remittance_info_success_queue": {
      "show": false
    },
    "status_success_queue": {
      "show": false
    }
  },
  "return_queue_tab": {},
  "return_queue_table": {
    "product_code_return_queue": {
      "show": false
    },
    "channel_name_return_queue": {
      "show": false
    },
    "uuid_return_queue": {
      "show": false
    },
    "dr_account_return_queue": {
      "show": false
    },
    "dr_amount_return_queue": {
      "show": false
    },
    "cr_account_return_queue": {
      "show": false
    },
    "cr_amount_return_queue": {
      "show": false
    },
    "remittance_info_return_queue": {
      "show": false
    },
    "status_return_queue": {
      "show": false
    }
  }
}
  const token:string = getCookie('token'); 
  const decodedTokenObj: DecodedToken = decodeToken(token);
  const screenName:string = "my transaction";
  const user : string | undefined = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const [tableData, setTableData] = useState<any[]>([]);  
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {transaction_v1, settransaction_v1} = useContext(TotalContext) as TotalContextProps;
  const {transaction_v1Props, settransaction_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checktran_main_group,setChecktran_main_group,]=useState<boolean>(false);
  const [checkview_all_table,setCheckview_all_table,]=useState<boolean>(false);
  const [checkfailure_queue_table,setCheckfailure_queue_table,]=useState<boolean>(false);
  const [checksuccess_queue_table,setChecksuccess_queue_table,]=useState<boolean>(false);
  const [checkreturn_queue_table,setCheckreturn_queue_table,]=useState<boolean>(false);
  const {tran_main_group1dc7f, settran_main_group1dc7f} = useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87, setview_all_tablec9e87} = useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f} = useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae} = useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0} = useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64, settran_tab_group08b64} = useContext(TotalContext) as TotalContextProps;
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [controlData, setControlData] = useState<any>({});
  const [groupData, setGroupData] = useState<any>({});
  const encryptionFlagPage: boolean = false|| encAppFalg.flag;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encAppFalg.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encAppFalg.method;
  let encryptionFlagPageData : EncryptionFlagPageData ={
    "flag":encryptionFlagPage,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }
  const [paginationDetails, setpaginationDetails] = useState<Record<string, any>>({});
  const [paginationData,setPaginationData]=useState<PaginationData>({count:10,page:1})
    const prevRefreshRef = useRef<any>({
      transaction_v1:false,
    });
    async function transaction_v1DFD(pagination:any): Promise<void>{
        let filterData :any[] =[];
        let transaction_v1Body:te_refreshDto={
          key: "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          transaction_v1Body["dpdKey"] = encryptionDpd;
          transaction_v1Body["method"] = encryptionMethod;
        }
        if(transaction_v1Props.length > 0){
          for(let i=0;i< transaction_v1Props.length;i++){
            if(transaction_v1Props[i].DFDkey == "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"){
              // delete transaction_v1Props[i].DFDkey;
              let temp=structuredClone(transaction_v1Props[i])
              delete temp?.DFDkey
              filterData.push(temp)
            }           
          }
          transaction_v1Body['filterData'] = filterData;
        }
        const transaction_v1Data:any=await AxiosService.post("/te/eventEmitter",transaction_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        let dstKey:string=transaction_v1Body?.key || ""
        dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
        if(transaction_v1Data?.data?.dataset === 'Bulk Data Processing'){
          if(filterData.length>0){
            const api_paginationBody: api_paginationDto = {
          key: dstKey,
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1,
          filterData:filterData
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
        setdfd_transaction_v1Props(api_paginationData?.data?.records || []);
      }else{
          setdfd_transaction_v1Props({ hasLogicCenter: false, dstKey: dstKey })
      }
      }else if (transaction_v1Data?.data?.dataset) {
           setdfd_transaction_v1Props(
              Array.isArray(transaction_v1Data?.data?.dataset?.data)
                 ? transaction_v1Data?.data.dataset.data.map((obj: any) =>
                  Object.fromEntries(
                    Object.entries(obj || {}).map(([key, value]) => [
                      key.toLowerCase(),
                      value
                    ])
                  )
                )
              : []
          );   
        }else{
         //////////////
        

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
        setdfd_transaction_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.transaction_v1) {
      transaction_v1DFD(paginationData)
    }else 
      prevRefreshRef.current.transaction_v1= true
  },[refetch?.transaction_v1])
  const handleArtfactRule=async(rule:any,data:any={},allRuleData:any)=>{
    let result :any =await getAftfactLevelRule(rule,data,allRuleData)
    settransaction_v1({...result,_artfactPFRule_:rule})
  }

  async function securityCheck(): Promise<void> {
    const data: any = await fetchBatchData(
      'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1',
      [user],
      'pageMyTransactionV1',
      token
    )
    const orchestrationData: any = data.pageData
    setGroupData(data.groupData || {});
    setControlData(data.controlData || {});
    const uf_dfKey:string[] = orchestrationData?.DFkeys;
    const security:string = orchestrationData?.security; 
    const allowedGroup: AllowedGroupNode[] = orchestrationData?.allowedGroup||[];
    code = orchestrationData?.code;
    const pagination:any = orchestrationData?.action?.pagination;
    setpaginationDetails({
      page: +orchestrationData?.action?.pagination?.page || 0,
      pageSize: +orchestrationData?.action?.pagination?.count || 0
    })
    if("artfactPFRule" in orchestrationData && orchestrationData?.artfactPFRule?.nodes?.length>0){
      await handleArtfactRule(orchestrationData?.artfactPFRule,{...decodedTokenObj},allRuleData)  
      let result :any =await getAftfactLevelRule(orchestrationData?.artfactPFRule,{...decodedTokenObj,session:decodedTokenObj},allRuleData)
    }
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
              key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"  
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct005/gss/vgph/v1';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct005/gss/vgph/v1';
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
              key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"
            }
         })          
        }
        if( user != "" && user != null){
          setAccessProfile([user]);
        }
        let actionDetails:ActionDetails = {
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
    "count": 1000000
  },
  "encryption": {
    "isEnabled": false,
    "selectedDpd": "",
    "encryptionMethod": ""
  },
  "events": {}
};
        try{
    await transaction_v1DFD(pagination)
          if (security == 'AA' || security == 'RA') {
          allowedGroup.map((nodes:AllowedGroupNode)=>{
            if(nodes?.groupName == 'tran_main_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setChecktran_main_group(true)
            }
            if(nodes?.groupName == 'view_all_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckview_all_table(true)
            }
            if(nodes?.groupName == 'failure_queue_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckfailure_queue_table(true)
            }
            if(nodes?.groupName == 'success_queue_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setChecksuccess_queue_table(true)
            }
            if(nodes?.groupName == 'return_queue_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckreturn_queue_table(true)
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
          let codeStates: Record<string, any> = {}
          codeStates['tran_main_group'] = tran_main_group1dc7f;
          codeStates['settran_main_group'] = settran_main_group1dc7f;
          codeStates['view_all_table'] = view_all_tablec9e87;
          codeStates['setview_all_table'] = setview_all_tablec9e87;
          codeStates['failure_queue_table'] = failure_queue_tablea476f;
          codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f;
          codeStates['success_queue_table'] = success_queue_table63aae;
          codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae;
          codeStates['return_queue_table'] = return_queue_table267f0;
          codeStates['setreturn_queue_table'] = setreturn_queue_table267f0;
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
  const handleClick = (): void => {
    routes.push("/");
  }
  const handleOnload = (): void => {
  }

  useEffect(() => {    
    setMemoryVariables((prev: Record<string, string>) => ({
      ...prev,
      screenName: screenName,    
    }))
    securityCheck();
    handleOnload();
    settransaction_v1(allRuleData)
  }, [])

  useEffect(()=>{
    if(transaction_v1?._artfactPFRule_)
    {
      let data:any ={
        ...decodedTokenObj,
        session:decodedTokenObj,
tran_tab_group:tran_tab_group08b64.tran_tab_group,      }
      handleArtfactRule(transaction_v1?._artfactPFRule_,data,allRuleData)
    }
  },[tran_tab_group08b64.tran_tab_group,])
  return (
    <>

     <div className={clsx("",
        "w-full",
        isDark ? 'text-white' : 'text-black',
        isProcessing && "pointer-events-none select-none"
      )}
     style={{
        gridColumn: '',
        gridRow: '',
        gridAutoRows: '4px',
        columnGap: '0px',
        rowGap: '0px',
        display: "grid",
        gridTemplateColumns: 'repeat(24, 1fr)',
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
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-900/80 px-6 py-4 text-sm text-white shadow-lg backdrop-blur">
            {/* Spinner */}
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

            {/* Text */}
            <span className="font-medium tracking-wide">
              Processing, please wait…
            </span>
          </div>
        </div>
      )}
        {checktran_main_group && initialLoad &&<Grouptran_main_group
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          tableData={tableData}
          setTableData={setTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}
          controlData={controlData} 
          groupData={groupData}        />}
        
      </div> 
    </>
  )
}
    