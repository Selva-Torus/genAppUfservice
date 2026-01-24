'use client'

import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable  from '@/app/utils/evaluateDecisionTable';
import { getGridPositionFromOrder } from '@/app/utils/getGridPositionFromOrder';
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
 

const Buttoncopy = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const token:string = getCookie('token');
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = "";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const savedData=useRef({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast:any=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState(true);
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<any>("");
  const [gridPosition, setGridPosition] = useState<any>({ gridColumn: '1 / 3', gridRow: '1 / 12' });
    
 /////////////
   //another screen
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps;
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps;
  const {idfc377, setidfc377}= useContext(TotalContext) as TotalContextProps;
  const {name28713, setname28713}= useContext(TotalContext) as TotalContextProps;
  const {copyffc78, setcopyffc78}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: any = {};
      codeStates['maingroup']  = maingroup7f4e1,
      codeStates['setmaingroup'] = setmaingroup7f4e1,
      codeStates['userable']  = userable8d616,
      codeStates['setuserable'] = setuserable8d616,
      codeStates['response']  = savedData.current,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",
          componentId: "756be105166e442fb083156eebe8d616",
          controlId: "fdd291f18a58470c9592c686698ffc78",
          isTable: false,
          from:"Buttoncopy",
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
      if(orchestrationData?.data?.rule.nodes.length > 0){
        let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},decodedTokenObj);
        // schemaFlag =schemaFlag.output;
        let order:any = Number(schemaFlag.order);

        // Update grid position based on order number
        if (order && typeof order === 'number') {
          const position = getGridPositionFromOrder(order);
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
      if (id === "copyffc78") {
        handleClick();
      }
    });
  },[copyffc78?.refresh,currentToken])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans=[]
    let id=""
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

  async function handleSavefc78_1_1_1(){
    try{
      let mainData:any=structuredClone(userable8d616);
      let uf_initiatePf:any;
      let te_eventEmitterBody:te_eventEmitterDto={
        dpdKey: '',
        method: '',
        event: '',
        sourceId: '',
        key: '',
        data: {},
        lock: {}
      }
      let primaryKey:any;
      let tagetKey:any="CK:CT309:FNGK:AF:FNK:PF-PFD:CATK:AG001:AFGK:A001:AFK:pfsave:AFVK:v1|a6a598866e644f57989544f4561e4073"
      let uf_getPFDetails:any={
        key: "CK:CT309:FNGK:AF:FNK:PF-PFD:CATK:AG001:AFGK:A001:AFK:pfsave:AFVK:v1|a6a598866e644f57989544f4561e4073"
      };
      let uf_ifo:any;
      let lockedKeysLength:number;
      let eventProperty = {
  "id": "fdd291f18a58470c9592c686698ffc78",
  "type": "button",
  "name": "copy",
  "sequence": 1,
  "children": [
    {
      "id": "fdd291f18a58470c9592c686698ffc78.1.1",
      "type": "eventNode",
      "name": "onClick",
      "sequence": "1.1",
      "children": [
        {
          "id": "fdd291f18a58470c9592c686698ffc78.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "saveHandler",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "fdd291f18a58470c9592c686698ffc78.1.1.1.1",
              "type": "responseNode",
              "name": "success",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "fdd291f18a58470c9592c686698ffc78.1.1.1.1.1",
                  "eventContext": "rise",
                  "value": "",
                  "type": "handlerNode",
                  "name": "infoMsg",
                  "sequence": "1.1.1.1.1",
                  "children": [
                    {
                      "id": "fdd291f18a58470c9592c686698ffc78.1.1.1.1.1.1",
                      "eventContext": "riseListen",
                      "value": "",
                      "type": "handlerNode",
                      "name": "refreshElement",
                      "sequence": "1.1.1.1.1.1",
                      "children": [
                        {
                          "id": "756be105166e442fb083156eebe8d616.1.1.1.1.1.1.1",
                          "value": "",
                          "type": "screen",
                          "name": "savescreen.v1|userable",
                          "label": "userable",
                          "key": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1|userable",
                          "elementType": "group",
                          "sequence": "1.1.1.1.1.1.1",
                          "children": []
                        }
                      ]
                    }
                  ],
                  "hlr": {
                    "params": [
                      {
                        "name": "message",
                        "_type": "string",
                        "selectionList": [],
                        "value": "Data copied successfully",
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
              ]
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
          },
          "targetKey": [
            "CK:CT309:FNGK:AF:FNK:PF-PFD:CATK:AG001:AFGK:A001:AFK:pfsave:AFVK:v1|a6a598866e644f57989544f4561e4073"
          ]
        }
      ]
    }
  ]
};
      let eventDetails: any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId:string = "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1";
      sourceId+= "|"+"756be105166e442fb083156eebe8d616";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1");
      let sourceIdNewPath="CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1"+"|"+"756be105166e442fb083156eebe8d616"+"|"+eventProperty.id
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
              primaryKey: eventDetailsArray[k].primaryKey,
              sourceId:sourceIdNewPath
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              primaryKey: eventDetailsArray[k].primaryKey,
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
              primaryKey: eventDetailsArray[k].primaryKey,
              tableName: eventDetailsArray[k]?.tableName,
              status: eventDetailsArray[k]?.status,
              updateColumns: eventDetailsArray[k]?.updateColumns,
              sourceId:sourceIdNewPath
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              primaryKey: eventDetailsArray[k].primaryKey,
              tableName: eventDetailsArray[k]?.tableName,
              status: eventDetailsArray[k]?.status,
              updateColumns: eventDetailsArray[k]?.updateColumns,
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
    let eventData:any = {trs_status:uf_initiatePf?.data?.eventProperty?.source?.status,
      created_by:createdBy,
      modified_by:createdBy
    }
    let reworkedObject:any=nullFilter(userable8d616);
    let reworkKeys:any=[];
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof userable8d616[item]=='object' && Array.isArray( userable8d616[item]) &&  userable8d616[item].length && typeof userable8d616[item][0] !="string" ){
          if( userable8d616[item].length>0 && !Object.keys(userable8d616[item][0]).includes('_isSelected_'))
              reworkKeys.push(item);
        }
      })

      if(reworkKeys.length)
      {
        for(let i=0;i<reworkKeys.length;i++){
          let fileBody:any = userable8d616[reworkKeys[i]].map((item:any) => item?.file)
          const formData = new FormData();
          fileBody.forEach((file:File) => {
            formData.append("file", file);
          });
          formData.append('context', reworkKeys[i]);
          formData.append("enableEncryption", fileBody[0]?.enableEncryption);
          if (encryptionFlagCont) {
            formData.append("dpdKey" ,encryptionDpd);
            formData.append("method" ,encryptionMethod);
          } 
          if (fileBody[0]?.DbType == 'mongodb') {
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
        } else if (fileBody[0]?.DbType == 'dfs') {

            const basePath = process.env.NEXT_PUBLIC_DFS_PATH || "dfs-uploads";
            const bucketFolderame = process.env.NEXT_PUBLIC_DFS_BUCKETNAME || 'uploadfile';
            const data = new FormData();
            data.append('file', fileBody[0]);
            data.append('bucketFolderame', bucketFolderame.toLowerCase());
            data.append('folderPath', basePath);
            data.append('enableEncryption', fileBody[0]?.enableEncryption);

            const res = await AxiosService.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/uploadimg`,
              data,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  filename: fileBody[0]?.name
                    ? fileBody[0].name.replace(/\.[^/.]+$/, '')
                    : ''
                }
              }
            )
            reworkedObject[reworkKeys[i]] = res.data.imageUrl
          }
        }
      }
      ///////  for pivottable data preparation
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof userable8d616[item]=='object')
        {
          if( userable8d616[item].length>0 &&Object.keys(userable8d616[item][0]).includes('_isSelected_'))
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

      if ("childTables" in userable8d616) {
        te_saveBody.childTables = userable8d616.childTables
      }  

      if (uf_getPFDetails.key != undefined) {
        let formData:any={};
        let ifoResponse:any=[];
        if(Array.isArray(userable8d616))
        {
          formData=lockedData?.data || {};
          for( const dataList of formData )
          {
            
            const uf_ifoBody:uf_ifoDto={
              formData:dataList,
              key:uf_getPFDetails.key,
              groupId:"756be105166e442fb083156eebe8d616",
              controlId:"fdd291f18a58470c9592c686698ffc78"
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
            groupId:"756be105166e442fb083156eebe8d616",
            controlId:"fdd291f18a58470c9592c686698ffc78"
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
        te_saveBody.data = {...nullFilter(reworkedObject),...eventData};
        te_saveBody.event = uf_initiatePf?.data?.eventProperty?.source?.status;
        te_saveBody.sourceId = uf_initiatePf?.data?.eventProperty?.sourceId;
        if(mainData?.upId)
        {
          te_saveBody['upId']= mainData.upId
        }
        te_saveBody.key= te_saveBody?.key?.slice(0, te_saveBody?.key?.lastIndexOf(':')) + ':';
      
      
      primaryKey = uf_getPFDetails.primaryKey;
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
    toast('Data copied successfully', 'success');
    // refreshElement
    // for group
    setuserable8d616Props((pre:any)=>({...pre,refresh:!pre?.refresh}));
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
    if(userable8d616Props?.validation==true && userable8d616Props?.required==true || userable8d616Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
    } 
    let saveCheck=false;
        Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true;
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger');
      return
    }
    try{  
      await handleSavefc78_1_1_1();
      await delay(1000);
      await handleCustomCode();
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }
  async function handleConfirmOnClick(){
    try{
    }catch(err){
      toast(err, 'danger');
    }
  } 


  async function handleConfirmOnCancel(){
     try{
    }catch(err){
      toast(err, 'danger');
    }
  }


 if (copyffc78?.isHidden) {
    return <></>
  }
 
  return (
    <div
      style={{gridColumn: ` / `,gridRow: ` / `, gap:``, height: `100%`, overflow: 'auto'}} 
      >
        {showFlag && <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='action'
          disabled= {copyffc78?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
        >
          {keyset("copy")}
        </Button>}
      </div>
    
  )
}

export default Buttoncopy

