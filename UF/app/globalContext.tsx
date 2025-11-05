


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
  group23b6cd: any 
  setgroup23b6cd: React.Dispatch<React.SetStateAction<any>>
  group23b6cdProps: any 
  setgroup23b6cdProps: React.Dispatch<React.SetStateAction<any>>
  save1f20e: any,
  setsave1f20e:React.Dispatch<React.SetStateAction<any>>
  save1f20eProps: any 
  setsave1f20eProps: React.Dispatch<React.SetStateAction<any>>
  nameed81e: any,
  setnameed81e:React.Dispatch<React.SetStateAction<any>>
  nameed81eProps: any 
  setnameed81eProps: React.Dispatch<React.SetStateAction<any>>
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
  viewdoc074a4: any,
  setviewdoc074a4:React.Dispatch<React.SetStateAction<any>>
  viewdoc074a4Props: any 
  setviewdoc074a4Props: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  myuf_v1Props: any 
  setmyuf_v1Props: React.Dispatch<React.SetStateAction<any>>

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
        const [group23b6cd, setgroup23b6cd ] = React.useState<any>({}) 
    const [group23b6cdProps, setgroup23b6cdProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [save1f20e,setsave1f20e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [nameed81e,setnameed81e] = React.useState<any>({
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
   const [viewdoc074a4,setviewdoc074a4] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       buttonsave1f20e:false,
       documentuploadernameed81e:false,
       columntabledata_id59734:false,
       columnname067a9:false,
       columnagec2723:false,
       documentviewerviewdoc074a4:false,
       groupgroupe162d:false,
       tablemytabled34a7:false,
       groupgroup23b6cd:false,
      })

  ////// screen states 
   const [myuf_v1Props,setmyuf_v1Props] = React.useState<any>([])

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
        group23b6cd, 
        setgroup23b6cd,
        group23b6cdProps, 
        setgroup23b6cdProps,
        save1f20e,
        setsave1f20e, 
        nameed81e,
        setnameed81e, 
        tabledata_id59734,
        settabledata_id59734, 
        name067a9,
        setname067a9, 
        agec2723,
        setagec2723, 
        viewdoc074a4,
        setviewdoc074a4, 
        ////// screen states 
          myuf_v1Props,
          setmyuf_v1Props,
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