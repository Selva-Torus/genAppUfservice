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
import Groupoutside board  from "./Groupoutside board/Groupoutside board";


export default function PageMenuItem4V1() {
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
  const screenName:string = "menu item 4";
  const user = decodedTokenObj?.selectedAccessProfile;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refetch, setRefetch} = useContext(TotalContext) as TotalContextProps;
  const { encAppFalg,setEncAppFalg}= useContext(TotalContext) as TotalContextProps;
  const {lockedData, setLockedData} = useContext(TotalContext) as TotalContextProps;
  const {paginationDetails, setpaginationDetails} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const { eventEmitterData,setEventEmitterData}= useContext(TotalContext) as TotalContextProps;
  const {dashboard3_v1Props, setdashboard3_v1Props} = useContext(TotalContext) as TotalContextProps;
  const [checkoutside board,setCheckoutside board,]=useState(false);
  const [checkheader,setCheckheader,]=useState(false);
  const [checkside,setCheckside,]=useState(false);
  const [checkcard2,setCheckcard2,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checkcard3,setCheckcard3,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checkcard4,setCheckcard4,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checkcard1,setCheckcard1,]=useState(false);
  const [check,setCheck,]=useState(false);
  const [checktable,setChecktable,]=useState(false);
  const {outside board012f9, setoutside board012f9} = useContext(TotalContext) as TotalContextProps;
  const {headera5dfc, setheadera5dfc} = useContext(TotalContext) as TotalContextProps;
  const {side5fa55, setside5fa55} = useContext(TotalContext) as TotalContextProps;
  const {card2a34c5, setcard2a34c5} = useContext(TotalContext) as TotalContextProps;
  const {5f38e, set5f38e} = useContext(TotalContext) as TotalContextProps;
  const {card35fd72, setcard35fd72} = useContext(TotalContext) as TotalContextProps;
  const {0cce7, set0cce7} = useContext(TotalContext) as TotalContextProps;
  const {card42e38a, setcard42e38a} = useContext(TotalContext) as TotalContextProps;
  const {6b783, set6b783} = useContext(TotalContext) as TotalContextProps;
  const {card1dced1, setcard1dced1} = useContext(TotalContext) as TotalContextProps;
  const {dd147, setdd147} = useContext(TotalContext) as TotalContextProps;
  const {table45205, settable45205} = useContext(TotalContext) as TotalContextProps;
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
    const orchestrationData = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1",accessProfile:[user],from:"pageMenuItem4V1"},{
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
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1"
            }
          }) 
        }else{
          introspect = await AxiosService.get("/UF/introspect",{
            headers: {
              Authorization: `Bearer ${token}`
             },
            params: {
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1"  
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
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1"
            }
        }) 
        }else{
          myAccount = await AxiosService.get("/UF/myAccount-for-client",{
           headers: {
             Authorization: `Bearer ${token}`
           },
            params: {
              key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1"
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
            if(nodes?.groupName == 'outside board' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckoutside board(true)
            }
            if(nodes?.groupName == 'header' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckheader(true)
            }
            if(nodes?.groupName == 'side' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckside(true)
            }
            if(nodes?.groupName == 'card2' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckcard2(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'card3' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckcard3(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'card4' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckcard4(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'card1' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheckcard1(true)
            }
            if(nodes?.groupName == '' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setCheck(true)
            }
            if(nodes?.groupName == 'table' && (nodes?.security== 'AA' || nodes?.security == 'ATO'))
            {
              setChecktable(true)
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
          codeStates['outside board'] = outside board012f9;
          codeStates['setoutside board'] = setoutside board012f9;
          codeStates['header'] = headera5dfc;
          codeStates['setheader'] = setheadera5dfc;
          codeStates['side'] = side5fa55;
          codeStates['setside'] = setside5fa55;
          codeStates['card2'] = card2a34c5;
          codeStates['setcard2'] = setcard2a34c5;
          codeStates[''] = 5f38e;
          codeStates['set'] = set5f38e;
          codeStates['card3'] = card35fd72;
          codeStates['setcard3'] = setcard35fd72;
          codeStates[''] = 0cce7;
          codeStates['set'] = set0cce7;
          codeStates['card4'] = card42e38a;
          codeStates['setcard4'] = setcard42e38a;
          codeStates[''] = 6b783;
          codeStates['set'] = set6b783;
          codeStates['card1'] = card1dced1;
          codeStates['setcard1'] = setcard1dced1;
          codeStates[''] = dd147;
          codeStates['set'] = setdd147;
          codeStates['table'] = table45205;
          codeStates['settable'] = settable45205;
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
        {checkoutside board && initialLoad &&<Groupoutside board  
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
    