


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
  view_all_journey_group67ce4: any 
  setview_all_journey_group67ce4: React.Dispatch<React.SetStateAction<any>>
  view_all_journey_group67ce4Props: any 
  setview_all_journey_group67ce4Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab69f01: any 
  setfailure_queue_tab69f01: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tab69f01Props: any 
  setfailure_queue_tab69f01Props: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tablea476f: any 
  setfailure_queue_tablea476f: React.Dispatch<React.SetStateAction<any>>
  failure_queue_tablea476fProps: any 
  setfailure_queue_tablea476fProps: React.Dispatch<React.SetStateAction<any>>
  failure_queue_journey_group36aba: any 
  setfailure_queue_journey_group36aba: React.Dispatch<React.SetStateAction<any>>
  failure_queue_journey_group36abaProps: any 
  setfailure_queue_journey_group36abaProps: React.Dispatch<React.SetStateAction<any>>
  success_queue_tabef582: any 
  setsuccess_queue_tabef582: React.Dispatch<React.SetStateAction<any>>
  success_queue_tabef582Props: any 
  setsuccess_queue_tabef582Props: React.Dispatch<React.SetStateAction<any>>
  success_queue_table63aae: any 
  setsuccess_queue_table63aae: React.Dispatch<React.SetStateAction<any>>
  success_queue_table63aaeProps: any 
  setsuccess_queue_table63aaeProps: React.Dispatch<React.SetStateAction<any>>
  success_queue_journey_group755eb: any 
  setsuccess_queue_journey_group755eb: React.Dispatch<React.SetStateAction<any>>
  success_queue_journey_group755ebProps: any 
  setsuccess_queue_journey_group755ebProps: React.Dispatch<React.SetStateAction<any>>
  return_queue_tab5611e: any 
  setreturn_queue_tab5611e: React.Dispatch<React.SetStateAction<any>>
  return_queue_tab5611eProps: any 
  setreturn_queue_tab5611eProps: React.Dispatch<React.SetStateAction<any>>
  return_queue_table267f0: any 
  setreturn_queue_table267f0: React.Dispatch<React.SetStateAction<any>>
  return_queue_table267f0Props: any 
  setreturn_queue_table267f0Props: React.Dispatch<React.SetStateAction<any>>
  return_queue_journey_group92c55: any 
  setreturn_queue_journey_group92c55: React.Dispatch<React.SetStateAction<any>>
  return_queue_journey_group92c55Props: any 
  setreturn_queue_journey_group92c55Props: React.Dispatch<React.SetStateAction<any>>
  operational_pending_tab67331: any 
  setoperational_pending_tab67331: React.Dispatch<React.SetStateAction<any>>
  operational_pending_tab67331Props: any 
  setoperational_pending_tab67331Props: React.Dispatch<React.SetStateAction<any>>
  operational_pending_table0a253: any 
  setoperational_pending_table0a253: React.Dispatch<React.SetStateAction<any>>
  operational_pending_table0a253Props: any 
  setoperational_pending_table0a253Props: React.Dispatch<React.SetStateAction<any>>
  operational_pending_journey_group63667: any 
  setoperational_pending_journey_group63667: React.Dispatch<React.SetStateAction<any>>
  operational_pending_journey_group63667Props: any 
  setoperational_pending_journey_group63667Props: React.Dispatch<React.SetStateAction<any>>
  technical_pending_tab0b23f: any 
  settechnical_pending_tab0b23f: React.Dispatch<React.SetStateAction<any>>
  technical_pending_tab0b23fProps: any 
  settechnical_pending_tab0b23fProps: React.Dispatch<React.SetStateAction<any>>
  technical_pending_table84f30: any 
  settechnical_pending_table84f30: React.Dispatch<React.SetStateAction<any>>
  technical_pending_table84f30Props: any 
  settechnical_pending_table84f30Props: React.Dispatch<React.SetStateAction<any>>
  technical_pending_journey_groupe4f03: any 
  settechnical_pending_journey_groupe4f03: React.Dispatch<React.SetStateAction<any>>
  technical_pending_journey_groupe4f03Props: any 
  settechnical_pending_journey_groupe4f03Props: React.Dispatch<React.SetStateAction<any>>
  main_group9066f: any 
  setmain_group9066f: React.Dispatch<React.SetStateAction<any>>
  main_group9066fProps: any 
  setmain_group9066fProps: React.Dispatch<React.SetStateAction<any>>
  overallgroup01c61: any 
  setoverallgroup01c61: React.Dispatch<React.SetStateAction<any>>
  overallgroup01c61Props: any 
  setoverallgroup01c61Props: React.Dispatch<React.SetStateAction<any>>
  controlgroupda197: any 
  setcontrolgroupda197: React.Dispatch<React.SetStateAction<any>>
  controlgroupda197Props: any 
  setcontrolgroupda197Props: React.Dispatch<React.SetStateAction<any>>
  control_tab_groupbc3e2: any 
  setcontrol_tab_groupbc3e2: React.Dispatch<React.SetStateAction<any>>
  control_tab_groupbc3e2Props: any 
  setcontrol_tab_groupbc3e2Props: React.Dispatch<React.SetStateAction<any>>
  button_group74f3e: any 
  setbutton_group74f3e: React.Dispatch<React.SetStateAction<any>>
  button_group74f3eProps: any 
  setbutton_group74f3eProps: React.Dispatch<React.SetStateAction<any>>
  rtgs_infofd0aa: any 
  setrtgs_infofd0aa: React.Dispatch<React.SetStateAction<any>>
  rtgs_infofd0aaProps: any 
  setrtgs_infofd0aaProps: React.Dispatch<React.SetStateAction<any>>
  allcontrols71c54: any 
  setallcontrols71c54: React.Dispatch<React.SetStateAction<any>>
  allcontrols71c54Props: any 
  setallcontrols71c54Props: React.Dispatch<React.SetStateAction<any>>
  commoninfof4607: any 
  setcommoninfof4607: React.Dispatch<React.SetStateAction<any>>
  commoninfof4607Props: any 
  setcommoninfof4607Props: React.Dispatch<React.SetStateAction<any>>
  basicinfo3d198: any 
  setbasicinfo3d198: React.Dispatch<React.SetStateAction<any>>
  basicinfo3d198Props: any 
  setbasicinfo3d198Props: React.Dispatch<React.SetStateAction<any>>
  additionalinfod2894: any 
  setadditionalinfod2894: React.Dispatch<React.SetStateAction<any>>
  additionalinfod2894Props: any 
  setadditionalinfod2894Props: React.Dispatch<React.SetStateAction<any>>
  listgroupdcdbd: any 
  setlistgroupdcdbd: React.Dispatch<React.SetStateAction<any>>
  listgroupdcdbdProps: any 
  setlistgroupdcdbdProps: React.Dispatch<React.SetStateAction<any>>
  list_tab_groupd6905: any 
  setlist_tab_groupd6905: React.Dispatch<React.SetStateAction<any>>
  list_tab_groupd6905Props: any 
  setlist_tab_groupd6905Props: React.Dispatch<React.SetStateAction<any>>
  document_list38c6e: any 
  setdocument_list38c6e: React.Dispatch<React.SetStateAction<any>>
  document_list38c6eProps: any 
  setdocument_list38c6eProps: React.Dispatch<React.SetStateAction<any>>
  doclisttable56e97: any 
  setdoclisttable56e97: React.Dispatch<React.SetStateAction<any>>
  doclisttable56e97Props: any 
  setdoclisttable56e97Props: React.Dispatch<React.SetStateAction<any>>
  validation_listae827: any 
  setvalidation_listae827: React.Dispatch<React.SetStateAction<any>>
  validation_listae827Props: any 
  setvalidation_listae827Props: React.Dispatch<React.SetStateAction<any>>
  valdnlisttable17ec7: any 
  setvaldnlisttable17ec7: React.Dispatch<React.SetStateAction<any>>
  valdnlisttable17ec7Props: any 
  setvaldnlisttable17ec7Props: React.Dispatch<React.SetStateAction<any>>
  comment_list72944: any 
  setcomment_list72944: React.Dispatch<React.SetStateAction<any>>
  comment_list72944Props: any 
  setcomment_list72944Props: React.Dispatch<React.SetStateAction<any>>
  cmntlisttable02d0e: any 
  setcmntlisttable02d0e: React.Dispatch<React.SetStateAction<any>>
  cmntlisttable02d0eProps: any 
  setcmntlisttable02d0eProps: React.Dispatch<React.SetStateAction<any>>
  rtgs_lista0a19: any 
  setrtgs_lista0a19: React.Dispatch<React.SetStateAction<any>>
  rtgs_lista0a19Props: any 
  setrtgs_lista0a19Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_grpcf7d8: any 
  setrtgs_list_grpcf7d8: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_grpcf7d8Props: any 
  setrtgs_list_grpcf7d8Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_table7b8d6: any 
  setrtgs_list_table7b8d6: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_table7b8d6Props: any 
  setrtgs_list_table7b8d6Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_tab_grp024e1: any 
  setrtgs_list_tab_grp024e1: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_tab_grp024e1Props: any 
  setrtgs_list_tab_grp024e1Props: React.Dispatch<React.SetStateAction<any>>
  documnt_list03a06: any 
  setdocumnt_list03a06: React.Dispatch<React.SetStateAction<any>>
  documnt_list03a06Props: any 
  setdocumnt_list03a06Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_doc_table_grp8a593: any 
  setrtgs_list_doc_table_grp8a593: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_doc_table_grp8a593Props: any 
  setrtgs_list_doc_table_grp8a593Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_lst_doc_list_tablee57bb: any 
  setrtgs_lst_doc_list_tablee57bb: React.Dispatch<React.SetStateAction<any>>
  rtgs_lst_doc_list_tablee57bbProps: any 
  setrtgs_lst_doc_list_tablee57bbProps: React.Dispatch<React.SetStateAction<any>>
  validtn_lista5b14: any 
  setvalidtn_lista5b14: React.Dispatch<React.SetStateAction<any>>
  validtn_lista5b14Props: any 
  setvalidtn_lista5b14Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_validtn_list_grpc5569: any 
  setrtgs_list_validtn_list_grpc5569: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_validtn_list_grpc5569Props: any 
  setrtgs_list_validtn_list_grpc5569Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_validtn_table39a42: any 
  setrtgs_list_validtn_table39a42: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_validtn_table39a42Props: any 
  setrtgs_list_validtn_table39a42Props: React.Dispatch<React.SetStateAction<any>>
  cmnt_listebbbc: any 
  setcmnt_listebbbc: React.Dispatch<React.SetStateAction<any>>
  cmnt_listebbbcProps: any 
  setcmnt_listebbbcProps: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_cmnt_list_grpb5728: any 
  setrtgs_list_cmnt_list_grpb5728: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_cmnt_list_grpb5728Props: any 
  setrtgs_list_cmnt_list_grpb5728Props: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_cmnts_list15716: any 
  setrtgs_list_cmnts_list15716: React.Dispatch<React.SetStateAction<any>>
  rtgs_list_cmnts_list15716Props: any 
  setrtgs_list_cmnts_list15716Props: React.Dispatch<React.SetStateAction<any>>
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
  overallgroup05ff6: any 
  setoverallgroup05ff6: React.Dispatch<React.SetStateAction<any>>
  overallgroup05ff6Props: any 
  setoverallgroup05ff6Props: React.Dispatch<React.SetStateAction<any>>
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
  view_all_journeyd3ae9: any,
  setview_all_journeyd3ae9:React.Dispatch<React.SetStateAction<any>>
  view_all_journeyd3ae9Props: any 
  setview_all_journeyd3ae9Props: React.Dispatch<React.SetStateAction<any>>
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
  failure_queue_journeyc8638: any,
  setfailure_queue_journeyc8638:React.Dispatch<React.SetStateAction<any>>
  failure_queue_journeyc8638Props: any 
  setfailure_queue_journeyc8638Props: React.Dispatch<React.SetStateAction<any>>
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
  success_queue_journey68ac9: any,
  setsuccess_queue_journey68ac9:React.Dispatch<React.SetStateAction<any>>
  success_queue_journey68ac9Props: any 
  setsuccess_queue_journey68ac9Props: React.Dispatch<React.SetStateAction<any>>
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
  return_queue_journeycc9d3: any,
  setreturn_queue_journeycc9d3:React.Dispatch<React.SetStateAction<any>>
  return_queue_journeycc9d3Props: any 
  setreturn_queue_journeycc9d3Props: React.Dispatch<React.SetStateAction<any>>
  product_code_operational_pending6ecd4: any,
  setproduct_code_operational_pending6ecd4:React.Dispatch<React.SetStateAction<any>>
  product_code_operational_pending6ecd4Props: any 
  setproduct_code_operational_pending6ecd4Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_operational_pending2ab87: any,
  setchannel_name_operational_pending2ab87:React.Dispatch<React.SetStateAction<any>>
  channel_name_operational_pending2ab87Props: any 
  setchannel_name_operational_pending2ab87Props: React.Dispatch<React.SetStateAction<any>>
  uuid_operational_pendinga8ff6: any,
  setuuid_operational_pendinga8ff6:React.Dispatch<React.SetStateAction<any>>
  uuid_operational_pendinga8ff6Props: any 
  setuuid_operational_pendinga8ff6Props: React.Dispatch<React.SetStateAction<any>>
  dr_account_operational_pending5146b: any,
  setdr_account_operational_pending5146b:React.Dispatch<React.SetStateAction<any>>
  dr_account_operational_pending5146bProps: any 
  setdr_account_operational_pending5146bProps: React.Dispatch<React.SetStateAction<any>>
  dr_amount_operational_pending70e3f: any,
  setdr_amount_operational_pending70e3f:React.Dispatch<React.SetStateAction<any>>
  dr_amount_operational_pending70e3fProps: any 
  setdr_amount_operational_pending70e3fProps: React.Dispatch<React.SetStateAction<any>>
  cr_account_operational_pendingf9a9c: any,
  setcr_account_operational_pendingf9a9c:React.Dispatch<React.SetStateAction<any>>
  cr_account_operational_pendingf9a9cProps: any 
  setcr_account_operational_pendingf9a9cProps: React.Dispatch<React.SetStateAction<any>>
  cr_amount_operational_pendingbce21: any,
  setcr_amount_operational_pendingbce21:React.Dispatch<React.SetStateAction<any>>
  cr_amount_operational_pendingbce21Props: any 
  setcr_amount_operational_pendingbce21Props: React.Dispatch<React.SetStateAction<any>>
  remittance_info_operational_pending282bc: any,
  setremittance_info_operational_pending282bc:React.Dispatch<React.SetStateAction<any>>
  remittance_info_operational_pending282bcProps: any 
  setremittance_info_operational_pending282bcProps: React.Dispatch<React.SetStateAction<any>>
  status_operational_pending0df81: any,
  setstatus_operational_pending0df81:React.Dispatch<React.SetStateAction<any>>
  status_operational_pending0df81Props: any 
  setstatus_operational_pending0df81Props: React.Dispatch<React.SetStateAction<any>>
  new_payment_chk_approve_btn770f9: any,
  setnew_payment_chk_approve_btn770f9:React.Dispatch<React.SetStateAction<any>>
  new_payment_chk_approve_btn770f9Props: any 
  setnew_payment_chk_approve_btn770f9Props: React.Dispatch<React.SetStateAction<any>>
  new_payment_chk_reject_btn4c9a0: any,
  setnew_payment_chk_reject_btn4c9a0:React.Dispatch<React.SetStateAction<any>>
  new_payment_chk_reject_btn4c9a0Props: any 
  setnew_payment_chk_reject_btn4c9a0Props: React.Dispatch<React.SetStateAction<any>>
  view_details00488: any,
  setview_details00488:React.Dispatch<React.SetStateAction<any>>
  view_details00488Props: any 
  setview_details00488Props: React.Dispatch<React.SetStateAction<any>>
  operational_pending_journey1a1a5: any,
  setoperational_pending_journey1a1a5:React.Dispatch<React.SetStateAction<any>>
  operational_pending_journey1a1a5Props: any 
  setoperational_pending_journey1a1a5Props: React.Dispatch<React.SetStateAction<any>>
  product_code_technical_pending11fe0: any,
  setproduct_code_technical_pending11fe0:React.Dispatch<React.SetStateAction<any>>
  product_code_technical_pending11fe0Props: any 
  setproduct_code_technical_pending11fe0Props: React.Dispatch<React.SetStateAction<any>>
  channel_name_technical_pendinge182f: any,
  setchannel_name_technical_pendinge182f:React.Dispatch<React.SetStateAction<any>>
  channel_name_technical_pendinge182fProps: any 
  setchannel_name_technical_pendinge182fProps: React.Dispatch<React.SetStateAction<any>>
  uuid_technical_pendingbc6bb: any,
  setuuid_technical_pendingbc6bb:React.Dispatch<React.SetStateAction<any>>
  uuid_technical_pendingbc6bbProps: any 
  setuuid_technical_pendingbc6bbProps: React.Dispatch<React.SetStateAction<any>>
  dr_account_technical_pendingbc856: any,
  setdr_account_technical_pendingbc856:React.Dispatch<React.SetStateAction<any>>
  dr_account_technical_pendingbc856Props: any 
  setdr_account_technical_pendingbc856Props: React.Dispatch<React.SetStateAction<any>>
  dr_amount_technical_pending5e6cc: any,
  setdr_amount_technical_pending5e6cc:React.Dispatch<React.SetStateAction<any>>
  dr_amount_technical_pending5e6ccProps: any 
  setdr_amount_technical_pending5e6ccProps: React.Dispatch<React.SetStateAction<any>>
  cr_account_technical_pending3c4aa: any,
  setcr_account_technical_pending3c4aa:React.Dispatch<React.SetStateAction<any>>
  cr_account_technical_pending3c4aaProps: any 
  setcr_account_technical_pending3c4aaProps: React.Dispatch<React.SetStateAction<any>>
  cr_amount_technical_pending1bc34: any,
  setcr_amount_technical_pending1bc34:React.Dispatch<React.SetStateAction<any>>
  cr_amount_technical_pending1bc34Props: any 
  setcr_amount_technical_pending1bc34Props: React.Dispatch<React.SetStateAction<any>>
  remittance_info_technical_pending78349: any,
  setremittance_info_technical_pending78349:React.Dispatch<React.SetStateAction<any>>
  remittance_info_technical_pending78349Props: any 
  setremittance_info_technical_pending78349Props: React.Dispatch<React.SetStateAction<any>>
  status_technical_pending738a2: any,
  setstatus_technical_pending738a2:React.Dispatch<React.SetStateAction<any>>
  status_technical_pending738a2Props: any 
  setstatus_technical_pending738a2Props: React.Dispatch<React.SetStateAction<any>>
  technical_pending_journey6601c: any,
  settechnical_pending_journey6601c:React.Dispatch<React.SetStateAction<any>>
  technical_pending_journey6601cProps: any 
  settechnical_pending_journey6601cProps: React.Dispatch<React.SetStateAction<any>>
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
  new_payment7f5db: any,
  setnew_payment7f5db:React.Dispatch<React.SetStateAction<any>>
  new_payment7f5dbProps: any 
  setnew_payment7f5dbProps: React.Dispatch<React.SetStateAction<any>>
  search_label27572: any,
  setsearch_label27572:React.Dispatch<React.SetStateAction<any>>
  search_label27572Props: any 
  setsearch_label27572Props: React.Dispatch<React.SetStateAction<any>>
  top_divider52f90: any,
  settop_divider52f90:React.Dispatch<React.SetStateAction<any>>
  top_divider52f90Props: any 
  settop_divider52f90Props: React.Dispatch<React.SetStateAction<any>>
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
  bottom_dividerb9220: any,
  setbottom_dividerb9220:React.Dispatch<React.SetStateAction<any>>
  bottom_dividerb9220Props: any 
  setbottom_dividerb9220Props: React.Dispatch<React.SetStateAction<any>>
  search0e695: any,
  setsearch0e695:React.Dispatch<React.SetStateAction<any>>
  search0e695Props: any 
  setsearch0e695Props: React.Dispatch<React.SetStateAction<any>>
  cleareddfa: any,
  setcleareddfa:React.Dispatch<React.SetStateAction<any>>
  cleareddfaProps: any 
  setcleareddfaProps: React.Dispatch<React.SetStateAction<any>>
  scan31ce1: any,
  setscan31ce1:React.Dispatch<React.SetStateAction<any>>
  scan31ce1Props: any 
  setscan31ce1Props: React.Dispatch<React.SetStateAction<any>>
  folderscanf14e0: any,
  setfolderscanf14e0:React.Dispatch<React.SetStateAction<any>>
  folderscanf14e0Props: any 
  setfolderscanf14e0Props: React.Dispatch<React.SetStateAction<any>>
  savef2390: any,
  setsavef2390:React.Dispatch<React.SetStateAction<any>>
  savef2390Props: any 
  setsavef2390Props: React.Dispatch<React.SetStateAction<any>>
  cancel2bf72: any,
  setcancel2bf72:React.Dispatch<React.SetStateAction<any>>
  cancel2bf72Props: any 
  setcancel2bf72Props: React.Dispatch<React.SetStateAction<any>>
  updateed7a9: any,
  setupdateed7a9:React.Dispatch<React.SetStateAction<any>>
  updateed7a9Props: any 
  setupdateed7a9Props: React.Dispatch<React.SetStateAction<any>>
  delete3ad2e: any,
  setdelete3ad2e:React.Dispatch<React.SetStateAction<any>>
  delete3ad2eProps: any 
  setdelete3ad2eProps: React.Dispatch<React.SetStateAction<any>>
  common_info3a458: any,
  setcommon_info3a458:React.Dispatch<React.SetStateAction<any>>
  common_info3a458Props: any 
  setcommon_info3a458Props: React.Dispatch<React.SetStateAction<any>>
  dr_account27abb: any,
  setdr_account27abb:React.Dispatch<React.SetStateAction<any>>
  dr_account27abbProps: any 
  setdr_account27abbProps: React.Dispatch<React.SetStateAction<any>>
  dr_name84266: any,
  setdr_name84266:React.Dispatch<React.SetStateAction<any>>
  dr_name84266Props: any 
  setdr_name84266Props: React.Dispatch<React.SetStateAction<any>>
  base_currencyb386d: any,
  setbase_currencyb386d:React.Dispatch<React.SetStateAction<any>>
  base_currencyb386dProps: any 
  setbase_currencyb386dProps: React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_sanc_lmtb74f7: any,
  setdr_cust_ac_sanc_lmtb74f7:React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_sanc_lmtb74f7Props: any 
  setdr_cust_ac_sanc_lmtb74f7Props: React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_balance753dd: any,
  setdr_cust_ac_balance753dd:React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_balance753ddProps: any 
  setdr_cust_ac_balance753ddProps: React.Dispatch<React.SetStateAction<any>>
  basic_info216f3: any,
  setbasic_info216f3:React.Dispatch<React.SetStateAction<any>>
  basic_info216f3Props: any 
  setbasic_info216f3Props: React.Dispatch<React.SetStateAction<any>>
  waive_charges929e5: any,
  setwaive_charges929e5:React.Dispatch<React.SetStateAction<any>>
  waive_charges929e5Props: any 
  setwaive_charges929e5Props: React.Dispatch<React.SetStateAction<any>>
  cr_accounta818b: any,
  setcr_accounta818b:React.Dispatch<React.SetStateAction<any>>
  cr_accounta818bProps: any 
  setcr_accounta818bProps: React.Dispatch<React.SetStateAction<any>>
  cr_namea4b34: any,
  setcr_namea4b34:React.Dispatch<React.SetStateAction<any>>
  cr_namea4b34Props: any 
  setcr_namea4b34Props: React.Dispatch<React.SetStateAction<any>>
  cr_bank_code8a2bc: any,
  setcr_bank_code8a2bc:React.Dispatch<React.SetStateAction<any>>
  cr_bank_code8a2bcProps: any 
  setcr_bank_code8a2bcProps: React.Dispatch<React.SetStateAction<any>>
  cr_bank_name434eb: any,
  setcr_bank_name434eb:React.Dispatch<React.SetStateAction<any>>
  cr_bank_name434ebProps: any 
  setcr_bank_name434ebProps: React.Dispatch<React.SetStateAction<any>>
  cr_bank_bic3d26f: any,
  setcr_bank_bic3d26f:React.Dispatch<React.SetStateAction<any>>
  cr_bank_bic3d26fProps: any 
  setcr_bank_bic3d26fProps: React.Dispatch<React.SetStateAction<any>>
  forex_currency65e0b: any,
  setforex_currency65e0b:React.Dispatch<React.SetStateAction<any>>
  forex_currency65e0bProps: any 
  setforex_currency65e0bProps: React.Dispatch<React.SetStateAction<any>>
  exchange_rate88caf: any,
  setexchange_rate88caf:React.Dispatch<React.SetStateAction<any>>
  exchange_rate88cafProps: any 
  setexchange_rate88cafProps: React.Dispatch<React.SetStateAction<any>>
  rate_codee56ad: any,
  setrate_codee56ad:React.Dispatch<React.SetStateAction<any>>
  rate_codee56adProps: any 
  setrate_codee56adProps: React.Dispatch<React.SetStateAction<any>>
  forex_amounta58a5: any,
  setforex_amounta58a5:React.Dispatch<React.SetStateAction<any>>
  forex_amounta58a5Props: any 
  setforex_amounta58a5Props: React.Dispatch<React.SetStateAction<any>>
  base_amount3b226: any,
  setbase_amount3b226:React.Dispatch<React.SetStateAction<any>>
  base_amount3b226Props: any 
  setbase_amount3b226Props: React.Dispatch<React.SetStateAction<any>>
  rate_ref_no82399: any,
  setrate_ref_no82399:React.Dispatch<React.SetStateAction<any>>
  rate_ref_no82399Props: any 
  setrate_ref_no82399Props: React.Dispatch<React.SetStateAction<any>>
  rate_cust_idad42a: any,
  setrate_cust_idad42a:React.Dispatch<React.SetStateAction<any>>
  rate_cust_idad42aProps: any 
  setrate_cust_idad42aProps: React.Dispatch<React.SetStateAction<any>>
  addtional_info46cb8: any,
  setaddtional_info46cb8:React.Dispatch<React.SetStateAction<any>>
  addtional_info46cb8Props: any 
  setaddtional_info46cb8Props: React.Dispatch<React.SetStateAction<any>>
  vgphsts_uuidcf6fc: any,
  setvgphsts_uuidcf6fc:React.Dispatch<React.SetStateAction<any>>
  vgphsts_uuidcf6fcProps: any 
  setvgphsts_uuidcf6fcProps: React.Dispatch<React.SetStateAction<any>>
  remittance_infoba5e0: any,
  setremittance_infoba5e0:React.Dispatch<React.SetStateAction<any>>
  remittance_infoba5e0Props: any 
  setremittance_infoba5e0Props: React.Dispatch<React.SetStateAction<any>>
  additional_reff63a3: any,
  setadditional_reff63a3:React.Dispatch<React.SetStateAction<any>>
  additional_reff63a3Props: any 
  setadditional_reff63a3Props: React.Dispatch<React.SetStateAction<any>>
  customwidgetd7e47: any,
  setcustomwidgetd7e47:React.Dispatch<React.SetStateAction<any>>
  customwidgetd7e47Props: any 
  setcustomwidgetd7e47Props: React.Dispatch<React.SetStateAction<any>>
  filename7c104: any,
  setfilename7c104:React.Dispatch<React.SetStateAction<any>>
  filename7c104Props: any 
  setfilename7c104Props: React.Dispatch<React.SetStateAction<any>>
  actionf530a: any,
  setactionf530a:React.Dispatch<React.SetStateAction<any>>
  actionf530aProps: any 
  setactionf530aProps: React.Dispatch<React.SetStateAction<any>>
  vldcode0c0ce: any,
  setvldcode0c0ce:React.Dispatch<React.SetStateAction<any>>
  vldcode0c0ceProps: any 
  setvldcode0c0ceProps: React.Dispatch<React.SetStateAction<any>>
  vldreason2ef16: any,
  setvldreason2ef16:React.Dispatch<React.SetStateAction<any>>
  vldreason2ef16Props: any 
  setvldreason2ef16Props: React.Dispatch<React.SetStateAction<any>>
  cmnts11ffa: any,
  setcmnts11ffa:React.Dispatch<React.SetStateAction<any>>
  cmnts11ffaProps: any 
  setcmnts11ffaProps: React.Dispatch<React.SetStateAction<any>>
  tran_idb50e3: any,
  settran_idb50e3:React.Dispatch<React.SetStateAction<any>>
  tran_idb50e3Props: any 
  settran_idb50e3Props: React.Dispatch<React.SetStateAction<any>>
  dr_acnt_no4ba0e: any,
  setdr_acnt_no4ba0e:React.Dispatch<React.SetStateAction<any>>
  dr_acnt_no4ba0eProps: any 
  setdr_acnt_no4ba0eProps: React.Dispatch<React.SetStateAction<any>>
  cr_acnt_nobfce7: any,
  setcr_acnt_nobfce7:React.Dispatch<React.SetStateAction<any>>
  cr_acnt_nobfce7Props: any 
  setcr_acnt_nobfce7Props: React.Dispatch<React.SetStateAction<any>>
  amnt3f6e2: any,
  setamnt3f6e2:React.Dispatch<React.SetStateAction<any>>
  amnt3f6e2Props: any 
  setamnt3f6e2Props: React.Dispatch<React.SetStateAction<any>>
  cr_bank_codee3623: any,
  setcr_bank_codee3623:React.Dispatch<React.SetStateAction<any>>
  cr_bank_codee3623Props: any 
  setcr_bank_codee3623Props: React.Dispatch<React.SetStateAction<any>>
  created_byd32da: any,
  setcreated_byd32da:React.Dispatch<React.SetStateAction<any>>
  created_byd32daProps: any 
  setcreated_byd32daProps: React.Dispatch<React.SetStateAction<any>>
  created_datee821e: any,
  setcreated_datee821e:React.Dispatch<React.SetStateAction<any>>
  created_datee821eProps: any 
  setcreated_datee821eProps: React.Dispatch<React.SetStateAction<any>>
  file_name_rtgs_list61a4b: any,
  setfile_name_rtgs_list61a4b:React.Dispatch<React.SetStateAction<any>>
  file_name_rtgs_list61a4bProps: any 
  setfile_name_rtgs_list61a4bProps: React.Dispatch<React.SetStateAction<any>>
  action_rtgs_list543ba: any,
  setaction_rtgs_list543ba:React.Dispatch<React.SetStateAction<any>>
  action_rtgs_list543baProps: any 
  setaction_rtgs_list543baProps: React.Dispatch<React.SetStateAction<any>>
  vld_code_rtgs_lstfc45a: any,
  setvld_code_rtgs_lstfc45a:React.Dispatch<React.SetStateAction<any>>
  vld_code_rtgs_lstfc45aProps: any 
  setvld_code_rtgs_lstfc45aProps: React.Dispatch<React.SetStateAction<any>>
  vld_reason_rtgs_listd8f6e: any,
  setvld_reason_rtgs_listd8f6e:React.Dispatch<React.SetStateAction<any>>
  vld_reason_rtgs_listd8f6eProps: any 
  setvld_reason_rtgs_listd8f6eProps: React.Dispatch<React.SetStateAction<any>>
  cmnts_rtgs_list1952c: any,
  setcmnts_rtgs_list1952c:React.Dispatch<React.SetStateAction<any>>
  cmnts_rtgs_list1952cProps: any 
  setcmnts_rtgs_list1952cProps: React.Dispatch<React.SetStateAction<any>>
  documentviewer9df1d: any,
  setdocumentviewer9df1d:React.Dispatch<React.SetStateAction<any>>
  documentviewer9df1dProps: any 
  setdocumentviewer9df1dProps: React.Dispatch<React.SetStateAction<any>>
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
  req_jsonviewer8d071: any,
  setreq_jsonviewer8d071:React.Dispatch<React.SetStateAction<any>>
  req_jsonviewer8d071Props: any 
  setreq_jsonviewer8d071Props: React.Dispatch<React.SetStateAction<any>>
  res_jsonviewerdd261: any,
  setres_jsonviewerdd261:React.Dispatch<React.SetStateAction<any>>
  res_jsonviewerdd261Props: any 
  setres_jsonviewerdd261Props: React.Dispatch<React.SetStateAction<any>>
  text9205d: any,
  settext9205d:React.Dispatch<React.SetStateAction<any>>
  text9205dProps: any 
  settext9205dProps: React.Dispatch<React.SetStateAction<any>>
  reasondesc20b1a: any,
  setreasondesc20b1a:React.Dispatch<React.SetStateAction<any>>
  reasondesc20b1aProps: any 
  setreasondesc20b1aProps: React.Dispatch<React.SetStateAction<any>>
  cancel7f45a: any,
  setcancel7f45a:React.Dispatch<React.SetStateAction<any>>
  cancel7f45aProps: any 
  setcancel7f45aProps: React.Dispatch<React.SetStateAction<any>>
  continue599e4: any,
  setcontinue599e4:React.Dispatch<React.SetStateAction<any>>
  continue599e4Props: any 
  setcontinue599e4Props: React.Dispatch<React.SetStateAction<any>>
  approvef2390: any,
  setapprovef2390:React.Dispatch<React.SetStateAction<any>>
  approvef2390Props: any 
  setapprovef2390Props: React.Dispatch<React.SetStateAction<any>>
  reject2bf72: any,
  setreject2bf72:React.Dispatch<React.SetStateAction<any>>
  reject2bf72Props: any 
  setreject2bf72Props: React.Dispatch<React.SetStateAction<any>>
  cancele5af4: any,
  setcancele5af4:React.Dispatch<React.SetStateAction<any>>
  cancele5af4Props: any 
  setcancele5af4Props: React.Dispatch<React.SetStateAction<any>>
  base_amount07fca: any,
  setbase_amount07fca:React.Dispatch<React.SetStateAction<any>>
  base_amount07fcaProps: any 
  setbase_amount07fcaProps: React.Dispatch<React.SetStateAction<any>>
  forex_currency5f04f: any,
  setforex_currency5f04f:React.Dispatch<React.SetStateAction<any>>
  forex_currency5f04fProps: any 
  setforex_currency5f04fProps: React.Dispatch<React.SetStateAction<any>>
  forex_amount0f335: any,
  setforex_amount0f335:React.Dispatch<React.SetStateAction<any>>
  forex_amount0f335Props: any 
  setforex_amount0f335Props: React.Dispatch<React.SetStateAction<any>>
  cr_bank_code2906e: any,
  setcr_bank_code2906e:React.Dispatch<React.SetStateAction<any>>
  cr_bank_code2906eProps: any 
  setcr_bank_code2906eProps: React.Dispatch<React.SetStateAction<any>>
  cr_account42642: any,
  setcr_account42642:React.Dispatch<React.SetStateAction<any>>
  cr_account42642Props: any 
  setcr_account42642Props: React.Dispatch<React.SetStateAction<any>>
  cr_name3bc5b: any,
  setcr_name3bc5b:React.Dispatch<React.SetStateAction<any>>
  cr_name3bc5bProps: any 
  setcr_name3bc5bProps: React.Dispatch<React.SetStateAction<any>>
  remittance_info64004: any,
  setremittance_info64004:React.Dispatch<React.SetStateAction<any>>
  remittance_info64004Props: any 
  setremittance_info64004Props: React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_balance3be3f: any,
  setdr_cust_ac_balance3be3f:React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_balance3be3fProps: any 
  setdr_cust_ac_balance3be3fProps: React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_sanc_lmt955a9: any,
  setdr_cust_ac_sanc_lmt955a9:React.Dispatch<React.SetStateAction<any>>
  dr_cust_ac_sanc_lmt955a9Props: any 
  setdr_cust_ac_sanc_lmt955a9Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  transactionproduct_v1: any 
  settransactionproduct_v1: React.Dispatch<React.SetStateAction<any>>
  transactionproduct_v1Props: any 
  settransactionproduct_v1Props: React.Dispatch<React.SetStateAction<any>>
  transactionsearch_v1: any 
  settransactionsearch_v1: React.Dispatch<React.SetStateAction<any>>
  transactionsearch_v1Props: any 
  settransactionsearch_v1Props: React.Dispatch<React.SetStateAction<any>>
  scansaveprocessui_v1: any 
  setscansaveprocessui_v1: React.Dispatch<React.SetStateAction<any>>
  scansaveprocessui_v1Props: any 
  setscansaveprocessui_v1Props: React.Dispatch<React.SetStateAction<any>>
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
  rejectpopupui_v1: any 
  setrejectpopupui_v1: React.Dispatch<React.SetStateAction<any>>
  rejectpopupui_v1Props: any 
  setrejectpopupui_v1Props: React.Dispatch<React.SetStateAction<any>>
  scanapproveprocessui_v1: any 
  setscanapproveprocessui_v1: React.Dispatch<React.SetStateAction<any>>
  scanapproveprocessui_v1Props: any 
  setscanapproveprocessui_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_combocurrencysearch_v1Props: any 
  setdfd_combocurrencysearch_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_transaction_v1Props: any 
  setdfd_transaction_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_scansaveprocessdfd_v1Props: any 
  setdfd_scansaveprocessdfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_crbankcodedropdowndfd_v1Props: any 
  setdfd_crbankcodedropdowndfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_forexcurrencydropdowndfd_v1Props: any 
  setdfd_forexcurrencydropdowndfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_documentlistdfd_v1Props: any 
  setdfd_documentlistdfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_errorlistdfd_v1Props: any 
  setdfd_errorlistdfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  dfd_transactionlistdfd_v1Props: any 
  setdfd_transactionlistdfd_v1Props: React.Dispatch<React.SetStateAction<any>>
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
      selectedIds:[],
      controls:[
      ]
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
      selectedIds:[],
      controls:[
            "outbound_or_inbound",
            "search",
            "refresh",
            "download",
            "new_payment",
      ]
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
      selectedIds:[],
      controls:[
      ]
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
        const [view_all_journey_group67ce4, setview_all_journey_group67ce4 ] = React.useState<any>({}) 
    const [view_all_journey_group67ce4Props, setview_all_journey_group67ce4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
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
      selectedIds:[],
      controls:[
      ]
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
        const [failure_queue_journey_group36aba, setfailure_queue_journey_group36aba ] = React.useState<any>({}) 
    const [failure_queue_journey_group36abaProps, setfailure_queue_journey_group36abaProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
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
      selectedIds:[],
      controls:[
      ]
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
        const [success_queue_journey_group755eb, setsuccess_queue_journey_group755eb ] = React.useState<any>({}) 
    const [success_queue_journey_group755ebProps, setsuccess_queue_journey_group755ebProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
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
      selectedIds:[],
      controls:[
      ]
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
        const [return_queue_journey_group92c55, setreturn_queue_journey_group92c55 ] = React.useState<any>({}) 
    const [return_queue_journey_group92c55Props, setreturn_queue_journey_group92c55Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
      }) 
        const [operational_pending_tab67331, setoperational_pending_tab67331 ] = React.useState<any>({}) 
    const [operational_pending_tab67331Props, setoperational_pending_tab67331Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [operational_pending_table0a253, setoperational_pending_table0a253 ] = React.useState<any>([]) 
    const [operational_pending_table0a253Props, setoperational_pending_table0a253Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [operational_pending_journey_group63667, setoperational_pending_journey_group63667 ] = React.useState<any>({}) 
    const [operational_pending_journey_group63667Props, setoperational_pending_journey_group63667Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
      }) 
        const [technical_pending_tab0b23f, settechnical_pending_tab0b23f ] = React.useState<any>({}) 
    const [technical_pending_tab0b23fProps, settechnical_pending_tab0b23fProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [technical_pending_table84f30, settechnical_pending_table84f30 ] = React.useState<any>([]) 
    const [technical_pending_table84f30Props, settechnical_pending_table84f30Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [technical_pending_journey_groupe4f03, settechnical_pending_journey_groupe4f03 ] = React.useState<any>({}) 
    const [technical_pending_journey_groupe4f03Props, settechnical_pending_journey_groupe4f03Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "vgphstm_uuid",
      ]
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
      selectedIds:[],
      controls:[
            "search_label",
            "top_divider",
            "trs_created_date",
            "dr_account",
            "dr_name",
            "cr_account",
            "payment_currency",
            "payment_currency",
            "dr_amount",
            "uuid",
            "status",
            "bottom_divider",
            "search",
            "clear",
      ]
      }) 
        const [overallgroup01c61, setoverallgroup01c61 ] = React.useState<any>({}) 
    const [overallgroup01c61Props, setoverallgroup01c61Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "documentviewer",
      ]
      }) 
        const [controlgroupda197, setcontrolgroupda197 ] = React.useState<any>({}) 
    const [controlgroupda197Props, setcontrolgroupda197Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [control_tab_groupbc3e2, setcontrol_tab_groupbc3e2 ] = React.useState<any>({}) 
    const [control_tab_groupbc3e2Props, setcontrol_tab_groupbc3e2Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [button_group74f3e, setbutton_group74f3e ] = React.useState<any>({}) 
    const [button_group74f3eProps, setbutton_group74f3eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "approve",
            "reject",
            "cancel",
      ]
      }) 
        const [rtgs_infofd0aa, setrtgs_infofd0aa ] = React.useState<any>({}) 
    const [rtgs_infofd0aaProps, setrtgs_infofd0aaProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [allcontrols71c54, setallcontrols71c54 ] = React.useState<any>({}) 
    const [allcontrols71c54Props, setallcontrols71c54Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [commoninfof4607, setcommoninfof4607 ] = React.useState<any>({}) 
    const [commoninfof4607Props, setcommoninfof4607Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "common_info",
            "dr_account",
            "dr_name",
            "dr_currency",
            "dr_amount",
            "cr_currency",
            "cr_amount",
            "cr_bank_code",
            "cr_account",
            "cr_name",
            "remittance_info",
      ]
      }) 
        const [basicinfo3d198, setbasicinfo3d198 ] = React.useState<any>({}) 
    const [basicinfo3d198Props, setbasicinfo3d198Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "basic_info",
            "waive_charges",
            "rate_code",
            "dr_cust_ac_balance",
            "dr_cust_ac_sanc_lmt",
            "exchange_rate",
            "rate_ref_no",
            "rate_cust_id",
            "bic_code",
            "cr_bank_name",
      ]
      }) 
        const [additionalinfod2894, setadditionalinfod2894 ] = React.useState<any>({}) 
    const [additionalinfod2894Props, setadditionalinfod2894Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "addtional_info",
            "additional_reference",
      ]
      }) 
        const [listgroupdcdbd, setlistgroupdcdbd ] = React.useState<any>({}) 
    const [listgroupdcdbdProps, setlistgroupdcdbdProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [list_tab_groupd6905, setlist_tab_groupd6905 ] = React.useState<any>({}) 
    const [list_tab_groupd6905Props, setlist_tab_groupd6905Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [document_list38c6e, setdocument_list38c6e ] = React.useState<any>({}) 
    const [document_list38c6eProps, setdocument_list38c6eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [doclisttable56e97, setdoclisttable56e97 ] = React.useState<any>([]) 
    const [doclisttable56e97Props, setdoclisttable56e97Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [validation_listae827, setvalidation_listae827 ] = React.useState<any>({}) 
    const [validation_listae827Props, setvalidation_listae827Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [valdnlisttable17ec7, setvaldnlisttable17ec7 ] = React.useState<any>([]) 
    const [valdnlisttable17ec7Props, setvaldnlisttable17ec7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [comment_list72944, setcomment_list72944 ] = React.useState<any>({}) 
    const [comment_list72944Props, setcomment_list72944Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [cmntlisttable02d0e, setcmntlisttable02d0e ] = React.useState<any>([]) 
    const [cmntlisttable02d0eProps, setcmntlisttable02d0eProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [rtgs_lista0a19, setrtgs_lista0a19 ] = React.useState<any>({}) 
    const [rtgs_lista0a19Props, setrtgs_lista0a19Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [rtgs_list_grpcf7d8, setrtgs_list_grpcf7d8 ] = React.useState<any>({}) 
    const [rtgs_list_grpcf7d8Props, setrtgs_list_grpcf7d8Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [rtgs_list_table7b8d6, setrtgs_list_table7b8d6 ] = React.useState<any>([]) 
    const [rtgs_list_table7b8d6Props, setrtgs_list_table7b8d6Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [rtgs_list_tab_grp024e1, setrtgs_list_tab_grp024e1 ] = React.useState<any>({}) 
    const [rtgs_list_tab_grp024e1Props, setrtgs_list_tab_grp024e1Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [documnt_list03a06, setdocumnt_list03a06 ] = React.useState<any>({}) 
    const [documnt_list03a06Props, setdocumnt_list03a06Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [rtgs_list_doc_table_grp8a593, setrtgs_list_doc_table_grp8a593 ] = React.useState<any>({}) 
    const [rtgs_list_doc_table_grp8a593Props, setrtgs_list_doc_table_grp8a593Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [rtgs_lst_doc_list_tablee57bb, setrtgs_lst_doc_list_tablee57bb ] = React.useState<any>([]) 
    const [rtgs_lst_doc_list_tablee57bbProps, setrtgs_lst_doc_list_tablee57bbProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [validtn_lista5b14, setvalidtn_lista5b14 ] = React.useState<any>({}) 
    const [validtn_lista5b14Props, setvalidtn_lista5b14Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [rtgs_list_validtn_list_grpc5569, setrtgs_list_validtn_list_grpc5569 ] = React.useState<any>({}) 
    const [rtgs_list_validtn_list_grpc5569Props, setrtgs_list_validtn_list_grpc5569Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [rtgs_list_validtn_table39a42, setrtgs_list_validtn_table39a42 ] = React.useState<any>([]) 
    const [rtgs_list_validtn_table39a42Props, setrtgs_list_validtn_table39a42Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [cmnt_listebbbc, setcmnt_listebbbc ] = React.useState<any>({}) 
    const [cmnt_listebbbcProps, setcmnt_listebbbcProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
        const [rtgs_list_cmnt_list_grpb5728, setrtgs_list_cmnt_list_grpb5728 ] = React.useState<any>({}) 
    const [rtgs_list_cmnt_list_grpb5728Props, setrtgs_list_cmnt_list_grpb5728Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
      ]
      }) 
    
    const [rtgs_list_cmnts_list15716, setrtgs_list_cmnts_list15716 ] = React.useState<any>([]) 
    const [rtgs_list_cmnts_list15716Props, setrtgs_list_cmnts_list15716Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
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
      selectedIds:[],
      controls:[
            "details_label",
            "divider_top",
            "transaction_date_time_label",
            "status_label",
            "trs_created_date",
            "result",
            "processed_by_label",
            "debit_account_label",
            "processing_system",
            "dr_account",
            "currency_label",
            "credit_account_label",
            "dr_currency",
            "cr_account",
            "amount_label",
            "transaction_reference_label",
            "dr_amount",
            "tran_reference",
            "divider_bottom",
            "view_msg_data_btn",
            "view_tran_log_btn",
      ]
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
      selectedIds:[],
      controls:[
            "transaction_log_label",
            "divider_top",
            "divider_bottom",
            "cancel_btn",
      ]
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
      selectedIds:[],
      controls:[
            "request_data",
      ]
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
      selectedIds:[],
      controls:[
            "response_data",
      ]
      }) 
        const [overallgroup05ff6, setoverallgroup05ff6 ] = React.useState<any>({}) 
    const [overallgroup05ff6Props, setoverallgroup05ff6Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      controls:[
            "text",
            "reasondesc",
            "cancel",
            "continue",
      ]
      }) 
   const [product_code_view_allb0df6,setproduct_code_view_allb0df6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_view_all33724,setchannel_name_view_all33724] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_view_allc0a46,setuuid_view_allc0a46] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_view_all54da6,setdr_account_view_all54da6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_view_all88d6b,setdr_amount_view_all88d6b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_view_alld4b39,setcr_account_view_alld4b39] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_view_all19d14,setcr_amount_view_all19d14] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_view_all82afd,setremittance_info_view_all82afd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_view_all47e6b,setstatus_view_all47e6b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [view_all_journeyd3ae9,setview_all_journeyd3ae9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [product_code_failure_queue12297,setproduct_code_failure_queue12297] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_failure_queue42953,setchannel_name_failure_queue42953] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_failure_queue03c86,setuuid_failure_queue03c86] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_failure_queuef9d2d,setdr_account_failure_queuef9d2d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_failure_queue95d4e,setdr_amount_failure_queue95d4e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_failure_queuea7246,setcr_account_failure_queuea7246] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_failure_queue57c4d,setcr_amount_failure_queue57c4d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_failure_queue09d7a,setremittance_info_failure_queue09d7a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_failure_queue0aef8,setstatus_failure_queue0aef8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [failure_queue_journeyc8638,setfailure_queue_journeyc8638] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [product_code_success_queue7c209,setproduct_code_success_queue7c209] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_success_queueeddaf,setchannel_name_success_queueeddaf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_success_queuec805b,setuuid_success_queuec805b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_operational_pending10a49,setdr_account_operational_pending10a49] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_success_queueda254,setdr_amount_success_queueda254] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_success_queue60480,setcr_account_success_queue60480] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_success_queueb80d4,setcr_amount_success_queueb80d4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_success_queue2f950,setremittance_info_success_queue2f950] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_success_queue019a2,setstatus_success_queue019a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [success_queue_journey68ac9,setsuccess_queue_journey68ac9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [product_code_return_queuee5e11,setproduct_code_return_queuee5e11] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_return_queuebdabb,setchannel_name_return_queuebdabb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_return_queue958c9,setuuid_return_queue958c9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_return_queuee94b2,setdr_account_return_queuee94b2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_return_queue2f324,setdr_amount_return_queue2f324] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_return_queue21a57,setcr_account_return_queue21a57] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_return_queue13fec,setcr_amount_return_queue13fec] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_return_queuef37f7,setremittance_info_return_queuef37f7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_return_queue95903,setstatus_return_queue95903] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [return_queue_journeycc9d3,setreturn_queue_journeycc9d3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [product_code_operational_pending6ecd4,setproduct_code_operational_pending6ecd4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_operational_pending2ab87,setchannel_name_operational_pending2ab87] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_operational_pendinga8ff6,setuuid_operational_pendinga8ff6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_operational_pending5146b,setdr_account_operational_pending5146b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_operational_pending70e3f,setdr_amount_operational_pending70e3f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_operational_pendingf9a9c,setcr_account_operational_pendingf9a9c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_operational_pendingbce21,setcr_amount_operational_pendingbce21] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_operational_pending282bc,setremittance_info_operational_pending282bc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_operational_pending0df81,setstatus_operational_pending0df81] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [new_payment_chk_approve_btn770f9,setnew_payment_chk_approve_btn770f9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [new_payment_chk_reject_btn4c9a0,setnew_payment_chk_reject_btn4c9a0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [view_details00488,setview_details00488] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [operational_pending_journey1a1a5,setoperational_pending_journey1a1a5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [product_code_technical_pending11fe0,setproduct_code_technical_pending11fe0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [channel_name_technical_pendinge182f,setchannel_name_technical_pendinge182f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid_technical_pendingbc6bb,setuuid_technical_pendingbc6bb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account_technical_pendingbc856,setdr_account_technical_pendingbc856] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_amount_technical_pending5e6cc,setdr_amount_technical_pending5e6cc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account_technical_pending3c4aa,setcr_account_technical_pending3c4aa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_amount_technical_pending1bc34,setcr_amount_technical_pending1bc34] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info_technical_pending78349,setremittance_info_technical_pending78349] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_technical_pending738a2,setstatus_technical_pending738a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [technical_pending_journey6601c,settechnical_pending_journey6601c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [outbound_or_inbound5e076,setoutbound_or_inbound5e076] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [search14cf0,setsearch14cf0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [refresh313d0,setrefresh313d0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [downloadcb505,setdownloadcb505] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [new_payment7f5db,setnew_payment7f5db] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [search_label27572,setsearch_label27572] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [top_divider52f90,settop_divider52f90] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [trs_created_date2cea8,settrs_created_date2cea8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [debtor_account_no963e4,setdebtor_account_no963e4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [debtor_namee2d9f,setdebtor_namee2d9f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [creditor_account_noca692,setcreditor_account_noca692] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [payment_currency703d2,setpayment_currency703d2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [payment_amount042b1,setpayment_amount042b1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [uuid29c9f,setuuid29c9f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status4bd75,setstatus4bd75] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [bottom_dividerb9220,setbottom_dividerb9220] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [search0e695,setsearch0e695] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cleareddfa,setcleareddfa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [scan31ce1,setscan31ce1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [folderscanf14e0,setfolderscanf14e0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [savef2390,setsavef2390] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cancel2bf72,setcancel2bf72] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [updateed7a9,setupdateed7a9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [delete3ad2e,setdelete3ad2e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [common_info3a458,setcommon_info3a458] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_account27abb,setdr_account27abb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_name84266,setdr_name84266] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [base_currencyb386d,setbase_currencyb386d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_cust_ac_sanc_lmtb74f7,setdr_cust_ac_sanc_lmtb74f7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_cust_ac_balance753dd,setdr_cust_ac_balance753dd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [basic_info216f3,setbasic_info216f3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [waive_charges929e5,setwaive_charges929e5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_accounta818b,setcr_accounta818b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_namea4b34,setcr_namea4b34] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_bank_code8a2bc,setcr_bank_code8a2bc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_bank_name434eb,setcr_bank_name434eb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_bank_bic3d26f,setcr_bank_bic3d26f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [forex_currency65e0b,setforex_currency65e0b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [exchange_rate88caf,setexchange_rate88caf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [rate_codee56ad,setrate_codee56ad] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [forex_amounta58a5,setforex_amounta58a5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [base_amount3b226,setbase_amount3b226] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [rate_ref_no82399,setrate_ref_no82399] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [rate_cust_idad42a,setrate_cust_idad42a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [addtional_info46cb8,setaddtional_info46cb8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [vgphsts_uuidcf6fc,setvgphsts_uuidcf6fc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_infoba5e0,setremittance_infoba5e0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [additional_reff63a3,setadditional_reff63a3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [customwidgetd7e47,setcustomwidgetd7e47] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [filename7c104,setfilename7c104] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [actionf530a,setactionf530a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [vldcode0c0ce,setvldcode0c0ce] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [vldreason2ef16,setvldreason2ef16] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cmnts11ffa,setcmnts11ffa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [tran_idb50e3,settran_idb50e3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_acnt_no4ba0e,setdr_acnt_no4ba0e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_acnt_nobfce7,setcr_acnt_nobfce7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [amnt3f6e2,setamnt3f6e2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_bank_codee3623,setcr_bank_codee3623] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [created_byd32da,setcreated_byd32da] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [created_datee821e,setcreated_datee821e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [file_name_rtgs_list61a4b,setfile_name_rtgs_list61a4b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [action_rtgs_list543ba,setaction_rtgs_list543ba] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [vld_code_rtgs_lstfc45a,setvld_code_rtgs_lstfc45a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [vld_reason_rtgs_listd8f6e,setvld_reason_rtgs_listd8f6e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cmnts_rtgs_list1952c,setcmnts_rtgs_list1952c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [documentviewer9df1d,setdocumentviewer9df1d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [details_labelb25b2,setdetails_labelb25b2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [divider_tope6917,setdivider_tope6917] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [transaction_date_time_label669d7,settransaction_date_time_label669d7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status_labelf3713,setstatus_labelf3713] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [transaction_date_time14856,settransaction_date_time14856] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [status88bc7,setstatus88bc7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [processed_by_label542e8,setprocessed_by_label542e8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [debit_account_label3b1b7,setdebit_account_label3b1b7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [processed_byd2b69,setprocessed_byd2b69] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [debit_account36b40,setdebit_account36b40] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [currency_labele21ba,setcurrency_labele21ba] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [credit_account_label65c7b,setcredit_account_label65c7b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [currency9c8a2,setcurrency9c8a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [credit_account0d1f4,setcredit_account0d1f4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [amount_labelfd725,setamount_labelfd725] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [transaction_reference_labelb1ca9,settransaction_reference_labelb1ca9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [amount01416,setamount01416] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [transaction_reference500d6,settransaction_reference500d6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [divider_bottom8bad5,setdivider_bottom8bad5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [view_msg_data_btne6a88,setview_msg_data_btne6a88] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [view_tran_log_btn9cd8c,setview_tran_log_btn9cd8c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [msg_data_label7b760,setmsg_data_label7b760] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [divider_topf46a0,setdivider_topf46a0] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [xmlviewer9fe8d,setxmlviewer9fe8d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [divider_bottom6920d,setdivider_bottom6920d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cancel_btn5e840,setcancel_btn5e840] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [transaction_log_label7b760,settransaction_log_label7b760] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [req_jsonviewer8d071,setreq_jsonviewer8d071] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [res_jsonviewerdd261,setres_jsonviewerdd261] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [text9205d,settext9205d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [reasondesc20b1a,setreasondesc20b1a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cancel7f45a,setcancel7f45a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [continue599e4,setcontinue599e4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [approvef2390,setapprovef2390] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [reject2bf72,setreject2bf72] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cancele5af4,setcancele5af4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [base_amount07fca,setbase_amount07fca] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [forex_currency5f04f,setforex_currency5f04f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [forex_amount0f335,setforex_amount0f335] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_bank_code2906e,setcr_bank_code2906e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_account42642,setcr_account42642] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [cr_name3bc5b,setcr_name3bc5b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [remittance_info64004,setremittance_info64004] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_cust_ac_balance3be3f,setdr_cust_ac_balance3be3f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
    }) 
   const [dr_cust_ac_sanc_lmt955a9,setdr_cust_ac_sanc_lmt955a9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    trigger: false
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
       timelineview_all_journeyd3ae9:false,
       columnproduct_code_failure_queue12297:false,
       columnchannel_name_failure_queue42953:false,
       columnuuid_failure_queue03c86:false,
       columndr_account_failure_queuef9d2d:false,
       columndr_amount_failure_queue95d4e:false,
       columncr_account_failure_queuea7246:false,
       columncr_Amount_failure_queue57c4d:false,
       columnremittance_info_failure_queue09d7a:false,
       columnstatus_failure_queue0aef8:false,
       timelinefailure_queue_journeyc8638:false,
       columnproduct_code_success_queue7c209:false,
       columnchannel_name_success_queueeddaf:false,
       columnuuid_success_queuec805b:false,
       columndr_account_operational_pending10a49:false,
       columndr_amount_success_queueda254:false,
       columncr_account_success_queue60480:false,
       columncr_Amount_success_queueb80d4:false,
       columnremittance_info_success_queue2f950:false,
       columnstatus_success_queue019a2:false,
       timelinesuccess_queue_journey68ac9:false,
       columnproduct_code_return_queuee5e11:false,
       columnchannel_name_return_queuebdabb:false,
       columnuuid_return_queue958c9:false,
       columndr_account_return_queuee94b2:false,
       columndr_amount_return_queue2f324:false,
       columncr_account_return_queue21a57:false,
       columncr_Amount_return_queue13fec:false,
       columnremittance_info_return_queuef37f7:false,
       columnstatus_return_queue95903:false,
       timelinereturn_queue_journeycc9d3:false,
       columnproduct_code_operational_pending6ecd4:false,
       columnchannel_name_operational_pending2ab87:false,
       columnuuid_operational_pendinga8ff6:false,
       columndr_account_operational_pending5146b:false,
       columndr_amount_operational_pending70e3f:false,
       columncr_account_operational_pendingf9a9c:false,
       columncr_Amount_operational_pendingbce21:false,
       columnremittance_info_operational_pending282bc:false,
       columnstatus_operational_pending0df81:false,
       buttonnew_payment_chk_approve_btn770f9:false,
       buttonnew_payment_chk_reject_btn4c9a0:false,
       buttonview_details00488:false,
       timelineoperational_pending_journey1a1a5:false,
       columnproduct_code_technical_pending11fe0:false,
       columnchannel_name_technical_pendinge182f:false,
       columnuuid_technical_pendingbc6bb:false,
       columndr_account_technical_pendingbc856:false,
       columndr_amount_technical_pending5e6cc:false,
       columncr_account_technical_pending3c4aa:false,
       columncr_Amount_technical_pending1bc34:false,
       columnremittance_info_technical_pending78349:false,
       columnstatus_technical_pending738a2:false,
       timelinetechnical_pending_journey6601c:false,
       switchoutbound_or_inbound5e076:false,
       buttonsearch14cf0:false,
       buttonrefresh313d0:false,
       buttondownloadcb505:false,
       buttonnew_payment7f5db:false,
       textsearch_label27572:false,
       dividertop_divider52f90:false,
       datepickertrs_created_date2cea8:false,
       textinputdebtor_account_no963e4:false,
       textinputdebtor_namee2d9f:false,
       textinputcreditor_account_noca692:false,
       dropdownpayment_currency703d2:false,
       textinputpayment_amount042b1:false,
       textinputuuid29c9f:false,
       textinputstatus4bd75:false,
       dividerbottom_dividerb9220:false,
       buttonsearch0e695:false,
       buttoncleareddfa:false,
       buttonscan31ce1:false,
       buttonfolderScanf14e0:false,
       buttonsavef2390:false,
       buttoncancel2bf72:false,
       buttonupdateed7a9:false,
       buttondelete3ad2e:false,
       textcommon_info3a458:false,
       textinputdr_account27abb:false,
       textinputdr_name84266:false,
       textinputbase_currencyb386d:false,
       textinputdr_cust_ac_sanc_lmtb74f7:false,
       textinputdr_cust_ac_balance753dd:false,
       textbasic_info216f3:false,
       checkboxwaive_charges929e5:false,
       textinputcr_accounta818b:false,
       textinputcr_namea4b34:false,
       dropdowncr_bank_code8a2bc:false,
       textinputcr_bank_name434eb:false,
       textinputcr_bank_bic3d26f:false,
       dropdownforex_currency65e0b:false,
       textinputexchange_rate88caf:false,
       textinputrate_codee56ad:false,
       textinputforex_amounta58a5:false,
       textinputbase_amount3b226:false,
       textinputrate_ref_no82399:false,
       textinputrate_cust_idad42a:false,
       textaddtional_info46cb8:false,
       textinputvgphsts_uuidcf6fc:false,
       textinputremittance_infoba5e0:false,
       textinputadditional_reff63a3:false,
       customwidgetcustomwidgetd7e47:false,
       columnfileName7c104:false,
       buttonactionf530a:false,
       columnvldCode0c0ce:false,
       columnvldReason2ef16:false,
       columncmnts11ffa:false,
       columntran_idb50e3:false,
       columndr_acnt_no4ba0e:false,
       columncr_acnt_nobfce7:false,
       columnamnt3f6e2:false,
       columncr_bank_codee3623:false,
       columncreated_byd32da:false,
       columncreated_datee821e:false,
       columnfile_name_rtgs_list61a4b:false,
       buttonaction_rtgs_list543ba:false,
       columnvld_code_rtgs_lstfc45a:false,
       columnvld_reason_rtgs_listd8f6e:false,
       columncmnts_rtgs_list1952c:false,
       documentviewerdocumentviewer9df1d:false,
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
       jsonviewerreq_jsonviewer8d071:false,
       jsonviewerres_jsonviewerdd261:false,
       texttext9205d:false,
       textareareasonDesc20b1a:false,
       buttoncancel7f45a:false,
       buttoncontinue599e4:false,
       buttonapprovef2390:false,
       buttonreject2bf72:false,
       buttoncancele5af4:false,
       textinputbase_amount07fca:false,
       dropdownforex_currency5f04f:false,
       textinputforex_amount0f335:false,
       dropdowncr_bank_code2906e:false,
       textinputcr_account42642:false,
       textinputcr_name3bc5b:false,
       textinputremittance_info64004:false,
       textinputdr_cust_ac_balance3be3f:false,
       textinputdr_cust_ac_sanc_lmt955a9:false,
       grouptran_main_group1dc7f:false,
       grouptran_tab_group08b64:false,
       groupview_all_tab4a963:false,
       tableview_all_tablec9e87:false,
       groupview_all_journey_group67ce4:false,
       groupfailure_queue_tab69f01:false,
       tablefailure_queue_tablea476f:false,
       groupfailure_queue_journey_group36aba:false,
       groupsuccess_queue_tabef582:false,
       tablesuccess_queue_table63aae:false,
       groupsuccess_queue_journey_group755eb:false,
       groupreturn_queue_tab5611e:false,
       tablereturn_queue_table267f0:false,
       groupreturn_queue_journey_group92c55:false,
       groupoperational_pending_tab67331:false,
       tableoperational_pending_table0a253:false,
       groupoperational_pending_journey_group63667:false,
       grouptechnical_pending_tab0b23f:false,
       tabletechnical_pending_table84f30:false,
       grouptechnical_pending_journey_groupe4f03:false,
       groupmain_group9066f:false,
       groupoverallgroup01c61:false,
       groupcontrolgroupda197:false,
       groupcontrol_tab_groupbc3e2:false,
       groupbutton_group74f3e:false,
       grouprtgs_infofd0aa:false,
       groupallControls71c54:false,
       groupcommonInfof4607:false,
       groupbasicInfo3d198:false,
       groupadditionalInfod2894:false,
       grouplistgroupdcdbd:false,
       grouplist_tab_groupd6905:false,
       groupdocument_list38c6e:false,
       tabledocListTable56e97:false,
       groupvalidation_listae827:false,
       tablevaldnListTable17ec7:false,
       groupcomment_list72944:false,
       tablecmntListTable02d0e:false,
       grouprtgs_lista0a19:false,
       grouprtgs_list_grpcf7d8:false,
       tablertgs_list_table7b8d6:false,
       grouprtgs_list_tab_grp024e1:false,
       groupdocumnt_list03a06:false,
       grouprtgs_list_doc_table_grp8a593:false,
       tablertgs_lst_doc_list_tablee57bb:false,
       groupvalidtn_lista5b14:false,
       grouprtgs_list_validtn_list_grpc5569:false,
       tablertgs_list_validtn_table39a42:false,
       groupcmnt_listebbbc:false,
       grouprtgs_list_cmnt_list_grpb5728:false,
       tablertgs_list_cmnts_list15716:false,
       groupjourney_details_groupd9a0e:false,
       grouptran_data_group84f25:false,
       groupreq_data_group8d4d7:false,
       groupres_data_group9d75a:false,
       groupoverallgroup05ff6:false,
      })

  ////// screen states 
  const [transactionproduct_v1,settransactionproduct_v1] = React.useState<any>({})
  const [transactionproduct_v1Props,settransactionproduct_v1Props] = React.useState<any>({})
  const [transactionsearch_v1,settransactionsearch_v1] = React.useState<any>({})
  const [transactionsearch_v1Props,settransactionsearch_v1Props] = React.useState<any>({})
  const [scansaveprocessui_v1,setscansaveprocessui_v1] = React.useState<any>({})
  const [scansaveprocessui_v1Props,setscansaveprocessui_v1Props] = React.useState<any>({})
  const [tranjourneydetails_v1,settranjourneydetails_v1] = React.useState<any>({})
  const [tranjourneydetails_v1Props,settranjourneydetails_v1Props] = React.useState<any>({})
  const [messagedataview_v1,setmessagedataview_v1] = React.useState<any>({})
  const [messagedataview_v1Props,setmessagedataview_v1Props] = React.useState<any>({})
  const [trandataview_v1,settrandataview_v1] = React.useState<any>({})
  const [trandataview_v1Props,settrandataview_v1Props] = React.useState<any>({})
  const [rejectpopupui_v1,setrejectpopupui_v1] = React.useState<any>({})
  const [rejectpopupui_v1Props,setrejectpopupui_v1Props] = React.useState<any>({})
  const [scanapproveprocessui_v1,setscanapproveprocessui_v1] = React.useState<any>({})
  const [scanapproveprocessui_v1Props,setscanapproveprocessui_v1Props] = React.useState<any>({})

///////// dfd
  const [dfd_combocurrencysearch_v1Props,setdfd_combocurrencysearch_v1Props] = React.useState<any>([])
  const [dfd_transaction_v1Props,setdfd_transaction_v1Props] = React.useState<any>([])
  const [dfd_scansaveprocessdfd_v1Props,setdfd_scansaveprocessdfd_v1Props] = React.useState<any>([])
  const [dfd_crbankcodedropdowndfd_v1Props,setdfd_crbankcodedropdowndfd_v1Props] = React.useState<any>([])
  const [dfd_forexcurrencydropdowndfd_v1Props,setdfd_forexcurrencydropdowndfd_v1Props] = React.useState<any>([])
  const [dfd_documentlistdfd_v1Props,setdfd_documentlistdfd_v1Props] = React.useState<any>([])
  const [dfd_errorlistdfd_v1Props,setdfd_errorlistdfd_v1Props] = React.useState<any>([])
  const [dfd_transactionlistdfd_v1Props,setdfd_transactionlistdfd_v1Props] = React.useState<any>([])
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
        view_all_journey_group67ce4, 
        setview_all_journey_group67ce4,
        view_all_journey_group67ce4Props, 
        setview_all_journey_group67ce4Props,
        failure_queue_tab69f01, 
        setfailure_queue_tab69f01,
        failure_queue_tab69f01Props, 
        setfailure_queue_tab69f01Props,
        failure_queue_tablea476f, 
        setfailure_queue_tablea476f,
        failure_queue_tablea476fProps, 
        setfailure_queue_tablea476fProps,
        failure_queue_journey_group36aba, 
        setfailure_queue_journey_group36aba,
        failure_queue_journey_group36abaProps, 
        setfailure_queue_journey_group36abaProps,
        success_queue_tabef582, 
        setsuccess_queue_tabef582,
        success_queue_tabef582Props, 
        setsuccess_queue_tabef582Props,
        success_queue_table63aae, 
        setsuccess_queue_table63aae,
        success_queue_table63aaeProps, 
        setsuccess_queue_table63aaeProps,
        success_queue_journey_group755eb, 
        setsuccess_queue_journey_group755eb,
        success_queue_journey_group755ebProps, 
        setsuccess_queue_journey_group755ebProps,
        return_queue_tab5611e, 
        setreturn_queue_tab5611e,
        return_queue_tab5611eProps, 
        setreturn_queue_tab5611eProps,
        return_queue_table267f0, 
        setreturn_queue_table267f0,
        return_queue_table267f0Props, 
        setreturn_queue_table267f0Props,
        return_queue_journey_group92c55, 
        setreturn_queue_journey_group92c55,
        return_queue_journey_group92c55Props, 
        setreturn_queue_journey_group92c55Props,
        operational_pending_tab67331, 
        setoperational_pending_tab67331,
        operational_pending_tab67331Props, 
        setoperational_pending_tab67331Props,
        operational_pending_table0a253, 
        setoperational_pending_table0a253,
        operational_pending_table0a253Props, 
        setoperational_pending_table0a253Props,
        operational_pending_journey_group63667, 
        setoperational_pending_journey_group63667,
        operational_pending_journey_group63667Props, 
        setoperational_pending_journey_group63667Props,
        technical_pending_tab0b23f, 
        settechnical_pending_tab0b23f,
        technical_pending_tab0b23fProps, 
        settechnical_pending_tab0b23fProps,
        technical_pending_table84f30, 
        settechnical_pending_table84f30,
        technical_pending_table84f30Props, 
        settechnical_pending_table84f30Props,
        technical_pending_journey_groupe4f03, 
        settechnical_pending_journey_groupe4f03,
        technical_pending_journey_groupe4f03Props, 
        settechnical_pending_journey_groupe4f03Props,
        main_group9066f, 
        setmain_group9066f,
        main_group9066fProps, 
        setmain_group9066fProps,
        overallgroup01c61, 
        setoverallgroup01c61,
        overallgroup01c61Props, 
        setoverallgroup01c61Props,
        controlgroupda197, 
        setcontrolgroupda197,
        controlgroupda197Props, 
        setcontrolgroupda197Props,
        control_tab_groupbc3e2, 
        setcontrol_tab_groupbc3e2,
        control_tab_groupbc3e2Props, 
        setcontrol_tab_groupbc3e2Props,
        button_group74f3e, 
        setbutton_group74f3e,
        button_group74f3eProps, 
        setbutton_group74f3eProps,
        rtgs_infofd0aa, 
        setrtgs_infofd0aa,
        rtgs_infofd0aaProps, 
        setrtgs_infofd0aaProps,
        allcontrols71c54, 
        setallcontrols71c54,
        allcontrols71c54Props, 
        setallcontrols71c54Props,
        commoninfof4607, 
        setcommoninfof4607,
        commoninfof4607Props, 
        setcommoninfof4607Props,
        basicinfo3d198, 
        setbasicinfo3d198,
        basicinfo3d198Props, 
        setbasicinfo3d198Props,
        additionalinfod2894, 
        setadditionalinfod2894,
        additionalinfod2894Props, 
        setadditionalinfod2894Props,
        listgroupdcdbd, 
        setlistgroupdcdbd,
        listgroupdcdbdProps, 
        setlistgroupdcdbdProps,
        list_tab_groupd6905, 
        setlist_tab_groupd6905,
        list_tab_groupd6905Props, 
        setlist_tab_groupd6905Props,
        document_list38c6e, 
        setdocument_list38c6e,
        document_list38c6eProps, 
        setdocument_list38c6eProps,
        doclisttable56e97, 
        setdoclisttable56e97,
        doclisttable56e97Props, 
        setdoclisttable56e97Props,
        validation_listae827, 
        setvalidation_listae827,
        validation_listae827Props, 
        setvalidation_listae827Props,
        valdnlisttable17ec7, 
        setvaldnlisttable17ec7,
        valdnlisttable17ec7Props, 
        setvaldnlisttable17ec7Props,
        comment_list72944, 
        setcomment_list72944,
        comment_list72944Props, 
        setcomment_list72944Props,
        cmntlisttable02d0e, 
        setcmntlisttable02d0e,
        cmntlisttable02d0eProps, 
        setcmntlisttable02d0eProps,
        rtgs_lista0a19, 
        setrtgs_lista0a19,
        rtgs_lista0a19Props, 
        setrtgs_lista0a19Props,
        rtgs_list_grpcf7d8, 
        setrtgs_list_grpcf7d8,
        rtgs_list_grpcf7d8Props, 
        setrtgs_list_grpcf7d8Props,
        rtgs_list_table7b8d6, 
        setrtgs_list_table7b8d6,
        rtgs_list_table7b8d6Props, 
        setrtgs_list_table7b8d6Props,
        rtgs_list_tab_grp024e1, 
        setrtgs_list_tab_grp024e1,
        rtgs_list_tab_grp024e1Props, 
        setrtgs_list_tab_grp024e1Props,
        documnt_list03a06, 
        setdocumnt_list03a06,
        documnt_list03a06Props, 
        setdocumnt_list03a06Props,
        rtgs_list_doc_table_grp8a593, 
        setrtgs_list_doc_table_grp8a593,
        rtgs_list_doc_table_grp8a593Props, 
        setrtgs_list_doc_table_grp8a593Props,
        rtgs_lst_doc_list_tablee57bb, 
        setrtgs_lst_doc_list_tablee57bb,
        rtgs_lst_doc_list_tablee57bbProps, 
        setrtgs_lst_doc_list_tablee57bbProps,
        validtn_lista5b14, 
        setvalidtn_lista5b14,
        validtn_lista5b14Props, 
        setvalidtn_lista5b14Props,
        rtgs_list_validtn_list_grpc5569, 
        setrtgs_list_validtn_list_grpc5569,
        rtgs_list_validtn_list_grpc5569Props, 
        setrtgs_list_validtn_list_grpc5569Props,
        rtgs_list_validtn_table39a42, 
        setrtgs_list_validtn_table39a42,
        rtgs_list_validtn_table39a42Props, 
        setrtgs_list_validtn_table39a42Props,
        cmnt_listebbbc, 
        setcmnt_listebbbc,
        cmnt_listebbbcProps, 
        setcmnt_listebbbcProps,
        rtgs_list_cmnt_list_grpb5728, 
        setrtgs_list_cmnt_list_grpb5728,
        rtgs_list_cmnt_list_grpb5728Props, 
        setrtgs_list_cmnt_list_grpb5728Props,
        rtgs_list_cmnts_list15716, 
        setrtgs_list_cmnts_list15716,
        rtgs_list_cmnts_list15716Props, 
        setrtgs_list_cmnts_list15716Props,
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
        overallgroup05ff6, 
        setoverallgroup05ff6,
        overallgroup05ff6Props, 
        setoverallgroup05ff6Props,
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
        view_all_journeyd3ae9,
        setview_all_journeyd3ae9, 
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
        failure_queue_journeyc8638,
        setfailure_queue_journeyc8638, 
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
        success_queue_journey68ac9,
        setsuccess_queue_journey68ac9, 
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
        return_queue_journeycc9d3,
        setreturn_queue_journeycc9d3, 
        product_code_operational_pending6ecd4,
        setproduct_code_operational_pending6ecd4, 
        channel_name_operational_pending2ab87,
        setchannel_name_operational_pending2ab87, 
        uuid_operational_pendinga8ff6,
        setuuid_operational_pendinga8ff6, 
        dr_account_operational_pending5146b,
        setdr_account_operational_pending5146b, 
        dr_amount_operational_pending70e3f,
        setdr_amount_operational_pending70e3f, 
        cr_account_operational_pendingf9a9c,
        setcr_account_operational_pendingf9a9c, 
        cr_amount_operational_pendingbce21,
        setcr_amount_operational_pendingbce21, 
        remittance_info_operational_pending282bc,
        setremittance_info_operational_pending282bc, 
        status_operational_pending0df81,
        setstatus_operational_pending0df81, 
        new_payment_chk_approve_btn770f9,
        setnew_payment_chk_approve_btn770f9, 
        new_payment_chk_reject_btn4c9a0,
        setnew_payment_chk_reject_btn4c9a0, 
        view_details00488,
        setview_details00488, 
        operational_pending_journey1a1a5,
        setoperational_pending_journey1a1a5, 
        product_code_technical_pending11fe0,
        setproduct_code_technical_pending11fe0, 
        channel_name_technical_pendinge182f,
        setchannel_name_technical_pendinge182f, 
        uuid_technical_pendingbc6bb,
        setuuid_technical_pendingbc6bb, 
        dr_account_technical_pendingbc856,
        setdr_account_technical_pendingbc856, 
        dr_amount_technical_pending5e6cc,
        setdr_amount_technical_pending5e6cc, 
        cr_account_technical_pending3c4aa,
        setcr_account_technical_pending3c4aa, 
        cr_amount_technical_pending1bc34,
        setcr_amount_technical_pending1bc34, 
        remittance_info_technical_pending78349,
        setremittance_info_technical_pending78349, 
        status_technical_pending738a2,
        setstatus_technical_pending738a2, 
        technical_pending_journey6601c,
        settechnical_pending_journey6601c, 
        outbound_or_inbound5e076,
        setoutbound_or_inbound5e076, 
        search14cf0,
        setsearch14cf0, 
        refresh313d0,
        setrefresh313d0, 
        downloadcb505,
        setdownloadcb505, 
        new_payment7f5db,
        setnew_payment7f5db, 
        search_label27572,
        setsearch_label27572, 
        top_divider52f90,
        settop_divider52f90, 
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
        bottom_dividerb9220,
        setbottom_dividerb9220, 
        search0e695,
        setsearch0e695, 
        cleareddfa,
        setcleareddfa, 
        scan31ce1,
        setscan31ce1, 
        folderscanf14e0,
        setfolderscanf14e0, 
        savef2390,
        setsavef2390, 
        cancel2bf72,
        setcancel2bf72, 
        updateed7a9,
        setupdateed7a9, 
        delete3ad2e,
        setdelete3ad2e, 
        common_info3a458,
        setcommon_info3a458, 
        dr_account27abb,
        setdr_account27abb, 
        dr_name84266,
        setdr_name84266, 
        base_currencyb386d,
        setbase_currencyb386d, 
        dr_cust_ac_sanc_lmtb74f7,
        setdr_cust_ac_sanc_lmtb74f7, 
        dr_cust_ac_balance753dd,
        setdr_cust_ac_balance753dd, 
        basic_info216f3,
        setbasic_info216f3, 
        waive_charges929e5,
        setwaive_charges929e5, 
        cr_accounta818b,
        setcr_accounta818b, 
        cr_namea4b34,
        setcr_namea4b34, 
        cr_bank_code8a2bc,
        setcr_bank_code8a2bc, 
        cr_bank_name434eb,
        setcr_bank_name434eb, 
        cr_bank_bic3d26f,
        setcr_bank_bic3d26f, 
        forex_currency65e0b,
        setforex_currency65e0b, 
        exchange_rate88caf,
        setexchange_rate88caf, 
        rate_codee56ad,
        setrate_codee56ad, 
        forex_amounta58a5,
        setforex_amounta58a5, 
        base_amount3b226,
        setbase_amount3b226, 
        rate_ref_no82399,
        setrate_ref_no82399, 
        rate_cust_idad42a,
        setrate_cust_idad42a, 
        addtional_info46cb8,
        setaddtional_info46cb8, 
        vgphsts_uuidcf6fc,
        setvgphsts_uuidcf6fc, 
        remittance_infoba5e0,
        setremittance_infoba5e0, 
        additional_reff63a3,
        setadditional_reff63a3, 
        customwidgetd7e47,
        setcustomwidgetd7e47, 
        filename7c104,
        setfilename7c104, 
        actionf530a,
        setactionf530a, 
        vldcode0c0ce,
        setvldcode0c0ce, 
        vldreason2ef16,
        setvldreason2ef16, 
        cmnts11ffa,
        setcmnts11ffa, 
        tran_idb50e3,
        settran_idb50e3, 
        dr_acnt_no4ba0e,
        setdr_acnt_no4ba0e, 
        cr_acnt_nobfce7,
        setcr_acnt_nobfce7, 
        amnt3f6e2,
        setamnt3f6e2, 
        cr_bank_codee3623,
        setcr_bank_codee3623, 
        created_byd32da,
        setcreated_byd32da, 
        created_datee821e,
        setcreated_datee821e, 
        file_name_rtgs_list61a4b,
        setfile_name_rtgs_list61a4b, 
        action_rtgs_list543ba,
        setaction_rtgs_list543ba, 
        vld_code_rtgs_lstfc45a,
        setvld_code_rtgs_lstfc45a, 
        vld_reason_rtgs_listd8f6e,
        setvld_reason_rtgs_listd8f6e, 
        cmnts_rtgs_list1952c,
        setcmnts_rtgs_list1952c, 
        documentviewer9df1d,
        setdocumentviewer9df1d, 
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
        req_jsonviewer8d071,
        setreq_jsonviewer8d071, 
        res_jsonviewerdd261,
        setres_jsonviewerdd261, 
        text9205d,
        settext9205d, 
        reasondesc20b1a,
        setreasondesc20b1a, 
        cancel7f45a,
        setcancel7f45a, 
        continue599e4,
        setcontinue599e4, 
        approvef2390,
        setapprovef2390, 
        reject2bf72,
        setreject2bf72, 
        cancele5af4,
        setcancele5af4, 
        base_amount07fca,
        setbase_amount07fca, 
        forex_currency5f04f,
        setforex_currency5f04f, 
        forex_amount0f335,
        setforex_amount0f335, 
        cr_bank_code2906e,
        setcr_bank_code2906e, 
        cr_account42642,
        setcr_account42642, 
        cr_name3bc5b,
        setcr_name3bc5b, 
        remittance_info64004,
        setremittance_info64004, 
        dr_cust_ac_balance3be3f,
        setdr_cust_ac_balance3be3f, 
        dr_cust_ac_sanc_lmt955a9,
        setdr_cust_ac_sanc_lmt955a9, 
        ////// screen states 
          transactionproduct_v1,
          settransactionproduct_v1,
          transactionproduct_v1Props,
          settransactionproduct_v1Props,
          transactionsearch_v1,
          settransactionsearch_v1,
          transactionsearch_v1Props,
          settransactionsearch_v1Props,
          scansaveprocessui_v1,
          setscansaveprocessui_v1,
          scansaveprocessui_v1Props,
          setscansaveprocessui_v1Props,
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
          rejectpopupui_v1,
          setrejectpopupui_v1,
          rejectpopupui_v1Props,
          setrejectpopupui_v1Props,
          scanapproveprocessui_v1,
          setscanapproveprocessui_v1,
          scanapproveprocessui_v1Props,
          setscanapproveprocessui_v1Props,
        //////////

        ///////// dfd
        dfd_combocurrencysearch_v1Props,
        setdfd_combocurrencysearch_v1Props,
        dfd_transaction_v1Props,
        setdfd_transaction_v1Props,
        dfd_scansaveprocessdfd_v1Props,
        setdfd_scansaveprocessdfd_v1Props,
        dfd_crbankcodedropdowndfd_v1Props,
        setdfd_crbankcodedropdowndfd_v1Props,
        dfd_forexcurrencydropdowndfd_v1Props,
        setdfd_forexcurrencydropdowndfd_v1Props,
        dfd_documentlistdfd_v1Props,
        setdfd_documentlistdfd_v1Props,
        dfd_errorlistdfd_v1Props,
        setdfd_errorlistdfd_v1Props,
        dfd_transactionlistdfd_v1Props,
        setdfd_transactionlistdfd_v1Props,
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