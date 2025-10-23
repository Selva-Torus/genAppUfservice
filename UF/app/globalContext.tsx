


"use client"
import { RealTheme } from '@gravity-ui/uikit'
import React from 'react'
import { getCookie } from './components/cookieMgment'
export interface TotalContextProps {
  groupe162d: any 
  setgroupe162d: React.Dispatch<React.SetStateAction<any>>
  groupe162dProps: any 
  setgroupe162dProps: React.Dispatch<React.SetStateAction<any>>
  mytabled34a7: any 
  setmytabled34a7: React.Dispatch<React.SetStateAction<any>>
  mytabled34a7Props: any 
  setmytabled34a7Props: React.Dispatch<React.SetStateAction<any>>
  group5384d: any 
  setgroup5384d: React.Dispatch<React.SetStateAction<any>>
  group5384dProps: any 
  setgroup5384dProps: React.Dispatch<React.SetStateAction<any>>
  r_group358e4: any 
  setr_group358e4: React.Dispatch<React.SetStateAction<any>>
  r_group358e4Props: any 
  setr_group358e4Props: React.Dispatch<React.SetStateAction<any>>
  name57927: any,
  setname57927:React.Dispatch<React.SetStateAction<any>>
  name57927Props: any 
  setname57927Props: React.Dispatch<React.SetStateAction<any>>
  save1f20e: any,
  setsave1f20e:React.Dispatch<React.SetStateAction<any>>
  save1f20eProps: any 
  setsave1f20eProps: React.Dispatch<React.SetStateAction<any>>
  tabledata_id59734: any,
  settabledata_id59734:React.Dispatch<React.SetStateAction<any>>
  tabledata_id59734Props: any 
  settabledata_id59734Props: React.Dispatch<React.SetStateAction<any>>
  name067a9: any,
  setname067a9:React.Dispatch<React.SetStateAction<any>>
  name067a9Props: any 
  setname067a9Props: React.Dispatch<React.SetStateAction<any>>
  agec2723: any,
  setagec2723:React.Dispatch<React.SetStateAction<any>>
  agec2723Props: any 
  setagec2723Props: React.Dispatch<React.SetStateAction<any>>
  save11c8e: any,
  setsave11c8e:React.Dispatch<React.SetStateAction<any>>
  save11c8eProps: any 
  setsave11c8eProps: React.Dispatch<React.SetStateAction<any>>
  buttonreject8b1d9: any,
  setbuttonreject8b1d9:React.Dispatch<React.SetStateAction<any>>
  buttonreject8b1d9Props: any 
  setbuttonreject8b1d9Props: React.Dispatch<React.SetStateAction<any>>
  label0cb72: any,
  setlabel0cb72:React.Dispatch<React.SetStateAction<any>>
  label0cb72Props: any 
  setlabel0cb72Props: React.Dispatch<React.SetStateAction<any>>
  name1ef9f: any,
  setname1ef9f:React.Dispatch<React.SetStateAction<any>>
  name1ef9fProps: any 
  setname1ef9fProps: React.Dispatch<React.SetStateAction<any>>
  age6bba1: any,
  setage6bba1:React.Dispatch<React.SetStateAction<any>>
  age6bba1Props: any 
  setage6bba1Props: React.Dispatch<React.SetStateAction<any>>
  street1e063: any,
  setstreet1e063:React.Dispatch<React.SetStateAction<any>>
  street1e063Props: any 
  setstreet1e063Props: React.Dispatch<React.SetStateAction<any>>
  report1a36d: any,
  setreport1a36d:React.Dispatch<React.SetStateAction<any>>
  report1a36dProps: any 
  setreport1a36dProps: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  myuf_v1Props: any 
  setmyuf_v1Props: React.Dispatch<React.SetStateAction<any>>
  testasample_v1Props: any 
  settestasample_v1Props: React.Dispatch<React.SetStateAction<any>>
  reportcheck_v1Props: any 
  setreportcheck_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_fordfcheck_v1Props: any 
  setdfd_fordfcheck_v1Props: React.Dispatch<React.SetStateAction<any>>

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
  setEncAppFalg:React.Dispatch<React.SetStateAction<any>>,
  selectedTheme: RealTheme,
  setSelectedTheme: React.Dispatch<React.SetStateAction<RealTheme>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
      //////////
        const [groupe162d, setgroupe162d ] = React.useState<any>({}) 
    const [groupe162dProps, setgroupe162dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [mytabled34a7, setmytabled34a7 ] = React.useState<any>([]) 
    const [mytabled34a7Props, setmytabled34a7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [group5384d, setgroup5384d ] = React.useState<any>({}) 
    const [group5384dProps, setgroup5384dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [r_group358e4, setr_group358e4 ] = React.useState<any>({}) 
    const [r_group358e4Props, setr_group358e4Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [name57927,setname57927] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save1f20e,setsave1f20e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [tabledata_id59734,settabledata_id59734] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name067a9,setname067a9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [agec2723,setagec2723] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save11c8e,setsave11c8e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [buttonreject8b1d9,setbuttonreject8b1d9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [label0cb72,setlabel0cb72] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name1ef9f,setname1ef9f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [age6bba1,setage6bba1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [street1e063,setstreet1e063] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [report1a36d,setreport1a36d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       textinputname57927:false,
       buttonsave1f20e:false,
       columntabledata_id59734:false,
       columnname067a9:false,
       columnagec2723:false,
       buttonsave11c8e:false,
       buttonButtonReject8b1d9:false,
       labellabel0cb72:false,
       textinputname1ef9f:false,
       textinputage6bba1:false,
       textinputstreet1e063:false,
       editorreport1a36d:false,
       groupgroupe162d:false,
       tablemytabled34a7:false,
       groupgroup5384d:false,
       groupr_group358e4:false,
      })

  ////// screen states 
   const [myuf_v1Props,setmyuf_v1Props] = React.useState<any>([])
   const [testasample_v1Props,settestasample_v1Props] = React.useState<any>([])
   const [reportcheck_v1Props,setreportcheck_v1Props] = React.useState<any>([])

///////// dfd
  const [dfd_fordfcheck_v1Props,setdfd_fordfcheck_v1Props] = React.useState<any>([])
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
    const [selectedTheme , setSelectedTheme] = React.useState<RealTheme>(theme || "")
    
    
  return (
    <TotalContext.Provider 
      value={
      {
      //
        groupe162d, 
        setgroupe162d,
        groupe162dProps, 
        setgroupe162dProps,
        mytabled34a7, 
        setmytabled34a7,
        mytabled34a7Props, 
        setmytabled34a7Props,
        group5384d, 
        setgroup5384d,
        group5384dProps, 
        setgroup5384dProps,
        r_group358e4, 
        setr_group358e4,
        r_group358e4Props, 
        setr_group358e4Props,
        name57927,
        setname57927, 
        save1f20e,
        setsave1f20e, 
        tabledata_id59734,
        settabledata_id59734, 
        name067a9,
        setname067a9, 
        agec2723,
        setagec2723, 
        save11c8e,
        setsave11c8e, 
        buttonreject8b1d9,
        setbuttonreject8b1d9, 
        label0cb72,
        setlabel0cb72, 
        name1ef9f,
        setname1ef9f, 
        age6bba1,
        setage6bba1, 
        street1e063,
        setstreet1e063, 
        report1a36d,
        setreport1a36d, 
        ////// screen states 
          myuf_v1Props,
          setmyuf_v1Props,
          testasample_v1Props,
          settestasample_v1Props,
          reportcheck_v1Props,
          setreportcheck_v1Props,
        //////////

        ///////// dfd
        dfd_fordfcheck_v1Props,
        setdfd_fordfcheck_v1Props,
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