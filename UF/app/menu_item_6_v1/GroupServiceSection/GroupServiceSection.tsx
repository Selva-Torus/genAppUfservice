'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import GroupServiceSectionContent  from "../GroupServiceSectionContent/GroupServiceSectionContent";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const GroupServiceSection = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const encryptionFlagComp: boolean = encryptionFlagPageData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData?.method;
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  };
  const securityData:any={};
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
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
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1",componentId:"6c6cdbc997ff4cbc9c14584de55c7118",from:"GroupServicesection",accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
  code = orchestrationData?.data?.code;
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("servicesectioncontent")){
      setservicesectioncontent29fb3({...servicesectioncontent29fb3,isDisabled:true});
    }
  //////////////
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

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const servicesectionc7118Ref = useRef<any>(null);
  const handleClearSearch = () => {
    servicesectionc7118Ref.current?.setSearchParams();
    servicesectionc7118Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(servicesectionc7118) && Object.keys(servicesectionc7118)?.length>0)
      {
        setservicesectionc7118({})
      }
    }else 
      prevRefreshRef.current= true
  }, [servicesectionc7118Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '385 / 577',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'FCFDFF',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={clsx("",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedComponent.includes("servicesectioncontent")  &&<GroupServiceSectionContent  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          dropdownData={dropdownData} 
          setDropdownData={setDropdownData}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}        />}
    </div>
 )
}

export default GroupServiceSection
