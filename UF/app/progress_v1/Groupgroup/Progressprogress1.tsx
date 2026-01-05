'use client'
import React, {useEffect, useContext,useState } from 'react' 
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { Progress } from '@/components/Progress';
import { Text } from '@/components/Text';
import { Modal } from "@/components/Modal";
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { TotalContext, TotalContextProps } from '@/app/globalContext';

const Progressprogress1 = ({encryptionFlagCompData, isDynamic, index, item}:any) => {
  const token: string = getCookie('token')
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mydfddata_v1Props, setdfd_mydfddata_v1Props} = useContext(TotalContext) as TotalContextProps; 
  let customCode:any=""

  const keyset: any = i18n.keyset('language')
  const [allCode,setAllCode]=useState<any>("")
  let code:any='';
  /////////////
  //another screen
  const {groupbffe9, setgroupbffe9}= useContext(TotalContext) as TotalContextProps;  
  const {groupbffe9Props, setgroupbffe9Props}= useContext(TotalContext) as TotalContextProps;  
  const {qrcode1c711, setqrcode1c711}= useContext(TotalContext) as TotalContextProps;  
  const {sliderf7242, setsliderf7242}= useContext(TotalContext) as TotalContextProps;  
  const {progress1c37ec, setprogress1c37ec}= useContext(TotalContext) as TotalContextProps;  
  const {treeviewer4d8cf, settreeviewer4d8cf}= useContext(TotalContext) as TotalContextProps;  
  const {signatureb24c1, setsignatureb24c1}= useContext(TotalContext) as TotalContextProps;  
  const {pininputd19b1, setpininputd19b1}= useContext(TotalContext) as TotalContextProps;  
  const {liste1b9e, setliste1b9e}= useContext(TotalContext) as TotalContextProps;  
  const {text_to_speech7626c, settext_to_speech7626c}= useContext(TotalContext) as TotalContextProps;  
  const {checkbox0cfd1, setcheckbox0cfd1}= useContext(TotalContext) as TotalContextProps;  
  const {radiobutton81392, setradiobutton81392}= useContext(TotalContext) as TotalContextProps;  
  const {radio54f01, setradio54f01}= useContext(TotalContext) as TotalContextProps;  
  const {image3343d, setimage3343d}= useContext(TotalContext) as TotalContextProps;  
  const {buttonf8d11, setbuttonf8d11}= useContext(TotalContext) as TotalContextProps;  
  const {pivottable703fa, setpivottable703fa}= useContext(TotalContext) as TotalContextProps;  
  const {usertable8d993, setusertable8d993}= useContext(TotalContext) as TotalContextProps;  
  const {usertable8d993Props, setusertable8d993Props}= useContext(TotalContext) as TotalContextProps;  
  const {usertable2b6e16, setusertable2b6e16}= useContext(TotalContext) as TotalContextProps;  
  const {usertable2b6e16Props, setusertable2b6e16Props}= useContext(TotalContext) as TotalContextProps;  
  //////////////

  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1",
          componentId: "7a5f6e1c8f4f4801b28383ae87fbffe9",
          controlId: "b57afebafafb4ea5ad34dade35cc37ec",
          isTable: false,
          accessProfile:accessProfile,
          from:"progressprogress1"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.code)
      {
        setAllCode(orchestrationData?.data?.code)
      }
    }catch(err){
      console.log(err)
    }
    let temp:any = dfd_mydfddata_v1Props[0]?.id
    if (typeof temp != 'number') {
      temp = 0
    } else {
      if (temp < 100) {
        temp = temp
      } else if (100 <= temp && temp < 1000) {
        temp = temp / 10
      }
    }
    setgroupbffe9((pre:any)=>({...pre,id:temp}))
    handleCustomCode()
  }

useEffect(()=>{
  let temp:any = dfd_mydfddata_v1Props[0]?.id
  if (typeof temp != 'number') {
    temp = 0
  } else {
    if (temp < 100) {
      temp = temp
    } else if (100 <= temp && temp < 1000) {
      temp = temp / 10
    }
  }
  setgroupbffe9((pre:any)=>({...pre,id:temp}))
},[dfd_mydfddata_v1Props[0]?.id])

  const handleCustomCode=async () => {
    let customCode:any=''
    let code :any = allCode;
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupbffe9,
      codeStates['setgroup'] = setgroupbffe9,
      codeStates['usertable']  = usertable8d993,
      codeStates['setusertable'] = setusertable8d993,
      codeStates['usertable2']  = usertable2b6e16,
      codeStates['setusertable2'] = setusertable2b6e16,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  useEffect(()=>{
    handleMapperValue()
  },[progress1c37ec?.refresh])

  if (progress1c37ec?.isHidden) {
    return <></>
  }

return (
  <div 
className="bottom "    style={{gridColumn: `2 / 8`,gridRow: `18 / 32`, gap:``, height: `100%`, overflow: 'auto'}} >
    <Progress 
      className=""
        needTooltip={true}  
        tooltipProps={{title:"tooltip",placement:"top-end"}}
        headerPosition='bottom'
        headerText="header"
        theme = {'success'}
        value = {isDynamic ? item?.id : (groupbffe9?.id || 0)}
    />
  </div>
  )
}

export default Progressprogress1
