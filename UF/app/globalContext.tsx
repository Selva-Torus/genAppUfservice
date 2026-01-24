


"use client"
import React from 'react';
import { getCookie } from './components/cookieMgment';
export interface TotalContextProps {
  currentToken: any 
  setCurrentToken: React.Dispatch<React.SetStateAction<any>>
  matchedAccessProfileData: any;
  setMatchedAccessProfileData: React.Dispatch<any>
  groupbffe9: any 
  setgroupbffe9: React.Dispatch<React.SetStateAction<any>>
  groupbffe9Props: any 
  setgroupbffe9Props: React.Dispatch<React.SetStateAction<any>>
  usertable8d993: any 
  setusertable8d993: React.Dispatch<React.SetStateAction<any>>
  usertable8d993Props: any 
  setusertable8d993Props: React.Dispatch<React.SetStateAction<any>>
  usertable2b6e16: any 
  setusertable2b6e16: React.Dispatch<React.SetStateAction<any>>
  usertable2b6e16Props: any 
  setusertable2b6e16Props: React.Dispatch<React.SetStateAction<any>>
  groupbf5ce: any 
  setgroupbf5ce: React.Dispatch<React.SetStateAction<any>>
  groupbf5ceProps: any 
  setgroupbf5ceProps: React.Dispatch<React.SetStateAction<any>>
  usertablee2c3b: any 
  setusertablee2c3b: React.Dispatch<React.SetStateAction<any>>
  usertablee2c3bProps: any 
  setusertablee2c3bProps: React.Dispatch<React.SetStateAction<any>>
  tablegroup1fc0b: any 
  settablegroup1fc0b: React.Dispatch<React.SetStateAction<any>>
  tablegroup1fc0bProps: any 
  settablegroup1fc0bProps: React.Dispatch<React.SetStateAction<any>>
  texttablebadf1: any 
  settexttablebadf1: React.Dispatch<React.SetStateAction<any>>
  texttablebadf1Props: any 
  settexttablebadf1Props: React.Dispatch<React.SetStateAction<any>>
  maingroup7f4e1: any 
  setmaingroup7f4e1: React.Dispatch<React.SetStateAction<any>>
  maingroup7f4e1Props: any 
  setmaingroup7f4e1Props: React.Dispatch<React.SetStateAction<any>>
  userable8d616: any 
  setuserable8d616: React.Dispatch<React.SetStateAction<any>>
  userable8d616Props: any 
  setuserable8d616Props: React.Dispatch<React.SetStateAction<any>>
  parent0e5b8: any 
  setparent0e5b8: React.Dispatch<React.SetStateAction<any>>
  parent0e5b8Props: any 
  setparent0e5b8Props: React.Dispatch<React.SetStateAction<any>>
  form775ce: any 
  setform775ce: React.Dispatch<React.SetStateAction<any>>
  form775ceProps: any 
  setform775ceProps: React.Dispatch<React.SetStateAction<any>>
  groupfordynamicbutton143be: any 
  setgroupfordynamicbutton143be: React.Dispatch<React.SetStateAction<any>>
  groupfordynamicbutton143beProps: any 
  setgroupfordynamicbutton143beProps: React.Dispatch<React.SetStateAction<any>>
  buttons60ce5: any 
  setbuttons60ce5: React.Dispatch<React.SetStateAction<any>>
  buttons60ce5Props: any 
  setbuttons60ce5Props: React.Dispatch<React.SetStateAction<any>>
  qrcode1c711: any,
  setqrcode1c711:React.Dispatch<React.SetStateAction<any>>
  qrcode1c711Props: any 
  setqrcode1c711Props: React.Dispatch<React.SetStateAction<any>>
  progress1c37ec: any,
  setprogress1c37ec:React.Dispatch<React.SetStateAction<any>>
  progress1c37ecProps: any 
  setprogress1c37ecProps: React.Dispatch<React.SetStateAction<any>>
  slider2edf6a: any,
  setslider2edf6a:React.Dispatch<React.SetStateAction<any>>
  slider2edf6aProps: any 
  setslider2edf6aProps: React.Dispatch<React.SetStateAction<any>>
  gggg071dc: any,
  setgggg071dc:React.Dispatch<React.SetStateAction<any>>
  gggg071dcProps: any 
  setgggg071dcProps: React.Dispatch<React.SetStateAction<any>>
  treeviewer4d8cf: any,
  settreeviewer4d8cf:React.Dispatch<React.SetStateAction<any>>
  treeviewer4d8cfProps: any 
  settreeviewer4d8cfProps: React.Dispatch<React.SetStateAction<any>>
  signatureb24c1: any,
  setsignatureb24c1:React.Dispatch<React.SetStateAction<any>>
  signatureb24c1Props: any 
  setsignatureb24c1Props: React.Dispatch<React.SetStateAction<any>>
  pininputd19b1: any,
  setpininputd19b1:React.Dispatch<React.SetStateAction<any>>
  pininputd19b1Props: any 
  setpininputd19b1Props: React.Dispatch<React.SetStateAction<any>>
  liste1b9e: any,
  setliste1b9e:React.Dispatch<React.SetStateAction<any>>
  liste1b9eProps: any 
  setliste1b9eProps: React.Dispatch<React.SetStateAction<any>>
  text_to_speech7626c: any,
  settext_to_speech7626c:React.Dispatch<React.SetStateAction<any>>
  text_to_speech7626cProps: any 
  settext_to_speech7626cProps: React.Dispatch<React.SetStateAction<any>>
  checkbox0cfd1: any,
  setcheckbox0cfd1:React.Dispatch<React.SetStateAction<any>>
  checkbox0cfd1Props: any 
  setcheckbox0cfd1Props: React.Dispatch<React.SetStateAction<any>>
  radiobutton81392: any,
  setradiobutton81392:React.Dispatch<React.SetStateAction<any>>
  radiobutton81392Props: any 
  setradiobutton81392Props: React.Dispatch<React.SetStateAction<any>>
  radio54f01: any,
  setradio54f01:React.Dispatch<React.SetStateAction<any>>
  radio54f01Props: any 
  setradio54f01Props: React.Dispatch<React.SetStateAction<any>>
  image3343d: any,
  setimage3343d:React.Dispatch<React.SetStateAction<any>>
  image3343dProps: any 
  setimage3343dProps: React.Dispatch<React.SetStateAction<any>>
  buttonf8d11: any,
  setbuttonf8d11:React.Dispatch<React.SetStateAction<any>>
  buttonf8d11Props: any 
  setbuttonf8d11Props: React.Dispatch<React.SetStateAction<any>>
  pivottable703fa: any,
  setpivottable703fa:React.Dispatch<React.SetStateAction<any>>
  pivottable703faProps: any 
  setpivottable703faProps: React.Dispatch<React.SetStateAction<any>>
  ide6871: any,
  setide6871:React.Dispatch<React.SetStateAction<any>>
  ide6871Props: any 
  setide6871Props: React.Dispatch<React.SetStateAction<any>>
  name15d49: any,
  setname15d49:React.Dispatch<React.SetStateAction<any>>
  name15d49Props: any 
  setname15d49Props: React.Dispatch<React.SetStateAction<any>>
  show8fe5a: any,
  setshow8fe5a:React.Dispatch<React.SetStateAction<any>>
  show8fe5aProps: any 
  setshow8fe5aProps: React.Dispatch<React.SetStateAction<any>>
  approve25433: any,
  setapprove25433:React.Dispatch<React.SetStateAction<any>>
  approve25433Props: any 
  setapprove25433Props: React.Dispatch<React.SetStateAction<any>>
  ids51838: any,
  setids51838:React.Dispatch<React.SetStateAction<any>>
  ids51838Props: any 
  setids51838Props: React.Dispatch<React.SetStateAction<any>>
  namesb9438: any,
  setnamesb9438:React.Dispatch<React.SetStateAction<any>>
  namesb9438Props: any 
  setnamesb9438Props: React.Dispatch<React.SetStateAction<any>>
  reject88458: any,
  setreject88458:React.Dispatch<React.SetStateAction<any>>
  reject88458Props: any 
  setreject88458Props: React.Dispatch<React.SetStateAction<any>>
  namef9057: any,
  setnamef9057:React.Dispatch<React.SetStateAction<any>>
  namef9057Props: any 
  setnamef9057Props: React.Dispatch<React.SetStateAction<any>>
  nameffb02: any,
  setnameffb02:React.Dispatch<React.SetStateAction<any>>
  nameffb02Props: any 
  setnameffb02Props: React.Dispatch<React.SetStateAction<any>>
  id2c392: any,
  setid2c392:React.Dispatch<React.SetStateAction<any>>
  id2c392Props: any 
  setid2c392Props: React.Dispatch<React.SetStateAction<any>>
  names0c3b9: any,
  setnames0c3b9:React.Dispatch<React.SetStateAction<any>>
  names0c3b9Props: any 
  setnames0c3b9Props: React.Dispatch<React.SetStateAction<any>>
  a00e4d: any,
  seta00e4d:React.Dispatch<React.SetStateAction<any>>
  a00e4dProps: any 
  seta00e4dProps: React.Dispatch<React.SetStateAction<any>>
  b6031c: any,
  setb6031c:React.Dispatch<React.SetStateAction<any>>
  b6031cProps: any 
  setb6031cProps: React.Dispatch<React.SetStateAction<any>>
  save8d5a7: any,
  setsave8d5a7:React.Dispatch<React.SetStateAction<any>>
  save8d5a7Props: any 
  setsave8d5a7Props: React.Dispatch<React.SetStateAction<any>>
  username57f7f: any,
  setusername57f7f:React.Dispatch<React.SetStateAction<any>>
  username57f7fProps: any 
  setusername57f7fProps: React.Dispatch<React.SetStateAction<any>>
  checkboxebbe6: any,
  setcheckboxebbe6:React.Dispatch<React.SetStateAction<any>>
  checkboxebbe6Props: any 
  setcheckboxebbe6Props: React.Dispatch<React.SetStateAction<any>>
  date419b1: any,
  setdate419b1:React.Dispatch<React.SetStateAction<any>>
  date419b1Props: any 
  setdate419b1Props: React.Dispatch<React.SetStateAction<any>>
  idfc377: any,
  setidfc377:React.Dispatch<React.SetStateAction<any>>
  idfc377Props: any 
  setidfc377Props: React.Dispatch<React.SetStateAction<any>>
  name28713: any,
  setname28713:React.Dispatch<React.SetStateAction<any>>
  name28713Props: any 
  setname28713Props: React.Dispatch<React.SetStateAction<any>>
  copyffc78: any,
  setcopyffc78:React.Dispatch<React.SetStateAction<any>>
  copyffc78Props: any 
  setcopyffc78Props: React.Dispatch<React.SetStateAction<any>>
  name228ad: any,
  setname228ad:React.Dispatch<React.SetStateAction<any>>
  name228adProps: any 
  setname228adProps: React.Dispatch<React.SetStateAction<any>>
  searchvalue25fa2: any,
  setsearchvalue25fa2:React.Dispatch<React.SetStateAction<any>>
  searchvalue25fa2Props: any 
  setsearchvalue25fa2Props: React.Dispatch<React.SetStateAction<any>>
  hheadd1: any,
  sethheadd1:React.Dispatch<React.SetStateAction<any>>
  hheadd1Props: any 
  sethheadd1Props: React.Dispatch<React.SetStateAction<any>>
  selectionapproach09360: any,
  setselectionapproach09360:React.Dispatch<React.SetStateAction<any>>
  selectionapproach09360Props: any 
  setselectionapproach09360Props: React.Dispatch<React.SetStateAction<any>>
  options850a2: any,
  setoptions850a2:React.Dispatch<React.SetStateAction<any>>
  options850a2Props: any 
  setoptions850a2Props: React.Dispatch<React.SetStateAction<any>>
  test22a10: any,
  settest22a10:React.Dispatch<React.SetStateAction<any>>
  test22a10Props: any 
  settest22a10Props: React.Dispatch<React.SetStateAction<any>>
  test7777ce2cb: any,
  settest7777ce2cb:React.Dispatch<React.SetStateAction<any>>
  test7777ce2cbProps: any 
  settest7777ce2cbProps: React.Dispatch<React.SetStateAction<any>>
  ae5c28: any,
  setae5c28:React.Dispatch<React.SetStateAction<any>>
  ae5c28Props: any 
  setae5c28Props: React.Dispatch<React.SetStateAction<any>>
  e579ff: any,
  sete579ff:React.Dispatch<React.SetStateAction<any>>
  e579ffProps: any 
  sete579ffProps: React.Dispatch<React.SetStateAction<any>>
  b6efab: any,
  setb6efab:React.Dispatch<React.SetStateAction<any>>
  b6efabProps: any 
  setb6efabProps: React.Dispatch<React.SetStateAction<any>>

////// screen states 
  progress_v1Props: any 
  setprogress_v1Props: React.Dispatch<React.SetStateAction<any>>
  bindranscreen_v1Props: any 
  setbindranscreen_v1Props: React.Dispatch<React.SetStateAction<any>>
  tablecheck_v1Props: any 
  settablecheck_v1Props: React.Dispatch<React.SetStateAction<any>>
  savescreen_v1Props: any 
  setsavescreen_v1Props: React.Dispatch<React.SetStateAction<any>>
  dynamicforms_v1Props: any 
  setdynamicforms_v1Props: React.Dispatch<React.SetStateAction<any>>

///////// dfd
  dfd_mydfddata_v1Props: any 
  setdfd_mydfddata_v1Props: React.Dispatch<React.SetStateAction<any>>

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
    const [currentToken, setCurrentToken ] = React.useState<any>({})
    const [matchedAccessProfileData, setMatchedAccessProfileData] =
    React.useState<any>({})
      //////////
        const [groupbffe9, setgroupbffe9 ] = React.useState<any>({}) 
    const [groupbffe9Props, setgroupbffe9Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [usertable8d993, setusertable8d993 ] = React.useState<any>([]) 
    const [usertable8d993Props, setusertable8d993Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
    
    const [usertable2b6e16, setusertable2b6e16 ] = React.useState<any>([]) 
    const [usertable2b6e16Props, setusertable2b6e16Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [groupbf5ce, setgroupbf5ce ] = React.useState<any>({}) 
    const [groupbf5ceProps, setgroupbf5ceProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [usertablee2c3b, setusertablee2c3b ] = React.useState<any>([]) 
    const [usertablee2c3bProps, setusertablee2c3bProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [tablegroup1fc0b, settablegroup1fc0b ] = React.useState<any>({}) 
    const [tablegroup1fc0bProps, settablegroup1fc0bProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [texttablebadf1, settexttablebadf1 ] = React.useState<any>([]) 
    const [texttablebadf1Props, settexttablebadf1Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [maingroup7f4e1, setmaingroup7f4e1 ] = React.useState<any>({}) 
    const [maingroup7f4e1Props, setmaingroup7f4e1Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
    
    const [userable8d616, setuserable8d616 ] = React.useState<any>([]) 
    const [userable8d616Props, setuserable8d616Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[],
      refresh:false,
      }) 
        const [parent0e5b8, setparent0e5b8 ] = React.useState<any>({}) 
    const [parent0e5b8Props, setparent0e5b8Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [form775ce, setform775ce ] = React.useState<any>({}) 
    const [form775ceProps, setform775ceProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [groupfordynamicbutton143be, setgroupfordynamicbutton143be ] = React.useState<any>({}) 
    const [groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
        const [buttons60ce5, setbuttons60ce5 ] = React.useState<any>({}) 
    const [buttons60ce5Props, setbuttons60ce5Props ] = React.useState<any>({
      validation:false,
      required:false,
      refetch:false,
      refresh:false,
      isDisabled: false,
      presetValues: '',
      isHidden: false,
      selectedIds:[]
      }) 
   const [qrcode1c711,setqrcode1c711] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [progress1c37ec,setprogress1c37ec] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [slider2edf6a,setslider2edf6a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [gggg071dc,setgggg071dc] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [treeviewer4d8cf,settreeviewer4d8cf] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [signatureb24c1,setsignatureb24c1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pininputd19b1,setpininputd19b1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [liste1b9e,setliste1b9e] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [text_to_speech7626c,settext_to_speech7626c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [checkbox0cfd1,setcheckbox0cfd1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [radiobutton81392,setradiobutton81392] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [radio54f01,setradio54f01] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [image3343d,setimage3343d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [buttonf8d11,setbuttonf8d11] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [pivottable703fa,setpivottable703fa] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [ide6871,setide6871] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name15d49,setname15d49] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [show8fe5a,setshow8fe5a] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [approve25433,setapprove25433] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [ids51838,setids51838] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [namesb9438,setnamesb9438] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [reject88458,setreject88458] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [namef9057,setnamef9057] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [nameffb02,setnameffb02] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [id2c392,setid2c392] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [names0c3b9,setnames0c3b9] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [a00e4d,seta00e4d] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [b6031c,setb6031c] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [save8d5a7,setsave8d5a7] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [username57f7f,setusername57f7f] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [checkboxebbe6,setcheckboxebbe6] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [date419b1,setdate419b1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [idfc377,setidfc377] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name28713,setname28713] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [copyffc78,setcopyffc78] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [name228ad,setname228ad] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [searchvalue25fa2,setsearchvalue25fa2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [hheadd1,sethheadd1] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [selectionapproach09360,setselectionapproach09360] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [options850a2,setoptions850a2] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [test22a10,settest22a10] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [test7777ce2cb,settest7777ce2cb] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [ae5c28,setae5c28] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [e579ff,sete579ff] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
   const [b6efab,setb6efab] = React.useState<any>({
    isDisabled: false,
    presetValues: '',
    isHidden: false,
    refetch:false,
    refresh:false,
    }) 
    ///////////
    const [refresh, setRefresh] = React.useState<any>({       qrcodeqrcode1c711:false,
       progressprogress1c37ec:false,
       sliderslider2edf6a:false,
       buttongggg071dc:false,
       treeviewertreeviewer4d8cf:false,
       signaturesignatureb24c1:false,
       pininputpininputd19b1:false,
       listliste1b9e:false,
       text_to_speechtext_to_speech7626c:false,
       checkboxcheckbox0cfd1:false,
       radiobuttonradiobutton81392:false,
       radioradio54f01:false,
       imageimage3343d:false,
       buttonbuttonf8d11:false,
       pivottablepivottable703fa:false,
       columnide6871:false,
       columnname15d49:false,
       buttonshow8fe5a:false,
       buttonapprove25433:false,
       columnids51838:false,
       columnnamesb9438:false,
       buttonreject88458:false,
       textinputnamef9057:false,
       columnnameffb02:false,
       columnid2c392:false,
       columnnames0c3b9:false,
       buttona00e4d:false,
       buttonb6031c:false,
       buttonsave8d5a7:false,
       textinputusername57f7f:false,
       checkboxcheckboxebbe6:false,
       datepickerdate419b1:false,
       columnidfc377:false,
       columnname28713:false,
       buttoncopyffc78:false,
       textname228ad:false,
       textinputsearchvalue25fa2:false,
       documentuploaderhheadd1:false,
       dynamicjsonformselectionapproach09360:false,
       dropdownoptions850a2:false,
       dynamicjsonformtest22a10:false,
       textinputtest7777ce2cb:false,
       buttonae5c28:false,
       buttone579ff:false,
       buttonb6efab:false,
       groupgroupbffe9:false,
       tableusertable8d993:false,
       tableusertable2b6e16:false,
       groupgroupbf5ce:false,
       tableuserTablee2c3b:false,
       grouptablegroup1fc0b:false,
       tabletexttablebadf1:false,
       groupmaingroup7f4e1:false,
       tableuserable8d616:false,
       groupparent0e5b8:false,
       groupform775ce:false,
       groupgroupfordynamicbutton143be:false,
       groupbuttons60ce5:false,
      })

  ////// screen states 
   const [progress_v1Props,setprogress_v1Props] = React.useState<any>([])
   const [bindranscreen_v1Props,setbindranscreen_v1Props] = React.useState<any>([])
   const [tablecheck_v1Props,settablecheck_v1Props] = React.useState<any>([])
   const [savescreen_v1Props,setsavescreen_v1Props] = React.useState<any>([])
   const [dynamicforms_v1Props,setdynamicforms_v1Props] = React.useState<any>([])

///////// dfd
  const [dfd_mydfddata_v1Props,setdfd_mydfddata_v1Props] = React.useState<any>([])
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
        currentToken,
        setCurrentToken,
        matchedAccessProfileData,
        setMatchedAccessProfileData,
        groupbffe9, 
        setgroupbffe9,
        groupbffe9Props, 
        setgroupbffe9Props,
        usertable8d993, 
        setusertable8d993,
        usertable8d993Props, 
        setusertable8d993Props,
        usertable2b6e16, 
        setusertable2b6e16,
        usertable2b6e16Props, 
        setusertable2b6e16Props,
        groupbf5ce, 
        setgroupbf5ce,
        groupbf5ceProps, 
        setgroupbf5ceProps,
        usertablee2c3b, 
        setusertablee2c3b,
        usertablee2c3bProps, 
        setusertablee2c3bProps,
        tablegroup1fc0b, 
        settablegroup1fc0b,
        tablegroup1fc0bProps, 
        settablegroup1fc0bProps,
        texttablebadf1, 
        settexttablebadf1,
        texttablebadf1Props, 
        settexttablebadf1Props,
        maingroup7f4e1, 
        setmaingroup7f4e1,
        maingroup7f4e1Props, 
        setmaingroup7f4e1Props,
        userable8d616, 
        setuserable8d616,
        userable8d616Props, 
        setuserable8d616Props,
        parent0e5b8, 
        setparent0e5b8,
        parent0e5b8Props, 
        setparent0e5b8Props,
        form775ce, 
        setform775ce,
        form775ceProps, 
        setform775ceProps,
        groupfordynamicbutton143be, 
        setgroupfordynamicbutton143be,
        groupfordynamicbutton143beProps, 
        setgroupfordynamicbutton143beProps,
        buttons60ce5, 
        setbuttons60ce5,
        buttons60ce5Props, 
        setbuttons60ce5Props,
        qrcode1c711,
        setqrcode1c711, 
        progress1c37ec,
        setprogress1c37ec, 
        slider2edf6a,
        setslider2edf6a, 
        gggg071dc,
        setgggg071dc, 
        treeviewer4d8cf,
        settreeviewer4d8cf, 
        signatureb24c1,
        setsignatureb24c1, 
        pininputd19b1,
        setpininputd19b1, 
        liste1b9e,
        setliste1b9e, 
        text_to_speech7626c,
        settext_to_speech7626c, 
        checkbox0cfd1,
        setcheckbox0cfd1, 
        radiobutton81392,
        setradiobutton81392, 
        radio54f01,
        setradio54f01, 
        image3343d,
        setimage3343d, 
        buttonf8d11,
        setbuttonf8d11, 
        pivottable703fa,
        setpivottable703fa, 
        ide6871,
        setide6871, 
        name15d49,
        setname15d49, 
        show8fe5a,
        setshow8fe5a, 
        approve25433,
        setapprove25433, 
        ids51838,
        setids51838, 
        namesb9438,
        setnamesb9438, 
        reject88458,
        setreject88458, 
        namef9057,
        setnamef9057, 
        nameffb02,
        setnameffb02, 
        id2c392,
        setid2c392, 
        names0c3b9,
        setnames0c3b9, 
        a00e4d,
        seta00e4d, 
        b6031c,
        setb6031c, 
        save8d5a7,
        setsave8d5a7, 
        username57f7f,
        setusername57f7f, 
        checkboxebbe6,
        setcheckboxebbe6, 
        date419b1,
        setdate419b1, 
        idfc377,
        setidfc377, 
        name28713,
        setname28713, 
        copyffc78,
        setcopyffc78, 
        name228ad,
        setname228ad, 
        searchvalue25fa2,
        setsearchvalue25fa2, 
        hheadd1,
        sethheadd1, 
        selectionapproach09360,
        setselectionapproach09360, 
        options850a2,
        setoptions850a2, 
        test22a10,
        settest22a10, 
        test7777ce2cb,
        settest7777ce2cb, 
        ae5c28,
        setae5c28, 
        e579ff,
        sete579ff, 
        b6efab,
        setb6efab, 
        ////// screen states 
          progress_v1Props,
          setprogress_v1Props,
          bindranscreen_v1Props,
          setbindranscreen_v1Props,
          tablecheck_v1Props,
          settablecheck_v1Props,
          savescreen_v1Props,
          setsavescreen_v1Props,
          dynamicforms_v1Props,
          setdynamicforms_v1Props,
        //////////

        ///////// dfd
        dfd_mydfddata_v1Props,
        setdfd_mydfddata_v1Props,
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