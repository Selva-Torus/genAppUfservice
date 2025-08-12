import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { Logo } from '@/app/components/Logo'
import { DropdownMenu, UserLabel } from '@gravity-ui/uikit'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MenuItem, MenuStructure } from '../interfaces/interfaces'
import { isLightColor } from './utils'
import Image from 'next/image'
import {PersonFill} from '@gravity-ui/icons';
import { useGravityThemeClass } from '../utils/useGravityUITheme'

const TopNav = ({
  navData,
  listMenuItems = true,
  mode,
  selectionColor = '#fff',
  brandColor = '#fff',
  hoverColor = '#fff',
 // topbarColor = '#fff',
  appName,
  logo,
  userDetails
}: {
  navData: MenuStructure
  listMenuItems?: boolean
  mode: string
  selectionColor: string
  brandColor: string
  hoverColor: string
//  topbarColor: string
  appName: string
  logo?: string
  userDetails:any
}) => {
  const router = useRouter()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>(navData || [])
  const [hiddenItems, setHiddenItems] = useState<MenuItem[]>([])
  const tp_ps = getCookie('tp_ps')
  const themeClass = useGravityThemeClass()
  useEffect(() => {
    const checkOverflow = () => {
      if (!menuRef.current) return

      const containerWidth = menuRef.current.clientWidth
      const maxWidth = window.innerWidth * 0.62 // 62vw
      let totalWidth = 0
      let newVisible = []
      let newHidden = []

      for (let menu of navData) {
        const testElement = document.createElement('div')
        testElement.style.visibility = 'hidden'
        testElement.style.position = 'absolute'
        testElement.style.whiteSpace = 'nowrap'
        testElement.textContent = menu.menuGroup || menu.screenDetails[0]?.name
        document.body.appendChild(testElement)

        const itemWidth = testElement.clientWidth + 50 // Add padding/margin
        document.body.removeChild(testElement)

        if (totalWidth + itemWidth < maxWidth) {
          newVisible.push(menu)
          totalWidth += itemWidth
        } else {
          newHidden.push(menu)
        }
      }

      setVisibleItems(newVisible)
      setHiddenItems(newHidden)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [navData])

  const getNestedMenu = (menu: MenuItem): any => {
    const nestedMenu = []
    for (const screen of menu.screenDetails) {
      nestedMenu.push({
        text: screen.label ?? screen.name.split('-')[0].replace('_', ' '),
        action: () => {
          if (screen.static) {
            router.push('/' + screen.name.replace(/ /g, '_'))
          } else {
            router.push(
              '/' +
                screen.name.replace(/ /g, '_') +
                '_' +
                screen.key.split(':').at(-1)
            )
          }
        }
      })
    }

    if (menu.items) {
      for (const item of menu.items) {
        nestedMenu.push({
          text: item.menuGroupLabel,
          items: getNestedMenu(item)
        })
      }
    }
    return nestedMenu
  }

  async function logout() {
    localStorage.clear()
    deleteAllCookies()
    window.location.href = '/ct003/cg/tg2/v11'
  }
  const hasMatchingName = (obj: any, input: string): boolean => {
    if (typeof obj !== 'object' || obj === null) return false

    for (const key in obj) {
      if (key === 'name' && obj[key] === input) {
        return true
      }
      if (typeof obj[key] === 'object') {
        if (hasMatchingName(obj[key], input)) {
          return true
        }
      }
    }

    return false
  }

  const getDropDownStyles = useCallback(
    (menuGroup: any) => {
      const menuGrp = navData.find(item => item.menuGroup === menuGroup)
      const currentScreen = pathname.split('/').pop()?.split('_')[0] || ''
      const selectedRoute = hasMatchingName(menuGrp, currentScreen)
      if (selectedRoute) {
        return {
          backgroundColor: brandColor,
          color: isLightColor(brandColor)
        }
      }

      return {
        backgroundColor: 'transparent',
        color: 'unset'
      }
    },
    [hoverColor, brandColor]
  )

  return (
    <div
      suppressHydrationWarning
      className={`flex items-center justify-between p-2 ${mode === 'detached' ? 'shadow-md' : ''} g-root ${themeClass} `}
      // style={{ backgroundColor: topbarColor }}
    >
      <div className='flex items-center gap-1'>
        {logo ? (
          <img
            className='h-[1.1vw] w-[1.25vw]'
            width={100}
            height={100}
            src={logo}
            alt='logo'
          />
        ) : (
          <Logo />
        )}
        <h3
          className='text-center text-[1.5vw] font-bold '
          // style={{
          //  color: brandColor
          // }}
        >
          {appName}
        </h3>
      </div>
      {listMenuItems && (
        <>
          <div
            className='flex max-w-[62vw] items-center gap-2 overflow-hidden'
            ref={menuRef}
          >
            {navData &&
              visibleItems.map((menu, index) => {
                if (menu.menuGroup) {
                  return (
                    <button
                      key={index}
                      className='rounded-full px-[0.85vw]  py-[0.5vh]'
                      style={getDropDownStyles(menu.menuGroup)}
                    >
                      <DropdownMenu
                        renderSwitcher={(props: any) => (
                          <p
                            {...props}
                            className='max-w-[5.55vw] truncate text-[0.83vw] font-medium leading-[1.5vh]'
                            style={{
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            {menu.menuGroupLabel}
                          </p>
                        )}
                        key={index}
                        items={getNestedMenu(menu)}
                        popupProps={{
                          style: {
                            backgroundColor: brandColor,

                            fontSize: '0.82vw',
                            color: `${isLightColor(brandColor)}`
                          }
                        }}
                      />
                    </button>
                  )
                } else {
                  const routingName =
                    '/' +
                    menu.screenDetails[0].name.replace(/ /g, '_') +
                    '_' +
                    menu.screenDetails[0].key.split(':').at(-1)
                  return (
                    <button
                      style={{
                        backgroundColor:
                          routingName == pathname
                            ? `${brandColor}`
                            : 'transparent',
                        color:
                          routingName == pathname
                            ? `${isLightColor(brandColor)}`
                            : 'unset'
                      }}
                      className='rounded-full px-[0.85vw]  py-[0.5vh] text-[0.83vw]'
                      key={index}
                      onClick={() => router.push(routingName)}
                    >
                      {menu.menuGroupLabel}
                    </button>
                  )
                }
              })}
            {hiddenItems.length > 0 && (
              <DropdownMenu
                renderSwitcher={(props: any) => (
                  <button
                    {...props}
                    className='rounded-full px-[0.85vw] py-[0.5vh]'
                  >
                    ...
                  </button>
                )}
                items={hiddenItems.map(menu => {
                  if (menu.menuGroup) {
                    return {
                      text: menu.menuGroupLabel,
                      items: getNestedMenu(menu)
                    }
                  } else {
                    return {
                      text: menu.menuGroupLabel,
                      action: () => {
                        if (menu.screenDetails) {
                          const routingName =
                            '/' +
                            menu.screenDetails[0].name.replace(/ /g, '_') +
                            '_' +
                            menu.screenDetails[0].key.split(':').at(-1)
                          router.push(routingName)
                        }
                      }
                    }
                  }
                })}
                popupProps={{
                  style: {
                    backgroundColor: brandColor,
                    fontSize: '0.82vw',
                    color: `${isLightColor(brandColor)}`
                  }
                }}
              />
            )}
          </div>
          <div>
            <DropdownMenu
              renderSwitcher={(props: any) => (
                <UserLabel
                  type='person'
                  avatar={userDetails?.profile}
                  {...props}
                >
                  {' '}
                  {user}
                </UserLabel>
              )}
              items={[
                {
                  text: user,
                  action: () => {},
                  selected: true
                },
                {
                  text: 'Switch accessProfile',
                  action: () => {
                    if (tp_ps) {
                      router.push('/select-context')
                    }
                  }
                },
                {
                  text: 'Log out',
                  action: () => {
                    logout()
                  }
                }
              ]}
              popupProps={{
                style: {
                  backgroundColor: brandColor,

                  fontSize: '0.82vw',
                  color: `${isLightColor(brandColor)}`
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TopNav