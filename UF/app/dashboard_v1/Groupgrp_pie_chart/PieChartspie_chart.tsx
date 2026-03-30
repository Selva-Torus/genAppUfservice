
'use client'
import { useContext, useEffect, useState, useRef } from 'react';
import { codeExecution } from '@/app/utils/codeExecution';
import { getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from '@/app/components/axiosService';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useGlobal } from '@/context/GlobalContext'
import { Tooltip } from '@/components/Tooltip'
import {PieChart} from '@/components/PieChart';
import { Text } from "@/components/Text";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { Card } from '@/components/Card';
import i18n from '@/app/components/i18n';

type ContentAlign = "left" | "center" | "right";

interface PieChartspieChartCompProps {
  encryptionFlagCompData: any;
}

export default function PieChartspie_chart({ 
  encryptionFlagCompData,
}: PieChartspieChartCompProps) {
  const token: string = getCookie('token');
  const { globalState, setGlobalState } = useContext(TotalContext) as TotalContextProps
  const { accessProfile, setAccessProfile } = useContext(TotalContext) as TotalContextProps
  const [data,setData] = useState<any>([]);
  const {dfd_itax_pie_chart_dfd_v1Props, setdfd_itax_pie_chart_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef(false);
  const toast:any=useInfoMsg();
  const keyset:any=i18n.keyset("language"); 
 
  /////////////
   //another screen
  const {itaxgroup732e5, setitaxgroup732e5}= useContext(TotalContext) as TotalContextProps;  
  const {itaxgroup732e5Props, setitaxgroup732e5Props}= useContext(TotalContext) as TotalContextProps;  
  const {overall_dashboard54180, setoverall_dashboard54180}= useContext(TotalContext) as TotalContextProps;  
  const {overall_dashboard54180Props, setoverall_dashboard54180Props}= useContext(TotalContext) as TotalContextProps;  
  const {grp_total_transactionse00c2, setgrp_total_transactionse00c2}= useContext(TotalContext) as TotalContextProps;  
  const {grp_total_transactionse00c2Props, setgrp_total_transactionse00c2Props}= useContext(TotalContext) as TotalContextProps;  
  const {grp_prn_initiated2f421, setgrp_prn_initiated2f421}= useContext(TotalContext) as TotalContextProps;  
  const {grp_prn_initiated2f421Props, setgrp_prn_initiated2f421Props}= useContext(TotalContext) as TotalContextProps;  
  const {grp_prn_approvedb95cb, setgrp_prn_approvedb95cb}= useContext(TotalContext) as TotalContextProps;  
  const {grp_prn_approvedb95cbProps, setgrp_prn_approvedb95cbProps}= useContext(TotalContext) as TotalContextProps;  
  const {grp_credit_pendingfe0e2, setgrp_credit_pendingfe0e2}= useContext(TotalContext) as TotalContextProps;  
  const {grp_credit_pendingfe0e2Props, setgrp_credit_pendingfe0e2Props}= useContext(TotalContext) as TotalContextProps;  
  const {grp_credit_approved7e3bd, setgrp_credit_approved7e3bd}= useContext(TotalContext) as TotalContextProps;  
  const {grp_credit_approved7e3bdProps, setgrp_credit_approved7e3bdProps}= useContext(TotalContext) as TotalContextProps;  
  const {grp_payment_completed34dec, setgrp_payment_completed34dec}= useContext(TotalContext) as TotalContextProps;  
  const {grp_payment_completed34decProps, setgrp_payment_completed34decProps}= useContext(TotalContext) as TotalContextProps;  
  const {grp_bar_chart02e16, setgrp_bar_chart02e16}= useContext(TotalContext) as TotalContextProps;  
  const {grp_bar_chart02e16Props, setgrp_bar_chart02e16Props}= useContext(TotalContext) as TotalContextProps;  
  const {grp_pie_chart2415d, setgrp_pie_chart2415d}= useContext(TotalContext) as TotalContextProps;  
  const {grp_pie_chart2415dProps, setgrp_pie_chart2415dProps}= useContext(TotalContext) as TotalContextProps;  
  const {pie_chartd26f3, setpie_chartd26f3}= useContext(TotalContext) as TotalContextProps;  
  //////////////
  
  const handleMapperDetails=async()=>{
    try{
     // orchestration API call 
    const orchestrationData: any = await AxiosService.post(
    '/UF/Orchestration',
      {
        key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard:AFVK:v1",
        componentId: "fc1b6ebba3034adc97af59cfffa2415d",
        controlId: "6fda478536b647a7a0461d41808d26f3",
        isTable: false,
        accessProfile:accessProfile,
        from:"checkbox"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ) 
    let code:any= orchestrationData?.data?.code ;
    if (code != '') {
        let codeStates: any = {}
        codeStates['itaxgroup']  = itaxgroup732e5,
        codeStates['setitaxgroup'] = setitaxgroup732e5,
        codeStates['overall_dashboard']  = overall_dashboard54180,
        codeStates['setoverall_dashboard'] = setoverall_dashboard54180,
        codeStates['grp_total_transactions']  = grp_total_transactionse00c2,
        codeStates['setgrp_total_transactions'] = setgrp_total_transactionse00c2,
        codeStates['grp_prn_initiated']  = grp_prn_initiated2f421,
        codeStates['setgrp_prn_initiated'] = setgrp_prn_initiated2f421,
        codeStates['grp_prn_approved']  = grp_prn_approvedb95cb,
        codeStates['setgrp_prn_approved'] = setgrp_prn_approvedb95cb,
        codeStates['grp_credit_pending']  = grp_credit_pendingfe0e2,
        codeStates['setgrp_credit_pending'] = setgrp_credit_pendingfe0e2,
        codeStates['grp_credit_approved']  = grp_credit_approved7e3bd,
        codeStates['setgrp_credit_approved'] = setgrp_credit_approved7e3bd,
        codeStates['grp_payment_completed']  = grp_payment_completed34dec,
        codeStates['setgrp_payment_completed'] = setgrp_payment_completed34dec,
        codeStates['grp_bar_chart']  = grp_bar_chart02e16,
        codeStates['setgrp_bar_chart'] = setgrp_bar_chart02e16,
        codeStates['grp_pie_chart']  = grp_pie_chart2415d,
        codeStates['setgrp_pie_chart'] = setgrp_pie_chart2415d,
      codeExecution(code,codeStates)
      }
      if(Array.isArray(dfd_itax_pie_chart_dfd_v1Props) && dfd_itax_pie_chart_dfd_v1Props?.length > 0){
        setData(dfd_itax_pie_chart_dfd_v1Props)
        setgrp_pie_chart2415d((pre:any)=>({...pre,name:dfd_itax_pie_chart_dfd_v1Props[0]?.name}))
      }
      if(Array.isArray(dfd_itax_pie_chart_dfd_v1Props)){
        return
      }
    }catch(err){
      console.log(err)
    }
  }
  

useEffect(() => {
  if (prevRefreshRef.current) {
    handleMapperDetails()
  }else 
  prevRefreshRef.current= true
},[pie_chartd26f3?.refresh])

useEffect(() => {
  if(Array.isArray(dfd_itax_pie_chart_dfd_v1Props) && dfd_itax_pie_chart_dfd_v1Props?.length > 0){
    setData(dfd_itax_pie_chart_dfd_v1Props)
    setgrp_pie_chart2415d((pre:any)=>({...pre,name:dfd_itax_pie_chart_dfd_v1Props[0]?.name}))
  }
},[dfd_itax_pie_chart_dfd_v1Props])

  if (pie_chartd26f3?.isHidden) {
    return <></>
  }
   return (
    <div
      className="w-full h-full"
      style={{gridColumn: `1 / 25`,gridRow: `1 / 121`, gap:``, height: `100%`}}
    >
      <PieChart
        data={data}
        title  = {`${keyset("Transaction Status")}`}
        fillContainer={true}
        className = ""
        contentAlign="left"
      />      
    </div>
  )
}
