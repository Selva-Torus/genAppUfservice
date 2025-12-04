


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  ais_groupbe189: any 
  setais_groupbe189: React.Dispatch<React.SetStateAction<any>>
  ais_groupbe189Props: any 
  setais_groupbe189Props: React.Dispatch<React.SetStateAction<any>>
  get_accounts1a859: any 
  setget_accounts1a859: React.Dispatch<React.SetStateAction<any>>
  get_accounts1a859Props: any 
  setget_accounts1a859Props: React.Dispatch<React.SetStateAction<any>>
  ais_label68093: any,
  setais_label68093:React.Dispatch<React.SetStateAction<any>>
  ais_label68093Props: any 
  setais_label68093Props: React.Dispatch<React.SetStateAction<any>>
  type16590: any,
  settype16590:React.Dispatch<React.SetStateAction<any>>
  type16590Props: any 
  settype16590Props: React.Dispatch<React.SetStateAction<any>>
  baseconsentid56ba8: any,
  setbaseconsentid56ba8:React.Dispatch<React.SetStateAction<any>>
  baseconsentid56ba8Props: any 
  setbaseconsentid56ba8Props: React.Dispatch<React.SetStateAction<any>>
  expirationdatetime2cbfb: any,
  setexpirationdatetime2cbfb:React.Dispatch<React.SetStateAction<any>>
  expirationdatetime2cbfbProps: any 
  setexpirationdatetime2cbfbProps: React.Dispatch<React.SetStateAction<any>>
  transactionfromdatetimeaa64f: any,
  settransactionfromdatetimeaa64f:React.Dispatch<React.SetStateAction<any>>
  transactionfromdatetimeaa64fProps: any 
  settransactionfromdatetimeaa64fProps: React.Dispatch<React.SetStateAction<any>>
  transactiontodatetime00c33: any,
  settransactiontodatetime00c33:React.Dispatch<React.SetStateAction<any>>
  transactiontodatetime00c33Props: any 
  settransactiontodatetime00c33Props: React.Dispatch<React.SetStateAction<any>>
  accountidb7d92: any,
  setaccountidb7d92:React.Dispatch<React.SetStateAction<any>>
  accountidb7d92Props: any 
  setaccountidb7d92Props: React.Dispatch<React.SetStateAction<any>>
  accounttypefc49d: any,
  setaccounttypefc49d:React.Dispatch<React.SetStateAction<any>>
  accounttypefc49dProps: any 
  setaccounttypefc49dProps: React.Dispatch<React.SetStateAction<any>>
  accountsubtypeb9399: any,
  setaccountsubtypeb9399:React.Dispatch<React.SetStateAction<any>>
  accountsubtypeb9399Props: any 
  setaccountsubtypeb9399Props: React.Dispatch<React.SetStateAction<any>>
  tradingname22dd3: any,
  settradingname22dd3:React.Dispatch<React.SetStateAction<any>>
  tradingname22dd3Props: any 
  settradingname22dd3Props: React.Dispatch<React.SetStateAction<any>>
  legalnamebccff: any,
  setlegalnamebccff:React.Dispatch<React.SetStateAction<any>>
  legalnamebccffProps: any 
  setlegalnamebccffProps: React.Dispatch<React.SetStateAction<any>>
  identifiertype37db2: any,
  setidentifiertype37db2:React.Dispatch<React.SetStateAction<any>>
  identifiertype37db2Props: any 
  setidentifiertype37db2Props: React.Dispatch<React.SetStateAction<any>>
  identifiera6abf: any,
  setidentifiera6abf:React.Dispatch<React.SetStateAction<any>>
  identifiera6abfProps: any 
  setidentifiera6abfProps: React.Dispatch<React.SetStateAction<any>>
  consentida3e0f: any,
  setconsentida3e0f:React.Dispatch<React.SetStateAction<any>>
  consentida3e0fProps: any 
  setconsentida3e0fProps: React.Dispatch<React.SetStateAction<any>>
  apiname543a3: any,
  setapiname543a3:React.Dispatch<React.SetStateAction<any>>
  apiname543a3Props: any 
  setapiname543a3Props: React.Dispatch<React.SetStateAction<any>>
  permissionsf74a7: any,
  setpermissionsf74a7:React.Dispatch<React.SetStateAction<any>>
  permissionsf74a7Props: any 
  setpermissionsf74a7Props: React.Dispatch<React.SetStateAction<any>>
  usertype218a1: any,
  setusertype218a1:React.Dispatch<React.SetStateAction<any>>
  usertype218a1Props: any 
  setusertype218a1Props: React.Dispatch<React.SetStateAction<any>>
  purpose3c50a: any,
  setpurpose3c50a:React.Dispatch<React.SetStateAction<any>>
  purpose3c50aProps: any 
  setpurpose3c50aProps: React.Dispatch<React.SetStateAction<any>>
  urle0b3a: any,
  seturle0b3a:React.Dispatch<React.SetStateAction<any>>
  urle0b3aProps: any 
  seturle0b3aProps: React.Dispatch<React.SetStateAction<any>>
  call_get_accounts51bce: any,
  setcall_get_accounts51bce:React.Dispatch<React.SetStateAction<any>>
  call_get_accounts51bceProps: any 
  setcall_get_accounts51bceProps: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  vob_get_accounts_consents_v1Props: any 
  setvob_get_accounts_consents_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_codedescription_v1Props: any 
  setdfd_codedescription_v1Props: React.Dispatch<React.SetStateAction<any>>

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
  paginationDetails: any,
  setpaginationDetails: React.Dispatch<React.SetStateAction<any>>
  eventEmitterData:any,
  setEventEmitterData:React.Dispatch<React.SetStateAction<any>>
  userDetails:any,
  setUserDetails:React.Dispatch<React.SetStateAction<any>>
  encAppFalg:any,
  setEncAppFalg:React.Dispatch<React.SetStateAction<any>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
      //////////
        const [ais_groupbe189, setais_groupbe189 ] = React.useState<any>({}) 
    const [ais_groupbe189Props, setais_groupbe189Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [get_accounts1a859, setget_accounts1a859 ] = React.useState<any>({}) 
    const [get_accounts1a859Props, setget_accounts1a859Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [ais_label68093,setais_label68093] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [type16590,settype16590] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [baseconsentid56ba8,setbaseconsentid56ba8] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [expirationdatetime2cbfb,setexpirationdatetime2cbfb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transactionfromdatetimeaa64f,settransactionfromdatetimeaa64f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [transactiontodatetime00c33,settransactiontodatetime00c33] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [accountidb7d92,setaccountidb7d92] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [accounttypefc49d,setaccounttypefc49d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [accountsubtypeb9399,setaccountsubtypeb9399] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tradingname22dd3,settradingname22dd3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [legalnamebccff,setlegalnamebccff] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [identifiertype37db2,setidentifiertype37db2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [identifiera6abf,setidentifiera6abf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [consentida3e0f,setconsentida3e0f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [apiname543a3,setapiname543a3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [permissionsf74a7,setpermissionsf74a7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [usertype218a1,setusertype218a1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [purpose3c50a,setpurpose3c50a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [urle0b3a,seturle0b3a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [call_get_accounts51bce,setcall_get_accounts51bce] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       labelais_label68093:false,
       dropdowntype16590:false,
       textinputBaseConsentId56ba8:false,
       datepickerExpirationDateTime2cbfb:false,
       datepickerTransactionFromDateTimeaa64f:false,
       datepickerTransactionToDateTime00c33:false,
       textinputAccountIdb7d92:false,
       dropdownaccounttypefc49d:false,
       dropdownaccountsubtypeb9399:false,
       textinputTradingName22dd3:false,
       textinputLegalNamebccff:false,
       dropdownIdentifierType37db2:false,
       textinputIdentifiera6abf:false,
       textinputConsentIda3e0f:false,
       dropdownapiname543a3:false,
       dropdownpermissionsf74a7:false,
       dropdownUserType218a1:false,
       dropdownPurpose3c50a:false,
       textinputUrle0b3a:false,
       buttonCall_Get_Accounts51bce:false,
       groupais_groupbe189:false,
       groupGet_Accounts1a859:false,
      })

  ////// screen states 
   const [vob_get_accounts_consents_v1Props,setvob_get_accounts_consents_v1Props] = React.useState<any>([])

///////// dfd
  const [dfd_codedescription_v1Props,setdfd_codedescription_v1Props] = React.useState<any>([])
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
    const [paginationDetails, setpaginationDetails] = React.useState<any>({})

    const [eventEmitterData,setEventEmitterData] = React.useState<any>([])
    const [userDetails , setUserDetails] = React.useState<any>({})
    const [encAppFalg , setEncAppFalg] = React.useState<any>({})
    const theme = getCookie('cfg_theme')
    
    
  return (
    <TotalContext.Provider 
      value={
      {
      //
        ais_groupbe189, 
        setais_groupbe189,
        ais_groupbe189Props, 
        setais_groupbe189Props,
        get_accounts1a859, 
        setget_accounts1a859,
        get_accounts1a859Props, 
        setget_accounts1a859Props,
        ais_label68093,
        setais_label68093, 
        type16590,
        settype16590, 
        baseconsentid56ba8,
        setbaseconsentid56ba8, 
        expirationdatetime2cbfb,
        setexpirationdatetime2cbfb, 
        transactionfromdatetimeaa64f,
        settransactionfromdatetimeaa64f, 
        transactiontodatetime00c33,
        settransactiontodatetime00c33, 
        accountidb7d92,
        setaccountidb7d92, 
        accounttypefc49d,
        setaccounttypefc49d, 
        accountsubtypeb9399,
        setaccountsubtypeb9399, 
        tradingname22dd3,
        settradingname22dd3, 
        legalnamebccff,
        setlegalnamebccff, 
        identifiertype37db2,
        setidentifiertype37db2, 
        identifiera6abf,
        setidentifiera6abf, 
        consentida3e0f,
        setconsentida3e0f, 
        apiname543a3,
        setapiname543a3, 
        permissionsf74a7,
        setpermissionsf74a7, 
        usertype218a1,
        setusertype218a1, 
        purpose3c50a,
        setpurpose3c50a, 
        urle0b3a,
        seturle0b3a, 
        call_get_accounts51bce,
        setcall_get_accounts51bce, 
        ////// screen states 
          vob_get_accounts_consents_v1Props,
          setvob_get_accounts_consents_v1Props,
        //////////

        ///////// dfd
        dfd_codedescription_v1Props,
        setdfd_codedescription_v1Props,
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
        paginationDetails,
        setpaginationDetails,
        eventEmitterData,
        setEventEmitterData,
        userDetails,
        setUserDetails,
        encAppFalg,
        setEncAppFalg
        }}
      >
      {children}
    </TotalContext.Provider>
  )
}

export default GlobalContext