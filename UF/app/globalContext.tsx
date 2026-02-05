


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  currentToken: any 
  setCurrentToken: React.Dispatch<React.SetStateAction<any>>
  matchedAccessProfileData: any;
  setMatchedAccessProfileData: React.Dispatch<React.SetStateAction<any>>
  transaction_groupcc5ac: any 
  settransaction_groupcc5ac: React.Dispatch<React.SetStateAction<any>>
  transaction_groupcc5acProps: any 
  settransaction_groupcc5acProps: React.Dispatch<React.SetStateAction<any>>
  tab_group05125: any 
  settab_group05125: React.Dispatch<React.SetStateAction<any>>
  tab_group05125Props: any 
  settab_group05125Props: React.Dispatch<React.SetStateAction<any>>
  view_all_tab71a07: any 
  setview_all_tab71a07: React.Dispatch<React.SetStateAction<any>>
  view_all_tab71a07Props: any 
  setview_all_tab71a07Props: React.Dispatch<React.SetStateAction<any>>
  view_all_table648c4: any 
  setview_all_table648c4: React.Dispatch<React.SetStateAction<any>>
  view_all_table648c4Props: any 
  setview_all_table648c4Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab11090: any 
  setfailure_queue_tab11090: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab11090Props: any 
  setfailure_queue_tab11090Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_table449a9: any 
  setfailure_queue_table449a9: React.Dispatch<React.SetStateAction<any>>
  failure_queue_table449a9Props: any 
  setfailure_queue_table449a9Props: React.Dispatch<React.SetStateAction<any>>
  payment_group1c8a5: any 
  setpayment_group1c8a5: React.Dispatch<React.SetStateAction<any>>
  payment_group1c8a5Props: any 
  setpayment_group1c8a5Props: React.Dispatch<React.SetStateAction<any>>
  searchgroupc4337: any 
  setsearchgroupc4337: React.Dispatch<React.SetStateAction<any>>
  searchgroupc4337Props: any 
  setsearchgroupc4337Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey_groupbe7ae: any 
  settran_journey_groupbe7ae: React.Dispatch<React.SetStateAction<any>>
  tran_journey_groupbe7aeProps: any 
  settran_journey_groupbe7aeProps: React.Dispatch<React.SetStateAction<any>>
  tran_journey_dtl_group6545a: any 
  settran_journey_dtl_group6545a: React.Dispatch<React.SetStateAction<any>>
  tran_journey_dtl_group6545aProps: any 
  settran_journey_dtl_group6545aProps: React.Dispatch<React.SetStateAction<any>>
  system_setup_group2af15: any 
  setsystem_setup_group2af15: React.Dispatch<React.SetStateAction<any>>
  system_setup_group2af15Props: any 
  setsystem_setup_group2af15Props: React.Dispatch<React.SetStateAction<any>>
  cdc_group2e1e4: any 
  setcdc_group2e1e4: React.Dispatch<React.SetStateAction<any>>
  cdc_group2e1e4Props: any 
  setcdc_group2e1e4Props: React.Dispatch<React.SetStateAction<any>>
  details_group46bbe: any 
  setdetails_group46bbe: React.Dispatch<React.SetStateAction<any>>
  details_group46bbeProps: any 
  setdetails_group46bbeProps: React.Dispatch<React.SetStateAction<any>>
  table_group05951: any 
  settable_group05951: React.Dispatch<React.SetStateAction<any>>
  table_group05951Props: any 
  settable_group05951Props: React.Dispatch<React.SetStateAction<any>>
  cdc_table8e54d: any 
  setcdc_table8e54d: React.Dispatch<React.SetStateAction<any>>
  cdc_table8e54dProps: any 
  setcdc_table8e54dProps: React.Dispatch<React.SetStateAction<any>>
  view_all_logs50c05: any,
  setview_all_logs50c05:React.Dispatch<React.SetStateAction<any>>
  view_all_logs50c05Props: any 
  setview_all_logs50c05Props: React.Dispatch<React.SetStateAction<any>>
  view_all_button56968: any,
  setview_all_button56968:React.Dispatch<React.SetStateAction<any>>
  view_all_button56968Props: any 
  setview_all_button56968Props: React.Dispatch<React.SetStateAction<any>>
  product_code27e26: any,
  setproduct_code27e26:React.Dispatch<React.SetStateAction<any>>
  product_code27e26Props: any 
  setproduct_code27e26Props: React.Dispatch<React.SetStateAction<any>>
  uuidb02c5: any,
  setuuidb02c5:React.Dispatch<React.SetStateAction<any>>
  uuidb02c5Props: any 
  setuuidb02c5Props: React.Dispatch<React.SetStateAction<any>>
  channel_name1516d: any,
  setchannel_name1516d:React.Dispatch<React.SetStateAction<any>>
  channel_name1516dProps: any 
  setchannel_name1516dProps: React.Dispatch<React.SetStateAction<any>>
  settlement_date32e82: any,
  setsettlement_date32e82:React.Dispatch<React.SetStateAction<any>>
  settlement_date32e82Props: any 
  setsettlement_date32e82Props: React.Dispatch<React.SetStateAction<any>>
  dr_account5a90a: any,
  setdr_account5a90a:React.Dispatch<React.SetStateAction<any>>
  dr_account5a90aProps: any 
  setdr_account5a90aProps: React.Dispatch<React.SetStateAction<any>>
  dr_amount8f415: any,
  setdr_amount8f415:React.Dispatch<React.SetStateAction<any>>
  dr_amount8f415Props: any 
  setdr_amount8f415Props: React.Dispatch<React.SetStateAction<any>>
  dr_currencycb231: any,
  setdr_currencycb231:React.Dispatch<React.SetStateAction<any>>
  dr_currencycb231Props: any 
  setdr_currencycb231Props: React.Dispatch<React.SetStateAction<any>>
  cr_accountf334f: any,
  setcr_accountf334f:React.Dispatch<React.SetStateAction<any>>
  cr_accountf334fProps: any 
  setcr_accountf334fProps: React.Dispatch<React.SetStateAction<any>>
  remittance_info30960: any,
  setremittance_info30960:React.Dispatch<React.SetStateAction<any>>
  remittance_info30960Props: any 
  setremittance_info30960Props: React.Dispatch<React.SetStateAction<any>>
  charge_type3dd6d: any,
  setcharge_type3dd6d:React.Dispatch<React.SetStateAction<any>>
  charge_type3dd6dProps: any 
  setcharge_type3dd6dProps: React.Dispatch<React.SetStateAction<any>>
  logs_failure_queue7e78b: any,
  setlogs_failure_queue7e78b:React.Dispatch<React.SetStateAction<any>>
  logs_failure_queue7e78bProps: any 
  setlogs_failure_queue7e78bProps: React.Dispatch<React.SetStateAction<any>>
  view_failure_queue04cba: any,
  setview_failure_queue04cba:React.Dispatch<React.SetStateAction<any>>
  view_failure_queue04cbaProps: any 
  setview_failure_queue04cbaProps: React.Dispatch<React.SetStateAction<any>>
  product_codea1bf6: any,
  setproduct_codea1bf6:React.Dispatch<React.SetStateAction<any>>
  product_codea1bf6Props: any 
  setproduct_codea1bf6Props: React.Dispatch<React.SetStateAction<any>>
  uuidd1032: any,
  setuuidd1032:React.Dispatch<React.SetStateAction<any>>
  uuidd1032Props: any 
  setuuidd1032Props: React.Dispatch<React.SetStateAction<any>>
  channel_name0e1ca: any,
  setchannel_name0e1ca:React.Dispatch<React.SetStateAction<any>>
  channel_name0e1caProps: any 
  setchannel_name0e1caProps: React.Dispatch<React.SetStateAction<any>>
  settlement_date202a2: any,
  setsettlement_date202a2:React.Dispatch<React.SetStateAction<any>>
  settlement_date202a2Props: any 
  setsettlement_date202a2Props: React.Dispatch<React.SetStateAction<any>>
  dr_accountf4175: any,
  setdr_accountf4175:React.Dispatch<React.SetStateAction<any>>
  dr_accountf4175Props: any 
  setdr_accountf4175Props: React.Dispatch<React.SetStateAction<any>>
  dr_amountaa5df: any,
  setdr_amountaa5df:React.Dispatch<React.SetStateAction<any>>
  dr_amountaa5dfProps: any 
  setdr_amountaa5dfProps: React.Dispatch<React.SetStateAction<any>>
  dr_currency3c79d: any,
  setdr_currency3c79d:React.Dispatch<React.SetStateAction<any>>
  dr_currency3c79dProps: any 
  setdr_currency3c79dProps: React.Dispatch<React.SetStateAction<any>>
  cr_account6ee89: any,
  setcr_account6ee89:React.Dispatch<React.SetStateAction<any>>
  cr_account6ee89Props: any 
  setcr_account6ee89Props: React.Dispatch<React.SetStateAction<any>>
  remittance_info74cbb: any,
  setremittance_info74cbb:React.Dispatch<React.SetStateAction<any>>
  remittance_info74cbbProps: any 
  setremittance_info74cbbProps: React.Dispatch<React.SetStateAction<any>>
  add_new_payment33109: any,
  setadd_new_payment33109:React.Dispatch<React.SetStateAction<any>>
  add_new_payment33109Props: any 
  setadd_new_payment33109Props: React.Dispatch<React.SetStateAction<any>>
  searchfdc03: any,
  setsearchfdc03:React.Dispatch<React.SetStateAction<any>>
  searchfdc03Props: any 
  setsearchfdc03Props: React.Dispatch<React.SetStateAction<any>>
  refresh59747: any,
  setrefresh59747:React.Dispatch<React.SetStateAction<any>>
  refresh59747Props: any 
  setrefresh59747Props: React.Dispatch<React.SetStateAction<any>>
  download53d76: any,
  setdownload53d76:React.Dispatch<React.SetStateAction<any>>
  download53d76Props: any 
  setdownload53d76Props: React.Dispatch<React.SetStateAction<any>>
  outbound_or_inbound5dfa8: any,
  setoutbound_or_inbound5dfa8:React.Dispatch<React.SetStateAction<any>>
  outbound_or_inbound5dfa8Props: any 
  setoutbound_or_inbound5dfa8Props: React.Dispatch<React.SetStateAction<any>>
  channel_named9a37: any,
  setchannel_named9a37:React.Dispatch<React.SetStateAction<any>>
  channel_named9a37Props: any 
  setchannel_named9a37Props: React.Dispatch<React.SetStateAction<any>>
  product_code9a692: any,
  setproduct_code9a692:React.Dispatch<React.SetStateAction<any>>
  product_code9a692Props: any 
  setproduct_code9a692Props: React.Dispatch<React.SetStateAction<any>>
  directionbf471: any,
  setdirectionbf471:React.Dispatch<React.SetStateAction<any>>
  directionbf471Props: any 
  setdirectionbf471Props: React.Dispatch<React.SetStateAction<any>>
  charge_type977c5: any,
  setcharge_type977c5:React.Dispatch<React.SetStateAction<any>>
  charge_type977c5Props: any 
  setcharge_type977c5Props: React.Dispatch<React.SetStateAction<any>>
  debtor_account0655c: any,
  setdebtor_account0655c:React.Dispatch<React.SetStateAction<any>>
  debtor_account0655cProps: any 
  setdebtor_account0655cProps: React.Dispatch<React.SetStateAction<any>>
  creditor_accounts82148: any,
  setcreditor_accounts82148:React.Dispatch<React.SetStateAction<any>>
  creditor_accounts82148Props: any 
  setcreditor_accounts82148Props: React.Dispatch<React.SetStateAction<any>>
  amountc2ae9: any,
  setamountc2ae9:React.Dispatch<React.SetStateAction<any>>
  amountc2ae9Props: any 
  setamountc2ae9Props: React.Dispatch<React.SetStateAction<any>>
  currency124c5: any,
  setcurrency124c5:React.Dispatch<React.SetStateAction<any>>
  currency124c5Props: any 
  setcurrency124c5Props: React.Dispatch<React.SetStateAction<any>>
  uuide86ae: any,
  setuuide86ae:React.Dispatch<React.SetStateAction<any>>
  uuide86aeProps: any 
  setuuide86aeProps: React.Dispatch<React.SetStateAction<any>>
  process_type45fad: any,
  setprocess_type45fad:React.Dispatch<React.SetStateAction<any>>
  process_type45fadProps: any 
  setprocess_type45fadProps: React.Dispatch<React.SetStateAction<any>>
  tran_category81c97: any,
  settran_category81c97:React.Dispatch<React.SetStateAction<any>>
  tran_category81c97Props: any 
  settran_category81c97Props: React.Dispatch<React.SetStateAction<any>>
  settlement_datea6baf: any,
  setsettlement_datea6baf:React.Dispatch<React.SetStateAction<any>>
  settlement_datea6bafProps: any 
  setsettlement_datea6bafProps: React.Dispatch<React.SetStateAction<any>>
  remittance_info57b4b: any,
  setremittance_info57b4b:React.Dispatch<React.SetStateAction<any>>
  remittance_info57b4bProps: any 
  setremittance_info57b4bProps: React.Dispatch<React.SetStateAction<any>>
  product_code_json46315: any,
  setproduct_code_json46315:React.Dispatch<React.SetStateAction<any>>
  product_code_json46315Props: any 
  setproduct_code_json46315Props: React.Dispatch<React.SetStateAction<any>>
  saveb6b99: any,
  setsaveb6b99:React.Dispatch<React.SetStateAction<any>>
  saveb6b99Props: any 
  setsaveb6b99Props: React.Dispatch<React.SetStateAction<any>>
  clearf69d6: any,
  setclearf69d6:React.Dispatch<React.SetStateAction<any>>
  clearf69d6Props: any 
  setclearf69d6Props: React.Dispatch<React.SetStateAction<any>>
  dymanic_search_inputfa005: any,
  setdymanic_search_inputfa005:React.Dispatch<React.SetStateAction<any>>
  dymanic_search_inputfa005Props: any 
  setdymanic_search_inputfa005Props: React.Dispatch<React.SetStateAction<any>>
  clearf63e8: any,
  setclearf63e8:React.Dispatch<React.SetStateAction<any>>
  clearf63e8Props: any 
  setclearf63e8Props: React.Dispatch<React.SetStateAction<any>>
  search65fd7: any,
  setsearch65fd7:React.Dispatch<React.SetStateAction<any>>
  search65fd7Props: any 
  setsearch65fd7Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey47044: any,
  settran_journey47044:React.Dispatch<React.SetStateAction<any>>
  tran_journey47044Props: any 
  settran_journey47044Props: React.Dispatch<React.SetStateAction<any>>
  tran_date_and_timebba58: any,
  settran_date_and_timebba58:React.Dispatch<React.SetStateAction<any>>
  tran_date_and_timebba58Props: any 
  settran_date_and_timebba58Props: React.Dispatch<React.SetStateAction<any>>
  tran_status9b4c1: any,
  settran_status9b4c1:React.Dispatch<React.SetStateAction<any>>
  tran_status9b4c1Props: any 
  settran_status9b4c1Props: React.Dispatch<React.SetStateAction<any>>
  tra_created_date34aa7: any,
  settra_created_date34aa7:React.Dispatch<React.SetStateAction<any>>
  tra_created_date34aa7Props: any 
  settra_created_date34aa7Props: React.Dispatch<React.SetStateAction<any>>
  failuer_process_code981ea: any,
  setfailuer_process_code981ea:React.Dispatch<React.SetStateAction<any>>
  failuer_process_code981eaProps: any 
  setfailuer_process_code981eaProps: React.Dispatch<React.SetStateAction<any>>
  tran_process55ab3: any,
  settran_process55ab3:React.Dispatch<React.SetStateAction<any>>
  tran_process55ab3Props: any 
  settran_process55ab3Props: React.Dispatch<React.SetStateAction<any>>
  product_code36b37: any,
  setproduct_code36b37:React.Dispatch<React.SetStateAction<any>>
  product_code36b37Props: any 
  setproduct_code36b37Props: React.Dispatch<React.SetStateAction<any>>
  view_msg_data387c6: any,
  setview_msg_data387c6:React.Dispatch<React.SetStateAction<any>>
  view_msg_data387c6Props: any 
  setview_msg_data387c6Props: React.Dispatch<React.SetStateAction<any>>
  view_tran_log83071: any,
  setview_tran_log83071:React.Dispatch<React.SetStateAction<any>>
  view_tran_log83071Props: any 
  setview_tran_log83071Props: React.Dispatch<React.SetStateAction<any>>
  product_code523b7: any,
  setproduct_code523b7:React.Dispatch<React.SetStateAction<any>>
  product_code523b7Props: any 
  setproduct_code523b7Props: React.Dispatch<React.SetStateAction<any>>
  setup_code88cd6: any,
  setsetup_code88cd6:React.Dispatch<React.SetStateAction<any>>
  setup_code88cd6Props: any 
  setsetup_code88cd6Props: React.Dispatch<React.SetStateAction<any>>
  interface_productd9133: any,
  setinterface_productd9133:React.Dispatch<React.SetStateAction<any>>
  interface_productd9133Props: any 
  setinterface_productd9133Props: React.Dispatch<React.SetStateAction<any>>
  category80c2f: any,
  setcategory80c2f:React.Dispatch<React.SetStateAction<any>>
  category80c2fProps: any 
  setcategory80c2fProps: React.Dispatch<React.SetStateAction<any>>
  sub_categoryd81c5: any,
  setsub_categoryd81c5:React.Dispatch<React.SetStateAction<any>>
  sub_categoryd81c5Props: any 
  setsub_categoryd81c5Props: React.Dispatch<React.SetStateAction<any>>
  purpose3b7f4: any,
  setpurpose3b7f4:React.Dispatch<React.SetStateAction<any>>
  purpose3b7f4Props: any 
  setpurpose3b7f4Props: React.Dispatch<React.SetStateAction<any>>
  system_setup_dynamic_formf3526: any,
  setsystem_setup_dynamic_formf3526:React.Dispatch<React.SetStateAction<any>>
  system_setup_dynamic_formf3526Props: any 
  setsystem_setup_dynamic_formf3526Props: React.Dispatch<React.SetStateAction<any>>
  cancelad32e: any,
  setcancelad32e:React.Dispatch<React.SetStateAction<any>>
  cancelad32eProps: any 
  setcancelad32eProps: React.Dispatch<React.SetStateAction<any>>
  save3a1b8: any,
  setsave3a1b8:React.Dispatch<React.SetStateAction<any>>
  save3a1b8Props: any 
  setsave3a1b8Props: React.Dispatch<React.SetStateAction<any>>
  checker_detail4e9af: any,
  setchecker_detail4e9af:React.Dispatch<React.SetStateAction<any>>
  checker_detail4e9afProps: any 
  setchecker_detail4e9afProps: React.Dispatch<React.SetStateAction<any>>
  api_endpointa0340: any,
  setapi_endpointa0340:React.Dispatch<React.SetStateAction<any>>
  api_endpointa0340Props: any 
  setapi_endpointa0340Props: React.Dispatch<React.SetStateAction<any>>
  setup_code4eedf: any,
  setsetup_code4eedf:React.Dispatch<React.SetStateAction<any>>
  setup_code4eedfProps: any 
  setsetup_code4eedfProps: React.Dispatch<React.SetStateAction<any>>
  api_namebdd52: any,
  setapi_namebdd52:React.Dispatch<React.SetStateAction<any>>
  api_namebdd52Props: any 
  setapi_namebdd52Props: React.Dispatch<React.SetStateAction<any>>
  approve_id82664: any,
  setapprove_id82664:React.Dispatch<React.SetStateAction<any>>
  approve_id82664Props: any 
  setapprove_id82664Props: React.Dispatch<React.SetStateAction<any>>
  product_key121a1: any,
  setproduct_key121a1:React.Dispatch<React.SetStateAction<any>>
  product_key121a1Props: any 
  setproduct_key121a1Props: React.Dispatch<React.SetStateAction<any>>
  http_methoda99b9: any,
  sethttp_methoda99b9:React.Dispatch<React.SetStateAction<any>>
  http_methoda99b9Props: any 
  sethttp_methoda99b9Props: React.Dispatch<React.SetStateAction<any>>
  approve20de7: any,
  setapprove20de7:React.Dispatch<React.SetStateAction<any>>
  approve20de7Props: any 
  setapprove20de7Props: React.Dispatch<React.SetStateAction<any>>
  setup_cd7cc97: any,
  setsetup_cd7cc97:React.Dispatch<React.SetStateAction<any>>
  setup_cd7cc97Props: any 
  setsetup_cd7cc97Props: React.Dispatch<React.SetStateAction<any>>
  api_nm498ae: any,
  setapi_nm498ae:React.Dispatch<React.SetStateAction<any>>
  api_nm498aeProps: any 
  setapi_nm498aeProps: React.Dispatch<React.SetStateAction<any>>
  api_endpt39a78: any,
  setapi_endpt39a78:React.Dispatch<React.SetStateAction<any>>
  api_endpt39a78Props: any 
  setapi_endpt39a78Props: React.Dispatch<React.SetStateAction<any>>
  pdt_cd70f76: any,
  setpdt_cd70f76:React.Dispatch<React.SetStateAction<any>>
  pdt_cd70f76Props: any 
  setpdt_cd70f76Props: React.Dispatch<React.SetStateAction<any>>
  http_mthd3f6f2: any,
  sethttp_mthd3f6f2:React.Dispatch<React.SetStateAction<any>>
  http_mthd3f6f2Props: any 
  sethttp_mthd3f6f2Props: React.Dispatch<React.SetStateAction<any>>
  aprl_id47e91: any,
  setaprl_id47e91:React.Dispatch<React.SetStateAction<any>>
  aprl_id47e91Props: any 
  setaprl_id47e91Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  transaction_v1Props: any 
  settransaction_v1Props: React.Dispatch<React.SetStateAction<any>>
  add_new_payment_v1Props: any 
  setadd_new_payment_v1Props: React.Dispatch<React.SetStateAction<any>>
  view_all_search_screen_v1Props: any 
  setview_all_search_screen_v1Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey_v1Props: any 
  settran_journey_v1Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey_dtl_v1Props: any 
  settran_journey_dtl_v1Props: React.Dispatch<React.SetStateAction<any>>
  master_system_setup_v1Props: any 
  setmaster_system_setup_v1Props: React.Dispatch<React.SetStateAction<any>>
  cdc_checker_action_screen_v1Props: any 
  setcdc_checker_action_screen_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_get_transaction_dfd_v1Props: any 
  setdfd_get_transaction_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_tran_journey_dtl_v1Props: any 
  setdfd_tran_journey_dtl_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_tran_journey_db_query_v1Props: any 
  setdfd_tran_journey_db_query_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_master_system_setup_dfd_v1Props: any 
  setdfd_master_system_setup_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_cdc_checker_action_dfd_v1Props: any 
  setdfd_cdc_checker_action_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>

  refetch: any,
  setRefetch: React.Dispatch<React.SetStateAction<any>>
  searchParam: string,
  setSearchParam: React.Dispatch<React.SetStateAction<string>>
  disableParam: Record<string, boolean>,
  setDisableParam: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  globalState: Record<string, any>,
  setGlobalState: React.Dispatch<React.SetStateAction<Record<string, any>>>
  // for all textInput validation
  validate: Record<string, any>,
  setValidate: React.Dispatch<React.SetStateAction<Record<string, any>>>

  //its used for validate once again on button click
  validateRefetch: { value: boolean; init: number },
  setValidateRefetch: React.Dispatch<React.SetStateAction<{ value: boolean; init: number }>>
  accessProfile:any,
  setAccessProfile: React.Dispatch<React.SetStateAction<any>>
  memoryVariables: Record<string, string>
  setMemoryVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>
  property: Record<string, any>
  setProperty: React.Dispatch<React.SetStateAction<Record<string, any>>>
  refresh: Record<string, boolean>,
  setRefresh: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  lockedData: Record<string, any>,
  setLockedData: React.Dispatch<React.SetStateAction<Record<string, any>>>
  paginationDetails: Record<string, any>,
  setpaginationDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>
  eventEmitterData: any[],
  setEventEmitterData: React.Dispatch<React.SetStateAction<any[]>>
  userDetails: Record<string, any>,
  setUserDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>
  encAppFalg: Record<string, any>,
  setEncAppFalg: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
    const [currentToken, setCurrentToken ] = React.useState<any>({})
    const [matchedAccessProfileData, setMatchedAccessProfileData] =
    React.useState<any>({})
      //////////
        const [transaction_groupcc5ac, settransaction_groupcc5ac ] = React.useState<any>({}) 
    const [transaction_groupcc5acProps, settransaction_groupcc5acProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tab_group05125, settab_group05125 ] = React.useState<any>({}) 
    const [tab_group05125Props, settab_group05125Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_all_tab71a07, setview_all_tab71a07 ] = React.useState<any>({}) 
    const [view_all_tab71a07Props, setview_all_tab71a07Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [view_all_table648c4, setview_all_table648c4 ] = React.useState<any>([]) 
    const [view_all_table648c4Props, setview_all_table648c4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [failure_queue_tab11090, setfailure_queue_tab11090 ] = React.useState<any>({}) 
    const [failure_queue_tab11090Props, setfailure_queue_tab11090Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [failure_queue_table449a9, setfailure_queue_table449a9 ] = React.useState<any>([]) 
    const [failure_queue_table449a9Props, setfailure_queue_table449a9Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [payment_group1c8a5, setpayment_group1c8a5 ] = React.useState<any>({}) 
    const [payment_group1c8a5Props, setpayment_group1c8a5Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [searchgroupc4337, setsearchgroupc4337 ] = React.useState<any>({}) 
    const [searchgroupc4337Props, setsearchgroupc4337Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tran_journey_groupbe7ae, settran_journey_groupbe7ae ] = React.useState<any>({}) 
    const [tran_journey_groupbe7aeProps, settran_journey_groupbe7aeProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tran_journey_dtl_group6545a, settran_journey_dtl_group6545a ] = React.useState<any>({}) 
    const [tran_journey_dtl_group6545aProps, settran_journey_dtl_group6545aProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [system_setup_group2af15, setsystem_setup_group2af15 ] = React.useState<any>({}) 
    const [system_setup_group2af15Props, setsystem_setup_group2af15Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [cdc_group2e1e4, setcdc_group2e1e4 ] = React.useState<any>({}) 
    const [cdc_group2e1e4Props, setcdc_group2e1e4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [details_group46bbe, setdetails_group46bbe ] = React.useState<any>({}) 
    const [details_group46bbeProps, setdetails_group46bbeProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [table_group05951, settable_group05951 ] = React.useState<any>({}) 
    const [table_group05951Props, settable_group05951Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [cdc_table8e54d, setcdc_table8e54d ] = React.useState<any>([]) 
    const [cdc_table8e54dProps, setcdc_table8e54dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
   const [view_all_logs50c05,setview_all_logs50c05] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_all_button56968,setview_all_button56968] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code27e26,setproduct_code27e26] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuidb02c5,setuuidb02c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name1516d,setchannel_name1516d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [settlement_date32e82,setsettlement_date32e82] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_account5a90a,setdr_account5a90a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amount8f415,setdr_amount8f415] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_currencycb231,setdr_currencycb231] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_accountf334f,setcr_accountf334f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info30960,setremittance_info30960] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [charge_type3dd6d,setcharge_type3dd6d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [logs_failure_queue7e78b,setlogs_failure_queue7e78b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_failure_queue04cba,setview_failure_queue04cba] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_codea1bf6,setproduct_codea1bf6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuidd1032,setuuidd1032] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name0e1ca,setchannel_name0e1ca] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [settlement_date202a2,setsettlement_date202a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_accountf4175,setdr_accountf4175] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amountaa5df,setdr_amountaa5df] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_currency3c79d,setdr_currency3c79d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_account6ee89,setcr_account6ee89] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info74cbb,setremittance_info74cbb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [add_new_payment33109,setadd_new_payment33109] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [searchfdc03,setsearchfdc03] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [refresh59747,setrefresh59747] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [download53d76,setdownload53d76] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [outbound_or_inbound5dfa8,setoutbound_or_inbound5dfa8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_named9a37,setchannel_named9a37] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code9a692,setproduct_code9a692] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [directionbf471,setdirectionbf471] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [charge_type977c5,setcharge_type977c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debtor_account0655c,setdebtor_account0655c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [creditor_accounts82148,setcreditor_accounts82148] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amountc2ae9,setamountc2ae9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency124c5,setcurrency124c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuide86ae,setuuide86ae] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [process_type45fad,setprocess_type45fad] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_category81c97,settran_category81c97] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [settlement_datea6baf,setsettlement_datea6baf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info57b4b,setremittance_info57b4b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code_json46315,setproduct_code_json46315] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [saveb6b99,setsaveb6b99] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [clearf69d6,setclearf69d6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dymanic_search_inputfa005,setdymanic_search_inputfa005] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [clearf63e8,setclearf63e8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [search65fd7,setsearch65fd7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_journey47044,settran_journey47044] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_date_and_timebba58,settran_date_and_timebba58] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_status9b4c1,settran_status9b4c1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tra_created_date34aa7,settra_created_date34aa7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [failuer_process_code981ea,setfailuer_process_code981ea] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_process55ab3,settran_process55ab3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code36b37,setproduct_code36b37] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_msg_data387c6,setview_msg_data387c6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_tran_log83071,setview_tran_log83071] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code523b7,setproduct_code523b7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [setup_code88cd6,setsetup_code88cd6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [interface_productd9133,setinterface_productd9133] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [category80c2f,setcategory80c2f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [sub_categoryd81c5,setsub_categoryd81c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [purpose3b7f4,setpurpose3b7f4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [system_setup_dynamic_formf3526,setsystem_setup_dynamic_formf3526] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cancelad32e,setcancelad32e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save3a1b8,setsave3a1b8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [checker_detail4e9af,setchecker_detail4e9af] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [api_endpointa0340,setapi_endpointa0340] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [setup_code4eedf,setsetup_code4eedf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [api_namebdd52,setapi_namebdd52] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve_id82664,setapprove_id82664] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_key121a1,setproduct_key121a1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [http_methoda99b9,sethttp_methoda99b9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve20de7,setapprove20de7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [setup_cd7cc97,setsetup_cd7cc97] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [api_nm498ae,setapi_nm498ae] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [api_endpt39a78,setapi_endpt39a78] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pdt_cd70f76,setpdt_cd70f76] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [http_mthd3f6f2,sethttp_mthd3f6f2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [aprl_id47e91,setaprl_id47e91] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<Record<string, boolean>>({       buttonview_all_logs50c05:false,
       buttonview_all_button56968:false,
       columnproduct_code27e26:false,
       columnuuidb02c5:false,
       columnchannel_name1516d:false,
       columnsettlement_date32e82:false,
       columndr_account5a90a:false,
       columndr_amount8f415:false,
       columndr_currencycb231:false,
       columncr_accountf334f:false,
       columnremittance_info30960:false,
       columncharge_type3dd6d:false,
       buttonLogs_failure_queue7e78b:false,
       buttonview_failure_queue04cba:false,
       columnproduct_codea1bf6:false,
       columnuuidd1032:false,
       columnchannel_name0e1ca:false,
       columnsettlement_date202a2:false,
       columndr_accountf4175:false,
       columndr_amountaa5df:false,
       columndr_currency3c79d:false,
       columncr_account6ee89:false,
       columnremittance_info74cbb:false,
       buttonadd_new_payment33109:false,
       buttonsearchfdc03:false,
       buttonrefresh59747:false,
       buttondownload53d76:false,
       switchoutbound_or_inbound5dfa8:false,
       dropdownchannel_named9a37:false,
       dropdownproduct_code9a692:false,
       dropdowndirectionbf471:false,
       dropdowncharge_type977c5:false,
       textinputdebtor_account0655c:false,
       textinputcreditor_accounts82148:false,
       textinputamountc2ae9:false,
       dropdowncurrency124c5:false,
       textinputuuide86ae:false,
       dropdownprocess_type45fad:false,
       dropdowntran_category81c97:false,
       datepickersettlement_datea6baf:false,
       textinputremittance_info57b4b:false,
       dynamicjsonformproduct_code_json46315:false,
       buttonSaveb6b99:false,
       buttonClearf69d6:false,
       dynamicjsonformdymanic_search_inputfa005:false,
       buttonClearf63e8:false,
       buttonsearch65fd7:false,
       timelinetran_journey47044:false,
       texttran_date_and_timebba58:false,
       texttran_status9b4c1:false,
       texttra_created_date34aa7:false,
       textfailuer_process_code981ea:false,
       texttran_process55ab3:false,
       textproduct_code36b37:false,
       buttonview_msg_data387c6:false,
       buttonview_tran_log83071:false,
       dropdownproduct_code523b7:false,
       textinputsetup_code88cd6:false,
       textinputinterface_productd9133:false,
       dropdowncategory80c2f:false,
       dropdownsub_categoryd81c5:false,
       textinputpurpose3b7f4:false,
       dynamicjsonformsystem_setup_dynamic_formf3526:false,
       buttonCancelad32e:false,
       buttonSave3a1b8:false,
       textchecker_detail4e9af:false,
       textinputapi_endpointa0340:false,
       textinputsetup_code4eedf:false,
       textinputapi_namebdd52:false,
       textinputapprove_id82664:false,
       textinputproduct_key121a1:false,
       textinputhttp_methoda99b9:false,
       buttonapprove20de7:false,
       columnsetup_cd7cc97:false,
       columnapi_nm498ae:false,
       columnapi_endpt39a78:false,
       columnpdt_cd70f76:false,
       columnhttp_mthd3f6f2:false,
       columnaprl_id47e91:false,
       grouptransaction_groupcc5ac:false,
       grouptab_group05125:false,
       groupview_all_tab71a07:false,
       tableview_all_table648c4:false,
       groupfailure_queue_tab11090:false,
       tablefailure_queue_table449a9:false,
       grouppayment_group1c8a5:false,
       groupsearchgroupc4337:false,
       grouptran_journey_groupbe7ae:false,
       grouptran_journey_dtl_group6545a:false,
       groupsystem_setup_group2af15:false,
       groupcdc_group2e1e4:false,
       groupdetails_group46bbe:false,
       grouptable_group05951:false,
       tablecdc_table8e54d:false,
      })

  ////// screen states 
   const [transaction_v1Props,settransaction_v1Props] = React.useState<any>([])
   const [add_new_payment_v1Props,setadd_new_payment_v1Props] = React.useState<any>([])
   const [view_all_search_screen_v1Props,setview_all_search_screen_v1Props] = React.useState<any>([])
   const [tran_journey_v1Props,settran_journey_v1Props] = React.useState<any>([])
   const [tran_journey_dtl_v1Props,settran_journey_dtl_v1Props] = React.useState<any>([])
   const [master_system_setup_v1Props,setmaster_system_setup_v1Props] = React.useState<any>([])
   const [cdc_checker_action_screen_v1Props,setcdc_checker_action_screen_v1Props] = React.useState<any>([])

///////// dfd
  const [dfd_get_transaction_dfd_v1Props,setdfd_get_transaction_dfd_v1Props] = React.useState<any>([])
  const [dfd_tran_journey_dtl_v1Props,setdfd_tran_journey_dtl_v1Props] = React.useState<any>([])
  const [dfd_tran_journey_db_query_v1Props,setdfd_tran_journey_db_query_v1Props] = React.useState<any>([])
  const [dfd_master_system_setup_dfd_v1Props,setdfd_master_system_setup_dfd_v1Props] = React.useState<any>([])
  const [dfd_cdc_checker_action_dfd_v1Props,setdfd_cdc_checker_action_dfd_v1Props] = React.useState<any>([])
    const [searchParam , setSearchParam] = React.useState<string>("")
    const [disableParam , setDisableParam] = React.useState<Record<string, boolean>>({})
    const [globalState , setGlobalState] = React.useState<Record<string, any>>({})
    const [refetch, setRefetch] = React.useState<any>(false)
    const [validate, setValidate] = React.useState<Record<string, any>>({});
    const [validateRefetch, setValidateRefetch] = React.useState<{ value: boolean; init: number }>({
      value:false,
      init:0
    })
    const [accessProfile, setAccessProfile] = React.useState<any>([])
    const [property, setProperty] = React.useState<any>({})
    const [memoryVariables, setMemoryVariables] = React.useState<any>({})
    const [lockedData, setLockedData] = React.useState<any>({})
    const [paginationDetails, setpaginationDetails] = React.useState<any>({})

    const [eventEmitterData,setEventEmitterData] = React.useState<any>([])
    const [userDetails , setUserDetails] = React.useState<any>({})
    const [encAppFalg , setEncAppFalg] = React.useState<any>({})
    const theme = getCookie('cfg_theme')
    
    
  return (
    <TotalContext.Provider 
      value={
      {
      //
        currentToken,
        setCurrentToken,
        matchedAccessProfileData,
        setMatchedAccessProfileData,
        transaction_groupcc5ac, 
        settransaction_groupcc5ac,
        transaction_groupcc5acProps, 
        settransaction_groupcc5acProps,
        tab_group05125, 
        settab_group05125,
        tab_group05125Props, 
        settab_group05125Props,
        view_all_tab71a07, 
        setview_all_tab71a07,
        view_all_tab71a07Props, 
        setview_all_tab71a07Props,
        view_all_table648c4, 
        setview_all_table648c4,
        view_all_table648c4Props, 
        setview_all_table648c4Props,
        failure_queue_tab11090, 
        setfailure_queue_tab11090,
        failure_queue_tab11090Props, 
        setfailure_queue_tab11090Props,
        failure_queue_table449a9, 
        setfailure_queue_table449a9,
        failure_queue_table449a9Props, 
        setfailure_queue_table449a9Props,
        payment_group1c8a5, 
        setpayment_group1c8a5,
        payment_group1c8a5Props, 
        setpayment_group1c8a5Props,
        searchgroupc4337, 
        setsearchgroupc4337,
        searchgroupc4337Props, 
        setsearchgroupc4337Props,
        tran_journey_groupbe7ae, 
        settran_journey_groupbe7ae,
        tran_journey_groupbe7aeProps, 
        settran_journey_groupbe7aeProps,
        tran_journey_dtl_group6545a, 
        settran_journey_dtl_group6545a,
        tran_journey_dtl_group6545aProps, 
        settran_journey_dtl_group6545aProps,
        system_setup_group2af15, 
        setsystem_setup_group2af15,
        system_setup_group2af15Props, 
        setsystem_setup_group2af15Props,
        cdc_group2e1e4, 
        setcdc_group2e1e4,
        cdc_group2e1e4Props, 
        setcdc_group2e1e4Props,
        details_group46bbe, 
        setdetails_group46bbe,
        details_group46bbeProps, 
        setdetails_group46bbeProps,
        table_group05951, 
        settable_group05951,
        table_group05951Props, 
        settable_group05951Props,
        cdc_table8e54d, 
        setcdc_table8e54d,
        cdc_table8e54dProps, 
        setcdc_table8e54dProps,
        view_all_logs50c05,
        setview_all_logs50c05, 
        view_all_button56968,
        setview_all_button56968, 
        product_code27e26,
        setproduct_code27e26, 
        uuidb02c5,
        setuuidb02c5, 
        channel_name1516d,
        setchannel_name1516d, 
        settlement_date32e82,
        setsettlement_date32e82, 
        dr_account5a90a,
        setdr_account5a90a, 
        dr_amount8f415,
        setdr_amount8f415, 
        dr_currencycb231,
        setdr_currencycb231, 
        cr_accountf334f,
        setcr_accountf334f, 
        remittance_info30960,
        setremittance_info30960, 
        charge_type3dd6d,
        setcharge_type3dd6d, 
        logs_failure_queue7e78b,
        setlogs_failure_queue7e78b, 
        view_failure_queue04cba,
        setview_failure_queue04cba, 
        product_codea1bf6,
        setproduct_codea1bf6, 
        uuidd1032,
        setuuidd1032, 
        channel_name0e1ca,
        setchannel_name0e1ca, 
        settlement_date202a2,
        setsettlement_date202a2, 
        dr_accountf4175,
        setdr_accountf4175, 
        dr_amountaa5df,
        setdr_amountaa5df, 
        dr_currency3c79d,
        setdr_currency3c79d, 
        cr_account6ee89,
        setcr_account6ee89, 
        remittance_info74cbb,
        setremittance_info74cbb, 
        add_new_payment33109,
        setadd_new_payment33109, 
        searchfdc03,
        setsearchfdc03, 
        refresh59747,
        setrefresh59747, 
        download53d76,
        setdownload53d76, 
        outbound_or_inbound5dfa8,
        setoutbound_or_inbound5dfa8, 
        channel_named9a37,
        setchannel_named9a37, 
        product_code9a692,
        setproduct_code9a692, 
        directionbf471,
        setdirectionbf471, 
        charge_type977c5,
        setcharge_type977c5, 
        debtor_account0655c,
        setdebtor_account0655c, 
        creditor_accounts82148,
        setcreditor_accounts82148, 
        amountc2ae9,
        setamountc2ae9, 
        currency124c5,
        setcurrency124c5, 
        uuide86ae,
        setuuide86ae, 
        process_type45fad,
        setprocess_type45fad, 
        tran_category81c97,
        settran_category81c97, 
        settlement_datea6baf,
        setsettlement_datea6baf, 
        remittance_info57b4b,
        setremittance_info57b4b, 
        product_code_json46315,
        setproduct_code_json46315, 
        saveb6b99,
        setsaveb6b99, 
        clearf69d6,
        setclearf69d6, 
        dymanic_search_inputfa005,
        setdymanic_search_inputfa005, 
        clearf63e8,
        setclearf63e8, 
        search65fd7,
        setsearch65fd7, 
        tran_journey47044,
        settran_journey47044, 
        tran_date_and_timebba58,
        settran_date_and_timebba58, 
        tran_status9b4c1,
        settran_status9b4c1, 
        tra_created_date34aa7,
        settra_created_date34aa7, 
        failuer_process_code981ea,
        setfailuer_process_code981ea, 
        tran_process55ab3,
        settran_process55ab3, 
        product_code36b37,
        setproduct_code36b37, 
        view_msg_data387c6,
        setview_msg_data387c6, 
        view_tran_log83071,
        setview_tran_log83071, 
        product_code523b7,
        setproduct_code523b7, 
        setup_code88cd6,
        setsetup_code88cd6, 
        interface_productd9133,
        setinterface_productd9133, 
        category80c2f,
        setcategory80c2f, 
        sub_categoryd81c5,
        setsub_categoryd81c5, 
        purpose3b7f4,
        setpurpose3b7f4, 
        system_setup_dynamic_formf3526,
        setsystem_setup_dynamic_formf3526, 
        cancelad32e,
        setcancelad32e, 
        save3a1b8,
        setsave3a1b8, 
        checker_detail4e9af,
        setchecker_detail4e9af, 
        api_endpointa0340,
        setapi_endpointa0340, 
        setup_code4eedf,
        setsetup_code4eedf, 
        api_namebdd52,
        setapi_namebdd52, 
        approve_id82664,
        setapprove_id82664, 
        product_key121a1,
        setproduct_key121a1, 
        http_methoda99b9,
        sethttp_methoda99b9, 
        approve20de7,
        setapprove20de7, 
        setup_cd7cc97,
        setsetup_cd7cc97, 
        api_nm498ae,
        setapi_nm498ae, 
        api_endpt39a78,
        setapi_endpt39a78, 
        pdt_cd70f76,
        setpdt_cd70f76, 
        http_mthd3f6f2,
        sethttp_mthd3f6f2, 
        aprl_id47e91,
        setaprl_id47e91, 
        ////// screen states 
          transaction_v1Props,
          settransaction_v1Props,
          add_new_payment_v1Props,
          setadd_new_payment_v1Props,
          view_all_search_screen_v1Props,
          setview_all_search_screen_v1Props,
          tran_journey_v1Props,
          settran_journey_v1Props,
          tran_journey_dtl_v1Props,
          settran_journey_dtl_v1Props,
          master_system_setup_v1Props,
          setmaster_system_setup_v1Props,
          cdc_checker_action_screen_v1Props,
          setcdc_checker_action_screen_v1Props,
        //////////

        ///////// dfd
        dfd_get_transaction_dfd_v1Props,
        setdfd_get_transaction_dfd_v1Props,
        dfd_tran_journey_dtl_v1Props,
        setdfd_tran_journey_dtl_v1Props,
        dfd_tran_journey_db_query_v1Props,
        setdfd_tran_journey_db_query_v1Props,
        dfd_master_system_setup_dfd_v1Props,
        setdfd_master_system_setup_dfd_v1Props,
        dfd_cdc_checker_action_dfd_v1Props,
        setdfd_cdc_checker_action_dfd_v1Props,
        refetch,
        setRefetch,
        searchParam,
        setSearchParam,
        disableParam,
        setDisableParam,
        globalState,
        setGlobalState,
        validate,
        setValidate,
        validateRefetch,
        setValidateRefetch,
        accessProfile,
        setAccessProfile,
        property,
        setProperty,
        setRefresh,
        refresh,
        memoryVariables,
        setMemoryVariables,
        lockedData,
        setLockedData,
        paginationDetails,
        setpaginationDetails,
        eventEmitterData,
        setEventEmitterData,
        userDetails,
        setUserDetails,
        encAppFalg,
        setEncAppFalg
        }}
      >
      {children}
    </TotalContext.Provider>
  )
}

export default GlobalContext