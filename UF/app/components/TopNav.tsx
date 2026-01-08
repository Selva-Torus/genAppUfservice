import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { Logo } from '@/app/components/Logo'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MenuItem, MenuStructure } from '../interfaces/interfaces'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Avatar } from '@/components/Avatar'
import { BsThreeDots } from 'react-icons/bs'
import { DropdownMenu } from '@/components/DropdownMenu'
import { getCdnImage } from '../utils/getAssets'
import OPRTopNavSelector from './TopNav/OPRTopNavSelector'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import Popup from '@/components/Popup'
import { LogoutIcon, RotateIcon, SettingsIcon } from '../utils/svgApplications'
import clsx from 'clsx'
import { OrgStructure, ProdStructure, RoleStructure } from './svgApplication'

const TopNav = ({
  navData,
  listMenuItems = true,
  mode,
  brandColor = '#fff',
  appName,
  logo,
  userDetails
}: {
  navData: MenuStructure
  listMenuItems?: boolean
  mode: string
  brandColor: string
  appName: string
  logo?: string
  userDetails: any
}) => {
  const router = useRouter()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const selectedAccessProfile = decodedTokenObj?.selectedAccessProfile
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const { borderColor, isDark } = useTheme()
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>(navData || [])
  const [hiddenItems, setHiddenItems] = useState<MenuItem[]>([])
  const tp_ps = getCookie('tp_ps')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverButtonElement = useRef(null)

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

        const itemWidth = testElement.clientWidth + 150 // Add padding/margin
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

  const isSelectedMenuGroup = useCallback(
    (menuGroup: any) => {
      const menuGrp = navData.find(item => item.menuGroup === menuGroup)
      const currentScreen = pathname.includes('_')
        ? pathname.split('/').pop()?.split('_').slice(0, -1).join(' ') || ''
        : pathname.split('/').pop() || ''

      const selectedRoute = hasMatchingName(menuGrp, currentScreen)
      if (selectedRoute) {
        return true
      }
      return false
    },
    [brandColor]
  )

  return (
    <div
      suppressHydrationWarning
      className={`flex items-center justify-between p-2 ${
        mode === 'detached' ? 'shadow-md' : ''
      } g-root`}
    >
      <div className='flex items-center gap-1'>
        {logo ? (
          <img
            className='h-[16px] w-[20px]'
            width={100}
            height={100}
            src={getCdnImage(logo)}
            alt='logo'
          />
        ) : (
          <Logo />
        )}
        <Text className='text-nowrap text-center font-bold '>{appName}</Text>
      </div>
      {listMenuItems && (
        <>
          <div className='flex w-full justify-start gap-1 pl-4'>
            <div className='flex max-w-[62%] items-center gap-2' ref={menuRef}>
              {navData &&
                visibleItems.map((menu, index) => {
                  if (menu.menuGroup) {
                    return (
                      <div key={index}>
                        <DropdownMenu
                          renderSwitcher={(props: any) => (
                            <Button
                              {...props}
                              view={
                                isSelectedMenuGroup(menu.menuGroup)
                                  ? 'action'
                                  : 'raised'
                              }
                              className='px-2 py-0.5'
                            >
                              {menu.menuGroupLabel}
                            </Button>
                          )}
                          key={index}
                          items={getNestedMenu(menu)}
                        />
                      </div>
                    )
                  } else {
                    const routingName =
                      '/' +
                      menu.screenDetails[0].name.replace(/ /g, '_') +
                      '_' +
                      menu.screenDetails[0].key.split(':').at(-1)
                    return (
                      <Button
                        view={routingName == pathname ? 'action' : 'raised'}
                        className=' px-2 py-0.5'
                        key={index}
                        onClick={() => router.push(routingName)}
                      >
                        {menu.menuGroupLabel}
                      </Button>
                    )
                  }
                })}
            </div>
            <div>
              {hiddenItems.length > 0 && (
                <DropdownMenu
                  renderSwitcher={(props: any) => (
                    <Button {...props} view='raised' className='mt-1 rotate-90'>
                      <BsThreeDots />
                    </Button>
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
                />
              )}
            </div>
          </div>
          <div
            className={clsx('flex w-full justify-end gap-2', {
              hidden: !tp_ps
            })}
          >
            <OPRTopNavSelector selectedAccessProfile={selectedAccessProfile} fullView />
          </div>
          <div>
            <div
              onClick={() => setIsPopoverOpen(prev => !prev)}
              ref={popoverButtonElement}
              className='h-11 w-12 cursor-pointer rounded-full'
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
                placement='bottom'
              >
                <div className='flex flex-col items-center gap-1'>
                  {/* Profile section */}
                  <div className='h-11 w-11 rounded-full'>
                    <Avatar
                      theme='brand'
                      view='filled'
                      imageUrl={getCdnImage(userDetails?.profile)}
                      icon='FaRegUser'
                    />
                  </div>

                  <Text className='font-medium'>
                    {' '}
                    {`${userDetails.firstName} ${userDetails.lastName}`}
                  </Text>
                </div>

                <hr className={twMerge('mt-1 w-full border', borderColor)} />

                <div className='mt-2 flex flex-col gap-2'>
                  <Text variant='body-1' contentAlign='left'>
                    ORGANIZATION MATRIX
                  </Text>
                  <div className='flex items-center gap-1'>
                    <OrgStructure
                      height='20'
                      width='20'
                      fill={isDark ? 'white' : 'black'}
                    />
                    <Text variant='body-2' contentAlign='left'>
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
                    <Text variant='body-2' contentAlign='left'>
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
                    <Text variant='body-2' contentAlign='left'>
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

                <hr className={twMerge('w-full border mt-1', borderColor)} />

                <div className='flex flex-col gap-2 pt-2'>
                  {pathname !== '/select-context' && (
                    <div
                      onClick={() => router.push('/select-context')}
                      className='flex cursor-pointer items-center gap-2'
                    >
                      <RotateIcon fill={isDark ? 'white' : 'black'} />
                      <div>
                        <Text variant='code-inline-2'>Change Profile</Text>
                      </div>
                    </div>
                  )}

                  {pathname !== '/select-context' && pathname !== '/user' && (
                    <div
                      onClick={() => router.push('/user')}
                      className='flex cursor-pointer items-center gap-2'
                    >
                      <SettingsIcon fill={isDark ? 'white' : 'black'} />
                      <div>
                        <Text variant='code-inline-2'>Settings</Text>
                      </div>
                    </div>
                  )}
                  <div
                    onClick={logout}
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <LogoutIcon />
                    <div>
                      <Text variant='code-inline-2' className='text-[#F44336]'>
                        Log out
                      </Text>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TopNav
