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




const DynamicJsonFormsystem_setup_dynamic_form = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
        "id": "a7fd4a32-e073-405e-b83f-4f5c4f06cac6",
        "name": "request",
        "position": {
          "x": 0,
          "y": 155
        }
      },
      {
        "type": "outputNode",
        "id": "3e738422-9a5e-4813-8e39-b9a2793a9237",
        "name": "response",
        "position": {
          "x": 650,
          "y": 140
        }
      },
      {
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "inputs": [
            {
              "id": "aff680c4-1fdd-479b-b98e-a464fc4a6585",
              "name": "Input",
              "field": "setup_code"
            }
          ],
          "outputs": [
            {
              "id": "0287b6f6-9b10-45c1-9f6d-7d2a39a52451",
              "name": "Output",
              "field": "output"
            }
          ],
          "rules": [
            {
              "_id": "ddd25160-f105-47e0-9355-5f34df8c4343",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"DIC_FIELDS_OUTBOUND\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:DIC_FIELDS_OUTBOUND:AFVK:v1:NDP\""
            },
            {
              "_id": "d74fe530-7d74-4652-b9c5-f4e7825bd14e",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"DMR_FIELDS_OUTBOUND\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:DMR_FIELDS_OUTBOUND:AFVK:v1:NDP\""
            },
            {
              "_id": "915cb119-889d-4ba4-a5f4-23b9017e7fee",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"DIC_FIELDS_INBOUND\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:DIC_FIELDS_INBOUND:AFVK:v1:NDP\""
            },
            {
              "_id": "988bf777-d080-4497-aa58-019f8597a419",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"CHECKER_LIMIT\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:CHECKER_LIMIT:AFVK:v1:NDP\""
            },
            {
              "_id": "afe4bdcb-c81b-4902-b719-6717b569b161",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"CIRCUIT_BREAKER\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:CIRCUIT_BREAKER:AFVK:v1:NDP\""
            },
            {
              "_id": "8010241c-6741-4850-8189-bf1190b24e80",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ENCRYPT_KEY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ENCRYPT_KEY:AFVK:v1:NDP\""
            },
            {
              "_id": "a88a1351-6b37-459f-abf3-8693331e031a",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ADVISE_MAIL\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ADVISE_MAIL:AFVK:v1:NDP\""
            },
            {
              "_id": "36cb3c7e-dbbd-4f1e-9017-1663836368b5",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"CCY_VALUE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:CCY_VALUE:AFVK:v1:NDP\""
            },
            {
              "_id": "7f941844-9a11-417e-8567-b09957496b4e",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"DEFAULT_NONFIN\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:DEFAULT_NONFIN:AFVK:v1:NDP\""
            },
            {
              "_id": "24bc44e8-495b-4998-b2fe-1f79a39af6e7",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"IB_ADVISE_MAIL\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:IB_ADVISE_MAIL:AFVK:v1:NDP\""
            },
            {
              "_id": "49e6987d-70e5-40c1-83fd-29e57cffcf8a",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_RETURN_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_RETURN_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "03503c69-a94e-46aa-8816-fd11c79f8cce",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER:AFVK:v1:NDP\""
            },
            {
              "_id": "f9ce19b3-2e66-49f4-a40d-039e44a3633a",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_ANSWERS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_ANSWERS:AFVK:v1:NDP\""
            },
            {
              "_id": "82c055cb-04a7-4170-8032-4f491dbbb746",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_ANSWERS_79\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_ANSWERS_79:AFVK:v1:NDP\""
            },
            {
              "_id": "6424c6af-0732-4fd7-986c-62cdf9efbe4e",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_CNCL\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_CNCL:AFVK:v1:NDP\""
            },
            {
              "_id": "5eb023bb-dd0c-41e9-8734-114a948d5e7b",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_FFM\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_FFM:AFVK:v1:NDP\""
            },
            {
              "_id": "51416268-a6d2-4924-b124-eb1fc467a349",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_QUERIES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_QUERIES:AFVK:v1:NDP\""
            },
            {
              "_id": "7f639205-6da1-4163-a4e8-95df99e4ed17",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MASTER_QUERIES_79\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MASTER_QUERIES_79:AFVK:v1:NDP\""
            },
            {
              "_id": "48d2cf8f-b486-4b8d-8e61-4f3ce406db53",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"TI_MSG_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:TI_MSG_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "48065269-217f-4832-8348-b1b0941e58d5",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"UNIVERSAL_VARIABLE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:UNIVERSAL_VARIABLE:AFVK:v1:NDP\""
            },
            {
              "_id": "84e75d9b-40ca-4b9c-b849-db9196a8e224",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"TI_MQ_DETAILS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:TI_MQ_DETAILS:AFVK:v1:NDP\""
            },
            {
              "_id": "78004e98-ff3f-4603-87f9-d7700be86080",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"INBOUND_CUTOFF\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:INBOUND_CUTOFF:AFVK:v1:NDP\""
            },
            {
              "_id": "3616e207-0679-4be6-9529-c34b028dc1f3",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"IB_SPL_RATE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:IB_SPL_RATE:AFVK:v1:NDP\""
            },
            {
              "_id": "fc9cefec-4dfa-4228-b68e-eff388017964",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_SWIFT_COMBO_BINDING\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_SWIFT_COMBO_BINDING:AFVK:v1:NDP\""
            },
            {
              "_id": "d691db0b-f5a2-4d63-9eba-ebd7f55a0462",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"NOSTRO_SELECTION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:NOSTRO_SELECTION:AFVK:v1:NDP\""
            },
            {
              "_id": "3cc711dc-5fbf-473c-bdfe-bb1e40168ad0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_VALIDATION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_VALIDATION:AFVK:v1:NDP\""
            },
            {
              "_id": "6ca6e26b-746a-4168-b538-93cab7c09d73",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"Channel\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:Channel:AFVK:v1:NDP\""
            },
            {
              "_id": "538a57e7-4c5f-45df-a0bc-cb9305c64964",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"DETAIL_OF_CHARGES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:DETAIL_OF_CHARGES:AFVK:v1:NDP\""
            },
            {
              "_id": "57333f82-1581-4b2a-b7e1-618243416bb3",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"MESSAGE_TYPE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:MESSAGE_TYPE:AFVK:v1:NDP\""
            },
            {
              "_id": "06155868-2090-42d7-b7a3-a0282691b0d2",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_MESSAGE_CREATION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_MESSAGE_CREATION:AFVK:v1:NDP\""
            },
            {
              "_id": "d6f2e3ec-da28-4475-836f-66003b0d4eca",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_USER\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_USER:AFVK:v1:NDP\""
            },
            {
              "_id": "2d1c6aa7-b8d1-4dbc-998b-05ea31aa4a8d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"RETRY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:RETRY:AFVK:v1:NDP\""
            },
            {
              "_id": "8f0c0104-7c14-42a1-9a96-0549d6076010",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ACK_SOURCE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ACK_SOURCE:AFVK:v1:NDP\""
            },
            {
              "_id": "110728ab-4561-482d-b3c4-75dd9eae96d2",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"creditor_bic\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:creditor_bic:AFVK:v1:NDP\""
            },
            {
              "_id": "9c6a2a08-d9e7-4d02-b2cb-3cee91f5b053",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"UAB_Branch_Code\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:UAB_Branch_Code:AFVK:v1:NDP\""
            },
            {
              "_id": "5d91889f-9f94-418d-80fd-b2ee7df4f329",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"Uab_Bank_Bic\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:Uab_Bank_Bic:AFVK:v1:NDP\""
            },
            {
              "_id": "1dbb9965-4ee8-4967-8925-fa4fa0f19d4f",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FPM_OUT_MQ_DETAILS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FPM_OUT_MQ_DETAILS:AFVK:v1:NDP\""
            },
            {
              "_id": "282e398d-89a3-4e07-9c76-85d24bdfd235",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FPM_IN_MQ_DETAILS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FPM_IN_MQ_DETAILS:AFVK:v1:NDP\""
            },
            {
              "_id": "276488af-6b56-4904-b937-85f72a707a40",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "ba967000-0559-4757-aa39-16ecb0fd72f0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ACK_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ACK_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "de36a0da-414e-4d3c-a9b3-d7e7c2f76c9d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ADVISE_EMAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ADVISE_EMAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "ad3176d6-9db7-4cab-93d7-d24def23f0b6",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"ROUTING\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:ROUTING:AFVK:v1:NDP\""
            },
            {
              "_id": "9a0dba7e-32ec-4eaf-8a5e-cb8f1933b140",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_CHARGE_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_CHARGE_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "bdf57b23-5de2-4547-a996-221f0e6ee2c0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_CHN_NOTIFY_EXCEPTION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_CHN_NOTIFY_EXCEPTION:AFVK:v1:NDP\""
            },
            {
              "_id": "dbbc5088-9875-4135-b5e9-dfdf0465778d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VAT_SETUP\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VAT_SETUP:AFVK:v1:NDP\""
            },
            {
              "_id": "d7ec81c2-41ad-49bc-9438-42aa43637788",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"MT191_CHARGE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:MT191_CHARGE:AFVK:v1:NDP\""
            },
            {
              "_id": "db450f38-0c48-40c4-b54b-f565e6794082",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_BU_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_BU_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "6ec38ec3-726a-4343-9933-4a71adc76749",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"MANUAL_REJECT_NOTIFICATION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:MANUAL_REJECT_NOTIFICATION:AFVK:v1:NDP\""
            },
            {
              "_id": "c84c9ab2-953c-44a1-ad9d-8197350c2a3f",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"GET_TRAN_STATUS_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:GET_TRAN_STATUS_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "2e1320cf-8aa3-499b-981e-5eccce508e06",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"GET_CUST_DET_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:GET_CUST_DET_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "c9cbfcab-6aa8-40e1-892f-8f82ddf76c96",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U32U_POST_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U32U_POST_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "0895b735-61c6-432c-9492-1f59a2187363",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U29U_POST_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U29U_POST_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "4c1b42b0-a497-4148-83d4-11bdfab5911c",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"IPP_RATE_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:IPP_RATE_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "25cf79f9-889a-4b4b-8389-1c379eeec246",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FX_RATE_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FX_RATE_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "23b09ca9-2d78-4e78-ba70-9859050a0804",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SIRON_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SIRON_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "1b5d86b3-bc5f-4ecc-9419-94742f33ee30",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U92U_POST_FAIL_NOTIFY\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U92U_POST_FAIL_NOTIFY:AFVK:v1:NDP\""
            },
            {
              "_id": "4105e62d-9d04-423f-9355-535ea62fef62",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U92U_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U92U_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "63c41c61-771e-468a-b9ed-83f67a04f12d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"GETTRANSTATUS_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:GETTRANSTATUS_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "72d849af-fae0-4382-b8f8-4dc15e8a0ce7",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SIRON_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SIRON_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "ab7c0dc0-f622-40b6-9f2f-14828a8370eb",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"GETCUSTDET_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:GETCUSTDET_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "1f4d17ee-76e4-4550-94d8-87358866180c",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U32U_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U32U_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "223d5d63-ebf7-40e7-bf8b-977393ea7b1b",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"TRAN_ENQ_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:TRAN_ENQ_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "6e679e46-8304-4476-bcf4-4856dffe0084",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"U29U_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:U29U_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "ea285a11-f99b-4499-b97e-34bf9f57c3b0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"IPPRATE_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:IPPRATE_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "041dee2b-66a9-416d-9628-545af52442b9",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FXRATE_ERROR_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FXRATE_ERROR_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "95a27cfc-96f3-413d-835f-3475d0564338",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_BAL_ENQ_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_BAL_ENQ_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "62478d3b-67fd-42aa-888e-69309f2b0c29",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_FXRATE_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_FXRATE_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "7f810164-a315-47d0-8a9e-8aea7024710e",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "db51d130-0cd9-4b5f-8b5c-b41be5e08b19",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_GET_TRAN_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_GET_TRAN_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "43c0bc9e-b471-4256-bd12-9e56de980f29",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "d7952a25-6bb0-4823-a316-aca711590388",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_BEN01_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFKVPH_U92U_BEN01_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "b23c5a59-6565-4c0c-908f-d0118037b4d4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_BEN02_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_BEN02_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "4e1663ec-6abd-47f0-99da-be9cb8d2eee3",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U29U_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U29U_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "e0b34e28-3153-404f-bbc2-b0ea79e2cb5f",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_BEN11_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_BEN11_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "7aceac4a-f84d-46ec-96fc-4403f081e350",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_TRAN_ENQ_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_TRAN_ENQ_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "3627e38b-421a-430c-b327-9229c60f8124",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U29U_ENQ_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U29U_ENQ_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "c092712c-9d3c-47a2-853c-fc355e93c88a",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_OR_ENQ_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_OR_ENQ_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "b28ced89-d52c-4413-9ffa-2ac727c696f4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U29U_OR_ENQ_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U29U_OR_ENQ_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "32c1e1ab-9f3e-48da-83a0-3dc51b1c8e73",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U32U_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U32U_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "f34bc2bc-9555-48d3-9b49-f8a317ba507d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U32U_CORRES_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U32U_CORRES_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "dda7a1c0-3d54-4dec-86e7-9cd9030bd2b1",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_CHARGE_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_CHARGE_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "14b96e9a-924b-4311-b951-6df2cf083c25",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_VAT_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_VAT_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "35c9a53d-dde7-4889-a137-4e1eca34252d",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_STATUS_UPDATE_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_STATUS_UPDATE_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "b8e864a9-ca6d-4b5f-bcd5-7ea7149fd841",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_CHARGE_REV_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_CHARGE_REV_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "5c28a409-6145-4566-b977-b9849f48e221",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_VAT_REV_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_VAT_REV_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "c6b72374-603e-41e9-9207-8944a581b53f",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_IPPRATE_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_IPPRATE_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "b6fd3cc6-e3e1-4e16-a202-9236840627d7",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_OR_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_OR_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "3bb3ff41-8f03-43ab-92af-11fb6d904fa4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U29U_OR_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U29U_OR_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "35ab2c62-48b9-41b9-a36a-5b62147c91c9",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_BEN_CHARGE_REV_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_BEN_CHARGE_REV_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "8d36f070-3c79-4924-8ec4-a2a6376e15cf",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_U92U_BEN_VAT_REV_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_U92U_BEN_VAT_REV_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "cf5eb264-6d0c-451b-a2c8-11d31fa8f1e0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_KWD\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_KWD:AFVK:v1:NDP\""
            },
            {
              "_id": "ae27fe9f-4223-4cc1-a5e3-c655100b2a1e",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"SWIFT_TRACKER_MSG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:SWIFT_TRACKER_MSG:AFVK:v1:NDP\""
            },
            {
              "_id": "cc01f566-78de-4532-9cfa-61166080e4d6",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"VPH_MANUAL_CHANNEL\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:VPH_MANUAL_CHANNEL:AFVK:v1:NDP\""
            },
            {
              "_id": "db5c47fb-bfcc-4738-81ff-f6883f56fce9",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CAMT029_RETURN_ERROR_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_CAMT029_RETURN_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "e491551f-ba8d-4713-a79c-69a6efa9f532",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CAMT029_CNCL_ERROR_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_CAMT029_CNCL_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "5c14f63f-4cf5-430c-a754-2d8b9de65b4f",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_S001\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_S001_DST:AFVK:v1:NDP\""
            },
            {
              "_id": "96604a2c-7537-498d-aeb7-22663c9ab3e6",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_S002\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_S002_DST:AFVK:v1:NDP\""
            },
            {
              "_id": "96caab6c-dbf3-4c22-8c41-83fd9fd688f4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CAMT029_RJCR_ERROR_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_CAMT029_RJCR_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "60fb9e78-5df6-44ea-8aac-dea10797add4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_ERROR_CODES\"\n",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "4c28a34b-6176-42bd-8895-c5a28640fbb8",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_PAIN014_ERROR_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_PAIN014_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "d58b60e4-958f-45a5-b8cc-6ce11b200751",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RECEIPT_ACK_ADMI007\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RECEIPT_ACK_ADMI007:AFVK:v1:NDP\""
            },
            {
              "_id": "95071cb2-19dc-434f-a4e2-b39c1641ee00",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RETURN_CODE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RETURN_CODE:AFVK:v1:NDP\""
            },
            {
              "_id": "068c14ee-f30f-427b-a188-164b644c59d7",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RETURN_REASON_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RETURN_REASON_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "57487069-e999-4472-a769-940cb834ee87",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RFPC_RECEIPT_ACK_ADMI007\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RFPC_RECEIPT_ACK_ADMI007:AFVK:v1:NDP\"\n "
            },
            {
              "_id": "47a60f87-3e51-4b0f-909a-fbb928651097",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RTN_ERROR_CODES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RTN_ERROR_CODES:AFVK:v1:NDP\""
            },
            {
              "_id": "3a99e22d-75d8-499d-8ca4-54a21c3de6c4",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CAMT029_STATUS_CONFIG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_CAMT029_STATUS_CONFIG:AFVK:v1:NDP\""
            },
            {
              "_id": "8b3570c6-f6fa-4b7e-b3e6-0c9df4b40ca0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CAMT054_INDICATOR\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_VPH_POSTING_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "9fba22d2-c2d5-44c2-b11c-117a97b01f74",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_CB_CONNECTION\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_CB_CONNECTION:AFVK:v1:NDP\""
            },
            {
              "_id": "ea2e0889-e782-4a7c-9ec5-3cd7c2d4f560",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_Channel\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_Channel:AFVK:v1:NDP\""
            },
            {
              "_id": "8b8cfbf1-c36d-4324-847c-1553095e2170",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_DETAIL_OF_CHARGES\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_DETAIL_OF_CHARGES:AFVK:v1:NDP\""
            },
            {
              "_id": "8e5e55ce-76f7-4a57-8462-fefcc9720eaf",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_FNIPP_BROADCAST\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_FNIPP_BROADCAST:AFVK:v1:NDP\""
            },
            {
              "_id": "cb8a0e66-ca04-4957-86a7-f8a957156b01",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_FNIPP_BROADCAST_MSG\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_FNIPP_BROADCAST_MSG:AFVK:v1:NDP\""
            },
            {
              "_id": "4f24657c-ff06-4221-8fa3-4e26753a9db0",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_FNIPP_MESSAGETYPE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_FNIPP_MESSAGETYPE:AFVK:v1:NDP\""
            },
            {
              "_id": "8f089506-2bf3-46ae-83b9-3f7bafdc392b",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_MESSAGE_TYPE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_MESSAGE_TYPE:AFVK:v1:NDP\""
            },
            {
              "_id": "20366ebc-9d42-4770-a877-b40bc30f20e6",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_PACS_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_PACS_PARAMS:AFVK:v1:NDP\""
            },
            {
              "_id": "0082944b-0953-45b7-959f-b2fea68442bb",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_PACS028_CONFIG_TIME\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_PACS028_CONFIG_TIME:AFVK:v1:NDP\""
            },
            {
              "_id": "8210a147-e259-4d0b-be3e-fd4c6504bf8b",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_REPORTING_REQUEST\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_REPORTING_REQUEST:AFVK:v1:NDP\""
            },
            {
              "_id": "7b30c070-2225-40da-9f1b-da89bf2a2c64",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_RFP\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_RFPC_RECEIPT_ACK_ADMI007:AFVK:v1:NDP\""
            },
            {
              "_id": "a1a665c8-efff-4850-abab-f15395719b91",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_UNIVERSAL_VARIABLE\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_UNIVERSAL_VARIABLE:AFVK:v1:NDP\""
            },
            {
              "_id": "8f1ea2e7-814f-4e65-b2e0-c4034e8cb0ea",
              "aff680c4-1fdd-479b-b98e-a464fc4a6585": "\"FN_USXYZ_VPH_POSTING_PARAMS\"",
              "0287b6f6-9b10-45c1-9f6d-7d2a39a52451": "\"CK:CT005:FNGK:AF:FNK:DF-DST:CATK:V001:AFGK:VGPH001:AFK:FN_USXYZ_VPH_POSTING_PARAMS:AFVK:v1:NDP\""
            }
          ]
        },
        "id": "bb323227-effa-4025-b382-6ad668c81d9d",
        "name": "decisionTable1",
        "position": {
          "x": 340,
          "y": 240
        }
      }
    ],
    "edges": [
      {
        "id": "98bc6632-7550-474e-a187-56067bbe9a3f",
        "sourceId": "a7fd4a32-e073-405e-b83f-4f5c4f06cac6",
        "type": "edge",
        "targetId": "bb323227-effa-4025-b382-6ad668c81d9d"
      },
      {
        "id": "402ec48b-65de-4959-8c65-8c070fc8d5c6",
        "sourceId": "bb323227-effa-4025-b382-6ad668c81d9d",
        "type": "edge",
        "targetId": "3e738422-9a5e-4813-8e39-b9a2793a9237"
      }
    ],
    "contentType": "application/vnd.gorules.decision"
  },
  "rule": {},
  "events": {
    "NDS": [
      {
        "id": "36ae85e92b434573905e79f79f1f3526",
        "type": "controlNode",
        "position": {
          "x": -69.66023896720432,
          "y": -43.05281534990429
        },
        "data": {
          "nodeId": "36ae85e92b434573905e79f79f1f3526",
          "nodeName": "system_setup_dynamic_form",
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
          "label": "system_setup_dynamic_form",
          "children": [
            "36ae85e92b434573905e79f79f1f3526.1.1"
          ],
          "sequence": 1,
          "nodeProperty": {}
        },
        "width": 68,
        "height": 34,
        "positionAbsolute": {
          "x": -69.62722489366583,
          "y": -43.247956623381405
        }
      },
      {
        "id": "36ae85e92b434573905e79f79f1f3526.1.1",
        "type": "eventNode",
        "position": {
          "x": 16.098912843451032,
          "y": -39.146066086535605
        },
        "data": {
          "label": "onSubmit",
          "sequence": "1.1",
          "parent": "36ae85e92b434573905e79f79f1f3526",
          "children": [
            "36ae85e92b434573905e79f79f1f3526.1.1.1"
          ],
          "nodeProperty": {}
        },
        "className": "_node_1qffi_1",
        "width": 100,
        "height": 100,
        "positionAbsolute": {
          "x": 15.986478318094171,
          "y": -38.921444438881466
        },
        "selected": true,
        "dragging": false
      },
      {
        "id": "36ae85e92b434573905e79f79f1f3526.1.1.1",
        "type": "handlerNode",
        "eventContext": "riseListen",
        "label": "getFormData",
        "position": {
          "x": -21.6043803602943,
          "y": 64.04379921880077
        },
        "data": {
          "label": "getFormData",
          "eventContext": "riseListen",
          "parentId": "36ae85e92b434573905e79f79f1f3526.1.1",
          "value": "",
          "sequence": "1.1.1",
          "children": [
            "723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1"
          ]
        },
        "width": 54,
        "height": 45,
        "positionAbsolute": {
          "x": -21.553036573384546,
          "y": 64.13810365961808
        }
      },
      {
        "id": "723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1",
        "type": "controlNode",
        "position": {
          "x": 72.48783271919913,
          "y": 19.907877917276053
        },
        "name": "Master_System_Setup|system_setup_group|setup_code",
        "elementType": "textinput",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1|setup_code",
        "data": {
          "id": "723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1",
          "sequence": "1.1.1.1",
          "parentId": "36ae85e92b434573905e79f79f1f3526.1.1.1",
          "nodeName": "setup_code",
          "name": "setup_code",
          "nodeId": "43e7bdcd7900488b8a0584481a488cd6",
          "elementType": "textinput",
          "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1|setup_code",
          "nodeType": "textinput",
          "children": []
        },
        "width": 55,
        "height": 25,
        "positionAbsolute": {
          "x": 72.54225653310905,
          "y": 19.816848115844945
        }
      }
    ],
    "NDE": [
      {
        "id": "36ae85e92b434573905e79f79f1f3526->36ae85e92b434573905e79f79f1f3526.1.1",
        "source": "36ae85e92b434573905e79f79f1f3526",
        "type": "straight",
        "target": "36ae85e92b434573905e79f79f1f3526.1.1"
      },
      {
        "id": "36ae85e92b434573905e79f79f1f3526.1.1.1->723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1",
        "source": "36ae85e92b434573905e79f79f1f3526.1.1.1",
        "type": "straight",
        "target": "723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1"
      },
      {
        "id": "36ae85e92b434573905e79f79f1f3526.1.1->36ae85e92b434573905e79f79f1f3526.1.1.1",
        "source": "36ae85e92b434573905e79f79f1f3526.1.1",
        "type": "straight",
        "target": "36ae85e92b434573905e79f79f1f3526.1.1.1"
      }
    ],
    "NDP": {},
    "eventSummary": {
      "id": "36ae85e92b434573905e79f79f1f3526",
      "type": "dynamicjsonform",
      "name": "system_setup_dynamic_form",
      "sequence": 1,
      "children": [
        {
          "id": "36ae85e92b434573905e79f79f1f3526.1.1",
          "type": "eventNode",
          "name": "onSubmit",
          "sequence": "1.1",
          "children": [
            {
              "id": "36ae85e92b434573905e79f79f1f3526.1.1.1",
              "eventContext": "riseListen",
              "value": "",
              "type": "handlerNode",
              "name": "getFormData",
              "sequence": "1.1.1",
              "children": [
                {
                  "id": "723ad64155fe45adba8c526f1ce2af15|43e7bdcd7900488b8a0584481a488cd6.1.1.1.1",
                  "type": "textinput",
                  "name": "Master_System_Setup|system_setup_group|setup_code",
                  "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1|setup_code",
                  "elementType": "textinput",
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
  "mapper": [
    {
      "sourceKey": [
        "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup_DFD:AFVK:v1|ea8268fea07e4f9e991a1536c35c8463|properties.setup_value"
      ],
      "targetKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1|723ad64155fe45adba8c526f1ce2af15|36ae85e92b434573905e79f79f1f3526"
    }
  ],
  "schemaData": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
  const [goruleData,setGoruleData]=useState<any>({})
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'setup_value',type:"text"})
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
  const {system_setup_group2af15, setsystem_setup_group2af15}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_group2af15Props, setsystem_setup_group2af15Props}= useContext(TotalContext) as TotalContextProps;
  const {product_code523b7, setproduct_code523b7}= useContext(TotalContext) as TotalContextProps;
  const {setup_code88cd6, setsetup_code88cd6}= useContext(TotalContext) as TotalContextProps;
  const {interface_productd9133, setinterface_productd9133}= useContext(TotalContext) as TotalContextProps;
  const {category80c2f, setcategory80c2f}= useContext(TotalContext) as TotalContextProps;
  const {sub_categoryd81c5, setsub_categoryd81c5}= useContext(TotalContext) as TotalContextProps;
  const {purpose3b7f4, setpurpose3b7f4}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_dynamic_formf3526, setsystem_setup_dynamic_formf3526}= useContext(TotalContext) as TotalContextProps;
  const {cancelad32e, setcancelad32e}= useContext(TotalContext) as TotalContextProps;
  const {save3a1b8, setsave3a1b8}= useContext(TotalContext) as TotalContextProps;
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
      setup_code:system_setup_group2af15?.setup_code,

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
    setValidate((pre:any)=>({...pre,setup_value:{}}))
    if(dynamicStateandType.type=="number"){
    setsystem_setup_group2af15((prev: any) => ({ ...prev, setup_value: +values }))
    }
    else{
    setsystem_setup_group2af15((prev: any) => ({ ...prev, setup_value: values }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['system_setup_group']  = system_setup_group2af15,
      codeStates['setsystem_setup_group'] = setsystem_setup_group2af15,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1",
          componentId: "723ad64155fe45adba8c526f1ce2af15",
          controlId: "36ae85e92b434573905e79f79f1f3526",
          isTable: false,
          from:"TextInputsystem_setup_dynamic_form",
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
        let type:any={name:'setup_value',type:'text'}
        type={
          name:'setup_value',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_value.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_value.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.setup_value.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'setup_value',type:'text'}
        type={
          name:'setup_value',
          type: orchestrationData?.data?.schemaData[0].schema.properties.setup_value.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.setup_value.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.setup_value.type
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

          //for controller element
    useEffect(() => {
      fetchSchema(goruleData,{setup_code:system_setup_group2af15?.setup_code});
    }, [system_setup_group2af15?.setup_code])

  if (system_setup_dynamic_formf3526?.isHidden) {
    return <></>
  }
   if (isLoading) {
    return  <div style={{gridColumn: `1 / 25`,gridRow: `47 / 120`, gap:``, height: `100%`, overflow: 'auto'}} >
      Loading schema...</div>
  }

  if (!renderData) {
    return null;
  }
  return (   
    <div  
      style={{gridColumn: `1 / 25`,gridRow: `47 / 120`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <DynamicJsonForm
        metadata={renderData}
        onChange={handleChange}
        values={system_setup_group2af15?.setup_value}
        contentAlign={"left"}
      />
    </div> 
  )
}

export default DynamicJsonFormsystem_setup_dynamic_form
