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


    const {dfd_mongo_navbar_v1Props,setdfd_mongo_navbar_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_navbarv2_v1Props,setdfd_mongo_navbarv2_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_maindashboard_v1Props,setdfd_mongo_maindashboard_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_line_chart_v1Props,setdfd_mongo_line_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_bar_chart_v1Props,setdfd_mongo_bar_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_api_repository_v1Props,setdfd_mongo_api_repository_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_total_calls_v1Props,setdfd_mongo_total_calls_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_mongo_api_process_logs_v1Props,setdfd_mongo_api_process_logs_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_vmc_error_logs_v1Props,setdfd_vmc_error_logs_v1Props} = useContext(TotalContext) as TotalContextProps;
    const {dfd_master_setup_v1Props,setdfd_master_setup_v1Props} = useContext(TotalContext) as TotalContextProps;
    const toast=useInfoMsg();
    const token:string = getCookie('token'); 

    return (nodename:any,page:any=1,count:any=10,dpdEncryption:any) => {
            if("navbar8dbd9"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbar:AFVK:v1",setdfd_mongo_navbar_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("navbarmx67b58"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Navbarv2:AFVK:v1",setdfd_mongo_navbarv2_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("most_used_msgfc11a"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1",setdfd_mongo_maindashboard_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("active_msg28606"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1",setdfd_mongo_maindashboard_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_requestsf3186"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1",setdfd_mongo_maindashboard_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("error403d0"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_MainDashboard:AFVK:v1",setdfd_mongo_maindashboard_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("line_chart8a506"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Line_Chart:AFVK:v1",setdfd_mongo_line_chart_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("bar_chart6e196"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Bar_chart:AFVK:v1",setdfd_mongo_bar_chart_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("source_msg_typef1a17"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("versiona455f"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("status5876f"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("release_date0c8e5"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("source_msg_typea3c5a"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("version95ead"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("status3a35d"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("release_date27b40"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Repository:AFVK:v1",setdfd_mongo_api_repository_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("total_callsfcfdc"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1",setdfd_mongo_total_calls_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("success_rate1130c"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1",setdfd_mongo_total_calls_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("error_ratead931"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Total_Calls:AFVK:v1",setdfd_mongo_total_calls_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("trs_created_date139eb"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Process_Logs:AFVK:v1",setdfd_mongo_api_process_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("source_contentc16b0"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Process_Logs:AFVK:v1",setdfd_mongo_api_process_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("target_contenta28ff"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Mongo_Api_Process_Logs:AFVK:v1",setdfd_mongo_api_process_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("dateandtime1297b"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",setdfd_vmc_error_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("source654ee"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",setdfd_vmc_error_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("message53ca9"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",setdfd_vmc_error_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("source78073"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",setdfd_vmc_error_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("message47a32"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:VMC_Error_Logs:AFVK:v1",setdfd_vmc_error_logs_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("bankcodef43ab"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1",setdfd_master_setup_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("countrycode49ad3"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1",setdfd_master_setup_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("schemetype061cd"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1",setdfd_master_setup_v1Props,page,count,dpdEncryption,toast,token);
            }
            if("scheme3daa2"==nodename){
                dfdRefreshContext("CK:CT261:FNGK:AF:FNK:DF-DFD:CATK:AG001:AFGK:A001:AFK:Master_Setup:AFVK:v1",setdfd_master_setup_v1Props,page,count,dpdEncryption,toast,token);
            }
    };
}

 