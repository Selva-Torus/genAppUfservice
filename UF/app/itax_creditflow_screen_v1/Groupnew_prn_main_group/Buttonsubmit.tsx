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
 

const Buttonsubmit = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any}) => {
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
    
 /////////////
   //another screen

  const {new_prn_main_group21910, setnew_prn_main_group21910}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910Props, setnew_prn_main_group21910Props}= useContext(TotalContext) as TotalContextProps;
  const {transaction_details_label6f776, settransaction_details_label6f776}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id19a2c, setitaxst_id19a2c}= useContext(TotalContext) as TotalContextProps;
  const {prnno_label2284a, setprnno_label2284a}= useContext(TotalContext) as TotalContextProps;
  const {eslip_noe1f20, seteslip_noe1f20}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labela8526, setpayment_type_labela8526}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdown5d344, setpayment_type_dropdown5d344}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label99095, setdebit_account_no_label99095}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no9ec5d, setdebit_account_no9ec5d}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_full_name_labeld7111, settax_payers_full_name_labeld7111}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name8bf4d, settax_payer_full_name8bf4d}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_label46f0a, setdebit_amount_label46f0a}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountbbf1f, setdebit_amountbbf1f}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt_labeleacfe, setloan_amt_labeleacfe}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt3440e, setloan_amt3440e}= useContext(TotalContext) as TotalContextProps;
  const {auth_memo_labelf0a0e, setauth_memo_labelf0a0e}= useContext(TotalContext) as TotalContextProps;
  const {filename4f410, setfilename4f410}= useContext(TotalContext) as TotalContextProps;
  const {memo_documentuploader51a64, setmemo_documentuploader51a64}= useContext(TotalContext) as TotalContextProps;
  const {clear14cbd, setclear14cbd}= useContext(TotalContext) as TotalContextProps;
  const {submitc9c9c, setsubmitc9c9c}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6, setitax_source_table1afd6}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6Props, setitax_source_table1afd6Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['new_prn_main_group']  = new_prn_main_group21910,
      codeStates['setnew_prn_main_group'] = setnew_prn_main_group21910,
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
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1",
          componentId: "f1099583e1124434b28d0c4b0be21910",
          controlId: "ec3e88cc91a0483c90db830f757c9c9c",
          isTable: false,
          from:"ButtonSubmit",
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
      if (id === "submitc9c9c") {
        handleClick();
      }
    });
  },[submitc9c9c?.refresh,currentToken])

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

  async function handleSave9c_1_1_1_2(){

    setValidateRefetch((pre: any) => ({ ...pre, value: !pre.value, init: pre.init + 1 }));
    await delay(1000);
     
    let currentValidate: any = null;
    await new Promise<void>((resolve) => {
      setValidate((prev: any) => {
        currentValidate = prev;
        return prev;
      });
      resolve();
    });

    // Check if any field is invalid using .some() with null safety
    const hasInvalidField = Object.values(currentValidate?.ITAX_CreditFlow_Screen_v1 || {}).some(
      (value) => value === 'invalid'
    );

    if (hasInvalidField) {
      toast('Please verify the data', 'danger');
      return;
    }
    try{
      let mainData:any=structuredClone(new_prn_main_group21910);
      let uf_initiatePf:any;
      let te_eventEmitterBody:te_eventEmitterDto={
        dpdKey: '',
        method: '',
        event: '',
        sourceId: '',
        key: '',
        ssKey: [],
        data: {},
        lock: {}
      }
      let tagetKey:string="CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|14f77b90fb664f7da993cee1faef6adb"
      let uf_getPFDetails:any={
        key: "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|14f77b90fb664f7da993cee1faef6adb"
      };
      let uf_ifo:any;
      let lockedKeysLength:number;
      let eventProperty :any = {
  "id": "ec3e88cc91a0483c90db830f757c9c9c",
  "type": "button",
  "name": "submit",
  "label": "submit",
  "sequence": 1,
  "children": [
    {
      "id": "ec3e88cc91a0483c90db830f757c9c9c.1.1",
      "type": "eventNode",
      "name": "onClick",
      "label": "onClick",
      "sequence": "1.1",
      "children": [
        {
          "id": "ec3e88cc91a0483c90db830f757c9c9c.1.1.1",
          "eventContext": "riseListen",
          "value": "",
          "type": "handlerNode",
          "name": "getFormData",
          "label": "getFormData",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "4725fb7b4b994db2bb5cd1ad08100560.1.1.1.1",
              "type": "screen",
              "name": "ITAX_Payment_Details.v1|prn_details_group",
              "label": "ITAX_Payment_Details.v1|prn_details_group",
              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|prn_details_group",
              "elementType": "group",
              "groupType": "group",
              "sequence": "1.1.1.1",
              "children": []
            },
            {
              "id": "ec3e88cc91a0483c90db830f757c9c9c.1.1.1.2",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "saveHandler",
              "label": "saveHandler",
              "sequence": "1.1.1.2",
              "children": [
                {
                  "id": "ec3e88cc91a0483c90db830f757c9c9c.1.1.1.2.1",
                  "eventContext": "rise",
                  "value": "",
                  "type": "handlerNode",
                  "name": "infoMsg",
                  "label": "infoMsg",
                  "sequence": "1.1.1.2.1",
                  "children": [
                    {
                      "id": "ec3e88cc91a0483c90db830f757c9c9c.1.1.1.2.1.1",
                      "eventContext": "riseListen",
                      "value": "",
                      "type": "handlerNode",
                      "name": "refreshElement",
                      "label": "refreshElement",
                      "sequence": "1.1.1.2.1.1",
                      "children": [
                        {
                          "id": "ed904c9f9554459cb9951c83c141afd6.1.1.1.2.1.1.1",
                          "value": "",
                          "type": "screen",
                          "name": "ITAX_KEDTB_Main_Screen.v1|itax_source_table",
                          "label": "ITAX_KEDTB_Main_Screen.v1|itax_source_table",
                          "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1|itax_source_table",
                          "elementType": "group",
                          "groupType": "table",
                          "sequence": "1.1.1.2.1.1.1",
                          "children": []
                        }
                      ]
                    }
                  ],
                  "hlr": {
                    "params": [
                      {
                        "name": "message",
                        "_type": "text",
                        "value": "Credit Application Initiated Successfully",
                        "enabled": true
                      },
                      {
                        "name": "type",
                        "_type": "select",
                        "selectionList": [
                          "none",
                          "info",
                          "success",
                          "warning",
                          "danger",
                          "utility"
                        ],
                        "value": "success",
                        "enabled": true
                      }
                    ]
                  }
                }
              ],
              "hlr": {
                "params": [
                  {
                    "name": "needClearValue",
                    "_type": "boolean",
                    "value": false,
                    "enabled": true
                  }
                ]
              },
              "targetKey": [
                "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|14f77b90fb664f7da993cee1faef6adb"
              ]
            }
          ],
          "hlr": {
            "params": [
              {
                "name": "parentTable",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              },
              {
                "name": "primaryKey",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              }
            ]
          }
        }
      ]
    }
  ]
};
      let eventDetails : any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1";
      sourceId+= "|"+"f1099583e1124434b28d0c4b0be21910";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1.2");
      let sourceIdNewPath : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1"+"|"+"f1099583e1124434b28d0c4b0be21910"+"|"+eventProperty.id;
      pathIds.map((ele:any,id:number)=>{
        if(id!=pathIds.length-1)
        {
          sourceIdNewPath=sourceIdNewPath+"|"+ele
        }
      })
      for (let k = 0; k < eventDetailsArray.length; k++) {
        if (
          eventDetailsArray[k].type === 'handlerNode' &&
          eventDetailsArray[k].name === 'saveHandler'
        ) {
          if (
            eventDetailsArray[k].targetKey &&
            eventDetailsArray[k].targetKey.length > 0
          ) {
            uf_getPFDetails= {
              key:tagetKey,
              sourceId:sourceIdNewPath
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              sourceId:sourceIdNewPath
            };
          }
        } else if (
          eventDetailsArray[k].type === 'handlerNode' &&
          eventDetailsArray[k].name === 'eventEmitter'
        ) {
          if (
            eventDetailsArray[k].targetKey &&
            eventDetailsArray[k].targetKey.length > 0
          ) {
            uf_getPFDetails= {
              key:tagetKey,
              status: eventDetailsArray[k]?.status,
              sourceId:sourceIdNewPath
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              status: eventDetailsArray[k]?.status,
              sourceId:sourceIdNewPath
            };
          }
        }
      }
    
      if (uf_getPFDetails.key != undefined) {
        const uf_initiatePfBody:uf_initiatePfDto={
          key:uf_getPFDetails.key,
          sourceId:sourceIdNewPath
        };
        if (encryptionFlagCont) {
          uf_initiatePfBody["dpdKey"] = encryptionDpd;
          uf_initiatePfBody["method"] = encryptionMethod;
        }
            uf_initiatePf = await AxiosService.post("/UF/InitiatePF",uf_initiatePfBody,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            })
              if(uf_initiatePf?.data?.error == true){
                toast(uf_initiatePf?.data?.errorDetails?.message, 'danger')
                return
              }
      
      } else {
        throw 'Please check PF'
      }

  // saveHandler
    let te_save:any;
    let te_saveBody:te_eventEmitterDto ={
      ...uf_initiatePf?.data?.nodeProperty
    }
    let eventData:any = {trs_event_process_status:uf_initiatePf?.data?.eventProperty?.source?.status,
      created_by:createdBy,
      modified_by:createdBy
    }
    let reworkedObject:any=nullFilter(new_prn_main_group21910);
    let reworkKeys:any[]=[];
      if(typeof reworkedObject === 'object' && reworkedObject !== null) {
      Object.keys(reworkedObject).map((item: any) => {
        if (
          typeof new_prn_main_group21910[item] === 'object' && 
          Array.isArray(new_prn_main_group21910[item]) && 
          new_prn_main_group21910[item].length > 0 && 
          typeof new_prn_main_group21910[item][0] !== "string"
        ) {
          const hasUrlProperty = new_prn_main_group21910[item][0]?.url !== undefined;
          const hasFileProperty = new_prn_main_group21910[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(new_prn_main_group21910[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      }); 
    } else if (Array.isArray(reworkedObject)) {
      Object.keys(new_prn_main_group21910).map((item: any) => {
        if (
          typeof new_prn_main_group21910[item] === 'object' && 
          Array.isArray(new_prn_main_group21910[item]) && 
          new_prn_main_group21910[item].length > 0 && 
          typeof new_prn_main_group21910[item][0] !== "string"
        ) {
          const hasUrlProperty = new_prn_main_group21910[item][0]?.url !== undefined;
          const hasFileProperty = new_prn_main_group21910[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(new_prn_main_group21910[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      });
    }
      if(reworkKeys.length)
      {
        for(let i=0;i<reworkKeys.length;i++){
          let fileBody:any = new_prn_main_group21910[reworkKeys[i]].map((item:any) => item?.file)
          const formData = new FormData();
          fileBody.forEach((file:File) => {
            formData.append("file", file);
          });
          formData.append('context', reworkKeys[i]);
          formData.append("enableEncryption", fileBody[0]?.enableEncryption);
          formData.append("returnType", fileBody[0]?.returnType || 'string');
          if (encryptionFlagCont) {
            formData.append("dpdKey" ,encryptionDpd);
            formData.append("method" ,encryptionMethod);
          }
          if (fileBody[0]?.DbType == 'mongodb') {
          const res : any = await AxiosService.post("/UF/upload", formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              }
            });
            reworkedObject[reworkKeys[i]] = res.data.fileId;
          } else if (fileBody[0]?.DbType == 'dfs') {
            const basePath : string = process.env.NEXT_PUBLIC_DFS_PATH || "dfs-uploads";
            const bucketFolderame : string = process.env.NEXT_PUBLIC_DFS_BUCKETNAME || 'uploadfile';
            formData.append('bucketFolderame', bucketFolderame.toLowerCase());
            formData.append('folderPath', basePath);

            const res : any = await AxiosService.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/uploadimg`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                }
              }
            );
            reworkedObject[reworkKeys[i]] = res.data.imageUrl;
          }
        }
      }
      ///////  for pivottable data preparation
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof new_prn_main_group21910[item]=='object')
        {
          if( new_prn_main_group21910[item].length>0 &&Object.keys(new_prn_main_group21910[item][0]).includes('_isSelected_'))
          {
            reworkedObject[item]=reworkedObject[item].filter((data:any)=>data?._isSelected_== true)
            for(let i=0;i<reworkedObject[item].length;i++)
            {
              reworkedObject[item][i] = nullFilter(reworkedObject[item][i])
              delete reworkedObject[item][i]._isSelected_
            }

          }
           
        }
      })

      if ("childTables" in new_prn_main_group21910) {
        te_saveBody.childTables = new_prn_main_group21910.childTables
      }  

      if (uf_getPFDetails.key != undefined) {
        let formData:any={};
        let ifoResponse:any[]=[];
        if(Array.isArray(new_prn_main_group21910))
        {
          formData=lockedData?.data || new_prn_main_group21910 || {};
          for( const dataList of formData )
          {
            
            const uf_ifoBody:uf_ifoDto={
              formData:dataList,
              key:uf_getPFDetails.key,
              groupId:"f1099583e1124434b28d0c4b0be21910",
              controlId:"ec3e88cc91a0483c90db830f757c9c9c"
            };
            if (encryptionFlagCont) {
            uf_ifoBody["dpdKey"] = encryptionDpd;
            uf_ifoBody["method"] = encryptionMethod;
          } 
            uf_ifo = await AxiosService.post(
            "/UF/ifo",
              uf_ifoBody,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                }
              }
            )
            
            if(uf_ifo?.data?.error == true){
              toast(uf_ifo?.data?.errorDetails?.message, 'danger');
              return
            }
          }
        } 
        else{
          formData=reworkedObject
          const uf_ifoBody:uf_ifoDto={
            formData:formData,
            key:uf_getPFDetails.key,
            groupId:"f1099583e1124434b28d0c4b0be21910",
            controlId:"ec3e88cc91a0483c90db830f757c9c9c"
          };
          if (encryptionFlagCont) {
            uf_ifoBody["dpdKey"] = encryptionDpd;
            uf_ifoBody["method"] = encryptionMethod;
          } 
          uf_ifo = await AxiosService.post(
          "/UF/ifo",
            uf_ifoBody,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          )
          
          if(uf_ifo?.data?.error == true){
            toast(uf_ifo?.data?.errorDetails?.message, 'danger');
            return
          }
            formData={...uf_ifo?.data};
            reworkedObject=formData;
        }
      }
        //saveHandler
        if(Array.isArray(reworkedObject))
        {
          te_saveBody.data = reworkedObject.map((item: any) => {
            return { ...nullFilter(item), ...eventData }
          })
        }
        else
        {
          te_saveBody.data = {...nullFilter(reworkedObject),...eventData};
        }
        te_saveBody.event = uf_initiatePf?.data?.eventProperty?.source?.status;
        te_saveBody.sourceId = uf_initiatePf?.data?.eventProperty?.sourceId;
        if(mainData?.upId)
        {
          te_saveBody['upId']= mainData.upId;
        }
        if(mainData?.upid)
        {
          te_saveBody['upId']= mainData.upid;
        }
        if(new_prn_main_group21910?.upId){
          te_saveBody['upId']= new_prn_main_group21910?.upId;
        }
        if(new_prn_main_group21910?.upid){
          te_saveBody['upId']= new_prn_main_group21910?.upid;
        }
        te_saveBody.key= te_saveBody?.key?.slice(0, te_saveBody?.key?.lastIndexOf(':')) + ':';

        if (new_prn_main_group21910Props.ssKey !== '' && new_prn_main_group21910Props.ssKey !== undefined) {
          te_saveBody["ssKey"] = new_prn_main_group21910Props.ssKey;
          
        }
      
        if (encryptionFlagCont) {
            te_saveBody["dpdKey"] = encryptionDpd;
            te_saveBody["method"] = encryptionMethod;
          } 
          te_save = await AxiosService.post("/te/save",te_saveBody,{
             headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
             },
           }
         )
    ///////////////////////

    //infoMsg
    toast('Credit Application Initiated Successfully', 'success');
    // refreshElement
    //riseListen
    // for group
    setitax_source_table1afd6Props((pre:any)=>({...pre,refresh:!pre?.refresh}));
    setLockedData({}) //Clears lockedData and resets it in subsequent screens.
    lockedData={} //Clears lockedData; clicking the button again without a selection returns no value.
    setValidate({}); 
    setValidateRefetch({
      value:false,
      init:0
    });
    }
    catch(err:any)
    {
      savedData.current = {};
      if( typeof err =='string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.message, 'danger');


      return
    }
  }
  const handleClick=async()=>{
    try{  
      setIsProcessing(true);
        //onClick

    // getFormData
    //riseListen
    // for group
    setnew_prn_main_group21910((pre:any)=>({...pre,...prn_details_group00560}));
    //saveHandler
    await handleSave9c_1_1_1_2();
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

 if (submitc9c9c?.isHidden) {
    return <></>
  }
 
  return (
    <div
      style={{gridColumn: `22 / 25`,gridRow: `147 / 157`, gap:``, height: `100%`, overflow: 'auto'}} 
      >
        {showFlag && <Button 
          ref={buttonRef}
          className="   "
          onClick={handleClick}
          view='action'
          disabled= {submitc9c9c?.isDisabled ? true : false}
          pin='brick-brick'
          contentAlign={"center"}
        >
          {keyset("Submit")}
        </Button>}
      </div>
    
  )
}

export default Buttonsubmit

