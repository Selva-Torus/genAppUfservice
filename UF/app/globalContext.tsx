


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  currentToken: any 
  setCurrentToken: React.Dispatch<React.SetStateAction<any>>
  matchedAccessProfileData: any;
  setMatchedAccessProfileData: React.Dispatch<React.SetStateAction<any>>
  overallgroup4d9a0: any 
  setoverallgroup4d9a0: React.Dispatch<React.SetStateAction<any>>
  overallgroup4d9a0Props: any 
  setoverallgroup4d9a0Props: React.Dispatch<React.SetStateAction<any>>
  itax_main_tab_group216b3: any 
  setitax_main_tab_group216b3: React.Dispatch<React.SetStateAction<any>>
  itax_main_tab_group216b3Props: any 
  setitax_main_tab_group216b3Props: React.Dispatch<React.SetStateAction<any>>
  tab_process_new_prn5597e: any 
  settab_process_new_prn5597e: React.Dispatch<React.SetStateAction<any>>
  tab_process_new_prn5597eProps: any 
  settab_process_new_prn5597eProps: React.Dispatch<React.SetStateAction<any>>
  itax_source_table1afd6: any 
  setitax_source_table1afd6: React.Dispatch<React.SetStateAction<any>>
  itax_source_table1afd6Props: any 
  setitax_source_table1afd6Props: React.Dispatch<React.SetStateAction<any>>
  tab_credit_process_group546cc: any 
  settab_credit_process_group546cc: React.Dispatch<React.SetStateAction<any>>
  tab_credit_process_group546ccProps: any 
  settab_credit_process_group546ccProps: React.Dispatch<React.SetStateAction<any>>
  credit_process_table0cd4c: any 
  setcredit_process_table0cd4c: React.Dispatch<React.SetStateAction<any>>
  credit_process_table0cd4cProps: any 
  setcredit_process_table0cd4cProps: React.Dispatch<React.SetStateAction<any>>
  tab_view_processed_prn29a93: any 
  settab_view_processed_prn29a93: React.Dispatch<React.SetStateAction<any>>
  tab_view_processed_prn29a93Props: any 
  settab_view_processed_prn29a93Props: React.Dispatch<React.SetStateAction<any>>
  view_processed_prn_table8f5a5: any 
  setview_processed_prn_table8f5a5: React.Dispatch<React.SetStateAction<any>>
  view_processed_prn_table8f5a5Props: any 
  setview_processed_prn_table8f5a5Props: React.Dispatch<React.SetStateAction<any>>
  search_group9a617: any 
  setsearch_group9a617: React.Dispatch<React.SetStateAction<any>>
  search_group9a617Props: any 
  setsearch_group9a617Props: React.Dispatch<React.SetStateAction<any>>
  add_prn_group1a4d8: any 
  setadd_prn_group1a4d8: React.Dispatch<React.SetStateAction<any>>
  add_prn_group1a4d8Props: any 
  setadd_prn_group1a4d8Props: React.Dispatch<React.SetStateAction<any>>
  view_detail_back_group50bce: any 
  setview_detail_back_group50bce: React.Dispatch<React.SetStateAction<any>>
  view_detail_back_group50bceProps: any 
  setview_detail_back_group50bceProps: React.Dispatch<React.SetStateAction<any>>
  view_detail_group73f21: any 
  setview_detail_group73f21: React.Dispatch<React.SetStateAction<any>>
  view_detail_group73f21Props: any 
  setview_detail_group73f21Props: React.Dispatch<React.SetStateAction<any>>
  prn_no_datails_tablefc106: any 
  setprn_no_datails_tablefc106: React.Dispatch<React.SetStateAction<any>>
  prn_no_datails_tablefc106Props: any 
  setprn_no_datails_tablefc106Props: React.Dispatch<React.SetStateAction<any>>
  viewed_details_grp73f21: any 
  setviewed_details_grp73f21: React.Dispatch<React.SetStateAction<any>>
  viewed_details_grp73f21Props: any 
  setviewed_details_grp73f21Props: React.Dispatch<React.SetStateAction<any>>
  prn_no_details_tablefc106: any 
  setprn_no_details_tablefc106: React.Dispatch<React.SetStateAction<any>>
  prn_no_details_tablefc106Props: any 
  setprn_no_details_tablefc106Props: React.Dispatch<React.SetStateAction<any>>
  tran_journey_group30215: any 
  settran_journey_group30215: React.Dispatch<React.SetStateAction<any>>
  tran_journey_group30215Props: any 
  settran_journey_group30215Props: React.Dispatch<React.SetStateAction<any>>
  view_process_detail_groupe7fe3: any 
  setview_process_detail_groupe7fe3: React.Dispatch<React.SetStateAction<any>>
  view_process_detail_groupe7fe3Props: any 
  setview_process_detail_groupe7fe3Props: React.Dispatch<React.SetStateAction<any>>
  process_details_json_viewer_group64f76: any 
  setprocess_details_json_viewer_group64f76: React.Dispatch<React.SetStateAction<any>>
  process_details_json_viewer_group64f76Props: any 
  setprocess_details_json_viewer_group64f76Props: React.Dispatch<React.SetStateAction<any>>
  view_error_detail_group21845: any 
  setview_error_detail_group21845: React.Dispatch<React.SetStateAction<any>>
  view_error_detail_group21845Props: any 
  setview_error_detail_group21845Props: React.Dispatch<React.SetStateAction<any>>
  error_details_json_groupc13f1: any 
  seterror_details_json_groupc13f1: React.Dispatch<React.SetStateAction<any>>
  error_details_json_groupc13f1Props: any 
  seterror_details_json_groupc13f1Props: React.Dispatch<React.SetStateAction<any>>
  prn_details_group00560: any 
  setprn_details_group00560: React.Dispatch<React.SetStateAction<any>>
  prn_details_group00560Props: any 
  setprn_details_group00560Props: React.Dispatch<React.SetStateAction<any>>
  prn_datails_table2ad52: any 
  setprn_datails_table2ad52: React.Dispatch<React.SetStateAction<any>>
  prn_datails_table2ad52Props: any 
  setprn_datails_table2ad52Props: React.Dispatch<React.SetStateAction<any>>
  subscreen_groupc0414: any 
  setsubscreen_groupc0414: React.Dispatch<React.SetStateAction<any>>
  subscreen_groupc0414Props: any 
  setsubscreen_groupc0414Props: React.Dispatch<React.SetStateAction<any>>
  ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86: any 
  setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86: React.Dispatch<React.SetStateAction<any>>
  ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props: any 
  setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_cheque_group239dd: any 
  setpayment_type_cheque_group239dd: React.Dispatch<React.SetStateAction<any>>
  payment_type_cheque_group239ddProps: any 
  setpayment_type_cheque_group239ddProps: React.Dispatch<React.SetStateAction<any>>
  ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7: any 
  setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7: React.Dispatch<React.SetStateAction<any>>
  ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props: any 
  setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_dt_groupedf52: any 
  setpayment_type_dt_groupedf52: React.Dispatch<React.SetStateAction<any>>
  payment_type_dt_groupedf52Props: any 
  setpayment_type_dt_groupedf52Props: React.Dispatch<React.SetStateAction<any>>
  new_prn_main_group21910: any 
  setnew_prn_main_group21910: React.Dispatch<React.SetStateAction<any>>
  new_prn_main_group21910Props: any 
  setnew_prn_main_group21910Props: React.Dispatch<React.SetStateAction<any>>
  authorization_memo_file_group17228: any 
  setauthorization_memo_file_group17228: React.Dispatch<React.SetStateAction<any>>
  authorization_memo_file_group17228Props: any 
  setauthorization_memo_file_group17228Props: React.Dispatch<React.SetStateAction<any>>
  documentviewer_group0a3fb: any 
  setdocumentviewer_group0a3fb: React.Dispatch<React.SetStateAction<any>>
  documentviewer_group0a3fbProps: any 
  setdocumentviewer_group0a3fbProps: React.Dispatch<React.SetStateAction<any>>
  overall_group1e6a4: any 
  setoverall_group1e6a4: React.Dispatch<React.SetStateAction<any>>
  overall_group1e6a4Props: any 
  setoverall_group1e6a4Props: React.Dispatch<React.SetStateAction<any>>
  prndetails_group881d8: any 
  setprndetails_group881d8: React.Dispatch<React.SetStateAction<any>>
  prndetails_group881d8Props: any 
  setprndetails_group881d8Props: React.Dispatch<React.SetStateAction<any>>
  application_group16335: any 
  setapplication_group16335: React.Dispatch<React.SetStateAction<any>>
  application_group16335Props: any 
  setapplication_group16335Props: React.Dispatch<React.SetStateAction<any>>
  application_tab_groupf82f4: any 
  setapplication_tab_groupf82f4: React.Dispatch<React.SetStateAction<any>>
  application_tab_groupf82f4Props: any 
  setapplication_tab_groupf82f4Props: React.Dispatch<React.SetStateAction<any>>
  approve1c1d3: any 
  setapprove1c1d3: React.Dispatch<React.SetStateAction<any>>
  approve1c1d3Props: any 
  setapprove1c1d3Props: React.Dispatch<React.SetStateAction<any>>
  approve_tableafbb9: any 
  setapprove_tableafbb9: React.Dispatch<React.SetStateAction<any>>
  approve_tableafbb9Props: any 
  setapprove_tableafbb9Props: React.Dispatch<React.SetStateAction<any>>
  reason_group39480: any 
  setreason_group39480: React.Dispatch<React.SetStateAction<any>>
  reason_group39480Props: any 
  setreason_group39480Props: React.Dispatch<React.SetStateAction<any>>
  checker_approval_main_groupff981: any 
  setchecker_approval_main_groupff981: React.Dispatch<React.SetStateAction<any>>
  checker_approval_main_groupff981Props: any 
  setchecker_approval_main_groupff981Props: React.Dispatch<React.SetStateAction<any>>
  itaxgroup732e5: any 
  setitaxgroup732e5: React.Dispatch<React.SetStateAction<any>>
  itaxgroup732e5Props: any 
  setitaxgroup732e5Props: React.Dispatch<React.SetStateAction<any>>
  overall_dashboard54180: any 
  setoverall_dashboard54180: React.Dispatch<React.SetStateAction<any>>
  overall_dashboard54180Props: any 
  setoverall_dashboard54180Props: React.Dispatch<React.SetStateAction<any>>
  grp_total_transactionse00c2: any 
  setgrp_total_transactionse00c2: React.Dispatch<React.SetStateAction<any>>
  grp_total_transactionse00c2Props: any 
  setgrp_total_transactionse00c2Props: React.Dispatch<React.SetStateAction<any>>
  grp_prn_initiated2f421: any 
  setgrp_prn_initiated2f421: React.Dispatch<React.SetStateAction<any>>
  grp_prn_initiated2f421Props: any 
  setgrp_prn_initiated2f421Props: React.Dispatch<React.SetStateAction<any>>
  grp_prn_approvedb95cb: any 
  setgrp_prn_approvedb95cb: React.Dispatch<React.SetStateAction<any>>
  grp_prn_approvedb95cbProps: any 
  setgrp_prn_approvedb95cbProps: React.Dispatch<React.SetStateAction<any>>
  grp_credit_pendingfe0e2: any 
  setgrp_credit_pendingfe0e2: React.Dispatch<React.SetStateAction<any>>
  grp_credit_pendingfe0e2Props: any 
  setgrp_credit_pendingfe0e2Props: React.Dispatch<React.SetStateAction<any>>
  grp_credit_approved7e3bd: any 
  setgrp_credit_approved7e3bd: React.Dispatch<React.SetStateAction<any>>
  grp_credit_approved7e3bdProps: any 
  setgrp_credit_approved7e3bdProps: React.Dispatch<React.SetStateAction<any>>
  grp_payment_completed34dec: any 
  setgrp_payment_completed34dec: React.Dispatch<React.SetStateAction<any>>
  grp_payment_completed34decProps: any 
  setgrp_payment_completed34decProps: React.Dispatch<React.SetStateAction<any>>
  grp_bar_chart02e16: any 
  setgrp_bar_chart02e16: React.Dispatch<React.SetStateAction<any>>
  grp_bar_chart02e16Props: any 
  setgrp_bar_chart02e16Props: React.Dispatch<React.SetStateAction<any>>
  grp_pie_chart2415d: any 
  setgrp_pie_chart2415d: React.Dispatch<React.SetStateAction<any>>
  grp_pie_chart2415dProps: any 
  setgrp_pie_chart2415dProps: React.Dispatch<React.SetStateAction<any>>
  itaxst_id95c9b: any,
  setitaxst_id95c9b:React.Dispatch<React.SetStateAction<any>>
  itaxst_id95c9bProps: any 
  setitaxst_id95c9bProps: React.Dispatch<React.SetStateAction<any>>
  eslip_node051: any,
  seteslip_node051:React.Dispatch<React.SetStateAction<any>>
  eslip_node051Props: any 
  seteslip_node051Props: React.Dispatch<React.SetStateAction<any>>
  slip_payment_code99bf8: any,
  setslip_payment_code99bf8:React.Dispatch<React.SetStateAction<any>>
  slip_payment_code99bf8Props: any 
  setslip_payment_code99bf8Props: React.Dispatch<React.SetStateAction<any>>
  payment_advice_date42330: any,
  setpayment_advice_date42330:React.Dispatch<React.SetStateAction<any>>
  payment_advice_date42330Props: any 
  setpayment_advice_date42330Props: React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin6f022: any,
  settax_payer_pin6f022:React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin6f022Props: any 
  settax_payer_pin6f022Props: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name0bab4: any,
  settax_payer_full_name0bab4:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name0bab4Props: any 
  settax_payer_full_name0bab4Props: React.Dispatch<React.SetStateAction<any>>
  total_amount6ff13: any,
  settotal_amount6ff13:React.Dispatch<React.SetStateAction<any>>
  total_amount6ff13Props: any 
  settotal_amount6ff13Props: React.Dispatch<React.SetStateAction<any>>
  viewb80f4: any,
  setviewb80f4:React.Dispatch<React.SetStateAction<any>>
  viewb80f4Props: any 
  setviewb80f4Props: React.Dispatch<React.SetStateAction<any>>
  logfd488: any,
  setlogfd488:React.Dispatch<React.SetStateAction<any>>
  logfd488Props: any 
  setlogfd488Props: React.Dispatch<React.SetStateAction<any>>
  currency925d5: any,
  setcurrency925d5:React.Dispatch<React.SetStateAction<any>>
  currency925d5Props: any 
  setcurrency925d5Props: React.Dispatch<React.SetStateAction<any>>
  payment2954d: any,
  setpayment2954d:React.Dispatch<React.SetStateAction<any>>
  payment2954dProps: any 
  setpayment2954dProps: React.Dispatch<React.SetStateAction<any>>
  trs_event_process_status3d5ac: any,
  settrs_event_process_status3d5ac:React.Dispatch<React.SetStateAction<any>>
  trs_event_process_status3d5acProps: any 
  settrs_event_process_status3d5acProps: React.Dispatch<React.SetStateAction<any>>
  searchf8868: any,
  setsearchf8868:React.Dispatch<React.SetStateAction<any>>
  searchf8868Props: any 
  setsearchf8868Props: React.Dispatch<React.SetStateAction<any>>
  add_new200e9: any,
  setadd_new200e9:React.Dispatch<React.SetStateAction<any>>
  add_new200e9Props: any 
  setadd_new200e9Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_id0eeff: any,
  setitaxst_id0eeff:React.Dispatch<React.SetStateAction<any>>
  itaxst_id0eeffProps: any 
  setitaxst_id0eeffProps: React.Dispatch<React.SetStateAction<any>>
  prnb6d00: any,
  setprnb6d00:React.Dispatch<React.SetStateAction<any>>
  prnb6d00Props: any 
  setprnb6d00Props: React.Dispatch<React.SetStateAction<any>>
  slip_payment_code9b31c: any,
  setslip_payment_code9b31c:React.Dispatch<React.SetStateAction<any>>
  slip_payment_code9b31cProps: any 
  setslip_payment_code9b31cProps: React.Dispatch<React.SetStateAction<any>>
  payment_advice_date8473b: any,
  setpayment_advice_date8473b:React.Dispatch<React.SetStateAction<any>>
  payment_advice_date8473bProps: any 
  setpayment_advice_date8473bProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_pina5a64: any,
  settax_payer_pina5a64:React.Dispatch<React.SetStateAction<any>>
  tax_payer_pina5a64Props: any 
  settax_payer_pina5a64Props: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namee8e84: any,
  settax_payer_full_namee8e84:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namee8e84Props: any 
  settax_payer_full_namee8e84Props: React.Dispatch<React.SetStateAction<any>>
  total_amount99179: any,
  settotal_amount99179:React.Dispatch<React.SetStateAction<any>>
  total_amount99179Props: any 
  settotal_amount99179Props: React.Dispatch<React.SetStateAction<any>>
  cp_view07f80: any,
  setcp_view07f80:React.Dispatch<React.SetStateAction<any>>
  cp_view07f80Props: any 
  setcp_view07f80Props: React.Dispatch<React.SetStateAction<any>>
  cp_log321e5: any,
  setcp_log321e5:React.Dispatch<React.SetStateAction<any>>
  cp_log321e5Props: any 
  setcp_log321e5Props: React.Dispatch<React.SetStateAction<any>>
  cp_paymentcf667: any,
  setcp_paymentcf667:React.Dispatch<React.SetStateAction<any>>
  cp_paymentcf667Props: any 
  setcp_paymentcf667Props: React.Dispatch<React.SetStateAction<any>>
  currency50540: any,
  setcurrency50540:React.Dispatch<React.SetStateAction<any>>
  currency50540Props: any 
  setcurrency50540Props: React.Dispatch<React.SetStateAction<any>>
  trs_event_process_status332f5: any,
  settrs_event_process_status332f5:React.Dispatch<React.SetStateAction<any>>
  trs_event_process_status332f5Props: any 
  settrs_event_process_status332f5Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_idda14c: any,
  setitaxst_idda14c:React.Dispatch<React.SetStateAction<any>>
  itaxst_idda14cProps: any 
  setitaxst_idda14cProps: React.Dispatch<React.SetStateAction<any>>
  prnaf781: any,
  setprnaf781:React.Dispatch<React.SetStateAction<any>>
  prnaf781Props: any 
  setprnaf781Props: React.Dispatch<React.SetStateAction<any>>
  slip_payment_code66d40: any,
  setslip_payment_code66d40:React.Dispatch<React.SetStateAction<any>>
  slip_payment_code66d40Props: any 
  setslip_payment_code66d40Props: React.Dispatch<React.SetStateAction<any>>
  payment_advice_date1d75f: any,
  setpayment_advice_date1d75f:React.Dispatch<React.SetStateAction<any>>
  payment_advice_date1d75fProps: any 
  setpayment_advice_date1d75fProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin72747: any,
  settax_payer_pin72747:React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin72747Props: any 
  settax_payer_pin72747Props: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namea3d32: any,
  settax_payer_full_namea3d32:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namea3d32Props: any 
  settax_payer_full_namea3d32Props: React.Dispatch<React.SetStateAction<any>>
  total_amountb9286: any,
  settotal_amountb9286:React.Dispatch<React.SetStateAction<any>>
  total_amountb9286Props: any 
  settotal_amountb9286Props: React.Dispatch<React.SetStateAction<any>>
  currency90f00: any,
  setcurrency90f00:React.Dispatch<React.SetStateAction<any>>
  currency90f00Props: any 
  setcurrency90f00Props: React.Dispatch<React.SetStateAction<any>>
  vp_viewac3e4: any,
  setvp_viewac3e4:React.Dispatch<React.SetStateAction<any>>
  vp_viewac3e4Props: any 
  setvp_viewac3e4Props: React.Dispatch<React.SetStateAction<any>>
  vp_log3f547: any,
  setvp_log3f547:React.Dispatch<React.SetStateAction<any>>
  vp_log3f547Props: any 
  setvp_log3f547Props: React.Dispatch<React.SetStateAction<any>>
  vp_paymentbc4c5: any,
  setvp_paymentbc4c5:React.Dispatch<React.SetStateAction<any>>
  vp_paymentbc4c5Props: any 
  setvp_paymentbc4c5Props: React.Dispatch<React.SetStateAction<any>>
  trs_event_process_statusa505f: any,
  settrs_event_process_statusa505f:React.Dispatch<React.SetStateAction<any>>
  trs_event_process_statusa505fProps: any 
  settrs_event_process_statusa505fProps: React.Dispatch<React.SetStateAction<any>>
  prn_textinput88273: any,
  setprn_textinput88273:React.Dispatch<React.SetStateAction<any>>
  prn_textinput88273Props: any 
  setprn_textinput88273Props: React.Dispatch<React.SetStateAction<any>>
  slippaymentcodetextinputf76e3: any,
  setslippaymentcodetextinputf76e3:React.Dispatch<React.SetStateAction<any>>
  slippaymentcodetextinputf76e3Props: any 
  setslippaymentcodetextinputf76e3Props: React.Dispatch<React.SetStateAction<any>>
  taxpayerfullnametextinput0ac43: any,
  settaxpayerfullnametextinput0ac43:React.Dispatch<React.SetStateAction<any>>
  taxpayerfullnametextinput0ac43Props: any 
  settaxpayerfullnametextinput0ac43Props: React.Dispatch<React.SetStateAction<any>>
  clear43278: any,
  setclear43278:React.Dispatch<React.SetStateAction<any>>
  clear43278Props: any 
  setclear43278Props: React.Dispatch<React.SetStateAction<any>>
  search6f0c3: any,
  setsearch6f0c3:React.Dispatch<React.SetStateAction<any>>
  search6f0c3Props: any 
  setsearch6f0c3Props: React.Dispatch<React.SetStateAction<any>>
  add_prnadd8d: any,
  setadd_prnadd8d:React.Dispatch<React.SetStateAction<any>>
  add_prnadd8dProps: any 
  setadd_prnadd8dProps: React.Dispatch<React.SetStateAction<any>>
  prn_no_labelefcac: any,
  setprn_no_labelefcac:React.Dispatch<React.SetStateAction<any>>
  prn_no_labelefcacProps: any 
  setprn_no_labelefcacProps: React.Dispatch<React.SetStateAction<any>>
  prn_no972eb: any,
  setprn_no972eb:React.Dispatch<React.SetStateAction<any>>
  prn_no972ebProps: any 
  setprn_no972ebProps: React.Dispatch<React.SetStateAction<any>>
  cleara7662: any,
  setcleara7662:React.Dispatch<React.SetStateAction<any>>
  cleara7662Props: any 
  setcleara7662Props: React.Dispatch<React.SetStateAction<any>>
  saveda692: any,
  setsaveda692:React.Dispatch<React.SetStateAction<any>>
  saveda692Props: any 
  setsaveda692Props: React.Dispatch<React.SetStateAction<any>>
  view_details5f9dd: any,
  setview_details5f9dd:React.Dispatch<React.SetStateAction<any>>
  view_details5f9ddProps: any 
  setview_details5f9ddProps: React.Dispatch<React.SetStateAction<any>>
  prn_label348d7: any,
  setprn_label348d7:React.Dispatch<React.SetStateAction<any>>
  prn_label348d7Props: any 
  setprn_label348d7Props: React.Dispatch<React.SetStateAction<any>>
  eslip_no1e386: any,
  seteslip_no1e386:React.Dispatch<React.SetStateAction<any>>
  eslip_no1e386Props: any 
  seteslip_no1e386Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_id1d5bd: any,
  setitaxst_id1d5bd:React.Dispatch<React.SetStateAction<any>>
  itaxst_id1d5bdProps: any 
  setitaxst_id1d5bdProps: React.Dispatch<React.SetStateAction<any>>
  eslip_details567e2: any,
  seteslip_details567e2:React.Dispatch<React.SetStateAction<any>>
  eslip_details567e2Props: any 
  seteslip_details567e2Props: React.Dispatch<React.SetStateAction<any>>
  prn_status_labele7b20: any,
  setprn_status_labele7b20:React.Dispatch<React.SetStateAction<any>>
  prn_status_labele7b20Props: any 
  setprn_status_labele7b20Props: React.Dispatch<React.SetStateAction<any>>
  pin_label660ea: any,
  setpin_label660ea:React.Dispatch<React.SetStateAction<any>>
  pin_label660eaProps: any 
  setpin_label660eaProps: React.Dispatch<React.SetStateAction<any>>
  tax_payers_name_label86492: any,
  settax_payers_name_label86492:React.Dispatch<React.SetStateAction<any>>
  tax_payers_name_label86492Props: any 
  settax_payers_name_label86492Props: React.Dispatch<React.SetStateAction<any>>
  prn_status83532: any,
  setprn_status83532:React.Dispatch<React.SetStateAction<any>>
  prn_status83532Props: any 
  setprn_status83532Props: React.Dispatch<React.SetStateAction<any>>
  pin7c9eb: any,
  setpin7c9eb:React.Dispatch<React.SetStateAction<any>>
  pin7c9ebProps: any 
  setpin7c9ebProps: React.Dispatch<React.SetStateAction<any>>
  tax_payers_name38781: any,
  settax_payers_name38781:React.Dispatch<React.SetStateAction<any>>
  tax_payers_name38781Props: any 
  settax_payers_name38781Props: React.Dispatch<React.SetStateAction<any>>
  prn_amount_labela6563: any,
  setprn_amount_labela6563:React.Dispatch<React.SetStateAction<any>>
  prn_amount_labela6563Props: any 
  setprn_amount_labela6563Props: React.Dispatch<React.SetStateAction<any>>
  currency_label786a3: any,
  setcurrency_label786a3:React.Dispatch<React.SetStateAction<any>>
  currency_label786a3Props: any 
  setcurrency_label786a3Props: React.Dispatch<React.SetStateAction<any>>
  prn_reg_date_labelf0c46: any,
  setprn_reg_date_labelf0c46:React.Dispatch<React.SetStateAction<any>>
  prn_reg_date_labelf0c46Props: any 
  setprn_reg_date_labelf0c46Props: React.Dispatch<React.SetStateAction<any>>
  prn_amountd22c3: any,
  setprn_amountd22c3:React.Dispatch<React.SetStateAction<any>>
  prn_amountd22c3Props: any 
  setprn_amountd22c3Props: React.Dispatch<React.SetStateAction<any>>
  currency1ef9b: any,
  setcurrency1ef9b:React.Dispatch<React.SetStateAction<any>>
  currency1ef9bProps: any 
  setcurrency1ef9bProps: React.Dispatch<React.SetStateAction<any>>
  prn_registration_date67d15: any,
  setprn_registration_date67d15:React.Dispatch<React.SetStateAction<any>>
  prn_registration_date67d15Props: any 
  setprn_registration_date67d15Props: React.Dispatch<React.SetStateAction<any>>
  tax_code65046: any,
  settax_code65046:React.Dispatch<React.SetStateAction<any>>
  tax_code65046Props: any 
  settax_code65046Props: React.Dispatch<React.SetStateAction<any>>
  tax_component64ca3: any,
  settax_component64ca3:React.Dispatch<React.SetStateAction<any>>
  tax_component64ca3Props: any 
  settax_component64ca3Props: React.Dispatch<React.SetStateAction<any>>
  tax_period5506c: any,
  settax_period5506c:React.Dispatch<React.SetStateAction<any>>
  tax_period5506cProps: any 
  settax_period5506cProps: React.Dispatch<React.SetStateAction<any>>
  amountb7a3b: any,
  setamountb7a3b:React.Dispatch<React.SetStateAction<any>>
  amountb7a3bProps: any 
  setamountb7a3bProps: React.Dispatch<React.SetStateAction<any>>
  rejectedc3cd0: any,
  setrejectedc3cd0:React.Dispatch<React.SetStateAction<any>>
  rejectedc3cd0Props: any 
  setrejectedc3cd0Props: React.Dispatch<React.SetStateAction<any>>
  approve242e3: any,
  setapprove242e3:React.Dispatch<React.SetStateAction<any>>
  approve242e3Props: any 
  setapprove242e3Props: React.Dispatch<React.SetStateAction<any>>
  tran_jry_labelbaee1: any,
  settran_jry_labelbaee1:React.Dispatch<React.SetStateAction<any>>
  tran_jry_labelbaee1Props: any 
  settran_jry_labelbaee1Props: React.Dispatch<React.SetStateAction<any>>
  transaction_journey39171: any,
  settransaction_journey39171:React.Dispatch<React.SetStateAction<any>>
  transaction_journey39171Props: any 
  settransaction_journey39171Props: React.Dispatch<React.SetStateAction<any>>
  tran_category_label4bfef: any,
  settran_category_label4bfef:React.Dispatch<React.SetStateAction<any>>
  tran_category_label4bfefProps: any 
  settran_category_label4bfefProps: React.Dispatch<React.SetStateAction<any>>
  processing_system_labele6ddd: any,
  setprocessing_system_labele6ddd:React.Dispatch<React.SetStateAction<any>>
  processing_system_labele6dddProps: any 
  setprocessing_system_labele6dddProps: React.Dispatch<React.SetStateAction<any>>
  tran_categorycab42: any,
  settran_categorycab42:React.Dispatch<React.SetStateAction<any>>
  tran_categorycab42Props: any 
  settran_categorycab42Props: React.Dispatch<React.SetStateAction<any>>
  processing_systemcd502: any,
  setprocessing_systemcd502:React.Dispatch<React.SetStateAction<any>>
  processing_systemcd502Props: any 
  setprocessing_systemcd502Props: React.Dispatch<React.SetStateAction<any>>
  view_process_detailf4139: any,
  setview_process_detailf4139:React.Dispatch<React.SetStateAction<any>>
  view_process_detailf4139Props: any 
  setview_process_detailf4139Props: React.Dispatch<React.SetStateAction<any>>
  process_details_label489c7: any,
  setprocess_details_label489c7:React.Dispatch<React.SetStateAction<any>>
  process_details_label489c7Props: any 
  setprocess_details_label489c7Props: React.Dispatch<React.SetStateAction<any>>
  json_viewer235e2: any,
  setjson_viewer235e2:React.Dispatch<React.SetStateAction<any>>
  json_viewer235e2Props: any 
  setjson_viewer235e2Props: React.Dispatch<React.SetStateAction<any>>
  tran_category_label7a433: any,
  settran_category_label7a433:React.Dispatch<React.SetStateAction<any>>
  tran_category_label7a433Props: any 
  settran_category_label7a433Props: React.Dispatch<React.SetStateAction<any>>
  error_cateogry_label0e2f6: any,
  seterror_cateogry_label0e2f6:React.Dispatch<React.SetStateAction<any>>
  error_cateogry_label0e2f6Props: any 
  seterror_cateogry_label0e2f6Props: React.Dispatch<React.SetStateAction<any>>
  tran_category15644: any,
  settran_category15644:React.Dispatch<React.SetStateAction<any>>
  tran_category15644Props: any 
  settran_category15644Props: React.Dispatch<React.SetStateAction<any>>
  error_cateogryebc09: any,
  seterror_cateogryebc09:React.Dispatch<React.SetStateAction<any>>
  error_cateogryebc09Props: any 
  seterror_cateogryebc09Props: React.Dispatch<React.SetStateAction<any>>
  error_code_labeld6aa7: any,
  seterror_code_labeld6aa7:React.Dispatch<React.SetStateAction<any>>
  error_code_labeld6aa7Props: any 
  seterror_code_labeld6aa7Props: React.Dispatch<React.SetStateAction<any>>
  error_description_labelbc214: any,
  seterror_description_labelbc214:React.Dispatch<React.SetStateAction<any>>
  error_description_labelbc214Props: any 
  seterror_description_labelbc214Props: React.Dispatch<React.SetStateAction<any>>
  error_codeba00c: any,
  seterror_codeba00c:React.Dispatch<React.SetStateAction<any>>
  error_codeba00cProps: any 
  seterror_codeba00cProps: React.Dispatch<React.SetStateAction<any>>
  error_description64756: any,
  seterror_description64756:React.Dispatch<React.SetStateAction<any>>
  error_description64756Props: any 
  seterror_description64756Props: React.Dispatch<React.SetStateAction<any>>
  view_error_detaild4c71: any,
  setview_error_detaild4c71:React.Dispatch<React.SetStateAction<any>>
  view_error_detaild4c71Props: any 
  setview_error_detaild4c71Props: React.Dispatch<React.SetStateAction<any>>
  error_details21287: any,
  seterror_details21287:React.Dispatch<React.SetStateAction<any>>
  error_details21287Props: any 
  seterror_details21287Props: React.Dispatch<React.SetStateAction<any>>
  json_vieweree843: any,
  setjson_vieweree843:React.Dispatch<React.SetStateAction<any>>
  json_vieweree843Props: any 
  setjson_vieweree843Props: React.Dispatch<React.SetStateAction<any>>
  prn_details7320a: any,
  setprn_details7320a:React.Dispatch<React.SetStateAction<any>>
  prn_details7320aProps: any 
  setprn_details7320aProps: React.Dispatch<React.SetStateAction<any>>
  tax_code9c2db: any,
  settax_code9c2db:React.Dispatch<React.SetStateAction<any>>
  tax_code9c2dbProps: any 
  settax_code9c2dbProps: React.Dispatch<React.SetStateAction<any>>
  tax_component9766e: any,
  settax_component9766e:React.Dispatch<React.SetStateAction<any>>
  tax_component9766eProps: any 
  settax_component9766eProps: React.Dispatch<React.SetStateAction<any>>
  tax_period17a7c: any,
  settax_period17a7c:React.Dispatch<React.SetStateAction<any>>
  tax_period17a7cProps: any 
  settax_period17a7cProps: React.Dispatch<React.SetStateAction<any>>
  amount4e1d5: any,
  setamount4e1d5:React.Dispatch<React.SetStateAction<any>>
  amount4e1d5Props: any 
  setamount4e1d5Props: React.Dispatch<React.SetStateAction<any>>
  payment_details5a762: any,
  setpayment_details5a762:React.Dispatch<React.SetStateAction<any>>
  payment_details5a762Props: any 
  setpayment_details5a762Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_labelb5c98: any,
  setpayment_type_labelb5c98:React.Dispatch<React.SetStateAction<any>>
  payment_type_labelb5c98Props: any 
  setpayment_type_labelb5c98Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_dropdownb558f: any,
  setpayment_type_dropdownb558f:React.Dispatch<React.SetStateAction<any>>
  payment_type_dropdownb558fProps: any 
  setpayment_type_dropdownb558fProps: React.Dispatch<React.SetStateAction<any>>
  debit_account_no_label86b10: any,
  setdebit_account_no_label86b10:React.Dispatch<React.SetStateAction<any>>
  debit_account_no_label86b10Props: any 
  setdebit_account_no_label86b10Props: React.Dispatch<React.SetStateAction<any>>
  debit_account_noa9796: any,
  setdebit_account_noa9796:React.Dispatch<React.SetStateAction<any>>
  debit_account_noa9796Props: any 
  setdebit_account_noa9796Props: React.Dispatch<React.SetStateAction<any>>
  available_bal_label22d5b: any,
  setavailable_bal_label22d5b:React.Dispatch<React.SetStateAction<any>>
  available_bal_label22d5bProps: any 
  setavailable_bal_label22d5bProps: React.Dispatch<React.SetStateAction<any>>
  balancedcbd7: any,
  setbalancedcbd7:React.Dispatch<React.SetStateAction<any>>
  balancedcbd7Props: any 
  setbalancedcbd7Props: React.Dispatch<React.SetStateAction<any>>
  tax_amount_label2b9ee: any,
  settax_amount_label2b9ee:React.Dispatch<React.SetStateAction<any>>
  tax_amount_label2b9eeProps: any 
  settax_amount_label2b9eeProps: React.Dispatch<React.SetStateAction<any>>
  total_amount46433: any,
  settotal_amount46433:React.Dispatch<React.SetStateAction<any>>
  total_amount46433Props: any 
  settotal_amount46433Props: React.Dispatch<React.SetStateAction<any>>
  debit_amount_labelf6595: any,
  setdebit_amount_labelf6595:React.Dispatch<React.SetStateAction<any>>
  debit_amount_labelf6595Props: any 
  setdebit_amount_labelf6595Props: React.Dispatch<React.SetStateAction<any>>
  debit_amountf2e0e: any,
  setdebit_amountf2e0e:React.Dispatch<React.SetStateAction<any>>
  debit_amountf2e0eProps: any 
  setdebit_amountf2e0eProps: React.Dispatch<React.SetStateAction<any>>
  cheque_no_labeldb9c8: any,
  setcheque_no_labeldb9c8:React.Dispatch<React.SetStateAction<any>>
  cheque_no_labeldb9c8Props: any 
  setcheque_no_labeldb9c8Props: React.Dispatch<React.SetStateAction<any>>
  cheque_nocda2a: any,
  setcheque_nocda2a:React.Dispatch<React.SetStateAction<any>>
  cheque_nocda2aProps: any 
  setcheque_nocda2aProps: React.Dispatch<React.SetStateAction<any>>
  debit_account_no_labelcdc37: any,
  setdebit_account_no_labelcdc37:React.Dispatch<React.SetStateAction<any>>
  debit_account_no_labelcdc37Props: any 
  setdebit_account_no_labelcdc37Props: React.Dispatch<React.SetStateAction<any>>
  debit_account_no53afb: any,
  setdebit_account_no53afb:React.Dispatch<React.SetStateAction<any>>
  debit_account_no53afbProps: any 
  setdebit_account_no53afbProps: React.Dispatch<React.SetStateAction<any>>
  available_bal_label08076: any,
  setavailable_bal_label08076:React.Dispatch<React.SetStateAction<any>>
  available_bal_label08076Props: any 
  setavailable_bal_label08076Props: React.Dispatch<React.SetStateAction<any>>
  balanceb280e: any,
  setbalanceb280e:React.Dispatch<React.SetStateAction<any>>
  balanceb280eProps: any 
  setbalanceb280eProps: React.Dispatch<React.SetStateAction<any>>
  tax_amount_labela2854: any,
  settax_amount_labela2854:React.Dispatch<React.SetStateAction<any>>
  tax_amount_labela2854Props: any 
  settax_amount_labela2854Props: React.Dispatch<React.SetStateAction<any>>
  total_amounte161d: any,
  settotal_amounte161d:React.Dispatch<React.SetStateAction<any>>
  total_amounte161dProps: any 
  settotal_amounte161dProps: React.Dispatch<React.SetStateAction<any>>
  debit_amount_label8b9a0: any,
  setdebit_amount_label8b9a0:React.Dispatch<React.SetStateAction<any>>
  debit_amount_label8b9a0Props: any 
  setdebit_amount_label8b9a0Props: React.Dispatch<React.SetStateAction<any>>
  debit_amountbfd7f: any,
  setdebit_amountbfd7f:React.Dispatch<React.SetStateAction<any>>
  debit_amountbfd7fProps: any 
  setdebit_amountbfd7fProps: React.Dispatch<React.SetStateAction<any>>
  clear47c6a: any,
  setclear47c6a:React.Dispatch<React.SetStateAction<any>>
  clear47c6aProps: any 
  setclear47c6aProps: React.Dispatch<React.SetStateAction<any>>
  make_payment3a4e8: any,
  setmake_payment3a4e8:React.Dispatch<React.SetStateAction<any>>
  make_payment3a4e8Props: any 
  setmake_payment3a4e8Props: React.Dispatch<React.SetStateAction<any>>
  transaction_details_label6f776: any,
  settransaction_details_label6f776:React.Dispatch<React.SetStateAction<any>>
  transaction_details_label6f776Props: any 
  settransaction_details_label6f776Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_id19a2c: any,
  setitaxst_id19a2c:React.Dispatch<React.SetStateAction<any>>
  itaxst_id19a2cProps: any 
  setitaxst_id19a2cProps: React.Dispatch<React.SetStateAction<any>>
  prnno_label2284a: any,
  setprnno_label2284a:React.Dispatch<React.SetStateAction<any>>
  prnno_label2284aProps: any 
  setprnno_label2284aProps: React.Dispatch<React.SetStateAction<any>>
  eslip_noe1f20: any,
  seteslip_noe1f20:React.Dispatch<React.SetStateAction<any>>
  eslip_noe1f20Props: any 
  seteslip_noe1f20Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_labela8526: any,
  setpayment_type_labela8526:React.Dispatch<React.SetStateAction<any>>
  payment_type_labela8526Props: any 
  setpayment_type_labela8526Props: React.Dispatch<React.SetStateAction<any>>
  payment_type_dropdown5d344: any,
  setpayment_type_dropdown5d344:React.Dispatch<React.SetStateAction<any>>
  payment_type_dropdown5d344Props: any 
  setpayment_type_dropdown5d344Props: React.Dispatch<React.SetStateAction<any>>
  debit_account_no_label99095: any,
  setdebit_account_no_label99095:React.Dispatch<React.SetStateAction<any>>
  debit_account_no_label99095Props: any 
  setdebit_account_no_label99095Props: React.Dispatch<React.SetStateAction<any>>
  debit_account_no9ec5d: any,
  setdebit_account_no9ec5d:React.Dispatch<React.SetStateAction<any>>
  debit_account_no9ec5dProps: any 
  setdebit_account_no9ec5dProps: React.Dispatch<React.SetStateAction<any>>
  tax_payers_full_name_labeld7111: any,
  settax_payers_full_name_labeld7111:React.Dispatch<React.SetStateAction<any>>
  tax_payers_full_name_labeld7111Props: any 
  settax_payers_full_name_labeld7111Props: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name8bf4d: any,
  settax_payer_full_name8bf4d:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name8bf4dProps: any 
  settax_payer_full_name8bf4dProps: React.Dispatch<React.SetStateAction<any>>
  debit_amount_label46f0a: any,
  setdebit_amount_label46f0a:React.Dispatch<React.SetStateAction<any>>
  debit_amount_label46f0aProps: any 
  setdebit_amount_label46f0aProps: React.Dispatch<React.SetStateAction<any>>
  debit_amountbbf1f: any,
  setdebit_amountbbf1f:React.Dispatch<React.SetStateAction<any>>
  debit_amountbbf1fProps: any 
  setdebit_amountbbf1fProps: React.Dispatch<React.SetStateAction<any>>
  loan_amt_labeleacfe: any,
  setloan_amt_labeleacfe:React.Dispatch<React.SetStateAction<any>>
  loan_amt_labeleacfeProps: any 
  setloan_amt_labeleacfeProps: React.Dispatch<React.SetStateAction<any>>
  loan_amt3440e: any,
  setloan_amt3440e:React.Dispatch<React.SetStateAction<any>>
  loan_amt3440eProps: any 
  setloan_amt3440eProps: React.Dispatch<React.SetStateAction<any>>
  auth_memo_labelf0a0e: any,
  setauth_memo_labelf0a0e:React.Dispatch<React.SetStateAction<any>>
  auth_memo_labelf0a0eProps: any 
  setauth_memo_labelf0a0eProps: React.Dispatch<React.SetStateAction<any>>
  filename4f410: any,
  setfilename4f410:React.Dispatch<React.SetStateAction<any>>
  filename4f410Props: any 
  setfilename4f410Props: React.Dispatch<React.SetStateAction<any>>
  memo_documentuploader51a64: any,
  setmemo_documentuploader51a64:React.Dispatch<React.SetStateAction<any>>
  memo_documentuploader51a64Props: any 
  setmemo_documentuploader51a64Props: React.Dispatch<React.SetStateAction<any>>
  clear14cbd: any,
  setclear14cbd:React.Dispatch<React.SetStateAction<any>>
  clear14cbdProps: any 
  setclear14cbdProps: React.Dispatch<React.SetStateAction<any>>
  submitc9c9c: any,
  setsubmitc9c9c:React.Dispatch<React.SetStateAction<any>>
  submitc9c9cProps: any 
  setsubmitc9c9cProps: React.Dispatch<React.SetStateAction<any>>
  authorization_memo_file_label01fe5: any,
  setauthorization_memo_file_label01fe5:React.Dispatch<React.SetStateAction<any>>
  authorization_memo_file_label01fe5Props: any 
  setauthorization_memo_file_label01fe5Props: React.Dispatch<React.SetStateAction<any>>
  reject5bd6a: any,
  setreject5bd6a:React.Dispatch<React.SetStateAction<any>>
  reject5bd6aProps: any 
  setreject5bd6aProps: React.Dispatch<React.SetStateAction<any>>
  approve79abe: any,
  setapprove79abe:React.Dispatch<React.SetStateAction<any>>
  approve79abeProps: any 
  setapprove79abeProps: React.Dispatch<React.SetStateAction<any>>
  documentviewercd49e: any,
  setdocumentviewercd49e:React.Dispatch<React.SetStateAction<any>>
  documentviewercd49eProps: any 
  setdocumentviewercd49eProps: React.Dispatch<React.SetStateAction<any>>
  prndetails_label38a32: any,
  setprndetails_label38a32:React.Dispatch<React.SetStateAction<any>>
  prndetails_label38a32Props: any 
  setprndetails_label38a32Props: React.Dispatch<React.SetStateAction<any>>
  prn_no_label62fcb: any,
  setprn_no_label62fcb:React.Dispatch<React.SetStateAction<any>>
  prn_no_label62fcbProps: any 
  setprn_no_label62fcbProps: React.Dispatch<React.SetStateAction<any>>
  esip_no6f361: any,
  setesip_no6f361:React.Dispatch<React.SetStateAction<any>>
  esip_no6f361Props: any 
  setesip_no6f361Props: React.Dispatch<React.SetStateAction<any>>
  slip_payment_code_labelba3fe: any,
  setslip_payment_code_labelba3fe:React.Dispatch<React.SetStateAction<any>>
  slip_payment_code_labelba3feProps: any 
  setslip_payment_code_labelba3feProps: React.Dispatch<React.SetStateAction<any>>
  slip_payment_code983fc: any,
  setslip_payment_code983fc:React.Dispatch<React.SetStateAction<any>>
  slip_payment_code983fcProps: any 
  setslip_payment_code983fcProps: React.Dispatch<React.SetStateAction<any>>
  payment_advice_date_label0a7cd: any,
  setpayment_advice_date_label0a7cd:React.Dispatch<React.SetStateAction<any>>
  payment_advice_date_label0a7cdProps: any 
  setpayment_advice_date_label0a7cdProps: React.Dispatch<React.SetStateAction<any>>
  payment_advice_datefb2ad: any,
  setpayment_advice_datefb2ad:React.Dispatch<React.SetStateAction<any>>
  payment_advice_datefb2adProps: any 
  setpayment_advice_datefb2adProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin_label532eb: any,
  settax_payer_pin_label532eb:React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin_label532ebProps: any 
  settax_payer_pin_label532ebProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin2328b: any,
  settax_payer_pin2328b:React.Dispatch<React.SetStateAction<any>>
  tax_payer_pin2328bProps: any 
  settax_payer_pin2328bProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name_label0ed9c: any,
  settax_payer_full_name_label0ed9c:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_name_label0ed9cProps: any 
  settax_payer_full_name_label0ed9cProps: React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namef6644: any,
  settax_payer_full_namef6644:React.Dispatch<React.SetStateAction<any>>
  tax_payer_full_namef6644Props: any 
  settax_payer_full_namef6644Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_idd3e56: any,
  setitaxst_idd3e56:React.Dispatch<React.SetStateAction<any>>
  itaxst_idd3e56Props: any 
  setitaxst_idd3e56Props: React.Dispatch<React.SetStateAction<any>>
  approve_doc1f48f: any,
  setapprove_doc1f48f:React.Dispatch<React.SetStateAction<any>>
  approve_doc1f48fProps: any 
  setapprove_doc1f48fProps: React.Dispatch<React.SetStateAction<any>>
  approve_delete12828: any,
  setapprove_delete12828:React.Dispatch<React.SetStateAction<any>>
  approve_delete12828Props: any 
  setapprove_delete12828Props: React.Dispatch<React.SetStateAction<any>>
  itaxstd_iddb195: any,
  setitaxstd_iddb195:React.Dispatch<React.SetStateAction<any>>
  itaxstd_iddb195Props: any 
  setitaxstd_iddb195Props: React.Dispatch<React.SetStateAction<any>>
  reason_label97548: any,
  setreason_label97548:React.Dispatch<React.SetStateAction<any>>
  reason_label97548Props: any 
  setreason_label97548Props: React.Dispatch<React.SetStateAction<any>>
  reasone20ad: any,
  setreasone20ad:React.Dispatch<React.SetStateAction<any>>
  reasone20adProps: any 
  setreasone20adProps: React.Dispatch<React.SetStateAction<any>>
  upload_file_label93f14: any,
  setupload_file_label93f14:React.Dispatch<React.SetStateAction<any>>
  upload_file_label93f14Props: any 
  setupload_file_label93f14Props: React.Dispatch<React.SetStateAction<any>>
  itaxst_ida5acc: any,
  setitaxst_ida5acc:React.Dispatch<React.SetStateAction<any>>
  itaxst_ida5accProps: any 
  setitaxst_ida5accProps: React.Dispatch<React.SetStateAction<any>>
  documentuploader68dcb: any,
  setdocumentuploader68dcb:React.Dispatch<React.SetStateAction<any>>
  documentuploader68dcbProps: any 
  setdocumentuploader68dcbProps: React.Dispatch<React.SetStateAction<any>>
  file_name456cb: any,
  setfile_name456cb:React.Dispatch<React.SetStateAction<any>>
  file_name456cbProps: any 
  setfile_name456cbProps: React.Dispatch<React.SetStateAction<any>>
  cancel68e13: any,
  setcancel68e13:React.Dispatch<React.SetStateAction<any>>
  cancel68e13Props: any 
  setcancel68e13Props: React.Dispatch<React.SetStateAction<any>>
  credit_approve89f9a: any,
  setcredit_approve89f9a:React.Dispatch<React.SetStateAction<any>>
  credit_approve89f9aProps: any 
  setcredit_approve89f9aProps: React.Dispatch<React.SetStateAction<any>>
  tran_text6efd4: any,
  settran_text6efd4:React.Dispatch<React.SetStateAction<any>>
  tran_text6efd4Props: any 
  settran_text6efd4Props: React.Dispatch<React.SetStateAction<any>>
  total_transactionse8381: any,
  settotal_transactionse8381:React.Dispatch<React.SetStateAction<any>>
  total_transactionse8381Props: any 
  settotal_transactionse8381Props: React.Dispatch<React.SetStateAction<any>>
  prn_initiated0750d: any,
  setprn_initiated0750d:React.Dispatch<React.SetStateAction<any>>
  prn_initiated0750dProps: any 
  setprn_initiated0750dProps: React.Dispatch<React.SetStateAction<any>>
  prn_approvedff8ef: any,
  setprn_approvedff8ef:React.Dispatch<React.SetStateAction<any>>
  prn_approvedff8efProps: any 
  setprn_approvedff8efProps: React.Dispatch<React.SetStateAction<any>>
  credit_pendingdce75: any,
  setcredit_pendingdce75:React.Dispatch<React.SetStateAction<any>>
  credit_pendingdce75Props: any 
  setcredit_pendingdce75Props: React.Dispatch<React.SetStateAction<any>>
  credit_approved179f5: any,
  setcredit_approved179f5:React.Dispatch<React.SetStateAction<any>>
  credit_approved179f5Props: any 
  setcredit_approved179f5Props: React.Dispatch<React.SetStateAction<any>>
  payment_completedeae7f: any,
  setpayment_completedeae7f:React.Dispatch<React.SetStateAction<any>>
  payment_completedeae7fProps: any 
  setpayment_completedeae7fProps: React.Dispatch<React.SetStateAction<any>>
  bar_chart386dd: any,
  setbar_chart386dd:React.Dispatch<React.SetStateAction<any>>
  bar_chart386ddProps: any 
  setbar_chart386ddProps: React.Dispatch<React.SetStateAction<any>>
  pie_chartd26f3: any,
  setpie_chartd26f3:React.Dispatch<React.SetStateAction<any>>
  pie_chartd26f3Props: any 
  setpie_chartd26f3Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  itax_kedtb_main_screen_v1Props: any 
  setitax_kedtb_main_screen_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_main_screen_search_v1Props: any 
  setitax_main_screen_search_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_add_prn_v1Props: any 
  setitax_add_prn_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_view_details_v1Props: any 
  setitax_view_details_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_prn_approval_details_v1Props: any 
  setitax_prn_approval_details_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_tran_journey_v1Props: any 
  setitax_tran_journey_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_view_process_detail_v1Props: any 
  setitax_view_process_detail_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_view_process_details_json_viewer_v1Props: any 
  setitax_view_process_details_json_viewer_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_view_error_detail_v1Props: any 
  setitax_view_error_detail_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_view_error_details_json_viewer_v1Props: any 
  setitax_view_error_details_json_viewer_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_payment_details_v1Props: any 
  setitax_payment_details_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_creditflow_screen_v1Props: any 
  setitax_creditflow_screen_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_credit_approval_screen_v1Props: any 
  setitax_credit_approval_screen_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_checker_credit_approval_screen_v1Props: any 
  setitax_checker_credit_approval_screen_v1Props: React.Dispatch<React.SetStateAction<any>>
  itax_dashboard_v1Props: any 
  setitax_dashboard_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_itax_source_tran_dfd_v1Props: any 
  setdfd_itax_source_tran_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_source_tran_dtl_dfd_v1Props: any 
  setdfd_itax_source_tran_dtl_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_tran_log_dfd_v1Props: any 
  setdfd_itax_tran_log_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_tran_error_log_dfd_v1Props: any 
  setdfd_itax_tran_error_log_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_source_tran_doc_dfd_v1Props: any 
  setdfd_itax_source_tran_doc_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_dashboard_cards_v1Props: any 
  setdfd_itax_dashboard_cards_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_bar_chart_dfd_v1Props: any 
  setdfd_itax_bar_chart_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_itax_pie_chart_dfd_v1Props: any 
  setdfd_itax_pie_chart_dfd_v1Props: React.Dispatch<React.SetStateAction<any>>

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
        const [overallgroup4d9a0, setoverallgroup4d9a0 ] = React.useState<any>({}) 
    const [overallgroup4d9a0Props, setoverallgroup4d9a0Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [itax_main_tab_group216b3, setitax_main_tab_group216b3 ] = React.useState<any>({}) 
    const [itax_main_tab_group216b3Props, setitax_main_tab_group216b3Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [tab_process_new_prn5597e, settab_process_new_prn5597e ] = React.useState<any>({}) 
    const [tab_process_new_prn5597eProps, settab_process_new_prn5597eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [itax_source_table1afd6, setitax_source_table1afd6 ] = React.useState<any>([]) 
    const [itax_source_table1afd6Props, setitax_source_table1afd6Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [tab_credit_process_group546cc, settab_credit_process_group546cc ] = React.useState<any>({}) 
    const [tab_credit_process_group546ccProps, settab_credit_process_group546ccProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [credit_process_table0cd4c, setcredit_process_table0cd4c ] = React.useState<any>([]) 
    const [credit_process_table0cd4cProps, setcredit_process_table0cd4cProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [tab_view_processed_prn29a93, settab_view_processed_prn29a93 ] = React.useState<any>({}) 
    const [tab_view_processed_prn29a93Props, settab_view_processed_prn29a93Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [view_processed_prn_table8f5a5, setview_processed_prn_table8f5a5 ] = React.useState<any>([]) 
    const [view_processed_prn_table8f5a5Props, setview_processed_prn_table8f5a5Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [search_group9a617, setsearch_group9a617 ] = React.useState<any>({}) 
    const [search_group9a617Props, setsearch_group9a617Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [add_prn_group1a4d8, setadd_prn_group1a4d8 ] = React.useState<any>({}) 
    const [add_prn_group1a4d8Props, setadd_prn_group1a4d8Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_detail_back_group50bce, setview_detail_back_group50bce ] = React.useState<any>({}) 
    const [view_detail_back_group50bceProps, setview_detail_back_group50bceProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_detail_group73f21, setview_detail_group73f21 ] = React.useState<any>({}) 
    const [view_detail_group73f21Props, setview_detail_group73f21Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [prn_no_datails_tablefc106, setprn_no_datails_tablefc106 ] = React.useState<any>([]) 
    const [prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [viewed_details_grp73f21, setviewed_details_grp73f21 ] = React.useState<any>({}) 
    const [viewed_details_grp73f21Props, setviewed_details_grp73f21Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [prn_no_details_tablefc106, setprn_no_details_tablefc106 ] = React.useState<any>([]) 
    const [prn_no_details_tablefc106Props, setprn_no_details_tablefc106Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [tran_journey_group30215, settran_journey_group30215 ] = React.useState<any>({}) 
    const [tran_journey_group30215Props, settran_journey_group30215Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_process_detail_groupe7fe3, setview_process_detail_groupe7fe3 ] = React.useState<any>({}) 
    const [view_process_detail_groupe7fe3Props, setview_process_detail_groupe7fe3Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [process_details_json_viewer_group64f76, setprocess_details_json_viewer_group64f76 ] = React.useState<any>({}) 
    const [process_details_json_viewer_group64f76Props, setprocess_details_json_viewer_group64f76Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [view_error_detail_group21845, setview_error_detail_group21845 ] = React.useState<any>({}) 
    const [view_error_detail_group21845Props, setview_error_detail_group21845Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [error_details_json_groupc13f1, seterror_details_json_groupc13f1 ] = React.useState<any>({}) 
    const [error_details_json_groupc13f1Props, seterror_details_json_groupc13f1Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [prn_details_group00560, setprn_details_group00560 ] = React.useState<any>({}) 
    const [prn_details_group00560Props, setprn_details_group00560Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [prn_datails_table2ad52, setprn_datails_table2ad52 ] = React.useState<any>([]) 
    const [prn_datails_table2ad52Props, setprn_datails_table2ad52Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [subscreen_groupc0414, setsubscreen_groupc0414 ] = React.useState<any>({}) 
    const [subscreen_groupc0414Props, setsubscreen_groupc0414Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86 ] = React.useState<any>({}) 
    const [ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [payment_type_cheque_group239dd, setpayment_type_cheque_group239dd ] = React.useState<any>({}) 
    const [payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7 ] = React.useState<any>({}) 
    const [ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [payment_type_dt_groupedf52, setpayment_type_dt_groupedf52 ] = React.useState<any>({}) 
    const [payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [new_prn_main_group21910, setnew_prn_main_group21910 ] = React.useState<any>({}) 
    const [new_prn_main_group21910Props, setnew_prn_main_group21910Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [authorization_memo_file_group17228, setauthorization_memo_file_group17228 ] = React.useState<any>({}) 
    const [authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [documentviewer_group0a3fb, setdocumentviewer_group0a3fb ] = React.useState<any>({}) 
    const [documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [overall_group1e6a4, setoverall_group1e6a4 ] = React.useState<any>({}) 
    const [overall_group1e6a4Props, setoverall_group1e6a4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [prndetails_group881d8, setprndetails_group881d8 ] = React.useState<any>({}) 
    const [prndetails_group881d8Props, setprndetails_group881d8Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [application_group16335, setapplication_group16335 ] = React.useState<any>({}) 
    const [application_group16335Props, setapplication_group16335Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [application_tab_groupf82f4, setapplication_tab_groupf82f4 ] = React.useState<any>({}) 
    const [application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [approve1c1d3, setapprove1c1d3 ] = React.useState<any>({}) 
    const [approve1c1d3Props, setapprove1c1d3Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [approve_tableafbb9, setapprove_tableafbb9 ] = React.useState<any>([]) 
    const [approve_tableafbb9Props, setapprove_tableafbb9Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [reason_group39480, setreason_group39480 ] = React.useState<any>({}) 
    const [reason_group39480Props, setreason_group39480Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [checker_approval_main_groupff981, setchecker_approval_main_groupff981 ] = React.useState<any>({}) 
    const [checker_approval_main_groupff981Props, setchecker_approval_main_groupff981Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [itaxgroup732e5, setitaxgroup732e5 ] = React.useState<any>({}) 
    const [itaxgroup732e5Props, setitaxgroup732e5Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [overall_dashboard54180, setoverall_dashboard54180 ] = React.useState<any>({}) 
    const [overall_dashboard54180Props, setoverall_dashboard54180Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_total_transactionse00c2, setgrp_total_transactionse00c2 ] = React.useState<any>({}) 
    const [grp_total_transactionse00c2Props, setgrp_total_transactionse00c2Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_prn_initiated2f421, setgrp_prn_initiated2f421 ] = React.useState<any>({}) 
    const [grp_prn_initiated2f421Props, setgrp_prn_initiated2f421Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_prn_approvedb95cb, setgrp_prn_approvedb95cb ] = React.useState<any>({}) 
    const [grp_prn_approvedb95cbProps, setgrp_prn_approvedb95cbProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_credit_pendingfe0e2, setgrp_credit_pendingfe0e2 ] = React.useState<any>({}) 
    const [grp_credit_pendingfe0e2Props, setgrp_credit_pendingfe0e2Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_credit_approved7e3bd, setgrp_credit_approved7e3bd ] = React.useState<any>({}) 
    const [grp_credit_approved7e3bdProps, setgrp_credit_approved7e3bdProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_payment_completed34dec, setgrp_payment_completed34dec ] = React.useState<any>({}) 
    const [grp_payment_completed34decProps, setgrp_payment_completed34decProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_bar_chart02e16, setgrp_bar_chart02e16 ] = React.useState<any>({}) 
    const [grp_bar_chart02e16Props, setgrp_bar_chart02e16Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [grp_pie_chart2415d, setgrp_pie_chart2415d ] = React.useState<any>({}) 
    const [grp_pie_chart2415dProps, setgrp_pie_chart2415dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [itaxst_id95c9b,setitaxst_id95c9b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [eslip_node051,seteslip_node051] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slip_payment_code99bf8,setslip_payment_code99bf8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_advice_date42330,setpayment_advice_date42330] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_pin6f022,settax_payer_pin6f022] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_name0bab4,settax_payer_full_name0bab4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_amount6ff13,settotal_amount6ff13] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [viewb80f4,setviewb80f4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [logfd488,setlogfd488] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency925d5,setcurrency925d5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment2954d,setpayment2954d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [trs_event_process_status3d5ac,settrs_event_process_status3d5ac] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [searchf8868,setsearchf8868] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [add_new200e9,setadd_new200e9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_id0eeff,setitaxst_id0eeff] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prnb6d00,setprnb6d00] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slip_payment_code9b31c,setslip_payment_code9b31c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_advice_date8473b,setpayment_advice_date8473b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_pina5a64,settax_payer_pina5a64] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_namee8e84,settax_payer_full_namee8e84] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_amount99179,settotal_amount99179] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cp_view07f80,setcp_view07f80] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cp_log321e5,setcp_log321e5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cp_paymentcf667,setcp_paymentcf667] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency50540,setcurrency50540] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [trs_event_process_status332f5,settrs_event_process_status332f5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_idda14c,setitaxst_idda14c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prnaf781,setprnaf781] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slip_payment_code66d40,setslip_payment_code66d40] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_advice_date1d75f,setpayment_advice_date1d75f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_pin72747,settax_payer_pin72747] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_namea3d32,settax_payer_full_namea3d32] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_amountb9286,settotal_amountb9286] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency90f00,setcurrency90f00] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [vp_viewac3e4,setvp_viewac3e4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [vp_log3f547,setvp_log3f547] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [vp_paymentbc4c5,setvp_paymentbc4c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [trs_event_process_statusa505f,settrs_event_process_statusa505f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_textinput88273,setprn_textinput88273] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slippaymentcodetextinputf76e3,setslippaymentcodetextinputf76e3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [taxpayerfullnametextinput0ac43,settaxpayerfullnametextinput0ac43] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [clear43278,setclear43278] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [search6f0c3,setsearch6f0c3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [add_prnadd8d,setadd_prnadd8d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_no_labelefcac,setprn_no_labelefcac] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_no972eb,setprn_no972eb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cleara7662,setcleara7662] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [saveda692,setsaveda692] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_details5f9dd,setview_details5f9dd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_label348d7,setprn_label348d7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [eslip_no1e386,seteslip_no1e386] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_id1d5bd,setitaxst_id1d5bd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [eslip_details567e2,seteslip_details567e2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_status_labele7b20,setprn_status_labele7b20] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pin_label660ea,setpin_label660ea] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payers_name_label86492,settax_payers_name_label86492] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_status83532,setprn_status83532] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pin7c9eb,setpin7c9eb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payers_name38781,settax_payers_name38781] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_amount_labela6563,setprn_amount_labela6563] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency_label786a3,setcurrency_label786a3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_reg_date_labelf0c46,setprn_reg_date_labelf0c46] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_amountd22c3,setprn_amountd22c3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [currency1ef9b,setcurrency1ef9b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_registration_date67d15,setprn_registration_date67d15] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_code65046,settax_code65046] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_component64ca3,settax_component64ca3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_period5506c,settax_period5506c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amountb7a3b,setamountb7a3b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [rejectedc3cd0,setrejectedc3cd0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve242e3,setapprove242e3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_jry_labelbaee1,settran_jry_labelbaee1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_journey39171,settransaction_journey39171] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_category_label4bfef,settran_category_label4bfef] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [processing_system_labele6ddd,setprocessing_system_labele6ddd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_categorycab42,settran_categorycab42] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [processing_systemcd502,setprocessing_systemcd502] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_process_detailf4139,setview_process_detailf4139] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [process_details_label489c7,setprocess_details_label489c7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [json_viewer235e2,setjson_viewer235e2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_category_label7a433,settran_category_label7a433] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_cateogry_label0e2f6,seterror_cateogry_label0e2f6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_category15644,settran_category15644] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_cateogryebc09,seterror_cateogryebc09] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_code_labeld6aa7,seterror_code_labeld6aa7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_description_labelbc214,seterror_description_labelbc214] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_codeba00c,seterror_codeba00c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_description64756,seterror_description64756] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [view_error_detaild4c71,setview_error_detaild4c71] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [error_details21287,seterror_details21287] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [json_vieweree843,setjson_vieweree843] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_details7320a,setprn_details7320a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_code9c2db,settax_code9c2db] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_component9766e,settax_component9766e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_period17a7c,settax_period17a7c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amount4e1d5,setamount4e1d5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_details5a762,setpayment_details5a762] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_type_labelb5c98,setpayment_type_labelb5c98] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_type_dropdownb558f,setpayment_type_dropdownb558f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_no_label86b10,setdebit_account_no_label86b10] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_noa9796,setdebit_account_noa9796] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [available_bal_label22d5b,setavailable_bal_label22d5b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [balancedcbd7,setbalancedcbd7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_amount_label2b9ee,settax_amount_label2b9ee] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_amount46433,settotal_amount46433] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amount_labelf6595,setdebit_amount_labelf6595] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amountf2e0e,setdebit_amountf2e0e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cheque_no_labeldb9c8,setcheque_no_labeldb9c8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cheque_nocda2a,setcheque_nocda2a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_no_labelcdc37,setdebit_account_no_labelcdc37] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_no53afb,setdebit_account_no53afb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [available_bal_label08076,setavailable_bal_label08076] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [balanceb280e,setbalanceb280e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_amount_labela2854,settax_amount_labela2854] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_amounte161d,settotal_amounte161d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amount_label8b9a0,setdebit_amount_label8b9a0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amountbfd7f,setdebit_amountbfd7f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [clear47c6a,setclear47c6a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [make_payment3a4e8,setmake_payment3a4e8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_details_label6f776,settransaction_details_label6f776] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_id19a2c,setitaxst_id19a2c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prnno_label2284a,setprnno_label2284a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [eslip_noe1f20,seteslip_noe1f20] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_type_labela8526,setpayment_type_labela8526] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_type_dropdown5d344,setpayment_type_dropdown5d344] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_no_label99095,setdebit_account_no_label99095] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_account_no9ec5d,setdebit_account_no9ec5d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payers_full_name_labeld7111,settax_payers_full_name_labeld7111] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_name8bf4d,settax_payer_full_name8bf4d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amount_label46f0a,setdebit_amount_label46f0a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [debit_amountbbf1f,setdebit_amountbbf1f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [loan_amt_labeleacfe,setloan_amt_labeleacfe] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [loan_amt3440e,setloan_amt3440e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [auth_memo_labelf0a0e,setauth_memo_labelf0a0e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [filename4f410,setfilename4f410] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [memo_documentuploader51a64,setmemo_documentuploader51a64] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [clear14cbd,setclear14cbd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [submitc9c9c,setsubmitc9c9c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [authorization_memo_file_label01fe5,setauthorization_memo_file_label01fe5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [reject5bd6a,setreject5bd6a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve79abe,setapprove79abe] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [documentviewercd49e,setdocumentviewercd49e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prndetails_label38a32,setprndetails_label38a32] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_no_label62fcb,setprn_no_label62fcb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [esip_no6f361,setesip_no6f361] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slip_payment_code_labelba3fe,setslip_payment_code_labelba3fe] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slip_payment_code983fc,setslip_payment_code983fc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_advice_date_label0a7cd,setpayment_advice_date_label0a7cd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_advice_datefb2ad,setpayment_advice_datefb2ad] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_pin_label532eb,settax_payer_pin_label532eb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_pin2328b,settax_payer_pin2328b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_name_label0ed9c,settax_payer_full_name_label0ed9c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tax_payer_full_namef6644,settax_payer_full_namef6644] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_idd3e56,setitaxst_idd3e56] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve_doc1f48f,setapprove_doc1f48f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve_delete12828,setapprove_delete12828] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxstd_iddb195,setitaxstd_iddb195] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [reason_label97548,setreason_label97548] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [reasone20ad,setreasone20ad] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [upload_file_label93f14,setupload_file_label93f14] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [itaxst_ida5acc,setitaxst_ida5acc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [documentuploader68dcb,setdocumentuploader68dcb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [file_name456cb,setfile_name456cb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [cancel68e13,setcancel68e13] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [credit_approve89f9a,setcredit_approve89f9a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tran_text6efd4,settran_text6efd4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [total_transactionse8381,settotal_transactionse8381] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_initiated0750d,setprn_initiated0750d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [prn_approvedff8ef,setprn_approvedff8ef] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [credit_pendingdce75,setcredit_pendingdce75] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [credit_approved179f5,setcredit_approved179f5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [payment_completedeae7f,setpayment_completedeae7f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [bar_chart386dd,setbar_chart386dd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pie_chartd26f3,setpie_chartd26f3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<Record<string, boolean>>({       columnitaxst_id95c9b:false,
       columneslip_node051:false,
       columnslip_payment_code99bf8:false,
       columnpayment_advice_date42330:false,
       columntax_payer_pin6f022:false,
       columntax_payer_full_name0bab4:false,
       columntotal_amount6ff13:false,
       buttonviewb80f4:false,
       buttonlogfd488:false,
       columncurrency925d5:false,
       buttonpayment2954d:false,
       columntrs_event_process_status3d5ac:false,
       buttonsearchf8868:false,
       buttonadd_new200e9:false,
       columnitaxst_id0eeff:false,
       columnprnb6d00:false,
       columnslip_payment_code9b31c:false,
       columnpayment_advice_date8473b:false,
       columntax_payer_pina5a64:false,
       columntax_payer_full_namee8e84:false,
       columntotal_amount99179:false,
       buttoncp_view07f80:false,
       buttoncp_log321e5:false,
       buttoncp_paymentcf667:false,
       columncurrency50540:false,
       columntrs_event_process_status332f5:false,
       columnitaxst_idda14c:false,
       columnprnaf781:false,
       columnslip_payment_code66d40:false,
       columnpayment_advice_date1d75f:false,
       columntax_payer_pin72747:false,
       columntax_payer_full_namea3d32:false,
       columntotal_amountb9286:false,
       columncurrency90f00:false,
       buttonvp_viewac3e4:false,
       buttonvp_log3f547:false,
       buttonvp_paymentbc4c5:false,
       columntrs_event_process_statusa505f:false,
       textinputprn_textinput88273:false,
       textinputslippaymentcodetextinputf76e3:false,
       textinputtaxpayerfullnametextinput0ac43:false,
       buttonclear43278:false,
       buttonsearch6f0c3:false,
       textadd_prnadd8d:false,
       textprn_no_labelefcac:false,
       textinputprn_no972eb:false,
       buttoncleara7662:false,
       buttonsaveda692:false,
       textview_details5f9dd:false,
       textprn_label348d7:false,
       texteslip_no1e386:false,
       textitaxst_id1d5bd:false,
       texteslip_details567e2:false,
       textprn_status_labele7b20:false,
       textpin_label660ea:false,
       texttax_payers_name_label86492:false,
       textinputprn_status83532:false,
       textinputpin7c9eb:false,
       textinputtax_payers_name38781:false,
       textprn_amount_labela6563:false,
       textcurrency_label786a3:false,
       textprn_reg_date_labelf0c46:false,
       textinputprn_amountd22c3:false,
       textinputcurrency1ef9b:false,
       textinputprn_registration_date67d15:false,
       columntax_code65046:false,
       columntax_component64ca3:false,
       columntax_period5506c:false,
       columnamountb7a3b:false,
       buttonrejectedc3cd0:false,
       buttonapprove242e3:false,
       texttran_jry_labelbaee1:false,
       timelinetransaction_journey39171:false,
       texttran_category_label4bfef:false,
       textprocessing_system_labele6ddd:false,
       texttran_categorycab42:false,
       textprocessing_systemcd502:false,
       buttonview_process_detailf4139:false,
       textprocess_details_label489c7:false,
       jsoneditorjson_viewer235e2:false,
       texttran_category_label7a433:false,
       texterror_cateogry_label0e2f6:false,
       texttran_category15644:false,
       texterror_cateogryebc09:false,
       texterror_code_labeld6aa7:false,
       texterror_description_labelbc214:false,
       texterror_codeba00c:false,
       texterror_description64756:false,
       buttonview_error_detaild4c71:false,
       texterror_details21287:false,
       jsoneditorjson_vieweree843:false,
       textprn_details7320a:false,
       columntax_code9c2db:false,
       columntax_component9766e:false,
       columntax_period17a7c:false,
       columnamount4e1d5:false,
       textpayment_details5a762:false,
       textpayment_type_labelb5c98:false,
       dropdownpayment_type_dropdownb558f:false,
       textdebit_account_no_label86b10:false,
       textinputdebit_account_noa9796:false,
       textavailable_bal_label22d5b:false,
       textinputbalancedcbd7:false,
       texttax_amount_label2b9ee:false,
       textinputtotal_amount46433:false,
       textdebit_amount_labelf6595:false,
       textinputdebit_amountf2e0e:false,
       textcheque_no_labeldb9c8:false,
       textinputcheque_nocda2a:false,
       textdebit_account_no_labelcdc37:false,
       textinputdebit_account_no53afb:false,
       textavailable_bal_label08076:false,
       textinputbalanceb280e:false,
       texttax_amount_labela2854:false,
       textinputtotal_amounte161d:false,
       textdebit_amount_label8b9a0:false,
       textinputdebit_amountbfd7f:false,
       buttonclear47c6a:false,
       buttonmake_payment3a4e8:false,
       texttransaction_details_label6f776:false,
       textitaxst_id19a2c:false,
       textprnno_label2284a:false,
       textinputeslip_noe1f20:false,
       textpayment_type_labela8526:false,
       textinputpayment_type_dropdown5d344:false,
       textdebit_account_no_label99095:false,
       textinputdebit_account_no9ec5d:false,
       texttax_payers_full_name_labeld7111:false,
       textinputtax_payer_full_name8bf4d:false,
       textdebit_amount_label46f0a:false,
       textinputdebit_amountbbf1f:false,
       textloan_amt_labeleacfe:false,
       textinputloan_amt3440e:false,
       textauth_memo_labelf0a0e:false,
       textfilename4f410:false,
       documentuploadermemo_documentuploader51a64:false,
       buttonclear14cbd:false,
       buttonsubmitc9c9c:false,
       textauthorization_memo_file_label01fe5:false,
       buttonreject5bd6a:false,
       buttonapprove79abe:false,
       documentviewerdocumentviewercd49e:false,
       textprndetails_label38a32:false,
       textprn_no_label62fcb:false,
       textesip_no6f361:false,
       textslip_payment_code_labelba3fe:false,
       textslip_payment_code983fc:false,
       textpayment_advice_date_label0a7cd:false,
       textpayment_advice_datefb2ad:false,
       texttax_payer_pin_label532eb:false,
       texttax_payer_pin2328b:false,
       texttax_payer_full_name_label0ed9c:false,
       texttax_payer_full_namef6644:false,
       textitaxst_idd3e56:false,
       columnapprove_doc1f48f:false,
       buttonapprove_delete12828:false,
       columnitaxstd_iddb195:false,
       textreason_label97548:false,
       textareareasone20ad:false,
       textupload_file_label93f14:false,
       textitaxst_ida5acc:false,
       documentuploaderdocumentuploader68dcb:false,
       textinputfile_name456cb:false,
       buttoncancel68e13:false,
       buttoncredit_approve89f9a:false,
       texttran_text6efd4:false,
       cardtotal_transactionse8381:false,
       cardprn_initiated0750d:false,
       cardprn_approvedff8ef:false,
       cardcredit_pendingdce75:false,
       cardcredit_approved179f5:false,
       cardpayment_completedeae7f:false,
       barchartbar_chart386dd:false,
       piechartpie_chartd26f3:false,
       groupoverallgroup4d9a0:false,
       groupitax_main_tab_group216b3:false,
       grouptab_process_new_prn5597e:false,
       tableitax_source_table1afd6:false,
       grouptab_credit_process_group546cc:false,
       tablecredit_process_table0cd4c:false,
       grouptab_view_processed_prn29a93:false,
       tableview_processed_prn_table8f5a5:false,
       groupsearch_group9a617:false,
       groupadd_prn_group1a4d8:false,
       groupview_detail_back_group50bce:false,
       groupview_detail_group73f21:false,
       tableprn_no_datails_tablefc106:false,
       groupviewed_details_grp73f21:false,
       tableprn_no_details_tablefc106:false,
       grouptran_journey_group30215:false,
       groupview_process_detail_groupe7fe3:false,
       groupprocess_details_json_viewer_group64f76:false,
       groupview_error_detail_group21845:false,
       grouperror_details_json_groupc13f1:false,
       groupprn_details_group00560:false,
       tableprn_datails_table2ad52:false,
       groupsubscreen_groupc0414:false,
       groupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_Cheque_v19ea86:false,
       grouppayment_type_cheque_group239dd:false,
       groupCT010_AF_UF_UFWS_I001_ITAX_ITAX_Payment_Type_DirectTransfer_v1dd0c7:false,
       grouppayment_type_dt_groupedf52:false,
       groupnew_prn_main_group21910:false,
       groupauthorization_memo_file_group17228:false,
       groupdocumentviewer_group0a3fb:false,
       groupoverall_group1e6a4:false,
       groupprndetails_group881d8:false,
       groupapplication_group16335:false,
       groupapplication_tab_groupf82f4:false,
       groupapprove1c1d3:false,
       tableapprove_tableafbb9:false,
       groupreason_group39480:false,
       groupchecker_approval_main_groupff981:false,
       groupitaxgroup732e5:false,
       groupoverall_dashboard54180:false,
       groupgrp_total_transactionse00c2:false,
       groupgrp_prn_initiated2f421:false,
       groupgrp_prn_approvedb95cb:false,
       groupgrp_credit_pendingfe0e2:false,
       groupgrp_credit_approved7e3bd:false,
       groupgrp_payment_completed34dec:false,
       groupgrp_bar_chart02e16:false,
       groupgrp_pie_chart2415d:false,
      })

  ////// screen states 
   const [itax_kedtb_main_screen_v1Props,setitax_kedtb_main_screen_v1Props] = React.useState<any>([])
   const [itax_main_screen_search_v1Props,setitax_main_screen_search_v1Props] = React.useState<any>([])
   const [itax_add_prn_v1Props,setitax_add_prn_v1Props] = React.useState<any>([])
   const [itax_view_details_v1Props,setitax_view_details_v1Props] = React.useState<any>([])
   const [itax_prn_approval_details_v1Props,setitax_prn_approval_details_v1Props] = React.useState<any>([])
   const [itax_tran_journey_v1Props,setitax_tran_journey_v1Props] = React.useState<any>([])
   const [itax_view_process_detail_v1Props,setitax_view_process_detail_v1Props] = React.useState<any>([])
   const [itax_view_process_details_json_viewer_v1Props,setitax_view_process_details_json_viewer_v1Props] = React.useState<any>([])
   const [itax_view_error_detail_v1Props,setitax_view_error_detail_v1Props] = React.useState<any>([])
   const [itax_view_error_details_json_viewer_v1Props,setitax_view_error_details_json_viewer_v1Props] = React.useState<any>([])
   const [itax_payment_details_v1Props,setitax_payment_details_v1Props] = React.useState<any>([])
   const [itax_creditflow_screen_v1Props,setitax_creditflow_screen_v1Props] = React.useState<any>([])
   const [itax_credit_approval_screen_v1Props,setitax_credit_approval_screen_v1Props] = React.useState<any>([])
   const [itax_checker_credit_approval_screen_v1Props,setitax_checker_credit_approval_screen_v1Props] = React.useState<any>([])
   const [itax_dashboard_v1Props,setitax_dashboard_v1Props] = React.useState<any>([])

///////// dfd
  const [dfd_itax_source_tran_dfd_v1Props,setdfd_itax_source_tran_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_source_tran_dtl_dfd_v1Props,setdfd_itax_source_tran_dtl_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_tran_log_dfd_v1Props,setdfd_itax_tran_log_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_tran_error_log_dfd_v1Props,setdfd_itax_tran_error_log_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_source_tran_doc_dfd_v1Props,setdfd_itax_source_tran_doc_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_dashboard_cards_v1Props,setdfd_itax_dashboard_cards_v1Props] = React.useState<any>([])
  const [dfd_itax_bar_chart_dfd_v1Props,setdfd_itax_bar_chart_dfd_v1Props] = React.useState<any>([])
  const [dfd_itax_pie_chart_dfd_v1Props,setdfd_itax_pie_chart_dfd_v1Props] = React.useState<any>([])
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
        overallgroup4d9a0, 
        setoverallgroup4d9a0,
        overallgroup4d9a0Props, 
        setoverallgroup4d9a0Props,
        itax_main_tab_group216b3, 
        setitax_main_tab_group216b3,
        itax_main_tab_group216b3Props, 
        setitax_main_tab_group216b3Props,
        tab_process_new_prn5597e, 
        settab_process_new_prn5597e,
        tab_process_new_prn5597eProps, 
        settab_process_new_prn5597eProps,
        itax_source_table1afd6, 
        setitax_source_table1afd6,
        itax_source_table1afd6Props, 
        setitax_source_table1afd6Props,
        tab_credit_process_group546cc, 
        settab_credit_process_group546cc,
        tab_credit_process_group546ccProps, 
        settab_credit_process_group546ccProps,
        credit_process_table0cd4c, 
        setcredit_process_table0cd4c,
        credit_process_table0cd4cProps, 
        setcredit_process_table0cd4cProps,
        tab_view_processed_prn29a93, 
        settab_view_processed_prn29a93,
        tab_view_processed_prn29a93Props, 
        settab_view_processed_prn29a93Props,
        view_processed_prn_table8f5a5, 
        setview_processed_prn_table8f5a5,
        view_processed_prn_table8f5a5Props, 
        setview_processed_prn_table8f5a5Props,
        search_group9a617, 
        setsearch_group9a617,
        search_group9a617Props, 
        setsearch_group9a617Props,
        add_prn_group1a4d8, 
        setadd_prn_group1a4d8,
        add_prn_group1a4d8Props, 
        setadd_prn_group1a4d8Props,
        view_detail_back_group50bce, 
        setview_detail_back_group50bce,
        view_detail_back_group50bceProps, 
        setview_detail_back_group50bceProps,
        view_detail_group73f21, 
        setview_detail_group73f21,
        view_detail_group73f21Props, 
        setview_detail_group73f21Props,
        prn_no_datails_tablefc106, 
        setprn_no_datails_tablefc106,
        prn_no_datails_tablefc106Props, 
        setprn_no_datails_tablefc106Props,
        viewed_details_grp73f21, 
        setviewed_details_grp73f21,
        viewed_details_grp73f21Props, 
        setviewed_details_grp73f21Props,
        prn_no_details_tablefc106, 
        setprn_no_details_tablefc106,
        prn_no_details_tablefc106Props, 
        setprn_no_details_tablefc106Props,
        tran_journey_group30215, 
        settran_journey_group30215,
        tran_journey_group30215Props, 
        settran_journey_group30215Props,
        view_process_detail_groupe7fe3, 
        setview_process_detail_groupe7fe3,
        view_process_detail_groupe7fe3Props, 
        setview_process_detail_groupe7fe3Props,
        process_details_json_viewer_group64f76, 
        setprocess_details_json_viewer_group64f76,
        process_details_json_viewer_group64f76Props, 
        setprocess_details_json_viewer_group64f76Props,
        view_error_detail_group21845, 
        setview_error_detail_group21845,
        view_error_detail_group21845Props, 
        setview_error_detail_group21845Props,
        error_details_json_groupc13f1, 
        seterror_details_json_groupc13f1,
        error_details_json_groupc13f1Props, 
        seterror_details_json_groupc13f1Props,
        prn_details_group00560, 
        setprn_details_group00560,
        prn_details_group00560Props, 
        setprn_details_group00560Props,
        prn_datails_table2ad52, 
        setprn_datails_table2ad52,
        prn_datails_table2ad52Props, 
        setprn_datails_table2ad52Props,
        subscreen_groupc0414, 
        setsubscreen_groupc0414,
        subscreen_groupc0414Props, 
        setsubscreen_groupc0414Props,
        ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, 
        setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
        ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, 
        setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props,
        payment_type_cheque_group239dd, 
        setpayment_type_cheque_group239dd,
        payment_type_cheque_group239ddProps, 
        setpayment_type_cheque_group239ddProps,
        ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, 
        setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
        ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, 
        setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props,
        payment_type_dt_groupedf52, 
        setpayment_type_dt_groupedf52,
        payment_type_dt_groupedf52Props, 
        setpayment_type_dt_groupedf52Props,
        new_prn_main_group21910, 
        setnew_prn_main_group21910,
        new_prn_main_group21910Props, 
        setnew_prn_main_group21910Props,
        authorization_memo_file_group17228, 
        setauthorization_memo_file_group17228,
        authorization_memo_file_group17228Props, 
        setauthorization_memo_file_group17228Props,
        documentviewer_group0a3fb, 
        setdocumentviewer_group0a3fb,
        documentviewer_group0a3fbProps, 
        setdocumentviewer_group0a3fbProps,
        overall_group1e6a4, 
        setoverall_group1e6a4,
        overall_group1e6a4Props, 
        setoverall_group1e6a4Props,
        prndetails_group881d8, 
        setprndetails_group881d8,
        prndetails_group881d8Props, 
        setprndetails_group881d8Props,
        application_group16335, 
        setapplication_group16335,
        application_group16335Props, 
        setapplication_group16335Props,
        application_tab_groupf82f4, 
        setapplication_tab_groupf82f4,
        application_tab_groupf82f4Props, 
        setapplication_tab_groupf82f4Props,
        approve1c1d3, 
        setapprove1c1d3,
        approve1c1d3Props, 
        setapprove1c1d3Props,
        approve_tableafbb9, 
        setapprove_tableafbb9,
        approve_tableafbb9Props, 
        setapprove_tableafbb9Props,
        reason_group39480, 
        setreason_group39480,
        reason_group39480Props, 
        setreason_group39480Props,
        checker_approval_main_groupff981, 
        setchecker_approval_main_groupff981,
        checker_approval_main_groupff981Props, 
        setchecker_approval_main_groupff981Props,
        itaxgroup732e5, 
        setitaxgroup732e5,
        itaxgroup732e5Props, 
        setitaxgroup732e5Props,
        overall_dashboard54180, 
        setoverall_dashboard54180,
        overall_dashboard54180Props, 
        setoverall_dashboard54180Props,
        grp_total_transactionse00c2, 
        setgrp_total_transactionse00c2,
        grp_total_transactionse00c2Props, 
        setgrp_total_transactionse00c2Props,
        grp_prn_initiated2f421, 
        setgrp_prn_initiated2f421,
        grp_prn_initiated2f421Props, 
        setgrp_prn_initiated2f421Props,
        grp_prn_approvedb95cb, 
        setgrp_prn_approvedb95cb,
        grp_prn_approvedb95cbProps, 
        setgrp_prn_approvedb95cbProps,
        grp_credit_pendingfe0e2, 
        setgrp_credit_pendingfe0e2,
        grp_credit_pendingfe0e2Props, 
        setgrp_credit_pendingfe0e2Props,
        grp_credit_approved7e3bd, 
        setgrp_credit_approved7e3bd,
        grp_credit_approved7e3bdProps, 
        setgrp_credit_approved7e3bdProps,
        grp_payment_completed34dec, 
        setgrp_payment_completed34dec,
        grp_payment_completed34decProps, 
        setgrp_payment_completed34decProps,
        grp_bar_chart02e16, 
        setgrp_bar_chart02e16,
        grp_bar_chart02e16Props, 
        setgrp_bar_chart02e16Props,
        grp_pie_chart2415d, 
        setgrp_pie_chart2415d,
        grp_pie_chart2415dProps, 
        setgrp_pie_chart2415dProps,
        itaxst_id95c9b,
        setitaxst_id95c9b, 
        eslip_node051,
        seteslip_node051, 
        slip_payment_code99bf8,
        setslip_payment_code99bf8, 
        payment_advice_date42330,
        setpayment_advice_date42330, 
        tax_payer_pin6f022,
        settax_payer_pin6f022, 
        tax_payer_full_name0bab4,
        settax_payer_full_name0bab4, 
        total_amount6ff13,
        settotal_amount6ff13, 
        viewb80f4,
        setviewb80f4, 
        logfd488,
        setlogfd488, 
        currency925d5,
        setcurrency925d5, 
        payment2954d,
        setpayment2954d, 
        trs_event_process_status3d5ac,
        settrs_event_process_status3d5ac, 
        searchf8868,
        setsearchf8868, 
        add_new200e9,
        setadd_new200e9, 
        itaxst_id0eeff,
        setitaxst_id0eeff, 
        prnb6d00,
        setprnb6d00, 
        slip_payment_code9b31c,
        setslip_payment_code9b31c, 
        payment_advice_date8473b,
        setpayment_advice_date8473b, 
        tax_payer_pina5a64,
        settax_payer_pina5a64, 
        tax_payer_full_namee8e84,
        settax_payer_full_namee8e84, 
        total_amount99179,
        settotal_amount99179, 
        cp_view07f80,
        setcp_view07f80, 
        cp_log321e5,
        setcp_log321e5, 
        cp_paymentcf667,
        setcp_paymentcf667, 
        currency50540,
        setcurrency50540, 
        trs_event_process_status332f5,
        settrs_event_process_status332f5, 
        itaxst_idda14c,
        setitaxst_idda14c, 
        prnaf781,
        setprnaf781, 
        slip_payment_code66d40,
        setslip_payment_code66d40, 
        payment_advice_date1d75f,
        setpayment_advice_date1d75f, 
        tax_payer_pin72747,
        settax_payer_pin72747, 
        tax_payer_full_namea3d32,
        settax_payer_full_namea3d32, 
        total_amountb9286,
        settotal_amountb9286, 
        currency90f00,
        setcurrency90f00, 
        vp_viewac3e4,
        setvp_viewac3e4, 
        vp_log3f547,
        setvp_log3f547, 
        vp_paymentbc4c5,
        setvp_paymentbc4c5, 
        trs_event_process_statusa505f,
        settrs_event_process_statusa505f, 
        prn_textinput88273,
        setprn_textinput88273, 
        slippaymentcodetextinputf76e3,
        setslippaymentcodetextinputf76e3, 
        taxpayerfullnametextinput0ac43,
        settaxpayerfullnametextinput0ac43, 
        clear43278,
        setclear43278, 
        search6f0c3,
        setsearch6f0c3, 
        add_prnadd8d,
        setadd_prnadd8d, 
        prn_no_labelefcac,
        setprn_no_labelefcac, 
        prn_no972eb,
        setprn_no972eb, 
        cleara7662,
        setcleara7662, 
        saveda692,
        setsaveda692, 
        view_details5f9dd,
        setview_details5f9dd, 
        prn_label348d7,
        setprn_label348d7, 
        eslip_no1e386,
        seteslip_no1e386, 
        itaxst_id1d5bd,
        setitaxst_id1d5bd, 
        eslip_details567e2,
        seteslip_details567e2, 
        prn_status_labele7b20,
        setprn_status_labele7b20, 
        pin_label660ea,
        setpin_label660ea, 
        tax_payers_name_label86492,
        settax_payers_name_label86492, 
        prn_status83532,
        setprn_status83532, 
        pin7c9eb,
        setpin7c9eb, 
        tax_payers_name38781,
        settax_payers_name38781, 
        prn_amount_labela6563,
        setprn_amount_labela6563, 
        currency_label786a3,
        setcurrency_label786a3, 
        prn_reg_date_labelf0c46,
        setprn_reg_date_labelf0c46, 
        prn_amountd22c3,
        setprn_amountd22c3, 
        currency1ef9b,
        setcurrency1ef9b, 
        prn_registration_date67d15,
        setprn_registration_date67d15, 
        tax_code65046,
        settax_code65046, 
        tax_component64ca3,
        settax_component64ca3, 
        tax_period5506c,
        settax_period5506c, 
        amountb7a3b,
        setamountb7a3b, 
        rejectedc3cd0,
        setrejectedc3cd0, 
        approve242e3,
        setapprove242e3, 
        tran_jry_labelbaee1,
        settran_jry_labelbaee1, 
        transaction_journey39171,
        settransaction_journey39171, 
        tran_category_label4bfef,
        settran_category_label4bfef, 
        processing_system_labele6ddd,
        setprocessing_system_labele6ddd, 
        tran_categorycab42,
        settran_categorycab42, 
        processing_systemcd502,
        setprocessing_systemcd502, 
        view_process_detailf4139,
        setview_process_detailf4139, 
        process_details_label489c7,
        setprocess_details_label489c7, 
        json_viewer235e2,
        setjson_viewer235e2, 
        tran_category_label7a433,
        settran_category_label7a433, 
        error_cateogry_label0e2f6,
        seterror_cateogry_label0e2f6, 
        tran_category15644,
        settran_category15644, 
        error_cateogryebc09,
        seterror_cateogryebc09, 
        error_code_labeld6aa7,
        seterror_code_labeld6aa7, 
        error_description_labelbc214,
        seterror_description_labelbc214, 
        error_codeba00c,
        seterror_codeba00c, 
        error_description64756,
        seterror_description64756, 
        view_error_detaild4c71,
        setview_error_detaild4c71, 
        error_details21287,
        seterror_details21287, 
        json_vieweree843,
        setjson_vieweree843, 
        prn_details7320a,
        setprn_details7320a, 
        tax_code9c2db,
        settax_code9c2db, 
        tax_component9766e,
        settax_component9766e, 
        tax_period17a7c,
        settax_period17a7c, 
        amount4e1d5,
        setamount4e1d5, 
        payment_details5a762,
        setpayment_details5a762, 
        payment_type_labelb5c98,
        setpayment_type_labelb5c98, 
        payment_type_dropdownb558f,
        setpayment_type_dropdownb558f, 
        debit_account_no_label86b10,
        setdebit_account_no_label86b10, 
        debit_account_noa9796,
        setdebit_account_noa9796, 
        available_bal_label22d5b,
        setavailable_bal_label22d5b, 
        balancedcbd7,
        setbalancedcbd7, 
        tax_amount_label2b9ee,
        settax_amount_label2b9ee, 
        total_amount46433,
        settotal_amount46433, 
        debit_amount_labelf6595,
        setdebit_amount_labelf6595, 
        debit_amountf2e0e,
        setdebit_amountf2e0e, 
        cheque_no_labeldb9c8,
        setcheque_no_labeldb9c8, 
        cheque_nocda2a,
        setcheque_nocda2a, 
        debit_account_no_labelcdc37,
        setdebit_account_no_labelcdc37, 
        debit_account_no53afb,
        setdebit_account_no53afb, 
        available_bal_label08076,
        setavailable_bal_label08076, 
        balanceb280e,
        setbalanceb280e, 
        tax_amount_labela2854,
        settax_amount_labela2854, 
        total_amounte161d,
        settotal_amounte161d, 
        debit_amount_label8b9a0,
        setdebit_amount_label8b9a0, 
        debit_amountbfd7f,
        setdebit_amountbfd7f, 
        clear47c6a,
        setclear47c6a, 
        make_payment3a4e8,
        setmake_payment3a4e8, 
        transaction_details_label6f776,
        settransaction_details_label6f776, 
        itaxst_id19a2c,
        setitaxst_id19a2c, 
        prnno_label2284a,
        setprnno_label2284a, 
        eslip_noe1f20,
        seteslip_noe1f20, 
        payment_type_labela8526,
        setpayment_type_labela8526, 
        payment_type_dropdown5d344,
        setpayment_type_dropdown5d344, 
        debit_account_no_label99095,
        setdebit_account_no_label99095, 
        debit_account_no9ec5d,
        setdebit_account_no9ec5d, 
        tax_payers_full_name_labeld7111,
        settax_payers_full_name_labeld7111, 
        tax_payer_full_name8bf4d,
        settax_payer_full_name8bf4d, 
        debit_amount_label46f0a,
        setdebit_amount_label46f0a, 
        debit_amountbbf1f,
        setdebit_amountbbf1f, 
        loan_amt_labeleacfe,
        setloan_amt_labeleacfe, 
        loan_amt3440e,
        setloan_amt3440e, 
        auth_memo_labelf0a0e,
        setauth_memo_labelf0a0e, 
        filename4f410,
        setfilename4f410, 
        memo_documentuploader51a64,
        setmemo_documentuploader51a64, 
        clear14cbd,
        setclear14cbd, 
        submitc9c9c,
        setsubmitc9c9c, 
        authorization_memo_file_label01fe5,
        setauthorization_memo_file_label01fe5, 
        reject5bd6a,
        setreject5bd6a, 
        approve79abe,
        setapprove79abe, 
        documentviewercd49e,
        setdocumentviewercd49e, 
        prndetails_label38a32,
        setprndetails_label38a32, 
        prn_no_label62fcb,
        setprn_no_label62fcb, 
        esip_no6f361,
        setesip_no6f361, 
        slip_payment_code_labelba3fe,
        setslip_payment_code_labelba3fe, 
        slip_payment_code983fc,
        setslip_payment_code983fc, 
        payment_advice_date_label0a7cd,
        setpayment_advice_date_label0a7cd, 
        payment_advice_datefb2ad,
        setpayment_advice_datefb2ad, 
        tax_payer_pin_label532eb,
        settax_payer_pin_label532eb, 
        tax_payer_pin2328b,
        settax_payer_pin2328b, 
        tax_payer_full_name_label0ed9c,
        settax_payer_full_name_label0ed9c, 
        tax_payer_full_namef6644,
        settax_payer_full_namef6644, 
        itaxst_idd3e56,
        setitaxst_idd3e56, 
        approve_doc1f48f,
        setapprove_doc1f48f, 
        approve_delete12828,
        setapprove_delete12828, 
        itaxstd_iddb195,
        setitaxstd_iddb195, 
        reason_label97548,
        setreason_label97548, 
        reasone20ad,
        setreasone20ad, 
        upload_file_label93f14,
        setupload_file_label93f14, 
        itaxst_ida5acc,
        setitaxst_ida5acc, 
        documentuploader68dcb,
        setdocumentuploader68dcb, 
        file_name456cb,
        setfile_name456cb, 
        cancel68e13,
        setcancel68e13, 
        credit_approve89f9a,
        setcredit_approve89f9a, 
        tran_text6efd4,
        settran_text6efd4, 
        total_transactionse8381,
        settotal_transactionse8381, 
        prn_initiated0750d,
        setprn_initiated0750d, 
        prn_approvedff8ef,
        setprn_approvedff8ef, 
        credit_pendingdce75,
        setcredit_pendingdce75, 
        credit_approved179f5,
        setcredit_approved179f5, 
        payment_completedeae7f,
        setpayment_completedeae7f, 
        bar_chart386dd,
        setbar_chart386dd, 
        pie_chartd26f3,
        setpie_chartd26f3, 
        ////// screen states 
          itax_kedtb_main_screen_v1Props,
          setitax_kedtb_main_screen_v1Props,
          itax_main_screen_search_v1Props,
          setitax_main_screen_search_v1Props,
          itax_add_prn_v1Props,
          setitax_add_prn_v1Props,
          itax_view_details_v1Props,
          setitax_view_details_v1Props,
          itax_prn_approval_details_v1Props,
          setitax_prn_approval_details_v1Props,
          itax_tran_journey_v1Props,
          setitax_tran_journey_v1Props,
          itax_view_process_detail_v1Props,
          setitax_view_process_detail_v1Props,
          itax_view_process_details_json_viewer_v1Props,
          setitax_view_process_details_json_viewer_v1Props,
          itax_view_error_detail_v1Props,
          setitax_view_error_detail_v1Props,
          itax_view_error_details_json_viewer_v1Props,
          setitax_view_error_details_json_viewer_v1Props,
          itax_payment_details_v1Props,
          setitax_payment_details_v1Props,
          itax_creditflow_screen_v1Props,
          setitax_creditflow_screen_v1Props,
          itax_credit_approval_screen_v1Props,
          setitax_credit_approval_screen_v1Props,
          itax_checker_credit_approval_screen_v1Props,
          setitax_checker_credit_approval_screen_v1Props,
          itax_dashboard_v1Props,
          setitax_dashboard_v1Props,
        //////////

        ///////// dfd
        dfd_itax_source_tran_dfd_v1Props,
        setdfd_itax_source_tran_dfd_v1Props,
        dfd_itax_source_tran_dtl_dfd_v1Props,
        setdfd_itax_source_tran_dtl_dfd_v1Props,
        dfd_itax_tran_log_dfd_v1Props,
        setdfd_itax_tran_log_dfd_v1Props,
        dfd_itax_tran_error_log_dfd_v1Props,
        setdfd_itax_tran_error_log_dfd_v1Props,
        dfd_itax_source_tran_doc_dfd_v1Props,
        setdfd_itax_source_tran_doc_dfd_v1Props,
        dfd_itax_dashboard_cards_v1Props,
        setdfd_itax_dashboard_cards_v1Props,
        dfd_itax_bar_chart_dfd_v1Props,
        setdfd_itax_bar_chart_dfd_v1Props,
        dfd_itax_pie_chart_dfd_v1Props,
        setdfd_itax_pie_chart_dfd_v1Props,
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