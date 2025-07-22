'use client'
import React, { useContext, useEffect, useState } from 'react'
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
import OrgMatrix from './orgMatrix'
import {
  findPath,
  handleDelete,
  handleDeleteGroupAndMembers
} from '../components/utils'
import { Modal } from '@gravity-ui/uikit'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { AxiosService } from '@/app/components/axiosService'
import { isLightColor } from '@/app/components/utils'
import UserTable from './userTable'
import AccessTemplateTable from './accessTemplateTable'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import GeneralSettings from './generalSettings'

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
}

export const SetupScreenContext =
  React.createContext<SetupScreenContextType | null>(null)

const SetupScreen = ({
  tenantAccess
}: {
  tenantAccess: 'view' | 'edit' | null | undefined
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<SettingTabs>('general')
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
      roles: [],
      'products/Services': [],
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
      const response = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAppSecurityData`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (response.status === 200) {
        if (response.data.orgMatrix && Array.isArray(response.data.orgMatrix)) {
          setOrgGrpData(response.data.orgMatrix)
          setMasterState(prev => ({ ...prev, org: response.data.orgMatrix }))
        } else {
          setMasterState(prev => ({ ...prev, org: [] }))
        }
        if (response.data.users && Array.isArray(response.data.users)) {
          const result = response.data.users.map((item: any, i: number) => ({
            users:
              item.firstName && item.lastName
                ? item.loginId + item.firstName + ' ' + item.lastName
                : item.loginId
                  ? item.loginId
                  : '',
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
            edit: ''
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

  const menuItems = [
    {
      items: [
        {
          name: 'General',
          svg: (
            <GeneralSettingsIcon
              fill={`${selectedMenuItem === 'general' ? brandcolor : '#000000'}`}
            />
          ),
          code: 'general'
        },
        {
          name: 'Organizational Matrix',
          svg: (
            <Org
              fill={`${selectedMenuItem === 'org' ? brandcolor : '#000000'}`}
            />
          ),
          code: 'org'
        },
        {
          name: 'Access Template',
          svg: (
            <Security
              fill={`${selectedMenuItem === 'st' ? brandcolor : '#000000'}`}
            />
          ),
          code: 'st'
        },
        {
          name: 'User Management',
          svg: (
            <Management
              fill={`${selectedMenuItem === 'user' ? brandcolor : '#000000'}`}
            />
          ),
          code: 'user'
        }
      ]
    }
  ]

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

  const getRoleOptions = (organization: any) => {
    const initialRoleOptions: any[] = []
    if (organization?.length) {
      organization.forEach((grpOrg: any) => {
        grpOrg.org.forEach((org: any) => {
          org.roleGrp.forEach((roleGrp: any) => {
            initialRoleOptions.push({
              ...roleGrp,
              orgGrpCode: grpOrg.orgGrpCode,
              orgCode: org.orgCode
            })
          })
        })
      })
    }
    return initialRoleOptions
  }

  const getPsOptions = (roles: any) => {
    const initialProductServiceOptions: any[] = []
    if (roles?.length) {
      roles.forEach((grpRG: any) => {
        grpRG.roles.forEach((role: any) => {
          role.psGrp.forEach((psGrp: any) => {
            initialProductServiceOptions.push({
              ...psGrp,
              roleGrpCode: grpRG.roleGrpCode,
              roleCode: role.roleCode
            })
          })
        })
      })
    }
    return initialProductServiceOptions
  }

  const getSecurityTemplate = async () => {
    try {
      const res = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAPPSecurityTemplateData`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (res.status === 200) {
        const finalProducts: Set<string> = new Set([])
        if (typeof res.data == 'object' && Array.isArray(res.data)) {
          res.data.forEach((ele: any) => {
            if (
              typeof ele['products/Services'] == 'object' &&
              Array.isArray(ele['products/Services'])
            ) {
              ele['products/Services'].forEach(ele2 => {
                if (
                  typeof ele2['ps'] == 'object' &&
                  Array.isArray(ele2['ps'])
                ) {
                  ele2['ps'].forEach(ele3 => {
                    if (
                      typeof ele3['psCode'] &&
                      typeof ele3['psCode'] == 'string'
                    ) {
                      finalProducts.add(ele3['psCode'])
                    }
                  })
                }
              })
            }
          })
          setPSList(finalProducts)
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
            createdOn: item.createdOn
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
              roleOptions: getRoleOptions(item?.organization ?? []),
              psOptions: getPsOptions(item?.roles ?? [])
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/setJson`,
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
        await handleSecurityDataSave()
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
            setSearchTerm
          }}
        >
          <div
            style={{ backgroundColor: '#FFFFFF' }}
            className='flex h-[93vh] w-full flex-col overflow-y-hidden'
          >
            <div className='flex h-[6.66vh] w-[65%] items-center justify-between px-[0.58vw]'>
              <div
                style={{
                  color: '#000000',
                  fontSize: `0.93vw`
                }}
                className='flex items-center gap-[0.58vw] font-semibold leading-[2.22vh]'
              >
                User Management
              </div>
              <div className='flex gap-[0.35vw]'>
                <div
                  style={{
                    backgroundColor: '#F4F5FA',
                    color: '#000000',
                    visibility : selectedMenuItem  == "general" ? "hidden" : "unset"
                  }}
                  className={'relative h-[4.2vh] w-[25.75vw] items-center rounded-md'}
                >
                  <span className='absolute inset-y-0 left-0 flex h-[2.18vw] w-[2.18vw] p-[0.58vw] '>
                    <SearchIcon
                      fill={'#000000'}
                      height='0.83vw'
                      width='0.83vw'
                    />
                  </span>
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={'Search'}
                    onFocus={e => (e.target.style.borderColor = brandcolor)}
                    onBlur={e => (e.target.style.borderColor = '#00000026')}
                    style={{
                      backgroundColor: '#F4F5FA',
                      color: '#000000',
                      borderColor: '#00000026',
                      fontSize: `0.72vw`
                    }}
                    className={`h-[4.2vh] w-full rounded-md border p-[0.29vw] pl-[1.76vw] font-medium focus:outline-none`}
                  />
                </div>
                <div className='mb-[0.5vh] flex items-center gap-[0.75vw]'>
                  {['st', 'user', 'org' ].includes(selectedMenuItem) && (
                    <div className='mb-[0.5vh] flex items-center gap-[0.29vw]'>
                      <button
                        onClick={handlePlusButtonClick}
                        style={{
                          backgroundColor:
                            selectedMenuItem === 'org' && !focusedPath
                              ? '#dae1f6'
                              : brandcolor
                        }}
                        className={`rounded-md px-[0.5vw] py-[0.82vh] outline-none`}
                        disabled={
                          tenantAccess != 'edit' ||
                          (selectedMenuItem === 'org' && !focusedPath)
                        }
                      >
                        <PlusIcon fill={isLightColor(brandcolor)} />
                      </button>

                      <button
                        className={`${selectedMenuItem === 'org' ? 'hidden' : ''} outline-none ${((selectedMenuItem === 'st' || selectedMenuItem === 'user') && Array.from(selectedRows).filter(Boolean).length > 0) || (Object.keys(selectedItems).length > 0 && Object.values(selectedItems).includes(true)) ? 'bg-[#F14336]' : 'bg-[#F14336]/50'} rounded-md px-[0.5vw] py-[0.82vh]`}
                        disabled={
                          selectedMenuItem === 'st' ||
                          selectedMenuItem === 'user'
                            ? Array.from(selectedRows).filter(Boolean).length >
                              0
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
                        <DeleteIcon
                          fill='white'
                          height='1.25vw'
                          width='1.25vw'
                        />
                      </button>
                      <Modal open={deleteModalOpen} disableOutsideClick>
                        <div className='flex w-[28vw] flex-col items-center gap-[1.5vh] py-[1.5vh]'>
                          <div className='flex w-full items-center justify-between px-[1vw]'>
                            <h1 className='flex items-center gap-[0.2vw] text-[1vw] font-semibold text-[#EB5757]'>
                              <DeleteIcon
                                fill='#EB5757'
                                height='1.2vw'
                                width='1.2vw'
                              />
                              {selectedMenuItem === 'st'
                                ? 'Delete AccessTemplate'
                                : selectedMenuItem === 'user' && 'Delete User'}
                            </h1>
                            <button onClick={() => setDeleteModalOpen(false)}>
                              <Multiply />
                            </button>
                          </div>
                          <hr className='w-full' />
                          <div className='flex w-full flex-col gap-[1.5vh] px-[1vw]'>
                            <h1 className='text-[1vw] font-medium'>
                              {selectedMenuItem === 'st'
                                ? 'Are you sure you want to delete this template?'
                                : selectedMenuItem === 'user' &&
                                  'Are you sure you want to delete this user?'}
                            </h1>
                            <p className='text-[0.83vw] font-medium text-black/35'>
                              {selectedMenuItem === 'st'
                                ? 'Deleting the template will remove all associated'
                                : selectedMenuItem === 'user' &&
                                  'Deleting the user will remove all associated'}
                            </p>
                          </div>
                          <hr className='w-full' />
                          <div className='flex w-full items-center justify-end gap-[0.5vw] pr-[1vw]'>
                            <button
                              onClick={() => setDeleteModalOpen(false)}
                              className='flex items-center gap-[0.5vw] rounded-md bg-[#F4F5FA] px-[0.5vw] py-[0.82vh] outline-none'
                            >
                              <h1 className='text-[1vw] font-medium'>Cancel</h1>
                            </button>
                            <button
                              onClick={handleDeleteButtonClick}
                              className='flex items-center gap-[0.5vw] rounded-md px-[0.5vw] py-[0.82vh] text-white outline-none'
                              style={{ backgroundColor: '#EB5757' }}
                            >
                              <h1 className='text-[1vw] font-medium'>Delete</h1>
                            </button>
                          </div>
                        </div>
                      </Modal>

                      <button
                        onClick={handleSaveButtonClick}
                        className={`rounded-md bg-[#1C274C] px-[0.5vw] py-[0.82vh] outline-none`}
                        disabled={tenantAccess != 'edit'}
                      >
                        <SaveIcon />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr style={{ borderColor: '#E5E9EB' }} className=' w-full'></hr>
            <div
              style={{ backgroundColor: '#FFFFFF' }}
              className='flex h-[92.8vh]'
            >
              <div
                style={{ borderRight: `1px solid ${'#E5E9EB'}` }}
                className='flex h-[92.8vh] w-[10.57vw] flex-col gap-[3vh] p-[0.83vw]'
              >
                {menuItems.map((section, index) => (
                  <ul className='flex flex-col gap-[2vh]' key={index}>
                    {section.items.map(item => (
                      <li
                        key={item.code}
                        style={{
                          color:
                            selectedMenuItem === item.code
                              ? brandcolor
                              : '#000000'
                        }}
                        className={`cursor-pointer`}
                        onClick={() =>
                          handleMenuClick(item.code as SettingTabs)
                        }
                      >
                        <div
                          style={{ fontSize: `0.72vw` }}
                          className='flex items-center  leading-[1.04vw]'
                        >
                          <div className='mr-[0.58vw]'>{item.svg}</div>
                          <span className='text-nowrap'>{item.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div
                className='relative flex h-full w-full overflow-hidden px-[1.20vw] py-[1.25vh]'
                style={{ overflow: selectedMenuItem == 'org' ? 'auto' : '' }}
              >
                {selectedMenuItem == 'general' ? (
                  <GeneralSettings />
                ) : selectedMenuItem === 'user' ? (
                  <UserTable
                    data={userProfileData}
                    setData={setUserProfileData}
                  />
                ) : selectedMenuItem === 'org' ? (
                  <div className='w-full'>
                    <OrgMatrix tenantAccess={tenantAccess} />
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
