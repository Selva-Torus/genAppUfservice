
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
import PageTranjourneydetailspage2 from '@/app/tranjourneydetails_v1/tranjourneydetails_v1page';
const TimeLinetechnical_pending_journey = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}:any) => { 
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
      const [showProfileAsModalOpen2, setShowProfileAsModalOpen2] = React.useState<boolean>(false);
  
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

  const {tran_main_group1dc7f, settran_main_group1dc7f}= useContext(TotalContext) as TotalContextProps
  const {tran_main_group1dc7fProps, settran_main_group1dc7fProps}= useContext(TotalContext) as TotalContextProps
  const {tran_tab_group08b64, settran_tab_group08b64}= useContext(TotalContext) as TotalContextProps
  const {tran_tab_group08b64Props, settran_tab_group08b64Props}= useContext(TotalContext) as TotalContextProps
  const {view_all_tab4a963, setview_all_tab4a963}= useContext(TotalContext) as TotalContextProps
  const {view_all_tab4a963Props, setview_all_tab4a963Props}= useContext(TotalContext) as TotalContextProps
  const {view_all_tablec9e87, setview_all_tablec9e87}= useContext(TotalContext) as TotalContextProps
  const {view_all_tablec9e87Props, setview_all_tablec9e87Props}= useContext(TotalContext) as TotalContextProps
  const {view_all_journey_group67ce4, setview_all_journey_group67ce4}= useContext(TotalContext) as TotalContextProps
  const {view_all_journey_group67ce4Props, setview_all_journey_group67ce4Props}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_tab69f01Props, setfailure_queue_tab69f01Props}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_journey_group36aba, setfailure_queue_journey_group36aba}= useContext(TotalContext) as TotalContextProps
  const {failure_queue_journey_group36abaProps, setfailure_queue_journey_group36abaProps}= useContext(TotalContext) as TotalContextProps
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps
  const {success_queue_tabef582Props, setsuccess_queue_tabef582Props}= useContext(TotalContext) as TotalContextProps
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps
  const {success_queue_journey_group755eb, setsuccess_queue_journey_group755eb}= useContext(TotalContext) as TotalContextProps
  const {success_queue_journey_group755ebProps, setsuccess_queue_journey_group755ebProps}= useContext(TotalContext) as TotalContextProps
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps
  const {return_queue_tab5611eProps, setreturn_queue_tab5611eProps}= useContext(TotalContext) as TotalContextProps
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps
  const {return_queue_journey_group92c55, setreturn_queue_journey_group92c55}= useContext(TotalContext) as TotalContextProps
  const {return_queue_journey_group92c55Props, setreturn_queue_journey_group92c55Props}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_tab67331, setoperational_pending_tab67331}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_tab67331Props, setoperational_pending_tab67331Props}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_table0a253, setoperational_pending_table0a253}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_table0a253Props, setoperational_pending_table0a253Props}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_journey_group63667, setoperational_pending_journey_group63667}= useContext(TotalContext) as TotalContextProps
  const {operational_pending_journey_group63667Props, setoperational_pending_journey_group63667Props}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_tab0b23f, settechnical_pending_tab0b23f}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_tab0b23fProps, settechnical_pending_tab0b23fProps}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_table84f30, settechnical_pending_table84f30}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_table84f30Props, settechnical_pending_table84f30Props}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_journey_groupe4f03, settechnical_pending_journey_groupe4f03}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_journey_groupe4f03Props, settechnical_pending_journey_groupe4f03Props}= useContext(TotalContext) as TotalContextProps
  const {technical_pending_journey6601c, settechnical_pending_journey6601c}= useContext(TotalContext) as TotalContextProps
  const {journey_details_groupd9a0e, setjourney_details_groupd9a0e}= useContext(TotalContext) as TotalContextProps
  const {journey_details_groupd9a0eProps, setjourney_details_groupd9a0eProps}= useContext(TotalContext) as TotalContextProps
  //////////////

const statusMap: Record<string, { icon: any; color: string }> = {
  "SUCCESS": { icon: "MdDownloadDone", color: "#00ff33" },
  "FAILURE": { icon: "MdClear", color: "#ff0000" },
}
  const handleStepClick = async (step: Record<string, any>, index: number) => {
    console.log('Clicked step:', step, 'at index:', index)
    // showArtifactAsModal
    let filterProps2:any =  [];
    let filterData2 = await getFilterProps(filterProps2,technical_pending_journey_groupe4f03);
    settranjourneydetails_v1Props([...filterData2 ]);
    setShowProfileAsModalOpen2(true);
    // copyFormData
      // copyFormData controller
      setjourney_details_groupd9a0e(step);
      setjourney_details_groupd9a0eProps({...journey_details_groupd9a0eProps,presetValues:step});
  }
  const handleMapper = async () => {
    // If technical_pending_journey_groupe4f03 data exists, use it directly without API calls
    if (Array.isArray(technical_pending_journey_groupe4f03?.vgphstm_uuid) && technical_pending_journey_groupe4f03?.vgphstm_uuid.length > 0) {
      setSteps(technical_pending_journey_groupe4f03.vgphstm_uuid)
      setHasMore(false)
      setIsInitialLoaded(true)
      return
    }
    let orchestrationBody : any = {
      key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:transactionProduct:AFVK:v1",
      componentId: "c7d2a9c0c8474e86a5fc7d3544be4f03",
      controlId: "f23ecfbf57734c84892474e797f6601c",
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
    if (Array.isArray(technical_pending_journey_groupe4f03?.vgphstm_uuid) && technical_pending_journey_groupe4f03?.vgphstm_uuid.length > 0) {
      const journeyData = technical_pending_journey_groupe4f03.vgphstm_uuid
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
      searchFilter: {"vgphstm_uuid":technical_pending_journey_groupe4f03?.uuid},
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
  //       settechnical_pending_journey_groupe4f03((pre:any)=>({...pre,vgphstm_uuid:dfd_journey_v1Props[0]?.vgphstm_uuid}));
  //   }
  //// }, [dfd_journey_v1Props]);

  useEffect(() => {
    if (!false && !technical_pending_journey_groupe4f03?.uuid) {
      setSteps([]);
      setHasMore(false);
      return;
    }
    setCurrentPage(1);
    setHasMore(true);
    setIsInitialLoaded(false);
    handleMapper();
    },[ technical_pending_journey_groupe4f03?.uuid])

    useEffect(() => {
    if (technical_pending_journey_groupe4f03?.vgphstm_uuid && technical_pending_journey_groupe4f03?.vgphstm_uuid.length > 0) {
      setSteps(technical_pending_journey_groupe4f03.vgphstm_uuid);
      setHasMore(false);
      setIsInitialLoaded(true);
    }
  },[ technical_pending_journey_groupe4f03?.vgphstm_uuid])

  return (
    <div className="" style={{gridColumn: `1 / 25`,gridRow: `1 / 189`, gap:``, height: `100%`, overflow: 'hidden'}} >
      <Modal 
        open={showProfileAsModalOpen2} 
        onClose={() => setShowProfileAsModalOpen2(false)}
        showOverlay = {true}
        position = {"right"}
        modalName='tranjourneydetails'
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageTranjourneydetailspage2/>
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
        headerPosition='top'
        headerText="Transaction Journey"

      />
    </div>
  )
}

export default TimeLinetechnical_pending_journey
