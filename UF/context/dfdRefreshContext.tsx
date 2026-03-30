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


    const {dfd_itax_source_tran_dfd_v1Props,setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_source_tran_dtl_dfd_v1Props,setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_tran_log_dfd_v1Props,setdfd_itax_tran_log_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_tran_error_log_dfd_v1Props,setdfd_itax_tran_error_log_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_source_tran_doc_dfd_v1Props,setdfd_itax_source_tran_doc_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_dashboard_cards_v1Props,setdfd_itax_dashboard_cards_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_bar_chart_dfd_v1Props,setdfd_itax_bar_chart_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_itax_pie_chart_dfd_v1Props,setdfd_itax_pie_chart_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const toast=useInfoMsg();
    const token:string = getCookie('token'); 

    return (nodename:any,page:any=1,count:any=10,dpdEncryption:any) => {
            if("itaxst_id95c9b"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("eslip_node051"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("slip_payment_code99bf8"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_advice_date42330"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_pin6f022"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_full_name0bab4"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_amount6ff13"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency925d5"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_event_process_status3d5ac"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prnb6d00"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("slip_payment_code9b31c"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_advice_date8473b"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_pina5a64"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_full_namee8e84"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_amount99179"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency50540"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_event_process_status332f5"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("itaxst_idda14c"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prnaf781"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("slip_payment_code66d40"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_advice_date1d75f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_pin72747"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_full_namea3d32"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_amountb9286"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency90f00"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_event_process_statusa505f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_textinput88273"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("slippaymentcodetextinputf76e3"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("taxpayerfullnametextinput0ac43"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("eslip_no1e386"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("itaxst_id1d5bd"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_status83532"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("pin7c9eb"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payers_name38781"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_amountd22c3"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency1ef9b"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_registration_date67d15"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_code65046"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_component64ca3"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_period5506c"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amountb7a3b"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("transaction_journey39171"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tran_categorycab42"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_log_DFD:AFVK:v1",setdfd_itax_tran_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("processing_systemcd502"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_log_DFD:AFVK:v1",setdfd_itax_tran_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("json_viewer235e2"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_log_DFD:AFVK:v1",setdfd_itax_tran_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tran_category15644"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Error_Log_DFD:AFVK:v1",setdfd_itax_tran_error_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("error_cateogryebc09"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Error_Log_DFD:AFVK:v1",setdfd_itax_tran_error_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("error_codeba00c"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Error_Log_DFD:AFVK:v1",setdfd_itax_tran_error_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("error_description64756"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Error_Log_DFD:AFVK:v1",setdfd_itax_tran_error_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("json_vieweree843"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Error_Log_DFD:AFVK:v1",setdfd_itax_tran_error_log_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_code9c2db"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_component9766e"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_period17a7c"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amount4e1d5"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Dtl_DFD:AFVK:v1",setdfd_itax_source_tran_dtl_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("balancedcbd7"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_amount46433"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debit_amountf2e0e"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("balanceb280e"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_amounte161d"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debit_amountbfd7f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debit_amountbbf1f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("loan_amt3440e"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("esip_no6f361"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("slip_payment_code983fc"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_advice_datefb2ad"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_pin2328b"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tax_payer_full_namef6644"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("itaxst_idd3e56"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_DFD:AFVK:v1",setdfd_itax_source_tran_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("approve_doc1f48f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Doc_DFD:AFVK:v1",setdfd_itax_source_tran_doc_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("itaxstd_iddb195"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Source_Tran_Doc_DFD:AFVK:v1",setdfd_itax_source_tran_doc_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_transactionse8381"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_initiated0750d"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("prn_approvedff8ef"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("credit_pendingdce75"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("credit_approved179f5"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("payment_completedeae7f"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard_Cards:AFVK:v1",setdfd_itax_dashboard_cards_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("bar_chart386dd"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Bar_Chart_DFD:AFVK:v1",setdfd_itax_bar_chart_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("pie_chartd26f3"==nodename){
                dfdRefreshContext("CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Pie_Chart_DFD:AFVK:v1",setdfd_itax_pie_chart_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
    };
}

 