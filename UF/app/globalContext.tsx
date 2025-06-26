

"use client"
import React from 'react'

export interface TotalContextProps {
    API_Report360bc: any 
    setAPI_Report360bc: React.Dispatch<React.SetStateAction<any>>
    isAPI_Report360bcContainValidataion:any, 
    setAPI_Report360bcContainValidataion:React.Dispatch<React.SetStateAction<any>>
    API_Repo_Table8836e: any 
    setAPI_Repo_Table8836e: React.Dispatch<React.SetStateAction<any>>
    isAPI_Repo_Table8836eContainValidataion:any, 
    setAPI_Repo_Table8836eContainValidataion:React.Dispatch<React.SetStateAction<any>>
    Connected_App_Tablecff73: any 
    setConnected_App_Tablecff73: React.Dispatch<React.SetStateAction<any>>
    isConnected_App_Tablecff73ContainValidataion:any, 
    setConnected_App_Tablecff73ContainValidataion:React.Dispatch<React.SetStateAction<any>>
    Info_Groupaab7f: any 
    setInfo_Groupaab7f: React.Dispatch<React.SetStateAction<any>>
    isInfo_Groupaab7fContainValidataion:any, 
    setInfo_Groupaab7fContainValidataion:React.Dispatch<React.SetStateAction<any>>
    Summary_Table98cb0: any 
    setSummary_Table98cb0: React.Dispatch<React.SetStateAction<any>>
    isSummary_Table98cb0ContainValidataion:any, 
    setSummary_Table98cb0ContainValidataion:React.Dispatch<React.SetStateAction<any>>
    API_Process_Log_Table4f441: any 
    setAPI_Process_Log_Table4f441: React.Dispatch<React.SetStateAction<any>>
    isAPI_Process_Log_Table4f441ContainValidataion:any, 
    setAPI_Process_Log_Table4f441ContainValidataion:React.Dispatch<React.SetStateAction<any>>
    API_Info80710: any 
    setAPI_Info80710: React.Dispatch<React.SetStateAction<any>>
    isAPI_Info80710ContainValidataion:any, 
    setAPI_Info80710ContainValidataion:React.Dispatch<React.SetStateAction<any>>
    Consent_Logs_Table87d37: any 
    setConsent_Logs_Table87d37: React.Dispatch<React.SetStateAction<any>>
    isConsent_Logs_Table87d37ContainValidataion:any, 
    setConsent_Logs_Table87d37ContainValidataion:React.Dispatch<React.SetStateAction<any>>
    disable:any
    setDisable:React.Dispatch<React.SetStateAction<any>>
    hide:any
    setHide:React.Dispatch<React.SetStateAction<any>>
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
    setEncAppFalg:React.Dispatch<React.SetStateAction<any>>
}

export const TotalContext = React.createContext<TotalContextProps | {}>({})

