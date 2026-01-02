'use client'
import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { XMLParser } from 'fast-xml-parser'


    

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
 

const Buttonload = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const token:string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = "";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const savedData=useRef({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast:any=useInfoMsg();
  let dfKey: string | any;
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<any>("");
  const [fileBindFlag, setFileBindFlag] = React.useState(false);
  const [fileBind, setFileBind] = React.useState<any>({
   readFunction:()=>{},
   stateName:{},
   mainControlName:""
  });
    
 /////////////
   //another screen
  const {operations58572, setoperations58572}= useContext(TotalContext) as TotalContextProps;
  const {operations58572Props, setoperations58572Props}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231, setwrite_group55231}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231Props, setwrite_group55231Props}= useContext(TotalContext) as TotalContextProps;
  const {loadb02a6, setloadb02a6}= useContext(TotalContext) as TotalContextProps;
  const {convert70e2d, setconvert70e2d}= useContext(TotalContext) as TotalContextProps;
  const {writef1fd7, setwritef1fd7}= useContext(TotalContext) as TotalContextProps;
  const {clearb264e, setclearb264e}= useContext(TotalContext) as TotalContextProps;
  const {source95c56, setsource95c56}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: any = {};
      codeStates['operations']  = operations58572,
      codeStates['setoperations'] = setoperations58572,
      codeStates['write_group']  = write_group55231,
      codeStates['setwrite_group'] = setwrite_group55231,
      codeStates['response']  = savedData.current,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1",
          componentId: "54f9d158801644ad9a2051ee28c55231",
          controlId: "cfc3f0a3502449c98120d1cc270b02a6",
          isTable: false,
          from:"ButtonLoad",
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
      setAllCode(orchestrationData?.data?.code);
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "loadb02a6") {
        handleClick();
      }
    });
  },[loadb02a6?.refresh])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans=[]
    let id=""
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }

  const handleClick=async()=>{
    if(write_group55231Props?.validation==true && write_group55231Props?.required==true || write_group55231Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
    } 
    let saveCheck=false;
        Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true;
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger');
      return
    }
    try{  
    // setoperations58572({ ...write_group55231, source:allData });           
    setFileBindFlag(true);
    setFileBind((pre:any)=>({
      ...pre,
      readFunction: setoperations58572,
      stateName: operations58572,
      mainControlName:'source'
    }))
      await delay(1000);
      await handleCustomCode();
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }
  async function handleConfirmOnClick(){
    try{
    }catch(err){
      toast(err, 'danger');
    }
  } 


  async function handleConfirmOnCancel(){
     try{
    }catch(err){
      toast(err, 'danger');
    }
  }


 if (loadb02a6?.isHidden) {
    return <></>
  }
 
  return (
    <div 
      style={{gridColumn: `1 / 4`,gridRow: `1 / 12`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Modal
        open={fileBindFlag}
        onClose={() => setFileBindFlag(false)}
        className='w-[800px] h-[500px] bg-gray-50 mx-auto rounded-lg shadow-xl p-5'
      >
        <FileReaderPage setData={fileBind.readFunction} stateName={fileBind.stateName} mainControlName={fileBind.mainControlName} />
      </Modal>
        <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='outlined-info'
          size='s'           
          disabled= {loadb02a6?.isDisabled ? true : false}
          pin='circle-circle'
        >
              {keyset("Load")}
        </Button>
      </div>
    
  )
}

export default Buttonload

function FileReaderPage({ setData = () => {},stateName={}, mainControlName=""}: { setData: any,stateName:any,mainControlName:string }) {
  const [fileContent, setFileContent] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    setFileName(file.name)
    setFileType(file.type || file.name.split('.').pop() || '')

    reader.onload = async event => {
      let result = event.target?.result as string
      let formatData: any = {}
      let fileType: string = 'text'

      // Handle JSON
      if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(result)
          result = JSON.stringify(json, null, 2)
          formatData = json
          fileType = 'json'
        } catch (err) {
          result = 'Invalid JSON file.'
        }
      }

      // Handle XML
      // else if (file.name.endsWith('.xml')) {
//   const parser = new DOMParser()
//   try {
//     const xmlDoc = parser.parseFromString(result, 'text/xml')
//     const formatted = new XMLSerializer().serializeToString(xmlDoc)
//     result = formatted
//     const xmlText = await file.text()
//     const parser2 = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: '@_',
//       allowBooleanAttributes: true,
//       parseAttributeValue: true,
//       trimValues: true
//     })
//     const xml = parser2.parse(xmlText)
//     formatData = xml
//     fileType = 'xml'
//   } catch (err) {
//     result = 'Invalid XML file.'
        //   }
      // }

      setFileContent(result)
      if (fileType == 'text') {
        setData((pre: any) => ({ ...pre, [mainControlName]: result }))
      } else {
        setData((pre: any) => ({ ...pre, [mainControlName]: formatData }))
      }
    }

    reader.readAsText(file)
  }

  return (
            <div className='w-full h-full flex flex-col p-4 sm:p-6'>
      <h1 className='mb-6 pb-3 text-xl sm:text-2xl font-bold text-center border-b-2 border-gray-300 dark:border-gray-600'>
        📄 File Reader
      </h1>

      <div className='mb-6'>
        <label
          htmlFor='file-upload'
          className='flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
          <span className='text-sm sm:text-base'>Choose File (.txt, .json, .xml)</span>
        </label>
        <input
          id='file-upload'
          type='file'
          accept='.txt, .json, .xml'
          onChange={handleFileChange}
          className='hidden'
        />
        {fileName && (
          <p className='mt-3 text-sm text-gray-600 dark:text-gray-400 text-center'>
            Selected: <span className='font-semibold text-gray-800 dark:text-gray-200'>{fileName}</span>
          </p>
        )}
      </div>

      {fileName && (
        <div className='flex-1 flex flex-col min-h-0'>
          <h2 className='mb-3 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200'>
            📝 File Content
          </h2>
          <div className='flex-1 overflow-auto rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg'>
            <pre className='p-4 whitespace-pre-wrap break-words font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200'>
              {fileContent}
            </pre>
          </div>
        </div>
      )}

      {!fileName && (
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center text-gray-400 dark:text-gray-500'>
            <svg
              className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <p className='text-sm sm:text-base'>No file selected</p>
          </div>
        </div>
      )}
    </div>
  )
}

