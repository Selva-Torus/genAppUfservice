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
 

const Buttontablebutton = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
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
  const {groupeca86, setgroupeca86}= useContext(TotalContext) as TotalContextProps;
  const {groupeca86Props, setgroupeca86Props}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646, settabgroupe7646}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646Props, settabgroupe7646Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3, settab_header_12cce3}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3Props, settab_header_12cce3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783, settab_header_214783}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783Props, settab_header_214783Props}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527ef, setoldtabgroup527ef}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527efProps, setoldtabgroup527efProps}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914Props, settab29f914Props}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  const {ids24da4, setids24da4}= useContext(TotalContext) as TotalContextProps;
  const {name5545c, setname5545c}= useContext(TotalContext) as TotalContextProps;
  const {tableswitch7580d, settableswitch7580d}= useContext(TotalContext) as TotalContextProps;
  const {tablebutton03e79, settablebutton03e79}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupeca86,
      codeStates['setgroup'] = setgroupeca86,
      codeStates['oldtabgroup']  = oldtabgroup527ef,
      codeStates['setoldtabgroup'] = setoldtabgroup527ef,
      codeStates['table2']  = table2c0657,
      codeStates['settable2'] = settable2c0657,
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
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",
          componentId: "b901da00e7f54fc5b5c8181aee8c0657",
          controlId: "29d2ffc89ed34d47a060e953ff203e79",
          isTable: false,
          from:"Buttontablebutton",
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
      if (id === "tablebutton03e79") {
        handleClick();
      }
    });
  },[tablebutton03e79?.refresh,currentToken])

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

  const handleClick=async()=>{
    if(table2c0657Props?.validation==true && table2c0657Props?.required==true || table2c0657Props?.required==true)
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


 if (tablebutton03e79?.isHidden) {
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
          disabled= {tablebutton03e79?.isDisabled ? true : false}
          pin='circle-circle'
          contentAlign={"center"}
        >
          {keyset("tablebutton")}
        </Button>}
      </div>
    
  )
}

export default Buttontablebutton

