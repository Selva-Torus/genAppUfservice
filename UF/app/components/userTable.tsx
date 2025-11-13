import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Icon,
  Pagination,
  Popover,
  Select,
  Table,
  Text,
  withTableSelection
} from '@gravity-ui/uikit'
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { Modal } from '@gravity-ui/uikit'
import UserCreationModal from './userCreationModal'
import { SetupScreenContext, SetupScreenContextType } from './setup'
import { useGravityThemeClass } from '../utils/useGravityUITheme'
import { Ellipsis, PersonPlus, Pencil } from '@gravity-ui/icons'

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
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [userData, setUserData] = useState({})
  const [newUser, setNewUser] = useState({})
  const { selectedRows, setSelectedRows, searchTerm } = React.useContext(SetupScreenContext) as SetupScreenContextType;
  const userDataPerPage = 11
  const themeClass = useGravityThemeClass();

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
      if (typeof value === "string") {
        return (value as string).toLowerCase().includes(searchTerm.toLowerCase());
      } else if (Array.isArray(value)) {
        return value.some((role) => {
          return Object.values(role).some((val) => {
            return (
              typeof val === "string" &&
              val.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        });
      } else {
        return Object.values(value as any).some((val) => {
          if (typeof val === "string") {
            return val.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (Array.isArray(val)) {
            return val.some((role) => {
              return Object.values(role).some((v) => {
                return (
                  typeof v === "string" &&
                  v.toLowerCase().includes(searchTerm.toLowerCase())
                );
              });
            });
          }
        });
      }
    })
    .map(([key, value], index) => ({ ...value as any, originalIndex: key }));

  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * userDataPerPage;
    const indexOfFirstGroup = indexOfLastGroup - userDataPerPage;

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup);
  }, [data, filteredData, setData, currentPage, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / userDataPerPage);
  }, [data, filteredData, currentPage, userDataPerPage]);

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
    let updatedIndices = indices;
    if (currentPage !== 1) {
      updatedIndices = indices.map((index) => (String(Number(index) + (userDataPerPage * (currentPage - 1)))));
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
          let indexToAdd = Number(index) - (userDataPerPage * (currentPage - 1))
          selectedIndicess.add(indexToAdd.toString())
        }
      }
    })
    return Array.from(selectedIndicess)
  }, [selectedRows, currentPage])

  const columns = [
    {
      id: 'profile',
      name: '',
      width: 60,
      align: 'center',
      template: (item: any) =>
        item.profile ? (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <img
              src={item.profile}
              alt='Profile'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                ; (e.target as HTMLImageElement).src = ''
                  ; (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              // backgroundColor: '#f0f1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text variant='subheader-1'>
              {item.firstName?.charAt(0)}
              {item.lastName?.charAt(0)}
            </Text>
          </div>
        )
    },
    {
      id: 'users',
      name: 'User',
      width: 200,
      template: (item: any) => (
        <div className='flex flex-col'>
          <Text variant='subheader-2'>
            {item.firstName} {item.lastName}
          </Text>
          <Text color='secondary'>{item.email}</Text>
          {item.mobile && <Text color='secondary'>{item.mobile}</Text>}
        </div>
      )
    },
    {
      id: 'accessProfile',
      name: 'Access Profile',
      width: 150,
      template: (item: any) =>
        item.accessProfile && item.accessProfile.length > 1 ? (
          <Select
            renderControl={props => (
              <div className='g-select-control g-select-control_size_m g-select-control_pin_round-round g-select-control_has-value' onClick={props.triggerProps.onClick}>
                {React.createElement(
                  'div',
                  {
                    className:
                      'g-select-control__button g-select-control__button_size_m g-select-control__button_view_normal g-select-control__button_pin_round-round',
                  },
                  'Multiple Templates'
                )}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  className='g-icon g-select-control__chevron-icon'
                  fill='currentColor'
                  stroke='none'
                  aria-hidden='true'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </svg>
              </div>
            )}
            value={item.accessProfile}
            onUpdate={data => handledatachange(item, 'accessProfile', data)}
            width={'max'}
            placeholder='Select Access Profile'
            multiple
          >
            {(accessProfiles &&
            typeof accessProfiles === 'object' &&
            !Array.isArray(accessProfiles)
              ? Object.keys(accessProfiles)
              : []
            ).map((profile: string, index: number) => (
              <Select.Option key={index} value={profile}>
                {profile}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <>
            <Select
              value={item.accessProfile}
              onUpdate={data => handledatachange(item, 'accessProfile', data)}
              width={'max'}
              placeholder='Select Access Profile'
              multiple
            >
              {(accessProfiles &&
              typeof accessProfiles === 'object' &&
              !Array.isArray(accessProfiles)
                ? Object.keys(accessProfiles)
                : []
              ).map((profile: string, index: number) => (
                <Select.Option key={index} value={profile}>
                  {profile}
                </Select.Option>
              ))}
            </Select>
          </>
        )
    },
    {
      id: 'noOfProductsService',
      name: 'No. of Products/service',
      width: 100,
      align: 'center'
    },
    {
      id: 'accessExpires',
      name: 'Access Expires',
      width: 150,
      template: (item: any) => (
        <div className='flex flex-col'>
          <div className={`flex rounded-md`}>
            <form onSubmit={e => e.preventDefault()}>
              <input
                className='cursor-pointer px-2 py-1 border rounded'
                style={{
                  backgroundColor: 'var(--g-color-base-background)',
                  color: 'var(--g-color-text-primary)',
                      borderColor: 'var(--g-color-line-generic)',
                }}
                type='date'
                defaultValue={item.accessExpires}
                min={new Date().toISOString().split('T')[0]}
                onChange={e =>
                  handledatachange(item, 'accessExpires', e.target.value)
                }
              />
            </form>
          </div>
        </div>
      )
    },
    {
      id: 'lastActive',
      name: 'Last Active',
      width: 150,
      template: (item: any) => (
        <Text variant='body-2'>
          {!item.lastActive || item.lastActive === 'NA'
            ? 'NA'
            : formatDate(item.lastActive)}
        </Text>
      )
    },
    {
      id: 'dateAdded',
      name: 'Date Added',
      width: 100,
      align: 'center',
      template: (item: any) => (
        <Text variant='body-2'>
          {!item.dateAdded || item.dateAdded === 'NA'
            ? 'NA'
            : formatDate(item.dateAdded)}
        </Text>
      )
    },
    {
      id: 'edit',
      name: 'action',
      width: 80,
      align: 'center',
      template: (item: any) => (
             <div className='flex flex-col items-center gap-2'>
              <Button
                onClick={() => {
                  setEditUserModalOpen(true)
                  setUserData(item)
                }}
                view='flat'
              >
                <Icon data={Pencil} size={18} />
              </Button>
              <Modal open={editUserModalOpen} disableOutsideClick>
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
      )
    }
  ]

  return (
    <div className={`w-full h-[80vh] g-root ${themeClass}`}>
      <div>
        <button
          id='tanantUser-creation-btn'
          className='hidden'
          onClick={() => setAddUserModalOpen(true)}
        >
          userCreationButton
        </button>
        <Modal open={addUserModalOpen} disableOutsideClick>
          <UserCreationModal
            setModalOpen={setAddUserModalOpen}
            newUser={newUser}
            setNewUser={setNewUser}
            accessProfiles={accessProfiles}
            data={data}
            setData={setData}
          />
        </Modal>
      </div>
      <Text 
        variant='header-1'
      >
        {"User Management"}
      </Text>
      <CustomTable
        className='h-[73vh] mt-2'
        data={currentGroups}
        columns={columns as any}
        emptyMessage='No data available'
      />
      <Pagination
        className='justify-center mt-1'
        page={currentPage}
        pageSize={userDataPerPage}
        onUpdate={setCurrentPage}
        total={data.length}
      />
    </div>
  )
}

export default UserTable