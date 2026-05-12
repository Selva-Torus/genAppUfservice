


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  currentToken: any 
  setCurrentToken: React.Dispatch<React.SetStateAction<any>>
  matchedAccessProfileData: any;
  setMatchedAccessProfileData: React.Dispatch<React.SetStateAction<any>>
  tran_main_group1dc7f: any 
  settran_main_group1dc7f: React.Dispatch<React.SetStateAction<any>>
  tran_main_group1dc7fProps: any 
  settran_main_group1dc7fProps: React.Dispatch<React.SetStateAction<any>>
  tran_tab_group08b64: any 
  settran_tab_group08b64: React.Dispatch<React.SetStateAction<any>>
  tran_tab_group08b64Props: any 
  settran_tab_group08b64Props: React.Dispatch<React.SetStateAction<any>>
  view_all_tab4a963: any 
  setview_all_tab4a963: React.Dispatch<React.SetStateAction<any>>
  view_all_tab4a963Props: any 
  setview_all_tab4a963Props: React.Dispatch<React.SetStateAction<any>>
  view_all_tablec9e87: any 
  setview_all_tablec9e87: React.Dispatch<React.SetStateAction<any>>
  view_all_tablec9e87Props: any 
  setview_all_tablec9e87Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab69f01: any 
  setfailure_queue_tab69f01: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab69f01Props: any 
  setfailure_queue_tab69f01Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tablea476f: any 
  setfailure_queue_tablea476f: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tablea476fProps: any 
  setfailure_queue_tablea476fProps: React.Dispatch<React.SetStateAction<any>>
  success_queue_tabef582: any 
  setsuccess_queue_tabef582: React.Dispatch<React.SetStateAction<any>>
  success_queue_tabef582Props: any 
  setsuccess_queue_tabef582Props: React.Dispatch<React.SetStateAction<any>>
  success_queue_table63aae: any 
  setsuccess_queue_table63aae: React.Dispatch<React.SetStateAction<any>>
  success_queue_table63aaeProps: any 
  setsuccess_queue_table63aaeProps: React.Dispatch<React.SetStateAction<any>>
  return_queue_tab5611e: any 
  setreturn_queue_tab5611e: React.Dispatch<React.SetStateAction<any>>
  return_queue_tab5611eProps: any 
  setreturn_queue_tab5611eProps: React.Dispatch<React.SetStateAction<any>>
  return_queue_table267f0: any 
  setreturn_queue_table267f0: React.Dispatch<React.SetStateAction<any>>
  return_queue_table267f0Props: any 
  setreturn_queue_table267f0Props: React.Dispatch<React.SetStateAction<any>>
  main_group9066f: any 
  setmain_group9066f: React.Dispatch<React.SetStateAction<any>>
  main_group9066fProps: any 
  setmain_group9066fProps: React.Dispatch<React.SetStateAction<any>>
  tran_journey_group9eb2e: any 
  settran_journey_group9eb2e: React.Dispatch<React.SetStateAction<any>>
  tran_journey_group9eb2eProps: any 
  settran_journey_group9eb2eProps: React.Dispatch<React.SetStateAction<any>>
  journey_details_groupd9a0e: any 
  setjourney_details_groupd9a0e: React.Dispatch<React.SetStateAction<any>>
  journey_details_groupd9a0eProps: any 
  setjourney_details_groupd9a0eProps: React.Dispatch<React.SetStateAction<any>>
  tran_data_group84f25: any 
  settran_data_group84f25: React.Dispatch<React.SetStateAction<any>>
  tran_data_group84f25Props: any 
  settran_data_group84f25Props: React.Dispatch<React.SetStateAction<any>>
  req_data_group8d4d7: any 
  setreq_data_group8d4d7: React.Dispatch<React.SetStateAction<any>>
  req_data_group8d4d7Props: any 
  setreq_data_group8d4d7Props: React.Dispatch<React.SetStateAction<any>>
  res_data_group9d75a: any 
  setres_data_group9d75a: React.Dispatch<React.SetStateAction<any>>
  res_data_group9d75aProps: any 
  setres_data_group9d75aProps: React.Dispatch<React.SetStateAction<any>>
  product_code_view_allb0df6: any,
  setproduct_code_view_allb0df6:React.Dispatch<React.SetStateAction<any>>
  product_code_view_allb0df6Props: any 
  setproduct_code_view_allb0df6Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_view_all33724: any,
  setchannel_name_view_all33724:React.Dispatch<React.SetStateAction<any>>
  channel_name_view_all33724Props: any 
  setchannel_name_view_all33724Props: React.Dispatch<React.SetStateAction<any>>
  uuid_view_allc0a46: any,
  setuuid_view_allc0a46:React.Dispatch<React.SetStateAction<any>>
  uuid_view_allc0a46Props: any 
  setuuid_view_allc0a46Props: React.Dispatch<React.SetStateAction<any>>
  dr_account_view_all54da6: any,
  setdr_account_view_all54da6:React.Dispatch<React.SetStateAction<any>>
  dr_account_view_all54da6Props: any 
  setdr_account_view_all54da6Props: React.Dispatch<React.SetStateAction<any>>
  dr_amount_view_all88d6b: any,
  setdr_amount_view_all88d6b:React.Dispatch<React.SetStateAction<any>>
  dr_amount_view_all88d6bProps: any 
  setdr_amount_view_all88d6bProps: React.Dispatch<React.SetStateAction<any>>
  cr_account_view_alld4b39: any,
  setcr_account_view_alld4b39:React.Dispatch<React.SetStateAction<any>>
  cr_account_view_alld4b39Props: any 
  setcr_account_view_alld4b39Props: React.Dispatch<React.SetStateAction<any>>
  cr_amount_view_all19d14: any,
  setcr_amount_view_all19d14:React.Dispatch<React.SetStateAction<any>>
  cr_amount_view_all19d14Props: any 
  setcr_amount_view_all19d14Props: React.Dispatch<React.SetStateAction<any>>
  remittance_info_view_all82afd: any,
  setremittance_info_view_all82afd:React.Dispatch<React.SetStateAction<any>>
  remittance_info_view_all82afdProps: any 
  setremittance_info_view_all82afdProps: React.Dispatch<React.SetStateAction<any>>
  status_view_all47e6b: any,
  setstatus_view_all47e6b:React.Dispatch<React.SetStateAction<any>>
  status_view_all47e6bProps: any 
  setstatus_view_all47e6bProps: React.Dispatch<React.SetStateAction<any>>
  log_btnfe134: any,
  setlog_btnfe134:React.Dispatch<React.SetStateAction<any>>
  log_btnfe134Props: any 
  setlog_btnfe134Props: React.Dispatch<React.SetStateAction<any>>
  product_code_failure_queue12297: any,
  setproduct_code_failure_queue12297:React.Dispatch<React.SetStateAction<any>>
  product_code_failure_queue12297Props: any 
  setproduct_code_failure_queue12297Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_failure_queue42953: any,
  setchannel_name_failure_queue42953:React.Dispatch<React.SetStateAction<any>>
  channel_name_failure_queue42953Props: any 
  setchannel_name_failure_queue42953Props: React.Dispatch<React.SetStateAction<any>>
  uuid_failure_queue03c86: any,
  setuuid_failure_queue03c86:React.Dispatch<React.SetStateAction<any>>
  uuid_failure_queue03c86Props: any 
  setuuid_failure_queue03c86Props: React.Dispatch<React.SetStateAction<any>>
  dr_account_failure_queuef9d2d: any,
  setdr_account_failure_queuef9d2d:React.Dispatch<React.SetStateAction<any>>
  dr_account_failure_queuef9d2dProps: any 
  setdr_account_failure_queuef9d2dProps: React.Dispatch<React.SetStateAction<any>>
  dr_amount_failure_queue95d4e: any,
  setdr_amount_failure_queue95d4e:React.Dispatch<React.SetStateAction<any>>
  dr_amount_failure_queue95d4eProps: any 
  setdr_amount_failure_queue95d4eProps: React.Dispatch<React.SetStateAction<any>>
  cr_account_failure_queuea7246: any,
  setcr_account_failure_queuea7246:React.Dispatch<React.SetStateAction<any>>
  cr_account_failure_queuea7246Props: any 
  setcr_account_failure_queuea7246Props: React.Dispatch<React.SetStateAction<any>>
  cr_amount_failure_queue57c4d: any,
  setcr_amount_failure_queue57c4d:React.Dispatch<React.SetStateAction<any>>
  cr_amount_failure_queue57c4dProps: any 
  setcr_amount_failure_queue57c4dProps: React.Dispatch<React.SetStateAction<any>>
  remittance_info_failure_queue09d7a: any,
  setremittance_info_failure_queue09d7a:React.Dispatch<React.SetStateAction<any>>
  remittance_info_failure_queue09d7aProps: any 
  setremittance_info_failure_queue09d7aProps: React.Dispatch<React.SetStateAction<any>>
  status_failure_queue0aef8: any,
  setstatus_failure_queue0aef8:React.Dispatch<React.SetStateAction<any>>
  status_failure_queue0aef8Props: any 
  setstatus_failure_queue0aef8Props: React.Dispatch<React.SetStateAction<any>>
  product_code_success_queue7c209: any,
  setproduct_code_success_queue7c209:React.Dispatch<React.SetStateAction<any>>
  product_code_success_queue7c209Props: any 
  setproduct_code_success_queue7c209Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_success_queueeddaf: any,
  setchannel_name_success_queueeddaf:React.Dispatch<React.SetStateAction<any>>
  channel_name_success_queueeddafProps: any 
  setchannel_name_success_queueeddafProps: React.Dispatch<React.SetStateAction<any>>
  uuid_success_queuec805b: any,
  setuuid_success_queuec805b:React.Dispatch<React.SetStateAction<any>>
  uuid_success_queuec805bProps: any 
  setuuid_success_queuec805bProps: React.Dispatch<React.SetStateAction<any>>
  dr_account_operational_pending10a49: any,
  setdr_account_operational_pending10a49:React.Dispatch<React.SetStateAction<any>>
  dr_account_operational_pending10a49Props: any 
  setdr_account_operational_pending10a49Props: React.Dispatch<React.SetStateAction<any>>
  dr_amount_success_queueda254: any,
  setdr_amount_success_queueda254:React.Dispatch<React.SetStateAction<any>>
  dr_amount_success_queueda254Props: any 
  setdr_amount_success_queueda254Props: React.Dispatch<React.SetStateAction<any>>
  cr_account_success_queue60480: any,
  setcr_account_success_queue60480:React.Dispatch<React.SetStateAction<any>>
  cr_account_success_queue60480Props: any 
  setcr_account_success_queue60480Props: React.Dispatch<React.SetStateAction<any>>
  cr_amount_success_queueb80d4: any,
  setcr_amount_success_queueb80d4:React.Dispatch<React.SetStateAction<any>>
  cr_amount_success_queueb80d4Props: any 
  setcr_amount_success_queueb80d4Props: React.Dispatch<React.SetStateAction<any>>
  remittance_info_success_queue2f950: any,
  setremittance_info_success_queue2f950:React.Dispatch<React.SetStateAction<any>>
  remittance_info_success_queue2f950Props: any 
  setremittance_info_success_queue2f950Props: React.Dispatch<React.SetStateAction<any>>
  status_success_queue019a2: any,
  setstatus_success_queue019a2:React.Dispatch<React.SetStateAction<any>>
  status_success_queue019a2Props: any 
  setstatus_success_queue019a2Props: React.Dispatch<React.SetStateAction<any>>
  product_code_return_queuee5e11: any,
  setproduct_code_return_queuee5e11:React.Dispatch<React.SetStateAction<any>>
  product_code_return_queuee5e11Props: any 
  setproduct_code_return_queuee5e11Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_return_queuebdabb: any,
  setchannel_name_return_queuebdabb:React.Dispatch<React.SetStateAction<any>>
  channel_name_return_queuebdabbProps: any 
  setchannel_name_return_queuebdabbProps: React.Dispatch<React.SetStateAction<any>>
  uuid_return_queue958c9: any,
  setuuid_return_queue958c9:React.Dispatch<React.SetStateAction<any>>
  uuid_return_queue958c9Props: any 
  setuuid_return_queue958c9Props: React.Dispatch<React.SetStateAction<any>>
  dr_account_return_queuee94b2: any,
  setdr_account_return_queuee94b2:React.Dispatch<React.SetStateAction<any>>
  dr_account_return_queuee94b2Props: any 
  setdr_account_return_queuee94b2Props: React.Dispatch<React.SetStateAction<any>>
  dr_amount_return_queue2f324: any,
  setdr_amount_return_queue2f324:React.Dispatch<React.SetStateAction<any>>
  dr_amount_return_queue2f324Props: any 
  setdr_amount_return_queue2f324Props: React.Dispatch<React.SetStateAction<any>>
  cr_account_return_queue21a57: any,
  setcr_account_return_queue21a57:React.Dispatch<React.SetStateAction<any>>
  cr_account_return_queue21a57Props: any 
  setcr_account_return_queue21a57Props: React.Dispatch<React.SetStateAction<any>>
  cr_amount_return_queue13fec: any,
  setcr_amount_return_queue13fec:React.Dispatch<React.SetStateAction<any>>
  cr_amount_return_queue13fecProps: any 
  setcr_amount_return_queue13fecProps: React.Dispatch<React.SetStateAction<any>>
  remittance_info_return_queuef37f7: any,
  setremittance_info_return_queuef37f7:React.Dispatch<React.SetStateAction<any>>
  remittance_info_return_queuef37f7Props: any 
  setremittance_info_return_queuef37f7Props: React.Dispatch<React.SetStateAction<any>>
  status_return_queue95903: any,
  setstatus_return_queue95903:React.Dispatch<React.SetStateAction<any>>
  status_return_queue95903Props: any 
  setstatus_return_queue95903Props: React.Dispatch<React.SetStateAction<any>>
  outbound_or_inbound5e076: any,
  setoutbound_or_inbound5e076:React.Dispatch<React.SetStateAction<any>>
  outbound_or_inbound5e076Props: any 
  setoutbound_or_inbound5e076Props: React.Dispatch<React.SetStateAction<any>>
  search14cf0: any,
  setsearch14cf0:React.Dispatch<React.SetStateAction<any>>
  search14cf0Props: any 
  setsearch14cf0Props: React.Dispatch<React.SetStateAction<any>>
  refresh313d0: any,
  setrefresh313d0:React.Dispatch<React.SetStateAction<any>>
  refresh313d0Props: any 
  setrefresh313d0Props: React.Dispatch<React.SetStateAction<any>>
  downloadcb505: any,
  setdownloadcb505:React.Dispatch<React.SetStateAction<any>>
  downloadcb505Props: any 
  setdownloadcb505Props: React.Dispatch<React.SetStateAction<any>>
  search_label27572: any,
  setsearch_label27572:React.Dispatch<React.SetStateAction<any>>
  search_label27572Props: any 
  setsearch_label27572Props: React.Dispatch<React.SetStateAction<any>>
  trs_created_date2cea8: any,
  settrs_created_date2cea8:React.Dispatch<React.SetStateAction<any>>
  trs_created_date2cea8Props: any 
  settrs_created_date2cea8Props: React.Dispatch<React.SetStateAction<any>>
  debtor_account_no963e4: any,
  setdebtor_account_no963e4:React.Dispatch<React.SetStateAction<any>>
  debtor_account_no963e4Props: any 
  setdebtor_account_no963e4Props: React.Dispatch<React.SetStateAction<any>>
  debtor_namee2d9f: any,
  setdebtor_namee2d9f:React.Dispatch<React.SetStateAction<any>>
  debtor_namee2d9fProps: any 
  setdebtor_namee2d9fProps: React.Dispatch<React.SetStateAction<any>>
  creditor_account_noca692: any,
  setcreditor_account_noca692:React.Dispatch<React.SetStateAction<any>>
  creditor_account_noca692Props: any 
  setcreditor_account_noca692Props: React.Dispatch<React.SetStateAction<any>>
  payment_currency703d2: any,
  setpayment_currency703d2:React.Dispatch<React.SetStateAction<any>>
  payment_currency703d2Props: any 
  setpayment_currency703d2Props: React.Dispatch<React.SetStateAction<any>>
  payment_amount042b1: any,
  setpayment_amount042b1:React.Dispatch<React.SetStateAction<any>>
  payment_amount042b1Props: any 
  setpayment_amount042b1Props: React.Dispatch<React.SetStateAction<any>>
  uuid29c9f: any,
  setuuid29c9f:React.Dispatch<React.SetStateAction<any>>
  uuid29c9fProps: any 
  setuuid29c9fProps: React.Dispatch<React.SetStateAction<any>>
  status4bd75: any,
  setstatus4bd75:React.Dispatch<React.SetStateAction<any>>
  status4bd75Props: any 
  setstatus4bd75Props: React.Dispatch<React.SetStateAction<any>>
  search0e695: any,
  setsearch0e695:React.Dispatch<React.SetStateAction<any>>
  search0e695Props: any 
  setsearch0e695Props: React.Dispatch<React.SetStateAction<any>>
  cleareddfa: any,
  setcleareddfa:React.Dispatch<React.SetStateAction<any>>
  cleareddfaProps: any 
  setcleareddfaProps: React.Dispatch<React.SetStateAction<any>>
  tran_journey_label02972: any,
  settran_journey_label02972:React.Dispatch<React.SetStateAction<any>>
  tran_journey_label02972Props: any 
  settran_journey_label02972Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey1602a: any,
  settran_journey1602a:React.Dispatch<React.SetStateAction<any>>
  tran_journey1602aProps: any 
  settran_journey1602aProps: React.Dispatch<React.SetStateAction<any>>
  details_labelb25b2: any,
  setdetails_labelb25b2:React.Dispatch<React.SetStateAction<any>>
  details_labelb25b2Props: any 
  setdetails_labelb25b2Props: React.Dispatch<React.SetStateAction<any>>
  divider_tope6917: any,
  setdivider_tope6917:React.Dispatch<React.SetStateAction<any>>
  divider_tope6917Props: any 
  setdivider_tope6917Props: React.Dispatch<React.SetStateAction<any>>
  transaction_date_time_label669d7: any,
  settransaction_date_time_label669d7:React.Dispatch<React.SetStateAction<any>>
  transaction_date_time_label669d7Props: any 
  settransaction_date_time_label669d7Props: React.Dispatch<React.SetStateAction<any>>
  status_labelf3713: any,
  setstatus_labelf3713:React.Dispatch<React.SetStateAction<any>>
  status_labelf3713Props: any 
  setstatus_labelf3713Props: React.Dispatch<React.SetStateAction<any>>
  transaction_date_time14856: any,
  settransaction_date_time14856:React.Dispatch<React.SetStateAction<any>>
  transaction_date_time14856Props: any 
  settransaction_date_time14856Props: React.Dispatch<React.SetStateAction<any>>
  status88bc7: any,
  setstatus88bc7:React.Dispatch<React.SetStateAction<any>>
  status88bc7Props: any 
  setstatus88bc7Props: React.Dispatch<React.SetStateAction<any>>
  processed_by_label542e8: any,
  setprocessed_by_label542e8:React.Dispatch<React.SetStateAction<any>>
  processed_by_label542e8Props: any 
  setprocessed_by_label542e8Props: React.Dispatch<React.SetStateAction<any>>
  debit_account_label3b1b7: any,
  setdebit_account_label3b1b7:React.Dispatch<React.SetStateAction<any>>
  debit_account_label3b1b7Props: any 
  setdebit_account_label3b1b7Props: React.Dispatch<React.SetStateAction<any>>
  processed_byd2b69: any,
  setprocessed_byd2b69:React.Dispatch<React.SetStateAction<any>>
  processed_byd2b69Props: any 
  setprocessed_byd2b69Props: React.Dispatch<React.SetStateAction<any>>
  debit_account36b40: any,
  setdebit_account36b40:React.Dispatch<React.SetStateAction<any>>
  debit_account36b40Props: any 
  setdebit_account36b40Props: React.Dispatch<React.SetStateAction<any>>
  currency_labele21ba: any,
  setcurrency_labele21ba:React.Dispatch<React.SetStateAction<any>>
  currency_labele21baProps: any 
  setcurrency_labele21baProps: React.Dispatch<React.SetStateAction<any>>
  credit_account_label65c7b: any,
  setcredit_account_label65c7b:React.Dispatch<React.SetStateAction<any>>
  credit_account_label65c7bProps: any 
  setcredit_account_label65c7bProps: React.Dispatch<React.SetStateAction<any>>
  currency9c8a2: any,
  setcurrency9c8a2:React.Dispatch<React.SetStateAction<any>>
  currency9c8a2Props: any 
  setcurrency9c8a2Props: React.Dispatch<React.SetStateAction<any>>
  credit_account0d1f4: any,
  setcredit_account0d1f4:React.Dispatch<React.SetStateAction<any>>
  credit_account0d1f4Props: any 
  setcredit_account0d1f4Props: React.Dispatch<React.SetStateAction<any>>
  amount_labelfd725: any,
  setamount_labelfd725:React.Dispatch<React.SetStateAction<any>>
  amount_labelfd725Props: any 
  setamount_labelfd725Props: React.Dispatch<React.SetStateAction<any>>
  transaction_reference_labelb1ca9: any,
  settransaction_reference_labelb1ca9:React.Dispatch<React.SetStateAction<any>>
  transaction_reference_labelb1ca9Props: any 
  settransaction_reference_labelb1ca9Props: React.Dispatch<React.SetStateAction<any>>
  amount01416: any,
  setamount01416:React.Dispatch<React.SetStateAction<any>>
  amount01416Props: any 
  setamount01416Props: React.Dispatch<React.SetStateAction<any>>
  transaction_reference500d6: any,
  settransaction_reference500d6:React.Dispatch<React.SetStateAction<any>>
  transaction_reference500d6Props: any 
  settransaction_reference500d6Props: React.Dispatch<React.SetStateAction<any>>
  divider_bottom8bad5: any,
  setdivider_bottom8bad5:React.Dispatch<React.SetStateAction<any>>
  divider_bottom8bad5Props: any 
  setdivider_bottom8bad5Props: React.Dispatch<React.SetStateAction<any>>
  view_msg_data_btne6a88: any,
  setview_msg_data_btne6a88:React.Dispatch<React.SetStateAction<any>>
  view_msg_data_btne6a88Props: any 
  setview_msg_data_btne6a88Props: React.Dispatch<React.SetStateAction<any>>
  view_tran_log_btn9cd8c: any,
  setview_tran_log_btn9cd8c:React.Dispatch<React.SetStateAction<any>>
  view_tran_log_btn9cd8cProps: any 
  setview_tran_log_btn9cd8cProps: React.Dispatch<React.SetStateAction<any>>
  msg_data_label7b760: any,
  setmsg_data_label7b760:React.Dispatch<React.SetStateAction<any>>
  msg_data_label7b760Props: any 
  setmsg_data_label7b760Props: React.Dispatch<React.SetStateAction<any>>
  divider_topf46a0: any,
  setdivider_topf46a0:React.Dispatch<React.SetStateAction<any>>
  divider_topf46a0Props: any 
  setdivider_topf46a0Props: React.Dispatch<React.SetStateAction<any>>
  xmlviewer9fe8d: any,
  setxmlviewer9fe8d:React.Dispatch<React.SetStateAction<any>>
  xmlviewer9fe8dProps: any 
  setxmlviewer9fe8dProps: React.Dispatch<React.SetStateAction<any>>
  divider_bottom6920d: any,
  setdivider_bottom6920d:React.Dispatch<React.SetStateAction<any>>
  divider_bottom6920dProps: any 
  setdivider_bottom6920dProps: React.Dispatch<React.SetStateAction<any>>
  cancel_btn5e840: any,
  setcancel_btn5e840:React.Dispatch<React.SetStateAction<any>>
  cancel_btn5e840Props: any 
  setcancel_btn5e840Props: React.Dispatch<React.SetStateAction<any>>
  transaction_log_label7b760: any,
  settransaction_log_label7b760:React.Dispatch<React.SetStateAction<any>>
  transaction_log_label7b760Props: any 
  settransaction_log_label7b760Props: React.Dispatch<React.SetStateAction<any>>
  req_jsonviewerc80ab: any,
  setreq_jsonviewerc80ab:React.Dispatch<React.SetStateAction<any>>
  req_jsonviewerc80abProps: any 
  setreq_jsonviewerc80abProps: React.Dispatch<React.SetStateAction<any>>
  res_jsonviewer9d6d1: any,
  setres_jsonviewer9d6d1:React.Dispatch<React.SetStateAction<any>>
  res_jsonviewer9d6d1Props: any 
  setres_jsonviewer9d6d1Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  transaction_v1: any 
  settransaction_v1: React.Dispatch<React.SetStateAction<any>>
  transaction_v1Props: any 
  settransaction_v1Props: React.Dispatch<React.SetStateAction<any>>
  transactionsearch_v1: any 
  settransactionsearch_v1: React.Dispatch<React.SetStateAction<any>>
  transactionsearch_v1Props: any 
  settransactionsearch_v1Props: React.Dispatch<React.SetStateAction<any>>
  transactionjourney_v1: any 
  settransactionjourney_v1: React.Dispatch<React.SetStateAction<any>>
  transactionjourney_v1Props: any 
  settransactionjourney_v1Props: React.Dispatch<React.SetStateAction<any>>
  tranjourneydetails_v1: any 
  settranjourneydetails_v1: React.Dispatch<React.SetStateAction<any>>
  tranjourneydetails_v1Props: any 
  settranjourneydetails_v1Props: React.Dispatch<React.SetStateAction<any>>
  messagedataview_v1: any 
  setmessagedataview_v1: React.Dispatch<React.SetStateAction<any>>
  messagedataview_v1Props: any 
  setmessagedataview_v1Props: React.Dispatch<React.SetStateAction<any>>
  trandataview_v1: any 
  settrandataview_v1: React.Dispatch<React.SetStateAction<any>>
  trandataview_v1Props: any 
  settrandataview_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_combocurrencysearch_v1Props: any 
  setdfd_combocurrencysearch_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_transaction_v1Props: any 
  setdfd_transaction_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_journey_v1Props: any 
  setdfd_journey_v1Props: React.Dispatch<React.SetStateAction<any>>

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
  tableData: Record<string, any>,
  setTableData: React.Dispatch<React.SetStateAction<Record<string, any>>>    
  paginationDetails: Record<string, any>,
  setpaginationDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>
  eventEmitterData: any,
  setEventEmitterData: React.Dispatch<React.SetStateAction<any>>
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
        const [tran_main_group1dc7f, settran_main_group1dc7f ] = React.useState<any>({}) 
    const [tran_main_group1dc7fProps, settran_main_group1dc7fProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tran_tab_group08b64, settran_tab_group08b64 ] = React.useState<any>({}) 
    const [tran_tab_group08b64Props, settran_tab_group08b64Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_all_tab4a963, setview_all_tab4a963 ] = React.useState<any>({}) 
    const [view_all_tab4a963Props, setview_all_tab4a963Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [view_all_tablec9e87, setview_all_tablec9e87 ] = React.useState<any>([]) 
    const [view_all_tablec9e87Props, setview_all_tablec9e87Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [failure_queue_tab69f01, setfailure_queue_tab69f01 ] = React.useState<any>({}) 
    const [failure_queue_tab69f01Props, setfailure_queue_tab69f01Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [failure_queue_tablea476f, setfailure_queue_tablea476f ] = React.useState<any>([]) 
    const [failure_queue_tablea476fProps, setfailure_queue_tablea476fProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [success_queue_tabef582, setsuccess_queue_tabef582 ] = React.useState<any>({}) 
    const [success_queue_tabef582Props, setsuccess_queue_tabef582Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [success_queue_table63aae, setsuccess_queue_table63aae ] = React.useState<any>([]) 
    const [success_queue_table63aaeProps, setsuccess_queue_table63aaeProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [return_queue_tab5611e, setreturn_queue_tab5611e ] = React.useState<any>({}) 
    const [return_queue_tab5611eProps, setreturn_queue_tab5611eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [return_queue_table267f0, setreturn_queue_table267f0 ] = React.useState<any>([]) 
    const [return_queue_table267f0Props, setreturn_queue_table267f0Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [main_group9066f, setmain_group9066f ] = React.useState<any>({}) 
    const [main_group9066fProps, setmain_group9066fProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tran_journey_group9eb2e, settran_journey_group9eb2e ] = React.useState<any>({}) 
    const [tran_journey_group9eb2eProps, settran_journey_group9eb2eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [journey_details_groupd9a0e, setjourney_details_groupd9a0e ] = React.useState<any>({}) 
    const [journey_details_groupd9a0eProps, setjourney_details_groupd9a0eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tran_data_group84f25, settran_data_group84f25 ] = React.useState<any>({}) 
    const [tran_data_group84f25Props, settran_data_group84f25Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [req_data_group8d4d7, setreq_data_group8d4d7 ] = React.useState<any>({}) 
    const [req_data_group8d4d7Props, setreq_data_group8d4d7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [res_data_group9d75a, setres_data_group9d75a ] = React.useState<any>({}) 
    const [res_data_group9d75aProps, setres_data_group9d75aProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [product_code_view_allb0df6,setproduct_code_view_allb0df6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name_view_all33724,setchannel_name_view_all33724] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuid_view_allc0a46,setuuid_view_allc0a46] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_account_view_all54da6,setdr_account_view_all54da6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amount_view_all88d6b,setdr_amount_view_all88d6b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_account_view_alld4b39,setcr_account_view_alld4b39] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_amount_view_all19d14,setcr_amount_view_all19d14] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info_view_all82afd,setremittance_info_view_all82afd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status_view_all47e6b,setstatus_view_all47e6b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [log_btnfe134,setlog_btnfe134] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code_failure_queue12297,setproduct_code_failure_queue12297] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name_failure_queue42953,setchannel_name_failure_queue42953] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuid_failure_queue03c86,setuuid_failure_queue03c86] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_account_failure_queuef9d2d,setdr_account_failure_queuef9d2d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amount_failure_queue95d4e,setdr_amount_failure_queue95d4e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_account_failure_queuea7246,setcr_account_failure_queuea7246] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_amount_failure_queue57c4d,setcr_amount_failure_queue57c4d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info_failure_queue09d7a,setremittance_info_failure_queue09d7a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status_failure_queue0aef8,setstatus_failure_queue0aef8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code_success_queue7c209,setproduct_code_success_queue7c209] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name_success_queueeddaf,setchannel_name_success_queueeddaf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuid_success_queuec805b,setuuid_success_queuec805b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_account_operational_pending10a49,setdr_account_operational_pending10a49] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amount_success_queueda254,setdr_amount_success_queueda254] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_account_success_queue60480,setcr_account_success_queue60480] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_amount_success_queueb80d4,setcr_amount_success_queueb80d4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info_success_queue2f950,setremittance_info_success_queue2f950] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status_success_queue019a2,setstatus_success_queue019a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [product_code_return_queuee5e11,setproduct_code_return_queuee5e11] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [channel_name_return_queuebdabb,setchannel_name_return_queuebdabb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuid_return_queue958c9,setuuid_return_queue958c9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_account_return_queuee94b2,setdr_account_return_queuee94b2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dr_amount_return_queue2f324,setdr_amount_return_queue2f324] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_account_return_queue21a57,setcr_account_return_queue21a57] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cr_amount_return_queue13fec,setcr_amount_return_queue13fec] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [remittance_info_return_queuef37f7,setremittance_info_return_queuef37f7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status_return_queue95903,setstatus_return_queue95903] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [outbound_or_inbound5e076,setoutbound_or_inbound5e076] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [search14cf0,setsearch14cf0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [refresh313d0,setrefresh313d0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [downloadcb505,setdownloadcb505] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [search_label27572,setsearch_label27572] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [trs_created_date2cea8,settrs_created_date2cea8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debtor_account_no963e4,setdebtor_account_no963e4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debtor_namee2d9f,setdebtor_namee2d9f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [creditor_account_noca692,setcreditor_account_noca692] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_currency703d2,setpayment_currency703d2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_amount042b1,setpayment_amount042b1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [uuid29c9f,setuuid29c9f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status4bd75,setstatus4bd75] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [search0e695,setsearch0e695] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cleareddfa,setcleareddfa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_journey_label02972,settran_journey_label02972] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_journey1602a,settran_journey1602a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [details_labelb25b2,setdetails_labelb25b2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [divider_tope6917,setdivider_tope6917] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_date_time_label669d7,settransaction_date_time_label669d7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status_labelf3713,setstatus_labelf3713] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_date_time14856,settransaction_date_time14856] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [status88bc7,setstatus88bc7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [processed_by_label542e8,setprocessed_by_label542e8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_label3b1b7,setdebit_account_label3b1b7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [processed_byd2b69,setprocessed_byd2b69] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account36b40,setdebit_account36b40] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency_labele21ba,setcurrency_labele21ba] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [credit_account_label65c7b,setcredit_account_label65c7b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency9c8a2,setcurrency9c8a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [credit_account0d1f4,setcredit_account0d1f4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amount_labelfd725,setamount_labelfd725] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_reference_labelb1ca9,settransaction_reference_labelb1ca9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amount01416,setamount01416] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_reference500d6,settransaction_reference500d6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [divider_bottom8bad5,setdivider_bottom8bad5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_msg_data_btne6a88,setview_msg_data_btne6a88] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_tran_log_btn9cd8c,setview_tran_log_btn9cd8c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [msg_data_label7b760,setmsg_data_label7b760] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [divider_topf46a0,setdivider_topf46a0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [xmlviewer9fe8d,setxmlviewer9fe8d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [divider_bottom6920d,setdivider_bottom6920d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cancel_btn5e840,setcancel_btn5e840] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_log_label7b760,settransaction_log_label7b760] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [req_jsonviewerc80ab,setreq_jsonviewerc80ab] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [res_jsonviewer9d6d1,setres_jsonviewer9d6d1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<Record<string, boolean>>({       columnproduct_code_view_allb0df6:false,
       columnchannel_name_view_all33724:false,
       columnuuid_view_allc0a46:false,
       columndr_account_view_all54da6:false,
       columndr_amount_view_all88d6b:false,
       columncr_account_view_alld4b39:false,
       columncr_Amount_view_all19d14:false,
       columnremittance_info_view_all82afd:false,
       columnstatus_view_all47e6b:false,
       buttonlog_btnfe134:false,
       columnproduct_code_failure_queue12297:false,
       columnchannel_name_failure_queue42953:false,
       columnuuid_failure_queue03c86:false,
       columndr_account_failure_queuef9d2d:false,
       columndr_amount_failure_queue95d4e:false,
       columncr_account_failure_queuea7246:false,
       columncr_Amount_failure_queue57c4d:false,
       columnremittance_info_failure_queue09d7a:false,
       columnstatus_failure_queue0aef8:false,
       columnproduct_code_success_queue7c209:false,
       columnchannel_name_success_queueeddaf:false,
       columnuuid_success_queuec805b:false,
       columndr_account_operational_pending10a49:false,
       columndr_amount_success_queueda254:false,
       columncr_account_success_queue60480:false,
       columncr_Amount_success_queueb80d4:false,
       columnremittance_info_success_queue2f950:false,
       columnstatus_success_queue019a2:false,
       columnproduct_code_return_queuee5e11:false,
       columnchannel_name_return_queuebdabb:false,
       columnuuid_return_queue958c9:false,
       columndr_account_return_queuee94b2:false,
       columndr_amount_return_queue2f324:false,
       columncr_account_return_queue21a57:false,
       columncr_Amount_return_queue13fec:false,
       columnremittance_info_return_queuef37f7:false,
       columnstatus_return_queue95903:false,
       switchoutbound_or_inbound5e076:false,
       buttonsearch14cf0:false,
       buttonrefresh313d0:false,
       buttondownloadcb505:false,
       textsearch_label27572:false,
       datepickertrs_created_date2cea8:false,
       textinputdebtor_account_no963e4:false,
       textinputdebtor_namee2d9f:false,
       textinputcreditor_account_noca692:false,
       dropdownpayment_currency703d2:false,
       textinputpayment_amount042b1:false,
       textinputuuid29c9f:false,
       textinputstatus4bd75:false,
       buttonsearch0e695:false,
       buttoncleareddfa:false,
       texttran_journey_label02972:false,
       timelinetran_journey1602a:false,
       textdetails_labelb25b2:false,
       dividerdivider_tope6917:false,
       texttransaction_date_time_label669d7:false,
       textstatus_labelf3713:false,
       texttransaction_date_time14856:false,
       textstatus88bc7:false,
       textprocessed_by_label542e8:false,
       textdebit_account_label3b1b7:false,
       textprocessed_byd2b69:false,
       textdebit_account36b40:false,
       textcurrency_labele21ba:false,
       textcredit_account_label65c7b:false,
       textcurrency9c8a2:false,
       textcredit_account0d1f4:false,
       textamount_labelfd725:false,
       texttransaction_reference_labelb1ca9:false,
       textamount01416:false,
       texttransaction_reference500d6:false,
       dividerdivider_bottom8bad5:false,
       buttonview_msg_data_btne6a88:false,
       buttonview_tran_log_btn9cd8c:false,
       textmsg_data_label7b760:false,
       dividerdivider_topf46a0:false,
       xmlviewerxmlviewer9fe8d:false,
       dividerdivider_bottom6920d:false,
       buttoncancel_btn5e840:false,
       texttransaction_log_label7b760:false,
       jsonviewerreq_jsonviewerc80ab:false,
       jsonviewerres_jsonviewer9d6d1:false,
       grouptran_main_group1dc7f:false,
       grouptran_tab_group08b64:false,
       groupview_all_tab4a963:false,
       tableview_all_tablec9e87:false,
       groupfailure_queue_tab69f01:false,
       tablefailure_queue_tablea476f:false,
       groupsuccess_queue_tabef582:false,
       tablesuccess_queue_table63aae:false,
       groupreturn_queue_tab5611e:false,
       tablereturn_queue_table267f0:false,
       groupmain_group9066f:false,
       grouptran_journey_group9eb2e:false,
       groupjourney_details_groupd9a0e:false,
       grouptran_data_group84f25:false,
       groupreq_data_group8d4d7:false,
       groupres_data_group9d75a:false,
      })

  ////// screen states 
  const [transaction_v1,settransaction_v1] = React.useState<any>({})
  const [transaction_v1Props,settransaction_v1Props] = React.useState<any>({})
  const [transactionsearch_v1,settransactionsearch_v1] = React.useState<any>({})
  const [transactionsearch_v1Props,settransactionsearch_v1Props] = React.useState<any>({})
  const [transactionjourney_v1,settransactionjourney_v1] = React.useState<any>({})
  const [transactionjourney_v1Props,settransactionjourney_v1Props] = React.useState<any>({})
  const [tranjourneydetails_v1,settranjourneydetails_v1] = React.useState<any>({})
  const [tranjourneydetails_v1Props,settranjourneydetails_v1Props] = React.useState<any>({})
  const [messagedataview_v1,setmessagedataview_v1] = React.useState<any>({})
  const [messagedataview_v1Props,setmessagedataview_v1Props] = React.useState<any>({})
  const [trandataview_v1,settrandataview_v1] = React.useState<any>({})
  const [trandataview_v1Props,settrandataview_v1Props] = React.useState<any>({})

///////// dfd
  const [dfd_combocurrencysearch_v1Props,setdfd_combocurrencysearch_v1Props] = React.useState<any>([])
  const [dfd_transaction_v1Props,setdfd_transaction_v1Props] = React.useState<any>([])
  const [dfd_journey_v1Props,setdfd_journey_v1Props] = React.useState<any>([])
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
    const [tableData, setTableData] = React.useState<any>({})      
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
        tran_main_group1dc7f, 
        settran_main_group1dc7f,
        tran_main_group1dc7fProps, 
        settran_main_group1dc7fProps,
        tran_tab_group08b64, 
        settran_tab_group08b64,
        tran_tab_group08b64Props, 
        settran_tab_group08b64Props,
        view_all_tab4a963, 
        setview_all_tab4a963,
        view_all_tab4a963Props, 
        setview_all_tab4a963Props,
        view_all_tablec9e87, 
        setview_all_tablec9e87,
        view_all_tablec9e87Props, 
        setview_all_tablec9e87Props,
        failure_queue_tab69f01, 
        setfailure_queue_tab69f01,
        failure_queue_tab69f01Props, 
        setfailure_queue_tab69f01Props,
        failure_queue_tablea476f, 
        setfailure_queue_tablea476f,
        failure_queue_tablea476fProps, 
        setfailure_queue_tablea476fProps,
        success_queue_tabef582, 
        setsuccess_queue_tabef582,
        success_queue_tabef582Props, 
        setsuccess_queue_tabef582Props,
        success_queue_table63aae, 
        setsuccess_queue_table63aae,
        success_queue_table63aaeProps, 
        setsuccess_queue_table63aaeProps,
        return_queue_tab5611e, 
        setreturn_queue_tab5611e,
        return_queue_tab5611eProps, 
        setreturn_queue_tab5611eProps,
        return_queue_table267f0, 
        setreturn_queue_table267f0,
        return_queue_table267f0Props, 
        setreturn_queue_table267f0Props,
        main_group9066f, 
        setmain_group9066f,
        main_group9066fProps, 
        setmain_group9066fProps,
        tran_journey_group9eb2e, 
        settran_journey_group9eb2e,
        tran_journey_group9eb2eProps, 
        settran_journey_group9eb2eProps,
        journey_details_groupd9a0e, 
        setjourney_details_groupd9a0e,
        journey_details_groupd9a0eProps, 
        setjourney_details_groupd9a0eProps,
        tran_data_group84f25, 
        settran_data_group84f25,
        tran_data_group84f25Props, 
        settran_data_group84f25Props,
        req_data_group8d4d7, 
        setreq_data_group8d4d7,
        req_data_group8d4d7Props, 
        setreq_data_group8d4d7Props,
        res_data_group9d75a, 
        setres_data_group9d75a,
        res_data_group9d75aProps, 
        setres_data_group9d75aProps,
        product_code_view_allb0df6,
        setproduct_code_view_allb0df6, 
        channel_name_view_all33724,
        setchannel_name_view_all33724, 
        uuid_view_allc0a46,
        setuuid_view_allc0a46, 
        dr_account_view_all54da6,
        setdr_account_view_all54da6, 
        dr_amount_view_all88d6b,
        setdr_amount_view_all88d6b, 
        cr_account_view_alld4b39,
        setcr_account_view_alld4b39, 
        cr_amount_view_all19d14,
        setcr_amount_view_all19d14, 
        remittance_info_view_all82afd,
        setremittance_info_view_all82afd, 
        status_view_all47e6b,
        setstatus_view_all47e6b, 
        log_btnfe134,
        setlog_btnfe134, 
        product_code_failure_queue12297,
        setproduct_code_failure_queue12297, 
        channel_name_failure_queue42953,
        setchannel_name_failure_queue42953, 
        uuid_failure_queue03c86,
        setuuid_failure_queue03c86, 
        dr_account_failure_queuef9d2d,
        setdr_account_failure_queuef9d2d, 
        dr_amount_failure_queue95d4e,
        setdr_amount_failure_queue95d4e, 
        cr_account_failure_queuea7246,
        setcr_account_failure_queuea7246, 
        cr_amount_failure_queue57c4d,
        setcr_amount_failure_queue57c4d, 
        remittance_info_failure_queue09d7a,
        setremittance_info_failure_queue09d7a, 
        status_failure_queue0aef8,
        setstatus_failure_queue0aef8, 
        product_code_success_queue7c209,
        setproduct_code_success_queue7c209, 
        channel_name_success_queueeddaf,
        setchannel_name_success_queueeddaf, 
        uuid_success_queuec805b,
        setuuid_success_queuec805b, 
        dr_account_operational_pending10a49,
        setdr_account_operational_pending10a49, 
        dr_amount_success_queueda254,
        setdr_amount_success_queueda254, 
        cr_account_success_queue60480,
        setcr_account_success_queue60480, 
        cr_amount_success_queueb80d4,
        setcr_amount_success_queueb80d4, 
        remittance_info_success_queue2f950,
        setremittance_info_success_queue2f950, 
        status_success_queue019a2,
        setstatus_success_queue019a2, 
        product_code_return_queuee5e11,
        setproduct_code_return_queuee5e11, 
        channel_name_return_queuebdabb,
        setchannel_name_return_queuebdabb, 
        uuid_return_queue958c9,
        setuuid_return_queue958c9, 
        dr_account_return_queuee94b2,
        setdr_account_return_queuee94b2, 
        dr_amount_return_queue2f324,
        setdr_amount_return_queue2f324, 
        cr_account_return_queue21a57,
        setcr_account_return_queue21a57, 
        cr_amount_return_queue13fec,
        setcr_amount_return_queue13fec, 
        remittance_info_return_queuef37f7,
        setremittance_info_return_queuef37f7, 
        status_return_queue95903,
        setstatus_return_queue95903, 
        outbound_or_inbound5e076,
        setoutbound_or_inbound5e076, 
        search14cf0,
        setsearch14cf0, 
        refresh313d0,
        setrefresh313d0, 
        downloadcb505,
        setdownloadcb505, 
        search_label27572,
        setsearch_label27572, 
        trs_created_date2cea8,
        settrs_created_date2cea8, 
        debtor_account_no963e4,
        setdebtor_account_no963e4, 
        debtor_namee2d9f,
        setdebtor_namee2d9f, 
        creditor_account_noca692,
        setcreditor_account_noca692, 
        payment_currency703d2,
        setpayment_currency703d2, 
        payment_amount042b1,
        setpayment_amount042b1, 
        uuid29c9f,
        setuuid29c9f, 
        status4bd75,
        setstatus4bd75, 
        search0e695,
        setsearch0e695, 
        cleareddfa,
        setcleareddfa, 
        tran_journey_label02972,
        settran_journey_label02972, 
        tran_journey1602a,
        settran_journey1602a, 
        details_labelb25b2,
        setdetails_labelb25b2, 
        divider_tope6917,
        setdivider_tope6917, 
        transaction_date_time_label669d7,
        settransaction_date_time_label669d7, 
        status_labelf3713,
        setstatus_labelf3713, 
        transaction_date_time14856,
        settransaction_date_time14856, 
        status88bc7,
        setstatus88bc7, 
        processed_by_label542e8,
        setprocessed_by_label542e8, 
        debit_account_label3b1b7,
        setdebit_account_label3b1b7, 
        processed_byd2b69,
        setprocessed_byd2b69, 
        debit_account36b40,
        setdebit_account36b40, 
        currency_labele21ba,
        setcurrency_labele21ba, 
        credit_account_label65c7b,
        setcredit_account_label65c7b, 
        currency9c8a2,
        setcurrency9c8a2, 
        credit_account0d1f4,
        setcredit_account0d1f4, 
        amount_labelfd725,
        setamount_labelfd725, 
        transaction_reference_labelb1ca9,
        settransaction_reference_labelb1ca9, 
        amount01416,
        setamount01416, 
        transaction_reference500d6,
        settransaction_reference500d6, 
        divider_bottom8bad5,
        setdivider_bottom8bad5, 
        view_msg_data_btne6a88,
        setview_msg_data_btne6a88, 
        view_tran_log_btn9cd8c,
        setview_tran_log_btn9cd8c, 
        msg_data_label7b760,
        setmsg_data_label7b760, 
        divider_topf46a0,
        setdivider_topf46a0, 
        xmlviewer9fe8d,
        setxmlviewer9fe8d, 
        divider_bottom6920d,
        setdivider_bottom6920d, 
        cancel_btn5e840,
        setcancel_btn5e840, 
        transaction_log_label7b760,
        settransaction_log_label7b760, 
        req_jsonviewerc80ab,
        setreq_jsonviewerc80ab, 
        res_jsonviewer9d6d1,
        setres_jsonviewer9d6d1, 
        ////// screen states 
          transaction_v1,
          settransaction_v1,
          transaction_v1Props,
          settransaction_v1Props,
          transactionsearch_v1,
          settransactionsearch_v1,
          transactionsearch_v1Props,
          settransactionsearch_v1Props,
          transactionjourney_v1,
          settransactionjourney_v1,
          transactionjourney_v1Props,
          settransactionjourney_v1Props,
          tranjourneydetails_v1,
          settranjourneydetails_v1,
          tranjourneydetails_v1Props,
          settranjourneydetails_v1Props,
          messagedataview_v1,
          setmessagedataview_v1,
          messagedataview_v1Props,
          setmessagedataview_v1Props,
          trandataview_v1,
          settrandataview_v1,
          trandataview_v1Props,
          settrandataview_v1Props,
        //////////

        ///////// dfd
        dfd_combocurrencysearch_v1Props,
        setdfd_combocurrencysearch_v1Props,
        dfd_transaction_v1Props,
        setdfd_transaction_v1Props,
        dfd_journey_v1Props,
        setdfd_journey_v1Props,
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
        tableData,
        setTableData,
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