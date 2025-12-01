import React, { useState } from 'react'
import { Multiply } from '../svgApplication'
import { useInfoMsg } from '../infoMsgHandler'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Label } from '@/components/Label'

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
        <Button className={'flex items-center outline-none'} onClick={close}>
          <Multiply height='.7vw' width='.7vw' />
        </Button>
      </div>
      <Text
        variant='caption-1'
        color='secondary'
        className='text-torus-text-opacity-50'
      >
        {modalSubText}
      </Text>

      <div
        style={{ fontSize: `0.8vw` }}
        className='flex flex-col gap-[1vh] py-[1vh]'
      >
        <Label theme='clear' size='s' className='font-semibold'>
          Name
        </Label>
        {/* <TextInput
          size='s'
          type='text'
          placeholder={`Enter ${resourceField} name`}
          key='name'
          nodeId='name'
          onChange={handleInputChange}
          value={inputValue.name}
        /> */}
        <input
          id='name'
          name='name'
          type='text'
          placeholder={`Enter ${resourceField} name`}
          className={`rounded-lg border border-[var(--g-color-line-generic)] bg-[var(--g-color-base-background)] px-[.5vw] py-[.4vh] text-[var(--g-color-text-primary)] outline-none`}
          onChange={handleInputChange}
          value={inputValue.name}
        />
        <Label theme='clear' size='s' className='font-semibold'>
          Code
        </Label>
        {/* <TextInput
          nodeId='code'
          size='s'
          type='text'
          placeholder={`Enter ${resourceField} code`}
          key='=code'
          onChange={handleInputChange}
          readOnly={resource?.code ? true : false}
          value={inputValue.code?.replace(`${parentCode}`, '')}
        /> */}
        <input
          id='code'
          name='code'
          type='text'
          placeholder={`Enter ${resourceField} code`}
          className={`rounded-lg border border-[var(--g-color-line-generic)] bg-[var(--g-color-base-background)] px-[.5vw] py-[.4vh] text-[var(--g-color-text-primary)] outline-none`}
          onChange={handleInputChange}
          readOnly={resource?.code ? true : false}
          value={inputValue.code?.replace(`${parentCode}`, '')}
        />
      </div>
      <div className='flex w-full justify-end gap-[.5vw] py-[1vh]'>
        <Button
          onClick={close}
          view='raised'
          size='m'
          className={'rounded-lg border px-[.5vw] py-[.5vh] outline-none'}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          size='m'
          className={'rounded-lg px-[.5vw] py-[.5vh] outline-none'}
        >
          {resource?.code ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

export default AddGroupLevelModal
