'use client'



import React, { useState,useContext,useEffect,useRef } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import DynamicJsonForm from '@/components/DynamicJsonForm';
import { getSchemaByKeyAndCondition } from '@/app/utils/getSchemaByKeyAndCondition';
import decodeToken from '@/app/components/decodeToken';
import * as v from 'valibot';




const DynamicJsonFormtest = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const prevRefreshRef = useRef(false);
  const decodedTokenObj: any = decodeToken(token);
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
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
  "pfRuleData": {
    "nodes": [
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "42e6e796-f242-46dc-9423-7c7595f607f0",
              "name": "Input",
              "field": "$psCode"
            }
          ],
          "outputs": [
            {
              "id": "2ac63f89-22eb-44b5-af4d-94d45932e534",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "a5a56fe9-6c9f-4a9e-8d93-858746e44bea",
              "42e6e796-f242-46dc-9423-7c7595f607f0": "\"PS001\"",
              "2ac63f89-22eb-44b5-af4d-94d45932e534": "\"CK:CT309:FNGK:AF:FNK:DF-DST:CATK:AG001:AFGK:A001:AFK:inputsDst:AFVK:v1:NDP\""
            },
            {
              "_id": "3c03aa12-bc96-49b0-a89a-cb875eeeb563",
              "42e6e796-f242-46dc-9423-7c7595f607f0": "\"ps\"",
              "2ac63f89-22eb-44b5-af4d-94d45932e534": "\"CK:CT309:FNGK:AF:FNK:DF-DST:CATK:AG001:AFGK:A001:AFK:rtp:AFVK:v1:NDP\""
            }
          ]
        },
        "id": "206f127f-fa38-4b34-8de4-7526450130de",
        "name": "decisionTable1",
        "position": {
          "x": 530,
          "y": 205
        }
      },
      {
        "type": "outputNode",
        "id": "8f22e993-9d93-4e10-9ae3-88309e502b19",
        "name": "response",
        "position": {
          "x": 1070,
          "y": 105
        }
      },
      {
        "type": "inputNode",
        "id": "95bbd92c-a1eb-4278-b721-82a73c0ac80e",
        "name": "request",
        "position": {
          "x": 190,
          "y": 90
        }
      }
    ],
    "edges": [
      {
        "id": "269785f5-f6c1-4931-a10b-0d4b5baac09c",
        "sourceId": "95bbd92c-a1eb-4278-b721-82a73c0ac80e",
        "type": "edge",
        "targetId": "206f127f-fa38-4b34-8de4-7526450130de"
      },
      {
        "id": "8f768ddb-ff9e-4f6b-ad9f-e9631f426116",
        "sourceId": "206f127f-fa38-4b34-8de4-7526450130de",
        "type": "edge",
        "targetId": "8f22e993-9d93-4e10-9ae3-88309e502b19"
      }
    ]
  },
  "rule": {
    "nodes": [
      {
        "type": "inputNode",
        "id": "282bd33f-f30a-4cba-8ccf-7c196cd954db",
        "name": "request",
        "position": {
          "x": 140,
          "y": 95
        }
      },
      {
        "type": "outputNode",
        "id": "1cca869e-d8df-4716-ab5c-e60c12e4f93d",
        "name": "response",
        "position": {
          "x": 950,
          "y": 70
        }
      },
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "ac0b1d37-e243-4556-8267-3f7d4c752b2e",
              "name": "Input",
              "field": "$psName"
            }
          ],
          "outputs": [
            {
              "id": "47205255-2f97-4175-b6e2-522d4033a74d",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "6465c6d7-ab91-41c1-a0be-a0a07964bb11",
              "ac0b1d37-e243-4556-8267-3f7d4c752b2e": "\"Product/Service\"",
              "47205255-2f97-4175-b6e2-522d4033a74d": "true"
            }
          ]
        },
        "id": "5d1cd15d-87b9-4665-a289-95d56be2a840",
        "name": "decisionTable1",
        "position": {
          "x": 570,
          "y": 260
        }
      }
    ],
    "edges": [
      {
        "id": "d8aa5b06-5aa1-4a1e-b6ee-066b0f2c3146",
        "sourceId": "282bd33f-f30a-4cba-8ccf-7c196cd954db",
        "type": "edge",
        "targetId": "5d1cd15d-87b9-4665-a289-95d56be2a840"
      },
      {
        "id": "900e4850-36d2-4eaa-9227-3663d4845d5f",
        "sourceId": "5d1cd15d-87b9-4665-a289-95d56be2a840",
        "type": "edge",
        "targetId": "1cca869e-d8df-4716-ab5c-e60c12e4f93d"
      }
    ]
  },
  "events": {},
  "mapper": []
}
  const [goruleData,setGoruleData]=useState<any>({})
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'test',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
  /////////////
   //another screen
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {hheadd1, sethheadd1}= useContext(TotalContext) as TotalContextProps;
  const {selectionapproach09360, setselectionapproach09360}= useContext(TotalContext) as TotalContextProps;
  const {options850a2, setoptions850a2}= useContext(TotalContext) as TotalContextProps;
  const {test22a10, settest22a10}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  
  const allData = {
  "name": "dynamicJsonForm",
  "_label": "DynamicJsonForm",
  "_type": "array",
  "items": [
    {
      "key": {
        "name": "key",
        "_label": "Key",
        "_type": "select",
        "selectionList": [
          {
            "key": "all",
            "label": "All"
          },
          {
            "key": "loginId",
            "label": "User Name"
          },
          {
            "key": "isAppAdmin",
            "label": "Application Administrator"
          },
          {
            "key": "client",
            "label": "Tenant Code"
          },
          {
            "key": "type",
            "label": "User Type"
          },
          {
            "key": "ag",
            "label": "Application Group"
          },
          {
            "key": "app",
            "label": "Application"
          },
          {
            "key": "userCode",
            "label": "User Code"
          },
          {
            "key": "orgGrpCode",
            "label": "Organization Group Code"
          },
          {
            "key": "selectedAccessProfile",
            "label": "Selected Access Profile"
          },
          {
            "key": "dap",
            "label": "Data Access Privilege"
          },
          {
            "key": "orgGrpName",
            "label": "Organization Group Name"
          },
          {
            "key": "orgCode",
            "label": "Organization Code"
          },
          {
            "key": "orgName",
            "label": "Organization Name"
          },
          {
            "key": "subOrgGrpCode",
            "label": "Sub-Organization Group Code"
          },
          {
            "key": "subOrgGrpName",
            "label": "Sub-Organization Group Name"
          },
          {
            "key": "subOrgCode",
            "label": "Sub-Organization Code"
          },
          {
            "key": "subOrgName",
            "label": "Sub-Organization Name"
          },
          {
            "key": "psGrpCode",
            "label": "Product/Service Group Code"
          },
          {
            "key": "psGrpName",
            "label": "Product/Service Group Name"
          },
          {
            "key": "psCode",
            "label": "Product/Service Code"
          },
          {
            "key": "psName",
            "label": "Product/Service Name"
          },
          {
            "key": "roleGrpCode",
            "label": "Role Group Code"
          },
          {
            "key": "roleGrpName",
            "label": "Role Group Name"
          },
          {
            "key": "roleCode",
            "label": "Role Code"
          },
          {
            "key": "roleName",
            "label": "Role Name"
          },
          {
            "key": "sid",
            "label": "Session ID"
          },
          {
            "key": "iat",
            "label": "Login Time"
          },
          {
            "key": "exp",
            "label": "Session Expiry Time"
          }
        ],
        "value": "psCode",
        "enabled": true
      },
      "value": {
        "name": "value",
        "_label": "Value",
        "_type": "array",
        "items": [
          {
            "condition": {
              "name": "condition",
              "_label": "Condition",
              "_type": "text",
              "value": "PS001efsdfs",
              "enabled": true
            },
            "schema": {
              "name": "schema",
              "_label": "Schema",
              "value": "CK:CT309:FNGK:AF:FNK:DF-DST:CATK:AG001:AFGK:A001:AFK:inputsDst:AFVK:v1:NDP",
              "_type": "artifactSelector",
              "_payload": {
                "fabric": [
                  "DF-DST"
                ],
                "subKey": "NDP"
              },
              "enabled": true
            }
          }
        ]
      }
    }
  ],
  "value": {},
  "enabled": true
};
  const [renderData, setRenderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

    const extractDefaultValues = (metadata: MetadataConfig): FieldValues => {
    const values: FieldValues = {}

    for (const key in metadata) {
      const field = metadata[key]

      if ('type' in field && field.type === 'object' && 'fields' in field) {
        // Nested object - recursively extract values
        values[key] = extractDefaultValues(field.fields)
      } else if ('defaultValue' in field) {
        // Simple field - extract default value
        values[key] = field.defaultValue
      }
    }

    return values
  }

  const fetchSchema = async (goruleData:any={},groupData:any={}) => {
    try {
      setIsLoading(true);
      const data = await getSchemaByKeyAndCondition(decodedTokenObj, allData,goruleData,groupData);
      setRenderData(data);

      if (data) {
        // Extract default values from metadata and initialize the form
        const defaultValues = extractDefaultValues(data)
        handleChange(defaultValues)
      } else {
        // toast(i18n.t("No matching schema found for the provided condition."), 'danger');
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
      toast(i18n.t("Error loading schema data."), 'danger');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let forGetFormDataPointedData = {
      };

    if (prevRefreshRef.current) {
        fetchSchema(goruleData,forGetFormDataPointedData);
    }else 
      prevRefreshRef.current= true

  }, [currentToken]);

      type FieldValue = string | number | boolean | null;
        type FieldValues = { [key: string]: FieldValue | FieldValues };

        interface FieldMetadata {
        type: "text" | "number" | "boolean" | "date" | "dropdown" | "textarea";
        label: string;
        defaultValue: FieldValue;
        options?: string[]; // For dropdown fields
        placeholder?: string;
      }

      type MetadataConfig = {
        [key: string]: FieldMetadata | NestedMetadataConfig;
      };

      interface NestedMetadataConfig {
        type: "object";
        label: string;
        fields: MetadataConfig;
      }

      interface DynamicContentFieldsProps {
        metadata: MetadataConfig;
        onChange: (values: FieldValues) => void;
        className?: string;
      }
  // Validation  
    const [error, setError] = useState<string>('');
  schemaArray = [] ;
  const handleChange = async(values: FieldValues) => {
    setError('')
    setValidate((pre:any)=>({...pre,test:{}}))
    if(dynamicStateandType.type=="number"){
    setparent0e5b8((prev: any) => ({ ...prev, test: +values }))
    }
    else{
    setparent0e5b8((prev: any) => ({ ...prev, test: values }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['parent']  = parent0e5b8,
      codeStates['setparent'] = setparent0e5b8,
      codeStates['form']  = form775ce,
      codeStates['setform'] = setform775ce,
      codeStates['groupfordynamicbutton']  = groupfordynamicbutton143be,
      codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
      codeStates['buttons']  = buttons60ce5,
      codeStates['setbuttons'] = setbuttons60ce5,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "03e924560c144d3181733fca11c0e5b8",
          controlId: "90a675bc5686443d8ed5b7bd79522a10",
          isTable: false,
          from:"TextInputtest",
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
      setAllCode(orchestrationData?.data?.code)
      setGoruleData(orchestrationData?.data?.pfRuleData ||{})
      fetchSchema(orchestrationData?.data?.pfRuleData ||{})
      if(orchestrationData?.data?.schemaData[0].nodeType=='apinode'){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'test',type:'text'}
        type={
          name:'test',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'test',type:'text'}
        type={
          name:'test',
          type: orchestrationData?.data?.schemaData[0].schema.properties.test.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.test.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.test.type
        }
        setDynamicStateandType(type)
      }
      }

    }
    catch(err)
    {
      console.log(err)
    }
  }
  
  useEffect(()=>{
      handleMapperValue()
      handleBlur()
  },[validateRefetch.value])


  if (test22a10?.isHidden) {
    return <></>
  }
   if (isLoading) {
    return  <div style={{gridColumn: `15 / 23`,gridRow: `67 / 126`, gap:``, height: `100%`, overflow: 'auto'}} >
      Loading schema...</div>
  }

  if (!renderData) {
    return null;
  }
  return (   
    <div  
      style={{gridColumn: `15 / 23`,gridRow: `67 / 126`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <DynamicJsonForm
        metadata={renderData}
        onChange={handleChange}
        values={parent0e5b8?.test}
        contentAlign={"left"}
      />
    </div> 
  )
}

export default DynamicJsonFormtest
