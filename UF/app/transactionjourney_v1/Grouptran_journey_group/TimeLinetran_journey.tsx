
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
import PageTranjourneydetailspage4 from '@/app/tranjourneydetails_v1/tranjourneydetails_v1page';
const TimeLinetran_journey = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}:any) => { 
  const token: string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const routes = useRouter();
  const {dfd_journey_v1Props, setdfd_journey_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
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

  const {tranjourneydetails_v1Props, settranjourneydetails_v1Props}= useContext(TotalContext) as TotalContextProps; 
  const {tran_journey_group9eb2e, settran_journey_group9eb2e}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_group9eb2eProps, settran_journey_group9eb2eProps}= useContext(TotalContext) as TotalContextProps
  const {tran_journey_label02972, settran_journey_label02972}= useContext(TotalContext) as TotalContextProps
  const {tran_journey1602a, settran_journey1602a}= useContext(TotalContext) as TotalContextProps
  const {journey_details_groupd9a0e, setjourney_details_groupd9a0e}= useContext(TotalContext) as TotalContextProps
  const {journey_details_groupd9a0eProps, setjourney_details_groupd9a0eProps}= useContext(TotalContext) as TotalContextProps
  //////////////

const statusMap: Record<string, { icon: any; color: string }> = {
  "SUCCESS": { icon: "MdDownloadDone", color: "#00ff33" },
  "FAILURE": { icon: "MdClear", color: "#ff0000" },
}
  const handleStepClick = async (step: Record<string, any>, index: number) => {
    console.log('Clicked step:', step, 'at index:', index)
    // copyFormData
      // copyFormData controller
      setjourney_details_groupd9a0e(step);
      setjourney_details_groupd9a0eProps({...journey_details_groupd9a0eProps,presetValues:step});
    // showArtifactAsModal
    let filterProps4:any =  [];
    let filterData4 = await getFilterProps(filterProps4,tran_journey_group9eb2e);
    settranjourneydetails_v1Props([...filterData4 ]);
    setShowProfileAsModalOpen4(true);
  }
  const handleMapper = async () => {
    // If tran_journey_group9eb2e data exists, use it directly without API calls
    if (tran_journey_group9eb2e?.vgphstm_uuid && tran_journey_group9eb2e?.vgphstm_uuid.length > 0) {
      setSteps(tran_journey_group9eb2e.vgphstm_uuid)
      setHasMore(false)
      setIsInitialLoaded(true)
      return
    }
    let orchestrationBody : any = {
      key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transactionJourney:AFVK:v1",
      componentId: "226507dac362462d9af3beaf8039eb2e",
      controlId: "ff6f377f1e4e4a489691b00692e1602a",
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
    
    let key = orchestrationData.data?.mapper[0]?.sourceKey[0]?.split('|')[0] + ':' || ''
    key = key.replace(':AFC:', ':AFCP:').replace(':AF:', ':AFP:').replace(':DF-DFD:', ':DF-DST:')
    setDstKey(key)

    const currentPageSize = orchestrationData.data?.action.pagination?.count || 10
    setPageSize(currentPageSize)

    await fetchPagination(key, 1, currentPageSize)
    setIsInitialLoaded(true)
  }

  const fetchPagination = async (key: string, page: number, count: number) => {
    if (tran_journey_group9eb2e?.vgphstm_uuid && tran_journey_group9eb2e?.vgphstm_uuid.length > 0) {
      const journeyData = tran_journey_group9eb2e.vgphstm_uuid
      setSteps(journeyData)
      timelineData = journeyData
      setHasMore(false)
      return
    }

    if (page === 1) {
      setSteps([])
      timelineData = []
    }

    const api_paginationBody: api_paginationDto = {
      key: key,
      page: page || 1,
      count: count,
      searchFilter: {"vgphstm_uuid":tran_journey_group9eb2e?.uuid},
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
  //  //   if(Array.isArray(dfd_journey_v1Props) && dfd_journey_v1Props.length > 0){
  //       settran_journey_group9eb2e((pre:any)=>({...pre,vgphstm_uuid:dfd_journey_v1Props[0]?.vgphstm_uuid}));
  //   }
  //// }, [dfd_journey_v1Props]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setIsInitialLoaded(false);
    handleMapper();
  },[ tran_journey_group9eb2e?.uuid])

    useEffect(() => {
    if (tran_journey_group9eb2e?.vgphstm_uuid && tran_journey_group9eb2e?.vgphstm_uuid.length > 0) {
      setSteps(tran_journey_group9eb2e.vgphstm_uuid);
      setHasMore(false);
      setIsInitialLoaded(true);
    }
  },[ tran_journey_group9eb2e?.vgphstm_uuid])

  return (
    <div className="" style={{gridColumn: `1 / 25`,gridRow: `9 / 183`, gap:``, height: `100%`, overflow: 'hidden'}} >
      <Modal 
        open={showProfileAsModalOpen4} 
        onClose={() => setShowProfileAsModalOpen4(false)}
        showOverlay = {true}
        position = {"right"}
        modalName='tranjourneydetails'
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageTranjourneydetailspage4/>
      </Modal>
      <TimeLine
        steps={steps}
        statusMap={statusMap}
        title={"trs_process_code"}
        status={"result"}
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

export default TimeLinetran_journey
