import React, { useEffect, useMemo, useState } from 'react'
import {
  Pagination,
  Select,
  Table,
  Text,
  User,
  withTableSelection
} from '@gravity-ui/uikit'
import { AxiosService } from '@/app/components/axiosService'
import { getCookie } from '@/app/components/cookieMgment'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { Modal } from '@gravity-ui/uikit'
import UserCreationModal from './userCreationModal'
import { EditIcon } from './svgApplication'
import { template } from 'lodash'
import { SetupScreenContext, SetupScreenContextType } from './setup'

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
}

const CustomTable = withTableSelection(Table)

const UserTable: React.FC<{
  data: UserData[]
  setData: React.Dispatch<React.SetStateAction<UserData[]>>
}> = ({ data, setData }) => {
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const ag = process.env.NEXT_PUBLIC_APPGROUPCODE
  const app = process.env.NEXT_PUBLIC_APPCODE
  const [currentPage, setCurrentPage] = useState(1)
  const toast = useInfoMsg()
  const [accessProfiles, setAccessProfiles] = useState([])
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [userData, setUserData] = useState({})
  const [newUser, setNewUser] = useState({})
  const { selectedRows, setSelectedRows, searchTerm } = React.useContext(SetupScreenContext) as SetupScreenContextType;
  const userDataPerPage = 11

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
        if (key == "accessProfile"){
          return { ...user, [key]: value , noOfProductsService : accessProfiles[value]  }
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
              backgroundColor: '#f0f1f2',
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
      template: (item: any) => (
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
          <div className={`flex rounded-md text-[0.72vw] leading-[1.04vw]`}>
            <form onSubmit={e => e.preventDefault()}>
              <input
                className='cursor-pointer px-[0.5vw] py-[0.5vh]'
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
        <div className='text-[0.72vw]'>
          {!item.lastActive || item.lastActive === 'NA'
            ? 'NA'
            : formatDate(item.lastActive)}
        </div>
      )
    },
    {
      id: 'dateAdded',
      name: 'Date Added',
      width: 100,
      align: 'center',
      template: (item: any) => (
        <div className='text-[0.72vw]'>
          {!item.dateAdded || item.dateAdded === 'NA'
            ? 'NA'
            : formatDate(item.dateAdded)}
        </div>
      )
    },

    {
      id: 'edit',
      name: '',
      width: 80,
      align: 'center',
      template: (item: any) => (
        <div>
          <button
            onClick={() => {
              setEditUserModalOpen(true)
              setUserData(item)
            }}
          >
            <EditIcon />
          </button>
          <Modal open={editUserModalOpen} disableOutsideClick>
            <UserCreationModal
              setModalOpen={setEditUserModalOpen}
              newUser={userData}
              setNewUser={setUserData}
              accessProfiles={Object.keys(accessProfiles)}
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
    <div className='w-full h-[80vh]'>
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
            accessProfiles={Object.keys(accessProfiles)}
            data={data}
            setData={setData}
          />
        </Modal>
      </div>
      <h1
        style={{
          color: "#000000",
          fontSize: `1.25vw`,
        }}
        className=" leading-[1.04vw] font-semibold"
      >
        {"User Management"}
      </h1>
      <CustomTable
        className='h-[74vh] mt-[2vh]'
        data={currentGroups}
        columns={columns as any}
        emptyMessage='No data available'
        selectedIds={getSelectedIds}
        onSelectionChange={indices => handleRowSelection(indices)}
      />
      <Pagination
        className='justify-center mt-[1vh]'
        page={currentPage}
        pageSize={userDataPerPage}
        onUpdate={setCurrentPage}
        total={data.length}
      />
    </div>
  )
}

export default UserTable