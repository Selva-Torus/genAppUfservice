import { Select } from '@gravity-ui/uikit'
import React, { useContext, useMemo, useRef, useState } from 'react'
import { CameraIcon, Multiply } from './svgApplication'
import { isLightColor } from '@/app/components/utils'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { TotalContext, TotalContextProps } from '@/app/globalContext'

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
    }
  ]

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const ag = process.env.NEXT_PUBLIC_APPGROUPCODE
  const app = process.env.NEXT_PUBLIC_APPCODE
  const toast = useInfoMsg()
  const { property, setProperty , userDetails } = useContext(TotalContext) as TotalContextProps
  const emailDomain = useMemo(() => {
    let domain = '@gmail.com'
    if (userDetails?.email) {
    domain = "@" + userDetails.email.split('@')[1]
    }
    return domain
  } , [])
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
      (newUser.firstName && newUser.lastName == '') || !newUser?.firstName ||
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
    } else if (!isEdit && !newUser?.email ) {
      toast('Please provide valid email', 'danger')
      return
    } else if (
      !isEdit &&
      (!newUser?.email || newUser?.email === '' || newUser.email.includes('@') )
    ) {
      toast('Please provide valid email in the selected domain', 'danger')
      return
    } else if (
      !isEdit &&
      data.some((val: any) => val.email.split('@')[0] === newUser?.email)
    ) {
      toast('Email already exists', 'danger')
      return
    } else if ( !newUser?.accessExpires || newUser?.accessExpires === '') {
      toast('Please provide valid validity period', 'danger')
      return
    } else {
      try {
        if (isEdit) {
          const userResult = data.map((item: any) =>
            item.loginId === newUser.loginId ? { ...item, ...user } : item
          )
          setData([])
          const res = await AxiosService.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/postAppUserList`,
            {
              data: userResult
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
    <div className='flex w-[44.73vw] flex-col items-center justify-center'>
      <div className='items-center flex w-full justify-between px-[0.87vw] py-[1.87vh]'>
        <h1
          style={{
            color: '#000000',
            fontSize: `1.04vw`
          }}
          className='font-medium leading-[2.22vh]'
        >
          {isEdit ? 'Edit User Info' : 'Add User'}
        </h1>
        <button
          onClick={handleCloseModal}
          className='cursor-pointer outline-none'
        >
          <Multiply width='0.83vw' height='0.83vw' fill={'#000000'} />
        </button>
      </div>

      <hr style={{ borderColor: '#00000026' }} className='w-full' />

      <div className='flex flex-col gap-[2.18vh] py-[1.87vh] pl-[1.46vw]'>
        {userAdditionDetails && userAdditionDetails.toSpliced(6).map(({ heading, subHeading, formData }, index) => (
              <div key={index} className='flex gap-[0.58vw]'>
                <div className='flex w-[21vw] flex-col gap-[0.62vh]'>
                  <h1
                    style={{
                      fontSize: `0.72vw`,
                      color: '#000000'
                    }}
                    className='font-semibold leading-[1.85vh]'
                  >
                    {heading}
                  </h1>
                  <p
                    style={{
                      fontSize: `0.72vw`,
                      color: '#00000080'
                    }}
                    className='leading-[1.85vh]'
                  >
                    {subHeading}
                  </p>
                </div>
                {formData.map(({ type, name, label, readOnly }) => (
                  <div key={name}>
                    {type == 'file' && (
                      <div>
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
                          className='flex h-[8.1vw] w-[8.1vw] cursor-pointer items-center justify-center rounded-full outline-none'
                        >
                          {newUser?.profile || selectedFile ? (
                            <img
                              src={
                                selectedFile
                                  ? URL.createObjectURL(selectedFile)
                                  : newUser.profile
                              }
                              alt='preview'
                              className='h-[8.1vw] w-[8.1vw] rounded-full object-cover'
                              width={100}
                              height={100}
                            />
                          ) : (
                            <span
                              className='flex h-[8.1vw] w-[8.1vw] items-center justify-center rounded-full'
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
                          backgroundColor: '#FFFFFF',
                          color: '#000000',
                          borderColor: '#00000026',
                          fontSize: `0.83vw`
                        }}
                        className={`border outline-none ${name == 'accessExpires' || name == 'loginId' ? 'w-[20.88vw]' : 'w-[10.18vw]'} rounded-lg px-[0.58vw] py-[1.24vh] leading-[2.22vh]`}
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
                    {type == 'dropdown' && (
                      <Select
                        value={newUser?.accessProfile || []}
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
                        {accessProfiles &&
                          Object.keys(accessProfiles).length > 0 &&
                          Object.keys(accessProfiles).map((item: any) => {
                            return (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            )
                          })}
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            ))}
      </div>

      <hr style={{ borderColor: '#00000026' }} className='w-full' />

      <div className='flex w-full justify-end gap-[0.58vw] px-[0.58vw] py-[1.24vh]'>
        <button
          onClick={handleCloseModal}
          style={{
            fontSize: `0.83vw`,
            backgroundColor: '#F4F5FA',
            color: '#000000'
          }}
          className={`rounded-md px-[1.17vw] py-[1.24vh] leading-[2.22vh] outline-none`}
        >
          Cancel
        </button>
        <button
          onClick={() => handleAddUser('profile')}
          style={{
            fontSize: `0.83vw`,
            backgroundColor: brandcolor,
            color: isLightColor(brandcolor)
          }}
          className={`rounded-md px-[1.46vw] py-[1.24vh] leading-[2.22vh] outline-none`}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default UserCreationModal