"use client";

import { useContext, useEffect, useState } from "react";
import { AxiosService } from "../components/axiosService";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
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
    fontSize: keyof typeof fontSizeMap;
    language: keyof typeof languageMap;
    'page-bg-color':string;
    'group-bg-color':string;
  }

  const [data, setData] = useState<SetupKeyData | null>(null);
  const token:string = getCookie('token'); 
  const encryptionFlagApp: boolean = true;
  const encryptionDpd: string = "CK:CT003:FNGK:AF:FNK:CDF-DPD:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixtestdpd:AFVK:v1";
  const encryptionMethod: string = "";
  const fetchSetupKey = async () => {
    try {
      let setUpKeyDto:any = {key:"CK:TGA:FNGK:SETUP:FNK:SF:CATK:CT003:AFGK:AG001:AFK:oprmatrix:AFVK:v1:appearance"};
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
      const { direction, layoutMode, navigationStyles, sidebarStyle, brandColor, hoverColor, selectionColor,menubarColor,topbarColor } = data;
      const borderRadius = borderRadiusMap[data?.borderRadius] || '3px';
      const fontSize = fontSizeMap[data?.fontSize] || '13px';
      const language = languageMap[data?.language] || 'en';

      document.documentElement.style.setProperty('--brand-color', brandColor);
      document.documentElement.style.setProperty('--selection-color', selectionColor);
      document.documentElement.style.setProperty('--hover-color', hoverColor);
      document.documentElement.style.setProperty('--border-radius', borderRadius);
      document.documentElement.style.setProperty('--g--font-size', fontSize);
     // document.documentElement.style.setProperty('--page-bg-color', data['page-bg-color']);
     // document.documentElement.style.setProperty('--group-bg-color', data['group-bg-color']);

      setProperty({ language, direction, layoutMode, navigationStyles, sidebarStyle,brandColor,selectionColor,hoverColor }); //add menubarColor,topbarColor
    }
  }, [data, setProperty]);

  if (!data) return <div className='flex w-[100vw] h-[100vh] bg-slate-200 justify-center items-center '><span>Loading...</span></div>;


  return <div>{children}</div>;
};
