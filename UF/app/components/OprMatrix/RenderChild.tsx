import { isLightColor } from '../utils'
import { DeleteIcon, EditIcon, PlusIcon, SixDotsSvg } from '../svgApplication'
import { useContext, useRef, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { twMerge } from 'tailwind-merge'
import { Button, Modal, Popup } from '@gravity-ui/uikit'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import AddGroupLevelModal from './AddGroupLevelModal'

const RenderChild = ({
  item,
  displayName,
  displayCode,
  codePrefix,
  isSelected,
  onClick,
  existsInContext = true,
  onAddToContext,
  onDelete,
  resourceField,
  editContentProps
}: {
  item: any
  displayName: string
  displayCode: string
  codePrefix: string
  isSelected: boolean
  onClick: () => void
  existsInContext: boolean
  onAddToContext?: () => void
  onDelete: (() => void) | null
  resourceField: string
  editContentProps: any
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { property } = useContext(TotalContext) as TotalContextProps
  let brandColor: string = property?.brandColor ?? '#0736c4'
  const popoverButtonElement = useRef(null)

  const handleDragStartOfOPRNode = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('type', resourceField)
    e.dataTransfer.setData('data', JSON.stringify(item))
    e.dataTransfer.setData('codePrefix', codePrefix)
  }

  return (
    <div
      draggable={true}
      onDragStart={handleDragStartOfOPRNode}
      onDragOver={e => e.preventDefault()}
      style={{
        fontSize: `0.7vw`
      }}
      className={twMerge(
        'group group flex w-full items-center justify-between rounded-lg border bg-[var(--g-color-base-background)] px-[.5vw] py-[1vh] font-semibold hover:border-[var(--brand-color)] hover:shadow',
        !existsInContext ? 'pr-[0.8vw]' : '',
        isSelected ? 'bg-unset border-[var(--brand-color)]' : ''
      )}
      onClick={() => existsInContext && onClick()}
      key={displayCode}
    >
      <div className='flex items-center gap-[0.5vw]'>
        <span>
          <SixDotsSvg fill='var(--g-color-text-primary)' />
        </span>
        <div className='flex flex-col'>
          <span>{displayName}</span>
          <span
            style={{
              fontSize: `0.6vw`
            }}
            className='text-torus-text-opacity-50'
          >
            {displayCode.replace(codePrefix, '')}
          </span>
        </div>
      </div>
      {!existsInContext && onAddToContext ? (
        <div>
          <Button
            className={'flex items-center gap-[0.5vw] rounded px-[0.2vw]'}
            style={{
              fontSize: `0.7vw`,
              backgroundColor: brandColor,
              color: isLightColor(brandColor)
            }}
            onClick={onAddToContext}
          >
            <PlusIcon
              fill={isLightColor(brandColor)}
              height='.8vw'
              width='.8vw'
            />
            Add
          </Button>
        </div>
      ) : (
        <div className={'opacity-0 transition-opacity group-hover:opacity-100'}>
          <Button
            onClick={() => setIsPopoverOpen(prev => !prev)}
            ref={popoverButtonElement}
            className='flex rotate-90 items-center rounded p-[0.3vw] outline-none'
          >
            <BsThreeDotsVertical />
          </Button>
          <Popup
            anchorRef={popoverButtonElement}
            open={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
          >
            <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
              <div
                className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  e.stopPropagation()
                  setIsPopoverOpen(false) // Close popover first
                  setTimeout(() => setIsEditModalOpen(true), 100) // Then open modal with small delay
                }}
                style={{
                  fontSize: `0.7}vw`
                }}
              >
                <EditIcon height='.8vw' width='.8vw' />
                Edit {resourceField}
              </div>
              {onDelete && (
                <div
                  className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                  onClick={e => {
                    e.stopPropagation()
                    //   setIsPopoverOpen(false);
                    onDelete()
                  }}
                  style={{
                    fontSize: `0.7}vw`
                  }}
                >
                  <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
                  Delete
                </div>
              )}
            </div>
          </Popup>
        </div>
      )}

      {/* Edit Modal */}
      {editContentProps && (
        <Modal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setIsPopoverOpen(false)
          }}
          disableOutsideClick
        >
          <AddGroupLevelModal
            close={() => {
              setIsEditModalOpen(false)
              setIsPopoverOpen(false)
            }}
            {...editContentProps}
          />
        </Modal>
      )}
    </div>
  )
}

export default RenderChild
