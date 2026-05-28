'use client'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import JsonView from "react18-json-view";
// @ts-ignore
import 'react18-json-view/src/style.css';
import axios from "axios";
///////
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import { DatePicker } from '@/components/DatePicker';
import {Pagination} from '@/components/Pagination';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import Popup from '@/components/Popup';
import { evaluateDecisionTableBoolean,eventDecisionTable,getAftfactLevelRule } from '@/app/utils/evaluateDecisionTable';
//////////////
import React, { useEffect, useState,useContext, useRef, useImperativeHandle } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { nullFilter } from '@/app/utils/nullDataFilter';
import { codeExecution } from '@/app/utils/codeExecution'
import {
  uf_fetchActionDetailsDto,
  uf_fetchRuleDetailsDto,
  te_refreshDto,
  api_paginationDto,
  uf_paginationDataFilterDto,
  te_eventEmitterDto,
  uf_initiatePfDto,
  uf_ifoDto
} from '@/app/interfaces/interfaces';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import i18n from '@/app/components/i18n';
import decodeToken from '@/app/components/decodeToken';
import { flattenKeepInner } from '@/app/utils/commonfunctions';
import UOmapperData from '@/context/dfdmapperContolnames.json'
import {commonSepareteDataFromTheObject, eventFunction, filterByKeys } from '@/app/utils/eventFunction';
import { Tooltip } from '@/components/Tooltip';
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

