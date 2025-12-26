import React, { useState } from 'react'
import { Multiply } from '../svgApplication'
import { useInfoMsg } from '../infoMsgHandler'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Label } from '@/components/Label'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'

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
  const [inputValue, setInputValue] = useState(
    resource
      ? resource
      : {
          name: '',
          code: ''
        }
  )
  const toast = useInfoMsg()
  const { borderColor , bgColor , isDark , textColor } = useTheme()

  const handleInputChange = (e: any) => {
    let { name, value } = e.target
    setInputValue(prev => {
      if (name == 'code') {
        value = value.replace(/[^a-zA-Z0-9_]/g, '')
      }
      return { ...prev, [name]: value }
    })
  }

  const handleAdd = () => {
    if (!inputValue.code || !inputValue.name) {
      toast('Please fill all details to continue', 'warning')
      return
    }
    addFunction(path, inputValue, parentCode)
    close()
  }

  return (
    <div className='flex h-fit flex-col '>
      <div className='flex w-full items-center justify-between py-[.5vh]'>
        <Text variant='body-3'>{modalTitle}</Text>
        <Button className={'!w-fit p-1 rounded-md'} onClick={close}>
          <Multiply height='.7vw' width='.7vw' />
        </Button>
      </div>
      <Text
        variant='caption-1'
        color='secondary'
      >
        {modalSubText}
      </Text>

      <div
        className='flex flex-col gap-[1vh] py-[1vh] text-base'
      >
        <Label theme='clear' className='font-semibold !justify-start'>
          Name
        </Label>
     
        <input
          id='name'
          name='name'
          type='text'
          placeholder={`Enter ${resourceField} name`}
          className={twMerge(`rounded-lg border px-[.5vw] py-[.4vh] outline-none` , borderColor , bgColor , textColor)}
          onChange={handleInputChange}
          value={inputValue.name}
        />
        <Label theme='clear'  className='font-semibold !justify-start'>
          Code
        </Label>
        
        <input
          id='code'
          name='code'
          type='text'
          placeholder={`Enter ${resourceField} code`}
          className={twMerge(`rounded-lg border px-[.5vw] py-[.4vh] outline-none` , borderColor , bgColor , textColor)}
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
        <Button
          onClick={handleAdd}
          className={'!w-fit rounded-md p-2'}
        >
          {resource?.code ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

export default AddGroupLevelModal
