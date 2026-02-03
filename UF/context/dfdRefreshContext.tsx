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


    const {dfd_get_transaction_dfd_v1Props,setdfd_get_transaction_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_master_system_setup_dfd_v1Props,setdfd_master_system_setup_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_cdc_checker_action_dfd_v1Props,setdfd_cdc_checker_action_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
    const toast=useInfoMsg();
    const token:string = getCookie('token'); 

    return (nodename:any,page:any=1,count:any=10,dpdEncryption:any) => {
            if("product_code27e26"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuidb02c5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name1516d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("settlement_date32e82"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_account5a90a"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amount8f415"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_currencycb231"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_accountf334f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info30960"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("charge_type3dd6d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_codea1bf6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuidd1032"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_name0e1ca"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("settlement_date202a2"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_accountf4175"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_amountaa5df"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dr_currency3c79d"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("cr_account6ee89"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info74cbb"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("channel_named9a37"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code9a692"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("directionbf471"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("charge_type977c5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("debtor_account0655c"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("creditor_accounts82148"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("amountc2ae9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("currency124c5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("uuide86ae"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("process_type45fad"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("tran_category81c97"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("settlement_datea6baf"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("remittance_info57b4b"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",setdfd_get_transaction_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_code523b7"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("setup_code88cd6"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("interface_productd9133"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("category80c2f"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("sub_categoryd81c5"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("purpose3b7f4"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("system_setup_dynamic_formf3526"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1",setdfd_master_system_setup_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("api_endpointa0340"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("setup_code4eedf"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("api_namebdd52"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("approve_id82664"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("product_key121a1"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("http_methoda99b9"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("setup_cd7cc97"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("api_endpt39a78"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("pdt_cd70f76"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("aprl_id47e91"==nodename){
                dfdRefreshContext("CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_DFD:AFVK:v1",setdfd_cdc_checker_action_dfd_v1Props,page,count,dpdEncryption,toast,token);
            }
    };
}

 