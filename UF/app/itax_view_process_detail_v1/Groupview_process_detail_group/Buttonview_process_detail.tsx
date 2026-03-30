'use client'




import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import UOmapperData from '@/context/dfdmapperContolnames.json';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable  from '@/app/utils/evaluateDecisionTable';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { getGridPositionFromOrder } from '@/app/utils/getGridPositionFromOrder';
import { Scan } from '@/app/utils/scanService';
import PageItaxViewProcessDetailsJsonViewerpage2 from '@/app/itax_view_process_details_json_viewer_v1/itax_view_process_details_json_viewer_v1page';
import { XMLParser } from 'fast-xml-parser'

    

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
 

const Buttonview_process_detail = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any}) => {
  const token:string = getCookie('token');
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const decodedTokenObj:any = decodeToken(token);
  const createdBy : string = decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();

  let code:string = "";
  const prevRefreshRef = useRef(false);
  const [ruleData,setRulseData]=useState<any>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const savedData=useRef<Record<string, any>>({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast : Function=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState<boolean>(true);
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState<boolean>(false);
  const routes : AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData : any = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<string>("");
  const [gridPosition, setGridPosition] = useState<any>({ gridColumn: '1 / 3', gridRow: '1 / 12' });
  ////showComponentAsPopup || showArtifactAsModal
  const [showProfileAsModalOpen2, setShowProfileAsModalOpen2] = React.useState<boolean>(false);
    
 /////////////
   //another screen

  const {view_process_detail_groupe7fe3, setview_process_detail_groupe7fe3}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detail_groupe7fe3Props, setview_process_detail_groupe7fe3Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_category_label4bfef, settran_category_label4bfef}= useContext(TotalContext) as TotalContextProps;
  const {processing_system_labele6ddd, setprocessing_system_labele6ddd}= useContext(TotalContext) as TotalContextProps;
  const {tran_categorycab42, settran_categorycab42}= useContext(TotalContext) as TotalContextProps;
  const {processing_systemcd502, setprocessing_systemcd502}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detailf4139, setview_process_detailf4139}= useContext(TotalContext) as TotalContextProps;
  const {itax_view_process_details_json_viewer_v1Props, setitax_view_process_details_json_viewer_v1Props}= useContext(TotalContext) as TotalContextProps;
  const {process_details_json_viewer_group64f76, setprocess_details_json_viewer_group64f76}= useContext(TotalContext) as TotalContextProps;
  const {process_details_json_viewer_group64f76Props, setprocess_details_json_viewer_group64f76Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['view_process_detail_group']  = view_process_detail_groupe7fe3,
      codeStates['setview_process_detail_group'] = setview_process_detail_groupe7fe3,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Process_Detail:AFVK:v1",
          componentId: "2b4095e2d9814a89a8874886a5fe7fe3",
          controlId: "65b430c3eb0e4e7e9d50c2fd2d1f4139",
          isTable: false,
          from:"ButtonView Process Detail",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
      setPaginationData((pre: any) => ({
      ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 1,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 1000
    }))
    if(orchestrationData?.data?.rule?.nodes?.length > 0){
      setRulseData(orchestrationData?.data?.rule.nodes)
      let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj,...data});
      // schemaFlag =schemaFlag.output;
      let order:number = Number(schemaFlag.order);

      // Update grid position based on order number
      if (order && typeof order === 'number') {
        const position : any = getGridPositionFromOrder(order);
        setGridPosition(position);
      } 

      if (schemaFlag.output !== "true") {
        setShowFlag(false);
      }else{
        setShowFlag(true)
      }
    }
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "view_process_detailf4139") {
        handleClick();
      }
    });
  },[view_process_detailf4139?.refresh,currentToken])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans : any[] = [];
    let id : string = "";
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }

