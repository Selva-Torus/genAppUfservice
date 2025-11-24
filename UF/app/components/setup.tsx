'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
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
} from '../components/svgApplication'
import {
  findPath,
  handleDelete,
  handleDeleteGroupAndMembers
} from '../components/utils'
import { Button, Card, Menu, Modal, Text } from '@gravity-ui/uikit'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { AxiosService } from '@/app/components/axiosService'
import { isLightColor } from '@/app/components/utils'
import UserTable from './userTable'
import AccessTemplateTable from './accessTemplateTable'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import GeneralSettings from './generalSettings'
import { useGravityThemeClass } from '../utils/useGravityUITheme'
import { checkDataAccess } from '../utils/checkDAP'
import OPRMatrix from './OprMatrix'

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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [focusedPath, setFocusedPath] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [psList, setPSList] = useState<Set<string>>(new Set())
  const [assignedOPRList, setAssignedOPRList] = useState<Array<string>>([])
  const [refetch, setRefetch] = useState(false)
  const { property, setProperty } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'
  const [searchTerm, setSearchTerm] = useState('')
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
  const themeClass = useGravityThemeClass()
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
          svg: <GeneralSettingsIcon fill={`var(--g-color-text-primary)`} />,
          code: 'general'
        },
        {
          name: 'Organizational Matrix',
          svg: <Org fill={`var(--g-color-text-primary)`} />,
          code: 'org'
        },
        {
          name: 'Access Template',
          svg: <Security fill={`var(--g-color-text-primary)`} />,
          code: 'st'
        },
        {
          name: 'User Management',
          svg: <Management fill={`var(--g-color-text-primary)`} />,
          code: 'user'
        }
      ]
    } else {
      return [
        {
          name: 'General',
          svg: <GeneralSettingsIcon fill={`var(--g-color-text-primary)`} />,
          code: 'general'
        }
      ]
    }
  }, [selectedMenuItem])

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
    resetStates(itemCode)
  }

  const masterSave = async (isDeletion: boolean = false, data?: any) => {
    if (!isDeletion) {
      if (selectedMenuItem == 'org') {
        if (findPath(orgGrpData, '')) {
          toast(
            'Please fill all the fields to save organization matrix',
            'warning'
          )
          return
        }
      }
    }
    const key = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:${tenant}:AFGK:${ag}:AFK:${app}:AFVK:v1:orgMatrix`
    try {
      const res = await AxiosService.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/setJson?key=${key}`,
        {
          data: orgGrpData
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
      } else {
        toast('Something went wrong', 'danger')
      }
    } catch (error) {
      console.error(error)
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

  const getAssignedOPRList = async (securityTemplateData: any) => {
    const assignedOPRList: Set<string> = new Set([])
    if (
      typeof securityTemplateData == 'object' &&
      Array.isArray(securityTemplateData)
    ) {
      securityTemplateData.forEach(template => {
        if (
          typeof template['orgGrp'] == 'object' &&
          Array.isArray(template['orgGrp'])
        ) {
          template['orgGrp'].forEach(orgGrp => {
            if (
              typeof orgGrp['org'] == 'object' &&
              Array.isArray(orgGrp['org'])
            ) {
              orgGrp['org'].forEach(org => {
                if (
                  typeof org['psGrp'] == 'object' &&
                  Array.isArray(org['psGrp'])
                ) {
                  org['psGrp'].forEach(psGrp => {
                    if (
                      typeof psGrp['ps'] == 'object' &&
                      Array.isArray(psGrp['ps'])
                    ) {
                      psGrp['ps'].forEach(ps => {
                        if (
                          typeof ps['roleGrp'] == 'object' &&
                          Array.isArray(ps['roleGrp'])
                        ) {
                          ps['roleGrp'].forEach(roleGrp => {
                            if (
                              typeof roleGrp['roles'] == 'object' &&
                              Array.isArray(roleGrp['roles'])
                            ) {
                              roleGrp['roles'].forEach(role => {
                                if (
                                  role?.['roleCode'] &&
                                  typeof role?.['roleCode'] == 'string'
                                ) {
                                  const orgGrpId = orgGrp['orgGrpId']
                                  const orgId = org['orgId']
                                  const psGrpId = psGrp['psGrpId']
                                  const psId = ps['psId']
                                  const roleGrpId = roleGrp['roleGrpId']
                                  const roleId = role['roleId']
                                  if (
                                    orgGrpId &&
                                    orgId &&
                                    psGrpId &&
                                    psId &&
                                    roleGrpId &&
                                    roleId
                                  ) {
                                    assignedOPRList.add(orgGrpId)
                                    assignedOPRList.add(orgId)
                                    assignedOPRList.add(psGrpId)
                                    assignedOPRList.add(psId)
                                    assignedOPRList.add(roleGrpId)
                                    assignedOPRList.add(roleId)
                                  }
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
    return Array.from(assignedOPRList)
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
        const oprList = await getAssignedOPRList(res.data)
        if (oprList) {
          setAssignedOPRList(oprList)
        }
        const result: any[] = res.data.map((item: any) => {
          return {
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
      case 'org':
        if (orgGrpData.length === 1) {
          toast(`You can't delete the last organization matrix`, 'danger')
          return
        }
        const deleteResponse = handleDeleteGroupAndMembers(
          orgGrpData,
          selectedItems,
          setSelectedItems,
          setOrgGrpData,
          masterSave
        )
        if (deleteResponse.success) {
          toast(`ORP Deleted Successfully`, 'success')
        } else {
          toast(`ORP Deletion Failed`, 'danger')
        }
        break
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
            setTemplateToBeUpdated
          }}
        >
          <div
            className={`g-root flex h-[90%] w-full flex-col overflow-hidden ${themeClass}`}
          >
            <div className='flex w-2/3  items-center justify-between px-2'>
              <Text variant='header-1' className='text-nowrap'>
                User Management
              </Text>
              <div className='flex items-center gap-2 py-2'>
                <div
                  style={{
                    visibility:
                      selectedMenuItem == 'general' ? 'hidden' : 'unset',
                    borderColor: 'var(--g-color-line-generic)'
                  }}
                  className='flex h-fit items-center gap-2 rounded border px-2'
                >
                  <span>
                    <SearchIcon
                      fill={themeClass.includes('dark') ? '#ffffff' : '#000000'}
                      height='12'
                      width='12'
                    />
                  </span>
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={'Search'}
                    style={{
                      backgroundColor: 'var(--g-color-base-background)',
                      color: 'var(--g-color-text-primary)'
                    }}
                    className='px-2 py-1.5 outline-none'
                  />
                </div>
                <div className=' flex items-center'>
                  <div
                    className=' flex items-center gap-2'
                    style={{
                      visibility:
                        selectedMenuItem == 'general' ? 'hidden' : 'unset'
                    }}
                  >
                    <button
                      hidden={
                        selectedMenuItem == 'user' || selectedMenuItem == 'org' || (selectedMenuItem == "st" && templateToBeUpdated)
                          ? true
                          : false
                      }
                      onClick={handlePlusButtonClick}
                      style={{
                        backgroundColor: brandcolor,
                        opacity:
                          selectedMenuItem === 'org' && !focusedPath ? 0.5 : 1
                      }}
                      className={`rounded-md px-2 py-1.5 outline-none`}
                      disabled={tenantAccess != 'edit'}
                    >
                      <PlusIcon
                        fill={isLightColor(brandcolor)}
                        height='16'
                        width='16'
                      />
                    </button>

                    <button
                      hidden={selectedMenuItem == 'user' || selectedMenuItem == 'org' || (selectedMenuItem == "st" && templateToBeUpdated)
                          ? true
                          : false}
                      className={`${
                        selectedMenuItem === 'org' ? 'hidden' : ''
                      } outline-none ${
                        ((selectedMenuItem === 'st' ||
                          selectedMenuItem === 'user') &&
                          Array.from(selectedRows).filter(Boolean).length >
                            0) ||
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
                    <Modal open={deleteModalOpen} disableOutsideClick>
                      <Card className='p-2'>
                        <div className='flex w-full items-center justify-between px-2 pb-2'>
                          <Text
                            variant='header-1'
                            className='flex items-center gap-2 text-[#EB5757]'
                          >
                            <DeleteIcon fill='#EB5757' />
                            {selectedMenuItem === 'st'
                              ? 'Delete AccessTemplate'
                              : selectedMenuItem === 'user' && 'Delete User'}
                          </Text>
                          <button onClick={() => setDeleteModalOpen(false)}>
                            <Multiply fill='var(--g-color-text-secondary)' />
                          </button>
                        </div>
                        <hr
                          className='w-full'
                          style={{ borderColor: 'var(--g-color-line-generic)' }}
                        />
                        <div className='flex w-full flex-col gap-2 p-2'>
                          <Text variant='header-2'>
                            {selectedMenuItem === 'st'
                              ? 'Are you sure you want to delete this template?'
                              : selectedMenuItem === 'user' &&
                                'Are you sure you want to delete this user?'}
                          </Text>
                          <Text variant='body-1' color='secondary'>
                            {selectedMenuItem === 'st'
                              ? 'Deleting the template will remove all associated'
                              : selectedMenuItem === 'user' &&
                                'Deleting the user will remove all associated'}
                          </Text>
                        </div>
                        <hr
                          className='w-full'
                          style={{ borderColor: 'var(--g-color-line-generic)' }}
                        />
                        <div className='flex w-full items-center justify-end gap-2 p-2 pb-0'>
                          <Button
                            view='flat'
                            onClick={() => setDeleteModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            view='flat'
                            onClick={handleDeleteButtonClick}
                            style={{
                              backgroundColor: '#EB5757',
                              color: 'white'
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    </Modal>

                    <button
                      onClick={handleSaveButtonClick}
                      className={`rounded-md bg-[#1C274C] px-2 py-1.5 outline-none`}
                      disabled={tenantAccess != 'edit'}
                      hidden={selectedMenuItem == 'user' ? true : false}
                    >
                      <SaveIcon height='18' width='18' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr
              style={{ borderColor: 'var(--g-color-line-generic)' }}
              className=' w-full'
            ></hr>
            <div className='flex h-[85vh]'>
              <div
                style={{
                  borderRight: `1px solid var(--g-color-line-generic)`,
                  minWidth: '200px'
                }}
              >
                <Menu size='xl' className='h-full'>
                  {menuItems.map(item => (
                    <Menu.Item
                      iconStart={item.svg}
                      key={item.code}
                      className='text-nowrap'
                      active={selectedMenuItem === item.code}
                      onClick={() => handleMenuClick(item.code as SettingTabs)}
                    >
                      {item.name}
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
              <div className='flex h-full w-full overflow-hidden px-2 py-3'>
                {selectedMenuItem == 'general' ? (
                  <GeneralSettings />
                ) : selectedMenuItem === 'user' ? (
                  <UserTable
                    data={userProfileData}
                    setData={setUserProfileData}
                  />
                ) : selectedMenuItem === 'org' ? (
                  <div className='w-full'>
                    <OPRMatrix assignedOPRList={assignedOPRList} />
                    {/* <OrgMatrix tenantAccess={'edit'} /> */}
                  </div>
                ) : (
                  selectedMenuItem === 'st' && <AccessTemplateTable />
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
