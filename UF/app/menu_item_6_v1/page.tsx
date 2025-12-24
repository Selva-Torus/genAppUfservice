'use client'
import { useLanguage } from "../components/languageContext";
import React,{ useContext,useEffect,useState,useRef } from "react";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto,te_refreshDto,te_dfDto,api_paginationDto } from '@/app/interfaces/interfaces';
import { codeExecution } from "../utils/codeExecution";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from "../globalContext";
import decodeToken from "../components/decodeToken";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import clsx from "clsx";
import GroupHeroSection  from "./GroupHeroSection/GroupHeroSection";
import GroupAboutSection  from "./GroupAboutSection/GroupAboutSection";
import GroupServiceSection  from "./GroupServiceSection/GroupServiceSection";
import GroupTestingSection  from "./GroupTestingSection/GroupTestingSection";


export default function PageMenuItem6V1() {
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const [initialLoad, setInitialLoad] = useState(false);
  const securityData:any={};
  let code:any="";
  //const language=useLanguage();
  const routes = useRouter();
  const toast=useInfoMsg();
  const [primaryTableData, setPrimaryTableData] = useState<any>({primaryKey:"",value:"",compName:""});
  const [checkToAdd, setCheckToAdd] = useState<any>({});
  const [dropdownData, setDropdownData] = useState<any>({});
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token);
  const screenName:string = "menu item 6";
  const user = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {new_homescreen_v1Props, setnew_homescreen_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkherosection,setCheckherosection,]=useState(false);
  const [checkherosectioncontent,setCheckherosectioncontent,]=useState(false);
  const [checkhersectioncontentcard,setCheckhersectioncontentcard,]=useState(false);
  const [checkhersectioncontentcard1,setCheckhersectioncontentcard1,]=useState(false);
  const [checkhersectioncontentcard2,setCheckhersectioncontentcard2,]=useState(false);
  const [checkhersectioncontentcard3,setCheckhersectioncontentcard3,]=useState(false);
  const [checkaboutsection,setCheckaboutsection,]=useState(false);
  const [checkaboutsectioncontent,setCheckaboutsectioncontent,]=useState(false);
  const [checkaboutsectioncontentimg1,setCheckaboutsectioncontentimg1,]=useState(false);
  const [checkaboutsectioncontentimgcard,setCheckaboutsectioncontentimgcard,]=useState(false);
  const [checkaboutsectioncontentheadingwrapper,setCheckaboutsectioncontentheadingwrapper,]=useState(false);
  const [checkabout_section_content_card_1,setCheckabout_section_content_card_1,]=useState(false);
  const [checkaboutsectioncontentcard1iconwrapper,setCheckaboutsectioncontentcard1iconwrapper,]=useState(false);
  const [checkaboutsectioncontentcard2,setCheckaboutsectioncontentcard2,]=useState(false);
  const [checkaboutsectioncontentcard2iconwrapper,setCheckaboutsectioncontentcard2iconwrapper,]=useState(false);
  const [checkaboutsectioncontentcards,setCheckaboutsectioncontentcards,]=useState(false);
  const [checkaboutsectioncontentcardsproject,setCheckaboutsectioncontentcardsproject,]=useState(false);
  const [checkaboutsectioncontentcardscllient,setCheckaboutsectioncontentcardscllient,]=useState(false);
  const [checkaboutsectioncontentcardsteam,setCheckaboutsectioncontentcardsteam,]=useState(false);
  const [checkaboutsectioncontentcardscustomer,setCheckaboutsectioncontentcardscustomer,]=useState(false);
  const [checkservicesection,setCheckservicesection,]=useState(false);
  const [checkservicesectioncontent,setCheckservicesectioncontent,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checksecurityicon,setChecksecurityicon,]=useState(false);
  const [checkiconwrapper,setCheckiconwrapper,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checktestingsection,setChecktestingsection,]=useState(false);
  const [check,setCheck,]=useState(false);
  const {herosection5b0f3, setherosection5b0f3} = useContext(TotalContext) as TotalContextProps;
  const {herosectioncontent0b52c, setherosectioncontent0b52c} = useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard68df4, sethersectioncontentcard68df4} = useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard1b9c4a, sethersectioncontentcard1b9c4a} = useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard2cd13f, sethersectioncontentcard2cd13f} = useContext(TotalContext) as TotalContextProps;
  const {hersectioncontentcard39a879, sethersectioncontentcard39a879} = useContext(TotalContext) as TotalContextProps;
  const {aboutsection3edbb, setaboutsection3edbb} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontent3ada4, setaboutsectioncontent3ada4} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimg1c0718, setaboutsectioncontentimg1c0718} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentimgcard1df84, setaboutsectioncontentimgcard1df84} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentheadingwrapper82b26, setaboutsectioncontentheadingwrapper82b26} = useContext(TotalContext) as TotalContextProps;
  const {about_section_content_card_10975b, setabout_section_content_card_10975b} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard1iconwrapper885d6, setaboutsectioncontentcard1iconwrapper885d6} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2bb8af, setaboutsectioncontentcard2bb8af} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcard2iconwrapper90155, setaboutsectioncontentcard2iconwrapper90155} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcards42230, setaboutsectioncontentcards42230} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsproject39023, setaboutsectioncontentcardsproject39023} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscllient4f691, setaboutsectioncontentcardscllient4f691} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardsteamcea5d, setaboutsectioncontentcardsteamcea5d} = useContext(TotalContext) as TotalContextProps;
  const {aboutsectioncontentcardscustomer2cf01, setaboutsectioncontentcardscustomer2cf01} = useContext(TotalContext) as TotalContextProps;
  const {servicesectionc7118, setservicesectionc7118} = useContext(TotalContext) as TotalContextProps;
  const {servicesectioncontent29fb3, setservicesectioncontent29fb3} = useContext(TotalContext) as TotalContextProps;
  const {d29fb, setd29fb} = useContext(TotalContext) as TotalContextProps;
  const {688bb, set688bb} = useContext(TotalContext) as TotalContextProps;
  const {securityicon3bde5, setsecurityicon3bde5} = useContext(TotalContext) as TotalContextProps;
  const {iconwrapper5dce2, seticonwrapper5dce2} = useContext(TotalContext) as TotalContextProps;
  const {c5619, setc5619} = useContext(TotalContext) as TotalContextProps;
  const {1e67b, set1e67b} = useContext(TotalContext) as TotalContextProps;
  const {4a692, set4a692} = useContext(TotalContext) as TotalContextProps;
  const {28b18, set28b18} = useContext(TotalContext) as TotalContextProps;
  const {1d2f0, set1d2f0} = useContext(TotalContext) as TotalContextProps;
  const {c713c, setc713c} = useContext(TotalContext) as TotalContextProps;
  const {testingsectionfd8df, settestingsectionfd8df} = useContext(TotalContext) as TotalContextProps;
  const {a3963, seta3963} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagPage: boolean = false|| encAppFalg.flag;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encAppFalg.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encAppFalg.method;
  let encryptionFlagPageData :any ={
    "flag":encryptionFlagPage,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }
  const [paginationData,setPaginationData]=useState<any>({count:10,page:1})
    const prevRefreshRef = useRef({
    });

  async function securityCheck() {
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1",accessProfile:[user],from:"pageMenuItem6V1"},{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    const uf_dfKey:string[] = orchestrationData?.data?.DFkeys;
    const security:string = orchestrationData?.data?.security; 
    const allowedGroup:any[] = orchestrationData?.data?.allowedGroup||[];
    code = orchestrationData?.data?.code;
    const pagination:any = orchestrationData?.data?.action?.pagination;
    setpaginationDetails({
      page: +orchestrationData?.data?.action?.pagination?.page || 0,
      pageSize: +orchestrationData?.data?.action?.pagination?.count || 0
    })
    let encryptionData:any = {};
    if (token) {
      try {
        let introspect:any;
        if(encryptionFlagPage){
           introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              dpdKey: encryptionDpd,
              method: encryptionMethod,
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1"  
            }
          })          
        }
        if(introspect?.data?.authenticated === false){
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct003/ag001/oprmatrix/v1';
        }
      }catch (err: any) {
        toast("The token is no longer active.", 'danger');
        localStorage.clear();
        deleteAllCookies();
        window.location.href = '/ct003/ag001/oprmatrix/v1';
      }
      try {
        let myAccount:any;
        if(encryptionFlagPage){
         myAccount = await AxiosService.get("/UF/myAccount-for-client",{
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
              dpdKey: encryptionDpd,
              method: encryptionMethod,
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1"
            }
         })          
        }
        if( user != "" && user != null){
          setAccessProfile([user]);
        }
        let actionDetails:any = {
  "lock": {
    "lockMode": "",
    "name": "",
    "ttl": ""
  },
  "stateTransition": {
    "sourceQueue": "",
    "sourceStatus": "",
    "targetQueue": "",
    "targetStatus": ""
  },
  "pagination": {
    "page": "1",
    "count": "10"
  },
  "encryption": {
    "isEnabled": false,
    "selectedDpd": "",
    "encryptionMethod": ""
  },
  "events": {}
};
        try{
          if (security == 'AA') {
          allowedGroup.map((nodes:any)=>{
            if(nodes?.groupName == 'HeroSection' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckherosection(true)
            }
            if(nodes?.groupName == 'HerosectionContent' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckherosectioncontent(true)
            }
            if(nodes?.groupName == 'HerSectioncontentCard' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckhersectioncontentcard(true)
            }
            if(nodes?.groupName == 'HersectioncontentCard1' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckhersectioncontentcard1(true)
            }
            if(nodes?.groupName == 'HersectioncontentCard2' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckhersectioncontentcard2(true)
            }
            if(nodes?.groupName == 'HersectioncontentCard3' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckhersectioncontentcard3(true)
            }
            if(nodes?.groupName == 'AboutSection' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsection(true)
            }
            if(nodes?.groupName == 'Aboutsectioncontent' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontent(true)
            }
            if(nodes?.groupName == 'Aboutsectioncontentimg1' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentimg1(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentimgCard' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentimgcard(true)
            }
            if(nodes?.groupName == 'Aboutsectioncontentheadingwrapper' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentheadingwrapper(true)
            }
            if(nodes?.groupName == 'About_section_content_Card_1' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckabout_section_content_card_1(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCard1iconwrapper' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcard1iconwrapper(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCard2' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcard2(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCard2iconwrapper' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcard2iconwrapper(true)
            }
            if(nodes?.groupName == 'AboutSectionContentCards' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcards(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCardsproject' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcardsproject(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCardscllient' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcardscllient(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCardsteam' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcardsteam(true)
            }
            if(nodes?.groupName == 'AboutsectioncontentCardscustomer' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckaboutsectioncontentcardscustomer(true)
            }
            if(nodes?.groupName == 'ServiceSection' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckservicesection(true)
            }
            if(nodes?.groupName == 'ServiceSectionContent' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckservicesectioncontent(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'securityIcon' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setChecksecurityicon(true)
            }
            if(nodes?.groupName == 'iconWrapper' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckiconwrapper(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'TestingSection' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setChecktestingsection(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
          })
          }
           }catch(err:any)
          {
            if( typeof err =='string')
              toast(err, 'danger');
            else
              toast(err?.response?.data?.message, 'danger');
          }
        /////////
        //Code Execution
        if (code !="" ) {
          let codeStates: any = {}
          codeStates['herosection'] = herosection5b0f3;
          codeStates['setherosection'] = setherosection5b0f3;
          codeStates['herosectioncontent'] = herosectioncontent0b52c;
          codeStates['setherosectioncontent'] = setherosectioncontent0b52c;
          codeStates['hersectioncontentcard'] = hersectioncontentcard68df4;
          codeStates['sethersectioncontentcard'] = sethersectioncontentcard68df4;
          codeStates['hersectioncontentcard1'] = hersectioncontentcard1b9c4a;
          codeStates['sethersectioncontentcard1'] = sethersectioncontentcard1b9c4a;
          codeStates['hersectioncontentcard2'] = hersectioncontentcard2cd13f;
          codeStates['sethersectioncontentcard2'] = sethersectioncontentcard2cd13f;
          codeStates['hersectioncontentcard3'] = hersectioncontentcard39a879;
          codeStates['sethersectioncontentcard3'] = sethersectioncontentcard39a879;
          codeStates['aboutsection'] = aboutsection3edbb;
          codeStates['setaboutsection'] = setaboutsection3edbb;
          codeStates['aboutsectioncontent'] = aboutsectioncontent3ada4;
          codeStates['setaboutsectioncontent'] = setaboutsectioncontent3ada4;
          codeStates['aboutsectioncontentimg1'] = aboutsectioncontentimg1c0718;
          codeStates['setaboutsectioncontentimg1'] = setaboutsectioncontentimg1c0718;
          codeStates['aboutsectioncontentimgcard'] = aboutsectioncontentimgcard1df84;
          codeStates['setaboutsectioncontentimgcard'] = setaboutsectioncontentimgcard1df84;
          codeStates['aboutsectioncontentheadingwrapper'] = aboutsectioncontentheadingwrapper82b26;
          codeStates['setaboutsectioncontentheadingwrapper'] = setaboutsectioncontentheadingwrapper82b26;
          codeStates['about_section_content_card_1'] = about_section_content_card_10975b;
          codeStates['setabout_section_content_card_1'] = setabout_section_content_card_10975b;
          codeStates['aboutsectioncontentcard1iconwrapper'] = aboutsectioncontentcard1iconwrapper885d6;
          codeStates['setaboutsectioncontentcard1iconwrapper'] = setaboutsectioncontentcard1iconwrapper885d6;
          codeStates['aboutsectioncontentcard2'] = aboutsectioncontentcard2bb8af;
          codeStates['setaboutsectioncontentcard2'] = setaboutsectioncontentcard2bb8af;
          codeStates['aboutsectioncontentcard2iconwrapper'] = aboutsectioncontentcard2iconwrapper90155;
          codeStates['setaboutsectioncontentcard2iconwrapper'] = setaboutsectioncontentcard2iconwrapper90155;
          codeStates['aboutsectioncontentcards'] = aboutsectioncontentcards42230;
          codeStates['setaboutsectioncontentcards'] = setaboutsectioncontentcards42230;
          codeStates['aboutsectioncontentcardsproject'] = aboutsectioncontentcardsproject39023;
          codeStates['setaboutsectioncontentcardsproject'] = setaboutsectioncontentcardsproject39023;
          codeStates['aboutsectioncontentcardscllient'] = aboutsectioncontentcardscllient4f691;
          codeStates['setaboutsectioncontentcardscllient'] = setaboutsectioncontentcardscllient4f691;
          codeStates['aboutsectioncontentcardsteam'] = aboutsectioncontentcardsteamcea5d;
          codeStates['setaboutsectioncontentcardsteam'] = setaboutsectioncontentcardsteamcea5d;
          codeStates['aboutsectioncontentcardscustomer'] = aboutsectioncontentcardscustomer2cf01;
          codeStates['setaboutsectioncontentcardscustomer'] = setaboutsectioncontentcardscustomer2cf01;
          codeStates['servicesection'] = servicesectionc7118;
          codeStates['setservicesection'] = setservicesectionc7118;
          codeStates['servicesectioncontent'] = servicesectioncontent29fb3;
          codeStates['setservicesectioncontent'] = setservicesectioncontent29fb3;
          codeStates[''] = d29fb;
          codeStates['set'] = setd29fb;
          codeStates[''] = 688bb;
          codeStates['set'] = set688bb;
          codeStates['securityicon'] = securityicon3bde5;
          codeStates['setsecurityicon'] = setsecurityicon3bde5;
          codeStates['iconwrapper'] = iconwrapper5dce2;
          codeStates['seticonwrapper'] = seticonwrapper5dce2;
          codeStates[''] = c5619;
          codeStates['set'] = setc5619;
          codeStates[''] = 1e67b;
          codeStates['set'] = set1e67b;
          codeStates[''] = 4a692;
          codeStates['set'] = set4a692;
          codeStates[''] = 28b18;
          codeStates['set'] = set28b18;
          codeStates[''] = 1d2f0;
          codeStates['set'] = set1d2f0;
          codeStates[''] = c713c;
          codeStates['set'] = setc713c;
          codeStates['testingsection'] = testingsectionfd8df;
          codeStates['settestingsection'] = settestingsectionfd8df;
          codeStates[''] = a3963;
          codeStates['set'] = seta3963;
          codeExecution(code,codeStates);
        }   
        setInitialLoad(true);        
      } catch (err: any) {
        toast(err?.message, 'danger');
      }
    
    }else{
      toast('token not found','danger');
    }    
  }
  const handleClick = () => {
    routes.push("/");
  }
  const handleOnload=()=>{
  }

  useEffect(() => {    
    setMemoryVariables((prev: any) => ({
      ...prev,
      screenName: screenName,    
    }))
    securityCheck();
    handleOnload();
  }, [])
  return (
    <>
     <div className={clsx("",
        "w-full",
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
      )}
     style={{
        gridColumn: '',
        gridRow: '',
        gridAutoRows: '4px',
        columnGap: '0px',
        rowGap: '0px',
        display: "grid",
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: '',
        height: '',
        overflow: '',
        backgroundColor:bgStyle,
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: '',
        color: textStyle,
       // minHeight: '100vh',
        ...(isHighContrast && {
          fontWeight: '500',
          borderWidth: '2px'
      })
      }}>
        {checkherosection && initialLoad &&<GroupHeroSection  
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
        
        {checkaboutsection && initialLoad &&<GroupAboutSection  
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
        
        {checkservicesection && initialLoad &&<GroupServiceSection  
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
        
        {checktestingsection && initialLoad &&<GroupTestingSection  
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
    </>
  )
}
    