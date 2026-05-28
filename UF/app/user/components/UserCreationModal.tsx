import React, { useContext, useMemo, useRef, useState } from 'react'
import { CameraIcon, Multiply } from '../../components/svgApplication'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { getCookie } from '@/app/components/cookieMgment'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useTheme } from '@/hooks/useTheme'
import { Select } from '@/components/Select'
import { TextInput } from '@/components/TextInput'
import { DatePicker } from '@/components/DatePicker'
import { Switch } from '@/components/Switch'
import i18n from '../../components/i18n'
import { getCdnImage } from '../../utils/getAssets'
import { useGlobal } from '@/context/GlobalContext'
import { getFontSizeForHeader, getFontSizeForSubHeader } from '@/app/utils/branding'

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
  const { branding } = useGlobal()
  const { borderColor, isDark } = useTheme()
  const keyset = i18n.keyset('language')
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
          type: 'date',
          name: 'accessExpires',
          label: 'Select date'
        }
      ]
    },
    {
      heading: 'Grant Admin Access',
      subHeading: 'Toggle to grant or revoke admin access to this user',
      formData: [
        {
          type: 'switch',
          name: 'isAppAdmin',
          label: 'isAppAdmin'
        }
      ]
    },
    ...(!isEdit
      ? [
          {
            heading: 'UserCode',
            subHeading: 'Enter the usercode of the user.',
            formData: [
              {
                type: 'code',
                name: 'userCode',
                label: 'userCode'
              }
            ]
          }
        ]
      : [])
  ]

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const ag = process.env.NEXT_PUBLIC_APPGROUPCODE
  const app = process.env.NEXT_PUBLIC_APPCODE
  const toast = useInfoMsg()
  const { userDetails } = useContext(TotalContext) as TotalContextProps
  const emailDomain = useMemo(() => {
    let domain = '@gmail.com'
    if (userDetails?.email) {
      domain = '@' + userDetails.email.split('@')[1]
    }
    return domain
  }, [])

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
    let userProfileImg = newUser?.profile
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
        userProfileImg = responseData
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
          let editeduser: any = newUser
          delete editeduser?.password
          delete editeduser?.edit
          editeduser.profile = userProfileImg
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
        } else {
          let addedUser: any = newUser
          addedUser.password = 'Welcome@100'
          delete addedUser?.edit
          addedUser.profile = userProfileImg
          const res = await AxiosService.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/postTenantUser`,
            {
              data: {
                ...addedUser,
                email : addedUser.email + emailDomain,
                dateAdded: new Date().toISOString()
              }
            },
            {
              headers: {
                Authorization: `Bearer ${getCookie('token')}`
              }
            }
          )
           if (res.status === 201) {
            setData(res.data)
            toast('User Added Successfully', 'success')
            setModalOpen(false)
          }
        }
        return
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

  const accessprofileOptions = useMemo(() => {
    if (
      accessProfiles &&
      typeof accessProfiles === 'object' &&
      Object.keys(accessProfiles).length > 0
    ) {
      return Object.keys(accessProfiles).map((profile: string) => ({
        value: profile,
        label: profile
      }))
    } else {
      return []
    }
  }, [accessProfiles])

  return (
    <div className={`g-root flex flex-col items-center justify-center`}>
      <div className='flex w-full items-center justify-between py-2 pl-2'>
        <Text contentAlign='left' variant={getFontSizeForHeader(branding.fontSize)}>
          {isEdit ? 'Edit User Info' : 'Add User'}
        </Text>
        <Button onClick={handleCloseModal} className='!w-fit rounded-md p-2'>
          <Multiply fill={isDark ? 'white' : 'black'} />
        </Button>
      </div>

      <hr style={{ borderColor: borderColor }} className='w-full' />

      <div className='flex w-full flex-col gap-5 px-4 py-4'>
        {userAdditionDetails &&
          userAdditionDetails
            .toSpliced(8)
            .map(({ heading, subHeading, formData }, index) => (
              <div key={index} className='flex w-full '>
                <div className='flex w-1/2 flex-col gap-0.5'>
                  <div>
                    <Text contentAlign='left' variant={getFontSizeForSubHeader(branding.fontSize)}>
                      {keyset(heading)}
                    </Text>
                  </div>
                  <div>
                    <Text
                      contentAlign='left'
                      color='secondary'
                    >
                      {keyset(subHeading)}
                    </Text>
                  </div>
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
                                    : getCdnImage(newUser?.profile)
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
                        <TextInput
                          type='text'
                          placeholder={keyset(label)}
                          readOnly={readOnly}
                          className='h-12 w-full rounded p-2 text-base'
                          onChange={(val) =>handleInputChange(val)}
                          name={name}
                          value={
                            readOnly && name == 'domain'
                              ? emailDomain
                              : isEdit && readOnly && name == 'email'
                              ? newUser.email.split('@')[0]
                              : newUser[name]
                          }
                          view='normal'
                          pin='clear-clear'
                        />
                      )}
                      {type == 'date' && (
                        <DatePicker
                          onChange={e =>
                            setNewUser((prev: any) => ({
                              ...prev,
                              accessExpires: e
                            }))
                          }
                          value={newUser.accessExpires ?? ''}
                          validationState={
                            new Date().toISOString().split('T')[0] as any
                          }
                          className='px-2'
                          style={{
                            height: '40px'
                          }}
                        />
                      )}
                      {type == 'dropdown' && (
                        <>
                          <Select
                            value={newUser?.accessProfile ?? []}
                            onChange={selectedKey => {
                              handleInputChange({
                                target: {
                                  name: 'accessProfile',
                                  value: selectedKey
                                }
                              })
                            }}
                            placeholder={keyset('Select Access Profile')}
                            multiple
                            size='s'
                            className='w-full'
                            options={accessprofileOptions}
                            customRenderSelectedLabels={
                              newUser?.accessProfile?.length > 1
                                ? 'Multiple Template'
                                : undefined
                            }
                          />
                        </>
                      )}
                      {type == 'switch' && (
                        <div
                          onClick={() =>
                            setNewUser((pre: any) => ({
                              ...pre,
                              isAppAdmin: !pre[name]
                            }))
                          }
                          style={{
                            backgroundColor:
                              newUser[name] == true
                                ? branding.selectionColor
                                : '#D1D5DB'
                          }}
                          className='h-10 w-20 cursor-pointer rounded-3xl'
                        >
                          <div
                            className={`mt-1 h-8 w-8 rounded-full bg-white ${
                              newUser[name] == true
                                ? 'translate-x-12'
                                : 'translate-x-0'
                            }`}
                          ></div>
                        </div>
                      )}
                      {type == 'code' && (
                        <TextInput
                          type='text'
                          placeholder={keyset(label)}
                          className='h-12 w-full rounded p-2 text-base'
                          onChange={val => handleInputChange(val)}
                          name={name}
                          value={newUser[name]}
                          view='normal'
                          pin='clear-clear'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </div>

      <hr style={{ borderColor: borderColor }} className='w-full' />

      <div className='flex w-full justify-end gap-2 px-2 pt-2'>
        <Button
          onClick={handleCloseModal}
          view='raised'
          className='!w-fit rounded-md p-2'
        >
          {keyset('Cancel')}
        </Button>
        <Button
          onClick={() => handleAddUser('profile')}
          view='normal-contrast'
          className='!w-fit rounded-md p-2'
        >
          {keyset('Save')}
        </Button>
      </div>
    </div>
  )
}

export default UserCreationModal
