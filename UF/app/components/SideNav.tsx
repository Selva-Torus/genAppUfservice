'use client'
import {
  Avatar,
  DropdownMenu,
  Tooltip,
} from '@gravity-ui/uikit'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { MenuItem, MenuStructure } from '../interfaces/interfaces'
import Image from 'next/image'
import { isLightColor } from './utils'
import { FileGallery } from '../utils/svgApplications'
import { useGravityThemeClass } from '../utils/useGravityUITheme'

const SideNav = ({
  navData,
  mode = 'fluid',
  sidebarStyle = 'default',
  fullView,
  setFullView,
  selectionColor,
  brandColor,
  hoverColor,
  userDetails
}: {
  navData: MenuStructure
  mode?: 'fluid' | 'closed' | 'detached'
  sidebarStyle:
    | 'default'
    | 'compact'
    | 'condensed'
    | 'hoverView'
    | 'fullLayout'
    | 'hidden'
  fullView: boolean
  setFullView: React.Dispatch<React.SetStateAction<boolean>>
  selectionColor: string
  brandColor: string
  hoverColor: string
  userDetails: any
}) => {
  const router = useRouter()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const selectedAccessProfile = decodedTokenObj?.selectedAccessProfile
  const pathname = usePathname()
  const themeClass = useGravityThemeClass()

  const getNestedMenu = (menu: MenuItem): any => {
    const nestedMenu = []
    for (const screen of menu.screenDetails) {
      nestedMenu.push({
        text: (
          <p
            className='m-0 p-0'
            style={{
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {screen.label ?? screen.name}
          </p>
        ),
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
        },
        icon: screen.icon ? (
          <Image
            className='h-[16px] w-[20px]'
            width={100}
            height={100}
            alt='icon'
            src={screen.icon}
            style={{
              filter:
                themeClass.includes('dark')
                  ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                  : 'unset'
            }}
          />
        ) : (
          <span>
            <FileGallery
              height='20'
              width='20'
              fill={themeClass.includes('dark') ? '#ffffff' : '#000000'}
            />
          </span>
        )
      })
    }

    if (menu.items) {
      for (const item of menu.items) {
        nestedMenu.push({
          text: (
            <p
              style={{
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {' '}
              {item.menuGroupLabel}{' '}
            </p>
          ),
          items: getNestedMenu(item),
          icon: item.icon ? (
            <Image
              className='h-[16px] w-[20px]'
              width={100}
              height={100}
              alt='icon'
              src={item.icon}
              style={{
                filter: themeClass.includes('dark')
                  ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                  : 'unset'
              }}
            />
          ) : (
            <FileGallery
              height='20'
              width='20'
              fill={themeClass.includes('dark') ? '#ffffff' : '#000000'}
            />
          )
        })
      }
    }
    return nestedMenu
  }

  const getMenuClassName = () => {
    if (sidebarStyle == 'compact') {
      return 'flex flex-col gap-[0.25vh] cursor-pointer items-center'
    }
    return `flex ${sidebarStyle === 'condensed' ? 'flex-col' : 'flex-row'} gap-[0.95vh] cursor-pointer items-center`
  }

  async function logout() {
    localStorage.clear()
    sessionStorage.clear()
    deleteAllCookies()
    window.location.href = '/ct003/ag001/oprmatrix/v1'
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
    (menuGroup: any, imageUrl?: boolean) => {
      const menuGrp = navData.find(item => item.menuGroup === menuGroup)
      const currentScreen = pathname.includes('_')
        ? pathname.split('/').pop()?.split('_').slice(0, -1).join('_') || ''
        : pathname.split('/').pop() || ''

      const selectedRoute = hasMatchingName(menuGrp, currentScreen)
      if (selectedRoute) {
        if (imageUrl) {
          return true
        }
        return {
          backgroundColor: brandColor,
          height: '6vh',
          color: isLightColor(brandColor)
        }
      }

      return {
        backgroundColor: 'transparent',
        height: '6vh',
        color: 'unset'
      }
    },
    [hoverColor, brandColor, sidebarStyle]
  )

  const menuPlacement = useMemo(() => {
    if (fullView) return 'flex-start'
    return 'center'
  }, [fullView])
  return (
    <div
      className={`g-root flex h-full flex-col items-center justify-between px-2 py-2 ${themeClass}`}
    >
      <div
        className='scrollbar-none flex max-h-[80vh] w-full flex-col gap-[0.25vh] overflow-x-hidden overflow-y-scroll pt-2 '
        onMouseEnter={() => sidebarStyle == 'hoverView' && setFullView(true)}
        onMouseLeave={() => sidebarStyle == 'hoverView' && setFullView(false)}
        style={{ alignItems: menuPlacement }}
      >
        {navData &&
          navData.map((menu, index): any => {
            if (menu.menuGroup) {
              return (
                <Tooltip
                  key={index}
                  openDelay={0}
                  content={menu.menuGroupLabel}
                  placement={'right'}
                  disabled={fullView}
                  style={{
                    backgroundColor: `${brandColor}`,
                    color: isLightColor(brandColor)
                  }}
                >
                  <button
                    key={index}
                    className={` flex cursor-pointer items-center justify-center gap-2 px-1 py-1 transition delay-150 duration-300 ease-in-out ${sidebarStyle === 'compact' || sidebarStyle === 'hoverView' ? 'w-[80%]' : 'w-[98%]'} rounded-md `}
                    style={
                      getDropDownStyles(
                        menu.menuGroup,
                        false
                      ) as React.CSSProperties
                    }
                  >
                    <DropdownMenu
                      renderSwitcher={(props: any) => (
                        <div
                          {...props}
                          className={`flex cursor-pointer items-center justify-center bg-transparent`}
                        >
                          {fullView ? (
                            <div className={`${getMenuClassName()} w-[100%]`}>
                              <div className='flex w-[20%] items-center justify-end'>
                                {menu.icon ? (
                                  <Image
                                    className='h-[16px] w-[20px]'
                                    width={100}
                                    height={100}
                                    alt='icon'
                                    src={menu.icon}
                                    style={{
                                      filter:
                                        typeof getDropDownStyles(
                                          menu.menuGroup,
                                          true
                                        ) == 'boolean' ||
                                        themeClass.includes('dark')
                                          ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                                          : 'unset'
                                    }}
                                  />
                                ) : (
                                  <FileGallery
                                    height='20'
                                    width='20'
                                    fill={
                                    typeof getDropDownStyles(
                                        menu.menuGroup,
                                        true
                                      ) == 'boolean' ? isLightColor(brandColor) :
                                      themeClass.includes('dark')
                                        ? '#fff'
                                        : '#1C274C'
                                    }
                                  />
                                )}
                              </div>
                              <span
                                style={{
                                  padding: '0px',
                                  width: '80%',
                                  display: 'flex',
                                  justifyContent: `${sidebarStyle === 'condensed' ? 'center' : 'flex-start'}`,
                                  alignItems: 'center'
                                }}
                                className='flex items-center justify-center whitespace-nowrap bg-transparent pl-2 text-center transition-all delay-0 duration-75 ease-in-out'
                              >
                                <p
                                  className='max-w-[100px] truncate font-medium leading-[2vh]'
                                  style={{
                                    transition: 'all 0.2s ease-in-out'
                                  }}
                                >
                                  {menu.menuGroupLabel}
                                </p>
                              </span>
                            </div>
                          ) : (
                            <span className='flex items-center'>
                              {menu.icon ? (
                                <Image
                                  className='h-[16px] w-[20px]'
                                  width={100}
                                  height={100}
                                  alt='icon'
                                  src={menu.icon}
                                  style={{
                                    filter:
                                      typeof getDropDownStyles(
                                        menu.menuGroup,
                                        true
                                      ) == 'boolean' ||
                                      themeClass.includes('dark')
                                        ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                                        : 'unset'
                                  }}
                                />
                              ) : (
                                <FileGallery
                                  height='20'
                                  width='20'
                                  fill={
                                  typeof getDropDownStyles(
                                        menu.menuGroup,
                                        true
                                      ) == 'boolean' ? isLightColor(brandColor) :
                                    themeClass.includes('dark')
                                      ? '#fff'
                                      : '#1C274C'
                                  }
                                />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                      key={index}
                      items={getNestedMenu(menu)}
                      popupProps={{
                        style: {
                          backgroundColor: brandColor,
                          color: `${isLightColor(brandColor)}`
                        },
                        placement: `${sidebarStyle !== 'compact' ? 'bottom-end' : 'right-end'}`
                      }}
                      switcherWrapperClassName='bg-transparent w-[100%] flex items-center justify-center'
                    />
                  </button>
                </Tooltip>
              )
            } else {
              const routingName =
                '/' +
                menu.screenDetails[0].name.replace(/ /g, '_') +
                '_' +
                menu.screenDetails[0].key.split(':').at(-1)
              return (
                <Tooltip
                  key={index}
                  openDelay={0}
                  content={menu.menuGroupLabel}
                  placement={'right'}
                  disabled={fullView}
                  style={{
                    backgroundColor: brandColor
                  }}
                >
                  <div
                    key={index}
                    className={`${getMenuClassName()} rounded bg-transparent p-[0.8vw]`}
                    onClick={() => router.push(routingName)}
                    style={{
                      backgroundColor:
                        routingName == pathname
                          ? `${brandColor}`
                          : 'transparent',
                      width: '100%',
                      justifyContent: fullView ? 'unset' : 'center',
                      color:
                        routingName == pathname
                          ? `${isLightColor(brandColor)}`
                          : 'unset'
                    }}
                  >
                    {menu.screenDetails[0].icon ? (
                      <Image
                        className='h-[16px] w-[20px]'
                        width={100}
                        height={100}
                        alt='icon'
                        src={menu.screenDetails[0].icon}
                        style={{
                          filter:
                            routingName == pathname || themeClass.includes('dark')
                              ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                              : 'unset'
                        }}
                      />
                    ) : (
                      <FileGallery
                        height='20'
                        width='20'
                        fill={
                          routingName == pathname 
                            ? `${isLightColor(brandColor)}`
                            : themeClass.includes('dark') ? '#fff' : '#1C274C'
                        }
                      />
                    )}
                    {fullView && (
                      <button key={index}>{menu.menuGroupLabel}</button>
                    )}
                  </div>
                </Tooltip>
              )
            }
          })}
      </div>
      <div className='flex w-full items-center justify-center'>
        {fullView ? (
          <FullViewAvatar
            brandColor={brandColor}
            logout={logout}
            user={user}
            fullView={fullView}
            userDetails={userDetails}
            selectedAccessProfile={selectedAccessProfile}
          />
        ) : (
          <PartialViewAvatar
            brandColor={brandColor}
            logout={logout}
            user={user}
            fullView={fullView}
            userDetails={userDetails}
          />
        )}
      </div>
    </div>
  )
}

export default SideNav

const FullViewAvatar = ({
  logout,
  user,
  brandColor,
  fullView,
  userDetails,
  selectedAccessProfile
}: {
  fullView: boolean
  logout: () => void
  user: string
  brandColor: string
  userDetails: any
  selectedAccessProfile: string
}) => {
  const router = useRouter()
  const tp_ps = getCookie('tp_ps')
  return (
    <div
      className='flex w-full items-center justify-center  gap-1 rounded-md px-2 py-1 shadow-md'
      style={{
        backgroundColor: brandColor
      }}
    >
      <DropdownMenu
        renderSwitcher={(props: any) => (
          <div
            className='flex w-[100%] items-center justify-center bg-transparent'
            {...props}
          >
            <div className='flex w-[40%] items-center justify-start '>
              <Avatar
                imgUrl={userDetails?.profile}
                size='m'
                className={`${!fullView ? 'hidden opacity-0' : 'block opacity-100'} transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
              />
            </div>
            <div className='flex w-[60%] select-none flex-col items-start justify-start '>
              <span
                className='text-start font-bold'
                style={{
                  color: isLightColor(brandColor)
                }}
              >
                {' '}
                {user}{' '}
              </span>
              <span
                className='text-start font-semibold '
                style={{
                  color: `${isLightColor(brandColor)}`
                }}
              >
                {selectedAccessProfile}
              </span>
            </div>
          </div>
        )}
        switcherWrapperClassName='w-[100%] flex items-center justify-center'
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
            color: isLightColor(brandColor)
          },
          placement: 'right-end'
        }}
      />
    </div>
  )
}

const PartialViewAvatar = ({
  logout,
  user,
  brandColor,
  fullView,
  userDetails
}: {
  fullView: boolean
  logout: () => void
  user: string
  brandColor: string
  userDetails: any
}) => {
  const router = useRouter()
  const tp_ps = getCookie('tp_ps')
  return (
    <>
      <DropdownMenu
        renderSwitcher={(props: any) => (
          <div
            className='flex w-[100%] items-center justify-center bg-transparent'
            {...props}
          >
            <Avatar
              imgUrl={userDetails?.profile}
              size='m'
              className={`${fullView ? 'hidden opacity-0' : 'block opacity-100'} transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
            />
          </div>
        )}
        switcherWrapperClassName='w-[100%] flex items-center justify-center'
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
            color: isLightColor(brandColor)
          },
          placement: 'right-end'
        }}
      />
    </>
  )
}