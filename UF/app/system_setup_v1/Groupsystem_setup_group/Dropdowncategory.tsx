

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
const Dropdowncategory = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
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
  const {system_setup_group2af15, setsystem_setup_group2af15}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_group2af15Props, setsystem_setup_group2af15Props}= useContext(TotalContext) as TotalContextProps;
  const {product_code523b7, setproduct_code523b7}= useContext(TotalContext) as TotalContextProps;
  const {setup_code88cd6, setsetup_code88cd6}= useContext(TotalContext) as TotalContextProps;
  const {interface_productd9133, setinterface_productd9133}= useContext(TotalContext) as TotalContextProps;
  const {category80c2f, setcategory80c2f}= useContext(TotalContext) as TotalContextProps;
  const {sub_categoryd81c5, setsub_categoryd81c5}= useContext(TotalContext) as TotalContextProps;
  const {purpose3b7f4, setpurpose3b7f4}= useContext(TotalContext) as TotalContextProps;
  const {system_setup_dynamic_formf3526, setsystem_setup_dynamic_formf3526}= useContext(TotalContext) as TotalContextProps;
  const {cancelad32e, setcancelad32e}= useContext(TotalContext) as TotalContextProps;
  const {save3a1b8, setsave3a1b8}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleStaticValue=(data:any)=>{
    setSelectedItem(data)
  }
  const [selectedItem, setSelectedItem] = useState('');
  const items = [
   'Master',
   'Integration-External',
   'Integration-CBS',
   'Integration-Channel',
  ];

  useEffect(() => {
  if(system_setup_group2af15?.category=="" || system_setup_group2af15?.category==undefined || system_setup_group2af15?.category==null ){
    setSelectedItem("");
  }
  },[system_setup_group2af15?.category])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1",
          componentId: "723ad64155fe45adba8c526f1ce2af15",
          controlId: "d55dad46cde6438fbc07065557980c2f",
          isTable: false,
          accessProfile:accessProfile,
          from:"dropdown"
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
  },[category80c2f?.refresh])

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
      setsystem_setup_group2af15((prev: any) => ({ ...prev, category: value}))
         setIsRequredData(false)
    } else {
       setsystem_setup_group2af15((prev: any) => ({ ...prev, category: ''}))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,category:undefined}))
   
    selected.current=value
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}
      
        codeStates['system_setup_group'] = system_setup_group2af15,
        codeStates['setsystem_setup_group'] = setsystem_setup_group2af15,
        codeStates['selected']  = selected,
        codeStates['system_setup_group2af15'] = system_setup_group2af15Props,
        codeStates['setsystem_setup_group2af15'] = setsystem_setup_group2af15Props,
        codeStates['selected']  = selected,
        codeStates['product_code'] = product_code523b7,
        codeStates['setproduct_code'] = setproduct_code523b7,
        codeStates['selected']  = selected,
        codeStates['setup_code'] = setup_code88cd6,
        codeStates['setsetup_code'] = setsetup_code88cd6,
        codeStates['selected']  = selected,
        codeStates['interface_product'] = interface_productd9133,
        codeStates['setinterface_product'] = setinterface_productd9133,
        codeStates['selected']  = selected,
        codeStates['category'] = category80c2f,
        codeStates['setcategory'] = setcategory80c2f,
        codeStates['selected']  = selected,
        codeStates['sub_category'] = sub_categoryd81c5,
        codeStates['setsub_category'] = setsub_categoryd81c5,
        codeStates['selected']  = selected,
        codeStates['purpose'] = purpose3b7f4,
        codeStates['setpurpose'] = setpurpose3b7f4,
        codeStates['selected']  = selected,
        codeStates['system_setup_dynamic_form'] = system_setup_dynamic_formf3526,
        codeStates['setsystem_setup_dynamic_form'] = setsystem_setup_dynamic_formf3526,
        codeStates['selected']  = selected,
        codeStates['cancel'] = cancelad32e,
        codeStates['setcancel'] = setcancelad32e,
        codeStates['selected']  = selected,
        codeStates['save'] = save3a1b8,
        codeStates['setsave'] = setsave3a1b8,
        codeStates['selected']  = selected,
    codeExecution(customecode,codeStates)
    }
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
     setsystem_setup_group2af15((pre:any)=>({...pre,category:""}))
    else
      setInitialCount(1)
  },[category80c2f?.refresh])

  if (category80c2f?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `1 / 9`,
        gridRow: `26 / 45`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown
        className=""
        placeholder={keyset("")} 
        filterable={true}
        hasClear={true}
        static={true}
        staticProps={items}
        disabled= {category80c2f?.isDisabled ? true : false}
        contentAlign={"center"}
        headerPosition='top'
        headerText={
          <>
            Category
            {isRequredData && <span style={{ color: 'red' }}> *</span>}
          </>
        }
        value={system_setup_group2af15?.category ?system_setup_group2af15?.category: []}
        onChange={handleClick} 
      /> 
      {validate?.category && (
        <Text fillContainer={false} variant="caption-1" color="danger" className="mt-1 flex-shrink-0">
          {error || 'This field is required'}
        </Text>
      )}
    </div>
  );
};

export default Dropdowncategory;
