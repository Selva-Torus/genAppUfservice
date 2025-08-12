import React, { useState } from 'react'
import { Copy } from '@gravity-ui/icons';
import { CopyCheck } from '@gravity-ui/icons';
import JsonView, { JsonViewProps } from 'react18-json-view'
import 'react18-json-view/src/style.css'

interface CustomJsonViewProps extends JsonViewProps {
  isCopyNeeded?: boolean
}

const CustomJsonView = ({
  isCopyNeeded = true,
  ...props
}: CustomJsonViewProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = async (src: string) => {
    try {
      await navigator.clipboard.writeText(src ?? '')
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 800)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={'flex group'}>
      <JsonView enableClipboard={false} {...props} CopyComponent={() => <></>}/>
      {isCopyNeeded && (
        <div
          onClick={() =>
            handleCopyToClipboard(JSON.stringify(props?.src, null, 2))
          }
          className='cursor-pointer opacity-0 group-hover:opacity-100'
        >
          {copied ? (
            <CopyCheck className='text-green-500' />
          ) : (
            <Copy />
          )}
        </div>
      )}
    </div>
  )
}

export default CustomJsonView