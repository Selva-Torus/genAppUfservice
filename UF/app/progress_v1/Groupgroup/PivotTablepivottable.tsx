

'use client'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import React, { useEffect, useState,useContext } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Modal } from "@/components/Modal";
import { Icon } from '@/components/Icon';
import { TextInput } from '@/components/TextInput';
import { DatePicker } from '@/components/DatePicker';
import i18n from '@/app/components/i18n';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { codeExecution } from '@/app/utils/codeExecution'
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useRouter } from 'next/navigation'
import { eventBus } from '@/app/eventBus';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { CommonHeaderAndTooltip } from "@/components/CommonHeaderAndTooltip";
import clsx from "clsx";


let mappedColumns:any[] = [
  {
    "id": "id"
  },
  {
    "id": "name"
  }
];
let presentCols:any[] = [
  "id",
  "name"
];

interface Expense {
  id: any
  [key: string]: any
}
function generateUniqueCode() {
  const timestamp = new Date().getTime() // Current timestamp in milliseconds
  const randomValue = Math.random().toString(36).substring(2, 8) // Random alphanumeric string of length 6
  return `${timestamp}-${randomValue}`
}

export default function PivotTablepivottable({encryptionFlagCompData}:any) {
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [allCode,setAllCode]=useState<any>("");
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const toast:any=useInfoMsg()
  let code:any = ""
  const keyset:any=i18n.keyset("language") 
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'id',type:"text"})
  const routes = useRouter()
  const [selectedRows, setSelectedRows] = useState<any>([])
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
 /////////////
   //another screen
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  
  const [sumableCols,setSumableCols] = useState<any>(
  )
  const [selection, setSelection] = useState<any[]>([])
  const [dstColumns, setDstColumns] = useState<any>([])
  const [sumValues,setSumValues]=useState<any>({})
  const [newExpense, setNewExpense] = useState<Expense>({
    id: '',
    category: '',
    date: '',
    amount: 0
  })
  const GetTableDetails = async () => {
    const orchestrationData = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
        componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
        controlId: "1c14057857f346c8931ad03b2cb703fa",
        isTable: false,
        from:"PivotTablepivottable",
        accessProfile:accessProfile
      },
      
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (orchestrationData?.data) {
      if(orchestrationData?.data?.mapper?.length>0)
      {
        if (orchestrationData?.data?.schemaData) {
          let altertColumns: any = []
          let allSchemas: any[] =
            orchestrationData?.data?.schemaData[0].schema.responses['200']
              .content['application/json'].schema.items.properties
          mappedColumns.map((defaultRenderItem: any) => {
            Object.keys(allSchemas).map((schemaItem: any) => {
              if (defaultRenderItem.id == schemaItem) {
                altertColumns.push({
                  ...defaultRenderItem,
                  type:
                    allSchemas[schemaItem].example?.toLowerCase() == 'string'
                      ? 'text'
                      : allSchemas[schemaItem].example?.toLowerCase() == 'integer'
                      ? 'number'
                      : allSchemas[schemaItem].example?.toLowerCase()
                })
              }
            })
          })
          if (Array.isArray(orchestrationData?.data?.security)) {
            let securityData = orchestrationData?.data?.security
            altertColumns = altertColumns.filter((item: any) => {
              if (securityData.includes(item?.id)) return item
            })
          }
          console.log(altertColumns)

          setDstColumns(altertColumns)
        }
      }
    if(orchestrationData?.data?.code)
    {
      setAllCode(orchestrationData?.data?.code)
    }      
    }
  }
  const [userType,setUserType]=useState<any>([])
  
  useEffect(()=>{
    GetTableDetails()
  },[pivottable703fa?.refresh])

  const handleCustomCode=async () => {
    code = allCode
    if (code != '') {
      let codeStates: any = {}
          codeStates['group']  = groupbffe9,
          codeStates['setgroup'] = setgroupbffe9,
          codeStates['usertable']  = usertable8d993,
          codeStates['setusertable'] = setusertable8d993,
          codeStates['usertable2']  = usertable2b6e16,
          codeStates['setusertable2'] = setusertable2b6e16,
        code = codeExecution(code,codeStates)
        return code
    }
  }

  async function setLock(data:any){  
    setSelection(data)
    let temp:any = groupbffe9
    for(let i=0;i<temp?.id?.length;i++)
    {
      temp.id[i]._isSelected_= false
    }
    data.map((indexes:any)=>{
      temp.id[indexes]._isSelected_=true
    })
    setgroupbffe9(temp)
    let summedValues:any={}
    if(sumableCols?.length>0){
      temp?.id?.map((items:any)=>{
        sumableCols?.map((sumable:any)=>{
          if(Object.keys(items).includes(sumable?.key))
          {
            if(typeof items[sumable?.key] == "number" && items['_isSelected_'] == true){
              if(Object.keys(summedValues).includes(sumable?.label))
                  summedValues[sumable?.label]= summedValues[sumable?.label] + items[sumable?.key]
              else
                summedValues[sumable?.label]=items[sumable?.key]
            }
          }
        })
      })
    }
    setSumValues(summedValues)
    await handleCustomCode()
  }

  
  const getRowActions = (item: any, index: number) => {
    return [
      {text: 'Remove',handler: () => {},theme: 'danger'}
    ]
  }

    const onRowDataChange = (
    rowIndex: number,
    newData: any,
    type: string,
    colunm?: any
  ) => {
    let temp: any[] = groupbffe9?.userable || []
    const updatedData = temp?.map((item: any, id: number) => {
      if (id == rowIndex) {
        if (type === 'number') {
          if (newData.value.length > 0 && newData.value.startsWith('0')) {
            newData.value = newData.value.slice(1)
          }
          return {
            ...item,
            [newData.name]: +newData.value
          }
        } else if (type == 'date' || type === 'datetime') {
          const selectedDate = new Date(newData)
          const IST_OFFSET = 5.5 * 60 * 60 * 1000
          const indiaTime = new Date(selectedDate.getTime() + IST_OFFSET)
          const isoDate = indiaTime.toISOString()
          return {
            ...item,
            [colunm]: isoDate
          }
        } else {
          return {
            ...item,
            [newData.name]: newData.value
          }
        }
      }
      return item
    })
    setgroupbffe9((pre: any) => ({
      ...pre,
      userable: updatedData
    }))
  }
  function addRow() {
    let newRow: any = {}
    dstColumns.forEach((item: any) => {
      if (item.type === 'number') {
        newRow[item.id] = 0
      } else if (item.type === 'text') {
        newRow[item.id] = ''
      } else if (item.type === 'date' || item.type === 'datetime') {
        newRow[item.id] = null
      } else newRow[item.id] = ''
    })

    console.log(newRow)
    let childTables: any = groupbffe9?.childTables || []
    childTables.push('userable')
    childTables = childTables.filter(
      (item: any, index: number) => childTables.indexOf(item) === index
    )

    if (Array.isArray(groupbffe9?.userable)) {
      setgroupbffe9((pre: any) => ({
        ...pre,
        childTables,
        userable: [...pre?.userable, newRow]
      }))
    } else {
      setgroupbffe9((pre: any) => ({ ...pre,     childTables, userable: [newRow] }))
    }

    return
  }

  function deleteRow(index: number) {
    let temp: any = groupbffe9?.userable || []
    temp.splice(index, 1)
    setgroupbffe9((pre: any) => ({ ...pre, userable: temp }))
  }
  return (
    <div
      style={{gridColumn: `2 / 24`,gridRow: `398 / 452`, gap:``, height: `100%`, overflow: 'auto'}} >

     <CommonHeaderAndTooltip
        needTooltip={true}  
        tooltipProps={{title:"tooltip",placement:"bottom-start"}}
        headerPosition='top'
        headerText="header"
 
 
 >
      <div>
        <div className='flex justify-end p-2'>
          <Button
            onClick={addRow}
            className="!w-[10%] !h-[30px]"
            
          >
           <Icon data="FaPlus" size={18} />
          </Button>
        </div>
        <div className='relative w-full h-full rounded-md border border-gray-200'>
          <table className='min-w-full bg-white'>
            <thead className='sticky top-0 z-10 bg-gray-50'>
              <tr className='border-b border-gray-200 text-sm leading-normal text-gray-600'>
                {dstColumns.map((column: any) => (
                  <th key={column.id} className='px-3 py-1 text-left'>
                    {keyset(column.name || column.id)}
                  </th>
                ))}
                <th className='px-6 py-3 text-left'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 text-sm font-light text-gray-600'>
              {Array.isArray(groupbffe9?.userable) ? groupbffe9?.userable.map(
                (row: any, index: number) => {
                  const isSelected = false
                  return (
                    <tr
                      key={index}
                      className={clsx("border-b border-gray-200",
                          isSelected ? 'bg-orange-200' : 'hover:bg-gray-100'
                        )}
                    >
                      {dstColumns.map((column: any) => (
                        <td key={column.id} className='px-3 py-1 text-left'>
                          {column.type === 'date' ||
                          column.type === 'datetime' ? (
                            <DatePicker
                              onUpdate={event => {
                                onRowDataChange(
                                  index,
                                  event,
                                  column.type,
                                  column.id
                                )
                              }}
                            />
                          ) : (
                            <TextInput
                              value={row[column.id]}
                              name={column.id}
                              type={column.type}
                              view='clear'
                              pin='brick-brick'
                              onChange={event => {
                                onRowDataChange(
                                  index,
                                  event.target,
                                  column.type
                                )
                              }}
                            />
                          )}
                        </td>
                      ))}
                      <td className='px-6 py-3 text-left'>
                        <Button onClick={() => deleteRow(index)}>
                          <Icon data="FaRegTimesCircle" size={18} />
                        </Button>
                      </td>
                    </tr>
                  )
                }
              )
            :null
          }
            </tbody>
          </table>
        </div>
      </div>
      {Object.keys(sumValues).map((items:any,id:any)=>{
        return(
          <div key={id} className="mt-6 flex items-center justify-between border-t pt-4">
            <span className="text-base font-medium text-gray-900">{items}</span>
            <span className="text-base font-semibold text-gray-900">₹ {sumValues[items]||""}</span>
          </div>
        )
      })}
       </CommonHeaderAndTooltip>
    </div>
  )
}