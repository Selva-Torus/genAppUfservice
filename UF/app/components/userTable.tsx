import React, { useEffect, useMemo, useState } from 'react'
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import UserCreationModal from './userCreationModal'
import { SetupScreenContext, SetupScreenContextType } from './setup'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Pagination } from '@/components/Pagination'
import { Icon } from '@/components/Icon'
import { Table } from '@/components/Table'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import i18n from './i18n'
import { getCdnImage } from '../utils/getAssets'

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
  const { selectedRows, setSelectedRows, searchTerm } = React.useContext(
    SetupScreenContext
  ) as SetupScreenContextType
  const userDataPerPage = 11
  const { bgColor, borderColor, textColor, isDark } = useTheme()
  const keyset = i18n.keyset('language')

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

  const filteredData = Object.entries(data)
    .filter(([key, value]) => {
      if (typeof value === 'string') {
        return (value as string)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      } else if (Array.isArray(value)) {
        return value.some(role => {
          return Object.values(role).some(val => {
            return (
              typeof val === 'string' &&
              val.toLowerCase().includes(searchTerm.toLowerCase())
            )
          })
        })
      } else {
        return Object.values(value as any).some(val => {
          if (typeof val === 'string') {
            return val.toLowerCase().includes(searchTerm.toLowerCase())
          } else if (Array.isArray(val)) {
            return val.some(role => {
              return Object.values(role).some(v => {
                return (
                  typeof v === 'string' &&
                  v.toLowerCase().includes(searchTerm.toLowerCase())
                )
              })
            })
          }
        })
      }
    })
    .map(([key, value], index) => ({ ...(value as any), originalIndex: key }))

  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * userDataPerPage
    const indexOfFirstGroup = indexOfLastGroup - userDataPerPage

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup)
  }, [data, filteredData, setData, currentPage, searchTerm])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / userDataPerPage)
  }, [data, filteredData, currentPage, userDataPerPage])

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
      data.forEach((item, index) => {
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
    data.forEach((item, index) => {
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
  }, [selectedRows, currentPage])

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
    if (currentGroups) {
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
                <Text variant='subheader-1' className='flex items-center'>
                  {item.firstName?.charAt(0)}
                  {item.lastName?.charAt(0)}
                </Text>
              </div>
            )}
            <div className='flex flex-col'>
              <Text variant='subheader-2'>
                {item.firstName} {item.lastName}
              </Text>
              <Text variant='caption-1' color='secondary'>
                {item.email}
              </Text>
              {item.mobile && (
                <Text variant='caption-2' color='secondary'>
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
              : item.accessProfile}
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
                  defaultValue={item.accessExpires}
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
          <Text variant='body-2' key={index}>
            {!item.lastActive || item.lastActive === 'NA'
              ? 'NA'
              : formatDate(item.lastActive)}
          </Text>
        ),
        dateAdded: (
          <Text variant='body-2' key={index}>
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
  }, [])

  return (
    <div className={`g-root h-full w-full`}>
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
            isEdit={true}
          />
        </Modal>
      </div>
      <div>
        <Text contentAlign='left' variant='header-1'>{keyset('User Management')}</Text>
      </div>
      <div className='h-[73vh] mt-4'>
        <CustomTable
          data={rowOfCurrentGrps}
          columns={columns as any}
          // emptyMessage='No data available'
        />
      </div>
      <Pagination
        className='mt-1 justify-center'
        page={currentPage}
        pageSize={userDataPerPage}
        onUpdate={data => setCurrentPage(data.page)}
        total={data.length}
      />
    </div>
  )
}

export default UserTable
