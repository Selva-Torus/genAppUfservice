// old logic
// "use client"
// import { TotalContext, TotalContextProps } from "../globalContext";
// import { useContext } from "react";

// // Pure function that does the logic
// export function handledfdrefresh(nodename:any, setRefetch:any){
//     let data:any = {
//   name973ca: 'userdfd_v1',
//   agee3b87: 'userdfd_v1',
//   user_ida2a2a: 'usedetailsdfd_v1',
//   phonebc3ea: 'usedetailsdfd_v1',
//   id76e97: 'usedetailsdfd_v1',
//   checkpc644a: 'usedetailsdfd_v1',
//   progress3b6ff: 'userdfd_v1'
// }


//     if(nodename in data)
//     {
//         setRefetch((pre:any)=>({...pre,[data[nodename]]:!pre[data[nodename]]}))
//     }

//     return
// }

// // Hook that uses context - call this from your components
// export function useHandleDfdRefresh(){
//     const {setRefetch} = useContext(TotalContext) as TotalContextProps;

//     return (nodename:any) => {
//         handledfdrefresh(nodename, setRefetch);
//     };
// }
//----------------------------------


"use client"
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { useContext } from "react";
import { api_paginationDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
let inProgressKeys:any[] = [];

export async function dfdRefreshContext(dfdkey:any,setState:any,page:any,count:any,dpdEncryption:any,toast:any,token:any){
  if (inProgressKeys.includes(dfdkey)) {
    return; 
  }
  inProgressKeys.push(dfdkey)
  
  try{
    let usedetailsdfd_v1Body:te_refreshDto={
          key: dfdkey+":",
          refreshFlag: "Y",
          count:parseInt(count) || 10,
          page:parseInt(page) || 1
    }
    if (dpdEncryption?.encryptionFlagPage) {          
      usedetailsdfd_v1Body["dpdKey"] = dpdEncryption?.encryptionDpd;
      usedetailsdfd_v1Body["method"] = dpdEncryption?.encryptionMethod;
    }
    // if(parentchildindivitualsave_v1Props.length > 0){
    //   let filterData :any[] =[];
    //   for(let i=0;i< parentchildindivitualsave_v1Props.length;i++){
    //     if(parentchildindivitualsave_v1Props[i].DFDkey == dfdkey){
    //       delete parentchildindivitualsave_v1Props[i].DFDkey;
    //       filterData.push(parentchildindivitualsave_v1Props[i])
    //     }           
    //   }
    //   usedetailsdfd_v1Body['filterData'] = filterData;
    // }
    const usedetailsdfd_v1Data:any=await AxiosService.post("/te/eventEmitter",usedetailsdfd_v1Body,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (usedetailsdfd_v1Data?.data?.dataset) {
      setState(usedetailsdfd_v1Data?.data?.dataset?.data || []);
    }else{
      //////////////
    let dstKey:any=usedetailsdfd_v1Body?.key || ""
    dstKey=dstKey.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");

    const api_paginationBody: api_paginationDto = {
      key: dstKey,
      count:parseInt(count) || 10,
      page:parseInt(page) || 1
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
    setState(api_paginationData?.data?.records || []);
    }
    return
  }catch(err){
    console.log(err)
  }
  finally{
     const index = inProgressKeys.indexOf(dfdkey);
      if (index > -1) {
        inProgressKeys.splice(index, 1);
      }
  }
}



export function useHandleDfdRefresh(){


    const {dfd_transaction_v1Props,setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_journey_v1Props,setdfd_journey_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_combocurrencysearch_v1Props,setdfd_combocurrencysearch_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_scansaveprocessdfd_v1Props,setdfd_scansaveprocessdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_crbankcodedropdowndfd_v1Props,setdfd_crbankcodedropdowndfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_forexcurrencydropdowndfd_v1Props,setdfd_forexcurrencydropdowndfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_documentlistdfd_v1Props,setdfd_documentlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_errorlistdfd_v1Props,setdfd_errorlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_transactionlistdfd_v1Props,setdfd_transactionlistdfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const toast=useInfoMsg();
    const token:string = getCookie('token'); 

    return (nodename:any,page:any=1,count:any=10,dpdEncryption:any) => {
            if("product_code_view_allb0df6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_view_all33724"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_view_allc0a46"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_view_all54da6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_view_all88d6b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_view_alld4b39"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_view_all19d14"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_view_all82afd"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("view_all_journeyd3ae9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_failure_queue12297"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_failure_queue42953"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_failure_queue03c86"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_failure_queuef9d2d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_failure_queue95d4e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_failure_queuea7246"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_failure_queue57c4d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_failure_queue09d7a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("failure_queue_journeyc8638"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_success_queue7c209"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_success_queueeddaf"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_success_queuec805b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_operational_pending10a49"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_success_queueda254"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_success_queue60480"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_success_queueb80d4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_success_queue2f950"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("success_queue_journey68ac9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_return_queuee5e11"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_return_queuebdabb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_return_queue958c9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_return_queuee94b2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_return_queue2f324"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_return_queue21a57"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_return_queue13fec"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_return_queuef37f7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("return_queue_journeycc9d3"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_operational_pending6ecd4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_operational_pending2ab87"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_operational_pendinga8ff6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_operational_pending5146b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_operational_pending70e3f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_operational_pendingf9a9c"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_operational_pendingbce21"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_operational_pending282bc"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("operational_pending_journey1a1a5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_technical_pending11fe0"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_technical_pendinge182f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_technical_pendingbc6bb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_technical_pendingbc856"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_technical_pending5e6cc"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_technical_pending3c4aa"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_technical_pending1bc34"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_technical_pending78349"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("technical_pending_journey6601c"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_created_date2cea8"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debtor_account_no963e4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debtor_namee2d9f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("creditor_account_noca692"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_currency703d2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:comboCurrencySearch:AFVK:v1",setdfd_combocurrencysearch_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_amount042b1"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid29c9f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account27abb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_name84266"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("base_currencyb386d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("waive_charges929e5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_bank_code8a2bc"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:crBankCodeDropDownDfd:AFVK:v1",setdfd_crbankcodedropdowndfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_bank_name434eb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_bank_bic3d26f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:crBankCodeDropDownDfd:AFVK:v1",setdfd_crbankcodedropdowndfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("forex_currency65e0b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:forexCurrencyDropDownDfd:AFVK:v1",setdfd_forexcurrencydropdowndfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("exchange_rate88caf"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("rate_codee56ad"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("rate_ref_no82399"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("rate_cust_idad42a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("additional_reff63a3"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("fileName7c104"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:documentListDfd:AFVK:v1",setdfd_documentlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("vldCode0c0ce"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:errorListDfd:AFVK:v1",setdfd_errorlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("vldReason2ef16"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:errorListDfd:AFVK:v1",setdfd_errorlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tran_idb50e3"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_acnt_no4ba0e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_acnt_nobfce7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amnt3f6e2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_bank_codee3623"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("created_byd32da"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("created_datee821e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transactionListDfd:AFVK:v1",setdfd_transactionlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("file_name_rtgs_list61a4b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:documentListDfd:AFVK:v1",setdfd_documentlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("vld_code_rtgs_lstfc45a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:errorListDfd:AFVK:v1",setdfd_errorlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("vld_reason_rtgs_listd8f6e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:errorListDfd:AFVK:v1",setdfd_errorlistdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("transaction_date_time14856"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("status88bc7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("processed_byd2b69"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debit_account36b40"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency9c8a2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("credit_account0d1f4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amount01416"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("transaction_reference500d6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("xmlviewer9fe8d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("req_jsonviewer8d071"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("res_jsonviewerdd261"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("base_amount07fca"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("forex_currency5f04f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("forex_amount0f335"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_bank_code2906e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account42642"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_name3bc5b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info64004"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_cust_ac_balance3be3f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_cust_ac_sanc_lmt955a9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1",setdfd_scansaveprocessdfd_v1Props,page,count,dpdEncryption,toast,token);
            }
    };
}

 