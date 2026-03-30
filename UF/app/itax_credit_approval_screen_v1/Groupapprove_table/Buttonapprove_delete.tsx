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
 

const Buttonapprove_delete = ({ mainData,lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}: { mainData:any,lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any}) => {
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
  const lockMode:any = lockedData?.lockMode;
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

  const {authorization_memo_file_group17228, setauthorization_memo_file_group17228}= useContext(TotalContext) as TotalContextProps;
  const {authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fb, setdocumentviewer_group0a3fb}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335, setapplication_group16335}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335Props, setapplication_group16335Props}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4, setapplication_tab_groupf82f4}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3, setapprove1c1d3}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3Props, setapprove1c1d3Props}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9, setapprove_tableafbb9}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9Props, setapprove_tableafbb9Props}= useContext(TotalContext) as TotalContextProps;
  const {approve_doc1f48f, setapprove_doc1f48f}= useContext(TotalContext) as TotalContextProps;
  const {approve_delete12828, setapprove_delete12828}= useContext(TotalContext) as TotalContextProps;
  const {itaxstd_iddb195, setitaxstd_iddb195}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480, setreason_group39480}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480Props, setreason_group39480Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['authorization_memo_file_group']  = authorization_memo_file_group17228,
      codeStates['setauthorization_memo_file_group'] = setauthorization_memo_file_group17228,
      codeStates['documentviewer_group']  = documentviewer_group0a3fb,
      codeStates['setdocumentviewer_group'] = setdocumentviewer_group0a3fb,
      codeStates['overall_group']  = overall_group1e6a4,
      codeStates['setoverall_group'] = setoverall_group1e6a4,
      codeStates['prndetails_group']  = prndetails_group881d8,
      codeStates['setprndetails_group'] = setprndetails_group881d8,
      codeStates['application_group']  = application_group16335,
      codeStates['setapplication_group'] = setapplication_group16335,
      codeStates['approve_table']  = approve_tableafbb9,
      codeStates['setapprove_table'] = setapprove_tableafbb9,
      codeStates['reason_group']  = reason_group39480,
      codeStates['setreason_group'] = setreason_group39480,
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
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1",
          componentId: "15b5384d5b5641709b3c6558e61afbb9",
          controlId: "489b0ce2137e4b09b4fc1407a4e12828",
          isTable: false,
          from:"ButtonAction",
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
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "approve_delete12828") {
        handleClick();
      }
    });
  },[approve_delete12828?.refresh,currentToken])

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

  async function handleSave2828_1_1_1(){

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
    const hasInvalidField = Object.values(currentValidate?.ITAX_Credit_Approval_Screen_v1 || {}).some(
      (value) => value === 'invalid'
    );

    if (hasInvalidField) {
      toast('Please verify the data', 'danger');
      return;
    }
    try{
      //let mainData:any=structuredClone(approve_tableafbb9);
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
      let tagetKey:string="CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Delete_PF:AFVK:v1|1b776e01baff4a5fa832055ec9ae4811"
      let uf_getPFDetails:any={
        key: "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Delete_PF:AFVK:v1|1b776e01baff4a5fa832055ec9ae4811"
      };
      let uf_ifo:any;
      let lockedKeysLength:number;
      let eventProperty :any = {
  "id": "489b0ce2137e4b09b4fc1407a4e12828",
  "type": "button",
  "name": "approve_delete",
  "label": "approve_delete",
  "sequence": 1,
  "children": [
    {
      "id": "489b0ce2137e4b09b4fc1407a4e12828.1.1",
      "type": "eventNode",
      "name": "onClick",
      "label": "onClick",
      "sequence": "1.1",
      "children": [
        {
          "id": "489b0ce2137e4b09b4fc1407a4e12828.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "saveHandler",
          "label": "saveHandler",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "489b0ce2137e4b09b4fc1407a4e12828.1.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "infoMsg",
              "label": "infoMsg",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "489b0ce2137e4b09b4fc1407a4e12828.1.1.1.1.1",
                  "eventContext": "riseListen",
                  "value": "",
                  "type": "handlerNode",
                  "name": "refreshElement",
                  "label": "refreshElement",
                  "sequence": "1.1.1.1.1",
                  "children": [
                    {
                      "id": "15b5384d5b5641709b3c6558e61afbb9.1.1.1.1.1.1",
                      "value": "",
                      "type": "screen",
                      "name": "ITAX_Credit_Approval_Screen.v1|approve_table",
                      "label": "ITAX_Credit_Approval_Screen.v1|approve_table",
                      "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1|approve_table",
                      "elementType": "group",
                      "groupType": "table",
                      "sequence": "1.1.1.1.1.1",
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
                    "value": "Data deleted successfully",
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
            "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Delete_PF:AFVK:v1|1b776e01baff4a5fa832055ec9ae4811"
          ]
        }
      ]
    }
  ]
};
      let eventDetails : any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1";
      sourceId+= "|"+"15b5384d5b5641709b3c6558e61afbb9";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1");
      let sourceIdNewPath : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1"+"|"+"15b5384d5b5641709b3c6558e61afbb9"+"|"+eventProperty.id;
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
    let reworkedObject:any=nullFilter(approve_tableafbb9);
    let reworkKeys:any[]=[];
      if(typeof reworkedObject === 'object' && reworkedObject !== null) {
      Object.keys(reworkedObject).map((item: any) => {
        if (
          typeof approve_tableafbb9[item] === 'object' && 
          Array.isArray(approve_tableafbb9[item]) && 
          approve_tableafbb9[item].length > 0 && 
          typeof approve_tableafbb9[item][0] !== "string"
        ) {
          const hasUrlProperty = approve_tableafbb9[item][0]?.url !== undefined;
          const hasFileProperty = approve_tableafbb9[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(approve_tableafbb9[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      }); 
    } else if (Array.isArray(reworkedObject)) {
      Object.keys(approve_tableafbb9).map((item: any) => {
        if (
          typeof approve_tableafbb9[item] === 'object' && 
          Array.isArray(approve_tableafbb9[item]) && 
          approve_tableafbb9[item].length > 0 && 
          typeof approve_tableafbb9[item][0] !== "string"
        ) {
          const hasUrlProperty = approve_tableafbb9[item][0]?.url !== undefined;
          const hasFileProperty = approve_tableafbb9[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(approve_tableafbb9[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      });
    }
      if(reworkKeys.length)
      {
        for(let i=0;i<reworkKeys.length;i++){
          let fileBody:any = approve_tableafbb9[reworkKeys[i]].map((item:any) => item?.file)
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
        if(typeof approve_tableafbb9[item]=='object')
        {
          if( approve_tableafbb9[item].length>0 &&Object.keys(approve_tableafbb9[item][0]).includes('_isSelected_'))
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

      if ("childTables" in approve_tableafbb9) {
        te_saveBody.childTables = approve_tableafbb9.childTables
      }  

      if (uf_getPFDetails.key != undefined) {
        let formData:any={};
        let ifoResponse:any[]=[];
        if(Array.isArray(mainData))
        {
          formData=lockedData?.data || approve_tableafbb9 || {};
          for( const dataList of formData )
          {
            
            const uf_ifoBody:uf_ifoDto={
              formData:dataList,
              key:uf_getPFDetails.key,
              groupId:"15b5384d5b5641709b3c6558e61afbb9",
              controlId:"489b0ce2137e4b09b4fc1407a4e12828"
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
          formData=mainData
          const uf_ifoBody:uf_ifoDto={
            formData:formData,
            key:uf_getPFDetails.key,
            groupId:"15b5384d5b5641709b3c6558e61afbb9",
            controlId:"489b0ce2137e4b09b4fc1407a4e12828"
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
        if(approve_tableafbb9?.upId){
          te_saveBody['upId']= approve_tableafbb9?.upId;
        }
        te_saveBody.key= te_saveBody?.key?.slice(0, te_saveBody?.key?.lastIndexOf(':')) + ':';

        if (approve_tableafbb9Props.ssKey !== '' && approve_tableafbb9Props.ssKey !== undefined) {
          te_saveBody["ssKey"] = approve_tableafbb9Props.ssKey;
          
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
    toast('Data deleted successfully', 'success');
    // refreshElement
    //riseListen
    // for group
    setapprove_tableafbb9Props((pre:any)=>({...pre,refresh:!pre?.refresh}));
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
      await delay(1000);
        //onClick

    //saveHandler
    await handleSave2828_1_1_1();
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

 if (approve_delete12828?.isHidden) {
    return <></>
  }
 
  return (
    <div>
        {showFlag && <Button 
          ref={buttonRef}
          className="!bg-transparent !text-black"
          onClick={handleClick}
          view='flat-secondary'
          disabled= {approve_delete12828?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
          icon="MdDeleteForever"
          iconDisplay='Icon only'
        >
          {keyset("Action")}
        </Button>}
      </div>
    
  )
}

export default Buttonapprove_delete

