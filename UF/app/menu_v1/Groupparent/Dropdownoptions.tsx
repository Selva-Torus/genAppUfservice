

'use client'
import React, { useState,useContext,useEffect,useRef } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { AxiosService } from "@/app/components/axiosService";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/app/components/cookieMgment';
import { getDropdownDetailsNew } from '@/app/utils/getMapperDetails';
import { codeExecution } from '@/app/utils/codeExecution';
import { eventBus } from '@/app/eventBus';
import { Dropdown } from '@/components/Dropdown';
import { Text } from '@/components/Text';
import {Modal} from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import * as v from 'valibot';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';


let getMapperDetailsBindValues:any ={} ;
const Dropdownoptions = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
  const token: string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { validate, setValidate } = useContext(
    TotalContext
  ) as TotalContextProps
  const [isRequredData,setIsRequredData]=useState(false)
  const [error, setError] = useState<string>('')
  const keyset:any=i18n.keyset("language");
  const [initialCount,setInitialCount]=useState(0)
  let getMapperDetails:any;
  let getMapperDetailsValues:any;
  const toast=useInfoMsg();
  const routes = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef(false);
  let customecode:any="";
  const [allCode,setAllCode]=useState<any>("");
  const [ruleCode,setRuleCode]=useState<any>("");
 /////////////
   //another screen
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {hheadd1, sethheadd1}= useContext(TotalContext) as TotalContextProps;
  const {selectionapproach09360, setselectionapproach09360}= useContext(TotalContext) as TotalContextProps;
  const {options850a2, setoptions850a2}= useContext(TotalContext) as TotalContextProps;
  const {test22a10, settest22a10}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleStaticValue=(data:any)=>{
    setSelectedItem(data)
  }
  const [selectedItem, setSelectedItem] = useState('');
  const items = [
   'ps',
   'PS001',
  ];

  useEffect(() => {
  if(parent0e5b8?.options=="" || parent0e5b8?.options==undefined || parent0e5b8?.options==null ){
    setSelectedItem("");
  }
  },[parent0e5b8?.options])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "03e924560c144d3181733fca11c0e5b8",
          controlId: "14cae217567a4a57a4579db71e8850a2",
          isTable: false,
          accessProfile:accessProfile,
          from:"dropdownoptions"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.code)
      {
        setAllCode(orchestrationData?.data?.code)
      }
      if(orchestrationData?.data?.rule?.nodes?.length>0){
        setRuleCode(orchestrationData?.data?.rule)        
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    handleMapperValue()
  },[options850a2?.refresh])

  const selected=useRef({})
  const handleClick=async(value?:any)=>{
    if (value.length > 0) {
      let temp:any=[]
      if(Array.isArray(value)){
        for( let val of value){
          if(Array.isArray(val)){
            temp.push(val)
          }else{
            temp.push(val)
          }        
        }
      }
      setparent0e5b8((prev: any) => ({ ...prev, options: value}))
         setIsRequredData(false)
    } else {
       setparent0e5b8((prev: any) => ({ ...prev, options: ''}))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,options:undefined}))
   
    selected.current=value
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}
      
        codeStates['parent'] = parent0e5b8,
        codeStates['setparent'] = setparent0e5b8,
        codeStates['selected']  = selected,
        codeStates['parent0e5b8'] = parent0e5b8Props,
        codeStates['setparent0e5b8'] = setparent0e5b8Props,
        codeStates['selected']  = selected,
        codeStates['form'] = form775ce,
        codeStates['setform'] = setform775ce,
        codeStates['selected']  = selected,
        codeStates['form775ce'] = form775ceProps,
        codeStates['setform775ce'] = setform775ceProps,
        codeStates['selected']  = selected,
        codeStates['searchvalue'] = searchvalue25fa2,
        codeStates['setsearchvalue'] = setsearchvalue25fa2,
        codeStates['selected']  = selected,
        codeStates['hh'] = hheadd1,
        codeStates['sethh'] = sethheadd1,
        codeStates['selected']  = selected,
        codeStates['selectionapproach'] = selectionapproach09360,
        codeStates['setselectionapproach'] = setselectionapproach09360,
        codeStates['selected']  = selected,
        codeStates['options'] = options850a2,
        codeStates['setoptions'] = setoptions850a2,
        codeStates['selected']  = selected,
        codeStates['test'] = test22a10,
        codeStates['settest'] = settest22a10,
        codeStates['selected']  = selected,
        codeStates['groupfordynamicbutton'] = groupfordynamicbutton143be,
        codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
        codeStates['selected']  = selected,
        codeStates['groupfordynamicbutton143be'] = groupfordynamicbutton143beProps,
        codeStates['setgroupfordynamicbutton143be'] = setgroupfordynamicbutton143beProps,
        codeStates['selected']  = selected,
        codeStates['buttons'] = buttons60ce5,
        codeStates['setbuttons'] = setbuttons60ce5,
        codeStates['selected']  = selected,
        codeStates['buttons60ce5'] = buttons60ce5Props,
        codeStates['setbuttons60ce5'] = setbuttons60ce5Props,
        codeStates['selected']  = selected,
    codeExecution(customecode,codeStates)
    }
  }
   
  async function handleConfirmonClick(){
  } 
  const { validateRefetch, setValidateRefetch } = useContext(
    TotalContext
  ) as TotalContextProps
  let schemaArray = [] ;
  const handleBlur = async () => {
  }
    useEffect(()=>{
        handleBlur()
    },[validateRefetch.value])

  useEffect(() => {
    if(initialCount!=0)
     setparent0e5b8((pre:any)=>({...pre,options:""}))
    else
      setInitialCount(1)
  },[options850a2?.refresh])

  if (options850a2?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `13 / 18`,
        gridRow: `45 / 60`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown
        className=""
        placeholder={keyset("options")} 
        filterable={true}
        hasClear={true}
        static={true}
        staticProps={items}
        disabled= {options850a2?.isDisabled ? true : false}
        contentAlign={"center"}
        value={parent0e5b8?.options ?parent0e5b8?.options: []}
        onChange={handleClick} 
      /> 
      {validate?.options && (
        <Text fillContainer={false} variant="caption-1" color="danger" className="mt-1 flex-shrink-0">
          {error || 'This field is required'}
        </Text>
      )}
    </div>
  );
};

export default Dropdownoptions;
