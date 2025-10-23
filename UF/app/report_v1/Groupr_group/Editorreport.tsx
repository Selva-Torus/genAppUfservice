
'use client'
import axios from 'axios';
import React, { useState,useContext,useEffect,useRef } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { AxiosService } from "@/app/components/axiosService";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation'
import { Button, DropdownMenu, Select, Modal, Icon,Text  } from '@gravity-ui/uikit'
import { getCookie } from '@/app/components/cookieMgment';
import { getDropdownDetails } from '@/app/utils/getMapperDetails';
import { codeExecution } from '@/app/utils/codeExecution';
import { eventBus } from '@/app/eventBus';
import {ChevronDown} from '@gravity-ui/icons';


const Editorreport = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const token: string = getCookie('token');
  const {dfd_fordfcheck_v1Props, setdfd_fordfcheck_v1Props} = useContext(TotalContext) as TotalContextProps; 
   function filtetKeyname(str = '', filterString = '') {
    return str?.replace(filterString, '')
  }

  function getValueByPath(obj: any, path: string) {
    return path
      .split('.')
      .reduce(
        (acc: { [x: string]: any }, key: string | number) => acc?.[key],
        obj
      )
  }
  function setValueByPath(obj: any, path: string, value: any) {
    const keys = path.split('.')
    let current = obj
    keys.forEach((key: string | number, index: number) => {
      if (index === keys.length - 1) {
        current[key] = value
      } else {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {}
        }
        current = current[key]
      }
    })
  }
  async function getMapperDetails(){
    const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:TT407:FNGK:AF:FNK:UF-UFR:CATK:CGFA:AFGK:TG4CGFA:AFK:reportcheck:AFVK:v1",
          componentId: "e3ed576185df4984b4c739bf735358e4",
          controlId: "73b1e6a34d5e49429765d4609261a36d",
          from:"Editor"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.mapper?.length > 0){

        let filteredata:any=[];
      dfd_fordfcheck_v1Props?.map((items:any)=>{
        let temp:any={}
        orchestrationData?.data?.mapper?.map((mapItem:any)=>{
          let sourceKey = mapItem?.sourceKey?.split('|').at(-1)
          sourceKey = filtetKeyname(sourceKey, 'items.properties.')
          sourceKey = filtetKeyname(sourceKey, 'properties.')
          let targetKey = mapItem?.targetKey?.split('|').at(-1)
          targetKey = filtetKeyname(targetKey, 'items.properties.')
          targetKey = filtetKeyname(targetKey, 'properties.')
          sourceKey=sourceKey.replaceAll("properties.","")
          targetKey=targetKey.replaceAll("properties.","")
          const value = getValueByPath(items, sourceKey)
          setValueByPath(temp, targetKey, value)
        })
        filteredata.push(temp)
      })
        if(filteredata?.length>0){
          fetchReport(filteredata[0])
        }
      }
}
  const fetchReport = async (templadteData:any) => {
    let postData: any = {
        template: {
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Report</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 40px;
      color: #333;
    }
    .report-container {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
    }
    .report-header {
      text-align: center;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .report-header h1 {
      margin: 0;
      color: #007bff;
      font-size: 28px;
    }
    .report-section {
      margin-bottom: 20px;
    }
    .report-section label {
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
    .report-section input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>User Report</h1>
    </div>

    <div class="report-section">
      <label for="name">Name</label>
      <input type="text" id="name" value="{{name}}" readonly>
    </div>

    <div class="report-section">
      <label for="age">Age</label>
      <input type="text" id="age" value="{{age}}" readonly>
    </div>

    <div class="report-section">
    <label for="address">Street</label>
      <input type="text" id="address" value="{{address.street}}" readonly>
      <label for="address">Phone</label>
      <input type="text" id="address" value="{{address.phone}}" readonly>
    </div>

    <div class="report-section">
      <label for="trs_creator_email">Creator Email</label>
      <input type="text" id="trs_creator_email" value="{{trs_creator_email}}" readonly>
    </div>

    <div class="report-section">
      <label for="created_by">Created By</label>
      <input type="text" id="created_by" value="{{trs_created_by}}" readonly>
    </div>

    <div class="report-section">
      <label for="created_date">Created Date</label>
      <input type="text" id="created_date" value="{{trs_created_date}}" readonly>
    </div>

    <div class="report-section">
      <label for="modified_by">Modified By</label>
      <input type="text" id="modified_by" value="{{trs_modified_by}}" readonly>
    </div>

    <div class="report-section">
      <label for="modified_date">Modified Date</label>
      <input type="text" id="modified_date" value="{{trs_modified_date}}" readonly>
    </div>

    <div class="report-section">
      <label for="status">Status</label>
      <input type="text" id="status" value="{{trs_status}}" readonly>
    </div>

    <div class="report-section">
      <label for="next_status">Next Status</label>
      <input type="text" id="next_status" value="{{trs_next_status}}" readonly>
    </div>

    <div class="report-section">
      <label for="process_id">Process ID</label>
      <input type="text" id="process_id" value="{{trs_process_id}}" readonly>
    </div>

    <div class="report-section">
      <label for="access_profile">Access Profile</label>
      <input type="text" id="access_profile" value="{{trs_access_profile}}" readonly>
    </div>

    <div class="report-section">
      <label for="org_grp_code">Org Group Code</label>
      <input type="text" id="org_grp_code" value="{{trs_org_grp_code}}" readonly>
    </div>

    <div class="report-section">
      <label for="org_code">Org Code</label>
      <input type="text" id="org_code" value="{{trs_org_code}}" readonly>
    </div>

    <div class="report-section">
      <label for="role_grp_code">Role Group Code</label>
      <input type="text" id="role_grp_code" value="{{trs_role_grp_code}}" readonly>
    </div>

    <div class="report-section">
      <label for="role_code">Role Code</label>
      <input type="text" id="role_code" value="{{trs_role_code}}" readonly>
    </div>

    <div class="report-section">
      <label for="ps_grp_code">PS Group Code</label>
      <input type="text" id="ps_grp_code" value="{{trs_ps_grp_code}}" readonly>
    </div>

    <div class="report-section">
      <label for="ps_code">PS Code</label>
      <input type="text" id="ps_code" value="{{trs_ps_code}}" readonly>
    </div>

    <div class="footer">
      © 2025 Report System
    </div>
  </div>
</body>
</html>
`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
      },
      data:templadteData,
    };
    let reportData: any = await axios.post(
      'http://localhost:1111/api/report',
      postData,
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const blob = new Blob([reportData.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

  }

  useEffect(() => {
    getMapperDetails()
  }, []);
  return (
    <div 
      style={{gridColumn: `2 / 8`,gridRow: `11 / 175`, gap:``, height: `100%`, overflow: 'auto'}} >
     
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        ></iframe>
      ) : (
        <p>Loading report...</p>
      )}
    </div>
  )
}

export default Editorreport;