
'use client'
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AxiosService } from "@/app/components/axiosService";
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { te_refreshDto,api_paginationDto} from '@/app/interfaces/interfaces';
import { TimeLine } from '@/components/TimeLine';
import {Modal} from '@/components/Modal';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { useRouter } from 'next/navigation'
import PageItaxViewProcessDetailpage2 from '@/app/itax_view_process_detail_v1/itax_view_process_detail_v1page';
import PageItaxViewErrorDetailpage4 from '@/app/itax_view_error_detail_v1/itax_view_error_detail_v1page';
const TimeLinetransaction_journey = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => { 
  const token: string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const routes = useRouter();
  const {dfd_itax_source_tran_dtl_dfd_v1Props, setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
      const [showProfileAsModalOpen2, setShowProfileAsModalOpen2] = React.useState<boolean>(false);
      const [showProfileAsModalOpen4, setShowProfileAsModalOpen4] = React.useState<boolean>(false);
  
  const loadingMoreRef = useRef<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({})
  const [allCode,setAllCode]=useState<any>("");
  const [steps, setSteps] = useState<any[]>([]);
  const [dstKey, setDstKey] = useState<string>("");
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);
  let timelineData: any[] = [];
    /////////////
  //another screen
  const {itax_view_process_detail_v1Props, setitax_view_process_detail_v1Props}= useContext(TotalContext) as TotalContextProps; 
  const {itax_view_error_detail_v1Props, setitax_view_error_detail_v1Props}= useContext(TotalContext) as TotalContextProps; 


  const {tran_journey_group30215, settran_journey_group30215}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_group30215Props, settran_journey_group30215Props}= useContext(TotalContext) as TotalContextProps
  const {tran_jry_labelbaee1, settran_jry_labelbaee1}= useContext(TotalContext) as TotalContextProps
  const {transaction_journey39171, settransaction_journey39171}= useContext(TotalContext) as TotalContextProps
  const {view_process_detail_groupe7fe3, setview_process_detail_groupe7fe3}= useContext(TotalContext) as TotalContextProps
  const {view_process_detail_groupe7fe3Props, setview_process_detail_groupe7fe3Props}= useContext(TotalContext) as TotalContextProps
  const {view_error_detail_group21845, setview_error_detail_group21845}= useContext(TotalContext) as TotalContextProps
  const {view_error_detail_group21845Props, setview_error_detail_group21845Props}= useContext(TotalContext) as TotalContextProps
  //////////////

