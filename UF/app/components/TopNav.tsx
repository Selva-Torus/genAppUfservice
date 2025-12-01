import { deleteAllCookies, getCookie } from '@/app/components/cookieMgment'
import decodeToken from '@/app/components/decodeToken'
import { Logo } from '@/app/components/Logo'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MenuItem, MenuStructure } from '../interfaces/interfaces'
import { isLightColor } from './utils'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Avatar } from '@/components/Avatar'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { DropdownMenu } from '@/components/DropdownMenu'

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
  userDetails: any
}) => {
  const router = useRouter()
  const token: string = getCookie('token')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const selectedAccessProfile = decodedTokenObj?.selectedAccessProfile
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>(navData || [])
  const [hiddenItems, setHiddenItems] = useState<MenuItem[]>([])
  const tp_ps = getCookie('tp_ps')
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

        const itemWidth = testElement.clientWidth + 70 // Add padding/margin
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
            src={logo}
            alt='logo'
          />
        ) : (
          <Logo />
        )}
        <Text className='text-nowrap text-center font-bold '>{appName}</Text>
      </div>
      {listMenuItems && (
        <>
          <div className='flex w-full justify-center gap-1'>
            <div
              className='flex max-w-[62%] items-center gap-2'
              ref={menuRef}
            >
              {navData &&
                visibleItems.map((menu, index) => {
                  if (menu.menuGroup) {
                    return (
                      <div key={index}>
                        <DropdownMenu
                          renderSwitcher={(props: any) => (
                            <Button
                              {...props}
                              view='flat'
                              className='max-w-[100px] truncate font-medium leading-[1.5vh]'
                            >
                              {menu.menuGroupLabel}
                            </Button>
                          )}
                          key={index}
                          items={getNestedMenu(menu)}
                          popupProps={{
                            style: {
                              backgroundColor: brandColor,
                              color: `${isLightColor(brandColor)}`
                            }
                          }}
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
                        view='flat'
                        // style={{
                        //   backgroundColor:
                        //     routingName == pathname
                        //       ? `${brandColor}`
                        //       : 'transparent',
                        //   color:
                        //     routingName == pathname
                        //       ? `${isLightColor(brandColor)}`
                        //       : 'unset'
                        // }}
                        className='rounded-full px-2 py-2 '
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
                    <Button {...props} view='flat' className='mt-1 rotate-90'>
                      <BsThreeDotsVertical />
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
                  popupProps={{
                    style: {
                      backgroundColor: brandColor,
                      color: `${isLightColor(brandColor)}`
                    }
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <DropdownMenu
              renderSwitcher={(props: any) => (
                <div
                  {...props}
                  className='flex items-center gap-2 rounded-full border'
                  style={{
                    borderColor: brandColor
                  }}
                >
                  <Avatar
                    size='s'
                    theme='brand'
                    view='filled'
                    imageUrl={userDetails?.profile}
                    icon='FaRegUser'
                  />
                  <Text className='pr-2'>{user}</Text>
                </div>
              )}
              items={[
                {
                  text: user,
                  action: () => {}
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
                  color: `${isLightColor(brandColor)}`,
                  right: '10px'
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