

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
const Dropdowndirection = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
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
  const {payment_group1c8a5, setpayment_group1c8a5}= useContext(TotalContext) as TotalContextProps;
  const {payment_group1c8a5Props, setpayment_group1c8a5Props}= useContext(TotalContext) as TotalContextProps;
  const {channel_named9a37, setchannel_named9a37}= useContext(TotalContext) as TotalContextProps;
  const {product_code9a692, setproduct_code9a692}= useContext(TotalContext) as TotalContextProps;
  const {directionbf471, setdirectionbf471}= useContext(TotalContext) as TotalContextProps;
  const {charge_type977c5, setcharge_type977c5}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account0655c, setdebtor_account0655c}= useContext(TotalContext) as TotalContextProps;
  const {creditor_accounts82148, setcreditor_accounts82148}= useContext(TotalContext) as TotalContextProps;
  const {amountc2ae9, setamountc2ae9}= useContext(TotalContext) as TotalContextProps;
  const {currency124c5, setcurrency124c5}= useContext(TotalContext) as TotalContextProps;
  const {uuide86ae, setuuide86ae}= useContext(TotalContext) as TotalContextProps;
  const {process_type45fad, setprocess_type45fad}= useContext(TotalContext) as TotalContextProps;
  const {tran_category81c97, settran_category81c97}= useContext(TotalContext) as TotalContextProps;
  const {settlement_datea6baf, setsettlement_datea6baf}= useContext(TotalContext) as TotalContextProps;
  const {remittance_info57b4b, setremittance_info57b4b}= useContext(TotalContext) as TotalContextProps;
  const {product_code_json46315, setproduct_code_json46315}= useContext(TotalContext) as TotalContextProps;
  const {saveb6b99, setsaveb6b99}= useContext(TotalContext) as TotalContextProps;
  const {clearf69d6, setclearf69d6}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleStaticValue=(data:any)=>{
    setSelectedItem(data)
  }
  const [selectedItem, setSelectedItem] = useState('');
  const items = [
   'INBOUND',
   'OUTBOUND',
  ];

  useEffect(() => {
  if(payment_group1c8a5?.direction=="" || payment_group1c8a5?.direction==undefined || payment_group1c8a5?.direction==null ){
    setSelectedItem("");
  }
  },[payment_group1c8a5?.direction])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",
          componentId: "4e3a333fdb93472c97f4c7ca2461c8a5",
          controlId: "e9040d451046476782797ffeb22bf471",
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
  },[directionbf471?.refresh])

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
      setpayment_group1c8a5((prev: any) => ({ ...prev, direction: value}))
         setIsRequredData(false)
    } else {
       setpayment_group1c8a5((prev: any) => ({ ...prev, direction: ''}))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,direction:undefined}))
   
    selected.current=value
    customecode = allCode
    if (customecode != '') {
      let codeStates: any = {}
      
        codeStates['payment_group'] = payment_group1c8a5,
        codeStates['setpayment_group'] = setpayment_group1c8a5,
        codeStates['selected']  = selected,
        codeStates['payment_group1c8a5'] = payment_group1c8a5Props,
        codeStates['setpayment_group1c8a5'] = setpayment_group1c8a5Props,
        codeStates['selected']  = selected,
        codeStates['channel_name'] = channel_named9a37,
        codeStates['setchannel_name'] = setchannel_named9a37,
        codeStates['selected']  = selected,
        codeStates['product_code'] = product_code9a692,
        codeStates['setproduct_code'] = setproduct_code9a692,
        codeStates['selected']  = selected,
        codeStates['direction'] = directionbf471,
        codeStates['setdirection'] = setdirectionbf471,
        codeStates['selected']  = selected,
        codeStates['charge_type'] = charge_type977c5,
        codeStates['setcharge_type'] = setcharge_type977c5,
        codeStates['selected']  = selected,
        codeStates['debtor_account'] = debtor_account0655c,
        codeStates['setdebtor_account'] = setdebtor_account0655c,
        codeStates['selected']  = selected,
        codeStates['creditor_accounts'] = creditor_accounts82148,
        codeStates['setcreditor_accounts'] = setcreditor_accounts82148,
        codeStates['selected']  = selected,
        codeStates['amount'] = amountc2ae9,
        codeStates['setamount'] = setamountc2ae9,
        codeStates['selected']  = selected,
        codeStates['currency'] = currency124c5,
        codeStates['setcurrency'] = setcurrency124c5,
        codeStates['selected']  = selected,
        codeStates['uuid'] = uuide86ae,
        codeStates['setuuid'] = setuuide86ae,
        codeStates['selected']  = selected,
        codeStates['process_type'] = process_type45fad,
        codeStates['setprocess_type'] = setprocess_type45fad,
        codeStates['selected']  = selected,
        codeStates['tran_category'] = tran_category81c97,
        codeStates['settran_category'] = settran_category81c97,
        codeStates['selected']  = selected,
        codeStates['settlement_date'] = settlement_datea6baf,
        codeStates['setsettlement_date'] = setsettlement_datea6baf,
        codeStates['selected']  = selected,
        codeStates['remittance_info'] = remittance_info57b4b,
        codeStates['setremittance_info'] = setremittance_info57b4b,
        codeStates['selected']  = selected,
        codeStates['product_code_json'] = product_code_json46315,
        codeStates['setproduct_code_json'] = setproduct_code_json46315,
        codeStates['selected']  = selected,
        codeStates['save'] = saveb6b99,
        codeStates['setsave'] = setsaveb6b99,
        codeStates['selected']  = selected,
        codeStates['clear'] = clearf69d6,
        codeStates['setclear'] = setclearf69d6,
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
     setpayment_group1c8a5((pre:any)=>({...pre,direction:""}))
    else
      setInitialCount(1)
  },[directionbf471?.refresh])

  if (directionbf471?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `13 / 19`,
        gridRow: `1 / 20`,
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
        disabled= {directionbf471?.isDisabled ? true : false}
        contentAlign={"center"}
        headerPosition='top'
        headerText={
          <>
            Direction
            {isRequredData && <span style={{ color: 'red' }}> *</span>}
          </>
        }
        value={payment_group1c8a5?.direction ?payment_group1c8a5?.direction: []}
        onChange={handleClick} 
      /> 
      {validate?.direction && (
        <Text fillContainer={false} variant="caption-1" color="danger" className="mt-1 flex-shrink-0">
          {error || 'This field is required'}
        </Text>
      )}
    </div>
  );
};

export default Dropdowndirection;
