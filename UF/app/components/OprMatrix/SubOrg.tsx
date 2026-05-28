import React, { useRef } from 'react'
import { FaRegFolderOpen } from 'react-icons/fa'
import {
  DeleteIcon,
  DownArrow,
  EditIcon,
  PlusIcon
  // ThreeDots
} from '../svgApplication'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Popup } from '@/components/Popup'
import { useOPRMatrix } from '.'
import { hexWithOpacity } from '../utils'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import RenderChild from './RenderChild'
import AddGroupLevelModal from './AddGroupLevelModal'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import i18n from '../i18n'
import { hasMatchingSubOrg, highlightText } from '@/app/user/components/AccessTemplateTable/SearchHelpers'

interface RenderSubOrgProps {
  subOrgGrp: any
  subOrgGrpIndex: number
  parentPath: string
  parentCode: string
  assignedOPRList: string[]
  deleteResource: (path: string, index: number) => void
  handleOrgClick: (obj: Record<string, string>) => void
  editContent: (
    path: string,
    value: { code: string; name: string },
    parentCode: string
  ) => void
  addContent: (
    path: string,
    value: { code: string; name: string },
    parentCode: string
  ) => void
  isSearchOpen: string
  searchTerm: string
  orgGrpCode: string
  orgGrpName: string
  selectedOrg: Record<string, string>
}

