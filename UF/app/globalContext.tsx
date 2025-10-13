


"use client"
import { RealTheme } from '@gravity-ui/uikit'
import React from 'react'
import { getCookie } from './components/cookieMgment'
export interface TotalContextProps {
  main6d2c7: any 
  setmain6d2c7: React.Dispatch<React.SetStateAction<any>>
  main6d2c7Props: any 
  setmain6d2c7Props: React.Dispatch<React.SetStateAction<any>>
  groupad476b: any 
  setgroupad476b: React.Dispatch<React.SetStateAction<any>>
  groupad476bProps: any 
  setgroupad476bProps: React.Dispatch<React.SetStateAction<any>>
  groupb66b0d: any 
  setgroupb66b0d: React.Dispatch<React.SetStateAction<any>>
  groupb66b0dProps: any 
  setgroupb66b0dProps: React.Dispatch<React.SetStateAction<any>>
  groupc59a19: any 
  setgroupc59a19: React.Dispatch<React.SetStateAction<any>>
  groupc59a19Props: any 
  setgroupc59a19Props: React.Dispatch<React.SetStateAction<any>>
  groupde191f: any 
  setgroupde191f: React.Dispatch<React.SetStateAction<any>>
  groupde191fProps: any 
  setgroupde191fProps: React.Dispatch<React.SetStateAction<any>>
  root: any,
  setroot:React.Dispatch<React.SetStateAction<any>>
  rootProps: any 
  setrootProps: React.Dispatch<React.SetStateAction<any>>
  namefcda5: any,
  setnamefcda5:React.Dispatch<React.SetStateAction<any>>
  namefcda5Props: any 
  setnamefcda5Props: React.Dispatch<React.SetStateAction<any>>
  age9919a: any,
  setage9919a:React.Dispatch<React.SetStateAction<any>>
  age9919aProps: any 
  setage9919aProps: React.Dispatch<React.SetStateAction<any>>
  save99cfb: any,
  setsave99cfb:React.Dispatch<React.SetStateAction<any>>
  save99cfbProps: any 
  setsave99cfbProps: React.Dispatch<React.SetStateAction<any>>
  address332cb: any,
  setaddress332cb:React.Dispatch<React.SetStateAction<any>>
  address332cbProps: any 
  setaddress332cbProps: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  forpfcheckuf_v1Props: any 
  setforpfcheckuf_v1Props: React.Dispatch<React.SetStateAction<any>>

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
        const [main6d2c7, setmain6d2c7 ] = React.useState<any>({}) 
    const [main6d2c7Props, setmain6d2c7Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [groupad476b, setgroupad476b ] = React.useState<any>({}) 
    const [groupad476bProps, setgroupad476bProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [groupb66b0d, setgroupb66b0d ] = React.useState<any>({}) 
    const [groupb66b0dProps, setgroupb66b0dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [groupc59a19, setgroupc59a19 ] = React.useState<any>({}) 
    const [groupc59a19Props, setgroupc59a19Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [groupde191f, setgroupde191f ] = React.useState<any>({}) 
    const [groupde191fProps, setgroupde191fProps ] = React.useState<any>({
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
   const [namefcda5,setnamefcda5] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [age9919a,setage9919a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save99cfb,setsave99cfb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [address332cb,setaddress332cb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       Canvasroot:false,
       textinputnamefcda5:false,
       textinputage9919a:false,
       buttonsave99cfb:false,
       textareaaddress332cb:false,
       groupmain6d2c7:false,
       groupgroupAd476b:false,
       groupgroupB66b0d:false,
       groupgroupC59a19:false,
       groupgroupDe191f:false,
      })

  ////// screen states 
   const [forpfcheckuf_v1Props,setforpfcheckuf_v1Props] = React.useState<any>([])

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
        main6d2c7, 
        setmain6d2c7,
        main6d2c7Props, 
        setmain6d2c7Props,
        groupad476b, 
        setgroupad476b,
        groupad476bProps, 
        setgroupad476bProps,
        groupb66b0d, 
        setgroupb66b0d,
        groupb66b0dProps, 
        setgroupb66b0dProps,
        groupc59a19, 
        setgroupc59a19,
        groupc59a19Props, 
        setgroupc59a19Props,
        groupde191f, 
        setgroupde191f,
        groupde191fProps, 
        setgroupde191fProps,
        root,
        setroot, 
        namefcda5,
        setnamefcda5, 
        age9919a,
        setage9919a, 
        save99cfb,
        setsave99cfb, 
        address332cb,
        setaddress332cb, 
        ////// screen states 
          forpfcheckuf_v1Props,
          setforpfcheckuf_v1Props,
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