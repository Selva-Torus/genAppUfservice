'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
// import { logoutRealm } from '../utils/serverFunctions'
import { useTheme } from 'next-themes'
import { IoSunny } from 'react-icons/io5'
import { FaMoon } from 'react-icons/fa'
import { deleteAllCookies, deleteCookie, getCookie } from './cookieMgment'
import i18n from './i18n'
import {  Button, UserLabel } from '@gravity-ui/uikit'
import {ArrowRightFromSquare, Person} from '@gravity-ui/icons';
import decodeToken from './decodeToken'
const LogoutPage = () => {
  const routes = useRouter()
  const { theme, setTheme } = useTheme()
  const token:string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const user=decodedTokenObj.users
  const toggleTheme = () => {
    setTheme(theme == 'dark' ? 'light' : 'dark')
  }

  async function logout() {
    localStorage.clear()
    deleteAllCookies()
    window.location.href = '/'
  }
  const keyset:any=i18n.keyset("language")
  return (
    <div className='flex w-[100%] justify-end'>
      {/*<Switch
        className='select-none'
        checked={theme == 'dark' ? true : false}
        onChange={() => toggleTheme()}
        size='sm'
        color='primary'
        thumbIcon={({ isSelected }) =>
          isSelected ? <IoSunny color='#000' /> : <FaMoon color='#000' />
        }
      ></Switch> */}
      <UserLabel type="person" avatar={{icon: Person}} >{user}</UserLabel>
      <div className="mx-3 h-8 border-l border-gray-300"></div> 
      <Button  onClick={logout} size='m'>
        <ArrowRightFromSquare style={{"height":"25px"}} />
      </Button>
    </div>
  )
}

export default LogoutPage
