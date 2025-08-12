


"use client"
import { RealTheme } from '@gravity-ui/uikit'
import React from 'react'
import { getCookie } from './components/cookieMgment'
export interface TotalContextProps {
  formdaeb3: any 
  setformdaeb3: React.Dispatch<React.SetStateAction<any>>
  formdaeb3Props: any 
  setformdaeb3Props: React.Dispatch<React.SetStateAction<any>>
  postgres7f5c4: any 
  setpostgres7f5c4: React.Dispatch<React.SetStateAction<any>>
  postgres7f5c4Props: any 
  setpostgres7f5c4Props: React.Dispatch<React.SetStateAction<any>>
  transactions10ab7: any 
  settransactions10ab7: React.Dispatch<React.SetStateAction<any>>
  transactions10ab7Props: any 
  settransactions10ab7Props: React.Dispatch<React.SetStateAction<any>>
  clientnamed83af: any,
  setclientnamed83af:React.Dispatch<React.SetStateAction<any>>
  check1238c5: any,
  setcheck1238c5:React.Dispatch<React.SetStateAction<any>>
  radio12a158: any,
  setradio12a158:React.Dispatch<React.SetStateAction<any>>
  group1a5574: any,
  setgroup1a5574:React.Dispatch<React.SetStateAction<any>>
  card90449: any,
  setcard90449:React.Dispatch<React.SetStateAction<any>>
  areatext565ce: any,
  setareatext565ce:React.Dispatch<React.SetStateAction<any>>
  mobile5fccb: any,
  setmobile5fccb:React.Dispatch<React.SetStateAction<any>>
  check2f409e: any,
  setcheck2f409e:React.Dispatch<React.SetStateAction<any>>
  radio28c1aa: any,
  setradio28c1aa:React.Dispatch<React.SetStateAction<any>>
  group254618: any,
  setgroup254618:React.Dispatch<React.SetStateAction<any>>
  card2f1076: any,
  setcard2f1076:React.Dispatch<React.SetStateAction<any>>
  areatext22664f: any,
  setareatext22664f:React.Dispatch<React.SetStateAction<any>>
  datepicker947d2: any,
  setdatepicker947d2:React.Dispatch<React.SetStateAction<any>>
  datepicker24ce5c: any,
  setdatepicker24ce5c:React.Dispatch<React.SetStateAction<any>>
  save21b74b: any,
  setsave21b74b:React.Dispatch<React.SetStateAction<any>>
  save4565e: any,
  setsave4565e:React.Dispatch<React.SetStateAction<any>>
  billingid842ca: any,
  setbillingid842ca:React.Dispatch<React.SetStateAction<any>>
  billingparty7a9f7: any,
  setbillingparty7a9f7:React.Dispatch<React.SetStateAction<any>>
  transaction_idb85fc: any,
  settransaction_idb85fc:React.Dispatch<React.SetStateAction<any>>
  amount13d15: any,
  setamount13d15:React.Dispatch<React.SetStateAction<any>>
  transaction_type036bb: any,
  settransaction_type036bb:React.Dispatch<React.SetStateAction<any>>

////// screen states 
  showprofile_v1Props: any 
  setshowprofile_v1Props: React.Dispatch<React.SetStateAction<any>>
  transactionsuf_v1Props: any 
  settransactionsuf_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  transactionsdfd_v1Props: any 
  settransactionsdfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  testtablecheck2_v1Props: any 
  settesttablecheck2_v1Props: React.Dispatch<React.SetStateAction<any>>
  vesseldfd_v1Props: any 
  setvesseldfd_v1Props: React.Dispatch<React.SetStateAction<any>>
  v_billingdfd_v1Props: any 
  setv_billingdfd_v1Props: React.Dispatch<React.SetStateAction<any>>

  refetch: any,
  setRefetch: React.Dispatch<React.SetStateAction<any>>
  searchParam: string,
  setSearchParam: React.Dispatch<React.SetStateAction<string>>
  disableParam: any,
  setDisableParam: React.Dispatch<React.SetStateAction<any>>
  globalState: any,
  setGlobalState: React.Dispatch<React.SetStateAction<any>>
  // for all textInput validation
  validate: any,
  setValidate: React.Dispatch<React.SetStateAction<any>>

