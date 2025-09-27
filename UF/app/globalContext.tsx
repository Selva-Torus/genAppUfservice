


"use client"
import { RealTheme } from '@gravity-ui/uikit'
import React from 'react'
import { getCookie } from './components/cookieMgment'
export interface TotalContextProps {
  forma62ff: any 
  setforma62ff: React.Dispatch<React.SetStateAction<any>>
  forma62ffProps: any 
  setforma62ffProps: React.Dispatch<React.SetStateAction<any>>
  root: any,
  setroot:React.Dispatch<React.SetStateAction<any>>
  rootProps: any 
  setrootProps: React.Dispatch<React.SetStateAction<any>>
  name8eedd: any,
  setname8eedd:React.Dispatch<React.SetStateAction<any>>
  name8eeddProps: any 
  setname8eeddProps: React.Dispatch<React.SetStateAction<any>>
  age7d25a: any,
  setage7d25a:React.Dispatch<React.SetStateAction<any>>
  age7d25aProps: any 
  setage7d25aProps: React.Dispatch<React.SetStateAction<any>>
  save3d5e3: any,
  setsave3d5e3:React.Dispatch<React.SetStateAction<any>>
  save3d5e3Props: any 
  setsave3d5e3Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  userform_v1Props: any 
  setuserform_v1Props: React.Dispatch<React.SetStateAction<any>>

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
        const [forma62ff, setforma62ff ] = React.useState<any>({}) 
    const [forma62ffProps, setforma62ffProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [root,setroot] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name8eedd,setname8eedd] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [age7d25a,setage7d25a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save3d5e3,setsave3d5e3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       Canvasroot:false,
       textinputname8eedd:false,
       textinputage7d25a:false,
       buttonsave3d5e3:false,
       groupforma62ff:false,
      })

  ////// screen states 
   const [userform_v1Props,setuserform_v1Props] = React.useState<any>([])

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
        forma62ff, 
        setforma62ff,
        forma62ffProps, 
        setforma62ffProps,
        root,
        setroot, 
        name8eedd,
        setname8eedd, 
        age7d25a,
        setage7d25a, 
        save3d5e3,
        setsave3d5e3, 
        ////// screen states 
          userform_v1Props,
          setuserform_v1Props,
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