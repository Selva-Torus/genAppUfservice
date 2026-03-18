'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  DeleteIcon,
  GeneralSettingsIcon,
  Management,
  Multiply,
  Org,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  Security
} from '../../components/svgApplication'
import {
  findPath,
  handleDelete,
  handleDeleteGroupAndMembers
} from '../../components/utils'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { AxiosService } from '@/app/components/axiosService'
import { isLightColor } from '@/app/components/utils'
import UserTable from './UserTable'
import AccessTemplateTable from './AccessTemplateTable'
import GeneralSettings from './GeneralSettings'
import { checkDataAccess } from '../../utils/checkDAP'
import OPRMatrix from '../../components/OprMatrix'
import { useGlobal } from '@/context/GlobalContext'
import { useTheme } from '@/hooks/useTheme'
import { Text } from '@/components/Text'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { Menu } from '@/components/Menu'
import { twMerge } from 'tailwind-merge'
import i18n from '../../components/i18n'
import { Tabs } from '@/components/Tabs'
import OrganizationLink from './OrganizationLink'
import clsx from 'clsx'
import { getFontSizeForHeader } from '@/app/utils/branding'

type SettingTabs = 'org' | 'st' | 'user' | 'general'

export interface SetupScreenContextType {
  userProfileData: any
  setUserProfileData: React.Dispatch<React.SetStateAction<any>>
  selectedRows: Set<string>
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>
  tenantProfileData: Record<string, any>
  setTenantProfileData: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >
  orgGrpData: any
  setOrgGrpData: React.Dispatch<React.SetStateAction<any>>
  focusedPath: string | null
  setFocusedPath: React.Dispatch<React.SetStateAction<string | null>>
  psList: Set<string>
  securityData: any
  onUpdateSecurityData: (updatedData: any[]) => void
  selectedOptions: Record<string, any>
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>
  allOptions: Record<string, any>
  setAllOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>
  getRoleOptions: (organization: any) => void
  getPsOptions: (roles: any) => void
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  indexOfTemplateToBeUpdated: number | null
  setIndexOfTemplateToBeUpdated: React.Dispatch<
    React.SetStateAction<number | null>
  >
  templateToBeUpdated: Record<string, any> | null
  setTemplateToBeUpdated: React.Dispatch<
    React.SetStateAction<Record<string, any> | null>
  >
  orgMasterData: any
  setOrgMasterData: React.Dispatch<React.SetStateAction<any>>
}

export const SetupScreenContext =
  React.createContext<SetupScreenContextType | null>(null)