//setSearchFilters
async function handleSearch0() {
  let mainData: any =  nullFilter(structuredClone(view_process_detail_groupe7fe3));
  let temp: any = {}
  view_process_detail_groupe7fe3Props?.needToSpread?.map((keys:any)=>{
    delete mainData?.[keys]
  })
  Object.keys(mainData)?.forEach(key => {
    temp[key] = key
  })
  let filterProps:any=[]
   let spreadedValues:any = [ 
      {
        "key": "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_log_DFD:AFVK:v1",
        nodeBasedData: [                          {
                            "nodeId":"f4df59bac1884535bc499b2b0a448108",
                            "object":{
                              ...temp
                            }
                          },
                    ]
      },
  ]
  let originalFiltervalues:any = [
  {
    "key": "CK:CT010:FNGK:AF:FNK:DF-DFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Tran_log_DFD:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "f4df59bac1884535bc499b2b0a448108",
        "object": {
          "itaxst_id": "65b430c3eb0e4e7e9d50c2fd2d1f4139"
        }
      }
    ]
  }
];
  
  if(view_process_detail_groupe7fe3Props?.needToSpread?.length){
    filterProps = spreadedValues;
  }else{
    filterProps = originalFiltervalues;
  }
  let filterData = await getFilterProps(filterProps, mainData);
  if(Object.keys(mainData).length>0) { 
    filterData = filterData.map((item:any) => {
      const { DFDkey, ...rest } = item;
      return rest;
    });
  } else {
    filterData = [];
  }
  filterData=nullFilter(filterData)
  let te_refreshBody: te_refreshDto = {
    key: filterProps[0].key + ":",
    upId: '',
    refreshFlag: 'Y',
    filterData: filterData,
    count:paginationData.pageSize,
    page:paginationData.page
  }
  if (encryptionFlagCont) {
    te_refreshBody['dpdKey'] = encryptionDpd
    te_refreshBody['method'] = encryptionMethod
  }
  const te_refresh: any = await AxiosService.post(
    '/te/eventEmitter',
    te_refreshBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
if(te_refresh.data.dataset=== "Bulk Data Processing"){
      const paginationFilterData = filterData.reduce((acc: any, item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'nodeId' && item[key] !== undefined) {
          acc[key] = item[key]
        }
      })
      return acc
    }, {})

    const { filterData: _, key, ...restBody } = te_refreshBody
    const paginationBody = {
      ...restBody,
      key: key
        ?.replace(':AFC:', ':AFCP:')
        .replace(':AF:', ':AFP:')
        .replace(':DF-DFD:', ':DF-DST:'),
      searchFilter: paginationFilterData
    }

    const pagination = await AxiosService.post(
      '/UF/pagination',
      paginationBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    // copyFormData for setSearchFilter handler
    setprocess_details_json_viewer_group64f76(pagination.data.records[0])
  }
  setprocess_details_json_viewer_group64f76Props((prev: any) => {
    const existingFilters = prev.filterProps ?? [];
    const mergedFilters: any[] = [];
    
    const allFilters : any[] = [...existingFilters, ...filterData];
    const groupedByNodeId : any = allFilters.reduce((acc: any, item: any) => {
      const nodeId = item.nodeId;
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      Object.assign(acc[nodeId], item);
      return acc;
    }, {});
    
    const mergedData : any = Object.values(groupedByNodeId);
      return { ...prev, filterProps: mergedData };
  });
  }
  ///////////////
  const handleClick=async()=>{
    try{  
      setIsProcessing(true);
      await  handleSearch0();
        //onClick

    // showArtifactAsModal
    let filterProps2:any =  [];
    let filterData2 = await getFilterProps(filterProps2,view_process_detail_groupe7fe3);
    setitax_view_process_details_json_viewer_v1Props([...filterData2 ]);
    setShowProfileAsModalOpen2(true);
      await handleCustomCode();
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }finally{
      setIsProcessing(false);
    }
  }
    async function handleConfirmOnClick(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    } 


    async function handleConfirmOnCancel(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    }

 if (view_process_detailf4139?.isHidden) {
    return <></>
  }
 
  return (
    <div
      style={{gridColumn: `13 / 25`,gridRow: `23 / 35`, gap:``, height: `100%`, overflow: 'auto'}} 
      >
      <Modal 
        open={showProfileAsModalOpen2} 
        onClose={() => setShowProfileAsModalOpen2(false)}
        showOverlay = {false}
        position = {"center"}
        modalName = "itax_view_process_details_json_viewer"
        className='w-[70%] h-[] bg-gray-50 overflow-auto'
      >
        <PageItaxViewProcessDetailsJsonViewerpage2/>
      </Modal>
        {showFlag && <Button 
          ref={buttonRef}
          className="   !bg-[#edefe8] !text-[#4caf50]"
          onClick={handleClick}
          view='action'
          disabled= {view_process_detailf4139?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
          icon="MdInfoOutline"
          iconDisplay='Start with Icon'
        >
          {keyset("View Process Detail")}
        </Button>}
      </div>
    
  )
}

export default Buttonview_process_detail

