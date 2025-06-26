'use client'
import { forwardRef } from 'react'
import { Button } from '@gravity-ui/uikit'
import { ButtonProps } from '@gravity-ui/uikit'
import TorusIcon from './Icon'

interface TorusButtonProps extends ButtonProps {
  children: React.ReactNode
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

const TorusButton = forwardRef<HTMLButtonElement, TorusButtonProps>(
  ({ children, startContent, endContent, ...props }, ref) => {
    return (
      <Button {...props} ref={ref}>
        <span className='flex h-full items-center'>
          {startContent && <TorusIcon>{startContent}</TorusIcon>}
          {children}
          {endContent && <TorusIcon>{endContent}</TorusIcon>}
        </span>
      </Button>
    )
  }
)

// Set display name for debugging
TorusButton.displayName = 'TorusButton'

export default TorusButton