const RenderSubOrg: React.FC<RenderSubOrgProps> = ({
  subOrgGrp,
  subOrgGrpIndex,
  parentPath,
  parentCode,
  assignedOPRList,
  deleteResource,
  handleOrgClick,
  editContent,
  addContent,
  isSearchOpen,
  searchTerm,
  orgGrpCode,
  orgGrpName,
  selectedOrg
}) => {
  const { toggleDropdown, collapsedItems } = useOPRMatrix()
  const { branding } = useGlobal()
  const { borderColor, isDark } = useTheme()
  const { brandColor } = branding
  const toast = useInfoMsg()
  const isOpen = !collapsedItems[subOrgGrp.subOrgGrpId]
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const keyset = i18n.keyset('language')

  // Add this inside RenderSubOrg component
  const matchesSearch = React.useMemo(() => {
    return hasMatchingSubOrg(subOrgGrp, searchTerm)
  }, [subOrgGrp, searchTerm])

  // Auto-expand on search
  React.useEffect(() => {
    if (searchTerm && matchesSearch && isSearchOpen === 'org') {
      // Don't collapse when searching
    }
  }, [searchTerm, matchesSearch, isSearchOpen])

  // Don't render if doesn't match
  if (isSearchOpen === 'org' && searchTerm && !matchesSearch) {
    return null
  }

  return (
    <div
      style={{
        backgroundColor: hexWithOpacity(brandColor, 0.05)
      }}
      className='mt-2 flex w-full flex-col gap-2 rounded-lg px-3 py-3'
    >
      {/* Sub Org Group Header */}
      <div
        onClick={e => {
          toggleDropdown(subOrgGrp.subOrgGrpId)
          e.stopPropagation()
        }}
        className='flex cursor-pointer items-center justify-between'
      >
        <div className='flex items-center gap-[.5vw] text-sm'>
          <span
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-[360deg]' : 'rotate-[270deg]'
            }`}
          >
            <DownArrow fill={isDark ? 'white' : 'black'} />
          </span>
          <FaRegFolderOpen className='text-[var(--g-color-text-primary)]' />
          <span className='text-[var(--g-color-text-primary)]'>
             {isSearchOpen === "org" && searchTerm
              ? highlightText(subOrgGrp.subOrgGrpName, searchTerm, brandColor)
              : subOrgGrp.subOrgGrpName} -{' '}
            <span className='text-xs text-[var(--g-color-text-secondary)]'>
              {subOrgGrp.subOrgGrpCode.replace(`${parentCode}-`, '')}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div
          className={twMerge(
            'flex items-center gap-[0.5vw]',
            isSearchOpen === 'org' && 'hidden'
          )}
        >
          {/* <Button
            ref={buttonRef}
            onClick={e => {
              e.stopPropagation()
              setIsPopupOpen(!isPopupOpen)
            }}
            className='flex items-center rounded p-[0.3vw]'
            variant='ghost'
          >
            <ThreeDots />
          </Button> */}

          <Popup
            anchorRef={buttonRef}
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            placement='bottom-end'
            autoClose
          >
            <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
              {/* Add Sub Org */}
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] hover:bg-[var(--g-color-base-hover)]'
                onClick={e => {
                  e.stopPropagation()
                  setIsPopupOpen(false)
                  setTimeout(() => setIsAddModalOpen(true), 100)
                }}
              >
                <PlusIcon height='.8vw' width='.8vw' />
                {keyset('Add Sub Organization')}
              </div>

              {/* Edit Sub Org Group */}
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] hover:bg-[var(--g-color-base-hover)]'
                onClick={e => {
                  e.stopPropagation()
                  setIsPopupOpen(false)
                  setTimeout(() => setIsEditModalOpen(true), 100)
                }}
              >
                <EditIcon height='.8vw' width='.8vw' />
                {keyset('Edit Sub Org Group')}
              </div>

              {/* Delete */}
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] hover:bg-[var(--g-color-base-hover)]'
                onClick={e => {
                  e.stopPropagation()
                  setIsPopupOpen(false)
                  if (assignedOPRList.includes(subOrgGrp.subOrgGrpId)) {
                    toast(
                      "Can't delete this sub organization group as it assigned to a template",
                      'warning'
                    )
                    return
                  }
                  deleteResource(parentPath, subOrgGrpIndex)
                }}
              >
                <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
                {keyset('Delete')}
              </div>
            </div>
          </Popup>

          {/* Add Modal */}
          <Modal
            showCloseButton={false}
            className='w-[500px]'
            onClose={() => setIsAddModalOpen(false)}
            open={isAddModalOpen}
          >
            <AddGroupLevelModal
              close={() => setIsAddModalOpen(false)}
              path={`${parentPath}.${subOrgGrpIndex}.subOrg`}
              addFunction={addContent}
              parentCode={`${subOrgGrp.subOrgGrpCode}-`}
              modalTitle={keyset('Add Sub Organization')}
              modalSubText={keyset(
                'Create a new sub organization in this group.'
              )}
              resourceField='sub organization'
            />
          </Modal>

          {/* Edit Modal */}
          <Modal
            showCloseButton={false}
            className='w-[500px]'
            onClose={() => setIsEditModalOpen(false)}
            open={isEditModalOpen}
          >
            <AddGroupLevelModal
              close={() => setIsEditModalOpen(false)}
              path={`${parentPath}.${subOrgGrpIndex}`}
              addFunction={editContent}
              parentCode={`${parentCode}-`}
              modalTitle={keyset('Edit Sub Org Group')}
              modalSubText={keyset('Update sub organization group.')}
              resourceField='sub organization group'
              resource={{
                code: subOrgGrp.subOrgGrpCode,
                name: subOrgGrp.subOrgGrpName
              }}
            />
          </Modal>
        </div>
      </div>

      {/* Sub Organizations */}
      {isOpen && (
        <div className='ml-[1vw] flex flex-col gap-[1vh]'>
          {subOrgGrp.subOrg
            ?.filter((subOrg: any) => {
              if (isSearchOpen !== 'org' || !searchTerm) return true

              // Check if this subOrg matches or has matching children
              return (
                subOrg.subOrgName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                subOrg.subOrgGrp?.some((nested: any) =>
                  hasMatchingSubOrg(nested, searchTerm)
                )
              )
            })
            .map((subOrg: any, subOrgIndex: number) => (
              <RenderChild
                key={subOrg.subOrgId}
                item={subOrg}
                displayName={subOrg.subOrgName}
                displayCode={subOrg.subOrgCode}
                codePrefix={`${subOrgGrp.subOrgGrpCode}-`}
                isSelected={selectedOrg.id === subOrg.subOrgId}
                onClick={() =>
                  handleOrgClick({
                    orgGrpCode: orgGrpCode,
                    orgGrpName: orgGrpName,
                    orgName: subOrg.subOrgName,
                    orgCode: subOrg.subOrgCode,
                    path: `${parentPath}.${subOrgGrpIndex}.subOrg.${subOrg.originalIndex}.psGrp`,
                    id: subOrg.subOrgId
                  })
                }
                existsInContext={true}
                onDelete={
                  isSearchOpen === 'org'
                    ? null
                    : () => {
                        if (assignedOPRList.includes(subOrg.subOrgId)) {
                          toast(
                            "Can't delete this sub organization as it assigned to a template",
                            'warning'
                          )
                          return
                        }
                        deleteResource(
                          `${parentPath}.${subOrgGrpIndex}.subOrg`,
                          subOrg.originalIndex
                        )
                      }
                }
                editContentProps={{
                  path: `${parentPath}.${subOrgGrpIndex}.subOrg.${subOrg.originalIndex}`,
                  addFunction: editContent,
                  parentCode: `${subOrgGrp.subOrgGrpCode}-`,
                  modalTitle: keyset('Edit Sub Organization'),
                  modalSubText: keyset('Update sub organization.'),
                  resourceField: 'sub organization',
                  resource: {
                    code: subOrg.subOrgCode,
                    name: subOrg.subOrgName
                  }
                }}
                resourceField='subOrg'
              >
                {/* Recursively render nested subOrgGrp */}
                {subOrg.subOrgGrp?.map(
                  (nestedSubOrgGrp: any, nestedIndex: number) => (
                    <RenderSubOrg
                      key={nestedSubOrgGrp.subOrgGrpId}
                      subOrgGrp={nestedSubOrgGrp}
                      subOrgGrpIndex={nestedIndex}
                      parentPath={`${parentPath}.${subOrgGrpIndex}.subOrg.${subOrg.originalIndex}.subOrgGrp`}
                      parentCode={subOrg.subOrgCode}
                      assignedOPRList={assignedOPRList}
                      deleteResource={deleteResource}
                      handleOrgClick={handleOrgClick}
                      editContent={editContent}
                      addContent={addContent}
                      isSearchOpen={isSearchOpen}
                      searchTerm={searchTerm}
                      orgGrpCode={orgGrpCode}
                      orgGrpName={orgGrpName}
                      selectedOrg={selectedOrg}
                    />
                  )
                )}
              </RenderChild>
            ))}
        </div>
      )}
    </div>
  )
}

export default RenderSubOrg
