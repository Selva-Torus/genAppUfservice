


"use client"
import { RealTheme } from '@gravity-ui/uikit'
import React from 'react'
import { getCookie } from './components/cookieMgment'
export interface TotalContextProps {
  aaf24: any 
  setaaf24: React.Dispatch<React.SetStateAction<any>>
  aaf24Props: any 
  setaaf24Props: React.Dispatch<React.SetStateAction<any>>
  addd6f6de: any,
  setaddd6f6de:React.Dispatch<React.SetStateAction<any>>
  addd6f6deProps: any 
  setaddd6f6deProps: React.Dispatch<React.SetStateAction<any>>
//   6653a: any,
//   set6653a:React.Dispatch<React.SetStateAction<any>>
//   6653aProps: any 
//   set6653aProps: React.Dispatch<React.SetStateAction<any>>

// ////// screen states 
//   oprmatrixuf_v1Props: any 
//   setoprmatrixuf_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd

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
        const [aaf24, setaaf24 ] = React.useState<any>({}) 
    const [aaf24Props, setaaf24Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [addd6f6de,setaddd6f6de] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
  //  const [6653a,set6653a] = React.useState<any>({
  //   isDisabled: false,
  //   presetValues: '',
  //   isHidden: false,
  //   refetch:false,
  //   refresh:false,
  //   }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       buttonAddd6f6de:false,
       textinput6653a:false,
       groupaaf24:false,
      })

  ////// screen states 
   const [oprmatrixuf_v1Props,setoprmatrixuf_v1Props] = React.useState<any>([])

///////// dfd
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
        aaf24, 
        setaaf24,
        aaf24Props, 
        setaaf24Props,
        addd6f6de,
        setaddd6f6de, 
        // 6653a,
        // set6653a, 
        ////// screen states 
          oprmatrixuf_v1Props,
          setoprmatrixuf_v1Props,
        //////////

        ///////// dfd
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