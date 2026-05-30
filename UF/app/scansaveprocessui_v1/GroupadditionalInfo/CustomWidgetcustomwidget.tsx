'use client'
import React, { useState,useContext,useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InspectIQ from '@/app/utils/InspectIQ.png';
import { Tooltip } from '@/components';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import CodeFilelogicCalculation   from './customwidgetCodeFilelogicCalculation'   
     
//////////


const CustomWidgetcustomwidget = ({encryptionFlagCompData,controlData}:any) => {
  const {overallgroup01c61:overallgroup, setoverallgroup01c61:setoverallgroup}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup01c61Props:overallgroupProps, setoverallgroup01c61Props:setoverallgroupProps}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197:controlgroup, setcontrolgroupda197:setcontrolgroup}= useContext(TotalContext) as TotalContextProps;
  const {controlgroupda197Props:controlgroupProps, setcontrolgroupda197Props:setcontrolgroupProps}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2:control_tab_group, setcontrol_tab_groupbc3e2:setcontrol_tab_group}= useContext(TotalContext) as TotalContextProps;
  const {control_tab_groupbc3e2Props:control_tab_groupProps, setcontrol_tab_groupbc3e2Props:setcontrol_tab_groupProps}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3e:button_group, setbutton_group74f3e:setbutton_group}= useContext(TotalContext) as TotalContextProps;
  const {button_group74f3eProps:button_groupProps, setbutton_group74f3eProps:setbutton_groupProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aa:rtgs_info, setrtgs_infofd0aa:setrtgs_info}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_infofd0aaProps:rtgs_infoProps, setrtgs_infofd0aaProps:setrtgs_infoProps}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54:allcontrols, setallcontrols71c54:setallcontrols}= useContext(TotalContext) as TotalContextProps;
  const {allcontrols71c54Props:allcontrolsProps, setallcontrols71c54Props:setallcontrolsProps}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607:commoninfo, setcommoninfof4607:setcommoninfo}= useContext(TotalContext) as TotalContextProps;
  const {commoninfof4607Props:commoninfoProps, setcommoninfof4607Props:setcommoninfoProps}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198:basicinfo, setbasicinfo3d198:setbasicinfo}= useContext(TotalContext) as TotalContextProps;
  const {basicinfo3d198Props:basicinfoProps, setbasicinfo3d198Props:setbasicinfoProps}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894:additionalinfo, setadditionalinfod2894:setadditionalinfo}= useContext(TotalContext) as TotalContextProps;
  const {additionalinfod2894Props:additionalinfoProps, setadditionalinfod2894Props:setadditionalinfoProps}= useContext(TotalContext) as TotalContextProps;
  const {addtional_info46cb8:addtional_info, setaddtional_info46cb8:setaddtional_info}= useContext(TotalContext) as TotalContextProps;
  const {vgphsts_uuidcf6fc:vgphsts_uuid, setvgphsts_uuidcf6fc:setvgphsts_uuid}= useContext(TotalContext) as TotalContextProps;
  const {remittance_infoba5e0:remittance_info, setremittance_infoba5e0:setremittance_info}= useContext(TotalContext) as TotalContextProps;
  const {additional_reff63a3:additional_ref, setadditional_reff63a3:setadditional_ref}= useContext(TotalContext) as TotalContextProps;
  const {customwidgetd7e47:customwidget, setcustomwidgetd7e47:setcustomwidget}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbd:listgroup, setlistgroupdcdbd:setlistgroup}= useContext(TotalContext) as TotalContextProps;
  const {listgroupdcdbdProps:listgroupProps, setlistgroupdcdbdProps:setlistgroupProps}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905:list_tab_group, setlist_tab_groupd6905:setlist_tab_group}= useContext(TotalContext) as TotalContextProps;
  const {list_tab_groupd6905Props:list_tab_groupProps, setlist_tab_groupd6905Props:setlist_tab_groupProps}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6e:document_list, setdocument_list38c6e:setdocument_list}= useContext(TotalContext) as TotalContextProps;
  const {document_list38c6eProps:document_listProps, setdocument_list38c6eProps:setdocument_listProps}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97:doclisttable, setdoclisttable56e97:setdoclisttable}= useContext(TotalContext) as TotalContextProps;
  const {doclisttable56e97Props:doclisttableProps, setdoclisttable56e97Props:setdoclisttableProps}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827:validation_list, setvalidation_listae827:setvalidation_list}= useContext(TotalContext) as TotalContextProps;
  const {validation_listae827Props:validation_listProps, setvalidation_listae827Props:setvalidation_listProps}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7:valdnlisttable, setvaldnlisttable17ec7:setvaldnlisttable}= useContext(TotalContext) as TotalContextProps;
  const {valdnlisttable17ec7Props:valdnlisttableProps, setvaldnlisttable17ec7Props:setvaldnlisttableProps}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944:comment_list, setcomment_list72944:setcomment_list}= useContext(TotalContext) as TotalContextProps;
  const {comment_list72944Props:comment_listProps, setcomment_list72944Props:setcomment_listProps}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0e:cmntlisttable, setcmntlisttable02d0e:setcmntlisttable}= useContext(TotalContext) as TotalContextProps;
  const {cmntlisttable02d0eProps:cmntlisttableProps, setcmntlisttable02d0eProps:setcmntlisttableProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19:rtgs_list, setrtgs_lista0a19:setrtgs_list}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lista0a19Props:rtgs_listProps, setrtgs_lista0a19Props:setrtgs_listProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8:rtgs_list_grp, setrtgs_list_grpcf7d8:setrtgs_list_grp}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_grpcf7d8Props:rtgs_list_grpProps, setrtgs_list_grpcf7d8Props:setrtgs_list_grpProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6:rtgs_list_table, setrtgs_list_table7b8d6:setrtgs_list_table}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_table7b8d6Props:rtgs_list_tableProps, setrtgs_list_table7b8d6Props:setrtgs_list_tableProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1:rtgs_list_tab_grp, setrtgs_list_tab_grp024e1:setrtgs_list_tab_grp}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_tab_grp024e1Props:rtgs_list_tab_grpProps, setrtgs_list_tab_grp024e1Props:setrtgs_list_tab_grpProps}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06:documnt_list, setdocumnt_list03a06:setdocumnt_list}= useContext(TotalContext) as TotalContextProps;
  const {documnt_list03a06Props:documnt_listProps, setdocumnt_list03a06Props:setdocumnt_listProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593:rtgs_list_doc_table_grp, setrtgs_list_doc_table_grp8a593:setrtgs_list_doc_table_grp}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_doc_table_grp8a593Props:rtgs_list_doc_table_grpProps, setrtgs_list_doc_table_grp8a593Props:setrtgs_list_doc_table_grpProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bb:rtgs_lst_doc_list_table, setrtgs_lst_doc_list_tablee57bb:setrtgs_lst_doc_list_table}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_lst_doc_list_tablee57bbProps:rtgs_lst_doc_list_tableProps, setrtgs_lst_doc_list_tablee57bbProps:setrtgs_lst_doc_list_tableProps}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14:validtn_list, setvalidtn_lista5b14:setvalidtn_list}= useContext(TotalContext) as TotalContextProps;
  const {validtn_lista5b14Props:validtn_listProps, setvalidtn_lista5b14Props:setvalidtn_listProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569:rtgs_list_validtn_list_grp, setrtgs_list_validtn_list_grpc5569:setrtgs_list_validtn_list_grp}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_list_grpc5569Props:rtgs_list_validtn_list_grpProps, setrtgs_list_validtn_list_grpc5569Props:setrtgs_list_validtn_list_grpProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42:rtgs_list_validtn_table, setrtgs_list_validtn_table39a42:setrtgs_list_validtn_table}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_validtn_table39a42Props:rtgs_list_validtn_tableProps, setrtgs_list_validtn_table39a42Props:setrtgs_list_validtn_tableProps}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbc:cmnt_list, setcmnt_listebbbc:setcmnt_list}= useContext(TotalContext) as TotalContextProps;
  const {cmnt_listebbbcProps:cmnt_listProps, setcmnt_listebbbcProps:setcmnt_listProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728:rtgs_list_cmnt_list_grp, setrtgs_list_cmnt_list_grpb5728:setrtgs_list_cmnt_list_grp}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnt_list_grpb5728Props:rtgs_list_cmnt_list_grpProps, setrtgs_list_cmnt_list_grpb5728Props:setrtgs_list_cmnt_list_grpProps}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716:rtgs_list_cmnts_list, setrtgs_list_cmnts_list15716:setrtgs_list_cmnts_list}= useContext(TotalContext) as TotalContextProps;
  const {rtgs_list_cmnts_list15716Props:rtgs_list_cmnts_listProps, setrtgs_list_cmnts_list15716Props:setrtgs_list_cmnts_listProps}= useContext(TotalContext) as TotalContextProps;
  
  return (
    <div className="" style={{gridColumn: `15 / 19`,gridRow: `11 / 21`, gap:``, height: `100%`, overflow: 'auto'}} >
      <CodeFilelogicCalculation 
  overallgroup={ overallgroup}
  setoverallgroup={setoverallgroup}
  overallgroupProps={ overallgroupProps}
  setoverallgroupProps={setoverallgroupProps}
  controlgroup={ controlgroup}
  setcontrolgroup={setcontrolgroup}
  controlgroupProps={ controlgroupProps}
  setcontrolgroupProps={setcontrolgroupProps}
  control_tab_group={ control_tab_group}
  setcontrol_tab_group={setcontrol_tab_group}
  control_tab_groupProps={ control_tab_groupProps}
  setcontrol_tab_groupProps={setcontrol_tab_groupProps}
  button_group={ button_group}
  setbutton_group={setbutton_group}
  button_groupProps={ button_groupProps}
  setbutton_groupProps={setbutton_groupProps}
  rtgs_info={ rtgs_info}
  setrtgs_info={setrtgs_info}
  rtgs_infoProps={ rtgs_infoProps}
  setrtgs_infoProps={setrtgs_infoProps}
  allcontrols={ allcontrols}
  setallcontrols={setallcontrols}
  allcontrolsProps={ allcontrolsProps}
  setallcontrolsProps={setallcontrolsProps}
  commoninfo={ commoninfo}
  setcommoninfo={setcommoninfo}
  commoninfoProps={ commoninfoProps}
  setcommoninfoProps={setcommoninfoProps}
  basicinfo={ basicinfo}
  setbasicinfo={setbasicinfo}
  basicinfoProps={ basicinfoProps}
  setbasicinfoProps={setbasicinfoProps}
  additionalinfo={ additionalinfo}
  setadditionalinfo={setadditionalinfo}
  additionalinfoProps={ additionalinfoProps}
  setadditionalinfoProps={setadditionalinfoProps}
  addtional_info={ addtional_info}
  setaddtional_info={setaddtional_info}
  vgphsts_uuid={ vgphsts_uuid}
  setvgphsts_uuid={setvgphsts_uuid}
  remittance_info={ remittance_info}
  setremittance_info={setremittance_info}
  additional_ref={ additional_ref}
  setadditional_ref={setadditional_ref}
  customwidget={ customwidget}
  setcustomwidget={setcustomwidget}
  listgroup={ listgroup}
  setlistgroup={setlistgroup}
  listgroupProps={ listgroupProps}
  setlistgroupProps={setlistgroupProps}
  list_tab_group={ list_tab_group}
  setlist_tab_group={setlist_tab_group}
  list_tab_groupProps={ list_tab_groupProps}
  setlist_tab_groupProps={setlist_tab_groupProps}
  document_list={ document_list}
  setdocument_list={setdocument_list}
  document_listProps={ document_listProps}
  setdocument_listProps={setdocument_listProps}
  doclisttable={ doclisttable}
  setdoclisttable={setdoclisttable}
  doclisttableProps={ doclisttableProps}
  setdoclisttableProps={setdoclisttableProps}
  validation_list={ validation_list}
  setvalidation_list={setvalidation_list}
  validation_listProps={ validation_listProps}
  setvalidation_listProps={setvalidation_listProps}
  valdnlisttable={ valdnlisttable}
  setvaldnlisttable={setvaldnlisttable}
  valdnlisttableProps={ valdnlisttableProps}
  setvaldnlisttableProps={setvaldnlisttableProps}
  comment_list={ comment_list}
  setcomment_list={setcomment_list}
  comment_listProps={ comment_listProps}
  setcomment_listProps={setcomment_listProps}
  cmntlisttable={ cmntlisttable}
  setcmntlisttable={setcmntlisttable}
  cmntlisttableProps={ cmntlisttableProps}
  setcmntlisttableProps={setcmntlisttableProps}
  rtgs_list={ rtgs_list}
  setrtgs_list={setrtgs_list}
  rtgs_listProps={ rtgs_listProps}
  setrtgs_listProps={setrtgs_listProps}
  rtgs_list_grp={ rtgs_list_grp}
  setrtgs_list_grp={setrtgs_list_grp}
  rtgs_list_grpProps={ rtgs_list_grpProps}
  setrtgs_list_grpProps={setrtgs_list_grpProps}
  rtgs_list_table={ rtgs_list_table}
  setrtgs_list_table={setrtgs_list_table}
  rtgs_list_tableProps={ rtgs_list_tableProps}
  setrtgs_list_tableProps={setrtgs_list_tableProps}
  rtgs_list_tab_grp={ rtgs_list_tab_grp}
  setrtgs_list_tab_grp={setrtgs_list_tab_grp}
  rtgs_list_tab_grpProps={ rtgs_list_tab_grpProps}
  setrtgs_list_tab_grpProps={setrtgs_list_tab_grpProps}
  documnt_list={ documnt_list}
  setdocumnt_list={setdocumnt_list}
  documnt_listProps={ documnt_listProps}
  setdocumnt_listProps={setdocumnt_listProps}
  rtgs_list_doc_table_grp={ rtgs_list_doc_table_grp}
  setrtgs_list_doc_table_grp={setrtgs_list_doc_table_grp}
  rtgs_list_doc_table_grpProps={ rtgs_list_doc_table_grpProps}
  setrtgs_list_doc_table_grpProps={setrtgs_list_doc_table_grpProps}
  rtgs_lst_doc_list_table={ rtgs_lst_doc_list_table}
  setrtgs_lst_doc_list_table={setrtgs_lst_doc_list_table}
  rtgs_lst_doc_list_tableProps={ rtgs_lst_doc_list_tableProps}
  setrtgs_lst_doc_list_tableProps={setrtgs_lst_doc_list_tableProps}
  validtn_list={ validtn_list}
  setvalidtn_list={setvalidtn_list}
  validtn_listProps={ validtn_listProps}
  setvalidtn_listProps={setvalidtn_listProps}
  rtgs_list_validtn_list_grp={ rtgs_list_validtn_list_grp}
  setrtgs_list_validtn_list_grp={setrtgs_list_validtn_list_grp}
  rtgs_list_validtn_list_grpProps={ rtgs_list_validtn_list_grpProps}
  setrtgs_list_validtn_list_grpProps={setrtgs_list_validtn_list_grpProps}
  rtgs_list_validtn_table={ rtgs_list_validtn_table}
  setrtgs_list_validtn_table={setrtgs_list_validtn_table}
  rtgs_list_validtn_tableProps={ rtgs_list_validtn_tableProps}
  setrtgs_list_validtn_tableProps={setrtgs_list_validtn_tableProps}
  cmnt_list={ cmnt_list}
  setcmnt_list={setcmnt_list}
  cmnt_listProps={ cmnt_listProps}
  setcmnt_listProps={setcmnt_listProps}
  rtgs_list_cmnt_list_grp={ rtgs_list_cmnt_list_grp}
  setrtgs_list_cmnt_list_grp={setrtgs_list_cmnt_list_grp}
  rtgs_list_cmnt_list_grpProps={ rtgs_list_cmnt_list_grpProps}
  setrtgs_list_cmnt_list_grpProps={setrtgs_list_cmnt_list_grpProps}
  rtgs_list_cmnts_list={ rtgs_list_cmnts_list}
  setrtgs_list_cmnts_list={setrtgs_list_cmnts_list}
  rtgs_list_cmnts_listProps={ rtgs_list_cmnts_listProps}
  setrtgs_list_cmnts_listProps={setrtgs_list_cmnts_listProps}
      />
    </div>
  )
}

export default CustomWidgetcustomwidget ;
