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




const DynamicJsonFormdymanic_search_input = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "type": "inputNode",
        "id": "17cbaa44-5902-473e-931b-b9caaf86a408",
        "name": "request",
        "position": {
          "x": 40,
          "y": 130
        }
      },
      {
        "type": "outputNode",
        "id": "b5acdb23-cfb2-4e86-9391-6df1706738ac",
        "name": "response",
        "position": {
          "x": 665,
          "y": 130
        }
      },
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "9bfaeab0-6a95-4a45-b3e7-ed16bc783013",
              "name": "Input",
              "field": "tab_group"
            }
          ],
          "outputs": [
            {
              "id": "2cf5a824-b2c2-4416-aab9-378c3a84bb29",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "d090d1c7-ce8b-4d1d-a5f4-1d3bae370845",
              "9bfaeab0-6a95-4a45-b3e7-ed16bc783013": "\"view_all_tab\"",
              "2cf5a824-b2c2-4416-aab9-378c3a84bb29": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:view_all_search_input_DST:AFVK:v1:NDP\""
            },
            {
              "_id": "9f8212a0-fc95-4dfa-938a-ca01c970bc19",
              "9bfaeab0-6a95-4a45-b3e7-ed16bc783013": "\"failure_queue_tab\"",
              "2cf5a824-b2c2-4416-aab9-378c3a84bb29": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:Failure_Queue_search_input_DST:AFVK:v1:NDP\""
            }
          ]
        },
        "id": "32e61957-8bfc-42c4-896e-bd75a9a1b140",
        "name": "decisionTable1",
        "position": {
          "x": 360,
          "y": 300
        }
      }
    ],
    "edges": [
      {
        "id": "ac2096f9-186f-4719-b4df-3783306ea60d",
        "sourceId": "17cbaa44-5902-473e-931b-b9caaf86a408",
        "type": "edge",
        "targetId": "32e61957-8bfc-42c4-896e-bd75a9a1b140"
      },
      {
        "id": "27ae5e99-610d-4262-aeff-f865df214ba6",
        "sourceId": "32e61957-8bfc-42c4-896e-bd75a9a1b140",
        "type": "edge",
        "targetId": "b5acdb23-cfb2-4e86-9391-6df1706738ac"
      }
    ],
    "contentType": "application/vnd.gorules.decision"
  },
  "rule": {},
  "events": {},
  "mapper": []
}
  const [goruleData,setGoruleData]=useState<any>({})
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'dymanic_search_input',type:"text"})
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
  const {searchgroupc4337, setsearchgroupc4337}= useContext(TotalContext) as TotalContextProps;
  const {searchgroupc4337Props, setsearchgroupc4337Props}= useContext(TotalContext) as TotalContextProps;
  const {dymanic_search_input05b50, setdymanic_search_input05b50}= useContext(TotalContext) as TotalContextProps;
  const {clearf63e8, setclearf63e8}= useContext(TotalContext) as TotalContextProps;
  const {search65fd7, setsearch65fd7}= useContext(TotalContext) as TotalContextProps;
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
        "value": "",
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
              "value": "",
              "enabled": true
            },
            "schema": {
              "name": "schema",
              "_label": "Schema",
              "value": "",
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
    setValidate((pre:any)=>({...pre,dymanic_search_input:{}}))
    if(dynamicStateandType.type=="number"){
    setsearchgroupc4337((prev: any) => ({ ...prev, dymanic_search_input: +values }))
    }
    else{
    setsearchgroupc4337((prev: any) => ({ ...prev, dymanic_search_input: values }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['searchgroup']  = searchgroupc4337,
      codeStates['setsearchgroup'] = setsearchgroupc4337,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:view_all_search_screen:AFVK:v1",
          componentId: "d05d849cc0b74600a2b86ad30e5c4337",
          controlId: "b5e136e5e3e64ecdbca6d6449a005b50",
          isTable: false,
          from:"TextInputdymanic_search_input",
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
        let type:any={name:'dymanic_search_input',type:'text'}
        type={
          name:'dymanic_search_input',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dymanic_search_input.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dymanic_search_input.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.dymanic_search_input.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'dymanic_search_input',type:'text'}
        type={
          name:'dymanic_search_input',
          type: orchestrationData?.data?.schemaData[0].schema.properties.dymanic_search_input.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.dymanic_search_input.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.dymanic_search_input.type
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


  if (dymanic_search_input05b50?.isHidden) {
    return <></>
  }
   if (isLoading) {
    return  <div style={{gridColumn: `5 / 21`,gridRow: `9 / 85`, gap:``, height: `100%`, overflow: 'auto'}} >
      Loading schema...</div>
  }

  if (!renderData) {
    return null;
  }
  return (   
    <div  
      style={{gridColumn: `5 / 21`,gridRow: `9 / 85`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <DynamicJsonForm
        metadata={renderData}
        onChange={handleChange}
        values={searchgroupc4337?.dymanic_search_input}
        contentAlign={"left"}
      />
    </div> 
  )
}

export default DynamicJsonFormdymanic_search_input
