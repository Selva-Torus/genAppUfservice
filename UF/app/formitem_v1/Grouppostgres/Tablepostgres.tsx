"use client"
  
  //CustomTable
import {
  Col,
  Flex,
  Row,
} from '@gravity-ui/uikit'
import { SquareXmark } from '@gravity-ui/icons'
import { Button, Icon, TextInput } from '@gravity-ui/uikit'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment'
import { DatePicker } from '@gravity-ui/date-components'
import { dateTimeParse } from '@gravity-ui/date-utils'
import { IoAdd } from 'react-icons/io5'
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution'
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
// page import
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';
let defaultColumns = 
[
  {
    "id": "billingid",
    "name": "billingid",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  },
  {
    "id": "billingparty",
    "name": "billingparty",
    "meta": {
      "sort": true
    },
    "isSearch": false,
    "colourIndicator": []
  }
] ;
for (let i = 0; i < defaultColumns.length; i++) {
  defaultColumns[i].id = defaultColumns[i].id.toLowerCase();
}
function generateUniqueCode() {
  const timestamp = new Date().getTime() // Current timestamp in milliseconds
  const randomValue = Math.random().toString(36).substring(2, 8) // Random alphanumeric string of length 6
  return `${timestamp}-${randomValue}`
}


const Tablepostgres=({lockedData,setLockedData,primaryTableData, setPrimaryTableData,refetch, setRefetch,setData,encryptionFlagCompData }: any)=>{
  const schemaData :any = {
  "billingid": {
    "type": "number"
  },
  "billingparty": {
    "type": "string"
  },
  "vessels": {
    "type": "string"
  },
  "personcharge": {
    "type": "string"
  },
  "emailparty": {
    "type": "string",
    "format": "email"
  },
  "mobileparty": {
    "type": "integer"
  },
  "cou_ammount": {
    "type": "string"
  },
  "amount": {
    "type": "number"
  },
  "tax": {
    "type": "number"
  },
  "interest": {
    "type": "number"
  },
  "cou_amount2": {
    "type": "string"
  },
  "amount2": {
    "type": "number"
  },
  "addressline1": {
    "type": "string"
  },
  "country": {
    "type": "string"
  },
  "state": {
    "type": "string"
  },
  "pininput": {
    "type": "number"
  },
  "remark": {
    "type": "string"
  },
  "trs_created_date": {
    "type": "string",
    "format": "date-time"
  },
  "trs_created_by": {
    "type": "string"
  },
  "trs_modified_date": {
    "type": "string",
    "format": "date-time"
  },
  "trs_modified_by": {
    "type": "string"
  },
  "trs_status": {
    "type": "string"
  },
  "trs_next_status": {
    "type": "string"
  },
  "trs_process_id": {
    "type": "string"
  },
  "trs_access_profile": {
    "type": "string"
  },
  "trs_org_grp_code": {
    "type": "string"
  },
  "trs_org_code": {
    "type": "string"
  },
  "trs_role_grp_code": {
    "type": "string"
  },
  "trs_role_code": {
    "type": "string"
  },
  "trs_ps_grp_code": {
    "type": "string"
  },
  "trs_ps_code": {
    "type": "string"
  }
}

  const securityData:any={
  "Employee": {
    "allowedControls": [
      "billingid",
      "billingparty"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "userTemplate": {
    "allowedControls": [],
    "blockedControls": [
      "billingid",
      "billingparty"
    ],
    "readOnlyControls": []
  }
}
  const keyset:any=i18n.keyset("language")
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  let getDataPKey:any=""
  let getDataPTable:any=""
  let code:any;
  let codeExec:any;
  const toast:any=useInfoMsg()
  const routes = useRouter()
  let isGetFormdata = false;
  const token:string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState(false)
  const sessionInfo:any = {
    accessToken: token,
    authToken: ''
  }
  const [columns,setColumns]=useState<any>([])
  const [sumValues,setSumValues]=useState<any>({})
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const {transactionsuf_v1Props, settransactionsuf_v1Props}= useContext(TotalContext) as TotalContextProps;
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps  
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  const {billingid842ca, setbillingid842ca}= useContext(TotalContext) as TotalContextProps  
  const {billingparty7a9f7, setbillingparty7a9f7}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const handleCheckboxChange = (row: { billingid: any }) => {
    const isSelected = selectedRows.some(
      (selectedRow: { billingid: any }) => selectedRow.billingid === row.billingid
    )

    if (isSelected) {
      setSelectedRows((prevSelected: any) =>
        prevSelected.filter(
          (selectedRow: { billingid: any }) => selectedRow.billingid !== row.billingid
        )
      )
    } else {
      setSelectedRows([...selectedRows, row])
    }
  }

  const GetTableDetails = async () => { 
    let altertColumns:any=[]
    defaultColumns.map((cols:any)=>{
      let temp:any = cols
      {
        if(securityData[accessProfile].allowedControls.includes(cols.id))
        {
          if(cols.id in schemaData)
          {
            temp['type']=schemaData[cols.id].type =='string'?"text":schemaData[cols.id].type.toLowerCase()
            
          }
          else{
            temp['type']='text' 
          }
          altertColumns.push(temp)
        }
      }
    })
    setColumns(altertColumns) 
  }

  useEffect(()=>{
    GetTableDetails()
  },[postgres7f5c4?.refresh])

  const handleSaveAll= async ()=>{
    let upId:any = ""
    let parentData: any = nullFilter(primaryTableData.parentData)
    let childData: any = []
    let codeExec:any;
    
    postgres7f5c4.map((item:any)=>{
      childData.push(nullFilter(item))
    })
    try{
      let uf_initiatePf:any
      let te_eventEmitterBody:te_eventEmitterDto
      let primaryKey:any
      let uf_getPFDetails:any
      let uf_ifo:any
      let lockedKeysLength:number
      code="";
      if (code !="" ) {
        let codeStates: any = {}
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,
      codeStates['postgres']  = postgres7f5c4,
      codeStates['setpostgres'] = setpostgres7f5c4,
        codeExec = codeExecution(code,codeStates)
      }
      let eventProperty = {
  "id": "29a69645274849e188e5e4dfd237f5c4",
  "type": "group",
  "key": "",
  "name": "postgres",
  "sequence": 1,
  "children": [
    {
      "id": "29a69645274849e188e5e4dfd237f5c4.1.1",
      "type": "eventNode",
      "name": "onSaveAll",
      "key": "",
      "sequence": "1.1",
      "children": [
        {
          "id": "29a69645274849e188e5e4dfd237f5c4.1.1.1",
          "eventContext": "riseListen",
          "value": "",
          "type": "handlerNode",
          "name": "showArtifactAsModal",
          "key": "",
          "sequence": "1.1.1",
          "children": [
            {
              "id": "93feba7abccf45bfba1916aa091e0ca9.1.1.1.1",
              "type": "screen",
              "name": "transactionsUF.v1",
              "label": "",
              "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1",
              "elementType": "",
              "sequence": "1.1.1.1",
              "children": []
            }
          ],
          "hlr": {
            "params": [
              {
                "name": "width",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              },
              {
                "name": "height",
                "_type": "string",
                "selectionList": [],
                "value": "",
                "enabled": true
              },
              {
                "name": "needLabel",
                "_type": "boolean",
                "selectionList": [],
                "value": false,
                "enabled": true
              },
              {
                "name": "Filter Conditions",
                "_type": "array",
                "items": [
                  {
                    "name": "DFD Key",
                    "_type": "asyncSelection",
                    "selectionList": [
                      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1",
                      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"
                    ],
                    "value": "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1",
                    "enabled": true,
                    "_payload": {
                      "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:",
                      "nodeType": "dfd-node-list"
                    },
                    "subSelection": {
                      "name": "Node Name",
                      "_type": "select",
                      "selectionList": [
                        {
                          "key": "127a09c41a0348fc8e93c137b4a4becf",
                          "label": "apinode"
                        },
                        {
                          "key": "23d20ae929914fd896ef4ef6f33de29a",
                          "label": "datasetnode"
                        }
                      ],
                      "value": "23d20ae929914fd896ef4ef6f33de29a",
                      "enabled": true
                    },
                    "filterKey": {
                      "name": "filterKey",
                      "_type": "string",
                      "selectionList": [],
                      "value": "transaction_id",
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
      ]
    }
  ]
};
      let eventDetails = await eventFunction(eventProperty);
      let eventDetailsArray = eventDetails[0];
      let sourceId:string = "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1";
      sourceId+= "|"+"29a69645274849e188e5e4dfd237f5c4"
      for (let k = 0; k < eventDetailsArray.length; k++) {
        if (eventDetailsArray[k].type != 'group')
        sourceId += '|' + eventDetailsArray[k].id
        if (
          eventDetailsArray[k]?.type === 'handlerNode' &&
          eventDetailsArray[k]?.name === 'saveHandler' && 
          eventDetailsArray[k]?.eventContext ==="rise"
        ) {
          if (
            eventDetailsArray[k]?.targetKey &&
            eventDetailsArray[k]?.targetKey.length > 0 
          ) {
            uf_getPFDetails= {
              key: eventDetailsArray[k].targetKey[0],
              primaryKey: eventDetailsArray[k].primaryKey,
              sourceId:sourceId
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              primaryKey: eventDetailsArray[k].primaryKey,
              sourceId:sourceId
            };
          }
        } else if (
          eventDetailsArray[k]?.type === 'handlerNode' &&
          eventDetailsArray[k]?.name === 'updateHandler' && 
          eventDetailsArray[k]?.eventContext ==="rise"
        ) {
          if (
            eventDetailsArray[k].targetKey &&
            eventDetailsArray[k].targetKey.length > 0
          ) {
            uf_getPFDetails= {
              key: eventDetailsArray[k].targetKey[0],
              primaryKey: eventDetailsArray[k].primaryKey,
              tableName: eventDetailsArray[k]?.tableName,
              status: eventDetailsArray[k]?.status,
              sourceId:sourceId
            };
          } else if (!eventDetailsArray[k].targetKey) {
            uf_getPFDetails= {
              primaryKey: eventDetailsArray[k].primaryKey,
              tableName: eventDetailsArray[k]?.tableName,
              status: eventDetailsArray[k]?.status,
              sourceId:sourceId
            };
          }
        }
      }

      if (uf_getPFDetails.key != undefined) {
        const uf_initiatePfBody:uf_initiatePfDto={
        key:uf_getPFDetails.key,
        sourceId:uf_getPFDetails.sourceId
        }
      if (encryptionFlagCont) {
          uf_initiatePfBody["dpdKey"] = encryptionDpd
          uf_initiatePfBody["method"] = encryptionMethod
      } 
        uf_initiatePf = await AxiosService.post("/UF/InitiatePF",uf_initiatePfBody,
          { headers: {
          Authorization: `Bearer ${token}`
          }, })
          if(uf_initiatePf?.data?.error == true){
            toast(uf_initiatePf?.data?.errorDetails?.message, 'danger')
            return
          }
    
        } else {
        uf_initiatePf= {
          data:{
            nodeProperty:'',
            eventProperty:''
          }
        }
      }

    
    
    
    
  await eventEmitter()


    }
    catch(err){
      console.log(err);
    }
}

  async function eventEmitter(){
        return
    if (Array.isArray(eventEmitterData) || eventEmitterData.length > 0) {
      // Execute all requests in parallel using forEach
    const requests = eventEmitterData.map(async (element:any) => {
      try {
        if (encryptionFlagCont) {
          element["dpdKey"] = encryptionDpd
          element["method"] = encryptionMethod
        } 
        const te_refresh = await AxiosService.post("/te/eventEmitter", element, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (te_refresh?.data?.error === true) {
          toast(te_refresh?.data?.errorDetails?.message, 'danger');
        }
      } catch (error) {
        console.error("Error in eventEmitter:", error);
      }
    });
    await Promise.all(requests);
    }
  }

  async function handleAllSave(){
    let filterProps =  [
  {
    "name": "DFD Key",
    "_type": "asyncSelection",
    "selectionList": [
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:transactionsDFD:AFVK:v1",
      "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1"
    ],
    "value": "CK:CT003:FNGK:AF:FNK:DF-DFD:CATK:CG:AFGK:TG2:AFK:testTableCheck2:AFVK:v1",
    "enabled": true,
    "_payload": {
      "key": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:transactionsUF:AFVK:v1:",
      "nodeType": "dfd-node-list"
    },
    "subSelection": {
      "name": "Node Name",
      "_type": "select",
      "selectionList": [
        {
          "key": "127a09c41a0348fc8e93c137b4a4becf",
          "label": "apinode"
        },
        {
          "key": "23d20ae929914fd896ef4ef6f33de29a",
          "label": "datasetnode"
        }
      ],
      "value": "23d20ae929914fd896ef4ef6f33de29a",
      "enabled": true
    },
    "filterKey": {
      "name": "filterKey",
      "_type": "string",
      "selectionList": [],
      "value": "transaction_id",
      "enabled": true
    }
  }
];
    let filterData = await getFilterProps(filterProps,postgres7f5c4);
    settransactionsuf_v1Props([...filterData ]);
      setShowProfileAsModalOpen(true)
    
    
  }


  async function handleConfirmOnSaveAll(){
  } 

  const handleSelectAll = (event: { target: { checked: any } }) => {
    if (event.target.checked) {
      setSelectedRows(postgres7f5c4) // Select all rows
    } else {
      setSelectedRows([]) // Deselect all rows
    }
  }

  const onRowDataChange = (
    rowIndex: number,
    newData: any,
    type: string,
    colunm?: any
  ) => {
    const updatedData = postgres7f5c4.map((item: any) => {
      if (item.billingid === rowIndex) {
        if (type === 'number') {
          if(newData.value.length > 0 && newData.value.startsWith('0')){
            newData.value = newData.value.slice(1);
          } 
          return {
            ...item,
            [newData.name]: +newData.value
          }
        } 
        else if (type == 'date') {
          const selectedDate = new Date(newData)
          const IST_OFFSET = 5.5 * 60 * 60 * 1000
          const indiaTime = new Date(selectedDate.getTime() + IST_OFFSET)
          const isoDate = indiaTime.toISOString()
          return {
            ...item,
            [colunm]: isoDate
          }
        } 
        else {
          return {
            ...item,
            [newData.name]: newData.value
          }
        }
      }
      return item
    })
    setpostgres7f5c4(updatedData)
  }
  const onDelete = (Indx: number) => {
    const updatedData = postgres7f5c4.filter((item: any) => {
      if (item.billingid != Indx) {
        return item
      }
    })
    setpostgres7f5c4(updatedData)
  }
  function addRow() {
    let newRow: any = {}
    columns.forEach((item:any) => {
      if (item.id === 'billingid') {
        newRow['billingid'] = generateUniqueCode()
      } else if (item.type === 'number') {
        newRow[item.id] = 0
      } else if (item.type === 'text') {
        newRow[item.id] = '' 
      } else if (item.type === 'date') {
        newRow[item.id] = null
      } else newRow[item.id] = ''
    })
    setpostgres7f5c4([newRow, ...postgres7f5c4])
  }
  useEffect(()=>{
    if(Array.isArray(postgres7f5c4)&&postgres7f5c4.length >= 0)
      someRecords()
  },[postgres7f5c4])
  function someRecords(){
    let sumableColums:any=[]
    let sumableColumsAndName:any=[]
    columns.map((item:any)=>{
        if(item.type=='number' && 'billingid' != item.id && item.id && item?.isSumable==true)
        {
          sumableColumsAndName.push({id:item.id,name:item?.name})
          sumableColums.push(item.id)
        } 
    })
    let ans:any={}
    postgres7f5c4.map((item:any)=>{
        sumableColums.map((cols:any)=>{
            if(ans.hasOwnProperty(cols))
                ans={ ...ans,[cols]:item[cols]+ans[cols]}
            else{
                ans={ ...ans,[cols]:item[cols]}
            }
        })
    })
    sumableColumsAndName.map((item:any)=>{
      if(item?.id==item?.name)
      {
        ans[item?.name] =structuredClone(ans[item.id])
      }else
      {
        ans[item?.name] =structuredClone(ans[item.id])
        delete ans[item.id]
      }
     })
     setSumValues(ans)
  }

  useEffect(() => {
    setpostgres7f5c4([])
  }, [primaryTableData.value])

  if (postgres7f5c4?.isHidden) {
    return <></>
  }

  return (
    <div className="px-[0.7vw]" style={{gridColumn: `1 / 13`,gridRow: `4 / 6`,marginTop: `auto`, gap:`10px`}}>
          <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
            <div className='flex h-[30px] w-full'>
             <button
               className='flex w-[30px] justify-end'
               onClick={() => setShowProfileAsModalOpen(false)}
             >
               X
             </button>
           </div>
           <PageTransactionsufpage/>
           </Modal>
      <Row space={3}>
        <Col>
          <Flex direction='column' >
            <div className='overflow-x-auto'>
              <div className='flex justify-end p-2'>
                <Button
                  title='Add Row'
                  onClick={addRow}
                  size='s'
                  className='flex transform items-center rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
                >
                  <IoAdd size={18} />
                </Button>
              </div>
              <table className='min-w-full rounded-md border border-gray-200 bg-white'>
                <thead>
                  <tr className='border border-gray-200 text-sm leading-normal text-gray-600'>
                    {/* <th className='px-3 py-2 text-left'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        onChange={handleSelectAll}
                      />
                    </th> */}
                    {columns.map(
                      (column: any) =>
                        column?.id != 'billingid' && (
                          <th key={column.id} className='px-3 py-1 text-left'>
                            {keyset(column.name)}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody className='text-sm font-light text-gray-600'>
                  {postgres7f5c4.map((row: any) => {
                    const isSelected = selectedRows.some(
                      (selectedRow: { billingid: any }) => selectedRow.billingid === row.billingid
                    )
                    return (
                      <tr
                        key={row.billingid}
                        className={`border-b border-gray-200 ${isSelected ? 'bg-orange-200' : 'hover:bg-gray-100'}`}
                      >
                      {/*<td className='px-3 py-1 text-left'>
                          <input
                            type='checkbox'
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(row)}
                            className={`h-4 w-4 rounded-lg border-2 border-black  transition duration-150 ease-in-out focus:ring-2 ${isSelected ? 'bg-orange-200' : 'bg-gray-100'}`}
                          />
                        </td> */}
                        {columns.map(
                          (column: any) =>
                            column?.id != 'billingid' && column?.id != primaryTableData.primaryKey && (
                              <td key={column.id} className='px-3 py-1 text-left'>
                                {column.type == 'date' ? (
                                  row[column.id] != null ? (
                                    <DatePicker
                                      size='s'
                                      value={dateTimeParse(row[column.id])}
                                      onUpdate={event => {
                                        onRowDataChange(
                                          row['billingid'],
                                          event,
                                          column.type,
                                          column.id
                                        )
                                      }}
                                    />
                                  ) : (
                                    <DatePicker
                                      size='s'
                                      readOnly= {postgres7f5c4?.isDisabled ? true : false}
                                      onUpdate={event => {
                                        onRowDataChange(
                                          row['billingid'],
                                          event,
                                          column.type,
                                          column.id
                                        )
                                      }}
                                    />
                                  )
                                  ) : (
                                  <TextInput
                                    value={row[column.id]}
                                    name={column.id}
                                    type={column.type}
                                    view='clear'
                                    readOnly= {postgres7f5c4?.isDisabled ? true : false}
                                    onChange={event => {
                                      onRowDataChange(
                                        row['billingid'],
                                        event.target,
                                        column.type
                                      )
                                    }}
                                  />
                                )}
                              </td>
                            )
                        )}
                        <td className='px-6 py-3 text-left'>
                          <Button size='s' onClick={() => onDelete(row.billingid)}>
                            <Icon data={SquareXmark} size={18} />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {postgres7f5c4.length == 0 && (
                <div className='flex w-full items-center justify-center p-2'>
                  {keyset("no data")}
                </div>
              )}
              {Object.keys(sumValues).map((items:any,id:any)=>{

                return(
        
                  <div key={id} className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-base font-medium text-gray-900">Total {items}</span>
                    <span className="text-base font-semibold text-gray-900">₹ {sumValues[items]||""}</span>
                  </div>
                )
              })}
              <div className='flex justify-end p-2'>
                <Button
                  className='flex transform items-center rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-3 font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
                  onClick={handleAllSave}
                  size='l'
                >
                {keyset("Save All")}

                </Button>
              </div>
            </div>
          </Flex>
        </Col>
      </Row>
    </div>
  )
}

export default Tablepostgres;