  //its used for validate once again on button click
  validateRefetch: any,
  setValidateRefetch: React.Dispatch<React.SetStateAction<any>>
  accessProfile:any,
  setAccessProfile:React.Dispatch<React.SetStateAction<any>>
  memoryVariables:any
  setMemoryVariables:React.Dispatch<React.SetStateAction<any>>
  property:any
  setProperty:React.Dispatch<React.SetStateAction<any>>
  triggerRefresh: () => void,
  refresh: any ,
  setRefresh: React.Dispatch<React.SetStateAction<any>>
  lockedData: any,
  setLockedData: React.Dispatch<React.SetStateAction<any>>
  eventEmitterData:any,
  setEventEmitterData:React.Dispatch<React.SetStateAction<any>>
  userDetails:any,
  setUserDetails:React.Dispatch<React.SetStateAction<any>>
  encAppFalg:any,
  setEncAppFalg:React.Dispatch<React.SetStateAction<any>>,
  selectedTheme: RealTheme,
  setSelectedTheme: React.Dispatch<React.SetStateAction<RealTheme>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
      //////////
        const [formdaeb3, setformdaeb3 ] = React.useState<any>({}) 
    const [formdaeb3Props, setformdaeb3Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [postgres7f5c4, setpostgres7f5c4 ] = React.useState<any>([]) 
    const [postgres7f5c4Props, setpostgres7f5c4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
    
    const [transactions10ab7, settransactions10ab7 ] = React.useState<any>([]) 
    const [transactions10ab7Props, settransactions10ab7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
   const [clientnamed83af,setclientnamed83af] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [check1238c5,setcheck1238c5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [radio12a158,setradio12a158] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [group1a5574,setgroup1a5574] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card90449,setcard90449] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [areatext565ce,setareatext565ce] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [mobile5fccb,setmobile5fccb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [check2f409e,setcheck2f409e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [radio28c1aa,setradio28c1aa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [group254618,setgroup254618] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card2f1076,setcard2f1076] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [areatext22664f,setareatext22664f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [datepicker947d2,setdatepicker947d2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [datepicker24ce5c,setdatepicker24ce5c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save21b74b,setsave21b74b] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save4565e,setsave4565e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [billingid842ca,setbillingid842ca] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [billingparty7a9f7,setbillingparty7a9f7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_idb85fc,settransaction_idb85fc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [amount13d15,setamount13d15] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transaction_type036bb,settransaction_type036bb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       textinputclientnamed83af:false,
       checkboxcheck1238c5:false,
       radiobuttonradio12a158:false,
       radiogroupgroup1a5574:false,
       cardcard90449:false,
       textareaareatext565ce:false,
       textinputmobile5fccb:false,
       checkboxcheck2f409e:false,
       radiobuttonradio28c1aa:false,
       radiogroupgroup254618:false,
       cardcard2f1076:false,
       textareaareatext22664f:false,
       datepickerdatePicker947d2:false,
       datepickerdatepicker24ce5c:false,
       buttonsave21b74b:false,
       buttonsave4565e:false,
       columnbillingid842ca:false,
       columnbillingparty7a9f7:false,
       columntransaction_idb85fc:false,
       columnamount13d15:false,
       columntransaction_type036bb:false,
       groupformdaeb3:false,
       tablepostgres7f5c4:false,
       tabletransactions10ab7:false,
      })

  ////// screen states 
   const [showprofile_v1Props,setshowprofile_v1Props] = React.useState<any>([])
   const [transactionsuf_v1Props,settransactionsuf_v1Props] = React.useState<any>([])

///////// dfd
  const [transactionsdfd_v1Props,settransactionsdfd_v1Props] = React.useState<any>([])
  const [testtablecheck2_v1Props,settesttablecheck2_v1Props] = React.useState<any>([])
  const [vesseldfd_v1Props,setvesseldfd_v1Props] = React.useState<any>([])
  const [v_billingdfd_v1Props,setv_billingdfd_v1Props] = React.useState<any>([])
    const [searchParam , setSearchParam] = React.useState<string>("")
    const [disableParam , setDisableParam] = React.useState<any>({})
    const [globalState , setGlobalState] = React.useState<any>({})
    const [refetch, setRefetch] = React.useState<any>(false)
    const [validate, setValidate] = React.useState<any>({});
    const [validateRefetch, setValidateRefetch] = React.useState<any>({
      value:false,
      init:0
    })
    const [accessProfile, setAccessProfile] = React.useState<any>([])
    const [property, setProperty] = React.useState<any>({})
    const [memoryVariables, setMemoryVariables] = React.useState<any>({})
    const [lockedData, setLockedData] = React.useState<any>({})

    const [eventEmitterData,setEventEmitterData] = React.useState<any>([])
    const [userDetails , setUserDetails] = React.useState<any>({})
    const [encAppFalg , setEncAppFalg] = React.useState<any>({})
    const theme = getCookie('cfg_theme')
    const [selectedTheme , setSelectedTheme] = React.useState<RealTheme>(theme || "")
    
    
  return (
    <TotalContext.Provider 
      value={
      {
      //
        formdaeb3, 
        setformdaeb3,
        formdaeb3Props, 
        setformdaeb3Props,
        postgres7f5c4, 
        setpostgres7f5c4,
        postgres7f5c4Props, 
        setpostgres7f5c4Props,
        transactions10ab7, 
        settransactions10ab7,
        transactions10ab7Props, 
        settransactions10ab7Props,
        clientnamed83af,
        setclientnamed83af, 
        check1238c5,
        setcheck1238c5, 
        radio12a158,
        setradio12a158, 
        group1a5574,
        setgroup1a5574, 
        card90449,
        setcard90449, 
        areatext565ce,
        setareatext565ce, 
        mobile5fccb,
        setmobile5fccb, 
        check2f409e,
        setcheck2f409e, 
        radio28c1aa,
        setradio28c1aa, 
        group254618,
        setgroup254618, 
        card2f1076,
        setcard2f1076, 
        areatext22664f,
        setareatext22664f, 
        datepicker947d2,
        setdatepicker947d2, 
        datepicker24ce5c,
        setdatepicker24ce5c, 
        save21b74b,
        setsave21b74b, 
        save4565e,
        setsave4565e, 
        billingid842ca,
        setbillingid842ca, 
        billingparty7a9f7,
        setbillingparty7a9f7, 
        transaction_idb85fc,
        settransaction_idb85fc, 
        amount13d15,
        setamount13d15, 
        transaction_type036bb,
        settransaction_type036bb, 
        ////// screen states 
          showprofile_v1Props,
          setshowprofile_v1Props,
          transactionsuf_v1Props,
          settransactionsuf_v1Props,
        //////////

        ///////// dfd
        transactionsdfd_v1Props,
        settransactionsdfd_v1Props,
        testtablecheck2_v1Props,
        settesttablecheck2_v1Props,
        vesseldfd_v1Props,
        setvesseldfd_v1Props,
        v_billingdfd_v1Props,
        setv_billingdfd_v1Props,
        refetch,
        setRefetch,
        searchParam,
        setSearchParam,
        disableParam,
        setDisableParam,
        globalState,
        setGlobalState,
        validate,
        setValidate,
        validateRefetch,
        setValidateRefetch,
        accessProfile,
        setAccessProfile,
        property,
        setProperty,
        setRefresh,
        refresh,
        memoryVariables,
        setMemoryVariables,
        lockedData,
        setLockedData,
        eventEmitterData,
        setEventEmitterData,
        userDetails,
        setUserDetails,
        encAppFalg,
        setEncAppFalg,
        selectedTheme, 
        setSelectedTheme
        }}
      >
      {children}
    </TotalContext.Provider>
  )
}

export default GlobalContext