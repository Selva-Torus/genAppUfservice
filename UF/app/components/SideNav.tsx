import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { MenuItem, MenuStructure } from '../interfaces/interfaces'
import Image from 'next/image'
import { isLightColor } from './utils'
import { FileGallery } from '../utils/svgApplications'
import { Tooltip } from '@/components/Tooltip'
import { DropdownMenu } from '@/components/DropdownMenu'
import { Avatar } from '@/components/Avatar'
import { useTheme } from '@/hooks/useTheme'
import { twMerge } from 'tailwind-merge'
import { getCdnImage } from '../utils/getAssets'
import { Button } from '@/components/Button'

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
  const { isDark } = useTheme()

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
            src={getCdnImage(screen.icon)}
            style={{
              filter: isDark
                ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                : 'unset'
            }}
          />
        ) : (
          <span>
            <FileGallery
              height='20'
              width='20'
              fill={isDark ? '#ffffff' : '#000000'}
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
              src={getCdnImage(item.icon)}
              style={{
                filter: isDark
                  ? 'invert(1) sepia(1) hue-rotate(180deg) saturate(3)'
                  : 'unset'
              }}
            />
          ) : (
            <FileGallery
              height='20'
              width='20'
              fill={isDark ? '#ffffff' : '#000000'}
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
    return `flex ${
      sidebarStyle === 'condensed' ? 'flex-col' : 'flex-row'
    } gap-[0.95vh] cursor-pointer items-center`
  }

  async function logout() {
    localStorage.clear()
    sessionStorage.clear()
    deleteAllCookies()
    window.location.href = '/ct309/ag001/a001/v1'
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
        ? pathname.split('/').pop()?.split('_').slice(0, -1).join(' ') || ''
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
    if (fullView) return ''
    return 'center'
  }, [fullView])
  return (
    <div
      className={`g-root flex h-full flex-col items-center justify-between px-2 py-2 text-center`}
    >
      <div
        className='scrollbar-none flex max-h-[80vh] w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll pt-2 '
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
                  title={menu.menuGroupLabel}
                  placement='right-start'
                  // disable={fullView}
                >
                  <button
                    key={index}
                    className={twMerge(
                      `${sidebarStyle === 'default' || fullView ? "ml-1.5" : ""} flex cursor-pointer items-center justify-center gap-2 px-3 py-1 transition delay-150 duration-300 ease-in-out ${
                        sidebarStyle === 'compact' ||
                        sidebarStyle === 'hoverView'
                          ? 'w-full'
                          : 'w-[98%]'
                      } rounded-md`
                      // sidebarStyle == 'default'
                      //   ? 'justify-start p-0'
                      //   : 'justify-center'
                    )}
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
                            <button
                              style={{ color: `${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? brandColor : ""}`}}
                              className={`w-full ${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? 'hover:rounded-md hover:p-3.5' : ''}`}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? hoverColor : ""}`}}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                              <div className={`${getMenuClassName()} w-[100%]`}>
                                <div className='flex w-[20%] items-center justify-end'>
                                  {menu.icon ? (
                                    <Image
                                      className='h-[16px] w-[20px]'
                                      width={100}
                                      height={100}
                                      alt='icon'
                                      src={getCdnImage(menu.icon)}
                                      style={{
                                        filter:
                                          typeof getDropDownStyles(
                                            menu.menuGroup,
                                            true
                                          ) == 'boolean' || isDark
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
                                        ) == 'boolean'
                                          ? isLightColor(brandColor)
                                          : isDark
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
                                    justifyContent: `${
                                      sidebarStyle === 'condensed'
                                        ? 'center'
                                        : 'flex-start'
                                    }`,
                                    alignItems: 'center'
                                  }}
                                  className='flex items-center justify-center whitespace-nowrap bg-transparent pl-2 text-center transition-all delay-0 duration-75 ease-in-out'
                                >
                                  <p
                                    className={twMerge(
                                      'w-[110px] truncate font-medium leading-[2vh]',
                                      fullView && sidebarStyle !== 'condensed'
                                        ? 'text-start'
                                        : 'text-center'
                                    )}
                                    style={{
                                      transition: 'all 0.2s ease-in-out'
                                    }}
                                  >
                                    {menu.menuGroupLabel}
                                  </p>
                                </span>
                              </div>
                            </button>
                          ) : (
                            <button
                              style={{ color: `${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? brandColor : ""}`}}
                              className={`w-full ${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? 'hover:rounded-md hover:p-3.5' : ''}`}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${typeof getDropDownStyles(menu.menuGroup, true) !== 'boolean' ? hoverColor : ""}`}}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                            <span className='flex items-center'>
                              {menu.icon ? (
                                <Image
                                  className='h-[16px] w-[20px]'
                                  width={100}
                                  height={100}
                                  alt='icon'
                                  src={getCdnImage(menu.icon)}
                                  style={{
                                    filter:
                                      typeof getDropDownStyles(
                                        menu.menuGroup,
                                        true
                                      ) == 'boolean' || isDark
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
                                    ) == 'boolean'
                                      ? isLightColor(brandColor)
                                      : isDark
                                      ? '#fff'
                                      : '#1C274C'
                                  }
                                />
                              )}
                            </span>
                            </button>
                          )}
                        </div>
                      )}
                      key={index}
                      items={getNestedMenu(menu)}
                      popupProps={{
                        style: {
                          position: 'fixed'
                        }
                        // placement: `${sidebarStyle !== 'compact' ? 'bottom-end' : 'right-end'}`
                      }}
                      // switcherWrapperClassName='bg-transparent w-[100%] flex items-center justify-center'
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
                  // openDelay={0}
                  title={menu.menuGroupLabel}
                  placement='right-start'
                  // disable={fullView}
                  // style={{
                  //   backgroundColor: brandColor
                  // }}
                >
                  <button
                    style={{ color: `${routingName !== pathname ? brandColor : ""}`}}
                    className={`${routingName !== pathname ? `p-1 hover:rounded-md` : ""}`}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${routingName !== pathname ? hoverColor : ""}`}}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <div
                      key={index}
                      className={twMerge(
                        `${getMenuClassName()} rounded bg-transparent px-0.5 py-2`,
                        fullView ? '' : 'px-3 py-2'
                      )}
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
                          src={getCdnImage(menu.screenDetails[0].icon)}
                          style={{
                            filter:
                              routingName == pathname || isDark
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
                              : isDark
                              ? '#fff'
                              : '#1C274C'
                          }
                        />
                      )}
                      {fullView && (
                        <button className='w-[100px] truncate' key={index}>
                          {menu.menuGroupLabel}
                        </button>
                      )}
                    </div>
                  </button>
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
                theme='brand'
                view='filled'
                imageUrl={getCdnImage(userDetails?.profile)}
                className={`${
                  !fullView ? 'hidden opacity-0' : 'block opacity-100'
                } transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
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
        // switcherWrapperClassName='w-[100%] flex items-center justify-center'
        items={[
          {
            text: user,
            action: () => {}
            // selected: true
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
            // backgroundColor: brandColor,
            // color: isLightColor(brandColor),
            top: '-100px',
            left: '130px',
            borderRadius: '0.375rem'
          },
          className: 'rounded-md hover:rounded-md'
          // placement: 'right-end'
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
              theme='brand'
              view='filled'
              imageUrl={getCdnImage(userDetails?.profile)}
              className={`${
                fullView ? 'hidden opacity-0' : 'block opacity-100'
              } transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
            />
          </div>
        )}
        // switcherWrapperClassName='w-[100%] flex items-center justify-center'
        items={[
          {
            text: user,
            action: () => {}
            // selected: true
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
            //backgroundColor: brandColor,
            //color: isLightColor(brandColor),
            top: '-120px',
            left: '70px',
            textAlign: 'start',
            borderRadius: '0.375rem'
          },
          className: 'hover:rounded-md rounded-md'
          // placement: 'right-end'
        }}
      />
    </>
  )
}
