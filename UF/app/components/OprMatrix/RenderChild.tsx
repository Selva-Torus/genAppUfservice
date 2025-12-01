import { isLightColor } from '../utils'
import { DeleteIcon, EditIcon, PlusIcon, SixDotsSvg } from '../svgApplication'
import { useRef, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { twMerge } from 'tailwind-merge'
import AddGroupLevelModal from './AddGroupLevelModal'
import { Button } from '@/components/Button'
import { useGlobal } from '@/context/GlobalContext'
import { useTheme } from '@/hooks/useTheme'
import { Text } from '@/components/Text'
import { Modal } from '@/components/Modal'
import Popup from '@/components/Popup'

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
  const popoverButtonElement = useRef(null)
  const { branding } = useGlobal()
  const { isDark } = useTheme()
  const { brandColor } = branding

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
          <SixDotsSvg fill={isDark ? 'white' : 'black'} />
        </span>
        <div className='flex flex-col'>
          <Text variant='body-2'>{displayName}</Text>
          <Text color='secondary'>{displayCode.replace(codePrefix, '')}</Text>
        </div>
      </div>
      {!existsInContext && onAddToContext ? (
        <Button onClick={onAddToContext} view='outlined-success'>
          <div className='flex items-center gap-2'>
            <PlusIcon
              fill={isLightColor(brandColor)}
              height='.8vw'
              width='.8vw'
            />
            Add
          </div>
        </Button>
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
            className='w-[9vw]'
            placement='left'
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
          showCloseButton={false}
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
