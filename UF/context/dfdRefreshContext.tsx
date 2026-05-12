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
    const {dfd_combocurrencysearch_v1Props,setdfd_combocurrencysearch_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_journey_v1Props,setdfd_journey_v1Props} = useContext(TotalContext) as TotalContextProps;
    const toast=useInfoMsg();
    const token:string = getCookie('token'); 

    return (nodename:any,page:any=1,count:any=10,dpdEncryption:any) => {
            if("product_code_view_allb0df6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_view_all33724"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_view_allc0a46"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_view_all54da6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_view_all88d6b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_view_alld4b39"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_view_all19d14"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_view_all82afd"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_failure_queue12297"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_failure_queue42953"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_failure_queue03c86"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_failure_queuef9d2d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_failure_queue95d4e"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_failure_queuea7246"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_failure_queue57c4d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_failure_queue09d7a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_success_queue7c209"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_success_queueeddaf"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_success_queuec805b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_operational_pending10a49"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_success_queueda254"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_success_queue60480"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_success_queueb80d4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_success_queue2f950"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code_return_queuee5e11"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name_return_queuebdabb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid_return_queue958c9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account_return_queuee94b2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount_return_queue2f324"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account_return_queue21a57"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_Amount_return_queue13fec"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info_return_queuef37f7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_created_date2cea8"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debtor_account_no963e4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debtor_namee2d9f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("creditor_account_noca692"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_currency703d2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:comboCurrencySearch:AFVK:v1",setdfd_combocurrencysearch_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_amount042b1"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuid29c9f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tran_journey1602a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("transaction_date_time14856"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("status88bc7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("processed_byd2b69"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debit_account36b40"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency9c8a2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("credit_account0d1f4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amount01416"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("transaction_reference500d6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",setdfd_transaction_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("xmlviewer9fe8d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("req_jsonviewerc80ab"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("res_jsonviewer9d6d1"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:journey:AFVK:v1",setdfd_journey_v1Props,page,count,dpdEncryption,toast,token);
            }
    };
}

 