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
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import * as v from 'valibot';
///////////////
////////////

const TextInputdebit_account_no = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "id": "7b9a3cea26a7418fad707f5519ca9796",
        "type": "controlNode",
        "position": {
          "x": -106.06086319220718,
          "y": -107.64001890818876
        },
        "data": {
          "nodeId": "7b9a3cea26a7418fad707f5519ca9796",
          "nodeName": "debit_account_no",
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
                  "listenerType": "type1"
                },
                {
                  "key": "infoMsg",
                  "label": "infoMsg",
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
                  "listenerType": "type1"
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
                  "listenerType": "type1"
                },
                {
                  "key": "infoMsg",
                  "label": "infoMsg",
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
                  "listenerType": "type1"
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
          "label": "debit_account_no",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1"
          ],
          "sequence": 1,
          "nodeProperty": {}
        },
        "width": 55,
        "height": 28,
        "positionAbsolute": {
          "x": -106.06081400479904,
          "y": -107.64009495249118
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1",
        "type": "eventNode",
        "position": {
          "x": -126.7858876819047,
          "y": -17.251419621791886
        },
        "data": {
          "label": "onBlur",
          "sequence": "1.1",
          "parent": "7b9a3cea26a7418fad707f5519ca9796",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1"
          ],
          "nodeProperty": {}
        },
        "className": "_node_1qffi_1",
        "width": 100,
        "height": 100,
        "positionAbsolute": {
          "x": -126.78585139011832,
          "y": -17.251576670578235
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
        "type": "handlerNode",
        "label": "eventEmitter",
        "eventContext": "rise",
        "position": {
          "x": -22.46516542833498,
          "y": -129.77594141580803
        },
        "data": {
          "label": "eventEmitter",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1"
          ],
          "nodeProperty": {
            "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
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
          "x": -22.465095112267473,
          "y": -129.77590442321372
        },
        "width": 53,
        "height": 45,
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
        "type": "responseNode",
        "position": {
          "x": -34.05049784242493,
          "y": -16.279319136394104
        },
        "data": {
          "label": "success",
          "responseType": "success",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
          "sequence": "1.1.1.1.1",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1"
          ]
        },
        "width": 45,
        "height": 45,
        "positionAbsolute": {
          "x": -34.050518279849456,
          "y": -16.279283354456613
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
        "type": "handlerNode",
        "eventContext": "riseListen",
        "label": "copyFormData",
        "position": {
          "x": -107.35752840578988,
          "y": 79.58852178547306
        },
        "data": {
          "label": "copyFormData",
          "eventContext": "riseListen",
          "sequence": "1.1.1.1.1.1",
          "value": "",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
          "children": [
            "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1"
          ],
          "nodeProperty": {
            "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
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
          }
        },
        "width": 59,
        "height": 45,
        "positionAbsolute": {
          "x": -107.35752786324308,
          "y": 79.58844762259055
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1",
        "type": "screen",
        "elementType": "group",
        "groupType": "group",
        "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
        "position": {
          "x": -21.877763243500667,
          "y": 144.79361302291187
        },
        "data": {
          "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1.1.1.1.1",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
          "children": [],
          "nodeLabel": ""
        },
        "width": 74,
        "height": 60,
        "positionAbsolute": {
          "x": -21.877900763885027,
          "y": 144.79357471026208
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
        "type": "handlerNode",
        "label": "hasDataHandler",
        "eventContext": "rise",
        "position": {
          "x": 55.25090889165685,
          "y": -82.52436821201063
        },
        "data": {
          "label": "hasDataHandler",
          "eventContext": "rise",
          "value": "",
          "sequence": "1.1.1.1",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2"
          ],
          "nodeProperty": {
            "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
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
          "x": 55.250889473589574,
          "y": -82.5242680061907
        },
        "width": 63,
        "height": 45,
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
        "type": "responseNode",
        "position": {
          "x": 8.821955841617761,
          "y": 54.81350840249491
        },
        "data": {
          "label": "fail",
          "responseType": "fail",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
          "sequence": "1.1.1.1.2",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1"
          ]
        },
        "positionAbsolute": {
          "x": 8.821984182021025,
          "y": 54.81348856902808
        },
        "width": 45,
        "height": 45,
        "selected": false,
        "dragging": false
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
        "type": "handlerNode",
        "label": "refreshElement",
        "eventContext": "riseListen",
        "position": {
          "x": 145.21073639894314,
          "y": -53.47749456567375
        },
        "data": {
          "label": "refreshElement",
          "eventContext": "riseListen",
          "value": "",
          "sequence": "1.1.1.1.2.1.1",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
          "children": [
            "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1"
          ]
        },
        "width": 61,
        "height": 45,
        "positionAbsolute": {
          "x": 145.21076841249635,
          "y": -53.47736434424993
        }
      },
      {
        "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1",
        "type": "screen",
        "elementType": "group",
        "groupType": "group",
        "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
        "position": {
          "x": 115.92160912574823,
          "y": 91.32120269869242
        },
        "data": {
          "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
          "eventContext": "rise",
          "sequence": "1.1.1.1.2.1.1.1",
          "value": "",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
          "children": [],
          "nodeProperty": {
            "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
            "nodeName": "infoMsg",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "message",
                  "_type": "text",
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
          },
          "nodeLabel": ""
        },
        "width": 74,
        "height": 60,
        "positionAbsolute": {
          "x": 115.92165013196696,
          "y": 91.3211829235725
        }
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
        "type": "handlerNode",
        "eventContext": "rise",
        "position": {
          "x": 94.37346943315384,
          "y": 18.57745311206578
        },
        "label": "infoMsg",
        "data": {
          "label": "infoMsg",
          "eventContext": "rise",
          "sequence": "1.1.1.1.2.1",
          "value": "",
          "parentId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
          "children": [
            "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1"
          ],
          "nodeProperty": {
            "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
            "nodeName": "infoMsg",
            "nodeType": "handlerNode",
            "hlr": {
              "params": [
                {
                  "name": "message",
                  "_type": "text",
                  "value": "Invalid Account Number",
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
                  "value": "danger",
                  "enabled": true
                }
              ]
            }
          }
        },
        "positionAbsolute": {
          "x": 94.3734143930461,
          "y": 18.57748687674276
        },
        "width": 45,
        "height": 45,
        "selected": false,
        "dragging": false
      }
    ],
    "NDE": [
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796->7b9a3cea26a7418fad707f5519ca9796.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1->6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
        "type": "straight",
        "target": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.2",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
        "animated": true
      },
      {
        "style": {
          "stroke": "#a9a9a9"
        },
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
        "animated": true
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1->6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
        "type": "straight",
        "target": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1"
      },
      {
        "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1->7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
        "source": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
        "type": "straight",
        "target": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1"
      }
    ],
    "NDP": {
      "7b9a3cea26a7418fad707f5519ca9796.1.1.1": {
        "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
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
      "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1": {
        "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
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
      "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1": {
        "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
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
      "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1": {
        "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
        "nodeName": "infoMsg",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "message",
              "_type": "text",
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
      },
      "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1": {
        "nodeId": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
        "nodeName": "infoMsg",
        "nodeType": "handlerNode",
        "hlr": {
          "params": [
            {
              "name": "message",
              "_type": "text",
              "value": "Invalid Account Number",
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
              "value": "danger",
              "enabled": true
            }
          ]
        }
      }
    },
    "eventSummary": {
      "id": "7b9a3cea26a7418fad707f5519ca9796",
      "type": "textinput",
      "name": "debit_account_no",
      "label": "debit_account_no",
      "sequence": 1,
      "children": [
        {
          "id": "7b9a3cea26a7418fad707f5519ca9796.1.1",
          "type": "eventNode",
          "name": "onBlur",
          "label": "onBlur",
          "sequence": "1.1",
          "children": [
            {
              "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "eventEmitter",
              "label": "eventEmitter",
              "sequence": "1.1.1",
              "children": [
                {
                  "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
                  "eventContext": "rise",
                  "value": "",
                  "type": "handlerNode",
                  "name": "hasDataHandler",
                  "label": "hasDataHandler",
                  "sequence": "1.1.1.1",
                  "children": [
                    {
                      "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
                      "type": "responseNode",
                      "name": "success",
                      "label": "success",
                      "sequence": "1.1.1.1.1",
                      "children": [
                        {
                          "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "copyFormData",
                          "label": "copyFormData",
                          "sequence": "1.1.1.1.1.1",
                          "children": [
                            {
                              "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1",
                              "value": "",
                              "type": "screen",
                              "name": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                              "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
                              "elementType": "group",
                              "groupType": "group",
                              "sequence": "1.1.1.1.1.1.1",
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
                        }
                      ]
                    },
                    {
                      "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
                      "type": "responseNode",
                      "name": "fail",
                      "label": "fail",
                      "sequence": "1.1.1.1.2",
                      "children": [
                        {
                          "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
                          "eventContext": "rise",
                          "value": "",
                          "type": "handlerNode",
                          "name": "infoMsg",
                          "label": "infoMsg",
                          "sequence": "1.1.1.1.2.1",
                          "children": [
                            {
                              "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
                              "eventContext": "riseListen",
                              "value": "",
                              "type": "handlerNode",
                              "name": "refreshElement",
                              "label": "refreshElement",
                              "sequence": "1.1.1.1.2.1.1",
                              "children": [
                                {
                                  "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1",
                                  "value": "",
                                  "type": "screen",
                                  "name": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                                  "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                                  "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
                                  "elementType": "group",
                                  "groupType": "group",
                                  "sequence": "1.1.1.1.2.1.1.1",
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
                                "value": "Invalid Account Number",
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
                                "value": "danger",
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
                "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Balance_Check_PF:AFVK:v1|019ba9ecca4a4fb1b1c8acf88b73e13b"
              ]
            }
          ]
        }
      ]
    }
  },
  "mapper": []
}
  const decodedTokenObj:any = decodeToken(token);
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const toast : Function = useInfoMsg()
  const keyset : Function = i18n.keyset("language");
  const [allCode,setAllCode]=useState<string>("");
  let schemaArray :string[] =[];
  const [dynamicStateandType,setDynamicStateandType]=useState<Record<string, any>>({name:'debit_account_no',type:"text"})
  const routes: AppRouterInstance = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
   //another screen
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414Props, setsubscreen_groupc0414Props}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label86b10, setdebit_account_no_label86b10}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_noa9796, setdebit_account_noa9796}= useContext(TotalContext) as TotalContextProps;
  const {available_bal_label22d5b, setavailable_bal_label22d5b}= useContext(TotalContext) as TotalContextProps;
  const {balancedcbd7, setbalancedcbd7}= useContext(TotalContext) as TotalContextProps;
  const {tax_amount_label2b9ee, settax_amount_label2b9ee}= useContext(TotalContext) as TotalContextProps;
  const {total_amount46433, settotal_amount46433}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_labelf6595, setdebit_amount_labelf6595}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountf2e0e, setdebit_amountf2e0e}= useContext(TotalContext) as TotalContextProps;
  const {cheque_no_labeldb9c8, setcheque_no_labeldb9c8}= useContext(TotalContext) as TotalContextProps;
  const {cheque_nocda2a, setcheque_nocda2a}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props}= useContext(TotalContext) as TotalContextProps;
  

  // Validation  
    const [error, setError] = useState<string>('');
  schemaArray = [] ;
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
      let validate:any;    
      setError('');
      setValidate((pre:any)=>({...pre,ITAX_Payment_Details_v1:{...pre?.ITAX_Payment_Details_v1,debit_account_no:undefined}}));
    if(dynamicStateandType.type=="number"){
    setpayment_type_cheque_group239dd((prev: any) => ({ ...prev, debit_account_no: +e.target.value }));
    }
    else{
    setpayment_type_cheque_group239dd((prev: any) => ({ ...prev, debit_account_no: e.target.value }));
    }
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:string=allCode;
     if (code != '') {
      let codeStates: any = {};
      codeStates['prn_details_group']  = {...prn_details_group00560,debit_account_no:newInputValue},
      codeStates['setprn_details_group'] = setprn_details_group00560,
      codeStates['prn_datails_table']  = {...prn_datails_table2ad52,debit_account_no:newInputValue},
      codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
      codeStates['subscreen_group']  = {...subscreen_groupc0414,debit_account_no:newInputValue},
      codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1']  = {...ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,debit_account_no:newInputValue},
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['payment_type_cheque_group']  = {...payment_type_cheque_group239dd,debit_account_no:newInputValue},
      codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1']  = {...ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,debit_account_no:newInputValue},
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['payment_type_dt_group']  = {...payment_type_dt_groupedf52,debit_account_no:newInputValue},
      codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,
    codeExecution(code,codeStates);
    }  
     try{
        let copyFormhandlerData :any = {}

    }catch(err:any){
      console.error(err);
    }
  }
  const handleBlur=async () => {
      let validate:any
     try{
        let copyFormhandlerData :any = {}

      // eventEmitter        
      let mainData:any=structuredClone(payment_type_cheque_group239dd);
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
  "id": "7b9a3cea26a7418fad707f5519ca9796",
  "type": "textinput",
  "name": "debit_account_no",
  "label": "debit_account_no",
  "sequence": 1,
  "children": [
    {
      "id": "7b9a3cea26a7418fad707f5519ca9796.1.1",
      "type": "eventNode",
      "name": "onBlur",
      "label": "onBlur",
      "sequence": "1.1",
      "children": [
        {
          "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "eventEmitter",
          "label": "eventEmitter",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "hasDataHandler",
              "label": "hasDataHandler",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1",
                  "type": "responseNode",
                  "name": "success",
                  "label": "success",
                  "sequence": "1.1.1.1.1",
                  "children": [
                    {
                      "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.1.1",
                      "eventContext": "riseListen",
                      "value": "",
                      "type": "handlerNode",
                      "name": "copyFormData",
                      "label": "copyFormData",
                      "sequence": "1.1.1.1.1.1",
                      "children": [
                        {
                          "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.1.1.1",
                          "value": "",
                          "type": "screen",
                          "name": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                          "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                          "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
                          "elementType": "group",
                          "groupType": "group",
                          "sequence": "1.1.1.1.1.1.1",
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
                    }
                  ]
                },
                {
                  "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2",
                  "type": "responseNode",
                  "name": "fail",
                  "label": "fail",
                  "sequence": "1.1.1.1.2",
                  "children": [
                    {
                      "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1",
                      "eventContext": "rise",
                      "value": "",
                      "type": "handlerNode",
                      "name": "infoMsg",
                      "label": "infoMsg",
                      "sequence": "1.1.1.1.2.1",
                      "children": [
                        {
                          "id": "7b9a3cea26a7418fad707f5519ca9796.1.1.1.1.2.1.1",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "refreshElement",
                          "label": "refreshElement",
                          "sequence": "1.1.1.1.2.1.1",
                          "children": [
                            {
                              "id": "6b1dff68ee4848a7a60e2092f2b239dd.1.1.1.1.2.1.1.1",
                              "value": "",
                              "type": "screen",
                              "name": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                              "label": "ITAX_Payment_Details.v1|payment_type_cheque_group",
                              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1|payment_type_cheque_group",
                              "elementType": "group",
                              "groupType": "group",
                              "sequence": "1.1.1.1.2.1.1.1",
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
                            "value": "Invalid Account Number",
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
                            "value": "danger",
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
            "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_Balance_Check_PF:AFVK:v1|019ba9ecca4a4fb1b1c8acf88b73e13b"
          ]
        }
      ]
    }
  ]
};
      let eventDetails : any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1";
      sourceId+= "|"+"6b1dff68ee4848a7a60e2092f2b239dd";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1");
      let sourceIdNewPath : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"+"|"+"6b1dff68ee4848a7a60e2092f2b239dd"+"|"+eventProperty.id;
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
        sourceId : uf_initiatePf.data.eventProperty?.sourceId
      }
        let formData:any={};
        let ifoResponse:any[]=[];
          formData=mainData
          const uf_ifoBody:uf_ifoDto={
            formData:formData,
            key:uf_getPFDetails.key,
            groupId:"6b1dff68ee4848a7a60e2092f2b239dd",
            controlId:"7b9a3cea26a7418fad707f5519ca9796"
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
    //eventEmitter
    if(mainData?.upId)
    {
      te_eventEmitterBody['upId']= mainData.upId;
    }
    if(payment_type_cheque_group239dd?.upId){
      te_eventEmitterBody['upId']= payment_type_cheque_group239dd?.upId;
    }
    if(payment_type_cheque_group239dd?.upid){
      te_eventEmitterBody['upId']= [payment_type_cheque_group239dd?.upid];
    }
    if (encryptionFlagCont) {
      te_eventEmitterBody["dpdKey"] = encryptionDpd;
      te_eventEmitterBody["method"] = encryptionMethod;
    } 
      te_eventEmitterBody["ssKey"] = ['CT010:AF:UF-UFWS:I001:ITAX:ITAX_Payment_Type_Cheque:v1']; 
    const te_eventEmitter=await AxiosService.post("/te/eventEmitter",te_eventEmitterBody,
      { headers: {Authorization: `Bearer ${token}`}})
            // validation

              if(commonSepareteDataFromTheObject("",te_eventEmitter?.data)){

  
              // copyFormData for group
              setpayment_type_cheque_group239dd({...payment_type_cheque_group239dd,...te_eventEmitter?.data?.data});

              }else
              {

  
              //infoMsg
      toast('Invalid Account Number', 'danger')
    // refreshElement
// for group
 setpayment_type_cheque_group239ddProps((pre:any)=>({...pre,refresh:!pre?.refresh}))

              }

    }catch(err:any){
      console.error(err);
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",
          componentId: "6b1dff68ee4848a7a60e2092f2b239dd",
          controlId: "7b9a3cea26a7418fad707f5519ca9796",
          isTable: false,
          from:"TextInputdebit_account_no",
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
      if (orchestrationData?.data?.dataType ==='integer' || orchestrationData?.data?.dataType ==='number') {
        setDynamicStateandType({name:'debit_account_no', type: 'number'});
      }
      // if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='apinode'){
      // if(orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties){
      //   let type:any={name:'debit_account_no',type:'text'};
      //   type={
      //     name:'debit_account_no',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.debit_account_no.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.debit_account_no.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.responses["200"].content["application/json"].schema.items.properties.debit_account_no.type
      //   }
      //   setDynamicStateandType(type);
      // }
      // }else if(orchestrationData?.data?.schemaData?.at(0)?.nodeType=='dbnode'){
      //   if(orchestrationData?.data?.schemaData?.at(0)?.schema.properties){
      //   let type:any={name:'debit_account_no',type:'text'};
      //   type={
      //     name:'debit_account_no',
      //     type: orchestrationData?.data?.schemaData?.at(0)?.schema.properties.debit_account_no.type == 'string' ? 'text' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.debit_account_no.type =='integer' ? 'number' : orchestrationData?.data?.schemaData?.at(0)?.schema.properties.debit_account_no.type
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
  },[validateRefetch.value])
  if (debit_account_noa9796?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `13 / 25`,gridRow: `2 / 12`, gap:``, height: `100%`, overflow: 'auto', display: 'flex', flexDirection: 'column'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <div style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={payment_type_cheque_group239dd?.debit_account_no||""}
        numberFormat={dynamicStateandType.type === "number" ? "" : "none"}
         disabled= {debit_account_noa9796?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
      errorMessage={error}
        validationState={validate?.ITAX_Payment_Details_v1?.debit_account_no ? "invalid" : undefined}
      />
      </div>
    </div> 
  )
}

export default TextInputdebit_account_no
