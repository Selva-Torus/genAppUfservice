'use client'
import {
  Button,
  Col,
  Container,
  Direction,
  DropdownMenu,
  Row,
  ThemeProvider
} from '@gravity-ui/uikit'
import React, { useContext, useEffect, useState } from 'react'
import { getCookie } from './cookieMgment';
import { useLanguage } from './languageContext';

import LogoutPage from './logout';
import i18n from './i18n';
import { TotalContext, TotalContextProps } from '../globalContext';
const ThemeS = ({ children }: any) => {
  
  //let selectedDirection:Direction = 'direction?.toLowerCase() '

  const { property, setProperty , selectedTheme , setSelectedTheme } = useContext(TotalContext) as TotalContextProps;

  const selectedDirect = property?.direction?.toLowerCase() as Direction;
  const [loading,setLoading] = useState(true)
 

  {/*  const handleAction1 = (direction: Direction) => {
    setSelectedDirect(direction)
  } */}

  const { language, handleLanguageChange } = useLanguage(); 
  const selectedLanguage = getCookie('language') ? getCookie('language') : 'en';
  
  useEffect(() => {
    
    if(typeof window !='undefined'){
      setLoading(false)
  }}, [])
  if(loading){
    return<></>
  }
  const keyset:any=i18n.keyset("language")
  return (
    <ThemeProvider theme={selectedTheme} direction={selectedDirect}>
      <Container style={{padding:"0px"}}  >
        <Row space={0} className='rounded-lg '>
            {/*<Col>
            <DropdownMenu
              renderSwitcher={props => (
                <Button {...props}>{selectedOption}</Button>
              )}
              items={[
                { action: () => handleAction('light'), text: 'light' },
                { action: () => handleAction('light-hc'), text: 'light-hc' },
                { action: () => handleAction('dark'), text: 'dark' },
                { action: () => handleAction('dark-hc'), text: 'dark-hc' }
              ]}
            />
          </Col>  */}

          <Col className='flex justify-end '>
            {/*<DropdownMenu
              renderSwitcher={props => (
                <Button {...props}>
                  {selectedDirect ? keyset(selectedDirect) : keyset('Direction')}
                </Button>
              )}
              items={[
                { action: () => handleAction1('ltr'), text: keyset('left to right') },
                { action: () => handleAction1('rtl'), text: keyset('right to left') }
              ]}
            /> */}
            {/* <DropdownMenu
              renderSwitcher={props => (
                <Button {...props}>
                  {language ? selectedLanguage : 'Select Language'}
                </Button>
              )}
              items={[
                { action: () => handleLanguageChange('ta'), text: 'Tamil' },
                { action: () => handleLanguageChange('ar'), text: 'Arabic' },
                { action: () => handleLanguageChange('en'), text: 'English' },
                { action: () => handleLanguageChange('fr'), text: 'French' },
                { action: () => handleLanguageChange('ru'), text: 'Russian' }
              ]}
            />  */}
          </Col>
         
        </Row>
        
        {children}
      </Container>
    </ThemeProvider>
  )
}

export default ThemeS
