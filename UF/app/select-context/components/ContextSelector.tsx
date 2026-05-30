
'use client'
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition
} from 'react'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import axios from 'axios'
import { getCookie, setCookie } from '@/app/components/cookieMgment'
import { useRouter } from 'next/navigation'
import decodeToken from '@/app/components/decodeToken'
import { Text } from '@/components/Text'
import { useGlobal } from '@/context/GlobalContext'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { Dropdown } from '@/components/Dropdown'
import { Button } from '@/components/Button'
import Spin from '@/components/Spin'
import { AxiosService } from '@/app/components/axiosService'
import { TotalContext, TotalContextProps } from '../../globalContext'
import TopNav from '@/app/components/Layout/TopNav'
import OPRList from './OprList'
import { LuBuilding2 } from 'react-icons/lu'
import { hexWithOpacity, isLightColor } from '@/app/components/utils'
import { BiPackage } from 'react-icons/bi'
import { RiUserShared2Fill } from 'react-icons/ri'
import clsx from 'clsx'

const ContextSelector = () => {
  const [selectedAccessProfile, setSelectedAccessProfile] = useState<string[]>(
    []
  )
  const [navigationStyles] = useState<'vertical' | 'horizontal'>("horizontal");
  const { userDetails, setUserDetails , setMatchedAccessProfileData } = useContext(
    TotalContext
  ) as TotalContextProps
  const token: string = getCookie('token')
  const tp_ps: any = getCookie('tp_ps')
  const toast = useInfoMsg()
  const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL
  const appName = 'application'
  const [accessProfiles, setAccessProfiles] = useState<any[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { branding } = useGlobal()
  const { brandColor } = branding
  const [selectedCombination, setSelectedCombination] = useState<
    Record<string, string>
  >({})
  const { borderColor } = useTheme()
  const [selectedOrg, setSelectedOrg] = useState<Record<string, string>>({})
  const [selectedPs, setSelectedPs] = useState<Record<string, string>>({})
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})
  const [orgGrpData, setOrgGrpData] = useState<any>([])
  const [isPending, startTransition] = useTransition();  
  let landingScreen:string = 'Logs Screen';
  let screenDetails: any = {
           keys:[
  {
    "screenName": "test",
    "screensName": "test-v1",
    "ufKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:test:AFVK:v1"
  }
]
  }
  screenDetails = screenDetails.keys

  if (landingScreen === 'User Screen') {
    landingScreen = 'user'
  } else if (landingScreen === 'Logs Screen') {
    landingScreen = 'logs'
  } else {
    screenDetails.forEach((screen: any) => {
      if (landingScreen === screen.ufKey) {
        landingScreen = screen.screensName
      }
    })
    landingScreen =
      landingScreen.split('-')[0] + '_' + landingScreen.split('-').at(-1)
  }

  useEffect(() => {
    orpsData()
    userDetailsData()
  }, [])

  const userDetailsData = async () => {
    try {
      let myAccount = await AxiosService.get('/UF/myAccount-for-client', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          key: 'Logs Screen'
        }
      })
      setUserDetails(myAccount?.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (tp_ps) {
      const selectedCombinationData = JSON.parse(atob(tp_ps))
        ?.selectedCombination
      setSelectedCombination(selectedCombinationData ?? {})
      setSelectedAccessProfile(
        JSON.parse(atob(tp_ps))?.selectedAccessProfile ?? []
      )
      const selectedAccessProfileExist = accessProfiles.find(
        item =>
          item.accessProfile ===
          JSON.parse(atob(tp_ps))?.selectedAccessProfile[0]
      )

      if (selectedAccessProfileExist) {
        setOrgGrpData(selectedAccessProfileExist?.orgGrp)
      }

      setSelectedOrg(
        selectedCombinationData
          ? {
              orgCode: selectedCombinationData?.subOrgCode
                ? selectedCombinationData.subOrgCode
                : selectedCombinationData.orgCode,
              orgGrpCode: selectedCombinationData?.subOrgGrpCode
                ? selectedCombinationData.subOrgGrpCode
                : selectedCombinationData.orgGrpCode,
              orgGrpName: selectedCombinationData?.subOrgGrpName
                ? selectedCombinationData.subOrgGrpName
                : selectedCombinationData.orgGrpName,
              orgName: selectedCombinationData?.subOrgName
                ? selectedCombinationData.subOrgName
                : selectedCombinationData.orgName,
              path: selectedCombinationData?.orgPath,
              id: selectedCombinationData?.id,
              mainOrgGrpCode: selectedCombinationData?.subOrgGrpCode
                ? selectedCombinationData.orgGrpCode
                : undefined,
              mainOrgCode: selectedCombinationData?.subOrgCode
                ? selectedCombinationData.orgCode
                : undefined,
              mainOrgGrpName: selectedCombinationData?.subOrgGrpName
                ? selectedCombinationData.orgGrpName
                : undefined,
              mainOrgName: selectedCombinationData?.subOrgName
                ? selectedCombinationData.orgName
                : undefined
            }
          : {}
      )
    }
  }, [tp_ps, accessProfiles])

  const orpsData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/UF/getAccessTemplates`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      if (res.status == 200) {
        setAccessProfiles(res.data)
      }
    } catch (error) {
      toast('Error Fetching ORPS', 'danger')
    }
  }

  const handleNavigationClick = async () => {
    if (
      !Object.keys(selectedOrg).length ||
      !Object.keys(selectedPs).length ||
      !Object.keys(selectedRole).length
    ) {
      toast('Please select all the fields', 'warning')
      return
    }
    const orgGrpName = selectedOrg?.mainOrgGrpName
      ? selectedOrg?.mainOrgGrpName
      : selectedOrg?.orgGrpName
    const orgGrpCode = selectedOrg?.mainOrgGrpCode
      ? selectedOrg?.mainOrgGrpCode
      : selectedOrg?.orgGrpCode
    const orgName = selectedOrg?.mainOrgName
      ? selectedOrg?.mainOrgName
      : selectedOrg?.orgName
    const orgCode = selectedOrg?.mainOrgCode
      ? selectedOrg?.mainOrgCode
      : selectedOrg?.orgCode
    const subOrgGrpName = selectedOrg?.mainOrgGrpName
      ? selectedOrg?.orgGrpName
      : ''
    const subOrgGrpCode = selectedOrg?.mainOrgGrpCode
      ? selectedOrg?.orgGrpCode
      : ''
    const subOrgName = selectedOrg?.mainOrgName ? selectedOrg?.orgName : ''
    const subOrgCode = selectedOrg?.mainOrgCode ? selectedOrg?.orgCode : ''

    const selectedCombo = {
      orgGrpCode,
      orgCode,
      orgPath: selectedOrg?.path,
      orgGrpName,
      orgName,
      roleGrpCode: selectedRole?.roleGrpCode,
      roleCode: selectedRole?.roleCode,
      roleGrpName: selectedRole?.roleGrpName,
      roleName: selectedRole?.roleName,
      psGrpCode: selectedPs?.psGrpCode,
      psCode: selectedPs?.psCode,
      psGrpName: selectedPs?.psGrpName,
      psName: selectedPs?.psName,
      psLogo: selectedPs?.psLogo,
      psPath: selectedPs?.path,
      subOrgGrpCode,
      subOrgGrpName,
      subOrgCode,
      subOrgName,
      id: selectedOrg?.id
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/UF/getAccessToken`,
        {
          selectedCombination: selectedCombo,
          selectedAccessProfile: selectedAccessProfile[0],
          dap:
            accessProfiles.find(
              item => item.accessProfile === selectedAccessProfile[0]
            )?.dap ?? undefined,
          ufClientType: 'UFW'
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      if (res.status == 201) {
        setCookie('token', res.data.token)
        setCookie(
          'tp_ps',
          btoa(
            JSON.stringify({
              selectedCombination: selectedCombo,
              selectedAccessProfile
            })
          )
        )
        const ORM: any = decodeToken(res.data.token)
        sessionStorage.setItem(
          'organizationDetails',
          JSON.stringify({
            orgGrpCode: ORM.orgGrpCode,
            orgCode: ORM.orgCode,
            roleGrpCode: ORM.roleGrpCode,
            roleCode: ORM.roleCode,
            psGrpCode: ORM.psGrpCode,
            psCode: ORM.psCode
          })
        )
        setMatchedAccessProfileData({})
        startTransition(() => {
          router.push(landingScreen)
        })
        // here we have to set the default authentication route
        setLoading(false)
      }
    } catch (error) {
      toast('Error Fetching AccessToken', 'danger')
    }
  }

  const blocks = useMemo(() => {
    const data = [
      {
        icon: LuBuilding2,
        group: selectedOrg.orgGrpName,
        title: selectedOrg.orgName,
        subtitle: selectedOrg.orgCode
      },
      {
        icon: BiPackage,
        group: selectedPs.psGrpName,
        title: selectedPs.psName,
        subtitle: selectedPs.psCode
      },
      {
        icon: RiUserShared2Fill,
        group: selectedRole.roleGrpName,
        title: selectedRole?.roleCount ? `${selectedRole.roleCount} Role` : ''
      }
    ]
    return data
  }, [selectedOrg, selectedPs, selectedRole])

  const navBarItemsOrder: {
    name: string
    'gridColumn'?: string
    'gridRow'?: string
  }[] = []

  const logo: string = "torus/9.1/CT010/resources/images/15017190.png"
  const appLogo: string = "torus/9.1/CT010/resources/images/images.png"

  return (
    <div className='h-full w-full  bg-cover bg-center' style={{ backgroundImage: 'var(--app-bg-image)' }}>
      <TopNav
        appName={appName}
        navData={[]}
        userDetails={userDetails}
        brandColor={brandColor}
        mode='closed'
        listMenuItems={false}
        navBarItemsOrder={navigationStyles === 'vertical' ? [] :navBarItemsOrder}
        appLogo={appLogo}
        logo={logo}
      />

      <hr className={twMerge('w-full h-1', borderColor)} />
      <div className='px-5 py-2.5'>
        <div className='flex w-full items-center justify-end gap-1'>
          <div title={selectedAccessProfile.length ? selectedAccessProfile[0] : "Select Access Profile"} className='w-[12vw]'>
            <Dropdown
              placeholder='Select Access Profile'
              value={selectedAccessProfile[0]}
              staticProps={accessProfiles.map(item => item.accessProfile)}
              onChange={val => {
                setSelectedAccessProfile([val] as string[])
                const resultORGData = accessProfiles.find(
                  item => item.accessProfile === val
                )
                if (
                  resultORGData &&
                  resultORGData['orgGrp'] &&
                  Array.isArray(resultORGData['orgGrp'])
                ) {
                  setOrgGrpData(resultORGData?.orgGrp ?? [])
                } else {
                  setOrgGrpData([])
                }
                setSelectedOrg({})
                setSelectedPs({})
                setSelectedRole({})
                setSelectedCombination({})
              }}
            />
          </div>
          <div className='flex gap-2 py-2'>
            <Button
              className='flex items-center rounded-md px-5 py-2.5 disabled:opacity-50'
              icon={'MdArrowForward'}
              onClick={handleNavigationClick}
              disabled={
                Object.keys(selectedRole).length === 0 || loading || isPending
              }
            >
              {loading || isPending ? (
                <Spin
                  className='flex w-full justify-center'
                  spinning
                  color='success'
                  style='dots'
                />
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
        <div className={'gap-1- flex h-full flex-col rounded-md px-5 py-2'}>
          <div className='h-1\5 flex w-full items-center justify-between'>
            <div className='flex h-[20vh] w-full items-center justify-center rounded-lg'>
              {blocks.map((block, idx) => (
                <div key={idx} className='flex items-center '>
                  {/* Circle */}
                  <div className='flex w-[8vw] flex-col items-center gap-[0.5vh]'>
                    <div
                      style={{
                        backgroundColor: hexWithOpacity(brandColor, 0.8)
                      }}
                      className={clsx(
                        `flex h-[2.5vw] w-[2.5vw] items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-in-out`,
                        {
                          'h-[4vw] w-[4vw]': !block?.group || !block?.title
                        }
                      )}
                    >
                      <block.icon
                        className={clsx(
                          'h-[0.7vw] w-[0.7vw] transition-all duration-300 ease-in-out',
                          {
                            'h-[1.1vw] w-[1.1vw]':
                              !block?.group || !block?.title
                          }
                        )}
                        style={{
                          color: isLightColor(brandColor)
                        }}
                      />
                    </div>

                    {/* Texts */}
                    <div className='flex w-full flex-col items-center'>
                      <Text
                        className={`w-full truncate text-nowrap text-center`}
                      >
                        {block?.group}
                      </Text>
                      <Text
                        className='w-full truncate text-nowrap text-center font-semibold'
                      >
                        {block?.title}
                      </Text>
                      <Text
                        className='w-full truncate text-nowrap text-center !min-h-4'
                        color='secondary'
                      >
                        {block.subtitle}
                      </Text>
                    </div>
                  </div>

                  {/* Arrow */}
                  {idx < blocks.length - 1 && (
                    <div className='mx-4 text-lg text-gray-400'>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex h-4/5'>
            <OPRList
              orgData={orgGrpData}
              setOrgData={setOrgGrpData}
              selectedOrg={selectedOrg}
              selectedPs={selectedPs}
              selectedRole={selectedRole}
              setSelectedOrg={setSelectedOrg}
              setSelectedPs={setSelectedPs}
              setSelectedRole={setSelectedRole}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextSelector
