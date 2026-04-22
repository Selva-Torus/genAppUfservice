import React, { useEffect, useRef, useState } from 'react'
import { CameraIcon, Multiply } from '../svgApplication'
import { useInfoMsg } from '../infoMsgHandler'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { AxiosService } from '../axiosService'
import { getCookie } from '../cookieMgment'
import { getCdnImage } from '@/app/utils/getAssets'

const AddGroupLevelModal = ({
  close,
  path,
  addFunction,
  parentCode = '',
  modalTitle,
  modalSubText,
  resourceField,
  resource //this props is only for the purpose of editing so if the resource available code should not be modified
}: {
  close: () => void
  path: string
  addFunction: (
    path: string,
    value: {
      name: string
      code: string
      logo?: string
    },
    parentCode: string
  ) => void
  parentCode: string
  modalTitle: string
  modalSubText: string
  resourceField: string
  resource?: {
    code: string
    name: string
  }
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [inputValue, setInputValue] = useState<{
    name: string
    code: string
    logo?: string
  }>(
    resource
      ? resource
      : resourceField === 'product'
      ? {
          name: '',
          code: '',
          logo: ''
        }
      : {
          name: '',
          code: ''
        }
  )
  const toast = useInfoMsg()
  const { borderColor, bgColor, isDark, textColor } = useTheme()

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleInputChange = (e: any) => {
    let { name, value } = e.target
    setInputValue(prev => {
      if (name == 'code') {
        value = value.replace(/[^a-zA-Z0-9_]/g, '')
      }
      return { ...prev, [name]: value }
    })
  }

  const handleAdd = async () => {
    if (!inputValue.code || !inputValue.name) {
      toast('Please fill all details to continue', 'warning')
      return
    }
    if (selectedFile) {
      const data = new FormData()
      data.append('file', selectedFile)
      data.append('bucketFolderame', 'torus')
      data.append(
        'folderPath',
        `9.1/${process.env.NEXT_PUBLIC_TENANT_CODE}/resources/images`
      )

      if (selectedFile) {
        const res = await AxiosService.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/uploadimg`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              filename: selectedFile.name
                ? selectedFile.name.replace(/\.[^/.]+$/, '')
                : 'productImage',
              Authorization: `Bearer ${getCookie('token')}`
            }
          }
        )

        if (res.status === 201) {
          inputValue.logo = res.data.imageUrl
          setSelectedFile(null)
        } else {
          toast('File is not valid', 'danger')
        }
      }
    }
    addFunction(path, inputValue, parentCode)
    close()
  }

  const handleFileSelect = (file: FileList) => {
    setSelectedFile(file[0])
  }

  const toPascalCase = (str: string) => {
    // 1. Split the string by common separators (spaces, hyphens, underscores, etc.)
    // and handle existing camelCase/PascalCase word boundaries.
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/[-_\s.]+/g, ' ') // Replace separators with a single space
      .trim() // Trim leading/trailing spaces
      .split(' ') // Split into an array of words
      .map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
      )
      .join(' ') // Join the words without spaces
  }
  return (
    <div
      className='flex h-fit flex-col '
      onKeyDown={e => {
        if (e.key === 'Enter') {
          handleAdd()
        }
      }}
    >
      <div className='flex w-full items-center justify-between py-[.5vh]'>
        <Text contentAlign='left'>
          {modalTitle}
        </Text>
        <Button className={'!w-fit rounded-md p-1'} onClick={close}>
          <Multiply height='.7vw' width='.7vw' />
        </Button>
      </div>
      <Text contentAlign='left' color='secondary'>
        {modalSubText}
      </Text>

      {resourceField === 'product' && (
        <div className='flex w-[400px] justify-between'>
          <div className='flex flex-col'>
            <Text
              contentAlign='left'
              className='!h-fit !justify-start py-2 font-semibold'
            >
              Product Logo
            </Text>
            <Text contentAlign='left' className='!justify-start text-xs'>
              Upload the logo of the product.
            </Text>
          </div>
          <div className=''>
            <input
              type='file'
              accept='image/png, image/jpeg, image/x-icon'
              ref={fileInputRef}
              onChange={e => e.target.files && handleFileSelect(e.target.files)}
              style={{ display: 'none' }}
            />
            <button
              id='previewImagebtnprofileforacc'
              onClick={() => fileInputRef.current?.click()}
              className='flex h-32 w-32 cursor-pointer items-center justify-center rounded-full outline-none'
            >
              {inputValue?.logo || selectedFile ? (
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : getCdnImage(inputValue?.logo!)
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
        </div>
      )}

      <div className='my-2 flex w-full justify-between'>
        <div className='flex flex-col gap-2'>
          <Text
            contentAlign='left'
            className='!h-fit !justify-start text-nowrap py-2 font-semibold'
          >{`${toPascalCase(resourceField)} Name*`}</Text>
          <Text
            contentAlign='left'
            className='!justify-start text-nowrap text-xs'
          >
            {`Enter the name of the ${resourceField}.`}
          </Text>
        </div>

        <input
          id='name'
          ref={nameInputRef}
          name='name'
          type='text'
          placeholder={`Enter ${resourceField} name`}
          className={twMerge(
            `rounded-lg border px-[.5vw] py-[.4vh] outline-none`,
            borderColor,
            bgColor,
            textColor
          )}
          onChange={handleInputChange}
          value={inputValue.name}
        />
      </div>
      <div className='flex w-full justify-between'>
        <div className='flex flex-col gap-2'>
          <Text
            contentAlign='left'
            className='!h-fit !justify-start text-nowrap py-2 font-semibold'
          >{`${toPascalCase(resourceField)} Code*`}</Text>
          <Text
            contentAlign='left'
            className='!justify-start text-nowrap text-xs'
          >
            {`Enter the code of the ${resourceField}.`}
          </Text>
        </div>

        <input
          id='code'
          name='code'
          type='text'
          placeholder={`Enter ${resourceField} code`}
          className={twMerge(
            `rounded-lg border px-[.5vw] py-[.4vh] outline-none`,
            borderColor,
            bgColor,
            textColor
          )}
          onChange={handleInputChange}
          readOnly={resource?.code ? true : false}
          value={inputValue.code?.replace(`${parentCode}`, '')}
        />
      </div>
      <div className='flex w-full justify-end gap-[.5vw] py-[1vh]'>
        <Button
          onClick={close}
          view='raised'
          className={'!w-fit rounded-md p-2'}
        >
          Cancel
        </Button>
        <Button onClick={handleAdd} className={'!w-fit rounded-md p-2'}>
          {resource?.code ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

export default AddGroupLevelModal