const statusMap: Record<string, { icon: any; color: string }> = {
  "PAYMENT INITIATED": { icon: "", color: "#00ff11" },
  "CREDIT APPLICATION INITIATED": { icon: "", color: "#00ff11" },
  "CREDIT APPLICATION APPROVED": { icon: "", color: "#00ff11" },
  "CREATE TRANSACTION COMPLETED": { icon: "", color: "#00ff11" },
  "SINGLE TAX PAYMENT COMPLETED": { icon: "", color: "#00ff11" },
  "SINGLE TAX PAYMENT FAILED": { icon: "", color: "#ff0000" },
  "PAYMENT SUCCESS": { icon: "", color: "#00ff11" },
  "CREDIT APPLICATION REJECTED": { icon: "", color: "#ff0000" },
  "PAYMENT FAILED": { icon: "", color: "#ff0000" },
  "BALANCE VALIDATION SUCCESS": { icon: "", color: "#00ff11" },
}
  const handleStepClick = async (step: Record<string, any>, index: number) => {
    console.log('Clicked step:', step, 'at index:', index)
    // showArtifactAsModal
    let filterProps2:any =  [];
    let filterData2 = await getFilterProps(filterProps2,tran_journey_group30215);
    setitax_view_process_detail_v1Props([...filterData2 ]);
    if(eventDecisionTable({conditionalKey:"trs_status",conditionalValue:"PAYMENT INITIATED, CREDIT APPLICATION INITIATED, CREDIT APPLICATION APPROVED, CREATE TRANSACTION COMPLETED, SINGLE TAX PAYMENT COMPLETED, PAYMENT SUCCESS"},{...decodedTokenObj,...step})==false)
    {
setShowProfileAsModalOpen2(true);
    }
    // showArtifactAsModal
    let filterProps4:any =  [];
    let filterData4 = await getFilterProps(filterProps4,tran_journey_group30215);
    setitax_view_error_detail_v1Props([...filterData4 ]);
    if(eventDecisionTable({conditionalKey:"trs_status",conditionalValue:" CREDIT APPLICATION REJECTED, SINGLE TAX PAYMENT FAILED, PAYMENT FAILED"},{...decodedTokenObj,...step})==false)
    {
setShowProfileAsModalOpen4(true);
    }
    // copyFormData
      // copyFormData controller
      setview_process_detail_groupe7fe3(step);
      setview_process_detail_groupe7fe3Props({...view_process_detail_groupe7fe3Props,presetValues:step});
    // copyFormData
      // copyFormData controller
      setview_error_detail_group21845(step);
      setview_error_detail_group21845Props({...view_error_detail_group21845Props,presetValues:step});
  }
  const handleMapper = async () => {
    let orchestrationBody : any = {
      key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_Journey:AFVK:v1",
      componentId: "f2efc206c89f4bbcad7c9cdb16430215",
      controlId: "e4657665e610405998b6612a74b39171",
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
    
    let key = orchestrationData.data?.mapper[0].sourceKey[0].split('|')[0] + ':' || ''
    key = key.replace(':AFC:', ':AFCP:').replace(':AF:', ':AFP:').replace(':DF-DFD:', ':DF-DST:')
    setDstKey(key)

    const currentPageSize = orchestrationData.data?.action.pagination?.count || 10
    setPageSize(currentPageSize)

    await fetchPagination(key, 1, currentPageSize)
    setIsInitialLoaded(true)
  }

  const fetchPagination = async (key: string, page: number, count: number) => {
    if (page === 1) {
      setSteps([])
      timelineData = []
    }

    const api_paginationBody: api_paginationDto = {
      key: key,
      page: page || 1,
      count: count,
      searchFilter: {"itaxst_id":tran_journey_group30215?.itaxst_id},
    }
    if (encryptionFlagCont) {
      api_paginationBody['dpdKey'] = encryptionDpd
      api_paginationBody['method'] = encryptionMethod
    }
    const api_pagination = await AxiosService.post(
      '/UF/pagination',
      api_paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    const newRecords = api_pagination?.data?.records || []
    if (newRecords.length < count) {
      setHasMore(false)
    }
    if (page === 1) {
      timelineData = newRecords
      setSteps(newRecords)
    } else {
      timelineData = [...timelineData, ...newRecords]
      setSteps((prev: any[]) => [...prev, ...newRecords])
    }


  }
  // Load more - only calls pagination (no orchestration)
  const loadMore = async () => {
    if (!hasMore || loadingMoreRef.current || !dstKey) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchPagination(dstKey, nextPage, pageSize);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
  }
  //   useEffect(() => {
  //  //   if(Array.isArray(dfd_itax_source_tran_dtl_dfd_v1Props) && dfd_itax_source_tran_dtl_dfd_v1Props.length > 0){
  //       settran_journey_group30215((pre:any)=>({...pre,itaxst_id:dfd_itax_source_tran_dtl_dfd_v1Props[0]?.itaxst_id}));
  //   }
  //// }, [dfd_itax_source_tran_dtl_dfd_v1Props]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setIsInitialLoaded(false);
    handleMapper();
  },[ tran_journey_group30215?.itaxst_id])

  return (
    <div className="" style={{gridColumn: `1 / 25`,gridRow: `13 / 172`, gap:``, height: `100%`, overflow: 'hidden'}} >
      <Modal 
        open={showProfileAsModalOpen2} 
        onClose={() => setShowProfileAsModalOpen2(false)}
        showOverlay = {true}
        position = {"right"}
        modalName='itaxviewprocessdetail'
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageItaxViewProcessDetailpage2/>
      </Modal>
      <Modal 
        open={showProfileAsModalOpen4} 
        onClose={() => setShowProfileAsModalOpen4(false)}
        showOverlay = {true}
        position = {"right"}
        modalName='itaxviewerrordetail'
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageItaxViewErrorDetailpage4/>
      </Modal>
      <TimeLine
        steps={steps}
        statusMap={statusMap}
        title={"tran_reference"}
        status={"trs_status"}
        date={"trs_created_date"}
        view={'vertical'}
        className={'h-full '}
        onStepClick={handleStepClick}
        onLoadMore={isInitialLoaded ? loadMore : undefined}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}

      />
    </div>
  )
}

export default TimeLinetransaction_journey
