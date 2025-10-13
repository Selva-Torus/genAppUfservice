import { Button, Select, Text ,Switch} from '@gravity-ui/uikit'
import React, { useContext, useMemo, useRef, useState } from 'react'
import { CameraIcon, Multiply } from './svgApplication'
import { isLightColor } from '@/app/components/utils'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { useGravityThemeClass } from '../utils/useGravityUITheme'

const UserCreationModal = ({
  setModalOpen,
  newUser,
  setNewUser,
  accessProfiles,
  data,
  setData,
  isEdit = false
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  newUser: any
  setNewUser: React.Dispatch<React.SetStateAction<any>>
  accessProfiles: any
  data: any
  setData: any
  isEdit?: boolean
}) => {
  const userAdditionDetails: {
    heading: string
    subHeading: string
    formData: {
      type: string
      name: string
      label: string
      readOnly?: boolean
    }[]
  }[] = [
    {
      heading: 'Profile Photo',
      subHeading: 'Upload your profile image',
      formData: [
        {
          type: 'file',
          name: 'logo',
          label: 'logo'
        }
      ]
    },
    {
      heading: 'Full Name*',
      subHeading: 'Enter the full name of the user.',
      formData: [
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name'
        },
        {
          type: 'text',
          name: 'lastName',
          label: 'Last Name'
        }
      ]
    },
    {
      heading: 'Username*',
      subHeading: 'Enter the username of the user.',
      formData: [
        {
          type: 'text',
          name: 'loginId',
          label: 'Username',
          readOnly: isEdit
        }
      ]
    },
    {
      heading: 'Email Address*',
      subHeading: 'Enter the email address of the user.',
      formData: [
        {
          type: 'text',
          name: 'email',
          label: 'Email Address',
          readOnly: isEdit
        },
        {
          type: 'text',
          name: 'domain',
          label: '',
          readOnly: true
        }
      ]
    },
    {
      heading: 'Access Profile*',
      subHeading: 'Select the access profile of the user.',
      formData: [
        {
          type: 'dropdown',
          name: 'accessProfile',
          label: 'Select from the list'
        }
      ]
    },
    {
      heading: 'Validity Period*',
      subHeading: 'Select the validity period of the user.',
      formData: [
        {
          type: 'text',
          name: 'accessExpires',
          label: 'Select date'
        }
      ]
    },
    {
      heading: "Grant Admin Access",
      subHeading: "Toggle to grant or revoke admin access to this user",
      formData: [
        {
          type: "switch",
          name: "isAppAdmin",
          label: "isAppAdmin",
        },
      ],
    }
  ]

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const ag = process.env.NEXT_PUBLIC_APPGROUPCODE
  const app = process.env.NEXT_PUBLIC_APPCODE
  const toast = useInfoMsg()
  const themeClass = useGravityThemeClass()
  const { property, setProperty, userDetails } = useContext(
    TotalContext
  ) as TotalContextProps
  const emailDomain = useMemo(() => {
    let domain = '@gmail.com'
    if (userDetails?.email) {
      domain = '@' + userDetails.email.split('@')[1]
    }
    return domain
  }, [])
  let brandcolor: string = property?.brandColor ?? '#0736c4'

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'accessProfile') {
      var noOfProd = 0
      value.forEach((item: any) => {
        noOfProd += accessProfiles[item]
      })
      setNewUser((prev: any) => ({ ...prev, noOfProductsService: noOfProd }))
    }
    setNewUser((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleAddUser = async (filename: string) => {
    let user = { ...newUser }
    if (selectedFile) {
      const data = new FormData()
      data.append('file', selectedFile)
      data.append('bucketFolderame', 'torus')
      data.append(
        'folderPath',
        `9.1/${tenant}/resources/images/${newUser?.loginId}`
      )

      const res = await AxiosService.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/uploadimg`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            filename: selectedFile.name
              ? selectedFile.name.replace(/\.[^/.]+$/, '')
              : filename
          }
        }
      )
      if (res.status === 201) {
        const responseData = res.data.imageUrl
        user = { ...user, profile: responseData }
      }
    }

    if (
      newUser?.firstName === '' ||
      newUser?.lastName === '' ||
      (newUser.firstName && newUser.lastName == '') ||
      !newUser?.firstName ||
      !newUser?.lastName
    ) {
      toast('Please provide valid name', 'danger')
      return
    } else if (!isEdit && !newUser?.loginId) {
      toast('Please provide valid username', 'danger')
      return
    } else if (
      !isEdit &&
      data.some((val: any) => val.loginId === newUser?.loginId)
    ) {
      toast('userName already exists', 'danger')
      return
    } else if (!isEdit && !newUser?.email) {
      toast('Please provide valid email', 'danger')
      return
    } else if (
      !isEdit &&
      (!newUser?.email || newUser?.email === '' || newUser.email.includes('@'))
    ) {
      toast('Please provide valid email in the selected domain', 'danger')
      return
    } else if (
      !isEdit &&
      data.some((val: any) => val.email.split('@')[0] === newUser?.email)
    ) {
      toast('Email already exists', 'danger')
      return
    } else {
      try {
        if (isEdit) {
          let editeduser: any = newUser;
          delete editeduser?.password;
          delete editeduser?.edit;
          const userResult = data.map((item: any) =>
            item.loginId === newUser.loginId ? { ...item, ...user } : item
          )

          setData([])
          const res = await AxiosService.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/postAppUserList`,
            {
              data: editeduser
            },
            {
              headers: {
                Authorization: `Bearer ${getCookie('token')}`
              }
            }
          )
          if (res.status === 201) {
            setData(userResult)
            toast('User Updated Successfully', 'success')
            setModalOpen(false)
          }
          return
        }
        return 
        const userAdditionResponse = await AxiosService.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/appUserAddition`,
          {
            data: {
              ...user,
              email: `${newUser.email}${emailDomain}`,
              password: `${newUser.loginId}@123`,
              dateAdded: new Date(),
              status: newUser.status ? 'active' : 'inactive'
            },
            isTenantUser: true
          },
          {
            headers: {
              Authorization: `Bearer ${getCookie('token')}`
            }
          }
        )
        if (userAdditionResponse.status == 201) {
          const result = userAdditionResponse.data.map(
            (item: any, i: number) => ({
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
              accessExpires: item?.accessExpires,
              lastActive: item?.lastActive,
              dateAdded: item?.dateAdded,
              status: item?.status ?? '',
              noOfProductsService: item?.noOfProductsService,
              edit: ''
            })
          )
          setData(result)
          setModalOpen(false)
        }
        setNewUser({
          firstName: '',
          lastName: '',
          loginId: '',
          email: '',
          mobile: '',
          password: '',
          status: true,
          accessProfile: [],
          accessExpires: '',
          dateAdded: new Date(),
          profile: ''
        })
      } catch (error) {
        toast('Error Occured While Adding User', 'danger')
      }
    }
  }

  const handleFileSelect = (file: FileList, type: string) => {
    if (file.length > 0 && type == 'profile') {
      setSelectedFile(file[0])
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files, 'profile')
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    !isEdit &&
      setNewUser({
        firstName: '',
        lastName: '',
        loginId: '',
        email: '',
        mobile: '',
        password: '',
        status: true,
        accessProfile: [],
        accessExpires: '',
        dateAdded: new Date(),
        profile: ''
      })
  }

  return (
    <div
      className={`g-root flex min-w-[700px] flex-col items-center justify-center ${themeClass}`}
    >
      <div className='flex w-full items-center justify-between px-4 py-2'>
        <Text variant='header-1'>{isEdit ? 'Edit User Info' : 'Add User'}</Text>
        <button
          onClick={handleCloseModal}
          className='cursor-pointer outline-none'
        >
          <Multiply fill={'var(--g-color-text-secondary)'} />
        </button>
      </div>

      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />

      <div className='flex w-full flex-col gap-5 px-4 py-4'>
        {userAdditionDetails &&
          userAdditionDetails
            .toSpliced(7)
            .map(({ heading, subHeading, formData }, index) => (
              <div key={index} className='flex w-full '>
                <div className='flex w-1/2 flex-col gap-0.5'>
                  <Text variant='subheader-2'>{heading}</Text>
                  <Text variant='body-2' color='secondary'>
                    {subHeading}
                  </Text>
                </div>
                <div className='flex w-1/2 gap-2'>
                {formData.map(({ type, name, label, readOnly }) => (
                  <div key={name} className='flex w-full items-center gap-4'>
                    {type == 'file' && (
                      <div className='w-full'>
                        <input
                          type='file'
                          accept='image/png, image/jpeg, image/x-icon'
                          ref={fileInputRef}
                          onChange={onFileChange}
                          style={{ display: 'none' }}
                        />
                        <button
                          id='previewImagebtnprofileforacc'
                          onClick={() => fileInputRef.current?.click()}
                          className='flex h-32 w-32 cursor-pointer items-center justify-center rounded-full outline-none'
                        >
                          {newUser?.profile || selectedFile ? (
                            <img
                              src={
                                selectedFile
                                  ? URL.createObjectURL(selectedFile)
                                  : newUser.profile
                              }
                              alt='preview'
                              className='h-32 w-32 rounded-full object-cover'
                              width={100}
                              height={100}
                            />
                          ) : (
                            <span
                              className='flex h-32 w-32 items-center justify-center rounded-full'
                              style={{ backgroundColor: '#F4F5FA' }}
                            >
                              <CameraIcon fill={'#000000'} />
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                    {type == 'text' && (
                      <input
                        type={name == 'accessExpires' ? 'date' : 'text'}
                        placeholder={label}
                        autoComplete='off'
                        readOnly={readOnly}
                        name={name}
                        style={{
                          backgroundColor: 'var(--g-color-base-background)',
                          color: 'var(--g-color-text-primary)',
                          borderColor: 'var(--g-color-line-generic)'
                        }}
                        className={`border outline-none w-full rounded-lg px-2 py-2 `}
                        onChange={handleInputChange}
                        min={
                          name === 'accessExpires'
                            ? new Date().toISOString().split('T')[0]
                            : undefined
                        }
                        value={
                          readOnly && name == 'domain'
                            ? emailDomain
                            : readOnly && name == 'email'
                            ? newUser.email.split('@')[0]
                            : newUser[name]
                        }
                      />
                    )}
                    {type == 'dropdown' &&
                      (newUser?.accessProfile &&
                      newUser?.accessProfile.length > 1 ? (
                        <Select
                          renderControl={props => (
                            <div
                              className='g-select-control g-select-control_size_m g-select-control_pin_round-round g-select-control_has-value'
                              onClick={props.triggerProps.onClick}
                            >
                              {React.createElement(
                                'div',
                                {
                                  className:
                                    'g-select-control__button g-select-control__button_size_m g-select-control__button_view_normal g-select-control__button_pin_round-round'
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
                          value={newUser?.accessProfile}
                          onUpdate={selectedKey => {
                            handleInputChange({
                              target: {
                                name: 'accessProfile',
                                value: selectedKey
                              }
                            })
                          }}
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
                            value={newUser?.accessProfile ?? []}
                            onUpdate={selectedKey => {
                              handleInputChange({
                                target: {
                                  name: 'accessProfile',
                                  value: selectedKey
                                }
                              })
                            }}
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
                      ))}
                      {type == 'switch' && (
                        <Switch
                          size='l'
                          checked={newUser[name] == true ? true : false}
                          onChange={() => setNewUser((pre:any)=>({...pre,isAppAdmin:!pre[name]}))
                            
                          }
                        />
                      )}
                  </div>
                ))}
              </div>
              </div>
            ))}
      </div>

      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />

      <div className='flex w-full justify-end gap-2 px-2 py-4'>
        <Button onClick={handleCloseModal} view='outlined'>
          Cancel
        </Button>
        <Button
          onClick={() => handleAddUser('profile')}
          view='outlined-success'
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default UserCreationModal
