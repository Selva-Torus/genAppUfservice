import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { MenuItem, MenuStructure } from '../../interfaces/interfaces'
import Image from 'next/image'
import { isLightColor } from '../utils'
import {
  FileGallery,
  LogoutIcon,
  RotateIcon,
  SettingsIcon
} from '../../utils/svgApplications'
import { Tooltip } from '@/components/Tooltip'
import { DropdownMenu } from '@/components/DropdownMenu'
import { Avatar } from '@/components/Avatar'
import { useTheme } from '@/hooks/useTheme'
import { twMerge } from 'tailwind-merge'
import { getCdnImage } from '../../utils/getAssets'
import Popup from '@/components/Popup'
import { Text } from '@/components/Text'
import clsx from 'clsx'
import OPRTopNavSelector from './OPRTopNavSelector'
import { OrgStructure, ProdStructure, RoleStructure } from '../svgApplication'

const SideNav = ({
  navData,
  mode = 'fluid',
  sidebarStyle = 'default',
  fullView,
  setFullView,
  brandColor,
  hoverColor,
  userDetails,
  navBarItemsOrder
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
  brandColor: string
  hoverColor: string
  userDetails: any
  navBarItemsOrder?: {
    name: string
    'gridColumn'?: string
    'gridRow'?: string
  }[]
}) => {
  const router = useRouter()
  const tp_ps = getCookie('tp_ps')
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
    window.location.href = '/ct005/gss/vgph/v1'
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

  // Helper function to get grid style for a section
  const getGridStyle: (sectionName: string) => React.CSSProperties = (
    sectionName: string
  ) => {
    if (!navBarItemsOrder?.length) return {}

    const item = navBarItemsOrder.find(
      order => order.name.toLowerCase() === sectionName.toLowerCase()
    )

    if (!item) return { display: 'none' }

    return {
      gridRow: item['gridRow']
    }
  }

  // Menu Items section - with conditional overflow handling
  const MenuItemsSection = useCallback(() => (
    <div
      className={clsx('scrollbar-none col-span-full flex w-full flex-col gap-2 overflow-x-hidden pt-2', {
        'max-h-[80vh] overflow-y-scroll': !navBarItemsOrder,
        'overflow-y-auto min-h-0': navBarItemsOrder
      })}
      style={{
        ...getGridStyle('menu items'),
        alignItems: menuPlacement
      }}
    >
      {navData &&
        navData.map((menu, index): any => {
          if (menu.menuGroup) {
            return (
              <Tooltip
                key={index}
                title={menu.menuGroupLabel}
                placement='right-start'
              >
                <div
                  key={index}
                  className={twMerge(
                    `${
                      sidebarStyle === 'default' || fullView ? 'ml-1.5' : ''
                    } flex cursor-pointer items-center justify-center gap-2 px-3 py-1 transition delay-150 duration-300 ease-in-out ${
                      sidebarStyle === 'compact' ||
                      sidebarStyle === 'hoverView'
                        ? 'w-full'
                        : 'w-[98%]'
                    } rounded-md`
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
                            style={{
                              color: `${
                                typeof getDropDownStyles(
                                  menu.menuGroup,
                                  true
                                ) !== 'boolean'
                                  ? brandColor
                                  : ''
                              }`
                            }}
                            className={`w-full ${
                              typeof getDropDownStyles(
                                menu.menuGroup,
                                true
                              ) !== 'boolean'
                                ? 'hover:rounded-md hover:p-3.5'
                                : ''
                            }`}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = `${
                                typeof getDropDownStyles(
                                  menu.menuGroup,
                                  true
                                ) !== 'boolean'
                                  ? hoverColor
                                  : ''
                              }`
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor =
                                'transparent'
                            }}
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
                            style={{
                              color: `${
                                typeof getDropDownStyles(
                                  menu.menuGroup,
                                  true
                                ) !== 'boolean'
                                  ? brandColor
                                  : ''
                              }`
                            }}
                            className={`w-full ${
                              typeof getDropDownStyles(
                                menu.menuGroup,
                                true
                              ) !== 'boolean'
                                ? 'hover:rounded-md hover:p-3.5'
                                : ''
                            }`}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = `${
                                typeof getDropDownStyles(
                                  menu.menuGroup,
                                  true
                                ) !== 'boolean'
                                  ? hoverColor
                                  : ''
                              }`
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor =
                                'transparent'
                            }}
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
                    }}
                  />
                </div>
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
                title={menu.menuGroupLabel}
                placement='right-start'
              >
                <button
                  style={{
                    color: `${routingName !== pathname ? brandColor : ''}`
                  }}
                  className={`${
                    routingName !== pathname ? `p-1 hover:rounded-md` : ''
                  }`}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `${
                      routingName !== pathname ? hoverColor : ''
                    }`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
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
                      <div className='w-[100px] truncate' key={index}>
                        {menu.menuGroupLabel}
                      </div>
                    )}
                  </div>
                </button>
              </Tooltip>
            )
          }
        })}
    </div>
  ), [navData, fullView, brandColor, hoverColor, pathname, isDark])

  // OPR Matrix section
  const OPRMatrixSection = useCallback(() => (
    <div
      className={clsx('px-0 col-span-full overflow-x-hidden', {
        hidden: !tp_ps,
        '': fullView
      })}
      style={getGridStyle('opr matrix')}
    >
      <OPRTopNavSelector
        selectedAccessProfile={selectedAccessProfile}
        className='flex-col pb-2 px-[unset] 2xl:px-4'
        popupPlacement='right-end'
        fullView={fullView}
      />
    </div>
  ), [fullView, tp_ps, selectedAccessProfile])

  // Profile section
  const ProfileSection = useCallback(() => (
    <div
      style={getGridStyle('profile')}
      className='flex col-span-full items-center justify-center'
    >
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
  ), [fullView, brandColor, logout, user, userDetails, selectedAccessProfile])

  // Default layout (without grid)
  if (!navBarItemsOrder || navBarItemsOrder?.length === 0) {
    return (
      <div
        className={`g-root flex h-full flex-col items-center justify-between px-2 py-2 text-center`}
        onMouseEnter={() => sidebarStyle == 'hoverView' && setFullView(true)}
        onMouseLeave={() => sidebarStyle == 'hoverView' && setFullView(false)}
      >
        <MenuItemsSection />
        <div className='flex w-full flex-col items-center justify-center'>
          <OPRMatrixSection />
          <ProfileSection />
        </div>
      </div>
    )
  }

  // Grid layout (with navBarItemsOrder)
  return (
    <div
      className={`grid h-full w-full px-2 py-2 text-center overflow-hidden`}
      style={{
        gridTemplateRows: 'repeat(12, minmax(0, 1fr))',
        gridTemplateColumns: `repeat(${sidebarStyle == "compact" ? 6 : sidebarStyle === "hoverView" && fullView ? 12 : 6}, minmax(0, 1fr))`,
        gap: '0.5rem'
      }}
      onMouseEnter={() => sidebarStyle == 'hoverView' && setFullView(true)}
      onMouseLeave={() => sidebarStyle == 'hoverView' && setFullView(false)}
    >
      <MenuItemsSection />
      <OPRMatrixSection />
      <ProfileSection />
    </div>
  )
}

