import React, { ChangeEvent, useContext, useState } from 'react'
import { Multiply } from '../svgApplication'
import { isLightColor } from '../utils'
import { useInfoMsg } from '../infoMsgHandler'
import { Button, Label } from '@gravity-ui/uikit'
import { TotalContext, TotalContextProps } from '@/app/globalContext'

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
  const { property } = useContext(TotalContext) as TotalContextProps
  let brandColor: string = property?.brandColor ?? '#0736c4'

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    <div className='flex h-fit w-[20vw] flex-col px-[.7vw] py-[1vh]'>
      <div className='flex w-full items-center justify-between py-[.5vh]'>
        <h1 style={{ fontSize: `0.8vw` }} className=''>
          {modalTitle}
        </h1>
        <Button className={'flex items-center outline-none'} onClick={close}>
          <Multiply height='.7vw' width='.7vw' />
        </Button>
      </div>
      <p style={{ fontSize: `0.6vw` }} className='text-torus-text-opacity-50'>
        {modalSubText}
      </p>

      <div
        style={{ fontSize: `0.8vw` }}
        className='flex flex-col gap-[1vh] py-[1vh]'
      >
        <Label className='font-semibold'>Name</Label>
        <input
          id='name'
          name='name'
          type='text'
          placeholder={`Enter ${resourceField} name`}
          className={`border-[var(--g-color-line-generic)] bg-[var(--g-color-base-background)] w-[18.5vw] rounded-lg border px-[.5vw] py-[.4vh] text-[var(--g-color-text-primary)] outline-none`}
          onChange={handleInputChange}
          value={inputValue.name}
        />
        <Label className='font-semibold'>Code</Label>
        <input
          id='code'
          name='code'
          type='text'
          placeholder={`Enter ${resourceField} code`}
          className={`border-[var(--g-color-line-generic)] bg-[var(--g-color-base-background)] w-[18.5vw] rounded-lg border px-[.5vw] py-[.4vh] text-[var(--g-color-text-primary)] outline-none`}
          onChange={handleInputChange}
          readOnly={resource?.code ? true : false}
          value={inputValue.code?.replace(`${parentCode}`, '')}
        />
      </div>
      <div className='flex w-full justify-end gap-[.5vw] py-[1vh]'>
        <Button
          onClick={close}
          style={{ fontSize: `0.8vw` }}
          className={
            'bg-torus-bg border-[var(--g-color-line-generic)] rounded-lg border px-[.5vw] py-[.5vh] outline-none'
          }
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          style={{
            backgroundColor: brandColor,
            color: isLightColor(brandColor),
            fontSize: `0.8vw`
          }}
          className={'rounded-lg px-[.5vw] py-[.5vh] outline-none'}
        >
          {resource?.code ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

export default AddGroupLevelModal