const SetupScreen = ({
  tenantAccess
}: {
  tenantAccess: 'view' | 'edit' | null | undefined
}) => {
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<SettingTabs>('general')
  const [orgGrpData, setOrgGrpData] = useState<any>([])
  const [tenantProfileData, setTenantProfileData] = useState<
    Record<string, any>
  >({})
  const [securityData, setSecurityData] = useState<any>([])
  const [userProfileData, setUserProfileData] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  )
  const { branding } = useGlobal()
  const { borderColor, textColor, bgColor, isDark } = useTheme()
  const { brandColor } = branding
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [focusedPath, setFocusedPath] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [psList, setPSList] = useState<Set<string>>(new Set())
  const [assignedOPRList, setAssignedOPRList] = useState<Array<string>>([])
  const [refetch, setRefetch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'orgsetup' | 'oprmatrix'>(
    'orgsetup'
  )
  const [masterState, setMasterState] = useState<Record<string, any>>({
    profile: {},
    org: [],
    st: [],
    user: []
  })
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})
  const [allOptions, setAllOptions] = useState<Record<string, string>>({})
  const toast = useInfoMsg()
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const ag = process.env.NEXT_PUBLIC_APPGROUPCODE
  const app = process.env.NEXT_PUBLIC_APPCODE
  const userManagementAccess = useMemo(
    () => checkDataAccess(getCookie('token')),
    []
  )
  const [indexOfTemplateToBeUpdated, setIndexOfTemplateToBeUpdated] = useState<
    number | null
  >(null)
  const [templateToBeUpdated, setTemplateToBeUpdated] = useState<Record<
    string,
    any
  > | null>(null)
  const [isView, setIsView] = useState(false)
  const [currentLang, setCurrentLang] = useState(getCookie('cfg_lang')) // 'en'
  const keyset = useMemo(() => {
    return i18n.keyset('language')
  }, [currentLang]) // i18n.keyset('language')
  const [orgMasterData, setOrgMasterData] = useState([])
  let srcOrgIds: Array<string> = useMemo(() => {
    return collectUniqueSrcIds(orgGrpData)
  }, [orgGrpData])

  const onUpdateSecurityData = (updatedData: any[]) => {
    setSecurityData(updatedData)
  }

  const formattedDate = new Date()
    .toLocaleString('en-US', {
      month: 'long', // Full month name
      day: '2-digit', // Two-digit day
      year: 'numeric', // Full year
      hour: '2-digit', // Two-digit hour
      minute: '2-digit', // Two-digit minute
      second: '2-digit', // Two-digit second
      hour12: false // 24-hour format
    })
    .replace(`at`, `|`)

  const handleAddNewTemplate = () => {
    const newTemplate = {
      accessProfile: `Template ${securityData.length + 1}`,
      dap: '',
      organization: [],
      'products/Services': [],
      roles: [],
      'no.ofusers': 0,
      createdOn: formattedDate
    }
    setSelectedOptions((prev: any) => ({
      ...prev,
      [formattedDate]: {
        selectedOrg: [],
        selectedRg: [],
        selectedPsg: []
      }
    }))
    setAllOptions((prev: any) => ({
      ...prev,
      [formattedDate]: {
        roleOptions: [],
        psOptions: []
      }
    }))
    onUpdateSecurityData([...securityData, newTemplate])
  }

  type AnyObject = Record<string, any>
  function collectUniqueSrcIds(data: AnyObject | AnyObject[]): string[] {
    const srcIdSet = new Set<string>()

    function traverse(node: AnyObject) {
      if (!node || typeof node !== 'object') return

      if (typeof node.srcId === 'string') {
        srcIdSet.add(node.srcId) // Set ensures uniqueness
      }

      for (const key in node) {
        const value = node[key]

        if (Array.isArray(value)) {
          value.forEach(traverse)
        } else if (typeof value === 'object' && value !== null) {
          traverse(value)
        }
      }
    }

    Array.isArray(data) ? data.forEach(traverse) : traverse(data)

    return Array.from(srcIdSet)
  }

  const getOrgAndUserData = async () => {
    try {
      if (!userManagementAccess) return
      const response = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAppSecurityData`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (response.status === 200) {
        if (
          response?.data?.orgMaster &&
          Array.isArray(response?.data?.orgMaster)
        ) {
          setOrgMasterData(response?.data?.orgMaster)
        }
        if (
          response?.data?.orgMatrix &&
          Array.isArray(response?.data?.orgMatrix)
        ) {
          setOrgGrpData(response?.data?.orgMatrix)
          setMasterState(prev => ({
            ...prev,
            org: response?.data?.orgMatrix
          }))
        } else {
          setMasterState(prev => ({ ...prev, org: [] }))
        }
        if (response.data.users && Array.isArray(response.data.users)) {
          const result = response.data.users.map((item: any, i: number) => ({
            ...item,
            user: '',
            email: item.email,
            profile: item?.profile ?? '',
            firstName: item.firstName,
            lastName: item.lastName,
            loginId: item.loginId,
            mobile: item.mobile,
            accessProfile: item?.accessProfile ?? [],
            noOfProductsService: item?.noOfProductsService || 0,
            accessExpires: item?.accessExpires,
            lastActive: item?.lastActive ?? 'NA',
            dateAdded: item.dateAdded,
            isAppAdmin: item.isAppAdmin,
            edit: '',
            userUniqueId: item?.userUniqueId
          }))
          setUserProfileData(result)
          setMasterState(prev => ({ ...prev, user: result }))
        } else {
          setMasterState(prev => ({ ...prev, user: [] }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const menuItems = useMemo(() => {
    if (userManagementAccess) {
      return [
        {
          name: 'General',
          svg: <GeneralSettingsIcon fill={isDark ? 'white' : 'black'} />,
          code: 'general'
        },
        {
          name: 'Organizational Matrix',
          svg: <Org fill={isDark ? 'white' : 'black'} />,
          code: 'org'
        },
        {
          name: 'Access Template',
          svg: <Security fill={isDark ? 'white' : 'black'} />,
          code: 'st'
        },
        {
          name: 'User Management',
          svg: <Management fill={isDark ? 'white' : 'black'} />,
          code: 'user'
        }
      ]
    } else {
      return [
        {
          name: 'General',
          svg: <GeneralSettingsIcon fill={isDark ? 'white' : 'black'} />,
          code: 'general'
        }
      ]
    }
  }, [selectedMenuItem, isDark])

  const resetStates = (code: 'org' | 'st' | 'user' | string) => {
    switch (code) {
      case 'org':
        setOrgGrpData(masterState[code])
        break
      case 'st':
        setSecurityData(masterState[code])
        break
      case 'user':
        setUserProfileData(masterState[code])
        break
      default:
        break
    }
  }

  const handleMenuClick = (itemCode: SettingTabs) => {
    setSelectedMenuItem(itemCode)
    setSelectedItems({})
    setSelectedRows(new Set())
    setTemplateToBeUpdated(null)
    setIndexOfTemplateToBeUpdated(null)
    resetStates(itemCode)
    setActiveTab('orgsetup')
  }

  const saveJson = async (key: string, data: any) => {
    const res = await AxiosService.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/setJson?key=${key}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      }
    )

    return res.status === 201
  }

  const masterSave = async (isDeletion: boolean = false) => {
    try {
      const response = await AxiosService.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/postOrgData`,
        {
          masterData : orgMasterData,
          matrixData : orgGrpData
        },
        {
          headers : {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      // const results = await Promise.all([
      //   saveJson(orgKey, orgGrpData),
      //   saveJson(orgMasterKey, orgMasterData)
      // ])

      if (response.status == 201) {
        setRefetch(prev => !prev)
        toast(
          `Data ${isDeletion ? 'Deleted' : 'Saved'} Successfully`,
          'success'
        )
      } else {
        toast('Something went wrong', 'danger')
      }
    } catch (error) {
      toast('Something went wrong', 'danger')
    }
  }

  const getRoleOptions = (psGrps: any) => {
    const initialRoleOptions: any[] = []
    if (psGrps?.length) {
      psGrps.forEach((grpPSG: any) => {
        grpPSG.ps.forEach((ps: any) => {
          ps.roleGrp.forEach((roleGrp: any) => {
            initialRoleOptions.push({
              ...roleGrp,
              psGrpCode: grpPSG.psGrpCode,
              psCode: ps.psCode
            })
          })
        })
      })
    }
    return initialRoleOptions
  }

  const getPsOptions = (organization: any) => {
    const initialProductServiceOptions: any[] = []
    if (organization?.length) {
      organization.forEach((grpOrg: any) => {
        grpOrg.org.forEach((org: any) => {
          org.psGrp.forEach((psGrp: any) => {
            initialProductServiceOptions.push({
              ...psGrp,
              orgGrpCode: grpOrg.orgGrpCode,
              orgCode: org.orgCode
            })
          })
        })
      })
    }
    return initialProductServiceOptions
  }

  const getAssignedOPRList = (templateData: any) => {
    const reservedKeys = [
      'orgGrpId',
      'orgId',
      'subOrgGrpId',
      'subOrgId',
      'psGrpId',
      'psId',
      'roleGrpId',
      'roleId'
    ]
    const oprList: Set<string> = new Set([])

    const traverse = (node: any) => {
      if (node && typeof node === 'object') {
        for (const key in node) {
          if (reservedKeys.includes(key) && typeof node[key] === 'string') {
            oprList.add(node[key])
          } else if (typeof node[key] === 'object') {
            traverse(node[key])
          }
        }
      }
    }

    if (typeof templateData === 'object' && Array.isArray(templateData)) {
      templateData.forEach((template: any) => {
        if (
          template &&
          template['orgGrp'] &&
          typeof template['orgGrp'] === 'object' &&
          Array.isArray(template['orgGrp'])
        ) {
          traverse(template['orgGrp'])
        }
      })
    }
    return Array.from(oprList)
  }

  const getSecurityTemplate = async () => {
    try {
      if (!userManagementAccess) return
      const res = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAPPSecurityTemplateData`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (res.status === 200) {
        const oprList = getAssignedOPRList(res.data)
        if (oprList) {
          setAssignedOPRList(oprList)
        }
        const result: any[] = res.data.map((item: any) => {
          return {
            ...item,
            accessProfile: item.accessProfile,
            dap: item.dap ?? '',
            organization: item.organization ?? [],
            roles: item.roles ?? [],
            orgGrp: item.orgGrp ?? [],
            'products/Services': item['products/Services'] ?? [],
            'no.ofusers': item['no.ofusers'],
            createdOn: item.createdOn,
            roleUniqueId: item.roleUniqueId
          }
        })
        onUpdateSecurityData(result)
        setMasterState(prev => ({ ...prev, st: result }))

        result.forEach((item: any) => {
          setSelectedOptions((prevState: any) => ({
            ...prevState,
            [item.createdOn]: {
              selectedOrg: item.organization,
              selectedRg: item.roles,
              selectedPsg: item['products/Services']
            }
          }))

          setAllOptions((prevState: any) => ({
            ...prevState,
            [item.createdOn]: {
              psOptions: getPsOptions(item?.organization ?? []),
              roleOptions: getRoleOptions(item?.['products/Services'] ?? [])
            }
          }))
        })
      } else {
        toast('Something went wrong', 'danger')
      }
    } catch (error) {
      toast('Error Fetching Security Template Data', 'danger')
    }
  }

  const handleUserDataSave = async (
    isDeletion: boolean = false,
    data?: any
  ) => {
    try {
      const res = await AxiosService.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/postAppUserList`,
        {
          data: data ? data : userProfileData
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (res.status == 201) {
        setRefetch(prev => !prev)
        toast(
          `Data ${isDeletion ? 'Deleted' : 'Saved'} Successfully`,
          'success'
        )
      }
    } catch (error) {
      toast('Error saving user details', 'danger')
    }
  }

  const handleSecurityDataSave = async (
    isDeletion: boolean = false,
    data?: any
  ) => {
    try {
      const res = await AxiosService.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/appSecurityTemplateData`,
        {
          data: data ? data : securityData
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          },
          params: {
            key: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:securityTemplate`
          }
        }
      )
      if (res.status == 201) {
        setRefetch(prev => !prev)
        toast(
          `Data ${isDeletion ? 'Deleted' : 'Saved'} Successfully`,
          'success'
        )
      } else {
        toast(`Data ${isDeletion ? 'Deletion' : 'Saving'} Failed`, 'danger')
      }
    } catch (error) {
      toast(`Error Posting security Template Data`, 'danger')
    }
  }

  const handleSaveButtonClick = async () => {
    switch (selectedMenuItem) {
      case 'st':
        if (indexOfTemplateToBeUpdated != null) {
          const updatedSecurityData = [...securityData]
          updatedSecurityData[indexOfTemplateToBeUpdated] = templateToBeUpdated
          setSecurityData(updatedSecurityData)
          await handleSecurityDataSave(false, updatedSecurityData)
        } else {
          await handleSecurityDataSave()
        }
        break
      case 'user':
        await handleUserDataSave()
        break
      default:
        await masterSave()
        break
    }
  }

  const handlePlusButtonClick = () => {
    switch (selectedMenuItem) {
      case 'org':
        document.getElementById('orpsAdditionBtnWithFocus')?.click()
        break
      case 'st':
        handleAddNewTemplate()
        break
      case 'user':
        document.getElementById('tanantUser-creation-btn')?.click()
        break
      default:
        break
    }
  }

  const handleDeleteButtonClick = () => {
    switch (selectedMenuItem) {
      case 'st':
        let updatedSelectedRows = selectedRows
        if (selectedRows.has('all')) {
          updatedSelectedRows = new Set(
            securityData.map((item: any) => item.accessProfile)
          )
          userProfileData.forEach((item: any) => {
            item.accessProfile.forEach((profile: any) => {
              if (updatedSelectedRows.has(profile)) {
                updatedSelectedRows.delete(profile)
              }
            })
          })
        }
        handleDelete(
          securityData,
          updatedSelectedRows,
          setSelectedRows,
          onUpdateSecurityData,
          handleSecurityDataSave,
          'accessProfile'
        )
        break
      case 'user':
        handleDelete(
          userProfileData,
          selectedRows,
          setSelectedRows,
          setUserProfileData,
          handleUserDataSave,
          'email'
        )
        break
      default:
        break
    }
    setDeleteModalOpen(false)
    setRefetch(prev => !prev)
  }

  useEffect(() => {
    getSecurityTemplate()
    getOrgAndUserData()
    setLoading(false)
  }, [refetch])

  return (
    <>
      {!loading ? (
        <SetupScreenContext.Provider
          value={{
            userProfileData,
            setUserProfileData,
            selectedRows,
            setSelectedRows,
            tenantProfileData,
            setTenantProfileData,
            orgGrpData,
            setOrgGrpData,
            focusedPath,
            setFocusedPath,
            psList,
            securityData,
            onUpdateSecurityData,
            selectedOptions,
            setSelectedOptions,
            allOptions,
            setAllOptions,
            getRoleOptions,
            getPsOptions,
            searchTerm,
            setSearchTerm,
            indexOfTemplateToBeUpdated,
            setIndexOfTemplateToBeUpdated,
            templateToBeUpdated,
            setTemplateToBeUpdated,
            orgMasterData,
            setOrgMasterData
          }}
        >
          <div
            className={`g-root flex h-[90%] w-full flex-col overflow-hidden`}
          >
            <div className={'flex w-full items-center justify-between px-2'}>
              {/* LEFT : TITLE */}
              <Text
                contentAlign='left'
                variant={getFontSizeForHeader(branding.fontSize)}
                className='whitespace-nowrap font-semibold'
              >
                {keyset('User Management')}
              </Text>

              {/* CENTER : SEARCH + ACTIONS */}
              <div className='flex w-full items-center gap-2 py-2'>
                <div
                  style={{
                    visibility:
                      selectedMenuItem === 'general' ? 'hidden' : 'visible'
                  }}
                  className={twMerge(
                    'flex h-fit items-center gap-2 rounded border px-2',
                    borderColor
                  )}
                >
                  <SearchIcon
                    fill={isDark ? 'white' : 'black'}
                    height='12'
                    width='12'
                  />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={keyset('Search')}
                    className={twMerge('px-2 py-1.5 outline-none', bgColor)}
                  />
                </div>

                <div
                  className='flex items-center gap-2'
                  style={{
                    visibility:
                      selectedMenuItem === 'general' ? 'hidden' : 'visible'
                  }}
                >
                  {/* PLUS BUTTON */}
                  <button
                    hidden={
                      // selectedMenuItem == 'user' ||
                      selectedMenuItem == 'org' ||
                      (selectedMenuItem == 'st' && templateToBeUpdated)
                        ? true
                        : false
                    }
                    onClick={handlePlusButtonClick}
                    style={{
                      backgroundColor: brandColor,
                      opacity:
                        selectedMenuItem === 'org' && !focusedPath ? 0.5 : 1
                    }}
                    className='rounded-md px-2 py-1.5 outline-none'
                    disabled={tenantAccess !== 'edit'}
                  >
                    <PlusIcon
                      fill={isLightColor(brandColor)}
                      height='16'
                      width='16'
                    />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    hidden={
                      selectedMenuItem == 'user' ||
                      selectedMenuItem == 'org' ||
                      (selectedMenuItem == 'st' && templateToBeUpdated)
                        ? true
                        : false
                    }
                    className={`${
                      selectedMenuItem === 'org' ? 'hidden' : ''
                    } outline-none ${
                      ((selectedMenuItem === 'st' ||
                        selectedMenuItem === 'user') &&
                        Array.from(selectedRows).filter(Boolean).length > 0) ||
                      (Object.keys(selectedItems).length > 0 &&
                        Object.values(selectedItems).includes(true))
                        ? 'bg-[#F14336]'
                        : 'bg-[#F14336]/50'
                    } rounded-md px-2 py-1.5`}
                    disabled={
                      selectedMenuItem === 'st' || selectedMenuItem === 'user'
                        ? Array.from(selectedRows).filter(Boolean).length > 0
                          ? false
                          : true
                        : Object.keys(selectedItems).length > 0 &&
                          Object.values(selectedItems).includes(true)
                        ? tenantAccess != 'edit'
                          ? true
                          : false
                        : true
                    }
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <DeleteIcon fill='white' height='16' width='16' />
                  </button>
                  <Modal
                    // className='w-[25.5vw] lg:w-[20.5vw]'
                    onClose={() => setDeleteModalOpen(false)}
                    showCloseButton={false}
                    open={deleteModalOpen}
                  >
                    <div className='flex items-center justify-between'>
                      <Text
                        variant={getFontSizeForHeader(branding.fontSize)}
                        contentAlign='left'
                        className='flex items-center gap-2 text-nowrap text-[#EB5757]'
                      >
                        <DeleteIcon fill='#EB5757' />
                        {selectedMenuItem === 'st'
                          ? keyset('Delete AccessTemplate')
                          : selectedMenuItem === 'user' &&
                            keyset('Delete User')}
                      </Text>
                      <Button
                        className={'!w-fit rounded-md p-1'}
                        onClick={() => setDeleteModalOpen(false)}
                      >
                        <Multiply fill={isDark ? 'white' : 'black'} />
                      </Button>
                    </div>
                    <hr className={twMerge('w-full', borderColor)} />
                    <div className='flex w-full flex-col gap-2 p-2'>
                      <Text
                        className='text-nowrap'
                        contentAlign='left'
                      >
                        {selectedMenuItem === 'st'
                          ? keyset(
                              'Are you sure you want to delete this template?'
                            )
                          : selectedMenuItem === 'user' &&
                            keyset(
                              'Are you sure you want to delete this user?'
                            )}
                      </Text>
                      <Text
                        color='secondary'
                        className='text-nowrap'
                        contentAlign='left'
                      >
                        {selectedMenuItem === 'st'
                          ? keyset(
                              'Deleting the template will remove all associated'
                            )
                          : selectedMenuItem === 'user' &&
                            keyset(
                              'Deleting the user will remove all associated'
                            )}
                      </Text>
                    </div>
                    <hr className={twMerge('w-full', borderColor)} />
                    <div className='flex w-full items-center justify-end p-2 pb-0'>
                      <div>
                        <Button
                          view='raised'
                          onClick={() => setDeleteModalOpen(false)}
                          className='px-2 py-1'
                        >
                          {keyset('Cancel')}
                        </Button>
                      </div>
                      <div>
                        <Button
                          view='flat-danger'
                          onClick={handleDeleteButtonClick}
                          className='px-2 py-1'
                        >
                          {keyset('Delete')}
                        </Button>
                      </div>
                    </div>
                  </Modal>

                  {/* SAVE BUTTON */}
                  <button
                    onClick={handleSaveButtonClick}
                    className='rounded-md bg-[#1C274C] px-2 py-1.5 outline-none'
                    disabled={tenantAccess !== 'edit' || isView}
                    hidden={selectedMenuItem === 'user'}
                  >
                    <SaveIcon height='18' width='18' />
                  </button>
                </div>
              </div>

              {/* RIGHT : TABS */}
              {selectedMenuItem === 'org' && (
                <Tabs
                  direction='horizontal'
                  items={[
                    { id: 'orgsetup', title: 'Organization Setup' },
                    { id: 'oprmatrix', title: 'OPR Matrix' }
                  ]}
                  onChange={(e) => {
                    setActiveTab(e)
                    setSearchTerm('')
                  }}
                  defaultActiveId='orgsetup'
                  className='!w-[900px]'
                />
              )}
            </div>

            <hr className={twMerge('w-full', borderColor)}></hr>
            <div
              className={clsx(`flex h-[85vh]`, {
                'h-fit': selectedMenuItem === 'st'
              })}
            >
              <div
                style={{
                  minWidth: '200px'
                }}
                className={twMerge(`border-r`, borderColor)}
              >
                <Menu size='s' className='h-full'>
                  {menuItems.map(item => (
                    <Menu.Item
                      iconStart={item.svg}
                      key={item.code}
                      className='truncate text-nowrap'
                      active={selectedMenuItem === item.code}
                      onClick={() => {
                        handleMenuClick(item.code as SettingTabs)
                        setIsView(false)
                        setSearchTerm('')
                      }}
                    >
                      <Text contentAlign='left'>{(item.name)}</Text>
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
              <div className='flex-1 min-w-0 overflow-auto px-2 py-3'>
                {selectedMenuItem == 'general' ? (
                  <GeneralSettings
                    currentLang={currentLang}
                    setCurrentLang={setCurrentLang}
                  />
                ) : selectedMenuItem === 'user' ? (
                  <UserTable
                    data={userProfileData}
                    setData={setUserProfileData}
                  />
                ) : selectedMenuItem === 'org' ? (
                  <div className='w-full'>
                    {activeTab === 'orgsetup' ? (
                      <OrganizationLink
                        srcOrgIds={srcOrgIds}
                        assignedOPRList={assignedOPRList}
                      />
                    ) : (
                      <OPRMatrix assignedOPRList={assignedOPRList} />
                    )}
                  </div>
                ) : (
                  selectedMenuItem === 'st' && (
                    <AccessTemplateTable
                      isView={isView}
                      setIsView={setIsView}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </SetupScreenContext.Provider>
      ) : (
        <></>
      )}
    </>
  )
}

export default SetupScreen
