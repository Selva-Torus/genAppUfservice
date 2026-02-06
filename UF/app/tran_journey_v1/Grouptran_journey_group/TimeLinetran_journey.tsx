'use client'
import React, { useContext, useState, useEffect } from 'react';
import { AxiosService } from "@/app/components/axiosService";
import { getFilterProps } from '@/app/utils/assemblerKeys';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { te_refreshDto,api_paginationDto} from '@/app/interfaces/interfaces';
import { TimeLine } from '@/components/TimeLine';
import {Modal} from '@/components/Modal';
import PageTranJourneyDtlpage from '@/app/tran_journey_dtl_v1/tran_journey_dtl_v1page';
import PageTranJourneyErrorDtlpage from '@/app/tran_journey_error_dtl_v1/tran_journey_error_dtl_v1page';
const TimeLinetran_journey = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => { 
  const token: string = getCookie('token');
  const {dfd_tran_journey_db_query_v1Props, setdfd_tran_journey_db_query_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({})
  const [allCode,setAllCode]=useState<any>("");
  const [steps, setSteps] = useState<any[]>([]);
    /////////////
  //another screen

  const {tran_journey_error_dtl_v1Props, settran_journey_error_dtl_v1Props}= useContext(TotalContext) as TotalContextProps; 
  const {tran_journey_groupbe7ae, settran_journey_groupbe7ae}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_groupbe7aeProps, settran_journey_groupbe7aeProps}= useContext(TotalContext) as TotalContextProps
  const {tran_journey47044, settran_journey47044}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_dtl_group6545a, settran_journey_dtl_group6545a}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_dtl_group6545aProps, settran_journey_dtl_group6545aProps}= useContext(TotalContext) as TotalContextProps
  //////////////

const statusMap: Record<string, { icon: any; color: string }> = {
  "SUCCESS": { icon: "", color: "#1aff47" },
  "FAILURE": { icon: "", color: "#ff0000" },
}
  const handleStepClick = async (step: Record<string, any>, index: number) => {
    let filterProps:any =  [];
    let filterData = await getFilterProps(filterProps,tran_journey_groupbe7ae);
    settran_journey_error_dtl_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true)
    // copyFormData
      // copyFormData controller
      settran_journey_dtl_group6545a(step);
      settran_journey_dtl_group6545aProps({...tran_journey_dtl_group6545aProps,presetValues:step});
  }
  const getTimelineData = async(value?:any)=>{
    let orchestrationBody : any = {
      key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Tran_Journey:AFVK:v1",
      componentId: "21ef492c318e44e591227f011f5be7ae",
      controlId: "4e853c86ce6949c28a5d5004f6947044",
      isTable: false,
      accessProfile:accessProfile,
      from:"TimeLine"
    }
    if(encryptionFlagCont) {
    orchestrationBody["dpdKey"] = encryptionDpd
    orchestrationBody["method"] = encryptionMethod
    } 
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      orchestrationBody,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    setAllCode(orchestrationData?.data?.code)
    let te_refreshBody: te_refreshDto = {
      key: orchestrationData.data.mapper[0].sourceKey[0].split('|')[0] + ':' || '',
      upId: "",
      refreshFlag: "Y",
      count:1000,
      page:1
    }
    if(encryptionFlagCont) {
      te_refreshBody["dpdKey"] = encryptionDpd
      te_refreshBody["method"] = encryptionMethod
    }
    if(tran_journey_groupbe7ae?.uuid){
      setSteps([])
    }
    let dstKey = orchestrationData.data?.mapper[0].sourceKey[0].split('|')[0] + ':' || ''
    dstKey = dstKey.replace(':AFC:', ':AFCP:').replace(':AF:', ':AFP:').replace(':DF-DFD:', ':DF-DST:')
    const count = orchestrationData.data?.action.pagination?.count || 100
    let api_pagination: any
    const api_paginationBody: api_paginationDto = {
      key: dstKey,
      page: 1,
      count: count,
      searchFilter: {"vgphstm_uuid":tran_journey_groupbe7ae?.uuid},
    }
    if (encryptionFlagCont) {
      api_paginationBody['dpdKey'] = encryptionDpd
      api_paginationBody['method'] = encryptionMethod
    }
    api_pagination = await AxiosService.post(
      '/UF/pagination',
      api_paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    let data = api_pagination?.data?.records || []
    setSteps(data)
  }

  //   useEffect(() => {
  //  //   if(Array.isArray(dfd_tran_journey_db_query_v1Props) && dfd_tran_journey_db_query_v1Props.length > 0){
  //       settran_journey_groupbe7ae((pre:any)=>({...pre,vgphstm_uuid:dfd_tran_journey_db_query_v1Props[0]?.vgphstm_uuid}));
  //   }
  //// }, [dfd_tran_journey_db_query_v1Props]);

  useEffect(() => {
    getTimelineData(tran_journey_groupbe7ae?.uuid)
  },[ tran_journey_groupbe7ae?.uuid])

  return (
    <div className="" style={{gridColumn: `1 / 25`,gridRow: `1 / 146`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Modal 
        open={showProfileAsModalOpen} 
        onClose={() => setShowProfileAsModalOpen(false)}
        showOverlay = {true}
        position = {"center"}
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageTranJourneyErrorDtlpage/>
      </Modal>
      <TimeLine
        steps={steps}
        statusMap={statusMap}
        title={""}
        status={"trs_status"}
        date={"trs_created_date"}
        view={'vertical'}
        className={''}
        onStepClick={handleStepClick}

      />
    </div>
  )
}

export default TimeLinetran_journey
