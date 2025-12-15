


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  groupaaf24: any 
  setgroupaaf24: React.Dispatch<React.SetStateAction<any>>
  groupaaf24Props: any 
  setgroupaaf24Props: React.Dispatch<React.SetStateAction<any>>
  group7bc2c: any 
  setgroup7bc2c: React.Dispatch<React.SetStateAction<any>>
  group7bc2cProps: any 
  setgroup7bc2cProps: React.Dispatch<React.SetStateAction<any>>
  addd6f6de: any,
  setaddd6f6de:React.Dispatch<React.SetStateAction<any>>
  addd6f6deProps: any 
  setaddd6f6deProps: React.Dispatch<React.SetStateAction<any>>
  wefdwfds735d5: any,
  setwefdwfds735d5:React.Dispatch<React.SetStateAction<any>>
  wefdwfds735d5Props: any 
  setwefdwfds735d5Props: React.Dispatch<React.SetStateAction<any>>
  dfdsfdsb8f34: any,
  setdfdsfdsb8f34:React.Dispatch<React.SetStateAction<any>>
  dfdsfdsb8f34Props: any 
  setdfdsfdsb8f34Props: React.Dispatch<React.SetStateAction<any>>
  csdcsdcsd4b217: any,
  setcsdcsdcsd4b217:React.Dispatch<React.SetStateAction<any>>
  csdcsdcsd4b217Props: any 
  setcsdcsdcsd4b217Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  oprmatrixuf_v1Props: any 
  setoprmatrixuf_v1Props: React.Dispatch<React.SetStateAction<any>>

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
  setEncAppFalg:React.Dispatch<React.SetStateAction<any>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
      //////////
        const [groupaaf24, setgroupaaf24 ] = React.useState<any>({}) 
    const [groupaaf24Props, setgroupaaf24Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [group7bc2c, setgroup7bc2c ] = React.useState<any>({}) 
    const [group7bc2cProps, setgroup7bc2cProps ] = React.useState<any>({
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
   const [wefdwfds735d5,setwefdwfds735d5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [dfdsfdsb8f34,setdfdsfdsb8f34] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [csdcsdcsd4b217,setcsdcsdcsd4b217] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       buttonAddd6f6de:false,
       textinputwefdwfds735d5:false,
       buttondfdsfdsb8f34:false,
       documentuploadercsdcsdcsd4b217:false,
       groupgroupaaf24:false,
       groupgroup7bc2c:false,
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
    
    
  return (
    <TotalContext.Provider 
      value={
      {
      //
        groupaaf24, 
        setgroupaaf24,
        groupaaf24Props, 
        setgroupaaf24Props,
        group7bc2c, 
        setgroup7bc2c,
        group7bc2cProps, 
        setgroup7bc2cProps,
        addd6f6de,
        setaddd6f6de, 
        wefdwfds735d5,
        setwefdwfds735d5, 
        dfdsfdsb8f34,
        setdfdsfdsb8f34, 
        csdcsdcsd4b217,
        setcsdcsdcsd4b217, 
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
        setEncAppFalg
        }}
      >
      {children}
    </TotalContext.Provider>
  )
}

export default GlobalContext