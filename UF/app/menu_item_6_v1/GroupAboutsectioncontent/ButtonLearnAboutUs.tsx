'use client'
import React, { useState,useEffect,useContext, useRef } from 'react';
import axios from 'axios';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { uf_getPFDetailsDto,uf_initiatePfDto,te_eventEmitterDto,uf_ifoDto,te_updateDto } from '@/app/interfaces/interfaces';
import decodeToken from '@/app/components/decodeToken';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { nullFilter } from '@/app/utils/nullDataFilter';
import { eventFunction } from '@/app/utils/eventFunction';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@/components/Modal';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { XMLParser } from 'fast-xml-parser'


    

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      // Determine the modifier based on the type of the value
      const value = obj[key];
      let modifiedKey = key;

      if (typeof value === 'string') {
        modifiedKey += '-contains';  // Append '-contains' if value is a string
      } else if (typeof value === 'number') {
        modifiedKey += '-equals';    // Append '-equals' if value is a number
      }

      // Return the key-value pair with the modified key
      return `${encodeURIComponent(modifiedKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
 

const ButtonLearnAboutUs = ({ lockedData,setLockedData,primaryTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}: { lockedData:any,setLockedData:any,checkToAdd:any,setCheckToAdd:any,refetch:any,setRefetch:any,primaryTableData:any,setPrimaryTableData:any,encryptionFlagCompData:any,}) => {
  const token:string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const createdBy:string =decodedTokenObj.users;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = "";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const savedData=useRef({})
  const keyset:any=i18n.keyset("language");
  const confirmMsgFlag: boolean = false; 
  const toast:any=useInfoMsg();
  let dfKey: string | any;
  const lockMode:any = lockedData.lockMode;
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  let actionLockData = {"lockMode":"","name":"","ttl":""}
  const [allCode,setAllCode]=useState<any>("");
    
 /////////////
   //another screen
  const {herosection5b0f3, setherosection5b0f3}= useContext(TotalContext) as TotalContextProps;
  const {herosection5b0f3Props, setherosection5b0f3Props}= useContext(TotalContext) as TotalContextProps;
  const {herosectioncontent0b52c, setherosectioncontent0b52c}= useContext(TotalContext) as TotalContextProps;
  const {herosectioncontent0b52cProps, setherosectioncontent0b52cProps}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard68df4, sethersectioncontentcard68df4}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard68df4Props, sethersectioncontentcard68df4Props}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard1b9c4a, sethersectioncontentcard1b9c4a}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard1b9c4aProps, sethersectioncontentcard1b9c4aProps}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard2cd13f, sethersectioncontentcard2cd13f}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard2cd13fProps, sethersectioncontentcard2cd13fProps}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard39a879, sethersectioncontentcard39a879}= useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard39a879Props, sethersectioncontentcard39a879Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsection3edbb, setaboutsection3edbb}= useContext(TotalContext) as TotalContextProps;
  const {aboutsection3edbbProps, setaboutsection3edbbProps}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontent3ada4, setaboutsectioncontent3ada4}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontent3ada4Props, setaboutsectioncontent3ada4Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg1c0718, setaboutsectioncontentimg1c0718}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg1c0718Props, setaboutsectioncontentimg1c0718Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimgcard1df84, setaboutsectioncontentimgcard1df84}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimgcard1df84Props, setaboutsectioncontentimgcard1df84Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentheadingwrapper82b26, setaboutsectioncontentheadingwrapper82b26}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentheadingwrapper82b26Props, setaboutsectioncontentheadingwrapper82b26Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentheaderbda1f, setaboutsectioncontentheaderbda1f}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentbody90f38, setaboutsectioncontentbody90f38}= useContext(TotalContext) as TotalContextProps;
  const {about_section_content_card_10975b, setabout_section_content_card_10975b}= useContext(TotalContext) as TotalContextProps;
  const {about_section_content_card_10975bProps, setabout_section_content_card_10975bProps}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard1iconwrapper885d6, setaboutsectioncontentcard1iconwrapper885d6}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard1iconwrapper885d6Props, setaboutsectioncontentcard1iconwrapper885d6Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg26f2bf, setaboutsectioncontentimg26f2bf}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg26f2bfProps, setaboutsectioncontentimg26f2bfProps}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg35e371, setaboutsectioncontentimg35e371}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg35e371Props, setaboutsectioncontentimg35e371Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2bb8af, setaboutsectioncontentcard2bb8af}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2bb8afProps, setaboutsectioncontentcard2bb8afProps}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2iconwrapper90155, setaboutsectioncontentcard2iconwrapper90155}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2iconwrapper90155Props, setaboutsectioncontentcard2iconwrapper90155Props}= useContext(TotalContext) as TotalContextProps;
  const {learnaboutus17894, setlearnaboutus17894}= useContext(TotalContext) as TotalContextProps;
  const {callus10721, setcallus10721}= useContext(TotalContext) as TotalContextProps;
  const {mobnum9f6f4, setmobnum9f6f4}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcards42230, setaboutsectioncontentcards42230}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcards42230Props, setaboutsectioncontentcards42230Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsproject39023, setaboutsectioncontentcardsproject39023}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsproject39023Props, setaboutsectioncontentcardsproject39023Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscllient4f691, setaboutsectioncontentcardscllient4f691}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscllient4f691Props, setaboutsectioncontentcardscllient4f691Props}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsteamcea5d, setaboutsectioncontentcardsteamcea5d}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsteamcea5dProps, setaboutsectioncontentcardsteamcea5dProps}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscustomer2cf01, setaboutsectioncontentcardscustomer2cf01}= useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscustomer2cf01Props, setaboutsectioncontentcardscustomer2cf01Props}= useContext(TotalContext) as TotalContextProps;
  const {servicesectionc7118, setservicesectionc7118}= useContext(TotalContext) as TotalContextProps;
  const {servicesectionc7118Props, setservicesectionc7118Props}= useContext(TotalContext) as TotalContextProps;
  const {servicesectioncontent29fb3, setservicesectioncontent29fb3}= useContext(TotalContext) as TotalContextProps;
  const {servicesectioncontent29fb3Props, setservicesectioncontent29fb3Props}= useContext(TotalContext) as TotalContextProps;
  const {dd2e0, setdd2e0}= useContext(TotalContext) as TotalContextProps;
  const {dd2e0Props, setdd2e0Props}= useContext(TotalContext) as TotalContextProps;
  const {d29fb, setd29fb}= useContext(TotalContext) as TotalContextProps;
  const {d29fbProps, setd29fbProps}= useContext(TotalContext) as TotalContextProps;
  const {688bb, set688bb}= useContext(TotalContext) as TotalContextProps;
  const {688bbProps, set688bbProps}= useContext(TotalContext) as TotalContextProps;
  const {securityicon3bde5, setsecurityicon3bde5}= useContext(TotalContext) as TotalContextProps;
  const {securityicon3bde5Props, setsecurityicon3bde5Props}= useContext(TotalContext) as TotalContextProps;
  const {iconwrapper5dce2, seticonwrapper5dce2}= useContext(TotalContext) as TotalContextProps;
  const {iconwrapper5dce2Props, seticonwrapper5dce2Props}= useContext(TotalContext) as TotalContextProps;
  const {c5619, setc5619}= useContext(TotalContext) as TotalContextProps;
  const {c5619Props, setc5619Props}= useContext(TotalContext) as TotalContextProps;
  const {1e67b, set1e67b}= useContext(TotalContext) as TotalContextProps;
  const {1e67bProps, set1e67bProps}= useContext(TotalContext) as TotalContextProps;
  const {4a692, set4a692}= useContext(TotalContext) as TotalContextProps;
  const {4a692Props, set4a692Props}= useContext(TotalContext) as TotalContextProps;
  const {28b18, set28b18}= useContext(TotalContext) as TotalContextProps;
  const {28b18Props, set28b18Props}= useContext(TotalContext) as TotalContextProps;
  const {1d2f0, set1d2f0}= useContext(TotalContext) as TotalContextProps;
  const {1d2f0Props, set1d2f0Props}= useContext(TotalContext) as TotalContextProps;
  const {c713c, setc713c}= useContext(TotalContext) as TotalContextProps;
  const {c713cProps, setc713cProps}= useContext(TotalContext) as TotalContextProps;
  const {testingsectionfd8df, settestingsectionfd8df}= useContext(TotalContext) as TotalContextProps;
  const {testingsectionfd8dfProps, settestingsectionfd8dfProps}= useContext(TotalContext) as TotalContextProps;
  const {a3963, seta3963}= useContext(TotalContext) as TotalContextProps;
  const {a3963Props, seta3963Props}= useContext(TotalContext) as TotalContextProps;
  const {a0ca9, seta0ca9}= useContext(TotalContext) as TotalContextProps;
  const {a0ca9Props, seta0ca9Props}= useContext(TotalContext) as TotalContextProps;
  const {84e59, set84e59}= useContext(TotalContext) as TotalContextProps;
  const {84e59Props, set84e59Props}= useContext(TotalContext) as TotalContextProps;
  const {ad050, setad050}= useContext(TotalContext) as TotalContextProps;
  const {ad050Props, setad050Props}= useContext(TotalContext) as TotalContextProps;
  const {04eb2, set04eb2}= useContext(TotalContext) as TotalContextProps;
  const {04eb2Props, set04eb2Props}= useContext(TotalContext) as TotalContextProps;
  const {acdf4, setacdf4}= useContext(TotalContext) as TotalContextProps;
  const {acdf4Props, setacdf4Props}= useContext(TotalContext) as TotalContextProps;
  const {f377d, setf377d}= useContext(TotalContext) as TotalContextProps;
  const {f377dProps, setf377dProps}= useContext(TotalContext) as TotalContextProps;
  const {2c7d1, set2c7d1}= useContext(TotalContext) as TotalContextProps;
  const {2c7d1Props, set2c7d1Props}= useContext(TotalContext) as TotalContextProps;
  const {2d4f2, set2d4f2}= useContext(TotalContext) as TotalContextProps;
  const {2d4f2Props, set2d4f2Props}= useContext(TotalContext) as TotalContextProps;
  const {b38f9, setb38f9}= useContext(TotalContext) as TotalContextProps;
  const {b38f9Props, setb38f9Props}= useContext(TotalContext) as TotalContextProps;
  const {13f42, set13f42}= useContext(TotalContext) as TotalContextProps;
  const {13f42Props, set13f42Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let customCode:any;
  const handleCustomCode=async () => {
    code = allCode ||""
    if (code != '') {
      let codeStates: any = {};
      codeStates['herosection']  = herosection5b0f3,
      codeStates['setherosection'] = setherosection5b0f3,
      codeStates['herosectioncontent']  = herosectioncontent0b52c,
      codeStates['setherosectioncontent'] = setherosectioncontent0b52c,
      codeStates['hersectioncontentcard']  = hersectioncontentcard68df4,
      codeStates['sethersectioncontentcard'] = sethersectioncontentcard68df4,
      codeStates['hersectioncontentcard1']  = hersectioncontentcard1b9c4a,
      codeStates['sethersectioncontentcard1'] = sethersectioncontentcard1b9c4a,
      codeStates['hersectioncontentcard2']  = hersectioncontentcard2cd13f,
      codeStates['sethersectioncontentcard2'] = sethersectioncontentcard2cd13f,
      codeStates['hersectioncontentcard3']  = hersectioncontentcard39a879,
      codeStates['sethersectioncontentcard3'] = sethersectioncontentcard39a879,
      codeStates['aboutsection']  = aboutsection3edbb,
      codeStates['setaboutsection'] = setaboutsection3edbb,
      codeStates['aboutsectioncontent']  = aboutsectioncontent3ada4,
      codeStates['setaboutsectioncontent'] = setaboutsectioncontent3ada4,
      codeStates['aboutsectioncontentimg1']  = aboutsectioncontentimg1c0718,
      codeStates['setaboutsectioncontentimg1'] = setaboutsectioncontentimg1c0718,
      codeStates['aboutsectioncontentimgcard']  = aboutsectioncontentimgcard1df84,
      codeStates['setaboutsectioncontentimgcard'] = setaboutsectioncontentimgcard1df84,
      codeStates['aboutsectioncontentheadingwrapper']  = aboutsectioncontentheadingwrapper82b26,
      codeStates['setaboutsectioncontentheadingwrapper'] = setaboutsectioncontentheadingwrapper82b26,
      codeStates['about_section_content_card_1']  = about_section_content_card_10975b,
      codeStates['setabout_section_content_card_1'] = setabout_section_content_card_10975b,
      codeStates['aboutsectioncontentcard1iconwrapper']  = aboutsectioncontentcard1iconwrapper885d6,
      codeStates['setaboutsectioncontentcard1iconwrapper'] = setaboutsectioncontentcard1iconwrapper885d6,
      codeStates['aboutsectioncontentimg2']  = aboutsectioncontentimg26f2bf,
      codeStates['setaboutsectioncontentimg2'] = setaboutsectioncontentimg26f2bf,
      codeStates['aboutsectioncontentimg3']  = aboutsectioncontentimg35e371,
      codeStates['setaboutsectioncontentimg3'] = setaboutsectioncontentimg35e371,
      codeStates['aboutsectioncontentcard2']  = aboutsectioncontentcard2bb8af,
      codeStates['setaboutsectioncontentcard2'] = setaboutsectioncontentcard2bb8af,
      codeStates['aboutsectioncontentcard2iconwrapper']  = aboutsectioncontentcard2iconwrapper90155,
      codeStates['setaboutsectioncontentcard2iconwrapper'] = setaboutsectioncontentcard2iconwrapper90155,
      codeStates['aboutsectioncontentcards']  = aboutsectioncontentcards42230,
      codeStates['setaboutsectioncontentcards'] = setaboutsectioncontentcards42230,
      codeStates['aboutsectioncontentcardsproject']  = aboutsectioncontentcardsproject39023,
      codeStates['setaboutsectioncontentcardsproject'] = setaboutsectioncontentcardsproject39023,
      codeStates['aboutsectioncontentcardscllient']  = aboutsectioncontentcardscllient4f691,
      codeStates['setaboutsectioncontentcardscllient'] = setaboutsectioncontentcardscllient4f691,
      codeStates['aboutsectioncontentcardsteam']  = aboutsectioncontentcardsteamcea5d,
      codeStates['setaboutsectioncontentcardsteam'] = setaboutsectioncontentcardsteamcea5d,
      codeStates['aboutsectioncontentcardscustomer']  = aboutsectioncontentcardscustomer2cf01,
      codeStates['setaboutsectioncontentcardscustomer'] = setaboutsectioncontentcardscustomer2cf01,
      codeStates['servicesection']  = servicesectionc7118,
      codeStates['setservicesection'] = setservicesectionc7118,
      codeStates['servicesectioncontent']  = servicesectioncontent29fb3,
      codeStates['setservicesectioncontent'] = setservicesectioncontent29fb3,
      codeStates['']  = dd2e0,
      codeStates['set'] = setdd2e0,
      codeStates['']  = d29fb,
      codeStates['set'] = setd29fb,
      codeStates['']  = 688bb,
      codeStates['set'] = set688bb,
      codeStates['securityicon']  = securityicon3bde5,
      codeStates['setsecurityicon'] = setsecurityicon3bde5,
      codeStates['iconwrapper']  = iconwrapper5dce2,
      codeStates['seticonwrapper'] = seticonwrapper5dce2,
      codeStates['']  = c5619,
      codeStates['set'] = setc5619,
      codeStates['']  = 1e67b,
      codeStates['set'] = set1e67b,
      codeStates['']  = 4a692,
      codeStates['set'] = set4a692,
      codeStates['']  = 28b18,
      codeStates['set'] = set28b18,
      codeStates['']  = 1d2f0,
      codeStates['set'] = set1d2f0,
      codeStates['']  = c713c,
      codeStates['set'] = setc713c,
      codeStates['testingsection']  = testingsectionfd8df,
      codeStates['settestingsection'] = settestingsectionfd8df,
      codeStates['']  = a3963,
      codeStates['set'] = seta3963,
      codeStates['']  = a0ca9,
      codeStates['set'] = seta0ca9,
      codeStates['']  = 84e59,
      codeStates['set'] = set84e59,
      codeStates['']  = ad050,
      codeStates['set'] = setad050,
      codeStates['']  = 04eb2,
      codeStates['set'] = set04eb2,
      codeStates['']  = acdf4,
      codeStates['set'] = setacdf4,
      codeStates['']  = f377d,
      codeStates['set'] = setf377d,
      codeStates['']  = 2c7d1,
      codeStates['set'] = set2c7d1,
      codeStates['']  = 2d4f2,
      codeStates['set'] = set2d4f2,
      codeStates['']  = b38f9,
      codeStates['set'] = setb38f9,
      codeStates['']  = 13f42,
      codeStates['set'] = set13f42,
      codeStates['response']  = savedData.current,
      customCode = codeExecution(code,codeStates);
      return customCode;
    }
  }
  const handleMapper=async () => {
    try{     
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1",
          componentId: "20f039471c6749e3a6186fd0d473ada4",
          controlId: "3f5f9d04c76540529fc3dbb96ec17894",
          isTable: false,
          from:"ButtonLearn About Us",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code);
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    handleMapper();
    eventBus.on("triggerButton", (id:any) => {
      if (id === "learnaboutus17894") {
        handleClick();
      }
    });
  },[learnaboutus17894?.refresh])

  function SourceIdFilter(eventProperty:any,matchingSequence?:string){
    let ans=[]
    let id=""
    if(eventProperty.name=='saveHandler' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    if(eventProperty.name=='eventEmitter' && eventProperty.sequence == matchingSequence)
    {
      return [eventProperty.id]
    }
    for(let i=0;i<eventProperty?.children?.length;i++)
    {
      let temp:any=SourceIdFilter(eventProperty?.children[i],matchingSequence)
      if(temp.length)
      {
        ans.push(eventProperty?.children[i].id)
        id=id+"|"+eventProperty?.children[i].id
        ans.push(...temp)
      }
    }
    return ans
  }

  const handleClick=async()=>{
    if(aboutsectioncontent3ada4Props?.validation==true && aboutsectioncontent3ada4Props?.required==true || aboutsectioncontent3ada4Props?.required==true)
    {
      if(validateRefetch.init==0)
      {
        setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
        return
      }
      setValidateRefetch((pre:any)=>({...pre,value:!pre.value,init:pre.init+1}));
    } 
    let saveCheck=false;
        Object.keys(validate).map((item)=>{
      if(validate[item] == 'invalid'){
        saveCheck=true;
    }})
    if (saveCheck) {   
      toast('Please verify the data', 'danger');
      return
    }
    try{  
      await delay(1000);
      await handleCustomCode();
    }catch (err: any) {
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
      setLoading(false);
    }
  }


 if (learnaboutus17894?.isHidden) {
    return <></>
  }
 
  return (
    <div 
      style={{gridColumn: `7 / 10`,gridRow: `135 / 150`, gap:``, height: `100%`, overflow: 'auto'}} >
        <Button 
          ref={buttonRef}
          className=""
          onClick={handleClick}
          view='action'
          size='l'           
          disabled= {learnaboutus17894?.isDisabled ? true : false}
          pin='circle-circle'
        >
              {keyset("Learn About Us")}
        </Button>
      </div>
    
  )
}

export default ButtonLearnAboutUs

