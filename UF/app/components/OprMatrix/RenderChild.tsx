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
import { useOPRMatrix } from '.'
import { highlightText } from '@/app/user/components/AccessTemplateTable/SearchHelpers'

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
  editContentProps,
  addContentProps,
  children
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
  addContentProps?: any
  children?: React.ReactNode
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const popoverButtonElement = useRef(null)
  const { branding } = useGlobal()
  const { isDark, borderColor, bgColor } = useTheme()
  const { brandColor } = branding
  const { isSearchOpen, searchTerm } = useOPRMatrix()

  const handleDragStartOfOPRNode = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('type', resourceField)
    e.dataTransfer.setData('data', JSON.stringify(item))
    e.dataTransfer.setData('codePrefix', codePrefix)
  }

  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-[1vh] rounded-md p-2',
        bgColor
      )}
    >
      <div
        draggable={
          resourceField !== 'org' && resourceField !== 'subOrg' && true
        }
        onDragStart={handleDragStartOfOPRNode}
        onDragOver={e => e.preventDefault()}
        style={{
          fontSize: `0.7vw`
        }}
        className={twMerge(
          'group group flex w-full items-center justify-between rounded-lg border bg-[var(--g-color-base-background)] px-[.5vw] py-[1vh] font-semibold hover:border-[var(--brand-color)] hover:shadow',
          !existsInContext ? 'pr-[0.8vw]' : '',
          isSelected ? 'bg-unset border-[var(--brand-color)]' : borderColor
        )}
        onClick={() => existsInContext && onClick()}
        key={displayCode}
      >
        <div className='flex items-center gap-[0.5vw]'>
          {resourceField !== 'org' && resourceField !== 'subOrg' && (
            <span>
              <SixDotsSvg fill={isDark ? 'white' : 'black'} />
            </span>
          )}
          <div className='flex flex-col'>
            <Text contentAlign='left'>
              {' '}
              {isSearchOpen && searchTerm
                ? highlightText(displayName, searchTerm, brandColor)
                : displayName}
            </Text>
            <Text contentAlign='left' color='secondary'>{displayCode.replace(codePrefix, '')}</Text>
          </div>
        </div>
        {!existsInContext && onAddToContext ? (
          <Button onClick={onAddToContext} view='outlined-success' className='!w-auto px-2'>
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
          <div
            className={'opacity-0 transition-opacity group-hover:opacity-100'}
          >
            {resourceField !== 'org' && resourceField !== 'subOrg' && (
              <Button
                onClick={() => setIsPopoverOpen(prev => !prev)}
                ref={popoverButtonElement}
                className='flex rotate-90 items-center rounded p-[0.3vw] outline-none'
              >
                <BsThreeDotsVertical />
              </Button>
            )}
            <Popup
              anchorRef={popoverButtonElement}
              open={isPopoverOpen}
              onClose={() => setIsPopoverOpen(false)}
              className='w-[9vw]'
              placement='left'
            >
              <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
                {addContentProps && (
                  <div
                    className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                    onClick={e => {
                      e.stopPropagation()
                      setIsPopoverOpen(false)
                      setTimeout(() => setIsAddModalOpen(true), 100)
                    }}
                    style={{
                      fontSize: `0.7vw`
                    }}
                  >
                    <PlusIcon
                      height='.8vw'
                      width='.8vw'
                      fill={isDark ? 'white' : 'black'}
                    />
                    Add {addContentProps.resourceField || 'Item'}
                  </div>
                )}
                <div
                  className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                  onClick={e => {
                    e.stopPropagation()
                    setIsPopoverOpen(false)
                    setTimeout(() => setIsEditModalOpen(true), 100)
                  }}
                  style={{
                    fontSize: `0.7vw`
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
                      onDelete()
                    }}
                    style={{
                      fontSize: `0.7vw`
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

        {/* Add Modal */}
        {addContentProps && (
          <Modal
            open={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false)
              setIsPopoverOpen(false)
            }}
            showCloseButton={false}
            className='w-[500px]'
          >
            <AddGroupLevelModal
              close={() => {
                setIsAddModalOpen(false)
                setIsPopoverOpen(false)
              }}
              {...addContentProps}
            />
          </Modal>
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
            className='w-[500px]'
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

      {/* Render children (nested subOrgGrp) */}
      {children && <div>{children}</div>}
    </div>
  )
}

export default RenderChild
