"use client";


import { useContext, useEffect, useState } from "react";
import { AxiosService } from "../components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { useGlobal } from "@/context/GlobalContext";
import Image from "next/image";
const borderRadiusMap = {
  xs: '3px',
  s: '3px',
  m: '5px',
  l: '6px',
  xl: '8px',
};

const fontSizeMap = {
  Small: '13px',
  Medium: '15px',
  Large: '17px',
};

const languageMap = {
  Arabic: 'ar',
  French: 'fr',
  English: 'en',
  Tamil: 'ta',
  Russian: 'ru',
};


export const GetSetupKey = ({ children }: { children: React.ReactNode }) => {
  const { property, setProperty } = useContext(TotalContext) as TotalContextProps;
  const { setTheme, setLanguage, setDirection, updateBranding, setAppBackgroundImage,setDisplayFormat } = useGlobal();

  interface FontSizeData {
  preferredVw: string;
  minPx: string;
  maxPx: string;
  }

  interface SetupKeyData {
    direction: string;
    layoutMode: string;
    navigationStyles: string;
    sidebarStyle: string;
    brandColor: string;
    hoverColor: string;
    selectionColor: string;
    menubarColor: string;
    topbarColor: string;
    borderRadius: keyof typeof borderRadiusMap;
    fontSize: FontSizeData;
    language: keyof typeof languageMap;
    theme?: string;
    'page-bg-color':string;
    'group-bg-color':string;
    appBackgroundImage : string | undefined;
    localization:any
  }

  const [data, setData] = useState<SetupKeyData | null>(null);
  const { token } = useGlobal();
  const encryptionFlagApp: boolean = true;
  const encryptionDpd: string = "CK:CT010:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:A001:AFK:defaultDPD:AFVK:v1";
  const encryptionMethod: string = "";
  const fetchSetupKey = async () => {
    try {
      let setUpKeyDto:any = {key:"CK:TGA:FNGK:SETUP:FNK:SF:CATK:CT010:AFGK:AG001:AFK:A001:AFVK:v1:appearance"
};
      if (encryptionFlagApp) {
        setUpKeyDto["dpdKey"] = encryptionDpd;
        setUpKeyDto["method"] = encryptionMethod;
      }
      const response = await AxiosService.post("/UF/setUpKey",setUpKeyDto,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }});
      setData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSetupKey();
  }, []);

  useEffect(() => {
    if (data) {
      const { direction, layoutMode, navigationStyles, sidebarStyle, brandColor, hoverColor, selectionColor,menubarColor,topbarColor,theme } = data;
      const borderRadius = borderRadiusMap[data?.borderRadius] || '3px';
      const { minPx, preferredVw, maxPx } = data.fontSize ?? {};
      const fontSizeClamp = minPx && preferredVw && maxPx
        ? `clamp(${minPx}px, ${preferredVw}vw, ${maxPx}px)`
        : 'clamp(13px, 0.9vw, 18px)';
      const language = languageMap[data?.language] || 'en';
      const dateDisplayData=data?.localization?.datetime?.display||{}
      const currencyDisplayData=data?.localization?.currency?.display||{}
      const bgImage = `url("${process.env.NEXT_PUBLIC_FTP_OUTPUT_HOST}/${data['appBackgroundImage']}")`;
      // Set CSS variables for legacy components
      document.documentElement.style.setProperty('--brand-color', brandColor);
      document.documentElement.style.setProperty('--selection-color', selectionColor);
      document.documentElement.style.setProperty('--hover-color', hoverColor);
      document.documentElement.style.setProperty('--border-radius', borderRadius);
      document.documentElement.style.setProperty('--font-size-base', fontSizeClamp);
      document.documentElement.style.setProperty('--app-bg-image', bgImage);
      // document.documentElement.style.setProperty('--page-bg-color', data['page-bg-color']);
      // document.documentElement.style.setProperty('--group-bg-color', data['group-bg-color']);

      // Update TotalContext for legacy components
      setProperty({ language, direction, layoutMode, navigationStyles, sidebarStyle, brandColor, selectionColor, hoverColor }); //add menubarColor,topbarColor

      // Update GlobalContext (primary theme system)
      // Set theme - normalize the theme value and always set it
      let normalizedTheme = theme?.toLowerCase();
      console.log('Theme from API:', theme, 'Normalized:', normalizedTheme);

      if (token ==='' || (token !== '' && !getCookie('cfg_theme') )) {
        if (normalizedTheme && (normalizedTheme === 'light' || normalizedTheme === 'dark' || normalizedTheme === 'light-hc' || normalizedTheme === 'dark-hc')) {
          console.log('Setting theme to:', normalizedTheme);
          setTheme(normalizedTheme as any);
        } else {
          // Default to light theme if no valid theme is provided
          console.log('No valid theme from API, defaulting to light');
          setTheme('light');
        }        
      }else{
        setTheme(getCookie('cfg_theme') as any);
      }
      /////////////
      let localizationdata={
        datedisplay:"DD-MM-YYYY",
        timedisplay:"HH:mm[:ss]",
        currencyDisplayFormat:"₹",
        decimal_places:3
      }
      if("date" in dateDisplayData)
      {
        localizationdata={...localizationdata,datedisplay:dateDisplayData?.date?.value||"DD-MM-YYYY"}
      }
      if("time" in dateDisplayData)
      {
        localizationdata={...localizationdata,timedisplay:dateDisplayData?.time?.value||"HH:mm[:ss]"}
      }
      if("symbol" in currencyDisplayData)
      {
        localizationdata={...localizationdata,currencyDisplayFormat:currencyDisplayData?.symbol||"₹"}
      }
      if("decimal_places" in currencyDisplayData)
      {
        localizationdata={...localizationdata,decimal_places:currencyDisplayData?.decimal_places||null}
      }
      setDisplayFormat((pre:any)=>({
        ...pre,
        datePickerProperty:{...pre.datePickerProperty, dateDisplayFormat:localizationdata?.datedisplay},
        textInputProperty:{...pre.textInputProperty, currencyDisplayFormat:localizationdata?.currencyDisplayFormat,decimal_places:localizationdata?.decimal_places},
        timePickerProperty:{...pre.timePickerProperty, timeDisplayFormat:localizationdata?.timedisplay},
      }))
      //////////////

      // Set language
      if (data.language) {
        const langMap: Record<string, string> = {
          'Arabic': 'Arabic',
          'French': 'French',
          'English': 'English',
          'Tamil': 'Tamil',
          'Russian': 'Russian',
        };
        const mappedLanguage = langMap[data.language] || 'English';
        setLanguage(mappedLanguage as any);
      }

      // Set direction
      if (direction && (direction === 'LTR' || direction === 'RTL')) {
        setDirection(direction as any);
      }

      // Update branding
      updateBranding({
        fontSize: fontSizeClamp,
        brandColor: brandColor,
        selectionColor: selectionColor,
        hoverColor: hoverColor,
        borderRadius: data.borderRadius as any || 's',
      });

      // Set background image in global context (full URL)
      const fullBgImageUrl = data['appBackgroundImage']
        ? `${process.env.NEXT_PUBLIC_FTP_OUTPUT_HOST}/${data['appBackgroundImage']}`
        : undefined;
      setAppBackgroundImage(fullBgImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!data) return <div className='flex w-[100vw] h-[100vh] bg-slate-200 justify-center items-center '><span>Loading...</span></div>;


  return <div>{children}</div>;
};