const GlobalContext = ({children} : {children: React.ReactNode}) => {
  const controlObj:any = {    textGLOBAL_BANK0cbf9:false,
    cardMost_Used_APIs15d75:false,
    cardActive_APIs19760:false,
    cardTotal_Requestsb08ba:false,
    carderrorbc458:false,
    textAPI_Repository09e8a:false,
    buttonView_Logs316db:false,
    columnAPI_Name37bd3:false,
    columnVersion2dcd9:false,
    columnAPI_Categoryda1d9:false,
    columnRelease_Dateb7995:false,
    columnActions0b6ca:false,
    columnStatus97236:false,
    textConnected_Applicationfcee9:false,
    columnApp_Nameb4def:false,
    columntppName25084:false,
    columnType354d8:false,
    columnStatus815f5:false,
    textInfofa480:false,
    textAPI_Nameb99e4:false,
    textVersion419ad:false,
    textStatus6e86f:false,
    textApi_Categoryaf733:false,
    textRelease_Date7992c:false,
    textAPI_ResourcePath581bc:false,
    textinputApi_Name5264d:false,
    textinputVersionf9dea:false,
    textinputStatus0a91d:false,
    textinputApi_Categoryb5688:false,
    textinputRelease_Date731a0:false,
    textinputAPI_ResourcePath1fa90:false,
    textIntegration_Metrics_Summary3134b:false,
    cardtotal_calls2f181:false,
    cardsuccess_ratee5646:false,
    carderror_rate4859e:false,
    textAPI_Process_Logsd7e00:false,
    buttonView_Logse088f:false,
    columnTrs_created_date9b7c4:false,
    columnRequestData7bfe6:false,
    columnResponseData30122:false,
    textGLOBAL_BANK9c46f:false,
    textAPI_Infoa27cf:false,
    textConsent_Logs533e1:false,
    columnbaseconsentid3e843:false,
    columninteractionid3a719:false,
    columnpermissions5db4a:false,
    columnstatusfc8c6:false,
    columnrevokedby8f386:false,
    columnexpirationdatetime6e1bc:false,
}
        const [API_Report360bc, setAPI_Report360bc ] = React.useState<any>({}) 
    const [isAPI_Report360bcContainValidataion,setAPI_Report360bcContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false})
    
    const [API_Repo_Table8836e, setAPI_Repo_Table8836e ] = React.useState<any[]>([]) 
    const [isAPI_Repo_Table8836eContainValidataion,setAPI_Repo_Table8836eContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false,
    selectedIds:[]
  })
    
    const [Connected_App_Tablecff73, setConnected_App_Tablecff73 ] = React.useState<any[]>([]) 
    const [isConnected_App_Tablecff73ContainValidataion,setConnected_App_Tablecff73ContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false,
    selectedIds:[]
  })
        const [Info_Groupaab7f, setInfo_Groupaab7f ] = React.useState<any>({}) 
    const [isInfo_Groupaab7fContainValidataion,setInfo_Groupaab7fContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false})
        const [Summary_Table98cb0, setSummary_Table98cb0 ] = React.useState<any>({}) 
    const [isSummary_Table98cb0ContainValidataion,setSummary_Table98cb0ContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false})
    
    const [API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441 ] = React.useState<any[]>([]) 
    const [isAPI_Process_Log_Table4f441ContainValidataion,setAPI_Process_Log_Table4f441ContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false,
    selectedIds:[]
  })
        const [API_Info80710, setAPI_Info80710 ] = React.useState<any>({}) 
    const [isAPI_Info80710ContainValidataion,setAPI_Info80710ContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false})
    
    const [Consent_Logs_Table87d37, setConsent_Logs_Table87d37 ] = React.useState<any[]>([]) 
    const [isConsent_Logs_Table87d37ContainValidataion,setConsent_Logs_Table87d37ContainValidataion]= React.useState<any>({
    validation:false,
    required:false,
    refetch:false,
    selectedIds:[]
  })
    
    const [disable, setDisable] = React.useState<any>({      textGLOBAL_BANK0cbf9:false,
      cardMost_Used_APIs15d75:false,
      cardActive_APIs19760:false,
      cardTotal_Requestsb08ba:false,
      carderrorbc458:false,
      textAPI_Repository09e8a:false,
      buttonView_Logs316db:false,
      columnAPI_Name37bd3:false,
      columnVersion2dcd9:false,
      columnAPI_Categoryda1d9:false,
      columnRelease_Dateb7995:false,
      columnActions0b6ca:false,
      columnStatus97236:false,
      textConnected_Applicationfcee9:false,
      columnApp_Nameb4def:false,
      columntppName25084:false,
      columnType354d8:false,
      columnStatus815f5:false,
      textInfofa480:false,
      textAPI_Nameb99e4:false,
      textVersion419ad:false,
      textStatus6e86f:false,
      textApi_Categoryaf733:false,
      textRelease_Date7992c:false,
      textAPI_ResourcePath581bc:false,
      textinputApi_Name5264d:false,
      textinputVersionf9dea:false,
      textinputStatus0a91d:false,
      textinputApi_Categoryb5688:false,
      textinputRelease_Date731a0:false,
      textinputAPI_ResourcePath1fa90:false,
      textIntegration_Metrics_Summary3134b:false,
      cardtotal_calls2f181:false,
      cardsuccess_ratee5646:false,
      carderror_rate4859e:false,
      textAPI_Process_Logsd7e00:false,
      buttonView_Logse088f:false,
      columnTrs_created_date9b7c4:false,
      columnRequestData7bfe6:false,
      columnResponseData30122:false,
      textGLOBAL_BANK9c46f:false,
      textAPI_Infoa27cf:false,
      textConsent_Logs533e1:false,
      columnbaseconsentid3e843:false,
      columninteractionid3a719:false,
      columnpermissions5db4a:false,
      columnstatusfc8c6:false,
      columnrevokedby8f386:false,
      columnexpirationdatetime6e1bc:false,
})
    const [hide, setHide] = React.useState<any>({      textGLOBAL_BANK0cbf9:false,
      cardMost_Used_APIs15d75:false,
      cardActive_APIs19760:false,
      cardTotal_Requestsb08ba:false,
      carderrorbc458:false,
      textAPI_Repository09e8a:false,
      buttonView_Logs316db:false,
      columnAPI_Name37bd3:false,
      columnVersion2dcd9:false,
      columnAPI_Categoryda1d9:false,
      columnRelease_Dateb7995:false,
      columnActions0b6ca:false,
      columnStatus97236:false,
      textConnected_Applicationfcee9:false,
      columnApp_Nameb4def:false,
      columntppName25084:false,
      columnType354d8:false,
      columnStatus815f5:false,
      textInfofa480:false,
      textAPI_Nameb99e4:false,
      textVersion419ad:false,
      textStatus6e86f:false,
      textApi_Categoryaf733:false,
      textRelease_Date7992c:false,
      textAPI_ResourcePath581bc:false,
      textinputApi_Name5264d:false,
      textinputVersionf9dea:false,
      textinputStatus0a91d:false,
      textinputApi_Categoryb5688:false,
      textinputRelease_Date731a0:false,
      textinputAPI_ResourcePath1fa90:false,
      textIntegration_Metrics_Summary3134b:false,
      cardtotal_calls2f181:false,
      cardsuccess_ratee5646:false,
      carderror_rate4859e:false,
      textAPI_Process_Logsd7e00:false,
      buttonView_Logse088f:false,
      columnTrs_created_date9b7c4:false,
      columnRequestData7bfe6:false,
      columnResponseData30122:false,
      textGLOBAL_BANK9c46f:false,
      textAPI_Infoa27cf:false,
      textConsent_Logs533e1:false,
      columnbaseconsentid3e843:false,
      columninteractionid3a719:false,
      columnpermissions5db4a:false,
      columnstatusfc8c6:false,
      columnrevokedby8f386:false,
      columnexpirationdatetime6e1bc:false,
})
    const [refresh, setRefresh] = React.useState<any>({       textGLOBAL_BANK0cbf9:false,
       cardMost_Used_APIs15d75:false,
       cardActive_APIs19760:false,
       cardTotal_Requestsb08ba:false,
       carderrorbc458:false,
       textAPI_Repository09e8a:false,
       buttonView_Logs316db:false,
       columnAPI_Name37bd3:false,
       columnVersion2dcd9:false,
       columnAPI_Categoryda1d9:false,
       columnRelease_Dateb7995:false,
       columnActions0b6ca:false,
       columnStatus97236:false,
       textConnected_Applicationfcee9:false,
       columnApp_Nameb4def:false,
       columntppName25084:false,
       columnType354d8:false,
       columnStatus815f5:false,
       textInfofa480:false,
       textAPI_Nameb99e4:false,
       textVersion419ad:false,
       textStatus6e86f:false,
       textApi_Categoryaf733:false,
       textRelease_Date7992c:false,
       textAPI_ResourcePath581bc:false,
       textinputApi_Name5264d:false,
       textinputVersionf9dea:false,
       textinputStatus0a91d:false,
       textinputApi_Categoryb5688:false,
       textinputRelease_Date731a0:false,
       textinputAPI_ResourcePath1fa90:false,
       textIntegration_Metrics_Summary3134b:false,
       cardtotal_calls2f181:false,
       cardsuccess_ratee5646:false,
       carderror_rate4859e:false,
       textAPI_Process_Logsd7e00:false,
       buttonView_Logse088f:false,
       columnTrs_created_date9b7c4:false,
       columnRequestData7bfe6:false,
       columnResponseData30122:false,
       textGLOBAL_BANK9c46f:false,
       textAPI_Infoa27cf:false,
       textConsent_Logs533e1:false,
       columnbaseconsentid3e843:false,
       columninteractionid3a719:false,
       columnpermissions5db4a:false,
       columnstatusfc8c6:false,
       columnrevokedby8f386:false,
       columnexpirationdatetime6e1bc:false,
       groupAPI_Report360bc:false,
       tableAPI_Repo_Table8836e:false,
       tableConnected_App_Tablecff73:false,
       groupInfo_Groupaab7f:false,
       groupSummary_Table98cb0:false,
       tableAPI_Process_Log_Table4f441:false,
       groupAPI_Info80710:false,
       tableConsent_Logs_Table87d37:false,
      })
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
    
  return (
    <TotalContext.Provider value={{API_Report360bc, setAPI_Report360bc,isAPI_Report360bcContainValidataion,setAPI_Report360bcContainValidataion,API_Repo_Table8836e, setAPI_Repo_Table8836e,isAPI_Repo_Table8836eContainValidataion,setAPI_Repo_Table8836eContainValidataion,Connected_App_Tablecff73, setConnected_App_Tablecff73,isConnected_App_Tablecff73ContainValidataion,setConnected_App_Tablecff73ContainValidataion,Info_Groupaab7f, setInfo_Groupaab7f,isInfo_Groupaab7fContainValidataion,setInfo_Groupaab7fContainValidataion,Summary_Table98cb0, setSummary_Table98cb0,isSummary_Table98cb0ContainValidataion,setSummary_Table98cb0ContainValidataion,API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441,isAPI_Process_Log_Table4f441ContainValidataion,setAPI_Process_Log_Table4f441ContainValidataion,API_Info80710, setAPI_Info80710,isAPI_Info80710ContainValidataion,setAPI_Info80710ContainValidataion,Consent_Logs_Table87d37, setConsent_Logs_Table87d37,isConsent_Logs_Table87d37ContainValidataion,setConsent_Logs_Table87d37ContainValidataion,refetch, setRefetch,searchParam , setSearchParam,disableParam , setDisableParam,globalState , setGlobalState,validate, setValidate,validateRefetch, setValidateRefetch,accessProfile,setAccessProfile,property, setProperty,disable, setDisable,hide, setHide, setRefresh, refresh,memoryVariables, setMemoryVariables,lockedData, setLockedData,eventEmitterData,setEventEmitterData, userDetails , setUserDetails,encAppFalg , setEncAppFalg}}>
      {children}
    </TotalContext.Provider>
  )
}

export default GlobalContext