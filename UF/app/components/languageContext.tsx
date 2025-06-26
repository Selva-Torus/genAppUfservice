"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from './i18n';
import { getCookie } from './cookieMgment';
import { TotalContext, TotalContextProps } from '../globalContext';
// Create a context for the language
const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  
  const { property, setProperty } = useContext(TotalContext) as TotalContextProps;
  //const [language, setLanguage] = useState<string>(getCookie('language') ? getCookie('language') : 'en');
   let language:string = property?.language

  const handleLanguageChange = (language: string) => {
    //setLanguage(language);
    //document.cookie = `language=${language}`;
    
    i18n.setLang(language); // Assuming i18n is your internationalization utility
  };
  useEffect(() => {
    handleLanguageChange(language)
  }, [language])
  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};


