'use client'




import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto, te_refreshDto } from '@/app/interfaces/interfaces';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import {commonSepareteDataFromTheObject, eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import UOmapperData from '@/context/dfdmapperContolnames.json';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable  from '@/app/utils/evaluateDecisionTable';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { getGridPositionFromOrder } from '@/app/utils/getGridPositionFromOrder';
import { Scan } from '@/app/utils/scanService';
import PageItaxCreditflowScreenpage10 from '@/app/itax_creditflow_screen_v1/itax_creditflow_screen_v1page';
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
 

const Buttonmake_payment = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,setIsProcessing:any}) => {
  const token:string = getCookie('token');
  const {currentToken, setCurrentToken} = useContext(TotalContext) as TotalContextProps;
  const decodedTokenObj:any = decodeToken(token);
  const createdBy : string = decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();

  let code:string = "";
  const prevRefreshRef = useRef(false);
  const [ruleData,setRulseData]=useState<any>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [paginationData, setPaginationData] = React.useState({
    page: 0,
    pageSize: 0,
    total: 0,
  })
  const savedData=useRef<Record<string, any>>({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast : Function=useInfoMsg();
  let dfKey: string | any;
  const [showFlag, setShowFlag] = React.useState<boolean>(true);
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState<boolean>(false);
  const routes : AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData : any = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<string>("");
  const [gridPosition, setGridPosition] = useState<any>({ gridColumn: '1 / 3', gridRow: '1 / 12' });
  ////showComponentAsPopup || showArtifactAsModal
  const [showProfileAsModalOpen10, setShowProfileAsModalOpen10] = React.useState<boolean>(false);
    
 /////////////
   //another screen

  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_details7320a, setprn_details7320a}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_details5a762, setpayment_details5a762}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labelb5c98, setpayment_type_labelb5c98}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdownb558f, setpayment_type_dropdownb558f}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414Props, setsubscreen_groupc0414Props}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props}= useContext(TotalContext) as TotalContextProps;
  const {clear47c6a, setclear47c6a}= useContext(TotalContext) as TotalContextProps;
  const {make_payment3a4e8, setmake_payment3a4e8}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup4d9a0, setoverallgroup4d9a0}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup4d9a0Props, setoverallgroup4d9a0Props}= useContext(TotalContext) as TotalContextProps;
  const {itax_creditflow_screen_v1Props, setitax_creditflow_screen_v1Props}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910, setnew_prn_main_group21910}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910Props, setnew_prn_main_group21910Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['prn_details_group']  = prn_details_group00560,
      codeStates['setprn_details_group'] = setprn_details_group00560,
      codeStates['prn_datails_table']  = prn_datails_table2ad52,
      codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
      codeStates['subscreen_group']  = subscreen_groupc0414,
      codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['payment_type_cheque_group']  = payment_type_cheque_group239dd,
      codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['payment_type_dt_group']  = payment_type_dt_groupedf52,
      codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,
      codeStates['response']  = savedData.current;
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async (data?:any) => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",
          componentId: "4725fb7b4b994db2bb5cd1ad08100560",
          controlId: "8fea1a0248144f60a0780ab416b3a4e8",
          isTable: false,
          from:"ButtonMake Payment",
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
      setPaginationData((pre: any) => ({
      ...pre,
          page: +orchestrationData?.data?.action?.pagination?.page || 1,
          pageSize: +orchestrationData?.data?.action?.pagination?.count || 1000
    }))
    if(orchestrationData?.data?.rule?.nodes?.length > 0){
      setRulseData(orchestrationData?.data?.rule.nodes)
      let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj,...data});
      // schemaFlag =schemaFlag.output;
      let order:number = Number(schemaFlag.order);

      // Update grid position based on order number
      if (order && typeof order === 'number') {
        const position : any = getGridPositionFromOrder(order);
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
      if (id === "make_payment3a4e8") {
        handleClick();
      }
    });
  },[make_payment3a4e8?.refresh,currentToken])

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

  async function handleSavea4e8_1_1_1(){

    setValidateRefetch((pre: any) => ({ ...pre, value: !pre.value, init: pre.init + 1 }));
    await delay(1000);
     
    let currentValidate: any = null;
    await new Promise<void>((resolve) => {
      setValidate((prev: any) => {
        currentValidate = prev;
        return prev;
      });
      resolve();
    });

    // Check if any field is invalid using .some() with null safety
    const hasInvalidField = Object.values(currentValidate?.ITAX_Payment_Details_v1 || {}).some(
      (value) => value === 'invalid'
    );

    if (hasInvalidField) {
      toast('Please verify the data', 'danger');
      return;
    }
    try{
      let mainData:any=structuredClone(prn_details_group00560);
      let uf_initiatePf:any;
      let te_eventEmitterBody:te_eventEmitterDto={
        dpdKey: '',
        method: '',
        event: '',
        sourceId: '',
        key: '',
        ssKey: [],
        data: {},
        lock: {}
      }
      let tagetKey:string="CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|b0c626ac98074d91b0e3d80b3e6debfa"
      let uf_getPFDetails:any={
        key: "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|b0c626ac98074d91b0e3d80b3e6debfa"
      };
      let uf_ifo:any;
      let lockedKeysLength:number;
      let eventProperty :any = {
  "id": "8fea1a0248144f60a0780ab416b3a4e8",
  "type": "button",
  "name": "make_payment",
  "label": "make_payment",
  "sequence": 1,
  "children": [
    {
      "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1",
      "type": "eventNode",
      "name": "onClick",
      "label": "onClick",
      "sequence": "1.1",
      "children": [
        {
          "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1",
          "eventContext": "rise",
          "value": "",
          "type": "handlerNode",
          "name": "saveHandler",
          "label": "saveHandler",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1",
              "eventContext": "rise",
              "value": "",
              "type": "handlerNode",
              "name": "hasDataHandler",
              "label": "hasDataHandler",
              "sequence": "1.1.1.1",
              "children": [
                {
                  "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.1",
                  "type": "responseNode",
                  "name": "success",
                  "label": "success",
                  "sequence": "1.1.1.1.1",
                  "children": [
                    {
                      "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.1.1",
                      "eventContext": "rise",
                      "value": "",
                      "type": "handlerNode",
                      "name": "infoMsg",
                      "label": "infoMsg",
                      "sequence": "1.1.1.1.1.1",
                      "children": [
                        {
                          "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.1.1.1",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "refreshElement",
                          "label": "refreshElement",
                          "sequence": "1.1.1.1.1.1.1",
                          "children": [
                            {
                              "id": "9e5ed184b2fa46c18a79edc06f84d9a0.1.1.1.1.1.1.1.1",
                              "value": "",
                              "type": "screen",
                              "name": "ITAX_KEDTB_Main_Screen.v1|overallgroup",
                              "label": "ITAX_KEDTB_Main_Screen.v1|overallgroup",
                              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1|overallgroup",
                              "elementType": "group",
                              "groupType": "group",
                              "sequence": "1.1.1.1.1.1.1.1",
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
                  ]
                },
                {
                  "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.2",
                  "type": "responseNode",
                  "name": "fail",
                  "label": "fail",
                  "sequence": "1.1.1.1.2",
                  "children": [
                    {
                      "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.2.1",
                      "eventContext": "rise",
                      "value": "",
                      "type": "handlerNode",
                      "name": "copyFormData",
                      "label": "copyFormData",
                      "sequence": "1.1.1.1.2.1",
                      "children": [
                        {
                          "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.1.1.2.1.1",
                          "eventContext": "riseListen",
                          "value": "",
                          "type": "handlerNode",
                          "name": "showArtifactAsModal",
                          "label": "showArtifactAsModal",
                          "sequence": "1.1.1.1.2.1.1",
                          "children": [
                            {
                              "id": "45ed6af923a24f91872db8b0c289c8ea.1.1.1.1.2.1.1.1",
                              "value": "",
                              "type": "screen",
                              "name": "ITAX_CreditFlow_Screen.v1",
                              "label": "ITAX_CreditFlow_Screen.v1",
                              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1",
                              "elementType": "",
                              "groupType": "",
                              "sequence": "1.1.1.1.2.1.1.1",
                              "children": []
                            }
                          ],
                          "hlr": {
                            "params": [
                              {
                                "name": "width",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "height",
                                "_type": "text",
                                "value": "",
                                "enabled": true
                              },
                              {
                                "name": "needLabel",
                                "_type": "boolean",
                                "value": false,
                                "enabled": true
                              },
                              {
                                "name": "position",
                                "_type": "select",
                                "selectionList": [
                                  "center",
                                  "top",
                                  "bottom",
                                  "left",
                                  "right",
                                  "top-left",
                                  "top-right",
                                  "bottom-left",
                                  "bottom-right"
                                ],
                                "value": "center",
                                "enabled": true
                              },
                              {
                                "name": "showOverlay",
                                "_type": "boolean",
                                "value": true,
                                "enabled": true
                              },
                              {
                                "name": "Filter Conditions",
                                "_type": "array",
                                "_empty": true,
                                "items": [
                                  {
                                    "name": "DFD Key",
                                    "_type": "asyncSelection",
                                    "selectionList": [],
                                    "value": "",
                                    "enabled": true,
                                    "_payload": {
                                      "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1:",
                                      "nodeType": "searchParams"
                                    },
                                    "subSelection": {
                                      "name": "Select node Name",
                                      "_type": "array",
                                      "items": [
                                        {
                                          "name": "nodeName",
                                          "_type": "apiSelection",
                                          "_payload": {
                                            "key": "",
                                            "nodeType": "searchParams"
                                          },
                                          "selectionList": [],
                                          "value": "",
                                          "enabled": true,
                                          "subSelection": {
                                            "name": "filter",
                                            "_type": "array",
                                            "items": [
                                              {
                                                "filterParam": {
                                                  "name": "filterParam",
                                                  "_type": "objectSelection",
                                                  "selectionList": {},
                                                  "value": {},
                                                  "enabled": true
                                                },
                                                "filterValue": {
                                                  "name": "filterValue",
                                                  "_type": "comboBox",
                                                  "value": "",
                                                  "enabled": true
                                                }
                                              }
                                            ],
                                            "selectionList": [],
                                            "value": {},
                                            "enabled": true
                                          }
                                        }
                                      ],
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
                }
              ],
              "hlr": {
                "params": [
                  {
                    "name": "path",
                    "_label": "Path",
                    "_type": "text",
                    "value": "data",
                    "enabled": true
                  }
                ]
              }
            }
          ],
          "targetKey": [
            "CK:CT010:FNGK:AF:FNK:PF-PFD:CATK:I001:AFGK:ITAX:AFK:ITAX_PAYMENT_POC_PF_V2:AFVK:v1|b0c626ac98074d91b0e3d80b3e6debfa"
          ]
        },
        {
          "id": "8fea1a0248144f60a0780ab416b3a4e8.1.1.2",
          "eventContext": "riseListen",
          "value": "",
          "type": "handlerNode",
          "name": "copyFormData",
          "label": "copyFormData",
          "sequence": "1.1.2",
          "children": [
            {
              "id": "f1099583e1124434b28d0c4b0be21910.1.1.2.1",
              "type": "screen",
              "name": "ITAX_CreditFlow_Screen.v1|new_prn_main_group",
              "label": "ITAX_CreditFlow_Screen.v1|new_prn_main_group",
              "key": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1|new_prn_main_group",
              "elementType": "group",
              "groupType": "group",
              "sequence": "1.1.2.1",
              "children": []
            }
          ]
        }
      ]
    }
  ]
};
      let eventDetails : any = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1";
      sourceId+= "|"+"4725fb7b4b994db2bb5cd1ad08100560";
      let pathIds = SourceIdFilter(eventProperty,"1.1.1");
      let sourceIdNewPath : string = "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1"+"|"+"4725fb7b4b994db2bb5cd1ad08100560"+"|"+eventProperty.id;
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
              sourceId:sourceIdNewPath
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
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
    let eventData:any = {trs_event_process_status:uf_initiatePf?.data?.eventProperty?.source?.status,
      created_by:createdBy,
      modified_by:createdBy
    }
    let reworkedObject:any=nullFilter(prn_details_group00560);
    let reworkKeys:any[]=[];
      if(typeof reworkedObject === 'object' && reworkedObject !== null) {
      Object.keys(reworkedObject).map((item: any) => {
        if (
          typeof prn_details_group00560[item] === 'object' && 
          Array.isArray(prn_details_group00560[item]) && 
          prn_details_group00560[item].length > 0 && 
          typeof prn_details_group00560[item][0] !== "string"
        ) {
          const hasUrlProperty = prn_details_group00560[item][0]?.url !== undefined;
          const hasFileProperty = prn_details_group00560[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(prn_details_group00560[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      }); 
    } else if (Array.isArray(reworkedObject)) {
      Object.keys(prn_details_group00560).map((item: any) => {
        if (
          typeof prn_details_group00560[item] === 'object' && 
          Array.isArray(prn_details_group00560[item]) && 
          prn_details_group00560[item].length > 0 && 
          typeof prn_details_group00560[item][0] !== "string"
        ) {
          const hasUrlProperty = prn_details_group00560[item][0]?.url !== undefined;
          const hasFileProperty = prn_details_group00560[item][0]?.file !== undefined;
          const hasSelectedFlag = Object.keys(prn_details_group00560[item][0]).includes('_isSelected_');
          
          if (hasFileProperty || (hasUrlProperty && !hasSelectedFlag)) {
            reworkKeys.push(item);
          }
        }
      });
    }
      if(reworkKeys.length)
      {
        for(let i=0;i<reworkKeys.length;i++){
          let fileBody:any = prn_details_group00560[reworkKeys[i]].map((item:any) => item?.file)
          const formData = new FormData();
          fileBody.forEach((file:File) => {
            formData.append("file", file);
          });
          formData.append('context', reworkKeys[i]);
          formData.append("enableEncryption", fileBody[0]?.enableEncryption);
          formData.append("returnType", fileBody[0]?.returnType || 'string');
          if (encryptionFlagCont) {
            formData.append("dpdKey" ,encryptionDpd);
            formData.append("method" ,encryptionMethod);
          }
          if (fileBody[0]?.DbType == 'mongodb') {
          const res : any = await AxiosService.post("/UF/upload", formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              }
            });
            reworkedObject[reworkKeys[i]] = res.data.fileId;
          } else if (fileBody[0]?.DbType == 'dfs') {
            const basePath : string = process.env.NEXT_PUBLIC_DFS_PATH || "dfs-uploads";
            const bucketFolderame : string = process.env.NEXT_PUBLIC_DFS_BUCKETNAME || 'uploadfile';
            formData.append('bucketFolderame', bucketFolderame.toLowerCase());
            formData.append('folderPath', basePath);

            const res : any = await AxiosService.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/uploadimg`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                }
              }
            );
            reworkedObject[reworkKeys[i]] = res.data.imageUrl;
          }
        }
      }
      ///////  for pivottable data preparation
      Object.keys(reworkedObject).map((item:any)=>{
        if(typeof prn_details_group00560[item]=='object')
        {
          if( prn_details_group00560[item].length>0 &&Object.keys(prn_details_group00560[item][0]).includes('_isSelected_'))
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

      if ("childTables" in prn_details_group00560) {
        te_saveBody.childTables = prn_details_group00560.childTables
      }  

      if (uf_getPFDetails.key != undefined) {
        let formData:any={};
        let ifoResponse:any[]=[];
        if(Array.isArray(prn_details_group00560))
        {
          formData=lockedData?.data || prn_details_group00560 || {};
          for( const dataList of formData )
          {
            
            const uf_ifoBody:uf_ifoDto={
              formData:dataList,
              key:uf_getPFDetails.key,
              groupId:"4725fb7b4b994db2bb5cd1ad08100560",
              controlId:"8fea1a0248144f60a0780ab416b3a4e8"
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
            groupId:"4725fb7b4b994db2bb5cd1ad08100560",
            controlId:"8fea1a0248144f60a0780ab416b3a4e8"
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
        //saveHandler
        if(Array.isArray(reworkedObject))
        {
          te_saveBody.data = reworkedObject.map((item: any) => {
            return { ...nullFilter(item), ...eventData }
          })
        }
        else
        {
          te_saveBody.data = {...nullFilter(reworkedObject),...eventData};
        }
        te_saveBody.event = uf_initiatePf?.data?.eventProperty?.source?.status;
        te_saveBody.sourceId = uf_initiatePf?.data?.eventProperty?.sourceId;
        if(mainData?.upId)
        {
          te_saveBody['upId']= mainData.upId;
        }
        if(mainData?.upid)
        {
          te_saveBody['upId']= mainData.upid;
        }
        if(prn_details_group00560?.upId){
          te_saveBody['upId']= prn_details_group00560?.upId;
        }
        if(prn_details_group00560?.upid){
          te_saveBody['upId']= prn_details_group00560?.upid;
        }
        te_saveBody.key= te_saveBody?.key?.slice(0, te_saveBody?.key?.lastIndexOf(':')) + ':';

        if (prn_details_group00560Props.ssKey !== '' && prn_details_group00560Props.ssKey !== undefined) {
          te_saveBody["ssKey"] = prn_details_group00560Props.ssKey;
          
        }
      
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

            // hasDataHandler
            if(commonSepareteDataFromTheObject("data",te_save?.data)){

  
              //infoMsg
      toast('Data saved successfully', 'success')
    // refreshElement
    // for group
    setoverallgroup4d9a0Props((pre:any)=>({...pre,refresh:!pre?.refresh}));
    setLockedData({}); //Clears lockedData and resets it in subsequent screens.
    lockedData={}; //Clears lockedData; clicking the button again without a selection returns no value.
    setValidate({}); 
    setValidateRefetch({
      value:false,
      init:0
    });
              }else
              {

  
    // copyFormData
    if(te_save?.data){
      setprn_details_group00560((pre:any)=>({...pre,...te_save?.data}));
      savedData.current=te_save?.data;
    }
    // showArtifactAsModal
    let filterProps10:any =  [];
    let filterData10 = await getFilterProps(filterProps10,prn_details_group00560);
    setitax_creditflow_screen_v1Props([...filterData10 ]);
    setShowProfileAsModalOpen10(true);
              }
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
    try{  
      setIsProcessing(true);
        //onClick

    //saveHandler
    await handleSavea4e8_1_1_1();
  // copyFormData
    setnew_prn_main_group21910((pre:any)=>({...pre,...prn_details_group00560,...savedData.current}));
  // copyFormData
    setnew_prn_main_group21910((pre:any)=>({...pre,...prn_details_group00560,...savedData.current}));
      await handleCustomCode();
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }finally{
      setIsProcessing(false);
    }
  }
    async function handleConfirmOnClick(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    } 


    async function handleConfirmOnCancel(){
      try{
        //confirmMsg
      }catch(err){
        toast(err, 'danger');
      }
    }

 if (make_payment3a4e8?.isHidden) {
    return <></>
  }
 
  return (
    <div
      style={{gridColumn: `21 / 25`,gridRow: `152 / 164`, gap:``, height: `100%`, overflow: 'auto'}} 
      >
      <Modal 
        open={showProfileAsModalOpen10} 
        onClose={() => setShowProfileAsModalOpen10(false)}
        showOverlay = {true}
        position = {"center"}
        modalName = "itax_creditflow_screen"
        className='w-[] h-[] bg-gray-50 overflow-auto'
      >
        <PageItaxCreditflowScreenpage10/>
      </Modal>
        {showFlag && <Button 
          ref={buttonRef}
          className="   "
          onClick={handleClick}
          view='action'
          disabled= {make_payment3a4e8?.isDisabled ? true : false}
          pin='brick-brick'
          contentAlign={"center"}
        >
          {keyset("Make Payment")}
        </Button>}
      </div>
    
  )
}

export default Buttonmake_payment

