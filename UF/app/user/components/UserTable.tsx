import React, { useEffect, useMemo, useState } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import UserCreationModal from './UserCreationModal'
import { SetupScreenContext, SetupScreenContextType } from '.'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Pagination } from '@/components/Pagination'
import { Icon } from '@/components/Icon'
import { Table } from '@/components/Table'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import i18n from '../../components/i18n'
import { getCdnImage } from '../../utils/getAssets'
import { getFontSizeForHeader, getFontSizeForSubHeader } from '@/app/utils/branding'
import { useGlobal } from '@/context/GlobalContext'

export interface UserData {
  users: string
  email: string
  firstName: string
  lastName: string
  loginId: string
  accessProfile: string[]
  accessExpires: string
  dateAdded: string
  profile: string
  noOfProductsService: number
  lastActive: string
  edit: string
  mobile?: string
  isAppAdmin?: boolean
}

const CustomTable = Table

const UserTable: React.FC<{
  data: UserData[]
  setData: React.Dispatch<React.SetStateAction<UserData[]>>
}> = ({ data, setData }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const toast = useInfoMsg()
  const [accessProfiles, setAccessProfiles] = useState<any>({})
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [userData, setUserData] = useState({})
  const {branding} = useGlobal()
  const { selectedRows, setSelectedRows, searchTerm } = React.useContext(
    SetupScreenContext
  ) as SetupScreenContextType
  const userDataPerPage = 11
  const { bgColor, borderColor, textColor, isDark } = useTheme()
  const keyset = i18n.keyset('language')
  const [isEdit, setIsEdit] = useState(true)

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    const formattedDate = date.toLocaleDateString('en-US', options)
    const time = date.toLocaleTimeString('en-US', { hour12: false }) // 24-hour format HH:MM:SS
    if (isNaN(date.getTime())) {
      return 'NA'
    }
    return `${formattedDate} | ${time}`
  }

  // Fixed search functionality
  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data
    }

    const searchTermLower = searchTerm.toLowerCase().trim()
    
    return data.filter((user) => {
      // Search in basic string fields
      const basicFields = [
        user.firstName,
        user.lastName,
        user.email,
        user.loginId,
        user.mobile || '',
      ]
      
      // Check if any basic field contains the search term
      const matchesBasicFields = basicFields.some(field => 
        field && field.toLowerCase().includes(searchTermLower)
      )
      
      // Search in access profiles array
      const matchesAccessProfile = user.accessProfile && 
        user.accessProfile.some(profile => 
          profile && profile.toLowerCase().includes(searchTermLower)
        )
      
      // Search in formatted dates
      const formattedLastActive = user.lastActive && user.lastActive !== 'NA' 
        ? formatDate(user.lastActive).toLowerCase() 
        : ''
      const formattedDateAdded = user.dateAdded && user.dateAdded !== 'NA' 
        ? formatDate(user.dateAdded).toLowerCase() 
        : ''
      
      const matchesDates = formattedLastActive.includes(searchTermLower) || 
                          formattedDateAdded.includes(searchTermLower)
      
      // Search in access expires
      const matchesAccessExpires = user.accessExpires && 
        user.accessExpires.toLowerCase().includes(searchTermLower)
      
      // Search in number of products/services
      const matchesProductsService = user.noOfProductsService && 
        user.noOfProductsService.toString().includes(searchTermLower)
      
      return matchesBasicFields || 
             matchesAccessProfile || 
             matchesDates || 
             matchesAccessExpires || 
             matchesProductsService
    })
  }, [data, searchTerm])

  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * userDataPerPage
    const indexOfFirstGroup = indexOfLastGroup - userDataPerPage

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup)
  }, [filteredData, currentPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / userDataPerPage)
  }, [filteredData, userDataPerPage])

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handledatachange = (
    item: UserData,
    key: keyof UserData,
    value: any
  ) => {
    const updatedData = data.map(user => {
      if (user.email === item.email) {
        if (key == 'accessProfile') {
          let noOfProductsService: any = 0
          ;(value as string[]).forEach(selectedProfiles => {
            noOfProductsService += accessProfiles[selectedProfiles]
          })
          return { ...user, [key]: value, noOfProductsService }
        }
        return { ...user, [key]: value }
      }
      return user
    })
    setData(updatedData)
  }

  const getAccessProfiles = async () => {
    try {
      const res = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAppAccessProfiles`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (res.status === 200) {
        setAccessProfiles(res.data)
      }
    } catch (error) {
      toast('Error Fetching Access Profiles', 'danger')
    }
  }

  useEffect(() => {
    getAccessProfiles()
  }, [])

  const handleRowSelection = (indices: string[]) => {
    let updatedIndices = indices
    if (currentPage !== 1) {
      updatedIndices = indices.map(index =>
        String(Number(index) + userDataPerPage * (currentPage - 1))
      )
    }
    if (updatedIndices.length > 0) {
      const selectedEmails = new Set<string>()
      filteredData.forEach((item, index) => {
        if (updatedIndices.includes(index.toString())) {
          selectedEmails.add(item.email)
        }
      })
      setSelectedRows(selectedEmails)
    } else {
      setSelectedRows(new Set([]))
    }
  }

  const getSelectedIds = useMemo(() => {
    const selectedIndicess = new Set<string>()
    filteredData.forEach((item, index) => {
      if (selectedRows.has(item.email)) {
        if (currentPage == 1) {
          selectedIndicess.add(index.toString())
        } else {
          let indexToAdd = Number(index) - userDataPerPage * (currentPage - 1)
          selectedIndicess.add(indexToAdd.toString())
        }
      }
    })
    return Array.from(selectedIndicess)
  }, [selectedRows, currentPage, filteredData])

  const columns = [
    {
      id: 'users',
      name: keyset('User')
    },
    {
      id: 'accessProfile',
      name: keyset('Access Profile')
    },
    {
      id: 'noOfProductsService',
      name: keyset('No. of Products/service')
    },
    {
      id: 'accessExpires',
      name: keyset('Access Expires')
    },
    {
      id: 'lastActive',
      name: keyset('Last Active')
    },
    {
      id: 'dateAdded',
      name: keyset('Date Added')
    },
    {
      id: 'edit',
      name: keyset('action')
    }
  ]

  const rowOfCurrentGrps = useMemo(() => {
    if (currentGroups && currentGroups.length > 0) {
      return currentGroups.map((item: any, index: number) => ({
        users: (
          <div key={index} className='flex gap-2'>
            {item.profile ? (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
                className='rounded-full border'
              >
                <img
                  src={getCdnImage(item.profile)}
                  alt='Profile'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    ;(e.target as HTMLImageElement).src = ''
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className='rounded-full border'
              >
                <Text variant={getFontSizeForSubHeader(branding.fontSize)} className='flex items-center'>
                  {item.firstName?.charAt(0)}
                  {item.lastName?.charAt(0)}
                </Text>
              </div>
            )}
            <div className='flex flex-col'>
              <Text variant={getFontSizeForSubHeader(branding.fontSize)} color='primary'>
                {item.firstName} {item.lastName}
              </Text>
              <Text color='secondary'>
                {item.email}
              </Text>
              {item.mobile && (
                <Text color='secondary'>
                  {item.mobile}
                </Text>
              )}
            </div>
          </div>
        ),
        accessProfile: (
          <Text key={index}>
            {item.accessProfile && item.accessProfile.length === 0
              ? 'No Template Available'
              : item.accessProfile.length > 1
              ? 'Multiple Template'
              : item.accessProfile.join(', ')}
          </Text>
        ),
        noOfProductsService: (
          <Text key={index}>{item['noOfProductsService']}</Text>
        ),
        accessExpires: (
          <div className='flex flex-col' key={index}>
            <div className={`flex rounded-md`}>
              <form onSubmit={e => e.preventDefault()}>
                <input
                  className={twMerge(
                    'cursor-pointer rounded border px-2 py-1 outline-none',
                    bgColor,
                    borderColor,
                    textColor
                  )}
                  type='date'
                  value={item.accessExpires ? new Date(item.accessExpires).toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]}
                  readOnly
                  onChange={e =>
                    handledatachange(item, 'accessExpires', e.target.value)
                  }
                />
              </form>
            </div>
          </div>
        ),
        lastActive: (
          <Text key={index}>
            {!item.lastActive || item.lastActive === 'NA'
              ? 'NA'
              : formatDate(item.lastActive)}
          </Text>
        ),
        dateAdded: (
          <Text key={index}>
            {!item.dateAdded || item.dateAdded === 'NA'
              ? 'NA'
              : formatDate(item.dateAdded)}
          </Text>
        ),
        edit: (
          <Button
            onClick={() => {
              setEditUserModalOpen(true)
              setUserData(item)
              setIsEdit(true)
            }}
            view='flat'
            className='!w-fit rounded-md p-2'
            key={index}
          >
            <Icon data='FaPencilAlt' size={18} />
          </Button>
        )
      }))
    }
    return []
  }, [currentGroups, bgColor, borderColor, textColor, accessProfiles])

  return (
    <div className={`g-root h-full w-full`}>
      <button
        hidden
        id='tanantUser-creation-btn'
        onClick={() => {
          setEditUserModalOpen(true)
          setUserData({})
          setIsEdit(false)
        }}
      ></button>
      <div>
        <Modal
          className='w-[800px] lg:min-w-[800px]'
          onClose={() => setEditUserModalOpen(false)}
          open={editUserModalOpen}
          closeOnOverlayClick
          showCloseButton={false}
        >
          <UserCreationModal
            setModalOpen={setEditUserModalOpen}
            newUser={userData}
            setNewUser={setUserData}
            accessProfiles={accessProfiles}
            data={data}
            setData={setData}
            isEdit={isEdit}
          />
        </Modal>
      </div>
      <div>
        <Text contentAlign='left' className='font-bold' variant={getFontSizeForHeader(branding.fontSize)} color='primary'>
          {keyset('User Management')}
        </Text>
      </div>
      <div className='mt-4 w-full min-w-0 overflow-auto'>
        <CustomTable
          data={rowOfCurrentGrps as any}
          columns={columns as any}
        />
      </div>
      <Pagination
        className='mt-1 justify-center'
        page={currentPage}
        pageSize={userDataPerPage}
        onUpdate={data => setCurrentPage(data.page)}
        total={filteredData.length}
        alignment='middle'
        showButtonText={true}
      />
    </div>
  )
}

export default UserTable
