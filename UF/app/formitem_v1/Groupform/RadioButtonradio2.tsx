'use client'
import i18n from '@/app/components/i18n';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import React, { useState,useContext,useEffect } from 'react'
import { codeExecution } from '@/app/utils/codeExecution';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import { RadioButton, RadioButtonOption, Text } from '@gravity-ui/uikit';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@gravity-ui/uikit';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import PageTransactionsufpage from '@/app/transactionsuf_v1/transactionsuf_v1page';
import { AxiosService } from "@/app/components/axiosService";


const RadioButtonradio2 = ({setCheckToAdd,encryptionFlagCompData}:any) => {
  let readableControls :any = [];
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const toast:any=useInfoMsg()
  const routes = useRouter()
  const token: string = getCookie('token')
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const keyset:any=i18n.keyset("language")
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
  const {clientnamed83af, setclientnamed83af}= useContext(TotalContext) as TotalContextProps  
  const {check1238c5, setcheck1238c5}= useContext(TotalContext) as TotalContextProps  
  const {radio12a158, setradio12a158}= useContext(TotalContext) as TotalContextProps  
  const {group1a5574, setgroup1a5574}= useContext(TotalContext) as TotalContextProps  
  const {card90449, setcard90449}= useContext(TotalContext) as TotalContextProps  
  const {areatext565ce, setareatext565ce}= useContext(TotalContext) as TotalContextProps  
  const {mobile5fccb, setmobile5fccb}= useContext(TotalContext) as TotalContextProps  
  const {check2f409e, setcheck2f409e}= useContext(TotalContext) as TotalContextProps  
  const {radio28c1aa, setradio28c1aa}= useContext(TotalContext) as TotalContextProps  
  const {group254618, setgroup254618}= useContext(TotalContext) as TotalContextProps  
  const {card2f1076, setcard2f1076}= useContext(TotalContext) as TotalContextProps  
  const {areatext22664f, setareatext22664f}= useContext(TotalContext) as TotalContextProps  
  const {datepicker947d2, setdatepicker947d2}= useContext(TotalContext) as TotalContextProps  
  const {datepicker24ce5c, setdatepicker24ce5c}= useContext(TotalContext) as TotalContextProps  
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps  
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7, settransactions10ab7}= useContext(TotalContext) as TotalContextProps  
  const {transactions10ab7Props, settransactions10ab7Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const handleMapperValue=async()=>{
  try{
    let orchestrationBody :any = {
        key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1",
        componentId: "e5f95e127d7e42c8a14f50eca18daeb3",
        controlId: "1a53bf5d0b4b4dbc8eb09e177e88c1aa",
        isTable: false,
        from:"RadioButtonradio2",
        accessProfile:accessProfile
      }
       if (encryptionFlagCont) {
          orchestrationBody["dpdKey"] = encryptionDpd
          orchestrationBody["method"] = encryptionMethod
    }
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      orchestrationBody,
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
    return
  }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[radio28c1aa?.refresh])


  const options: RadioButtonOption[] = [
    {value: 'radio22' ,content:'radio22'},
  ];
  
  const handleUpdate=(e:any)=>{
    setformdaeb3((prev: any) => ({ ...prev, radio2: e}))
  }
  const handleBlur=(e:any)=>{
    let code:any=allCode
    if (code == "") {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    }  else if (code != '') {
      let codeStates: any = {}
            codeStates['form']  = formdaeb3,
            codeStates['setform'] = setformdaeb3,
            codeStates['postgres']  = postgres7f5c4,
            codeStates['setpostgres'] = setpostgres7f5c4,
            codeStates['transactions']  = transactions10ab7,
            codeStates['settransactions'] = settransactions10ab7,
    codeExecution(code,codeStates)
    }
  }
  const handleChange= async (e:any)=>{
    // showProfileAsModal
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
      let filterData = await getFilterProps(filterProps,formdaeb3);
      settransactionsuf_v1Props([...filterData ]);
    setShowProfileAsModalOpen(true)
  }
  async function handleConfirmOnChange(){
  }
  if (radio28c1aa?.isHidden) {
    return <></>
  }

  return (
    <div 
  style={{gridColumn: `5 / 7`,gridRow: `2 / 3`,marginTop: `auto`, gap:`10px`}} >
    <Modal open={showProfileAsModalOpen} onClose={() => setShowProfileAsModalOpen(false)} contentClassName='w-[] h-[] bg-gray-50 mx-auto rounded-lg shadow-xl p-5 overflow-auto'>
      <div className='flex h-[30px] w-full'>
        <div className='flex  w-[100%] justify-center font-bold text-lg'>transactionsUF</div>
        <button
          className='flex w-[30px] justify-end'
          onClick={() => setShowProfileAsModalOpen(false)}
        >
          X
        </button>
      </div>
      <PageTransactionsufpage/>
      </Modal>
      <div>{keyset("radio2")}</div>
      <RadioButton 
      className=""
        value={formdaeb3?.radio2||""}
        disabled= {radio28c1aa?.isDisabled ? true : false}
        defaultValue={options.length>0?options[0].value:""}
        options={options}   
        onChange={handleChange}
        onUpdate={handleUpdate}
        onBlur={handleBlur}
      />
    </div>
  )
}
export default RadioButtonradio2