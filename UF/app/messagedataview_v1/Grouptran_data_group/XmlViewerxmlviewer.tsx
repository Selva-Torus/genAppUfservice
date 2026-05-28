'use client'
import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
//////////
import XMLViewer from '@/components/XMLViewer';
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';


const XmlViewerxmlviewer = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const decodedTokenObj:any = decodeToken(token);
  const actionDetails :any = {
  "action": {
    "lock": {
      "lockMode": "",
      "name": "",
      "ttl": ""
    },
    "stateTransition": {
      "sourceQueue": "",
      "sourceStatus": "",
      "targetQueue": "",
      "targetStatus": ""
    },
    "pagination": {
      "page": "1",
      "count": "10"
    },
    "encryption": {
      "isEnabled": false,
      "selectedDpd": "",
      "encryptionMethod": ""
    },
    "events": {}
  },
  "code": "",
  "rule": {},
  "events": {},
  "mapper": [
    {
      "sourceKey": [
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1|0f0ab463021546318f4ee4408eea68c4|properties.message_data"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:messageDataView:AFVK:v1|548f837ab1014476af45ffa25dd84f25|d27f594596224ec8be2654b5ae29fe8d"
    }
  ],
  "dfdKey": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:journey:AFVK:v1:",
  "schemaData": {
    "type": "string",
    "nullable": true,
    "x-pg-type": "text",
    "x-expression": "message_data"
  },
  "dataType": "string"
}
  const toast:any=useInfoMsg();
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>(""); 
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'message_data',type:"text"});
  const routes = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  /////////////
   //another screen
  const {tran_data_group84f25, settran_data_group84f25}= useContext(TotalContext) as TotalContextProps;
  const {tran_data_group84f25Props, settran_data_group84f25Props}= useContext(TotalContext) as TotalContextProps;
  const {msg_data_label7b760, setmsg_data_label7b760}= useContext(TotalContext) as TotalContextProps;
  const {divider_topf46a0, setdivider_topf46a0}= useContext(TotalContext) as TotalContextProps;
  const {xmlviewer9fe8d, setxmlviewer9fe8d}= useContext(TotalContext) as TotalContextProps;
  const {divider_bottom6920d, setdivider_bottom6920d}= useContext(TotalContext) as TotalContextProps;
  const {cancel_btn5e840, setcancel_btn5e840}= useContext(TotalContext) as TotalContextProps;

  if (xmlviewer9fe8d?.isHidden) {
    return <></>
  }
  
  return (   
    <div 
      style={{
        gridColumn: `1 / 25`,
        gridRow: `14 / 97`, 
        gap:``, 
        height: `100%`, 
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <XMLViewer
        className=""
        // label={keyset("")}
        data={tran_data_group84f25?.message_data||""}
        
      />
    </div>
        
  )
}

export default XmlViewerxmlviewer
