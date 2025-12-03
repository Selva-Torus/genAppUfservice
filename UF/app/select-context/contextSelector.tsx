'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  DownArrow,
  OrgIcon,
  ProductIcon,
  PSIcon,
  RoleIcon,
  SearchIcon
} from '../components/svgApplication'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import axios from 'axios'
import { getCookie, setCookie } from '../components/cookieMgment'
import { useRouter } from 'next/navigation'
import decodeToken from '../components/decodeToken'
import { isLightColor } from '../components/utils'
import { Text } from '@/components/Text'
import { useGlobal } from '@/context/GlobalContext'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { Dropdown } from '@/components/Dropdown'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import Spin from '@/components/Spin'
import { AxiosService } from '../components/axiosService'
import { TotalContext, TotalContextProps } from '../globalContext'
import TopNav from '../components/TopNav'

const ContextSelector = () => {
  const [selectedAccessProfile, setSelectedAccessProfile] = useState<string[]>([])
  const { userDetails, setUserDetails } = useContext(
    TotalContext
  ) as TotalContextProps
  const token: string = getCookie('token')
  const tp_ps: any = getCookie('tp_ps')
  const toast = useInfoMsg();
  const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL
  const appName = 'VOFApp'
  const [accessProfiles, setAccessProfiles] = useState<any[]>([])
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const { branding } = useGlobal()
  const { brandColor } = branding
  const [selectedCombination, setSelectedCombination] = useState<
    Record<string, string>
  >({})
  const [activeTab, setActiveTab] = useState<'org' | 'ps' | 'role'>('org')
  const [searchQuery, setSearchQuery] = useState('')
  const { isDark, bgColor, textColor, borderColor, hoverBgColor, textStyle } =
    useTheme()
  const [selectedOrg, setSelectedOrg] = useState<{
    code: string
    grpCode: string
  } | null>(null)
  const [selectedPs, setSelectedPs] = useState<{
    code: string
    grpCode: string
  } | null>(null)
  const [expandedOrgGroups, setExpandedOrgGroups] = useState<Set<string>>(
    new Set()
  )
  const [expandedRoleGroups, setExpandedRoleGroups] = useState<Set<string>>(
    new Set()
  )
  const [time, setTime] = useState('')
  let landingScreen:string = 'CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1';
  let screenDetails: any = {
           keys:[
  {
    "screensName": "accounts-v1",
    "ufKey": "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1"
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
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      // Format: "11:33 AM" -> convert ":" to "."
      const formatted = now
        .toLocaleTimeString('en-US', options)
        .replace(':', '.')
        .replace(/:\d{2}/, '')
      setTime(formatted)
    }

    updateTime() // initial render
    const timer = setInterval(updateTime, 1000) // update every second
    return () => clearInterval(timer)
  }, [])

  // Format and memoize date only once
  const dateString = useMemo(() => {
    const date = new Date()
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }, [])

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
      setSelectedOrg(
        selectedCombinationData
          ? {
              code: selectedCombinationData.orgCode,
              grpCode: selectedCombinationData.orgGrpCode
            }
          : null
      )
      setSelectedPs(
        selectedCombinationData
          ? {
              code: selectedCombinationData.psCode,
              grpCode: selectedCombinationData.psGrpCode
            }
          : null
      )
    }
  }, [tp_ps])

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

  const handleCardClick = (item: any) => {
    const { orgGrpCode, orgCode, psGrpCode, psCode, roleGrpCode, roleCode } =
      item
    setSelectedCombination({
      orgGrpCode,
      orgCode,
      psGrpCode,
      psCode,
      roleGrpCode,
      roleCode
    })
  }

  const handleNavigationClick = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/UF/getAccessToken`,
        {
          selectedCombination: selectedCombination,
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
              selectedCombination: selectedCombination,
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
        // here we have to set the default authentication route
        router.push(landingScreen)
        setLoading(false)
      }
    } catch (error) {
      toast('Error Fetching AccessToken', 'danger')
    }
  }

  // Flatten all combinations from all access profiles
  const allCombinations = useMemo(() => {
    return accessProfiles
      .filter(item => item.accessProfile === selectedAccessProfile[0])
      .flatMap(profile => profile.combinations || [])
  }, [
    accessProfiles.filter(
      item => item.accessProfile === selectedAccessProfile[0]
    )
  ])

  // Extract unique organizations grouped by orgGrpCode
  const organizationTree = useMemo(() => {
    const orgMap = new Map<
      string,
      { grpName: string; orgs: Array<{ code: string; name: string }> }
    >()

    allCombinations.forEach(combo => {
      if (!orgMap.has(combo.orgGrpCode)) {
        orgMap.set(combo.orgGrpCode, {
          grpName: combo.orgGrpName,
          orgs: []
        })
      }
      const group = orgMap.get(combo.orgGrpCode)!
      if (!group.orgs.find(o => o.code === combo.orgCode)) {
        group.orgs.push({
          code: combo.orgCode,
          name: combo.orgName
        })
      }
    })

    return Array.from(orgMap.entries()).map(([grpCode, data]) => ({
      grpCode,
      grpName: data.grpName,
      orgs: data.orgs
    }))
  }, [allCombinations])

  // Get products/services filtered by selected organization
  const productServices = useMemo(() => {
    if (!selectedOrg) return []

    const psMap = new Map<
      string,
      { grpName: string; items: Array<{ code: string; name: string }> }
    >()

    allCombinations
      .filter(
        combo =>
          combo.orgCode === selectedOrg.code &&
          combo.orgGrpCode === selectedOrg.grpCode
      )
      .forEach(combo => {
        if (!psMap.has(combo.psGrpCode)) {
          psMap.set(combo.psGrpCode, {
            grpName: combo.psGrpName,
            items: []
          })
        }
        const group = psMap.get(combo.psGrpCode)!
        if (!group.items.find(p => p.code === combo.psCode)) {
          group.items.push({
            code: combo.psCode,
            name: combo.psName
          })
        }
      })

    return Array.from(psMap.entries()).map(([grpCode, data]) => ({
      grpCode,
      grpName: data.grpName,
      items: data.items
    }))
  }, [allCombinations, selectedOrg])

  // Get roles filtered by selected organization and product/service
  const roleTree = useMemo(() => {
    if (!selectedOrg || !selectedPs) return []

    const roleMap = new Map<
      string,
      { grpName: string; roles: Array<{ code: string; name: string }> }
    >()

    allCombinations
      .filter(
        combo =>
          combo.orgCode === selectedOrg.code &&
          combo.orgGrpCode === selectedOrg.grpCode &&
          combo.psCode === selectedPs.code &&
          combo.psGrpCode === selectedPs.grpCode
      )
      .forEach(combo => {
        if (!roleMap.has(combo.roleGrpCode)) {
          roleMap.set(combo.roleGrpCode, {
            grpName: combo.roleGrpName,
            roles: []
          })
        }
        const group = roleMap.get(combo.roleGrpCode)!
        if (!group.roles.find(r => r.code === combo.roleCode)) {
          group.roles.push({
            code: combo.roleCode,
            name: combo.roleName
          })
        }
      })

    return Array.from(roleMap.entries()).map(([grpCode, data]) => ({
      grpCode,
      grpName: data.grpName,
      roles: data.roles
    }))
  }, [allCombinations, selectedOrg, selectedPs])

  // Filter data based on search query
  const filteredOrgTree = useMemo(() => {
    if (!searchQuery) return organizationTree
    const query = searchQuery.toLowerCase()
    return organizationTree
      .map(group => ({
        ...group,
        orgs: group.orgs.filter(
          org =>
            org.name.toLowerCase().includes(query) ||
            group.grpName.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.orgs.length > 0)
  }, [organizationTree, searchQuery])

  const filteredProductServices = useMemo(() => {
    if (!searchQuery) return productServices
    const query = searchQuery.toLowerCase()
    return productServices
      .map(group => ({
        ...group,
        items: group.items.filter(
          item =>
            item.name.toLowerCase().includes(query) ||
            group.grpName.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0)
  }, [productServices, searchQuery])

  const filteredRoleTree = useMemo(() => {
    if (!searchQuery) return roleTree
    const query = searchQuery.toLowerCase()
    return roleTree
      .map(group => ({
        ...group,
        roles: group.roles.filter(
          role =>
            role.name.toLowerCase().includes(query) ||
            group.grpName.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.roles.length > 0)
  }, [roleTree, searchQuery])

  const toggleOrgGroup = (grpCode: string) => {
    setExpandedOrgGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(grpCode)) {
        newSet.delete(grpCode)
      } else {
        newSet.add(grpCode)
      }
      return newSet
    })
  }

  const toggleRoleGroup = (grpCode: string) => {
    setExpandedRoleGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(grpCode)) {
        newSet.delete(grpCode)
      } else {
        newSet.add(grpCode)
      }
      return newSet
    })
  }

  const handleOrgSelect = (orgCode: string, grpCode: string) => {
    setActiveTab('ps')
    setSelectedOrg({ code: orgCode, grpCode })
    setSelectedPs(null)
    setSelectedCombination({})
  }

  const handlePsSelect = (psCode: string, grpCode: string) => {
    setActiveTab('role')
    setSelectedPs({ code: psCode, grpCode })
    setSelectedCombination({})
  }

  const handleRoleSelect = (roleCode: string, grpCode: string, combo: any) => {
    handleCardClick(combo)
  }

  const isSelected = (item: any) => {
    return (
      selectedCombination?.orgCode === item.orgCode &&
      selectedCombination?.psCode === item.psCode &&
      selectedCombination?.roleCode === item.roleCode
    )
  }

  return (
    <div className='h-full w-full'>
      <TopNav
        appName={appName}
        navData={[]}
        userDetails={userDetails}
        brandColor={brandColor}
        mode='closed'
      />

      <hr className={twMerge('w-full border', borderColor)} />

      <div className='h-[90vh] px-5 py-2.5'>
        <div className='rounded-md border-2 px-5 py-2 h-full'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-col items-start'>
              <Text variant='display-1'>Profile Selector</Text>
              <Text variant='body-2' color='secondary'>
                Select from the tree to proceed
              </Text>
            </div>
            <div className='flex gap-2 py-2'>
              <div className='w-[10vw]'>
                <Dropdown
                  value={selectedAccessProfile[0]}
                  staticProps={accessProfiles.map(item => item.accessProfile)}
                  className=''
                  onChange={val => {
                    setSelectedAccessProfile([val] as string[])
                    setSelectedCombination({})
                  }}
                />
              </div>
              <Button
                className='flex items-center gap-7 rounded-md'
                icon={loading ? '' : 'MdArrowForward'}
                onClick={handleNavigationClick}
                disabled={
                  activeTab !== 'role' ||
                  Object.keys(selectedCombination).length === 0
                }
              >
                {loading ? (
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

          {/* Main Content Area */}
          <div className=''>
            {selectedAccessProfile.length > 0 ? (
              <div className='flex w-full flex-col gap-5 py-2'>
                {/* Tabs */}
                <div className='flex w-full'>
                  <button
                    onClick={() => setActiveTab('org')}
                    className={twMerge(
                      `flex w-1/3 items-center gap-2 text-nowrap rounded-none border px-6 py-3 font-medium`
                    )}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor =
                        branding.hoverColor)
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor =
                        activeTab === 'org' ? brandColor : 'gray')
                    }
                    style={{
                      backgroundColor:
                        activeTab === 'org' ? brandColor : 'gray',
                      color:
                        activeTab === 'org' ? isLightColor(brandColor) : 'white'
                    }}
                  >
                    <OrgIcon stroke={isLightColor(brandColor)} /> Organizations
                    <span
                      className={twMerge('flex w-full justify-end text-white')}
                    >
                      {
                        organizationTree
                          .find(g => g.grpCode === selectedOrg?.grpCode)
                          ?.orgs.find(o => o.code === selectedOrg?.code)?.name
                      }
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ps')}
                    className={twMerge(
                      `flex w-1/3 items-center gap-2 text-nowrap rounded-none border px-6 py-3 font-medium`
                    )}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor =
                        branding.hoverColor)
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor =
                        activeTab === 'ps' ? brandColor : 'gray')
                    }
                    style={{
                      backgroundColor: activeTab === 'ps' ? brandColor : 'gray',
                      color:
                        activeTab === 'ps' ? isLightColor(brandColor) : 'white'
                    }}
                  >
                    <PSIcon stroke={isLightColor(brandColor)} /> Products /
                    Services
                    <span
                      className={twMerge('flex w-full justify-end text-white')}
                    >
                      {
                        productServices
                          .find(g => g.grpCode === selectedPs?.grpCode)
                          ?.items.find(p => p.code === selectedPs?.code)?.name
                      }
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('role')}
                    className={twMerge(
                      `flex w-1/3 items-center gap-2 text-nowrap rounded-none border px-6 py-3 font-medium`
                    )}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor =
                        branding.hoverColor)
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor =
                        activeTab === 'role' ? brandColor : 'gray')
                    }
                    style={{
                      backgroundColor:
                        activeTab === 'role' ? brandColor : 'gray',
                      color:
                        activeTab === 'role'
                          ? isLightColor(brandColor)
                          : 'white'
                    }}
                  >
                    <RoleIcon stroke={isLightColor(brandColor)} /> Roles
                    <span
                      className={twMerge('flex w-full justify-end text-white')}
                    >
                      {
                        allCombinations.find(
                          c => c.roleCode === selectedCombination.roleCode
                        )?.roleName
                      }
                    </span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className='flex w-full justify-center'>
                  <div
                    className={twMerge(
                      'flex w-[32.5vw] items-center gap-[.5vw] rounded-lg border px-[1vw] py-[1vh]',
                      borderColor
                    )}
                  >
                    <span>
                      <SearchIcon
                        fill={isDark ? 'white' : 'black'}
                        height='0.83vw'
                        width='0.83vw'
                      />
                    </span>
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={'Search'}
                      className={twMerge(
                        `w-full outline-none`,
                        bgColor,
                        textColor
                      )}
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div
                  className={`flex h-[400px] 3xl:h-[570px] w-full overflow-y-auto ${
                    activeTab === 'ps' && filteredProductServices.length !== 0
                      ? ''
                      : 'justify-center'
                  }`}
                >
                  {/* Organizations Tab */}
                  {activeTab === 'org' && (
                    <div className='space-y-2'>
                      {filteredOrgTree.length === 0 ? (
                        <p className={twMerge('py-8 text-center', textColor)}>
                          No organizations found
                        </p>
                      ) : (
                        filteredOrgTree.map(group => (
                          <div
                            className='flex flex-col gap-2'
                            key={group.grpCode}
                          >
                            {/* Organization Group */}
                            <button
                              onClick={() => toggleOrgGroup(group.grpCode)}
                              className={twMerge(
                                'flex w-[32vw] items-center gap-2 rounded-md border px-4 py-2 transition-colors',
                                hoverBgColor,
                                borderColor
                              )}
                            >
                              <span
                                className={`${
                                  expandedOrgGroups.has(group.grpCode)
                                    ? 'rotate-180'
                                    : ''
                                }`}
                              >
                                <DownArrow fill={isDark ? 'white' : 'black'} />
                              </span>
                              <span
                                className={twMerge('font-semibold', textColor)}
                              >
                                {group.grpName}
                              </span>
                            </button>

                            {/* Organizations in Group */}
                            {!expandedOrgGroups.has(group.grpCode) && (
                              <div
                                className={twMerge(
                                  'ml-6 border-l-2',
                                  borderColor
                                )}
                              >
                                <div className='ml-4 space-y-2'>
                                  {group.orgs.map(org => (
                                    <button
                                      key={org.code}
                                      onClick={() =>
                                        handleOrgSelect(org.code, group.grpCode)
                                      }
                                      className={twMerge(
                                        `flex w-full items-center gap-2 rounded-md border px-4 py-2 transition-colors`,
                                        borderColor,
                                        hoverBgColor
                                      )}
                                      style={
                                        selectedOrg?.code === org.code
                                          ? {
                                              backgroundColor: brandColor,
                                              color: isLightColor(brandColor)
                                            }
                                          : {}
                                      }
                                    >
                                      <span>{org.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Products/Services Tab */}
                  {activeTab === 'ps' && (
                    <div>
                      {!selectedOrg ? (
                        <p className={twMerge('py-8 text-center', textColor)}>
                          Please select an organization first
                        </p>
                      ) : filteredProductServices.length === 0 ? (
                        <p className={twMerge('py-8 text-center', textColor)}>
                          No products/services found
                        </p>
                      ) : (
                        <div className='space-y-6'>
                          {filteredProductServices.map(group => (
                            <div key={group.grpCode}>
                              <h3
                                className={twMerge(
                                  'mb-3 px-2 font-semibold',
                                  textColor
                                )}
                              >
                                {group.grpName}
                              </h3>
                              <div className='grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8'>
                                {group.items.map(item => (
                                  <Card
                                    key={item.code}
                                    onClick={() =>
                                      handlePsSelect(item.code, group.grpCode)
                                    }
                                    className={twMerge(
                                      `w-48 rounded-lg border-2 text-left transition-all`,
                                      borderColor
                                    )}
                                    style={
                                      selectedPs?.code === item.code
                                        ? {
                                            backgroundColor: `${brandColor}20`
                                          }
                                        : {}
                                    }
                                  >
                                    <div className='flex flex-col items-start gap-3'>
                                      <ProductIcon
                                        stroke={isDark ? 'white' : 'black'}
                                      />
                                      <span
                                        title={item.name}
                                        className={twMerge(
                                          'w-40 truncate text-nowrap font-medium',
                                          textColor
                                        )}
                                      >
                                        {item.name}
                                      </span>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Roles Tab */}
                  {activeTab === 'role' && (
                    <div className='space-y-2'>
                      {!selectedPs ? (
                        <p className={twMerge('py-8 text-center', textColor)}>
                          Please select a product/service first
                        </p>
                      ) : filteredRoleTree.length === 0 ? (
                        <p className={twMerge('py-8 text-center', textColor)}>
                          No roles found
                        </p>
                      ) : (
                        filteredRoleTree.map(group => (
                          <div
                            className='flex flex-col gap-2'
                            key={group.grpCode}
                          >
                            {/* Role Group */}
                            <button
                              onClick={() => toggleRoleGroup(group.grpCode)}
                              className={twMerge(
                                'flex w-[32vw] items-center gap-2 rounded-md border px-4 py-2 transition-colors',
                                hoverBgColor,
                                borderColor
                              )}
                            >
                              <span
                                className={`${
                                  expandedRoleGroups.has(group.grpCode)
                                    ? 'rotate-180'
                                    : ''
                                }`}
                              >
                                <DownArrow fill={isDark ? 'white' : 'black'} />
                              </span>
                              <span
                                className={twMerge('font-semibold', textColor)}
                              >
                                {group.grpName}
                              </span>
                            </button>

                            {/* Roles in Group */}
                            {!expandedRoleGroups.has(group.grpCode) && (
                              <div
                                className={twMerge(
                                  'ml-6 border-l-2',
                                  borderColor
                                )}
                              >
                                <div className='ml-4 space-y-2'>
                                  {group.roles.map(role => {
                                    const combo = allCombinations.find(
                                      c =>
                                        c.orgCode === selectedOrg?.code &&
                                        c.psCode === selectedPs?.code &&
                                        c.roleCode === role.code
                                    )
                                    return (
                                      <button
                                        key={role.code}
                                        onClick={() =>
                                          handleRoleSelect(
                                            role.code,
                                            group.grpCode,
                                            combo
                                          )
                                        }
                                        className={twMerge(
                                          `flex w-full items-center gap-2 rounded-md border px-4 py-2 transition-colors`,
                                          borderColor,
                                          hoverBgColor,
                                          textColor
                                        )}
                                        style={
                                          isSelected(combo)
                                            ? {
                                                backgroundColor: brandColor,
                                                color: isLightColor(brandColor)
                                              }
                                            : {}
                                        }
                                      >
                                        <span>{role.name}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex h-[60vh] items-center justify-center'>
                <Text variant='body-1' color='secondary'>
                  Please select an access profile to continue
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextSelector
