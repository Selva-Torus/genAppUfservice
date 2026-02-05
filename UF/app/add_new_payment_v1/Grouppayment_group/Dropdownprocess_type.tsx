

'use client'
import React, { useState,useContext,useEffect,useRef } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { AxiosService } from "@/app/components/axiosService";
import { getMapperDetailsDto, te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from '@/app/components/infoMsgHandler';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
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
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";


let getMapperDetailsBindValues:Record<string, any> ={} ;
const Dropdownprocess_type = ({lockedData,setLockedData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagCompData}: any) => {
  const token: string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { validate, setValidate } = useContext(
    TotalContext
  ) as TotalContextProps
  const [isRequredData,setIsRequredData]=useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const keyset:Function=i18n.keyset("language");
  const [initialCount,setInitialCount]=useState<number>(0)
  let getMapperDetails:string[];
  let getMapperDetailsValues:string[];
  const toast:Function=useInfoMsg();
  const routes: AppRouterInstance = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef<any>(false);
  let customecode:string="";
  const [allCode,setAllCode]=useState<string>("");
  const [ruleCode,setRuleCode]=useState<string>("");
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
   'OP',
   'IR',
   'IP',
   'OR',
  ];

  useEffect(() => {
  if(payment_group1c8a5?.process_type=="" || payment_group1c8a5?.process_type==undefined || payment_group1c8a5?.process_type==null ){
    setSelectedItem("");
  }
  },[payment_group1c8a5?.process_type])

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",
          componentId: "4e3a333fdb93472c97f4c7ca2461c8a5",
          controlId: "6532ec8b2038425986143d243c645fad",
          isTable: false,
          accessProfile:accessProfile,
          from:"dropdownProcess Type"
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
  },[process_type45fad?.refresh])

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
      setpayment_group1c8a5((prev: any) => ({ ...prev, process_type: value}))
         setIsRequredData(false)
    } else {
       setpayment_group1c8a5((prev: any) => ({ ...prev, process_type: ''}))
        setIsRequredData(true)
    }
    setError('')
    setValidate((pre:any)=>({...pre,process_type:undefined}))
   
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
     setpayment_group1c8a5((pre:any)=>({...pre,process_type:""}))
    else
      setInitialCount(1)
  },[process_type45fad?.refresh])

  if (process_type45fad?.isHidden) {
    return <></>
  }

  return (
    <div
      style={{
        gridColumn: `7 / 13`,
        gridRow: `41 / 60`,
        gap:``, 
        height: `100%`,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'}} >
      <Dropdown
        className=""
        placeholder={keyset("Process Type")} 
        filterable={true}
        hasClear={true}
        static={true}
        staticProps={items}
        disabled= {process_type45fad?.isDisabled ? true : false}
        contentAlign={"center"}
        headerPosition='top'
        headerText={
          <>
            Process Type
            {isRequredData && <span style={{ color: 'red' }}> *</span>}
          </>
        }
        value={payment_group1c8a5?.process_type ?payment_group1c8a5?.process_type: []}
        onChange={handleClick} 
      /> 
      {validate?.process_type && (
        <Text fillContainer={false} variant="caption-1" color="danger" className="mt-1 flex-shrink-0">
          {error || 'This field is required'}
        </Text>
      )}
    </div>
  );
};

export default Dropdownprocess_type;