export default SideNav

// FullViewAvatar and PartialViewAvatar components remain the same...

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverButtonElement = useRef(null)
  const { borderColor, isDark } = useTheme()
  const pathname = usePathname()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  return (
    <>
      <div
        onClick={() => setIsPopoverOpen(prev => !prev)}
        ref={popoverButtonElement}
        className={twMerge(
          'flex items-center gap-2 rounded-lg border px-1 py-1.5',
          borderColor
        )}
      >
        <div className='h-9 w-10 cursor-pointer rounded-full justify-self-center'>
          <Avatar
            theme='brand'
            view='filled'
            imageUrl={getCdnImage(userDetails?.profile)}
            icon='FaRegUser'
          />
        </div>
        <div className='flex flex-col gap-[0.15rem] justify-center items-start ' >
          <Text contentAlign='left'>{user}</Text>
          <Text className='whitespace-nowrap text-xs' contentAlign='left'>{userDetails.accessProfile[0]}</Text>
        </div>
      </div>
      <div>
        <Popup
          anchorRef={popoverButtonElement}
          open={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          placement='right'
          hasArrow={false}
        >
          <div className='flex flex-col items-center gap-1'>
            <div className='h-11 w-11 rounded-full'>
              <Avatar
                theme='brand'
                view='filled'
                imageUrl={getCdnImage(userDetails?.profile)}
                icon='FaRegUser'
              />
            </div>

            <Text className='font-medium'>
              {`${userDetails.firstName} ${userDetails.lastName}`}
            </Text>
          </div>

          <hr className={twMerge('mt-1 w-full border', borderColor)} />

          <div className='mt-2 flex flex-col gap-2'>
            <Text contentAlign='left'>
              ORGANIZATION MATRIX
            </Text>
            <div className='flex items-center gap-1'>
              <OrgStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Organization
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.orgName}
            </Text>
            <div className='flex items-center gap-1'>
              <ProdStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Products
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.psName}
            </Text>
            <div className='flex items-center gap-1'>
              <RoleStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Roles
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.roleName}
            </Text>
          </div>

          <hr className={twMerge('mt-1 w-full border', borderColor)} />

          <div className='flex flex-col gap-2 pt-2'>
            {pathname !== '/select-context' && (
              <div
                onClick={() => router.push('/select-context')}
                className='flex cursor-pointer items-center gap-2'
              >
                <RotateIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Change Profile</Text>
                </div>
              </div>
            )}

            {pathname !== '/app-hub' && <div
                onClick={() => router.push('/app-hub')}
                className='flex cursor-pointer items-center gap-2'
              >
                <RotateIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Switch Application</Text>
                </div>
              </div>}

            {pathname !== '/select-context' && pathname !== '/user' && pathname !== '/app-hub' && (
              <div
                onClick={() => router.push('/user')}
                className='flex cursor-pointer items-center gap-2'
              >
                <SettingsIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Settings</Text>
                </div>
              </div>
            )}
            <div
              onClick={logout}
              className='flex cursor-pointer items-center gap-2'
            >
              <LogoutIcon />
              <div>
                <Text className='text-[#F44336]'>
                  Log out
                </Text>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    </>
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverButtonElement = useRef(null)
  const { borderColor, isDark } = useTheme()
  const pathname = usePathname()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)

  return (
    <>
      <div
        onClick={() => setIsPopoverOpen(prev => !prev)}
        ref={popoverButtonElement}
        className='h-9 w-10 cursor-pointer rounded-full justify-self-center'
      >
        <Avatar
          theme='brand'
          view='filled'
          imageUrl={getCdnImage(userDetails?.profile)}
          icon='FaRegUser'
        />
      </div>
      <div>
        <Popup
          anchorRef={popoverButtonElement}
          open={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          placement='right'
          hasArrow={false}
        >
          <div className='flex flex-col items-center gap-1'>
            <div className='h-11 w-11 rounded-full'>
              <Avatar
                theme='brand'
                view='filled'
                imageUrl={getCdnImage(userDetails?.profile)}
                icon='FaRegUser'
              />
            </div>

            <Text className='font-medium'>
              {`${userDetails.firstName} ${userDetails.lastName}`}
            </Text>
          </div>

          <hr className={twMerge('mt-1 w-full border', borderColor)} />

          <div className='mt-2 flex flex-col gap-2'>
            <Text contentAlign='left'>
              ORGANIZATION MATRIX
            </Text>
            <div className='flex items-center gap-1'>
              <OrgStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Organization
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.orgName}
            </Text>
            <div className='flex items-center gap-1'>
              <ProdStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Products
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.psName}
            </Text>
            <div className='flex items-center gap-1'>
              <RoleStructure
                height='20'
                width='20'
                fill={isDark ? 'white' : 'black'}
              />
              <Text contentAlign='left'>
                Roles
              </Text>
            </div>
            <Text
              color='brand'
              contentAlign='left'
              className='block w-full truncate text-left'
            >
              {decodedTokenObj.roleName}
            </Text>
          </div>

          <hr className={twMerge('mt-1 w-full border', borderColor)} />

          <div className='flex flex-col gap-2 pt-2'>
            {pathname !== '/select-context' && (
              <div
                onClick={() => router.push('/select-context')}
                className='flex cursor-pointer items-center gap-2'
              >
                <RotateIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Change Profile</Text>
                </div>
              </div>
            )}

            {pathname !== '/app-hub' && <div
                onClick={() => router.push('/app-hub')}
                className='flex cursor-pointer items-center gap-2'
              >
                <RotateIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Switch Application</Text>
                </div>
              </div>}

            {pathname !== '/select-context' && pathname !== '/user' && pathname !== '/app-hub' && (
              <div
                onClick={() => router.push('/user')}
                className='flex cursor-pointer items-center gap-2'
              >
                <SettingsIcon fill={isDark ? 'white' : 'black'} />
                <div>
                  <Text>Settings</Text>
                </div>
              </div>
            )}
            <div
              onClick={logout}
              className='flex cursor-pointer items-center gap-2'
            >
              <LogoutIcon />
              <div>
                <Text className='text-[#F44336]'>
                  Log out
                </Text>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    </>
  )
}