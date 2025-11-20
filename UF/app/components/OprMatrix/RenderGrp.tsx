import { FaRegFolderOpen } from 'react-icons/fa'
import { DeleteIcon, DownArrow, EditIcon, PlusIcon } from '../svgApplication'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useOPRMatrix } from '.'
import { useContext, useMemo, useRef, useState } from 'react'
import { hexWithOpacity } from '../utils'
import { twMerge } from 'tailwind-merge'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { Button, Modal, Popup } from '@gravity-ui/uikit'
import { useInfoMsg } from '../infoMsgHandler'
import AddGroupLevelModal from './AddGroupLevelModal'

// ============= RENDER GROUP (REUSABLE) =============
const RenderGroup = ({
  item,
  itemId,
  displayName,
  displayCode,
  codePrefix,
  onDelete,
  addContentProps,
  editContentProps,
  children,
  resourceField,
  contextKey,
  path
}: {
  item: any
  itemId: string
  displayName: string
  displayCode: string
  codePrefix: string
  onDelete: (() => void) | null
  addContentProps: any
  editContentProps: any
  children: React.ReactNode
  resourceField: string
  contextKey: string
  path: string
}) => {
  const { property } = useContext(TotalContext) as TotalContextProps
  let brandColor: string = property?.brandColor ?? '#0736c4'
  const {
    toggleDropdown,
    collapsedItems,
    isSearchOpen,
    searchTerm,
    handleDroppingOfResource
  } = useOPRMatrix()

  const isOpen = !collapsedItems[itemId]
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverButtonElement = useRef(null)

  const isCurrentContext = useMemo(
    () => isSearchOpen == contextKey && searchTerm,
    [isSearchOpen, contextKey, searchTerm]
  )

  const toast = useInfoMsg()

  const handleDropOPRNode = (e: React.DragEvent<HTMLDivElement>) => {
    const type = e.dataTransfer.getData('type')
    const data = JSON.parse(e.dataTransfer.getData('data'))
    const codePrefixOfDroppedNode = e.dataTransfer.getData('codePrefix')

    if (type != contextKey || `${displayCode}-` == codePrefixOfDroppedNode) {
      toast("Can't drop here", 'warning')
      return
    }

    handleDroppingOfResource(
      path,
      data,
      codePrefixOfDroppedNode,
      `${displayCode}-`
    )
  }

  // Close popup only if no modal is open
  const handlePopoverClose = () => {
    if (!isAddModalOpen && !isEditModalOpen) {
      setIsPopoverOpen(false)
    }
  }

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={handleDropOPRNode}
      style={{ backgroundColor: hexWithOpacity(brandColor, 0.1) }}
      className='flex w-full cursor-pointer flex-col gap-[1vh] rounded-lg px-[1vw] py-[1.5vh]'
    >
      <div
        onClick={e => {
          toggleDropdown(itemId)
          e.stopPropagation()
        }}
        className='flex items-center justify-between'
      >
        <div
          className='flex items-center gap-[.5vw]'
          style={{ fontSize: '0.7vw' }}
        >
          <span
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-[360deg]' : 'rotate-[270deg]'
            }`}
          >
            <DownArrow fill='var(--g-color-text-primary)' />
          </span>
          <FaRegFolderOpen />
          <span>
            {displayName} -{' '}
            <span
              style={{ fontSize: '0.6vw' }}
              className='text-torus-text-opacity-50'
            >
              {displayCode.replace(codePrefix, '')}
            </span>
          </span>
        </div>

        <div
          className={twMerge(
            'flex items-center gap-[0.5vw]',
            isCurrentContext ? 'hidden' : ''
          )}
        >
          {/* Three Dots Popover */}
          <Button
            onClick={e => {
              e.stopPropagation()
              setIsPopoverOpen(prev => !prev)
            }}
            ref={popoverButtonElement}
            className='flex rotate-90 items-center rounded p-[0.3vw] outline-none'
          >
            <BsThreeDotsVertical />
          </Button>

          <Popup
            anchorRef={popoverButtonElement}
            open={isPopoverOpen}
            onClose={handlePopoverClose}
          >
            <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
              <div
                className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  e.stopPropagation()
                  setIsAddModalOpen(true)
                }}
                style={{ fontSize: '0.7vw' }}
              >
                <PlusIcon
                  height='.8vw'
                  width='.8vw'
                  fill='var(--g-color-text-primary)'
                />
                Add {resourceField}
              </div>

              <div
                className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  e.stopPropagation()
                  setIsEditModalOpen(true)
                }}
                style={{ fontSize: '0.7vw' }}
              >
                <EditIcon height='.8vw' width='.8vw' />
                Edit {resourceField} Group
              </div>

              {onDelete && (
                <div
                  className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                  onClick={e => {
                    e.stopPropagation()
                    setIsPopoverOpen(false)
                    onDelete()
                  }}
                  style={{ fontSize: '0.7vw' }}
                >
                  <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
                  Delete
                </div>
              )}
            </div>
          </Popup>

          {/* Add Modal */}
          <div onClick={e => e.stopPropagation()}>
            <Modal
              open={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false)
                setIsPopoverOpen(false)
              }}
              disableOutsideClick
            >
              <AddGroupLevelModal
                close={() => {
                  setIsAddModalOpen(false)
                  setIsPopoverOpen(false)
                }}
                {...addContentProps}
              />
            </Modal>
          </div>

          {/* Edit Modal */}
           <div onClick={e => e.stopPropagation()}>
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
        </div>
      </div>

      {isOpen && children}
    </div>
  )
}

export default RenderGroup
