'use client'
import React, { useState,useEffect,useContext, useRef } from 'react'
import axios from 'axios';
import {Button,Container,Text } from '@gravity-ui/uikit';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import TorusButton from '@/app/TorusComponents/Button';
import TorusIcon from '@/app/TorusComponents/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';
import ConfirmModal from '@/app/components/confirmModal';



    

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
 

const Buttonsave =  ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keyset:any=i18n.keyset("language")
  const token:string = getCookie('token');
  const confirmMsgFlag: boolean = true
 
  const toast:any=useInfoMsg()

  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("")
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  let dfKey: string | any
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const lockMode:any = lockedData.lockMode;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [loading, setLoading] = useState(false)
  const sessionInfo:any = {
    accessToken: token,
    authToken: ''
  }
  const routes = useRouter()
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
  const [confirmMsg, setConfirmMsg] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({confirmMsgTitle:"",confirmMsgContent:"",confirmFun:()=>{}});    
  let code:any = "";
    
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps  
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps  
  const {clientnamed83af, setclientnamed83af}= useContext(TotalContext) as TotalContextProps  
  const {check1238c5, setcheck1238c5}= useContext(TotalContext) as TotalContextProps  
  const {radio12a158, setradio12a158}= useContext(TotalContext) as TotalContextProps  
  const {group1a5574, setgroup1a5574}= useContext(TotalContext) as TotalContextProps  
  const {card90449, setcard90449}= useContext(TotalContext) as TotalContextProps  
  const {areatext565ce, setareatext565ce}= useContext(TotalContext) as TotalContextProps  
  const {mobile5fccb, setmobile5fccb}= useContext(TotalContext) as TotalContextProps  
  const {check2f409e, setcheck2f409e}= useContext(TotalContext) as TotalContextProps  
  const {radio28c1aa, setradio28c1aa}= useContext(TotalContext) as TotalContextProps  
  const {group254618, setgroup254618}= useContext(TotalContext) as TotalContextProps  
  const {card2f1076, setcard2f1076}= useContext(TotalContext) as TotalContextProps  
  const {areatext22664f, setareatext22664f}= useContext(TotalContext) as TotalContextProps  
  const {datepicker947d2, setdatepicker947d2}= useContext(TotalContext) as TotalContextProps  
  const {datepicker24ce5c, setdatepicker24ce5c}= useContext(TotalContext) as TotalContextProps  
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps  
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps  
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any
  const handleCustomCode=async () => {
    if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
        customCode = codeExecution(code,codeStates)
        return customCode
    }
  }
  const handleMapper=async () => {
    try{
     
    }catch(err)
    {
        console.log(err)
    }
  }

  useEffect(()=>{
    handleMapper()
    eventBus.on("triggerButton", (id:any) => {
      if (id === "save4565e") {
        buttonRef.current?.click();
      }
    });

  },[save4565e?.refresh])

  const handleSave = async () => {
    let mainData:any=structuredClone(formdaeb3)
      let uf_initiatePf:any
      let te_eventEmitterBody:te_eventEmitterDto
      let primaryKey:any
      let uf_getPFDetails:any={}
      let uf_ifo:any
      let lockedKeysLength:number
        let eventProperty = {
  "id": "f4a59d3b2a08406ba83b55856fc4565e",
  "type": "button",
  "key": "",
  "name": "save",
  "sequence": 1,
  "children": [
    {
      "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1",
      "type": "eventNode",
      "name": "onClick",
      "key": "",
      "sequence": "1.1",
      "children": [
        {
          "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "saveHandler",
          "key": "",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "setFormData",
              "key": "",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1.1.1.1",
                  "eventContext": "rise",
                  "value": "",
                  "type": "handlerNode",
                  "name": "infoMsg",
                  "key": "",
                  "sequence": "1.1.1.1.1",
                  "children": [],
                  "hlr": {
                    "params": [
                      {
                        "name": "message",
                        "_type": "string",
                        "selectionList": [],
                        "value": "Data saved successfully",
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
                    "name": "parentTable",
                    "_type": "string",
                    "selectionList": [],
                    "value": "seacore",
                    "enabled": true
                  },
                  {
                    "name": "primaryKey",
                    "_type": "string",
                    "selectionList": [],
                    "value": "clientid",
                    "enabled": true
                  },
                  {
                    "name": "setValue",
                    "_type": "array",
                    "items": [
                      {
                        "source": "",
                        "target": ""
                      }
                    ],
                    "value": "",
                    "enabled": true
                  }
                ]
              }
            }
          ],
          "hlr": {
            "params": [
              {
                "name": "primaryKey",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              },
              {
                "name": "relationScope",
                "_type": "select",
                "selectionList": [
                  "PARENT_ONLY",
                  "PARENT_AND_CHILDREN",
                  "PARENT_AND_ALL_DESCENDANTS"
                ],
                "value": "",
                "enabled": true
              },
              {
                "name": "needClearValue",
                "_type": "boolean",
                "selectionList": [],
                "value": "",
                "enabled": true
              }
            ]
          }
        },
        {
          "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1.2",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "confirmMsg",
          "key": "",
          "sequence": "1.1.2",
          "children": [
            {
              "id": "f4a59d3b2a08406ba83b55856fc4565e.1.1.2.1",
              "eventContext": "riseListen",
              "value": "",
              "type": "handlerNode",
              "name": "showArtifactAsModal",
              "key": "",
              "sequence": "1.1.2.1",
              "children": [
                {
                  "id": "47d1c2fd32c749c8a451b900b2fdb5ba.1.1.2.1.1",
                  "value": "",
                  "type": "screen",
                  "name": "transactionsUF.v1",
                  "label": "",
                  "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1",
                  "elementType": "",
                  "sequence": "1.1.2.1.1",
                  "children": []
                }
              ],
              "hlr": {
                "params": [
                  {
                    "name": "width",
                    "_type": "string",
                    "selectionList": [],
                    "value": "",
                    "enabled": true
                  },
                  {
                    "name": "height",
                    "_type": "string",
                    "selectionList": [],
                    "value": "",
                    "enabled": true
                  },
                  {
                    "name": "needLabel",
                    "_type": "boolean",
                    "selectionList": [],
                    "value": false,
                    "enabled": true
                  },
                  {
                    "name": "Filter Conditions",
                    "_type": "array",
                    "items": [
                      {
                        "name": "DFD Key",
                        "_type": "asyncSelection",
                        "selectionList": [
                          "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1",
                          "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"
                        ],
                        "value": "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1",
                        "enabled": true,
                        "_payload": {
                          "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:",
                          "nodeType": "dfd-node-list"
                        },
                        "subSelection": {
                          "name": "Node Name",
                          "_type": "select",
                          "selectionList": [
                            {
                              "key": "127a09c41a0348fc8e93c137b4a4becf",
                              "label": "apinode"
                            },
                            {
                              "key": "23d20ae929914fd896ef4ef6f33de29a",
                              "label": "datasetnode"
                            }
                          ],
                          "value": "23d20ae929914fd896ef4ef6f33de29a",
                          "enabled": true
                        },
                        "filterKey": {
                          "name": "filterKey",
                          "_type": "string",
                          "selectionList": [],
                          "value": "transcation_id",
                          "enabled": true
                        }
                      }
                    ],
                    "selectionList": [],
                    "value": ""
                  }
                ]
              }
            }
          ],
          "hlr": {
            "params": [
              {
                "name": "title",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              },
              {
                "name": "content",
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
        let eventDetails: any = await eventFunction(eventProperty);
        let eventDetailsArray = eventDetails[0];
        let sourceId:string = "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1";
        sourceId+= "|"+"e5f95e127d7e42c8a14f50eca18daeb3"
        for (let k = 0; k < eventDetailsArray.length; k++) {
          sourceId+= "|"+eventDetailsArray[k].id
          if (
            eventDetailsArray[k].type === 'handlerNode' &&
            eventDetailsArray[k].name === 'saveHandler'
          ) {
            if (
              eventDetailsArray[k].targetKey &&
              eventDetailsArray[k].targetKey.length > 0
            ) {
              uf_getPFDetails= {
                key: eventDetailsArray[k].targetKey[0],
                primaryKey: eventDetailsArray[k].primaryKey,
                sourceId:sourceId
              };
            } else if (!eventDetailsArray[k].targetKey) {
              uf_getPFDetails= {
                primaryKey: eventDetailsArray[k].primaryKey,
                sourceId:sourceId
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
                key: eventDetailsArray[k].targetKey[0],
                primaryKey: eventDetailsArray[k].primaryKey,
                tableName: eventDetailsArray[k]?.tableName,
                status: eventDetailsArray[k]?.status,
                updateColumns: eventDetailsArray[k]?.updateColumns,
                sourceId:sourceId
              };
            } else if (!eventDetailsArray[k].targetKey) {
              uf_getPFDetails= {
                primaryKey: eventDetailsArray[k].primaryKey,
                tableName: eventDetailsArray[k]?.tableName,
                status: eventDetailsArray[k]?.status,
                updateColumns: eventDetailsArray[k]?.updateColumns,
                sourceId:sourceId
              };
            }
          }
          else if (
            eventDetailsArray[k].type === 'handlerNode' && eventDetailsArray[k].name === 'pushToRedisHandler'
          ) {
            if (
              eventDetailsArray[k].targetKey &&
              eventDetailsArray[k].targetKey.length > 0 
            ) {
              uf_getPFDetails= {
                key: eventDetailsArray[k].targetKey[0],
                sourceId:sourceId
              };
            } else if (!eventDetailsArray[k].targetKey) {
              uf_getPFDetails= {
                primaryKey: eventDetailsArray[k].primaryKey,
              };
            }
          }
        }
     
      if (uf_getPFDetails.key != undefined) {
           const uf_initiatePfBody:uf_initiatePfDto={
            key:uf_getPFDetails.key,
            sourceId:uf_getPFDetails.sourceId
          }
          if (encryptionFlagCont) {
            uf_initiatePfBody["dpdKey"] = encryptionDpd
            uf_initiatePfBody["method"] = encryptionMethod
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
        uf_initiatePf= {
          data:{
            nodeProperty:'',
            eventProperty:''
          }
        }
      }
    // saveHandler

    let te_save:any;
    let te_saveBody:te_eventEmitterDto ={
      ...uf_initiatePf?.data?.nodeProperty
    }
    let eventData:any = {status:uf_initiatePf?.data?.eventProperty?.source?.status,
      created_by:createdBy,
      modified_by:createdBy
    }
    let reworkedObject:any=nullFilter(formdaeb3)
      let reworkKeys:any=[]
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof formdaeb3[item]=='object' && Array.isArray( formdaeb3[item]) &&  formdaeb3[item].length && typeof formdaeb3[item][0] !="string" ){
          if( formdaeb3[item].length>0 && !Object.keys(formdaeb3[item][0]).includes('_isSelected_'))
            reworkKeys.push(item)
        }
      })

      if(reworkKeys.length)
      {
        for(let i=0;i<reworkKeys.length;i++){
          let fileBody:any = formdaeb3[reworkKeys[i]].map((item:any) => item?.file)
          const formData = new FormData()
          fileBody.forEach((file:File) => {
            formData.append("file", file);
          });
          formData.append('context', reworkKeys[i])
          if (encryptionFlagCont) {
            formData.append("dpdKey" ,encryptionDpd)
            formData.append("method" ,encryptionMethod)
          } 
          const res=await AxiosService.post( "/UF/upload",formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
                filename: reworkedObject[reworkKeys[i]]?.name
                  ? reworkedObject[reworkKeys[i]]?.name.replace(
                      /\.[^/.]+$/,
                      ''
                    )
                  : ''
              }
            }
          )
          reworkedObject[reworkKeys[i]] = res.data.file.fileId
        }
      }
      ///////  for pivottable data preparation
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof formdaeb3[item]=='object')
        {
          if( formdaeb3[item].length>0 &&Object.keys(formdaeb3[item][0]).includes('_isSelected_'))
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

      if (uf_getPFDetails.key != undefined) {
        let formData:any={}
        let ifoResponse:any=[]
        if(Array.isArray(formdaeb3))
        {
          formData=lockedData?.data || {}
          for( const dataList of formData )
          {
            
            const uf_ifoBody:uf_ifoDto={
              formData:dataList,
              key:uf_getPFDetails.key,
              groupId:"e5f95e127d7e42c8a14f50eca18daeb3",
              controlId:"f4a59d3b2a08406ba83b55856fc4565e"
            }
            if (encryptionFlagCont) {
            uf_ifoBody["dpdKey"] = encryptionDpd
            uf_ifoBody["method"] = encryptionMethod
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
              toast(uf_ifo?.data?.errorDetails?.message, 'danger')
              return
            }
          }
        } 
        else{
          formData=reworkedObject
          const uf_ifoBody:uf_ifoDto={
            formData:formData,
            key:uf_getPFDetails.key,
            groupId:"e5f95e127d7e42c8a14f50eca18daeb3",
            controlId:"f4a59d3b2a08406ba83b55856fc4565e"
          }
          if (encryptionFlagCont) {
            uf_ifoBody["dpdKey"] = encryptionDpd
            uf_ifoBody["method"] = encryptionMethod
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
            toast(uf_ifo?.data?.errorDetails?.message, 'danger')
            return
          }
            formData={...uf_ifo?.data}
        }
        const uf_ifoBody:uf_ifoDto={
          formData:formData,
          key:uf_getPFDetails.key,
          groupId:"e5f95e127d7e42c8a14f50eca18daeb3",
          controlId:"f4a59d3b2a08406ba83b55856fc4565e"
        }
        if (encryptionFlagCont) {
            uf_ifoBody["dpdKey"] = encryptionDpd
            uf_ifoBody["method"] = encryptionMethod
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
          toast(uf_ifo?.data?.errorDetails?.message, 'danger')
          return
        }
        te_saveBody.data = {...nullFilter(uf_ifo?.data),...eventData}
        te_saveBody.event = uf_initiatePf?.data?.eventProperty?.source?.status
        te_saveBody.sourceId = uf_initiatePf?.data?.eventProperty?.sourceId
        te_saveBody.key= te_saveBody?.key?.slice(0, te_saveBody?.key?.lastIndexOf(':')) + ':';
      }else{
        
       // te_saveBody.data = formdaeb3
        te_saveBody.data = {...reworkedObject,... (await handleCustomCode())}

      }
      
      //te_saveBody.data=nullFilter(te_saveBody.data)
     // te_saveBody.url = uf_getPFDetails.url;
      primaryKey = uf_getPFDetails.primaryKey;
      //if(formdaeb3?.){
       // let te_updateBody:te_updateDto ={};
       /// te_updateBody.data = [{...nullFilter(formdaeb3),'modified_by':createdBy}]
       // te_updateBody.key = dfKey
       // te_updateBody.primaryKey=[formdaeb3?.]
       // delete te_updateBody.data[0].
       // te_updateBody.tableName = uf_getPFDetails.url.split('/').at(-1)
        // te_updateBody.url = process.env.NEXT_PUBLIC_API_BASE_URL+'/'
        // const te_update:any=await AxiosService.post("/te/update",te_updateBody,{
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${token}`
          //   }
          // })
      
          // if (te_update && te_update?.status) {
          //   toast('data updated successfully', 'success')
          // }
      
          // if(te_update?.data?.error == true){
          //   toast(te_update?.data?.errorDetails?.message, 'danger')
          //   return
          // }
      //}else{
        if (encryptionFlagCont) {
            te_saveBody["dpdKey"] = encryptionDpd
            te_saveBody["method"] = encryptionMethod
          } 
          te_save = await AxiosService.post("/te/save",te_saveBody,{
             headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
             },
           }
         )
        
    if(te_save?.data?.error == true){
      toast(te_save?.data?.errorDetails?.message, 'danger')
      return
    }

    if (uf_getPFDetails.key != undefined) {
   ///   let te_updateBody:te_updateDto ={};
    //  te_updateBody.data = [{status:te_save.data.event,'modified_by':createdBy,process_id:te_save.data.upId}]
    //  te_updateBody.key = dfKey
    //  te_updateBody.upId = te_save.data.upId
     // te_updateBody.tableName = uf_getPFDetails.url.split('/').at(-1)

     // if (Array.isArray(te_save.data.insertedData)) {
     //   let primaryKeys:any[]=[];
    //    for (let i = 0; i < te_save.data.insertedData; i++) {
    //      primaryKeys.push(te_save.data.insertedData[i].primaryKey)
    //    }
    //    te_updateBody.primaryKey = primaryKeys
    //  }
    //  if (typeof te_save.data.insertedData === 'object') {
     //   te_updateBody.primaryKey = [te_save.data.insertedData[primaryKey]]
//}

    //  te_updateBody.url = process.env.NEXT_PUBLIC_API_BASE_URL+'/'

    // const te_update:any=await AxiosService.post("/te/update",te_updateBody,{
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   }
      // })

      // if (te_update && te_update?.status) {
        //   toast('data updated successfully', 'success')
        // }
  
        // if(te_update?.data?.error == true){
        //   toast(te_update?.data?.errorDetails?.message, 'danger')
        //   return
        // }
    }
  
 //   let keys: any = {}
  //  Object.keys(formdaeb3).map((item: any) => {
  //    keys[item] = ''
 //   })

    
 //   setformdaeb3(keys)
  //    }
    await delay(1000);
        // setFormData
        if(te_save?.data?.insertedData){
          let temp:any={}
          Object.keys(te_save?.data?.insertedData)?.map((obj:any)=>{
            if(te_save?.data?.insertedData[obj][""])
              temp[""]=te_save?.data?.insertedData[obj][""]
          })
          temp['upId']=te_save?.data?.upId||""
          setformdaeb3({...formdaeb3,...temp})
        }
        if(te_save?.data?.result){
          let temp:any={}
          Object.keys(mainData).map((changedCols:any)=>{
            temp[changedCols]=te_save?.data?.result[changedCols]
          })
          temp[""]=te_save?.data?.result[""]
          setformdaeb3(temp)
        }
        toast('Data saved successfully', 'success')

  }
  const handleClick=async()=>{
    if(formdaeb3Props?.validation==true && formdaeb3Props?.required==true || formdaeb3Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}))
    } 
    await handleCustomCode()
    let saveCheck=false
    Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger')
      return
    }
    try{  
      await handleSave()
    setConfirmMsg(true)
    setConfirmModal((pre:any)=>({...pre,
      confirmMsgTitle:"",
      confirmMsgContent:"",
      confirmFun: handleConfirmOnClick
          }))
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger')
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger')
      setLoading(false)
    }
  }
  const handleBlur=(e:any)=>{
    if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
      codeStates['postgres']  = postgres7f5c4,
      codeStates['setpostgres'] = setpostgres7f5c4,
      codeStates['transactions']  = transactions10ab7,
      codeStates['settransactions'] = settransactions10ab7,
      codeExecution(code,codeStates)
    }
  }
  async function handleConfirmOnClick(){
    // showArtifactAsModal
    let filterProps =  [
  {
    "name": "DFD Key",
    "_type": "asyncSelection",
    "selectionList": [
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1",
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"
    ],
    "value": "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1",
    "enabled": true,
    "_payload": {
      "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:",
      "nodeType": "dfd-node-list"
    },
    "subSelection": {
      "name": "Node Name",
      "_type": "select",
      "selectionList": [
        {
          "key": "127a09c41a0348fc8e93c137b4a4becf",
          "label": "apinode"
        },
        {
          "key": "23d20ae929914fd896ef4ef6f33de29a",
          "label": "datasetnode"
        }
      ],
      "value": "23d20ae929914fd896ef4ef6f33de29a",
      "enabled": true
    },
    "filterKey": {
      "name": "filterKey",
      "_type": "string",
      "selectionList": [],
      "value": "transcation_id",
      "enabled": true
    }
  }
];
    let filterData = await getFilterProps(filterProps,formdaeb3);
    settransactionsuf_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true)
  } 


 if (save4565e?.isHidden) {
    return <></>
  }

  return (
    <div 
      style={{gridColumn: `10 / 12`,gridRow: `5 / 6`,marginTop: `auto`, gap:`10px`}} >
        <ConfirmModal confirmMsg={confirmMsg} setConfirmMsg={setConfirmMsg} confirmMsgTitle={confirmModal.confirmMsgTitle} confirmMsgContent={confirmModal.confirmMsgContent} handleConfirm={confirmModal.confirmFun} />
      <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
        <div className='flex h-[30px] w-full justify-end'>
          <button
            className='flex w-[30px] justify-end'
            onClick={() => setShowProfileAsModalOpen(false)}
          >
            X
          </button>
        </div>
        <PageTransactionsufpage/>
      </Modal>
        <TorusButton 
          ref={buttonRef}
          className="w-full "
          onClick={handleClick}
          onBlur={handleBlur}
          disabled= {save4565e?.isDisabled ? true : false}
        >
              {keyset("save")}
        </TorusButton>
    </div>
  )
}
export default Buttonsave