let colourIndicatorCols:any= [] ;
let defaultColumns:any = [
  {
    "id": "product_code_failure_queue",
    "nodeid": "ce17cbf604204322af1a053983212297",
    "name": "Product Code",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "trs_product_code"
  },
  {
    "id": "channel_name_failure_queue",
    "nodeid": "59e49adb362547729394d8b656f42953",
    "name": "Channel",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "channel_name"
  },
  {
    "id": "uuid_failure_queue",
    "nodeid": "3658db216f6545cc97e2502cf3503c86",
    "name": "UUID",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "uuid"
  },
  {
    "id": "dr_account_failure_queue",
    "nodeid": "2586474e38b14516a9e8308d4a6f9d2d",
    "name": "Debitor Account",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "dr_account"
  },
  {
    "id": "dr_amount_failure_queue",
    "nodeid": "48bbb04b92d246669c4b7cc3fbb95d4e",
    "name": "Debitor Amount",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "dr_amount"
  },
  {
    "id": "cr_account_failure_queue",
    "nodeid": "cbf30eef44a74063a2bdbe0dbc1a7246",
    "name": "Creditor Account",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "cr_account"
  },
  {
    "id": "cr_Amount_failure_queue",
    "nodeid": "28464320c21d47eb87ddd3eadb357c4d",
    "name": "Creditor Amount",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "cr_amount"
  },
  {
    "id": "remittance_info_failure_queue",
    "nodeid": "777ef03df3244d24894ac43c0bc09d7a",
    "name": "Remittance Info",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": [],
    "dfdName": "remittance_info"
  },
  {
    "id": "status_failure_queue",
    "nodeid": "58d15bd0bce341d69929ea6de6a0aef8",
    "name": "Status",
    "meta": {
      "sort": true
    },
    "className": "",
    "align": "left",
    "hide": false,
    "isSearch": false,
    "colourIndicator": []
  }
];
for (let i = 0; i < defaultColumns.length; i++) {
  defaultColumns[i].id = defaultColumns[i].id.toLowerCase();
}
let mapperData:any;
let schemaDataDFO:any;
let filterPropsData:any;
const Tablefailure_queue_table = ({ headerButtonsRenders=()=>{return<></>},headerPosition="",headerText="",lockedData,setLockedData,tableData, setTableData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch, setRefetch,setData,encryptionFlagCompData,paginationDetails,open, setOpen, ref, ButtonGoRuleData, setButtonGoRuleData,setIsProcessing,groupData,controlData}: any)=>{
  const token: string | any = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const allState:any = useContext(TotalContext) as TotalContextProps
  const {transactionproduct_v1, settransactionproduct_v1} = useContext(TotalContext) as TotalContextProps;
  const {transactionproduct_v1Props, settransactionproduct_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const [translatedColumns,setTranslatedColumns]= useState<any>([])
  const securityData:any={
  "Operational Manager": {
    "allowedControls": [
      "product_code_failure_queue",
      "channel_name_failure_queue",
      "uuid_failure_queue",
      "dr_account_failure_queue",
      "dr_amount_failure_queue",
      "cr_account_failure_queue",
      "cr_amount_failure_queue",
      "remittance_info_failure_queue",
      "status_failure_queue"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operational Officer": {
    "allowedControls": [
      "product_code_failure_queue",
      "channel_name_failure_queue",
      "uuid_failure_queue",
      "dr_account_failure_queue",
      "dr_amount_failure_queue",
      "cr_account_failure_queue",
      "cr_amount_failure_queue",
      "remittance_info_failure_queue",
      "status_failure_queue"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
}
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  const upId: string | any = getCookie('upId')
  let dfKey: string | any
  let dfdType : string | any
  const toast =useInfoMsg()
  const [columns,setColumns]=useState<any>([])
  const [allCode, setAllCode] = React.useState("");
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const routes = useRouter()
  const prevRefreshRef = useRef(false);
  const refreshInitRef = useRef(false);
  const [loading, setLoading]= useState<boolean>(false)
  const [allData, setAllData] = React.useState<any>([]);
  const [allDataObject, setAllDataObject] = React.useState<any>([]);
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const [searchFilterFlag, setSearchFilterFlag] = useState(false);
  const keyset:any=i18n.keyset("language") 
  const [DFkeyAndRule, setDFkeyAndRule] = React.useState({
    isRulePresent:false,
    dfKey:"",
    dfdType:""
  })
 /////////////
   //another screen
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
  const {product_code_failure_queue12297, setproduct_code_failure_queue12297}= useContext(TotalContext) as TotalContextProps  
  const {channel_name_failure_queue42953, setchannel_name_failure_queue42953}= useContext(TotalContext) as TotalContextProps  
  const {uuid_failure_queue03c86, setuuid_failure_queue03c86}= useContext(TotalContext) as TotalContextProps  
  const {dr_account_failure_queuef9d2d, setdr_account_failure_queuef9d2d}= useContext(TotalContext) as TotalContextProps  
  const {dr_amount_failure_queue95d4e, setdr_amount_failure_queue95d4e}= useContext(TotalContext) as TotalContextProps  
  const {cr_account_failure_queuea7246, setcr_account_failure_queuea7246}= useContext(TotalContext) as TotalContextProps  
  const {cr_amount_failure_queue57c4d, setcr_amount_failure_queue57c4d}= useContext(TotalContext) as TotalContextProps  
  const {remittance_info_failure_queue09d7a, setremittance_info_failure_queue09d7a}= useContext(TotalContext) as TotalContextProps  
  const {status_failure_queue0aef8, setstatus_failure_queue0aef8}= useContext(TotalContext) as TotalContextProps  
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
  //////////////
  const [goruleData,setGoruleData]=useState<any>({})
  function getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  // Utility to get nested value
  function getValueByPathForNested(obj: any, path: string): any {
    const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    return keys.reduce((acc, key) => acc?.[key], obj);
  }

  // Clean the mapper path
  function extractPath(sourcekey: string): string {
    const rawPath = sourcekey.split('|').pop() ?? '';
    // remove items.properties. since your actual data has direct keys
    return rawPath
      .replace(/items\.properties\./g, '')
      .replace(/items\./g, '')
      .replace(/properties\./g, '');
  }

  function getColumnTypeFromSchema(schemaNode: any, columnId: string): string {
    const nodeType = schemaNode?.nodeType;
    const schema = schemaNode?.schema;

    if (!schema || !columnId) return 'string';

    if (nodeType === 'datasetnode' || nodeType === 'datasetschemanode') {
      if (schema?.type === 'object') {
        return schema?.properties?.[columnId]?.type || 'string';
      } else if (schema?.type === 'array') {
        return schema?.items?.properties?.[columnId]?.type || 'string';
      }
    } else if (nodeType === 'apinode') {
      const responseSchema = schema?.responses?.["200"]?.content?.["application/json"]?.schema;
      if (responseSchema?.type === 'object') {
        return responseSchema?.properties?.[columnId]?.type || 'string';
      } else if (responseSchema?.type === 'array') {
        return responseSchema?.items?.properties?.[columnId]?.type || 'string';
      }
    } else if (nodeType === 'dbnode') {
      if (Array.isArray(schema)) {
        const col = schema.find((c: any) => c.name === columnId);
        return col?.type || 'string';
      }
    }

    return 'string';
  }

  function formatNumberWithCommas(value: any): string | any {
    if (value === null || value === undefined || value === '') return value;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || !isFinite(num)) return value;
    if (typeof value === 'string' && !/^-?\d+(\.\d+)?$/.test(value.trim())) return value;
    return num.toLocaleString('en-US');
  }

  const GetTableDetails = async () => {
    const orchestrationData:any = getGroupOrchestrationData(
        groupData,
        "30d27f3c0b15480fac0a14f04f6a476f",
      );

    if (orchestrationData?.data) {
      mapperData = orchestrationData?.data?.mapper;
      schemaDataDFO = orchestrationData?.data?.schemaData;
      setAllCode(orchestrationData?.data?.code)
      setGoruleData(orchestrationData?.data?.GoRuleData ||{})
      if (orchestrationData?.data?.action) {
    let schemaData:any = {}
        if(orchestrationData?.data?.schemaData && orchestrationData?.data?.mappperNodeId)
        {
          orchestrationData?.data?.schemaData?.map((ele:any)=>{
            if(ele.nodeId==orchestrationData?.data?.mappperNodeId)
            {
          if (ele?.nodeType == 'datasetnode' || ele?.nodeType == 'datasetschemanode'){
          if (ele?.schema?.type == "object") {
              schemaData = ele?.schema?.properties;
          }else if (ele?.schema?.type == "array") {
              schemaData = ele?.schema?.items?.properties;
          }                            
          }else if (ele?.nodeType == 'apinode') {
          if (ele?.schema?.responses["200"].content["application/json"].schema?.type == "object") {
              schemaData = ele?.schema?.responses["200"].content["application/json"].schema?.properties;
          }else if (ele?.schema?.responses["200"].content["application/json"].schema?.type == "array") {
              schemaData = ele?.schema?.responses["200"].content["application/json"].schema?.items?.properties;
          }
          }else if (ele?.nodeType == 'dbnode') {
          let temp:any = {}
          if (Array.isArray(ele?.schema)) {
          ele?.schema.map((cols:any)=>{
              temp[cols.name]={type:cols.type}
          })
          }
          schemaData = temp;
          } 
        }
      })
          let altertColumns:any=[]
          let allowesColumns:any=[]
          if(Array.isArray(orchestrationData?.data?.security) )
          {
            let securityData=orchestrationData?.data?.security
            allowesColumns=defaultColumns.filter((item:any)=>{
              if(securityData.includes(item?.id))
                return item
              })
          }
    for (let i = 0; i < allowesColumns.length; i++) {
      for (let j = 0; j < mapperData.length; j++) {
        if (allowesColumns[i].id === mapperData[j]?.elementname.toLowerCase()) {
          let nodeId = mapperData[j]?.sourcekey.split("|")[1];
          let path = mapperData[j]?.sourcekey.split("|")[2];
          for (let k = 0; k < schemaDataDFO.length; k++) {
            if (schemaDataDFO[k].nodeId === nodeId) {
              const columnType = getColumnTypeFromSchema(schemaDataDFO[k], allowesColumns[i].id);
              altertColumns.push({...allowesColumns[i], type: columnType})
            }
          }
        }
      }
      if(allowesColumns[i].type== '__ActionDetails__')
      {
        altertColumns.push(allowesColumns[i])
      }            
    }
          // allowesColumns.map((defaultRenderItem:any)=>{
          //   if(defaultRenderItem.id in schemaData)
          //   {
          //     altertColumns.push({...defaultRenderItem,type:schemaData[defaultRenderItem.id].type || 'string'})
          //   }
          // })
    const translatedColumnsData = altertColumns.map((col:any) => ({
      ...col,
      name: keyset(col?.name), 
      }));
    setTranslatedColumns(translatedColumnsData)
        }
    // for pagination data page ,count and dfkey
    setPaginationData((pre: any) => ({
      ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 0,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 0
    }))

    setDFkeyAndRule((pre:any)=>({
      ...pre,
            isRulePresent:Object.keys(orchestrationData?.data?.rule).length!=0 && orchestrationData?.data?.rule?.nodes?.length!=0 && orchestrationData?.data?.rule?.edges?.length!=0  ? true:false,
            dfKey:orchestrationData?.data?.dfKey||"",
            dfdType:orchestrationData?.data?.dfdNodeType


    }))

        dfKey = orchestrationData?.data?.dfKey
        dfdType = orchestrationData?.data?.dfdNodeType
    
        fetchData(orchestrationData?.data?.action?.pagination?.page,orchestrationData?.data?.action?.pagination?.count,{},{dfKey,dfdType},Object.keys(orchestrationData?.data?.rule).length!=0 && orchestrationData?.data?.rule?.nodes?.length!=0 && orchestrationData?.data?.rule?.edges?.length!=0  ? true:false)
  }
    } 
  }
  const [SearchParams,setSearchParams] = useState<any>({})

    const setLockMode=async(ids:any)=>{
      ///////////////////////////

    let customCode:any=""
    if (allCode != '') {
      let codeStates: any = {};
        codeStates['tran_main_group'] = tran_main_group1dc7f,
        codeStates['settran_main_group'] = settran_main_group1dc7f,
        codeStates['tran_main_group1dc7f'] = tran_main_group1dc7fProps,
        codeStates['settran_main_group1dc7f'] = settran_main_group1dc7fProps,
        codeStates['tran_tab_group'] = tran_tab_group08b64,
        codeStates['settran_tab_group'] = settran_tab_group08b64,
        codeStates['tran_tab_group08b64'] = tran_tab_group08b64Props,
        codeStates['settran_tab_group08b64'] = settran_tab_group08b64Props,
        codeStates['view_all_tab'] = view_all_tab4a963,
        codeStates['setview_all_tab'] = setview_all_tab4a963,
        codeStates['view_all_tab4a963'] = view_all_tab4a963Props,
        codeStates['setview_all_tab4a963'] = setview_all_tab4a963Props,
        codeStates['view_all_table'] = view_all_tablec9e87,
        codeStates['setview_all_table'] = setview_all_tablec9e87,
        codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
        codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
        codeStates['view_all_journey_group'] = view_all_journey_group67ce4,
        codeStates['setview_all_journey_group'] = setview_all_journey_group67ce4,
        codeStates['view_all_journey_group67ce4'] = view_all_journey_group67ce4Props,
        codeStates['setview_all_journey_group67ce4'] = setview_all_journey_group67ce4Props,
        codeStates['failure_queue_tab'] = failure_queue_tab69f01,
        codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
        codeStates['failure_queue_tab69f01'] = failure_queue_tab69f01Props,
        codeStates['setfailure_queue_tab69f01'] = setfailure_queue_tab69f01Props,
        codeStates['failure_queue_table'] = failure_queue_tablea476f,
        codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
        codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
        codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
        codeStates['product_code_failure_queue'] = product_code_failure_queue12297,
        codeStates['setproduct_code_failure_queue'] = setproduct_code_failure_queue12297,
        codeStates['channel_name_failure_queue'] = channel_name_failure_queue42953,
        codeStates['setchannel_name_failure_queue'] = setchannel_name_failure_queue42953,
        codeStates['uuid_failure_queue'] = uuid_failure_queue03c86,
        codeStates['setuuid_failure_queue'] = setuuid_failure_queue03c86,
        codeStates['dr_account_failure_queue'] = dr_account_failure_queuef9d2d,
        codeStates['setdr_account_failure_queue'] = setdr_account_failure_queuef9d2d,
        codeStates['dr_amount_failure_queue'] = dr_amount_failure_queue95d4e,
        codeStates['setdr_amount_failure_queue'] = setdr_amount_failure_queue95d4e,
        codeStates['cr_account_failure_queue'] = cr_account_failure_queuea7246,
        codeStates['setcr_account_failure_queue'] = setcr_account_failure_queuea7246,
        codeStates['cr_amount_failure_queue'] = cr_amount_failure_queue57c4d,
        codeStates['setcr_amount_failure_queue'] = setcr_amount_failure_queue57c4d,
        codeStates['remittance_info_failure_queue'] = remittance_info_failure_queue09d7a,
        codeStates['setremittance_info_failure_queue'] = setremittance_info_failure_queue09d7a,
        codeStates['status_failure_queue'] = status_failure_queue0aef8,
        codeStates['setstatus_failure_queue'] = setstatus_failure_queue0aef8,
        codeStates['failure_queue_journey_group'] = failure_queue_journey_group36aba,
        codeStates['setfailure_queue_journey_group'] = setfailure_queue_journey_group36aba,
        codeStates['failure_queue_journey_group36aba'] = failure_queue_journey_group36abaProps,
        codeStates['setfailure_queue_journey_group36aba'] = setfailure_queue_journey_group36abaProps,
        codeStates['success_queue_tab'] = success_queue_tabef582,
        codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
        codeStates['success_queue_tabef582'] = success_queue_tabef582Props,
        codeStates['setsuccess_queue_tabef582'] = setsuccess_queue_tabef582Props,
        codeStates['success_queue_table'] = success_queue_table63aae,
        codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
        codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
        codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
        codeStates['success_queue_journey_group'] = success_queue_journey_group755eb,
        codeStates['setsuccess_queue_journey_group'] = setsuccess_queue_journey_group755eb,
        codeStates['success_queue_journey_group755eb'] = success_queue_journey_group755ebProps,
        codeStates['setsuccess_queue_journey_group755eb'] = setsuccess_queue_journey_group755ebProps,
        codeStates['return_queue_tab'] = return_queue_tab5611e,
        codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
        codeStates['return_queue_tab5611e'] = return_queue_tab5611eProps,
        codeStates['setreturn_queue_tab5611e'] = setreturn_queue_tab5611eProps,
        codeStates['return_queue_table'] = return_queue_table267f0,
        codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
        codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
        codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
        codeStates['return_queue_journey_group'] = return_queue_journey_group92c55,
        codeStates['setreturn_queue_journey_group'] = setreturn_queue_journey_group92c55,
        codeStates['return_queue_journey_group92c55'] = return_queue_journey_group92c55Props,
        codeStates['setreturn_queue_journey_group92c55'] = setreturn_queue_journey_group92c55Props,
        codeStates['operational_pending_tab'] = operational_pending_tab67331,
        codeStates['setoperational_pending_tab'] = setoperational_pending_tab67331,
        codeStates['operational_pending_tab67331'] = operational_pending_tab67331Props,
        codeStates['setoperational_pending_tab67331'] = setoperational_pending_tab67331Props,
        codeStates['operational_pending_table'] = operational_pending_table0a253,
        codeStates['setoperational_pending_table'] = setoperational_pending_table0a253,
        codeStates['operational_pending_table0a253'] = operational_pending_table0a253Props,
        codeStates['setoperational_pending_table0a253'] = setoperational_pending_table0a253Props,
        codeStates['operational_pending_journey_group'] = operational_pending_journey_group63667,
        codeStates['setoperational_pending_journey_group'] = setoperational_pending_journey_group63667,
        codeStates['operational_pending_journey_group63667'] = operational_pending_journey_group63667Props,
        codeStates['setoperational_pending_journey_group63667'] = setoperational_pending_journey_group63667Props,
        codeStates['technical_pending_tab'] = technical_pending_tab0b23f,
        codeStates['settechnical_pending_tab'] = settechnical_pending_tab0b23f,
        codeStates['technical_pending_tab0b23f'] = technical_pending_tab0b23fProps,
        codeStates['settechnical_pending_tab0b23f'] = settechnical_pending_tab0b23fProps,
        codeStates['technical_pending_table'] = technical_pending_table84f30,
        codeStates['settechnical_pending_table'] = settechnical_pending_table84f30,
        codeStates['technical_pending_table84f30'] = technical_pending_table84f30Props,
        codeStates['settechnical_pending_table84f30'] = settechnical_pending_table84f30Props,
        codeStates['technical_pending_journey_group'] = technical_pending_journey_groupe4f03,
        codeStates['settechnical_pending_journey_group'] = settechnical_pending_journey_groupe4f03,
        codeStates['technical_pending_journey_groupe4f03'] = technical_pending_journey_groupe4f03Props,
        codeStates['settechnical_pending_journey_groupe4f03'] = settechnical_pending_journey_groupe4f03Props,
      customCode = codeExecution(allCode,codeStates);
      return customCode;
    }

  }
  const [selectedPaginationData, setSelectedPaginationData] = useState<any[]>(
      []
    )
  const [settings, setSettings] = useState<any>();
  const handleUpdate = (page:any, pageSize:any) =>{
    let searchParams:any = nullFilter(SearchParams);
    setfailure_queue_tablea476fProps((pre:any)=>({...pre, selectedIds:[]}))
    let checkedData: any = selectedPaginationData
    if (checkedData.length) {
      for (let i = 0; i < checkedData.length; i++) {
        if (checkedData[i].page == page) {
          setfailure_queue_tablea476fProps((pre:any)=>({...pre, selectedIds:checkedData[i].data}))
        }
      }
    }
    setPaginationData(prevState => ({ ...prevState, page, pageSize }))
    fetchData(page, pageSize,searchParams,DFkeyAndRule,DFkeyAndRule?.isRulePresent,false,filterPropsData,filterPropsData?true:false)
  }
  async function onRowClick(e:any) {
    }

  async function fetchData(page:any = 1, pageSize:any = 10, searchParams = {},dfKey:any,isRulePresent:any=false,isOnLoad = false,filterProps?:any,itsFromRefreshHandler:any=false){
    let filterData :any[] =[];
    if(transactionproduct_v1Props.length > 0){
      for(let i=0;i< transactionproduct_v1Props.length;i++){
        if(transactionproduct_v1Props[i].DFDkey == "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:transaction:AFVK:v1"){
          // delete transactionproduct_v1Props[i].DFDkey;
          let temp=structuredClone(transactionproduct_v1Props[i])
          delete temp?.DFDkey
          filterData.push(temp)
        }           
      }
    }
      setTableData([]);
    if(isRulePresent==undefined)
      isRulePresent=DFkeyAndRule?.isRulePresent||false
    if(searchFilterFlag===true){
      searchParams={}
    }
 
    let dstKey=dfKey?.dfKey
    dstKey=dstKey?.replace(":AFC:",":AFCP:").replace(":AF:",":AFP:").replace(":DF-DFD:",":DF-DST:");
    try {

      let api_pagination: any;
      let api_paginationBody: api_paginationDto;
      if (isRulePresent==false||itsFromRefreshHandler) {
        if(filterProps||itsFromRefreshHandler){
        let te_refreshBody: te_refreshDto = {
          key: dfKey?.dfKey,
          upId: upId,
          refreshFlag: "Y",
          count:paginationDetails.pageSize,
          page:paginationDetails.page
        }
        if(encryptionFlagCont) {
        te_refreshBody["dpdKey"] = encryptionDpd
        te_refreshBody["method"] = encryptionMethod
        }
        te_refreshBody["filterData"] = filterProps
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
        if(itsFromRefreshHandler)
        {
          if(DFkeyAndRule?.isRulePresent==true)
          {
            api_paginationBody = {
              key: dstKey,
              page: parseInt(page),
              count: parseInt(pageSize),
              searchFilter: searchParams,
              filterDetails: {
                ufKey:'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:transactionProduct:AFVK:v1:UO', 
                nodeId: '30d27f3c0b15480fac0a14f04f6a476f',
                elementId: '30d27f3c0b15480fac0a14f04f6a476f'
              },
            }
          }else
          {
            api_paginationBody = {
              key: dstKey,
              page: parseInt(page),
              count: parseInt(pageSize),
              searchFilter: searchParams,
              filterData: filterData
            }   
          }
        if(te_refresh?.data?.dataset === 'Bulk Data Processing'){
          api_paginationBody["filterData"] = filterProps
        }
        if(encryptionFlagCont) {
        api_paginationBody["dpdKey"] = encryptionDpd
        api_paginationBody["method"] = encryptionMethod
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
        if (api_pagination?.data?.error == true) {
          toast(api_pagination?.data?.errorDetails?.message, 'danger')
          return
        }
        if(api_pagination?.data?.records?.length==0 && page!=0 && page!='0'&& page!=undefined)
        {
          await fetchData((+page)-1,pageSize,searchParams,dfKey,isRulePresent,isOnLoad,filterProps,itsFromRefreshHandler)
          return
        }
        else{
          setAllData(api_pagination?.data?.records)
          setTableData(api_pagination?.data?.records)
          setPaginationData(prevState => ({
            ...prevState,
            page:+page,
            total: api_pagination.data.totalRecords
          }))
        }
        }else{
          const paginationFilterData = filterProps.reduce((acc: any, item: any) => {
            Object.keys(item).forEach((key) => {
              if (key !== 'nodeId' && item[key] !== undefined) {
                acc[key] = item[key]
              }
            })
            return acc
          }, {})
  
          const { filterData: _, key, ...restBody } = te_refreshBody
          api_paginationBody = {
            ...restBody,
            key: key
              ?.replace(':AFC:', ':AFCP:')
              .replace(':AF:', ':AFP:')
              .replace(':DF-DFD:', ':DF-DST:'),
            searchFilter: paginationFilterData,
             filterData: filterData
          }
          if(encryptionFlagCont) {
            api_paginationBody["dpdKey"] = encryptionDpd
            api_paginationBody["method"] = encryptionMethod
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
          setAllData(api_pagination?.data?.records)
          setTableData(api_pagination?.data?.records)
        }
        }else{
        api_paginationBody = {
          key: dstKey,
          page: parseInt(page),
          count: parseInt(pageSize),
          searchFilter: searchParams,
          filterData: filterData
        }
        if(encryptionFlagCont) {
        api_paginationBody["dpdKey"] = encryptionDpd
        api_paginationBody["method"] = encryptionMethod
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
        if (api_pagination?.data?.error == true) {
          toast(api_pagination?.data?.errorDetails?.message, 'danger')
          return
        }
        setAllData(api_pagination?.data?.records)
          setTableData(api_pagination?.data?.records)
        setPaginationData(prevState => ({
          ...prevState,
          total: api_pagination.data.totalRecords
        }))
        if (api_pagination.data.records.length == 0 && api_pagination.data.totalRecords != 0) {
          api_paginationBody.page =  page-1
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
        setAllData(api_pagination?.data?.records)
          setTableData(api_pagination?.data?.records)
        }
        setPaginationData(prevState => ({
          ...prevState,
          page: +page,
          total: api_pagination.data.totalRecords
        }))
        }
        if(api_pagination?.data?.records.length==0){ 
          setfailure_queue_tablea476f([])
          setAllDataObject([])
          return
        }
      } else {
        if(filterProps){
        let te_refreshBody: te_refreshDto = {
          key: dfKey?.dfKey,
          upId: upId,
          refreshFlag: "Y",
          count:paginationDetails.pageSize,
          page:paginationDetails.page
        }
        if(encryptionFlagCont) {
        te_refreshBody["dpdKey"] = encryptionDpd
        te_refreshBody["method"] = encryptionMethod
        }
        te_refreshBody["filterData"] = filterProps
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
        const paginationFilterData = filterProps.reduce((acc: any, item: any) => {
          Object.keys(item).forEach((key) => {
            if (key !== 'nodeId' && item[key] !== undefined) {
              acc[key] = item[key]
            }
          })
          return acc
        }, {})

        const { filterData: _, key, ...restBody } = te_refreshBody
        api_paginationBody = {
          ...restBody,
          key: key
            ?.replace(':AFC:', ':AFCP:')
            .replace(':AF:', ':AFP:')
            .replace(':DF-DFD:', ':DF-DST:'),
          searchFilter: paginationFilterData
        }
        if(encryptionFlagCont) {
          api_paginationBody["dpdKey"] = encryptionDpd
          api_paginationBody["method"] = encryptionMethod
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
        setAllData(api_pagination?.data?.records)
        setTableData(api_pagination?.data?.records)
        }else{
        api_paginationBody= {
          key: dstKey,
          page: parseInt(page),
          count: parseInt(pageSize),
          filterDetails: {
            ufKey:'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:transactionProduct:AFVK:v1:UO', 
            nodeId: '30d27f3c0b15480fac0a14f04f6a476f',
            elementId: '30d27f3c0b15480fac0a14f04f6a476f'
          },
          searchFilter: searchParams
        }
        if(encryptionFlagCont) {
        api_paginationBody["dpdKey"] = encryptionDpd
        api_paginationBody["method"] = encryptionMethod
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
        if (api_pagination?.data?.error == true) {
          toast(api_pagination?.data?.errorDetails?.message, 'danger')
          return
        }
        setAllData(api_pagination?.data?.records)
        setTableData(api_pagination?.data?.records)
        setPaginationData(prevState => ({
          ...prevState,
           page:+page,
          total: api_pagination.data.totalRecords
        }))
        if (api_pagination.data.records.length == 0 && api_pagination.data.totalRecords != 0) {
          api_paginationBody.page =  page-1
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
        setAllData(api_pagination?.data?.records)
        setTableData(api_pagination?.data?.records)
        }
        setPaginationData(prevState => ({
          ...prevState,
          page: +page,
          total: api_pagination.data.totalRecords
        }))
        }
        if(api_pagination?.data?.records.length==0){ 
          setfailure_queue_tablea476f([])
          setAllDataObject([])
          return
        }
      }
      
      if (api_pagination?.data?.records.length > 0) {
        const mappedResult: Record<string, any>[] = api_pagination?.data?.records.map((emp:any) => {
        const result: Record<string, any> = {};

        mapperData.forEach((m:any) => {
          const path = extractPath(m.sourcekey);
          const value = getValueByPathForNested(emp, path);
          result[m.elementname.toLowerCase()] = value;
        });

        result.trs_process_id = emp.trs_process_id;
        result.trs_access_profile = emp.trs_access_profile;
        result.trs_org_grp_code = emp.trs_org_grp_code;
        result.trs_org_code = emp.trs_org_code;
        result.trs_role_grp_code = emp.trs_role_grp_code;
        result.trs_role_code = emp.trs_role_code;
        result.trs_ps_grp_code = emp.trs_ps_grp_code;
        result.trs_ps_code = emp.trs_ps_code;
        result.trs_process_status = emp.trs_process_status;
        result.trs_process_status_desc = emp.trs_process_status_desc;
        result.trs_status_desc = emp.trs_status_desc;
        result.trs_process_code = emp.trs_process_code;
        result.trs_previous_process_code = emp.trs_previous_process_code;
        result.trs_next_process_code = emp.trs_next_process_code;
        result.trs_sub_org_grp_code = emp.trs_sub_org_grp_code;
        result.trs_sub_org_code = emp.trs_sub_org_code;
        result.trs_app_code = emp.trs_app_code;
        result.trs_locked_by = emp.trs_locked_by;
        result.trs_locked_time = emp.trs_locked_time;

        return result;
        });
        let uf_paginationDataFilter: any = {};
        uf_paginationDataFilter["data"] = mappedResult;
      // const uf_paginationDataFilterBody: uf_paginationDataFilterDto = {
      //   data: api_pagination.data.records,
      //   key: 'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:transactionProduct:AFVK:v1',
      //   "dfdType":dfKey?.dfdType,
      //   "primaryKey":"uuid"
      // }
      // if(encryptionFlagCont) {
      // uf_paginationDataFilterBody["dpdKey"] = encryptionDpd
      // uf_paginationDataFilterBody["method"] = encryptionMethod
      // }
      // const uf_paginationDataFilter = await AxiosService.post(
      //   '/UF/PaginationDataFilter',
      //   uf_paginationDataFilterBody,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // )
      if (uf_paginationDataFilter.data.length >= 0&&Array.isArray(uf_paginationDataFilter.data)) {
        let filtertedData:any;
      // CopyFromData (Parent table): use presetValues if present, else use pagination-filtered data
        
        if ( failure_queue_tablea476fProps?.presetValues&&Object.keys(failure_queue_tablea476fProps?.presetValues).length > 0) {
          filtertedData = [failure_queue_tablea476fProps?.presetValues];
        }else {
          filtertedData = structuredClone(uf_paginationDataFilter.data)||[]
          setfailure_queue_tablea476f(api_pagination?.data?.records||[])
        }
        defaultColumns.map((items:any)=>{
          if(items?.isColourIndicator==true)
          {
            for(let i=0;i<filtertedData.length;i++){
              filtertedData[i]={...filtertedData[i],[items?.id]:colurIndicator(items?.colourIndicator,filtertedData[i][items?.id],items?.ColourIndicatorType)}
            }
          }
        })
        for (let i = 0; i < filtertedData.length; i++) {     
          let JSONType:any=filtertedData[i] || {}
          Object.keys(JSONType).map((key: any) => {
              if(typeof JSONType[key] === 'object' && JSONType[key] !== null && !colourIndicatorCols?.includes(key)) {
                  JSONType[key] =  <JsonView
                    theme="atom"
                    enableClipboard={true}
                    src={JSONType[key]}
                    style={{ fontSize: "0.833vw" }}
                    collapsed={true}
                  />
              } else {
                // Check if column type is number and format with commas
                const columnConfig = translatedColumns.find((col: any) => col.id === key || col.dfdName === key);
                if (columnConfig?.type === 'number' || columnConfig?.type === 'integer' || typeof JSONType[key] === 'number') {
                  JSONType[key] = formatNumberWithCommas(JSONType[key]);
                }
              }
          })
          filtertedData[i] = JSONType
        }
        setAllDataObject(filtertedData)
        return
      }
      }
    } catch (err: any) {
      toast(err?.response?.data?.errorDetails?.message, 'danger')
    }
  }
////////////////////////////////
  const RowAction = async({item,index,nodeName}: any) => {
    let filteredData:any={}
    if(allData.length!=0)
    {
      filteredData=flattenKeepInner(allData[index]||{})
    }


  };

////////////////////////
const colurIndicator = (keyValue:any=[], comingValue:any,ColourIndicatorType:any) => {
    let customeUI: JSX.Element | null = null;
    for (let i = 0; i < keyValue.length; i++) {
      if (keyValue[i]?.key == comingValue) {
        if(ColourIndicatorType == "rectangle")
        {
          customeUI = (
            <Tooltip title={keyValue[i]?.key} placement="top-start">
            <div
              className="flex h-full p-2 justify-center "
              style={{ backgroundColor: keyValue[i]?.colorCode||'#fff' }}
            >
             {keyValue[i]?.icon ? <Icon data={keyValue[i]?.icon } size={20} fillContainer={false}/>:comingValue}
            </div>
            </Tooltip>
          );
        }
        else
        {
          customeUI = (
            <Tooltip title={keyValue[i]?.key} placement="top-start">
             <div
              className="flex rounded-2xl h-full p-2 justify-center w-[10%] "
              style={{ backgroundColor: keyValue[i]?.colorCode||'#fff' }}
            >  
            </div>
            </Tooltip>
          );
        }
        break;
      }
    }
    if(!customeUI)
    {
      return comingValue
    }
    return customeUI;
  };

  useEffect(() => {
    GetTableDetails()
  }, [])
  useEffect(() => {
    if (prevRefreshRef.current) {
      UpdatedDataHandle(failure_queue_tablea476fProps.filterProps)
    }else 
      prevRefreshRef.current= true
  }, [failure_queue_tablea476fProps.filterProps])

  async function UpdatedDataHandle(filterProps?: any) { 
    setLoading(true)
    let searchParams:any = nullFilter(SearchParams);
    if(filterProps&& filterProps?.length)
    {
      filterProps[0]= {...filterProps[0],...searchParams}
      filterPropsData = filterProps;
    }

    fetchData(paginationData.page , paginationData.pageSize,{},DFkeyAndRule,DFkeyAndRule?.isRulePresent,true,filterProps,true)
    setLoading(false)
  }
  
  // Handle clearData flag - clears table without re-fetching
  useEffect(() => {
    if (failure_queue_tablea476fProps?.clearData === true) {
      setfailure_queue_tablea476f([]);
      setAllDataObject([]);
      setAllData([]);
      setTableData([]);
      setSelectedPaginationData([]);
      setLockedData((pre:any) => ({...pre, data:[]}));
      setfailure_queue_tablea476fProps((pre:any) => ({...pre, clearData: false, selectedIds: []}));
      setPaginationData((pre:any) => ({...pre, total: 0}));
    }
  }, [failure_queue_tablea476fProps?.clearData])
  useEffect(() => {
    if (!refreshInitRef.current) {
      refreshInitRef.current = true;
      return;
    }
    if(paginationData?.page != 0 && paginationData?.pageSize != 0 && DFkeyAndRule?.dfKey!='')
    UpdatedDataHandle()
    setLockedData((pre:any)=>({...pre, data:[]}))
    setfailure_queue_tablea476fProps((pre:any)=>({...pre, selectedIds:[]}))
    setSelectedPaginationData([])
    setAllDataObject([])
  }, [failure_queue_tablea476fProps?.refresh])


  const handlePrimaryTable = () => {
    let findData = failure_queue_tablea476fProps?.selectedIds[failure_queue_tablea476fProps?.selectedIds?.length-1]
    if(Array.isArray(failure_queue_tablea476f) && failure_queue_tablea476f.length>0)
    {
      let data = failure_queue_tablea476f[findData]
      setPrimaryTableData({
        ...primaryTableData,
        primaryKey: "uuid",
        value: data["uuid"],
        parentData: data
      })
    }
  }

  useEffect(() => {
    if (failure_queue_tablea476fProps?.selectedIds?.length != 0) handlePrimaryTable()
    if (failure_queue_tablea476fProps?.selectedIds?.length == 0){
      handleOnRowClick({},failure_queue_tablea476fProps?.selectedIds)
    }
  }, [failure_queue_tablea476fProps?.selectedIds])


      async function handleConfirmOnRowClick(){
      } 
  const handleOnRowClick=async(data?:any,ids?:any)=>{
  
    if(ids.length == 0){
    onButtonSecurityHandle(data)
    return
    }
    setfailure_queue_tablea476fProps((pre:any)=>({...pre, selectedIds:[ids[ids.length-1]]}))  
    onButtonSecurityHandle(data)
    let copyFormhandlerData :any = {}
          //bindtran
    const pkCol = translatedColumns.find((col:any) => col.dfdName === "uuid"); // Find the column whose dfdName matches
    const result = allData.find((item:any) => item["uuid"] === data[pkCol?.id || "uuid"]);
    setfailure_queue_journey_group36aba(result||{})

  }

  function onButtonSecurityHandle(data: any) {
    let nodes = Object.keys(goruleData) || []
    let temp: any = {}
    nodes.map((button: any) => {
      if (
        evaluateDecisionTableBoolean(
          goruleData[button]?.nodes,
          data,
          decodedTokenObj
        )
      ) {
        temp={...temp,[button]:true}
      }else{
        temp={...temp,[button]:false}
      }
    })
    setButtonGoRuleData(temp)
  }

  const bindPreviousAndNext=(currectIndex:any,forEvent:any,setData:string,parentTrigger:any="",currectPage:any)=>{ 
    if(currectPage!=paginationData?.page)
    {
    if(forEvent&&setData)
    {
      currectIndex=-1
      if(failure_queue_tablea476f?.length==0)
      {
        eventBus.emit(parentTrigger, { message: "no data" });
        return
      }
      if(forEvent=="next"&&failure_queue_tablea476f?.at((+currectIndex)+1))
      {
        const newIndex = (+currectIndex)+1;
        allState[setData](failure_queue_tablea476f?.at(newIndex))
        eventBus.emit(parentTrigger, { index: newIndex, data: failure_queue_tablea476f?.at(newIndex) ,currectPage:paginationData?.page});
        return newIndex
      }
      if(forEvent=="previous"&&((+currectIndex)-1)>=0&&failure_queue_tablea476f?.at((+currectIndex)-1))
      {
        const newIndex = (+currectIndex)-1;
        allState[setData](failure_queue_tablea476f?.at(newIndex))
        eventBus.emit(parentTrigger, { index: newIndex, data: failure_queue_tablea476f?.at(newIndex) ,currectPage:paginationData?.page});
        return newIndex
      } 
    }
    }else{
    if(forEvent&&setData)
    {
      if(failure_queue_tablea476f?.length==0)
      {
        eventBus.emit(parentTrigger, { message: "no data" });
        return
      }
      if(forEvent=="next"&&failure_queue_tablea476f?.at((+currectIndex)+1))
      {
        const newIndex = (+currectIndex)+1;
        allState[setData](failure_queue_tablea476f?.at(newIndex))
        eventBus.emit(parentTrigger, { index: newIndex, data: failure_queue_tablea476f?.at(newIndex) ,currectPage:paginationData?.page});
        return newIndex
      }
      if(forEvent=="previous"&&((+currectIndex)-1)>=0&&failure_queue_tablea476f?.at((+currectIndex)-1))
      {
        const newIndex = (+currectIndex)-1;
        allState[setData](failure_queue_tablea476f?.at(newIndex))
        eventBus.emit(parentTrigger, { index: newIndex, data: failure_queue_tablea476f?.at(newIndex) ,currectPage:paginationData?.page});
        return newIndex
      } 
    }
    }
    
  }
  if (failure_queue_tablea476f?.isHidden) {
    return <></>
  }
  return(
    <div className='w-full h-full'>
          <div
            className=' w-full h-full flex flex-row'
            id={"30d27f3c0b15480fac0a14f04f6a476f"}  onClick={(e:any) => {
              bindPreviousAndNext(e?.target?.dataset?.currectIndex,e?.target?.dataset?.forEvent,e?.target?.dataset?.setData,e?.target?.dataset?.parentTrigger,e?.target?.dataset?.currectPage)
            }}         
          >
            <Table
              className=""
              data={Array.isArray(allDataObject) && translatedColumns?.length ? allDataObject : []}
              columns={translatedColumns}
              edgePadding={true}
              selectedIds={failure_queue_tablea476fProps?.selectedIds}  
              onSelectionChange={setLockMode} 
              wordWrap={true}
              loading={loading}
              onRowClick={handleOnRowClick}
              isRowclick={true}
              showPagination={paginationData?.page != null && paginationData?.pageSize != null && paginationData?.total != null && Array.isArray(allDataObject) && allDataObject.length>0}
              pagination={{
                page : paginationData.page,
                pageSize : paginationData.pageSize,
                pageSizeOptions : [5, 10, 20, 50, 100],
                total:paginationData.total,
                onUpdate:(e:any)=>handleUpdate(e.page,e.pageSize)
              }}
              headerButtonsRenders={headerButtonsRenders()}
              headerText={headerText}
              headerPosition={headerPosition}
            />
            </div>
    </div>
  )
}

export default Tablefailure_queue_table
