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




const DynamicJsonFormproduct_code_json = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "id": "bd2020d1-3735-4148-89ca-0646dd0bd58a",
        "name": "request",
        "position": {
          "x": 5,
          "y": 180
        }
      },
      {
        "type": "outputNode",
        "id": "e2b8ff01-08c0-4c44-aa6c-c1e95479dcd6",
        "name": "response",
        "position": {
          "x": 615,
          "y": 175
        }
      },
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "8bfb476b-dc88-49d4-9829-d77774874c27",
              "name": "Input",
              "field": "product_code"
            }
          ],
          "outputs": [
            {
              "id": "b52629d0-798f-4eb1-b199-d1095e79a54b",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "1489f8b3-24e6-452c-b3dc-ba9a544bcddd",
              "8bfb476b-dc88-49d4-9829-d77774874c27": "\"SMT_AEUAB\"",
              "b52629d0-798f-4eb1-b199-d1095e79a54b": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:Soruce_Tran_Product_Basic_SMT:AFVK:v1:NDP\""
            },
            {
              "_id": "a316667a-ce60-43dd-92cd-e38082b5bdfb",
              "8bfb476b-dc88-49d4-9829-d77774874c27": "\"FN_USXYZ\"",
              "b52629d0-798f-4eb1-b199-d1095e79a54b": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:Soruce_Tran_Product_Basic_FN:AFVK:v1:NDP\""
            }
          ]
        },
        "id": "7bd42c40-75e0-4f12-aea4-917e061c4a0f",
        "name": "decisionTable1",
        "position": {
          "x": 305,
          "y": 255
        }
      }
    ],
    "edges": [
      {
        "id": "717bf485-d27c-41f7-8690-0f8f6458f2d6",
        "sourceId": "bd2020d1-3735-4148-89ca-0646dd0bd58a",
        "type": "edge",
        "targetId": "7bd42c40-75e0-4f12-aea4-917e061c4a0f"
      },
      {
        "id": "34a79674-4d40-4780-aa6e-0f3e3c088740",
        "sourceId": "7bd42c40-75e0-4f12-aea4-917e061c4a0f",
        "type": "edge",
        "targetId": "e2b8ff01-08c0-4c44-aa6c-c1e95479dcd6"
      }
    ],
    "contentType": "application/vnd.gorules.decision"
  },
  "rule": {},
  "events": {
    "NDS": [
      {
        "id": "f0cb9eec020642339a5d552280f46315",
        "type": "controlNode",
        "position": {
          "x": -63.283702951134885,
          "y": -37.68961556141456
        },
        "data": {
          "nodeId": "f0cb9eec020642339a5d552280f46315",
          "nodeName": "product_code_json",
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
          "label": "product_code_json",
          "children": [
            "f0cb9eec020642339a5d552280f46315.1.1"
          ],
          "sequence": 1,
          "nodeProperty": {}
        },
        "width": 56,
        "height": 26,
        "positionAbsolute": {
          "x": -63.30365235366189,
          "y": -37.770708821053624
        }
      },
      {
        "id": "f0cb9eec020642339a5d552280f46315.1.1",
        "type": "eventNode",
        "position": {
          "x": 30.318861420894063,
          "y": -54.075771139626774
        },
        "data": {
          "label": "onSubmit",
          "sequence": "1.1",
          "parent": "f0cb9eec020642339a5d552280f46315",
          "children": [
            "f0cb9eec020642339a5d552280f46315.1.1.1"
          ],
          "nodeProperty": {}
        },
        "className": "_node_1qffi_1",
        "width": 100,
        "height": 100,
        "positionAbsolute": {
          "x": 30.27255016377847,
          "y": -53.976095483681355
        }
      },
      {
        "id": "f0cb9eec020642339a5d552280f46315.1.1.1",
        "type": "handlerNode",
        "eventContext": "riseListen",
        "label": "getFormData",
        "position": {
          "x": 64.62171979215675,
          "y": 34.64835088275791
        },
        "data": {
          "label": "getFormData",
          "eventContext": "riseListen",
          "parentId": "f0cb9eec020642339a5d552280f46315.1.1",
          "value": "",
          "sequence": "1.1.1",
          "children": [
            "4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1"
          ]
        },
        "width": 55,
        "height": 45,
        "positionAbsolute": {
          "x": 64.68302208111874,
          "y": 34.65099243671005
        }
      },
      {
        "id": "4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1",
        "type": "controlNode",
        "position": {
          "x": -30.958107088776355,
          "y": 58.418661847319534
        },
        "name": "Add_New_Payment|payment_group|product_code",
        "elementType": "dropdown",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1|product_code",
        "data": {
          "id": "4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1",
          "sequence": "1.1.1.1",
          "parentId": "f0cb9eec020642339a5d552280f46315.1.1.1",
          "nodeName": "product_code",
          "name": "product_code",
          "nodeId": "f9267411c46944129296883d4a89a692",
          "elementType": "dropdown",
          "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1|product_code",
          "nodeType": "dropdown",
          "children": []
        },
        "width": 55,
        "height": 26,
        "positionAbsolute": {
          "x": -30.921468004617157,
          "y": 58.421574851935866
        }
      }
    ],
    "NDE": [
      {
        "id": "f0cb9eec020642339a5d552280f46315->f0cb9eec020642339a5d552280f46315.1.1",
        "source": "f0cb9eec020642339a5d552280f46315",
        "type": "straight",
        "target": "f0cb9eec020642339a5d552280f46315.1.1"
      },
      {
        "id": "f0cb9eec020642339a5d552280f46315.1.1.1->4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1",
        "source": "f0cb9eec020642339a5d552280f46315.1.1.1",
        "type": "straight",
        "target": "4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1"
      },
      {
        "id": "f0cb9eec020642339a5d552280f46315.1.1->f0cb9eec020642339a5d552280f46315.1.1.1",
        "source": "f0cb9eec020642339a5d552280f46315.1.1",
        "type": "straight",
        "target": "f0cb9eec020642339a5d552280f46315.1.1.1"
      }
    ],
    "NDP": {},
    "eventSummary": {
      "id": "f0cb9eec020642339a5d552280f46315",
      "type": "dynamicjsonform",
      "name": "product_code_json",
      "sequence": 1,
      "children": [
        {
          "id": "f0cb9eec020642339a5d552280f46315.1.1",
          "type": "eventNode",
          "name": "onSubmit",
          "sequence": "1.1",
          "children": [
            {
              "id": "f0cb9eec020642339a5d552280f46315.1.1.1",
              "eventContext": "riseListen",
              "value": "",
              "type": "handlerNode",
              "name": "getFormData",
              "sequence": "1.1.1",
              "children": [
                {
                  "id": "4e3a333fdb93472c97f4c7ca2461c8a5|f9267411c46944129296883d4a89a692.1.1.1.1",
                  "type": "dropdown",
                  "name": "Add_New_Payment|payment_group|product_code",
                  "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1|product_code",
                  "elementType": "dropdown",
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
    const [goruleData,setGoruleData]=useState<any>(actionDetails?.pfRuleData ||{})
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'product_code_json',type:"text"})
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
  const {payment_group1c8a5, setpayment_group1c8a5}= useContext(TotalContext) as TotalContextProps;
  const {payment_group1c8a5Props, setpayment_group1c8a5Props}= useContext(TotalContext) as TotalContextProps;
  const {channel_named9a37, setchannel_named9a37}= useContext(TotalContext) as TotalContextProps;
  const {product_code9a692, setproduct_code9a692}= useContext(TotalContext) as TotalContextProps;
  const {directionbf471, setdirectionbf471}= useContext(TotalContext) as TotalContextProps;
  const {charge_type977c5, setcharge_type977c5}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account0655c, setdebtor_account0655c}= useContext(TotalContext) as TotalContextProps;
  const {creditor_accounts82148, setcreditor_accounts82148}= useContext(TotalContext) as TotalContextProps;
  const {amountc2ae9, setamountc2ae9}= useContext(TotalContext) as TotalContextProps;
  const {currency124c5, setcurrency124c5}= useContext(TotalContext) as TotalContextProps;
  const {uuide86ae, setuuide86ae}= useContext(TotalContext) as TotalContextProps;
  const {process_type45fad, setprocess_type45fad}= useContext(TotalContext) as TotalContextProps;
  const {tran_category81c97, settran_category81c97}= useContext(TotalContext) as TotalContextProps;
  const {settlement_datea6baf, setsettlement_datea6baf}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info57b4b, setremittance_info57b4b}= useContext(TotalContext) as TotalContextProps;
  const {product_code_json46315, setproduct_code_json46315}= useContext(TotalContext) as TotalContextProps;
  const {saveb6b99, setsaveb6b99}= useContext(TotalContext) as TotalContextProps;
  const {clearf69d6, setclearf69d6}= useContext(TotalContext) as TotalContextProps;
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
        //for controller element
      product_code:payment_group1c8a5?.product_code,

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
  function getLeafValues(obj:any) {
    let result:any = {};
    for (const key in obj) {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        result = { ...result, ...getLeafValues(obj[key]) };
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  const handleChange = async(values: FieldValues) => {
    setError('')
    let flatentedValues:any=getLeafValues(values)||{}
    setValidate((pre:any)=>({...pre,product_code_json:{}}))
    if(dynamicStateandType.type=="number"){
      setpayment_group1c8a5((prev: any) => ({ ...prev, product_code_json: +values }))
    }
    else{
      setpayment_group1c8a5((prev: any) => ({ ...prev, product_code_json: values }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['payment_group']  = payment_group1c8a5,
      codeStates['setpayment_group'] = setpayment_group1c8a5,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",
          componentId: "4e3a333fdb93472c97f4c7ca2461c8a5",
          controlId: "f0cb9eec020642339a5d552280f46315",
          isTable: false,
          from:"TextInputproduct_code_json",
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
     
      if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'product_code_json',type:'text'}
        type={
          name:'product_code_json',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.product_code_json.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.product_code_json.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.product_code_json.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'product_code_json',type:'text'}
        type={
          name:'product_code_json',
          type: orchestrationData?.data?.schemaData[0].schema.properties.product_code_json.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.product_code_json.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.product_code_json.type
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

    useEffect(() => {
      fetchSchema(goruleData,{product_code:payment_group1c8a5?.product_code});
         }, [])

  if (product_code_json46315?.isHidden) {
    return <></>
  }
   if (isLoading) {
    return  <div style={{gridColumn: `1 / 25`,gridRow: `81 / 150`, gap:``, height: `100%`, overflow: 'auto'}} >
      Loading schema...</div>
  }

  if (!renderData) {
    return null;
  }
  return (   
    <div  
      style={{gridColumn: `1 / 25`,gridRow: `81 / 150`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <DynamicJsonForm
        metadata={renderData}
        onChange={handleChange}
        values={payment_group1c8a5?.product_code_json}
        contentAlign={"left"}
      />
    </div> 
  )
}

export default DynamicJsonFormproduct_code_json
