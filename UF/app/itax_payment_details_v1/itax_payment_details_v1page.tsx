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
import Groupprn_details_group  from "./Groupprn_details_group/Groupprn_details_group";


export default function PageItaxPaymentDetailsV1() {
  const { isDark, isHighContrast, bgStyle, textStyle } : { isDark: boolean; isHighContrast: boolean; bgStyle: string; textStyle: string } = useTheme();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const securityData : SecurityData = {
  "Branch Officer": {
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ]
  },
  "Branch Manager": {
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ]
  },
  "Credit Approver": {
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ]
  },
  "System Administrator": {
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ]
  }
};
  let code : string = "";
  //const language=useLanguage();
  const routes : AppRouterInstance = useRouter();
  const toast : Function = useInfoMsg();
  const [primaryTableData, setPrimaryTableData] = useState<PrimaryTableData>({primaryKey:"",value:"",compName:""});
  const [checkToAdd, setCheckToAdd] = useState<Record<string, any>>({});
  const token:string = getCookie('token'); 
  const decodedTokenObj: DecodedToken = decodeToken(token);
  const screenName:string = "transaction";
  const user : string | undefined = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {itax_payment_details_v1Props, setitax_payment_details_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkprn_details_group,setCheckprn_details_group,]=useState<boolean>(false);
  const [checkprn_datails_table,setCheckprn_datails_table,]=useState<boolean>(false);
  const [checksubscreen_group,setChecksubscreen_group,]=useState<boolean>(false);
  const [checkct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1,setCheckct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1,]=useState<boolean>(false);
  const [checkpayment_type_cheque_group,setCheckpayment_type_cheque_group,]=useState<boolean>(false);
  const [checkct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1,setCheckct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1,]=useState<boolean>(false);
  const [checkpayment_type_dt_group,setCheckpayment_type_dt_group,]=useState<boolean>(false);
  const {prn_details_group00560, setprn_details_group00560} = useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52} = useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414} = useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86} = useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd} = useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7} = useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_source_tran_dtl_dfd_v1Props, setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const [paginationData,setPaginationData]=useState<PaginationData>({count:10,page:1})
    const prevRefreshRef = useRef<any>({
      itax_source_tran_dtl_dfd_v1:false,
      itax_source_tran_dfd_v1:false,
    });
    async function itax_source_tran_dtl_dfd_v1(pagination:any): Promise<void>{
        let itax_source_tran_dtl_dfd_v1Body:te_refreshDto={
          key: "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          itax_source_tran_dtl_dfd_v1Body["dpdKey"] = encryptionDpd;
          itax_source_tran_dtl_dfd_v1Body["method"] = encryptionMethod;
        }
        if(itax_payment_details_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< itax_payment_details_v1Props.length;i++){
            if(itax_payment_details_v1Props[i].DFDkey == "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1"){
              delete itax_payment_details_v1Props[i].DFDkey;
              filterData.push(itax_payment_details_v1Props[i])
            }           
          }
          itax_source_tran_dtl_dfd_v1Body['filterData'] = filterData;
        }
        const itax_source_tran_dtl_dfd_v1Data:any=await AxiosService.post("/te/eventEmitter",itax_source_tran_dtl_dfd_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        let dstKey:string=itax_source_tran_dtl_dfd_v1Body?.key || ""
        dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
        if(itax_source_tran_dtl_dfd_v1Data?.data?.dataset === 'Bulk Data Processing'){
          setdfd_itax_source_tran_dtl_dfd_v1Props({ hasLogicCenter: false, dstKey: dstKey })
        }else if (itax_source_tran_dtl_dfd_v1Data?.data?.dataset) {
          setdfd_itax_source_tran_dtl_dfd_v1Props(itax_source_tran_dtl_dfd_v1Data?.data?.dataset?.data || []);
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
        setdfd_itax_source_tran_dtl_dfd_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.itax_source_tran_dtl_dfd_v1) {
      itax_source_tran_dtl_dfd_v1(paginationData)
    }else 
      prevRefreshRef.current.itax_source_tran_dtl_dfd_v1= true
  },[refetch?.itax_source_tran_dtl_dfd_v1])
    async function itax_source_tran_dfd_v1(pagination:any): Promise<void>{
        let itax_source_tran_dfd_v1Body:te_refreshDto={
          key: "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1"+":",
          refreshFlag: "Y",
          count:parseInt(pagination?.count) || 10,
          page:parseInt(pagination?.page) || 1
        }
        if (encryptionFlagPage) {          
          itax_source_tran_dfd_v1Body["dpdKey"] = encryptionDpd;
          itax_source_tran_dfd_v1Body["method"] = encryptionMethod;
        }
        if(itax_payment_details_v1Props.length > 0){
          let filterData :any[] =[];
          for(let i=0;i< itax_payment_details_v1Props.length;i++){
            if(itax_payment_details_v1Props[i].DFDkey == "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1"){
              delete itax_payment_details_v1Props[i].DFDkey;
              filterData.push(itax_payment_details_v1Props[i])
            }           
          }
          itax_source_tran_dfd_v1Body['filterData'] = filterData;
        }
        const itax_source_tran_dfd_v1Data:any=await AxiosService.post("/te/eventEmitter",itax_source_tran_dfd_v1Body,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        let dstKey:string=itax_source_tran_dfd_v1Body?.key || ""
        dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
        if(itax_source_tran_dfd_v1Data?.data?.dataset === 'Bulk Data Processing'){
          setdfd_itax_source_tran_dfd_v1Props({ hasLogicCenter: false, dstKey: dstKey })
        }else if (itax_source_tran_dfd_v1Data?.data?.dataset) {
          setdfd_itax_source_tran_dfd_v1Props(itax_source_tran_dfd_v1Data?.data?.dataset?.data || []);
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
        setdfd_itax_source_tran_dfd_v1Props(api_paginationData?.data?.records || []);
        }
      }
  useEffect(()=>{
    if (prevRefreshRef?.current?.itax_source_tran_dfd_v1) {
      itax_source_tran_dfd_v1(paginationData)
    }else 
      prevRefreshRef.current.itax_source_tran_dfd_v1= true
  },[refetch?.itax_source_tran_dfd_v1])

  async function securityCheck(): Promise<void> {
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",accessProfile:[user],from:"pageItaxPaymentDetailsV1"},{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    const uf_dfKey:string[] = orchestrationData?.data?.DFkeys;
    const security:string = orchestrationData?.data?.security; 
    const allowedGroup: AllowedGroupNode[] = orchestrationData?.data?.allowedGroup||[];
    code = orchestrationData?.data?.code;
    const pagination:any = orchestrationData?.data?.action?.pagination;
    setpaginationDetails({
      page: +orchestrationData?.data?.action?.pagination?.page || 0,
      pageSize: +orchestrationData?.data?.action?.pagination?.count || 0
    })
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
              key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"  
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct010/i001/itax/v1';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct010/i001/itax/v1';
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
              key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"
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
    "count": 10000
  },
  "encryption": {
    "isEnabled": false,
    "selectedDpd": "",
    "encryptionMethod": ""
  },
  "events": {}
};
        try{
    await itax_source_tran_dtl_dfd_v1(pagination)
    await itax_source_tran_dfd_v1(pagination)
          if (security == 'AA' || security == 'RA') {
          allowedGroup.map((nodes:AllowedGroupNode)=>{
            if(nodes?.groupName == 'prn_details_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckprn_details_group(true)
            }
            if(nodes?.groupName == 'prn_datails_table' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckprn_datails_table(true)
            }
            if(nodes?.groupName == 'subscreen_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setChecksubscreen_group(true)
            }
            if(nodes?.groupName == 'CT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v1' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1(true)
            }
            if(nodes?.groupName == 'payment_type_cheque_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckpayment_type_cheque_group(true)
            }
            if(nodes?.groupName == 'CT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1(true)
            }
            if(nodes?.groupName == 'payment_type_dt_group' && (nodes?.security== 'AA' || nodes?.security == 'ATO' || nodes?.security == 'RA'))
            {
              setCheckpayment_type_dt_group(true)
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
          codeStates['prn_details_group'] = prn_details_group00560;
          codeStates['setprn_details_group'] = setprn_details_group00560;
          codeStates['prn_datails_table'] = prn_datails_table2ad52;
          codeStates['setprn_datails_table'] = setprn_datails_table2ad52;
          codeStates['subscreen_group'] = subscreen_groupc0414;
          codeStates['setsubscreen_group'] = setsubscreen_groupc0414;
          codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86;
          codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86;
          codeStates['payment_type_cheque_group'] = payment_type_cheque_group239dd;
          codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd;
          codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7;
          codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7;
          codeStates['payment_type_dt_group'] = payment_type_dt_groupedf52;
          codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52;
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
  }, [])
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
        <div className="absolute inset-0 z-50 flex items-center justify-center">
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
        {checkprn_details_group && initialLoad &&<Groupprn_details_group
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}        />}
        
      </div> 
    </>
  )
}
    