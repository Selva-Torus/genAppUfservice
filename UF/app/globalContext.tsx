


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  overall05a6d: any 
  setoverall05a6d: React.Dispatch<React.SetStateAction<any>>
  overall05a6dProps: any 
  setoverall05a6dProps: React.Dispatch<React.SetStateAction<any>>
  table5cf93: any 
  settable5cf93: React.Dispatch<React.SetStateAction<any>>
  table5cf93Props: any 
  settable5cf93Props: React.Dispatch<React.SetStateAction<any>>
  groupaaf24: any 
  setgroupaaf24: React.Dispatch<React.SetStateAction<any>>
  groupaaf24Props: any 
  setgroupaaf24Props: React.Dispatch<React.SetStateAction<any>>
  group7bc2c: any 
  setgroup7bc2c: React.Dispatch<React.SetStateAction<any>>
  group7bc2cProps: any 
  setgroup7bc2cProps: React.Dispatch<React.SetStateAction<any>>
  card119379: any,
  setcard119379:React.Dispatch<React.SetStateAction<any>>
  card119379Props: any 
  setcard119379Props: React.Dispatch<React.SetStateAction<any>>
  card234061: any,
  setcard234061:React.Dispatch<React.SetStateAction<any>>
  card234061Props: any 
  setcard234061Props: React.Dispatch<React.SetStateAction<any>>
  card31630c: any,
  setcard31630c:React.Dispatch<React.SetStateAction<any>>
  card31630cProps: any 
  setcard31630cProps: React.Dispatch<React.SetStateAction<any>>
  card480a32: any,
  setcard480a32:React.Dispatch<React.SetStateAction<any>>
  card480a32Props: any 
  setcard480a32Props: React.Dispatch<React.SetStateAction<any>>
  card5e0759: any,
  setcard5e0759:React.Dispatch<React.SetStateAction<any>>
  card5e0759Props: any 
  setcard5e0759Props: React.Dispatch<React.SetStateAction<any>>
  bar9c49f: any,
  setbar9c49f:React.Dispatch<React.SetStateAction<any>>
  bar9c49fProps: any 
  setbar9c49fProps: React.Dispatch<React.SetStateAction<any>>
  pie5e484: any,
  setpie5e484:React.Dispatch<React.SetStateAction<any>>
  pie5e484Props: any 
  setpie5e484Props: React.Dispatch<React.SetStateAction<any>>
  newtransd00f3: any,
  setnewtransd00f3:React.Dispatch<React.SetStateAction<any>>
  newtransd00f3Props: any 
  setnewtransd00f3Props: React.Dispatch<React.SetStateAction<any>>
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
  openbanking_v1Props: any 
  setopenbanking_v1Props: React.Dispatch<React.SetStateAction<any>>
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
        const [overall05a6d, setoverall05a6d ] = React.useState<any>({}) 
    const [overall05a6dProps, setoverall05a6dProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [table5cf93, settable5cf93 ] = React.useState<any>([]) 
    const [table5cf93Props, settable5cf93Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
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
   const [card119379,setcard119379] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card234061,setcard234061] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card31630c,setcard31630c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card480a32,setcard480a32] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [card5e0759,setcard5e0759] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [bar9c49f,setbar9c49f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pie5e484,setpie5e484] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [newtransd00f3,setnewtransd00f3] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
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
    const [refresh, setRefresh] = React.useState<any>({       cardcard119379:false,
       cardcard234061:false,
       cardcard31630c:false,
       cardcard480a32:false,
       cardcard5e0759:false,
       barchartbar9c49f:false,
       piechartpie5e484:false,
       columnnewtransd00f3:false,
       buttonAddd6f6de:false,
       textinputwefdwfds735d5:false,
       buttondfdsfdsb8f34:false,
       documentuploadercsdcsdcsd4b217:false,
       groupoverall05a6d:false,
       tabletable5cf93:false,
       groupgroupaaf24:false,
       groupgroup7bc2c:false,
      })

  ////// screen states 
   const [openbanking_v1Props,setopenbanking_v1Props] = React.useState<any>([])
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
        overall05a6d, 
        setoverall05a6d,
        overall05a6dProps, 
        setoverall05a6dProps,
        table5cf93, 
        settable5cf93,
        table5cf93Props, 
        settable5cf93Props,
        groupaaf24, 
        setgroupaaf24,
        groupaaf24Props, 
        setgroupaaf24Props,
        group7bc2c, 
        setgroup7bc2c,
        group7bc2cProps, 
        setgroup7bc2cProps,
        card119379,
        setcard119379, 
        card234061,
        setcard234061, 
        card31630c,
        setcard31630c, 
        card480a32,
        setcard480a32, 
        card5e0759,
        setcard5e0759, 
        bar9c49f,
        setbar9c49f, 
        pie5e484,
        setpie5e484, 
        newtransd00f3,
        setnewtransd00f3, 
        addd6f6de,
        setaddd6f6de, 
        wefdwfds735d5,
        setwefdwfds735d5, 
        dfdsfdsb8f34,
        setdfdsfdsb8f34, 
        csdcsdcsd4b217,
        setcsdcsdcsd4b217, 
        ////// screen states 
          openbanking_v1Props,
          setopenbanking_v1Props,
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