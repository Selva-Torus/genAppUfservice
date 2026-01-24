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




const DynamicJsonFormselectionapproach = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "id": "2f756366-da97-4473-97c9-8470b3c7333b",
        "name": "request",
        "position": {
          "x": 90,
          "y": 55
        }
      },
      {
        "type": "outputNode",
        "id": "10ccb557-f33d-4fd7-9e7f-2b9430ad5c3c",
        "name": "response",
        "position": {
          "x": 755,
          "y": 30
        }
      },
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "75d383cf-b3e0-4c33-95c6-9c3c34426136",
              "field": "test7777",
              "name": "options"
            }
          ],
          "outputs": [
            {
              "id": "aad07e68-a351-4179-b929-335a915e6ddb",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "a3b4aeac-4f03-4aab-aeb2-a545a646c911",
              "75d383cf-b3e0-4c33-95c6-9c3c34426136": "\"ps\"",
              "aad07e68-a351-4179-b929-335a915e6ddb": "\"CK:CT309:FNGK:AF:FNK:DF-DST:CATK:AG001:AFGK:A001:AFK:rtp:AFVK:v1:NDP\""
            },
            {
              "_id": "4ee1b670-feeb-4d0c-a5d2-d2b2256c6b3f",
              "75d383cf-b3e0-4c33-95c6-9c3c34426136": "\"PS001\"",
              "aad07e68-a351-4179-b929-335a915e6ddb": "\"CK:CT309:FNGK:AF:FNK:DF-DST:CATK:AG001:AFGK:A001:AFK:inputsDst:AFVK:v1:NDP\""
            }
          ]
        },
        "id": "38cd2d25-1d3c-4dba-b31c-38b67d7ec847",
        "name": "decisionTable1",
        "position": {
          "x": 485,
          "y": 220
        }
      }
    ],
    "edges": [
      {
        "id": "62b94bc0-13b7-4e6a-9225-372bdac3dd37",
        "sourceId": "2f756366-da97-4473-97c9-8470b3c7333b",
        "type": "edge",
        "targetId": "38cd2d25-1d3c-4dba-b31c-38b67d7ec847"
      },
      {
        "id": "7e0c01ab-4377-4280-ae6a-247758c5e85a",
        "sourceId": "38cd2d25-1d3c-4dba-b31c-38b67d7ec847",
        "type": "edge",
        "targetId": "10ccb557-f33d-4fd7-9e7f-2b9430ad5c3c"
      }
    ]
  },
  "rule": {},
  "events": {
    "NDS": [
      {
        "id": "e73fa52ff6a740cdabe17267a4509360",
        "type": "controlNode",
        "position": {
          "x": 7.346830883737574,
          "y": -68.49051685818398
        },
        "data": {
          "nodeId": "e73fa52ff6a740cdabe17267a4509360",
          "nodeName": "selectionapproach",
          "nodeType": "dynamicjsonform",
          "events": [
            {
              "name": "onSubmit",
              "rise": [
                {
                  "key": "refreshScreen",
                  "label": "refreshScreen",
                  "listenerType": "type1"
                },
                {
                  "key": "setValueToMemory",
                  "label": "setValueToMemory",
                  "listenerType": "type1"
                },
                {
                  "key": "copyFormData",
                  "label": "copyFormData",
                  "listenerType": "type1"
                },
                {
                  "key": "confirmMsg",
                  "label": "confirmMsg",
                  "listenerType": "type1"
                },
                {
                  "key": "refreshElement",
                  "label": "refreshElement",
                  "listenerType": "type2"
                },
                {
                  "key": "clearHandler",
                  "label": "clearHandler",
                  "listenerType": "type1"
                },
                {
                  "key": "eventEmitter",
                  "label": "eventEmitter",
                  "listenerType": "type1"
                },
                {
                  "key": "infoMsg",
                  "label": "infoMsg",
                  "listenerType": "type1"
                },
                {
                  "key": "saveHandler",
                  "label": "saveHandler",
                  "listenerType": "type1"
                },
                {
                  "key": "pushToRedisHandler",
                  "label": "pushToRedisHandler",
                  "listenerType": "type1"
                }
              ],
              "riseListen": [
                {
                  "key": "triggerButtonClick",
                  "label": "triggerButtonClick",
                  "listenerType": "type1"
                },
                {
                  "key": "showComponentAsPopup",
                  "label": "showComponentAsPopup",
                  "listenerType": "type2"
                },
                {
                  "key": "copyFormData",
                  "label": "copyFormData",
                  "listenerType": "type2"
                },
                {
                  "key": "selectFirstRecord",
                  "label": "selectFirstRecord",
                  "listenerType": "type1"
                },
                {
                  "key": "resetSelection",
                  "label": "resetSelection",
                  "listenerType": "type1"
                },
                {
                  "key": "hideElement",
                  "label": "hideElement",
                  "listenerType": "type2"
                },
                {
                  "key": "showElement",
                  "label": "showElement",
                  "listenerType": "type2"
                },
                {
                  "key": "refreshElement",
                  "label": "refreshElement",
                  "listenerType": "type2"
                },
                {
                  "key": "disableElement",
                  "label": "disableElement",
                  "listenerType": "type2"
                },
                {
                  "key": "enableElement",
                  "label": "enableElement",
                  "listenerType": "type2"
                },
                {
                  "key": "showArtifactAsModal",
                  "label": "showArtifactAsModal",
                  "listenerType": "type2"
                },
                {
                  "key": "showArtifact",
                  "label": "showArtifact",
                  "listenerType": "type2"
                },
                {
                  "key": "clearHandler",
                  "label": "clearHandler",
                  "listenerType": "type2"
                },
                {
                  "key": "bindFileHandler",
                  "label": "bindFileHandler",
                  "listenerType": "type2"
                },
                {
                  "key": "getFormData",
                  "label": "getFormData",
                  "listenerType": "type1"
                }
              ],
              "self": [],
              "enabled": true
            }
          ],
          "label": "selectionapproach",
          "children": [
            "e73fa52ff6a740cdabe17267a4509360.1.1"
          ],
          "sequence": 1,
          "nodeProperty": {}
        },
        "width": 55,
        "height": 29,
        "positionAbsolute": {
          "x": 7.380159534712658,
          "y": -68.47498758011257
        }
      },
      {
        "id": "e73fa52ff6a740cdabe17267a4509360.1.1",
        "type": "eventNode",
        "position": {
          "x": -66.25883046487384,
          "y": -5.311766261582987
        },
        "data": {
          "label": "onSubmit",
          "sequence": "1.1",
          "parent": "e73fa52ff6a740cdabe17267a4509360",
          "children": [
            "e73fa52ff6a740cdabe17267a4509360.1.1.1"
          ],
          "nodeProperty": {}
        },
        "className": "_node_1qffi_1",
        "width": 100,
        "height": 100,
        "positionAbsolute": {
          "x": -66.1878912999007,
          "y": -5.2598244976537245
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "e73fa52ff6a740cdabe17267a4509360.1.1.1",
        "type": "handlerNode",
        "eventContext": "riseListen",
        "label": "getFormData",
        "position": {
          "x": -5.9058542271981675,
          "y": 70.66185590020278
        },
        "data": {
          "label": "getFormData",
          "eventContext": "riseListen",
          "parentId": "e73fa52ff6a740cdabe17267a4509360.1.1",
          "value": "",
          "sequence": "1.1.1",
          "children": [
            "97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1"
          ]
        },
        "width": 55,
        "height": 45,
        "positionAbsolute": {
          "x": -5.878388475629465,
          "y": 70.74241773523029
        }
      },
      {
        "id": "97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1",
        "type": "groupNode",
        "position": {
          "x": 67.15682398197893,
          "y": 7.208662225411917
        },
        "name": "dynamicforms|groupfordynamicbutton",
        "elementType": "group",
        "key": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1|groupfordynamicbutton",
        "data": {
          "id": "97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1",
          "sequence": "1.1.1.1",
          "parentId": "e73fa52ff6a740cdabe17267a4509360.1.1.1",
          "nodeName": "groupfordynamicbutton",
          "name": "groupfordynamicbutton",
          "nodeId": "97c73a889eb44a0f867bcdbb9c6143be",
          "elementType": "group",
          "key": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1|groupfordynamicbutton",
          "nodeType": "group",
          "children": []
        },
        "width": 85,
        "height": 45,
        "positionAbsolute": {
          "x": 67.12440575987279,
          "y": 7.252847245022185
        }
      }
    ],
    "NDE": [
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "e73fa52ff6a740cdabe17267a4509360->e73fa52ff6a740cdabe17267a4509360.1.1",
        "source": "e73fa52ff6a740cdabe17267a4509360",
        "type": "straight",
        "target": "e73fa52ff6a740cdabe17267a4509360.1.1",
        "animated": true
      },
      {
        "id": "e73fa52ff6a740cdabe17267a4509360.1.1.1->97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1",
        "source": "e73fa52ff6a740cdabe17267a4509360.1.1.1",
        "type": "straight",
        "target": "97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1"
      },
      {
        "id": "e73fa52ff6a740cdabe17267a4509360.1.1->e73fa52ff6a740cdabe17267a4509360.1.1.1",
        "source": "e73fa52ff6a740cdabe17267a4509360.1.1",
        "type": "straight",
        "target": "e73fa52ff6a740cdabe17267a4509360.1.1.1"
      }
    ],
    "NDP": {},
    "eventSummary": {
      "id": "e73fa52ff6a740cdabe17267a4509360",
      "type": "dynamicjsonform",
      "name": "selectionapproach",
      "sequence": 1,
      "children": [
        {
          "id": "e73fa52ff6a740cdabe17267a4509360.1.1",
          "type": "eventNode",
          "name": "onSubmit",
          "sequence": "1.1",
          "children": [
            {
              "id": "e73fa52ff6a740cdabe17267a4509360.1.1.1",
              "eventContext": "riseListen",
              "value": "",
              "type": "handlerNode",
              "name": "getFormData",
              "sequence": "1.1.1",
              "children": [
                {
                  "id": "97c73a889eb44a0f867bcdbb9c6143be.1.1.1.1",
                  "type": "group",
                  "name": "dynamicforms|groupfordynamicbutton",
                  "key": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1|groupfordynamicbutton",
                  "elementType": "group",
                  "sequence": "1.1.1.1",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "mapper": []
}
  const [goruleData,setGoruleData]=useState<any>({})
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'selectionapproach',type:"text"})
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
        "value": "loginId",
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
              "value": "aaaaa",
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
        //for group element
        ...groupfordynamicbutton143be,

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
    setValidate((pre:any)=>({...pre,selectionapproach:{}}))
    if(dynamicStateandType.type=="number"){
    setparent0e5b8((prev: any) => ({ ...prev, selectionapproach: +values }))
    }
    else{
    setparent0e5b8((prev: any) => ({ ...prev, selectionapproach: values }))
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
          controlId: "e73fa52ff6a740cdabe17267a4509360",
          isTable: false,
          from:"TextInputselectionapproach",
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
        let type:any={name:'selectionapproach',type:'text'}
        type={
          name:'selectionapproach',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.selectionapproach.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.selectionapproach.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.selectionapproach.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'selectionapproach',type:'text'}
        type={
          name:'selectionapproach',
          type: orchestrationData?.data?.schemaData[0].schema.properties.selectionapproach.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.selectionapproach.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.selectionapproach.type
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

          //for group element
    useEffect(() => {
      fetchSchema(goruleData,groupfordynamicbutton143be);
    }, [groupfordynamicbutton143be])

  if (selectionapproach09360?.isHidden) {
    return <></>
  }
   if (isLoading) {
    return  <div style={{gridColumn: `2 / 11`,gridRow: `44 / 119`, gap:``, height: `100%`, overflow: 'auto'}} >
      Loading schema...</div>
  }

  if (!renderData) {
    return null;
  }
  return (   
    <div  
      style={{gridColumn: `2 / 11`,gridRow: `44 / 119`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <DynamicJsonForm
        metadata={renderData}
        onChange={handleChange}
        values={parent0e5b8?.selectionapproach}
        contentAlign={"left"}
      />
    </div> 
  )
}

export default DynamicJsonFormselectionapproach
