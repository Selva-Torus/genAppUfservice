'use client'




import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import i18n from '@/app/components/i18n';
import decodeToken from '@/app/components/decodeToken';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import UOmapperData from '@/context/dfdmapperContolnames.json'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import * as v from 'valibot';
///////////////
////////////

const TextInputdr_account = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const actionDetails : any = {
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
  "events": {
    "NDS": [
      {
        "id": "2bd22037690e4c038e1c310720e27abb",
        "type": "controlNode",
        "position": {
          "x": -155.13667375116432,
          "y": 68.21201680397243
        },
        "data": {
          "nodeId": "2bd22037690e4c038e1c310720e27abb",
          "nodeName": "dr_account",
          "nodeType": "textinput",
          "events": [
            {
              "name": "onChange",
              "rise": [
                {
                  "key": "getValueFromMemory",
                  "label": "getValueFromMemory",
                  "listenerType": "type1"
                },
                {
                  "key": "hasDataHandler",
                  "label": "hasDataHandler",
                  "listenerType": "type1"
                },
                {
                  "key": "eventEmitter",
                  "label": "eventEmitter",
                  "listenerType": "type1"
                },
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
                  "listenerType": "type2"
                },
                {
                  "key": "infoMsg",
                  "label": "infoMsg",
                  "listenerType": "type1"
                }
              ],
              "riseListen": [
                {
                  "key": "getFormData",
                  "label": "getFormData",
                  "listenerType": "type2"
                },
                {
                  "key": "triggerButtonClick",
                  "label": "triggerButtonClick",
                  "listenerType": "type1"
                },
                {
                  "key": "copyFormData",
                  "label": "copyFormData",
                  "listenerType": "type2"
                },
                {
                  "key": "showComponentAsPopup",
                  "label": "showComponentAsPopup",
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
                  "key": "clearHandler",
                  "label": "clearHandler",
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
                }
              ],
              "self": [],
              "enabled": true
            },
            {
              "name": "onBlur",
              "rise": [
                {
                  "key": "getValueFromMemory",
                  "label": "getValueFromMemory",
                  "listenerType": "type1"
                },
                {
                  "key": "hasDataHandler",
                  "label": "hasDataHandler",
                  "listenerType": "type1"
                },
                {
                  "key": "eventEmitter",
                  "label": "eventEmitter",
                  "listenerType": "type1"
                },
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
                  "listenerType": "type2"
                },
                {
                  "key": "infoMsg",
                  "label": "infoMsg",
                  "listenerType": "type1"
                }
              ],
              "riseListen": [
                {
                  "key": "getFormData",
                  "label": "getFormData",
                  "listenerType": "type2"
                },
                {
                  "key": "triggerButtonClick",
                  "label": "triggerButtonClick",
                  "listenerType": "type1"
                },
                {
                  "key": "copyFormData",
                  "label": "copyFormData",
                  "listenerType": "type2"
                },
                {
                  "key": "showComponentAsPopup",
                  "label": "showComponentAsPopup",
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
                  "key": "clearHandler",
                  "label": "clearHandler",
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
                }
              ],
              "self": [],
              "enabled": true
            }
          ],
          "label": "dr_account",
          "children": [
            "2bd22037690e4c038e1c310720e27abb.1.1"
          ],
          "sequence": 1,
          "nodeProperty": {}
        },
        "width": 55,
        "height": 25,
        "positionAbsolute": {
          "x": -155.1367602223402,
          "y": 68.21172991881512
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1",
        "type": "eventNode",
        "position": {
          "x": -64.44839255027121,
          "y": 145.1732079137267
        },
        "data": {
          "label": "onBlur",
          "sequence": "1.1",
          "parent": "2bd22037690e4c038e1c310720e27abb",
          "children": [
            "2bd22037690e4c038e1c310720e27abb.1.1.1"
          ],
          "nodeProperty": {}
        },
        "className": "_node_1qffi_1",
        "width": 100,
        "height": 100,
        "positionAbsolute": {
          "x": -64.44871443267144,
          "y": 145.17308113352271
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1",
        "type": "handlerNode",
        "label": "eventEmitter",
        "eventContext": "rise",
        "position": {
          "x": -78.19586462162329,
          "y": 42.75955418604938
        },
        "data": {
          "label": "eventEmitter",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1",
          "children": [
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1",
            "nodeName": "eventEmitter",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "status",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "needClearValue",
                  "_type": "boolean",
                  "value": false,
                  "enabled": true
                }
              ]
            }
          }
        },
        "positionAbsolute": {
          "x": -78.19582153039116,
          "y": 42.75949548648924
        },
        "width": 53,
        "height": 45,
        "selected": false,
        "dragging": false
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
        "type": "responseNode",
        "position": {
          "x": -63.71020412262943,
          "y": -154.33232548844012
        },
        "data": {
          "label": "success",
          "responseType": "success",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
          "sequence": "1.1.1.1.1",
          "children": [
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1"
          ]
        },
        "width": 45,
        "height": 45,
        "positionAbsolute": {
          "x": -63.71020733866467,
          "y": -154.33226593391282
        }
      },
      {
        "id": "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
        "type": "screen",
        "elementType": "textinput",
        "groupType": "textinput",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_name",
        "position": {
          "x": -48.081032574694454,
          "y": -66.10290492805565
        },
        "data": {
          "label": "scanSaveProcessUi.v1|commonInfo|dr_name",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1.1.1.1.1",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
          "children": [],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
            "nodeName": "hasDataHandler",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "path",
                  "_label": "Path",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                }
              ]
            }
          },
          "name": "scanSaveProcessUi.v1|commonInfo|dr_name",
          "nodeLabel": "|Dr Name"
        },
        "width": 55,
        "height": 66,
        "positionAbsolute": {
          "x": -48.08082449000216,
          "y": -66.10282449435515
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "type": "handlerNode",
        "label": "hasDataHandler",
        "eventContext": "rise",
        "position": {
          "x": -142.63475563499887,
          "y": -58.61129083268244
        },
        "data": {
          "label": "hasDataHandler",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1.1",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1",
          "children": [
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
            "nodeName": "hasDataHandler",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "path",
                  "_label": "Path",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                }
              ]
            }
          }
        },
        "positionAbsolute": {
          "x": -142.63462066453303,
          "y": -58.611389136500215
        },
        "width": 55,
        "height": 49
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
        "type": "handlerNode",
        "label": "copyFormData",
        "eventContext": "riseListen",
        "position": {
          "x": 10.942723608609793,
          "y": 10.73502887894531
        },
        "data": {
          "label": "copyFormData",
          "eventContext": "riseListen",
          "value": "",
          "sequence": "1.1.1.1.1.1.2",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
          "children": [
            "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].CURRENCYCODE",
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
        },
        "width": 55,
        "height": 49,
        "positionAbsolute": {
          "x": 10.942917150423115,
          "y": 10.73504417325418
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1",
        "type": "screen",
        "elementType": "textinput",
        "groupType": "textinput",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|base_currency",
        "position": {
          "x": 29.70337852485515,
          "y": 130.96993492495318
        },
        "data": {
          "label": "scanSaveProcessUi.v1|commonInfo|base_currency",
          "eventContext": "riseListen",
          "sequence": "1.1.1.1.1.1.2.1",
          "value": "",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
          "children": [],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "",
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
          },
          "name": "scanSaveProcessUi.v1|commonInfo|base_currency",
          "nodeLabel": "|Base Currency"
        },
        "width": 55,
        "height": 74,
        "positionAbsolute": {
          "x": 29.70317512968549,
          "y": 130.96995017829877
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
        "type": "handlerNode",
        "label": "copyFormData",
        "eventContext": "riseListen",
        "position": {
          "x": 80.04260043661542,
          "y": -27.152666649954888
        },
        "data": {
          "label": "copyFormData",
          "eventContext": "riseListen",
          "value": "",
          "sequence": "1.1.1.1.1.1.3",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
          "children": [
            "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].SANCTIONLIMIT",
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
        },
        "width": 55,
        "height": 49,
        "positionAbsolute": {
          "x": 80.04277958132863,
          "y": -27.15267155212852
        },
        "selected": true,
        "dragging": false
      },
      {
        "id": "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1",
        "type": "screen",
        "elementType": "textinput",
        "groupType": "textinput",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_sanc_lmt",
        "position": {
          "x": 106.28910760513028,
          "y": 91.241128116694
        },
        "data": {
          "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
          "eventContext": "riseListen",
          "sequence": "1.1.1.1.1.1.3.1",
          "value": "",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
          "children": [],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
          },
          "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
          "nodeLabel": "|Dr Cust Ac Sanc Lmt"
        },
        "width": 55,
        "height": 74,
        "positionAbsolute": {
          "x": 106.28902304448263,
          "y": 91.24120678786969
        }
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
        "type": "handlerNode",
        "label": "copyFormData",
        "eventContext": "riseListen",
        "position": {
          "x": 133.79350346958591,
          "y": -96.70562630055193
        },
        "data": {
          "label": "copyFormData",
          "eventContext": "riseListen",
          "value": "",
          "sequence": "1.1.1.1.1.1.4",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
          "children": [
            "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].BALANCE",
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
        },
        "width": 55,
        "height": 49,
        "positionAbsolute": {
          "x": 133.79350346958591,
          "y": -96.70562630055193
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1",
        "type": "screen",
        "elementType": "textinput",
        "groupType": "textinput",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_balance",
        "position": {
          "x": 162.99095409807254,
          "y": 13.085586369876722
        },
        "data": {
          "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
          "eventContext": "riseListen",
          "sequence": "1.1.1.1.1.1.4.1",
          "value": "",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
          "children": [],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
          },
          "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
          "nodeLabel": "|Dr Cust Ac Balance"
        },
        "width": 55,
        "height": 74,
        "positionAbsolute": {
          "x": 162.99098401033322,
          "y": 13.085614488921047
        }
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "type": "handlerNode",
        "eventContext": "riseListen",
        "label": "copyFormData",
        "position": {
          "x": 36.70394076613232,
          "y": -130.7868208799022
        },
        "data": {
          "label": "copyFormData",
          "eventContext": "riseListen",
          "sequence": "1.1.1.1.1.1",
          "value": "",
          "parentId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
          "children": [
            "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
            "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4"
          ],
          "nodeProperty": {
            "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
            "nodeName": "copyFormData",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "parentTable",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "primaryKey",
                  "_type": "text",
                  "value": "",
                  "enabled": true
                },
                {
                  "name": "path",
                  "_type": "text",
                  "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
        },
        "width": 55,
        "height": 49,
        "positionAbsolute": {
          "x": 36.70392212195347,
          "y": -130.78677485418513
        },
        "selected": false,
        "dragging": false
      }
    ],
    "NDE": [
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb->2bd22037690e4c038e1c310720e27abb.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1",
        "type": "eventEdge",
        "data": {
          "eventType": "rise"
        },
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1",
        "type": "eventEdge",
        "data": {
          "eventType": "rise"
        },
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1->f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "type": "straight",
        "target": "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2->f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
        "type": "straight",
        "target": "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3->f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
        "type": "straight",
        "target": "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
        "animated": true
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4->f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
        "type": "straight",
        "target": "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1"
      },
      {
        "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1->2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
        "source": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "type": "straight",
        "target": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4"
      }
    ],
    "NDP": {
      "2bd22037690e4c038e1c310720e27abb.1.1.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1",
        "nodeName": "eventEmitter",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "status",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "needClearValue",
              "_type": "boolean",
              "value": false,
              "enabled": true
            }
          ]
        }
      },
      "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "nodeName": "hasDataHandler",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "path",
              "_label": "Path",
              "_type": "text",
              "value": "",
              "enabled": true
            }
          ]
        }
      },
      "2bd22037690e4c038e1c310720e27abb.1.1.1.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
        "nodeName": "hasDataHandler",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "path",
              "_label": "Path",
              "_type": "text",
              "value": "",
              "enabled": true
            }
          ]
        }
      },
      "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].CURRENCYCODE",
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
      },
      "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "",
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
      },
      "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].SANCTIONLIMIT",
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
      },
      "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
      },
      "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].BALANCE",
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
      },
      "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
      },
      "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1": {
        "nodeId": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
        "nodeName": "copyFormData",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "parentTable",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "primaryKey",
              "_type": "text",
              "value": "",
              "enabled": true
            },
            {
              "name": "path",
              "_type": "text",
              "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
    },
    "eventSummary": {
      "id": "2bd22037690e4c038e1c310720e27abb",
      "type": "textinput",
      "name": "dr_account",
      "label": "dr_account",
      "sequence": 1,
      "children": [
        {
          "id": "2bd22037690e4c038e1c310720e27abb.1.1",
          "type": "eventNode",
          "name": "onBlur",
          "label": "onBlur",
          "sequence": "1.1",
          "children": [
            {
              "id": "2bd22037690e4c038e1c310720e27abb.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "eventEmitter",
              "label": "eventEmitter",
              "sequence": "1.1.1",
              "children": [
                {
                  "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
                  "eventContext": "rise",
                  "value": "",
                  "type": "handlerNode",
                  "name": "hasDataHandler",
                  "label": "hasDataHandler",
                  "sequence": "1.1.1.1",
                  "children": [
                    {
                      "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
                      "type": "responseNode",
                      "name": "success",
                      "label": "success",
                      "sequence": "1.1.1.1.1",
                      "children": [
                        {
                          "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "copyFormData",
                          "label": "copyFormData",
                          "sequence": "1.1.1.1.1.1",
                          "children": [
                            {
                              "id": "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
                              "value": "",
                              "type": "screen",
                              "name": "scanSaveProcessUi.v1|commonInfo|dr_name",
                              "label": "scanSaveProcessUi.v1|commonInfo|dr_name",
                              "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_name",
                              "elementType": "textinput",
                              "groupType": "textinput",
                              "sequence": "1.1.1.1.1.1.1",
                              "children": []
                            },
                            {
                              "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
                              "eventContext": "riseListen",
                              "value": "",
                              "type": "handlerNode",
                              "name": "copyFormData",
                              "label": "copyFormData",
                              "sequence": "1.1.1.1.1.1.2",
                              "children": [
                                {
                                  "id": "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1",
                                  "value": "",
                                  "type": "screen",
                                  "name": "scanSaveProcessUi.v1|commonInfo|base_currency",
                                  "label": "scanSaveProcessUi.v1|commonInfo|base_currency",
                                  "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|base_currency",
                                  "elementType": "textinput",
                                  "groupType": "textinput",
                                  "sequence": "1.1.1.1.1.1.2.1",
                                  "children": []
                                }
                              ],
                              "hlr": {
                                "params": [
                                  {
                                    "name": "parentTable",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "primaryKey",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "path",
                                    "_type": "text",
                                    "value": "data[0].CUSTOMERS[0].CURRENCYCODE",
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
                            },
                            {
                              "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
                              "eventContext": "riseListen",
                              "value": "",
                              "type": "handlerNode",
                              "name": "copyFormData",
                              "label": "copyFormData",
                              "sequence": "1.1.1.1.1.1.3",
                              "children": [
                                {
                                  "id": "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1",
                                  "value": "",
                                  "type": "screen",
                                  "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
                                  "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
                                  "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_sanc_lmt",
                                  "elementType": "textinput",
                                  "groupType": "textinput",
                                  "sequence": "1.1.1.1.1.1.3.1",
                                  "children": []
                                }
                              ],
                              "hlr": {
                                "params": [
                                  {
                                    "name": "parentTable",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "primaryKey",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "path",
                                    "_type": "text",
                                    "value": "data[0].CUSTOMERS[0].SANCTIONLIMIT",
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
                            },
                            {
                              "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
                              "eventContext": "riseListen",
                              "value": "",
                              "type": "handlerNode",
                              "name": "copyFormData",
                              "label": "copyFormData",
                              "sequence": "1.1.1.1.1.1.4",
                              "children": [
                                {
                                  "id": "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1",
                                  "value": "",
                                  "type": "screen",
                                  "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
                                  "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
                                  "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_balance",
                                  "elementType": "textinput",
                                  "groupType": "textinput",
                                  "sequence": "1.1.1.1.1.1.4.1",
                                  "children": []
                                }
                              ],
                              "hlr": {
                                "params": [
                                  {
                                    "name": "parentTable",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "primaryKey",
                                    "_type": "text",
                                    "value": "",
                                    "enabled": true
                                  },
                                  {
                                    "name": "path",
                                    "_type": "text",
                                    "value": "data[0].CUSTOMERS[0].BALANCE",
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
                                "name": "parentTable",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "primaryKey",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "path",
                                "_type": "text",
                                "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
                      ]
                    }
                  ],
                  "hlr": {
                    "params": [
                      {
                        "name": "path",
                        "_label": "Path",
                        "_type": "text",
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
                    "name": "status",
                    "_type": "text",
                    "value": "",
                    "enabled": true
                  },
                  {
                    "name": "needClearValue",
                    "_type": "boolean",
                    "value": false,
                    "enabled": true
                  }
                ]
              },
              "targetKey": [
                "CK:CT005:FNGK:AF:FNK:PF-PFD:CATK:GSS:AFGK:RTGS:AFK:getAccountInfoDetails:AFVK:v1|3571c0435e554236b7e33859cc75cb5f"
              ]
            }
          ]
        }
      ]
    }
  },
  "mapper": [
    {
      "sourceKey": [
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1|2e406af65f3a4e38bfad9e92c2647a4c|properties.product_common.properties.dr_account"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|f2dd7aceaf454c72bdb1327c439f4607|2bd22037690e4c038e1c310720e27abb"
    }
  ],
  "dfdKey": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessDfd:AFVK:v1:",
  "dataType": "string"
}
  const decodedTokenObj:any = decodeToken(token);
  const {dfd_scansaveprocessdfd_v1Props, setdfd_scansaveprocessdfd_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const toast : Function = useInfoMsg()
  const keyset : Function = i18n.keyset("language");
  const [allCode,setAllCode]=useState<string>("");
  let schemaArray :string[] =[];
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'dr_account',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {overallgroup01c61, setoverallgroup01c61}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup01c61Props, setoverallgroup01c61Props}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197, setcontrolgroupda197}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197Props, setcontrolgroupda197Props}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2, setcontrol_tab_groupbc3e2}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2Props, setcontrol_tab_groupbc3e2Props}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3e, setbutton_group74f3e}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3eProps, setbutton_group74f3eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aa, setrtgs_infofd0aa}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aaProps, setrtgs_infofd0aaProps}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54, setallcontrols71c54}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54Props, setallcontrols71c54Props}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607, setcommoninfof4607}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607Props, setcommoninfof4607Props}= useContext(TotalContext) as TotalContextProps;
  const {common_info3a458, setcommon_info3a458}= useContext(TotalContext) as TotalContextProps;
  const {dr_account27abb, setdr_account27abb}= useContext(TotalContext) as TotalContextProps;
  const {dr_name84266, setdr_name84266}= useContext(TotalContext) as TotalContextProps;
  const {base_currencyb386d, setbase_currencyb386d}= useContext(TotalContext) as TotalContextProps;
  const {dr_cust_ac_sanc_lmtb74f7, setdr_cust_ac_sanc_lmtb74f7}= useContext(TotalContext) as TotalContextProps;
  const {dr_cust_ac_balance753dd, setdr_cust_ac_balance753dd}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198, setbasicinfo3d198}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198Props, setbasicinfo3d198Props}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894, setadditionalinfod2894}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894Props, setadditionalinfod2894Props}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbd, setlistgroupdcdbd}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbdProps, setlistgroupdcdbdProps}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905, setlist_tab_groupd6905}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905Props, setlist_tab_groupd6905Props}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6e, setdocument_list38c6e}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6eProps, setdocument_list38c6eProps}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97, setdoclisttable56e97}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97Props, setdoclisttable56e97Props}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827, setvalidation_listae827}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827Props, setvalidation_listae827Props}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7, setvaldnlisttable17ec7}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7Props, setvaldnlisttable17ec7Props}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944, setcomment_list72944}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944Props, setcomment_list72944Props}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0e, setcmntlisttable02d0e}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0eProps, setcmntlisttable02d0eProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19, setrtgs_lista0a19}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19Props, setrtgs_lista0a19Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8, setrtgs_list_grpcf7d8}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8Props, setrtgs_list_grpcf7d8Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6, setrtgs_list_table7b8d6}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6Props, setrtgs_list_table7b8d6Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1, setrtgs_list_tab_grp024e1}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1Props, setrtgs_list_tab_grp024e1Props}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06, setdocumnt_list03a06}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06Props, setdocumnt_list03a06Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593, setrtgs_list_doc_table_grp8a593}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593Props, setrtgs_list_doc_table_grp8a593Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bb, setrtgs_lst_doc_list_tablee57bb}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bbProps, setrtgs_lst_doc_list_tablee57bbProps}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14, setvalidtn_lista5b14}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14Props, setvalidtn_lista5b14Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569, setrtgs_list_validtn_list_grpc5569}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569Props, setrtgs_list_validtn_list_grpc5569Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42, setrtgs_list_validtn_table39a42}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42Props, setrtgs_list_validtn_table39a42Props}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbc, setcmnt_listebbbc}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbcProps, setcmnt_listebbbcProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728, setrtgs_list_cmnt_list_grpb5728}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728Props, setrtgs_list_cmnt_list_grpb5728Props}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716, setrtgs_list_cmnts_list15716}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716Props, setrtgs_list_cmnts_list15716Props}= useContext(TotalContext) as TotalContextProps;
  

  // Validation  
    const [error, setError] = useState<string>('');

  schemaArray = [
  "v.string()",
  "v.nonEmpty('This field is required.')",
  "v.regex(/^\\d+$/, 'Only digits are allowed.')"
] ;
    const schema : any  = v.pipe(    v.string(),
    v.nonEmpty('This field is required.'),
    v.regex(/^\d+$/, 'Only digits are allowed.'),
)
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
  const handleChange = async(e: any) => {
    if(e.target.value=="")
    {
      setIsRequredData(true)
    }else{
      setIsRequredData(false)
    }
      let validate:any;    
      setError('');
      setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,dr_account:undefined}}));
    if(dynamicStateandType.type=="number"){
    setcommoninfof4607((prev: any) => ({ ...prev, dr_account: +e.target.value }));
    validate = v.safeParse(schema, +e.target.value);
    }
    else{
    setcommoninfof4607((prev: any) => ({ ...prev, dr_account: e.target.value }));
    validate = v.safeParse(schema, e.target.value);
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
        codeStates['overallgroup'] = overallgroup01c61,
        codeStates['setoverallgroup'] = setoverallgroup01c61,
        codeStates['overallgroup01c61'] = overallgroup01c61Props,
        codeStates['setoverallgroup01c61'] = setoverallgroup01c61Props,
        codeStates['controlgroup'] = controlgroupda197,
        codeStates['setcontrolgroup'] = setcontrolgroupda197,
        codeStates['controlgroupda197'] = controlgroupda197Props,
        codeStates['setcontrolgroupda197'] = setcontrolgroupda197Props,
        codeStates['control_tab_group'] = control_tab_groupbc3e2,
        codeStates['setcontrol_tab_group'] = setcontrol_tab_groupbc3e2,
        codeStates['control_tab_groupbc3e2'] = control_tab_groupbc3e2Props,
        codeStates['setcontrol_tab_groupbc3e2'] = setcontrol_tab_groupbc3e2Props,
        codeStates['button_group'] = button_group74f3e,
        codeStates['setbutton_group'] = setbutton_group74f3e,
        codeStates['button_group74f3e'] = button_group74f3eProps,
        codeStates['setbutton_group74f3e'] = setbutton_group74f3eProps,
        codeStates['rtgs_info'] = rtgs_infofd0aa,
        codeStates['setrtgs_info'] = setrtgs_infofd0aa,
        codeStates['rtgs_infofd0aa'] = rtgs_infofd0aaProps,
        codeStates['setrtgs_infofd0aa'] = setrtgs_infofd0aaProps,
        codeStates['allcontrols'] = allcontrols71c54,
        codeStates['setallcontrols'] = setallcontrols71c54,
        codeStates['allcontrols71c54'] = allcontrols71c54Props,
        codeStates['setallcontrols71c54'] = setallcontrols71c54Props,
        codeStates['commoninfo'] = commoninfof4607,
        codeStates['setcommoninfo'] = setcommoninfof4607,
        codeStates['commoninfof4607'] = commoninfof4607Props,
        codeStates['setcommoninfof4607'] = setcommoninfof4607Props,
        codeStates['common_info'] = common_info3a458,
        codeStates['setcommon_info'] = setcommon_info3a458,
        codeStates['dr_account'] = dr_account27abb,
        codeStates['setdr_account'] = setdr_account27abb,
        codeStates['dr_name'] = dr_name84266,
        codeStates['setdr_name'] = setdr_name84266,
        codeStates['base_currency'] = base_currencyb386d,
        codeStates['setbase_currency'] = setbase_currencyb386d,
        codeStates['dr_cust_ac_sanc_lmt'] = dr_cust_ac_sanc_lmtb74f7,
        codeStates['setdr_cust_ac_sanc_lmt'] = setdr_cust_ac_sanc_lmtb74f7,
        codeStates['dr_cust_ac_balance'] = dr_cust_ac_balance753dd,
        codeStates['setdr_cust_ac_balance'] = setdr_cust_ac_balance753dd,
        codeStates['basicinfo'] = basicinfo3d198,
        codeStates['setbasicinfo'] = setbasicinfo3d198,
        codeStates['basicinfo3d198'] = basicinfo3d198Props,
        codeStates['setbasicinfo3d198'] = setbasicinfo3d198Props,
        codeStates['additionalinfo'] = additionalinfod2894,
        codeStates['setadditionalinfo'] = setadditionalinfod2894,
        codeStates['additionalinfod2894'] = additionalinfod2894Props,
        codeStates['setadditionalinfod2894'] = setadditionalinfod2894Props,
        codeStates['listgroup'] = listgroupdcdbd,
        codeStates['setlistgroup'] = setlistgroupdcdbd,
        codeStates['listgroupdcdbd'] = listgroupdcdbdProps,
        codeStates['setlistgroupdcdbd'] = setlistgroupdcdbdProps,
        codeStates['list_tab_group'] = list_tab_groupd6905,
        codeStates['setlist_tab_group'] = setlist_tab_groupd6905,
        codeStates['list_tab_groupd6905'] = list_tab_groupd6905Props,
        codeStates['setlist_tab_groupd6905'] = setlist_tab_groupd6905Props,
        codeStates['document_list'] = document_list38c6e,
        codeStates['setdocument_list'] = setdocument_list38c6e,
        codeStates['document_list38c6e'] = document_list38c6eProps,
        codeStates['setdocument_list38c6e'] = setdocument_list38c6eProps,
        codeStates['doclisttable'] = doclisttable56e97,
        codeStates['setdoclisttable'] = setdoclisttable56e97,
        codeStates['doclisttable56e97'] = doclisttable56e97Props,
        codeStates['setdoclisttable56e97'] = setdoclisttable56e97Props,
        codeStates['validation_list'] = validation_listae827,
        codeStates['setvalidation_list'] = setvalidation_listae827,
        codeStates['validation_listae827'] = validation_listae827Props,
        codeStates['setvalidation_listae827'] = setvalidation_listae827Props,
        codeStates['valdnlisttable'] = valdnlisttable17ec7,
        codeStates['setvaldnlisttable'] = setvaldnlisttable17ec7,
        codeStates['valdnlisttable17ec7'] = valdnlisttable17ec7Props,
        codeStates['setvaldnlisttable17ec7'] = setvaldnlisttable17ec7Props,
        codeStates['comment_list'] = comment_list72944,
        codeStates['setcomment_list'] = setcomment_list72944,
        codeStates['comment_list72944'] = comment_list72944Props,
        codeStates['setcomment_list72944'] = setcomment_list72944Props,
        codeStates['cmntlisttable'] = cmntlisttable02d0e,
        codeStates['setcmntlisttable'] = setcmntlisttable02d0e,
        codeStates['cmntlisttable02d0e'] = cmntlisttable02d0eProps,
        codeStates['setcmntlisttable02d0e'] = setcmntlisttable02d0eProps,
        codeStates['rtgs_list'] = rtgs_lista0a19,
        codeStates['setrtgs_list'] = setrtgs_lista0a19,
        codeStates['rtgs_lista0a19'] = rtgs_lista0a19Props,
        codeStates['setrtgs_lista0a19'] = setrtgs_lista0a19Props,
        codeStates['rtgs_list_grp'] = rtgs_list_grpcf7d8,
        codeStates['setrtgs_list_grp'] = setrtgs_list_grpcf7d8,
        codeStates['rtgs_list_grpcf7d8'] = rtgs_list_grpcf7d8Props,
        codeStates['setrtgs_list_grpcf7d8'] = setrtgs_list_grpcf7d8Props,
        codeStates['rtgs_list_table'] = rtgs_list_table7b8d6,
        codeStates['setrtgs_list_table'] = setrtgs_list_table7b8d6,
        codeStates['rtgs_list_table7b8d6'] = rtgs_list_table7b8d6Props,
        codeStates['setrtgs_list_table7b8d6'] = setrtgs_list_table7b8d6Props,
        codeStates['rtgs_list_tab_grp'] = rtgs_list_tab_grp024e1,
        codeStates['setrtgs_list_tab_grp'] = setrtgs_list_tab_grp024e1,
        codeStates['rtgs_list_tab_grp024e1'] = rtgs_list_tab_grp024e1Props,
        codeStates['setrtgs_list_tab_grp024e1'] = setrtgs_list_tab_grp024e1Props,
        codeStates['documnt_list'] = documnt_list03a06,
        codeStates['setdocumnt_list'] = setdocumnt_list03a06,
        codeStates['documnt_list03a06'] = documnt_list03a06Props,
        codeStates['setdocumnt_list03a06'] = setdocumnt_list03a06Props,
        codeStates['rtgs_list_doc_table_grp'] = rtgs_list_doc_table_grp8a593,
        codeStates['setrtgs_list_doc_table_grp'] = setrtgs_list_doc_table_grp8a593,
        codeStates['rtgs_list_doc_table_grp8a593'] = rtgs_list_doc_table_grp8a593Props,
        codeStates['setrtgs_list_doc_table_grp8a593'] = setrtgs_list_doc_table_grp8a593Props,
        codeStates['rtgs_lst_doc_list_table'] = rtgs_lst_doc_list_tablee57bb,
        codeStates['setrtgs_lst_doc_list_table'] = setrtgs_lst_doc_list_tablee57bb,
        codeStates['rtgs_lst_doc_list_tablee57bb'] = rtgs_lst_doc_list_tablee57bbProps,
        codeStates['setrtgs_lst_doc_list_tablee57bb'] = setrtgs_lst_doc_list_tablee57bbProps,
        codeStates['validtn_list'] = validtn_lista5b14,
        codeStates['setvalidtn_list'] = setvalidtn_lista5b14,
        codeStates['validtn_lista5b14'] = validtn_lista5b14Props,
        codeStates['setvalidtn_lista5b14'] = setvalidtn_lista5b14Props,
        codeStates['rtgs_list_validtn_list_grp'] = rtgs_list_validtn_list_grpc5569,
        codeStates['setrtgs_list_validtn_list_grp'] = setrtgs_list_validtn_list_grpc5569,
        codeStates['rtgs_list_validtn_list_grpc5569'] = rtgs_list_validtn_list_grpc5569Props,
        codeStates['setrtgs_list_validtn_list_grpc5569'] = setrtgs_list_validtn_list_grpc5569Props,
        codeStates['rtgs_list_validtn_table'] = rtgs_list_validtn_table39a42,
        codeStates['setrtgs_list_validtn_table'] = setrtgs_list_validtn_table39a42,
        codeStates['rtgs_list_validtn_table39a42'] = rtgs_list_validtn_table39a42Props,
        codeStates['setrtgs_list_validtn_table39a42'] = setrtgs_list_validtn_table39a42Props,
        codeStates['cmnt_list'] = cmnt_listebbbc,
        codeStates['setcmnt_list'] = setcmnt_listebbbc,
        codeStates['cmnt_listebbbc'] = cmnt_listebbbcProps,
        codeStates['setcmnt_listebbbc'] = setcmnt_listebbbcProps,
        codeStates['rtgs_list_cmnt_list_grp'] = rtgs_list_cmnt_list_grpb5728,
        codeStates['setrtgs_list_cmnt_list_grp'] = setrtgs_list_cmnt_list_grpb5728,
        codeStates['rtgs_list_cmnt_list_grpb5728'] = rtgs_list_cmnt_list_grpb5728Props,
        codeStates['setrtgs_list_cmnt_list_grpb5728'] = setrtgs_list_cmnt_list_grpb5728Props,
        codeStates['rtgs_list_cmnts_list'] = rtgs_list_cmnts_list15716,
        codeStates['setrtgs_list_cmnts_list'] = setrtgs_list_cmnts_list15716,
        codeStates['rtgs_list_cmnts_list15716'] = rtgs_list_cmnts_list15716Props,
        codeStates['setrtgs_list_cmnts_list15716'] = setrtgs_list_cmnts_list15716Props,
    codeExecution(code,codeStates);
    }  
    if(!validate?.success){
      return
    }
     try{
      setIsProcessing(true);
        let copyFormhandlerData :any = {}

    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
  const handleValidate=async (e?:any) => {
      let validate:any
      if(commoninfof4607?.dr_account == "" || commoninfof4607?.dr_account == undefined){
      commoninfof4607.dr_account = "";
     if(dynamicStateandType.type=="number"){
          validate = v.safeParse(schema, NaN);
        }
        else{
          validate = v.safeParse(schema, commoninfof4607?.dr_account);
        }
        if(!validate.success){
          setError(validate?.issues[0]?.message);
          setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,dr_account:"invalid"}}));
        }
    }else if(commoninfof4607?.dr_account !== ""){
   if(dynamicStateandType.type=="number"){
          validate = v.safeParse(schema, +commoninfof4607?.dr_account);
        }
        else{
          validate = v.safeParse(schema, commoninfof4607?.dr_account);
        }
    if(!validate.success){
      setError(validate?.issues[0]?.message);
      setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,dr_account:"invalid"}}));
    }else{
      setError('');
      setValidate((pre:any)=>({...pre,scanSaveProcessUi_v1:{...pre?.scanSaveProcessUi_v1,dr_account:undefined}}));
    }
    }
    if(!validate?.success){
      return
    }
  }
  
  const handleBlur=async (e?:any) => {
     try{
      setIsProcessing(true);
        let copyFormhandlerData :any = {}

      // eventEmitter        
      let mainData:any=structuredClone({...commoninfof4607, ...nullFilter(overallgroup01c61), ...nullFilter(controlgroupda197), ...nullFilter(control_tab_groupbc3e2), ...nullFilter(button_group74f3e), ...nullFilter(rtgs_infofd0aa), ...nullFilter(allcontrols71c54), ...nullFilter(basicinfo3d198), ...nullFilter(additionalinfod2894), ...nullFilter(listgroupdcdbd), ...nullFilter(list_tab_groupd6905), ...nullFilter(document_list38c6e), ...nullFilter(doclisttable56e97), ...nullFilter(validation_listae827), ...nullFilter(valdnlisttable17ec7), ...nullFilter(comment_list72944), ...nullFilter(cmntlisttable02d0e), ...nullFilter(rtgs_lista0a19), ...nullFilter(rtgs_list_grpcf7d8), ...nullFilter(rtgs_list_table7b8d6), ...nullFilter(rtgs_list_tab_grp024e1), ...nullFilter(documnt_list03a06), ...nullFilter(rtgs_list_doc_table_grp8a593), ...nullFilter(rtgs_lst_doc_list_tablee57bb), ...nullFilter(validtn_lista5b14), ...nullFilter(rtgs_list_validtn_list_grpc5569), ...nullFilter(rtgs_list_validtn_table39a42), ...nullFilter(cmnt_listebbbc), ...nullFilter(rtgs_list_cmnt_list_grpb5728), ...nullFilter(rtgs_list_cmnts_list15716)});
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
      let uf_getPFDetails:any={
        key: ""
      };
      let uf_ifo:any;
      if(!mainData || Object.keys(mainData)?.length == 0 ){
         throw 'Please give proper data';
      }
      let eventProperty :any = {
  "id": "2bd22037690e4c038e1c310720e27abb",
  "type": "textinput",
  "name": "dr_account",
  "label": "dr_account",
  "sequence": 1,
  "children": [
    {
      "id": "2bd22037690e4c038e1c310720e27abb.1.1",
      "type": "eventNode",
      "name": "onBlur",
      "label": "onBlur",
      "sequence": "1.1",
      "children": [
        {
          "id": "2bd22037690e4c038e1c310720e27abb.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "eventEmitter",
          "label": "eventEmitter",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "hasDataHandler",
              "label": "hasDataHandler",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1",
                  "type": "responseNode",
                  "name": "success",
                  "label": "success",
                  "sequence": "1.1.1.1.1",
                  "children": [
                    {
                      "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1",
                      "eventContext": "riseListen",
                      "value": "",
                      "type": "handlerNode",
                      "name": "copyFormData",
                      "label": "copyFormData",
                      "sequence": "1.1.1.1.1.1",
                      "children": [
                        {
                          "id": "f2dd7aceaf454c72bdb1327c439f4607|5ade2207705445b0a1cfc28f43184266.1.1.1.1.1.1.1",
                          "value": "",
                          "type": "screen",
                          "name": "scanSaveProcessUi.v1|commonInfo|dr_name",
                          "label": "scanSaveProcessUi.v1|commonInfo|dr_name",
                          "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_name",
                          "elementType": "textinput",
                          "groupType": "textinput",
                          "sequence": "1.1.1.1.1.1.1",
                          "children": []
                        },
                        {
                          "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.2",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "copyFormData",
                          "label": "copyFormData",
                          "sequence": "1.1.1.1.1.1.2",
                          "children": [
                            {
                              "id": "f2dd7aceaf454c72bdb1327c439f4607|9549a13b6e484a73ae4865515e4b386d.1.1.1.1.1.1.2.1",
                              "value": "",
                              "type": "screen",
                              "name": "scanSaveProcessUi.v1|commonInfo|base_currency",
                              "label": "scanSaveProcessUi.v1|commonInfo|base_currency",
                              "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|base_currency",
                              "elementType": "textinput",
                              "groupType": "textinput",
                              "sequence": "1.1.1.1.1.1.2.1",
                              "children": []
                            }
                          ],
                          "hlr": {
                            "params": [
                              {
                                "name": "parentTable",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "primaryKey",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "path",
                                "_type": "text",
                                "value": "data[0].CUSTOMERS[0].CURRENCYCODE",
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
                        },
                        {
                          "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.3",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "copyFormData",
                          "label": "copyFormData",
                          "sequence": "1.1.1.1.1.1.3",
                          "children": [
                            {
                              "id": "f2dd7aceaf454c72bdb1327c439f4607|ef43257873b2402b995bbd79124b74f7.1.1.1.1.1.1.3.1",
                              "value": "",
                              "type": "screen",
                              "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
                              "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt",
                              "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_sanc_lmt",
                              "elementType": "textinput",
                              "groupType": "textinput",
                              "sequence": "1.1.1.1.1.1.3.1",
                              "children": []
                            }
                          ],
                          "hlr": {
                            "params": [
                              {
                                "name": "parentTable",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "primaryKey",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "path",
                                "_type": "text",
                                "value": "data[0].CUSTOMERS[0].SANCTIONLIMIT",
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
                        },
                        {
                          "id": "2bd22037690e4c038e1c310720e27abb.1.1.1.1.1.1.4",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "copyFormData",
                          "label": "copyFormData",
                          "sequence": "1.1.1.1.1.1.4",
                          "children": [
                            {
                              "id": "f2dd7aceaf454c72bdb1327c439f4607|ff81fb16b4444da4b89336717f6753dd.1.1.1.1.1.1.4.1",
                              "value": "",
                              "type": "screen",
                              "name": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
                              "label": "scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance",
                              "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1|commonInfo|dr_cust_ac_balance",
                              "elementType": "textinput",
                              "groupType": "textinput",
                              "sequence": "1.1.1.1.1.1.4.1",
                              "children": []
                            }
                          ],
                          "hlr": {
                            "params": [
                              {
                                "name": "parentTable",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "primaryKey",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "path",
                                "_type": "text",
                                "value": "data[0].CUSTOMERS[0].BALANCE",
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
                            "name": "parentTable",
                            "_type": "text",
                            "value": "",
                            "enabled": true
                          },
                          {
                            "name": "primaryKey",
                            "_type": "text",
                            "value": "",
                            "enabled": true
                          },
                          {
                            "name": "path",
                            "_type": "text",
                            "value": "data[0].CUSTOMERS[0].FIRSTNAME",
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
                  ]
                }
              ],
              "hlr": {
                "params": [
                  {
                    "name": "path",
                    "_label": "Path",
                    "_type": "text",
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
                "name": "status",
                "_type": "text",
                "value": "",
                "enabled": true
              },
              {
                "name": "needClearValue",
                "_type": "boolean",
                "value": false,
                "enabled": true
              }
            ]
          },
          "targetKey": [
            "CK:CT005:FNGK:AF:FNK:PF-PFD:CATK:GSS:AFGK:RTGS:AFK:getAccountInfoDetails:AFVK:v1|3571c0435e554236b7e33859cc75cb5f"
          ]
        }
      ]
    }
  ]
};
      let eventDetails : any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId : string = "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1";
      sourceId+= "|"+"f2dd7aceaf454c72bdb1327c439f4607";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1");
      let sourceIdNewPath : string = "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1"+"|"+"f2dd7aceaf454c72bdb1327c439f4607"+"|"+eventProperty.id;
      pathIds.map((ele:any,id:number)=>{
        if(id!=pathIds.length-1)
        {
          sourceIdNewPath=sourceIdNewPath+"|"+ele
        }
      })
      for (let k = 0; k < eventDetailsArray.length; k++) {
        if (
          eventDetailsArray[k].type === 'handlerNode' &&
          eventDetailsArray[k].name === 'eventEmitter'
        ) {
          if (
            eventDetailsArray[k].targetKey &&
            eventDetailsArray[k].targetKey.length > 0
          ) {
            uf_getPFDetails= {
             key:eventDetailsArray[k].targetKey[0],
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
    
      if (uf_getPFDetails.key == undefined) {
         toast('Please check PF', 'danger')
         return
      }
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
      

      //eventEmitter
      te_eventEmitterBody = {
        ...uf_initiatePf.data.nodeProperty,
        data:mainData||{},
        event : uf_initiatePf.data.eventProperty?.source?.status,
        sourceId : uf_initiatePf.data.eventProperty?.sourceId,
        controlName: "dr_account"
      }
        let formData:any={};
        let ifoResponse:any[]=[];
          formData=mainData
          const uf_ifoBody:uf_ifoDto={
            formData:formData,
            key:uf_getPFDetails.key,
            groupId:"f2dd7aceaf454c72bdb1327c439f4607",
            controlId:"2bd22037690e4c038e1c310720e27abb"
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
            //eventEmitter
            te_eventEmitterBody.data= [{...uf_ifo?.data}];
            te_eventEmitterBody.controlName = "dr_account";
    //eventEmitter
    if(mainData?.upId)
    {
      te_eventEmitterBody['upId']= [mainData.upId];
    }
    if(commoninfof4607?.upId){
      te_eventEmitterBody['upId']= [commoninfof4607?.upId];
    }
    if(commoninfof4607?.upid){
      te_eventEmitterBody['upId']= [commoninfof4607?.upid];
    }
    if (encryptionFlagCont) {
      te_eventEmitterBody["dpdKey"] = encryptionDpd;
      te_eventEmitterBody["method"] = encryptionMethod;
    } 
    const te_eventEmitter=await AxiosService.post("/te/eventEmitter",te_eventEmitterBody,
      { headers: {Authorization: `Bearer ${token}`}})
            // validation

              if(commonSepareteDataFromTheObject("",te_eventEmitter?.data)){

  
            // copyFormData for controller
            //copyFormhandlerData variable store state and its value
            //UOmapperData have all node mapper source and targerv.and  its which we can use for dynamic node name  , going to store scanSaveProcessUi.v1|commonInfo|dr_name
               copyFormhandlerData["setcommoninfof4607"]={...copyFormhandlerData["setcommoninfof4607"],[UOmapperData['5ade2207705445b0a1cfc28f43184266']['source']]:commonSepareteDataFromTheObject("data[0].CUSTOMERS[0].FIRSTNAME",te_eventEmitter?.data)}
            // copyFormData for controller
            //copyFormhandlerData variable store state and its value
            //UOmapperData have all node mapper source and targerv.and  its which we can use for dynamic node name  , going to store scanSaveProcessUi.v1|commonInfo|base_currency
               copyFormhandlerData["setcommoninfof4607"]={...copyFormhandlerData["setcommoninfof4607"],[UOmapperData['9549a13b6e484a73ae4865515e4b386d']['source']]:commonSepareteDataFromTheObject("data[0].CUSTOMERS[0].CURRENCYCODE",te_eventEmitter?.data)}
            // copyFormData for controller
            //copyFormhandlerData variable store state and its value
            //UOmapperData have all node mapper source and targerv.and  its which we can use for dynamic node name  , going to store scanSaveProcessUi.v1|commonInfo|dr_cust_ac_sanc_lmt
               copyFormhandlerData["setcommoninfof4607"]={...copyFormhandlerData["setcommoninfof4607"],[UOmapperData['ef43257873b2402b995bbd79124b74f7']['source']]:commonSepareteDataFromTheObject("data[0].CUSTOMERS[0].SANCTIONLIMIT",te_eventEmitter?.data)}
            // copyFormData for controller
            //copyFormhandlerData variable store state and its value
            //UOmapperData have all node mapper source and targerv.and  its which we can use for dynamic node name  , going to store scanSaveProcessUi.v1|commonInfo|dr_cust_ac_balance
               copyFormhandlerData["setcommoninfof4607"]={...copyFormhandlerData["setcommoninfof4607"],[UOmapperData['ff81fb16b4444da4b89336717f6753dd']['source']]:commonSepareteDataFromTheObject("data[0].CUSTOMERS[0].BALANCE",te_eventEmitter?.data)}

              }else
              {
              }
            if("setcommoninfof4607" in copyFormhandlerData){
        setcommoninfof4607((pre:any)=>({...pre,...copyFormhandlerData["setcommoninfof4607"]}) )
      }

    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData:any = getControlOrchestrationData(
        controlData,
        "f2dd7aceaf454c72bdb1327c439f4607",
        "2bd22037690e4c038e1c310720e27abb"
      );
      // const orchestrationData: any = await AxiosService.post(
      //   '/UF/Orchestration',
      //   {
      //     key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:scanSaveProcessUi:AFVK:v1",
      //     componentId: "f2dd7aceaf454c72bdb1327c439f4607",
      //     controlId: "2bd22037690e4c038e1c310720e27abb",
      //     isTable: false,
      //     from:"TextInputdr_account",
      //     accessProfile:accessProfile
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // )
      // if(orchestrationData?.data?.error == true){
       
      //   return
      // }
      setAllCode(orchestrationData?.data?.code);
      if (orchestrationData?.data?.dataType ==='integer' || orchestrationData?.data?.dataType ==='number') {
        setDynamicStateandType({name:'dr_account', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'dr_account',type:'text'};
      //   type={
      //     name:'dr_account',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.dr_account.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'dr_account',type:'text'};
      //   type={
      //     name:'dr_account',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.dr_account.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }
    }
    catch(err)
    {
      console.log(err);
    }
  }

  useEffect(()=>{
      handleMapperValue();
      if(!commoninfof4607?.dr_account)
      { 
        setcommoninfof4607Props((pre:any)=>({...pre,required:true}));
        setIsRequredData(true);
      }
      if(validateRefetch.init!=0)
        handleValidate();
  },[validateRefetch.value])
  useEffect(() => {
  if(dfd_scansaveprocessdfd_v1Props?.setSearchFilters && dfd_scansaveprocessdfd_v1Props?.data)
  {
    if(Array.isArray(dfd_scansaveprocessdfd_v1Props.data) && dfd_scansaveprocessdfd_v1Props.data.length > 0){
      setcommoninfof4607((pre:any)=>({...pre,dr_account:dfd_scansaveprocessdfd_v1Props.data[0]?.dr_account}));
    }
  }
  },[dfd_scansaveprocessdfd_v1Props?.setSearchFilters])
  if (dr_account27abb?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `1 / 9`,gridRow: `10 / 25`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className="!rounded-xl"
        label={keyset("Dr Account")}
        onChange= {handleChange}
        onBlur={handleBlur}
        itsHaveCurrency={false}
        type={dynamicStateandType.type}
        value={commoninfof4607?.dr_account||""}
         disabled= {dr_account27abb?.isDisabled ? true : false}
        pin='brick-brick'     
        view='normal'
        contentAlign={"left"}
        headerPosition='top'
        headerText="Dr Account"
      errorMessage={error}
        validationState={validate?.scanSaveProcessUi_v1?.dr_account ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputdr_account
