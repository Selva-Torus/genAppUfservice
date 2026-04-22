import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { FaRegFolderOpen } from 'react-icons/fa'
import { LuBuilding2 } from 'react-icons/lu'
import AddGroupLevelModal from '../../components/OprMatrix/AddGroupLevelModal'
import { SetupScreenContext, SetupScreenContextType } from '.'
import { useInfoMsg } from '../../components/infoMsgHandler'
import { Modal } from '@/components/Modal'
import { hexWithOpacity, isLightColor } from '../../components/utils'
import { useGlobal } from '@/context/GlobalContext'
import {
  DeleteIcon,
  DownArrow,
  EditIcon,
  PlusIcon,
  SixDotsSvg,
  ThreeDots
} from '../../components/svgApplication'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/Button'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Popup from '@/components/Popup'
import { twMerge } from 'tailwind-merge'
import { Text } from '@/components/Text'
import { getFontSizeForHeader } from '@/app/utils/branding'

interface OrgLinkContextType {
  collapsedItems: Record<string, boolean>
  toggleDropdown: (code: string) => void
  handleDrop: (
    targetPath: string,
    droppedData: any,
    dropType: 'orgGrp' | 'org' | 'subOrg'
  ) => void
  handleRemoveFromLink: (path: string) => void
  orgMaster: any[]
  setOrgMaster: React.Dispatch<React.SetStateAction<any[]>>
  addOrgMasterContent: (
    path: string,
    value: { code: string; name: string },
    parentCode: string
  ) => void
  editOrgMasterContent: (
    path: string,
    value: { code: string; name: string }
  ) => void
  deleteOrgMasterContent: (path: string, index: number) => void
  dragTypeRef: React.MutableRefObject<string>
}

const OrgLinkContext = React.createContext<OrgLinkContextType | null>(null)

const OrganizationLink = ({
  srcOrgIds,
  assignedOPRList
}: {
  srcOrgIds: Array<string>
  assignedOPRList: Array<string>
}) => {
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  )
  const { branding } = useGlobal()
  const { borderColor } = useTheme()
  const { brandColor } = branding
  const {
    orgGrpData: linkedOrgData,
    setOrgGrpData: setLinkedOrgData,
    orgMasterData: orgMaster,
    setOrgMasterData: setOrgMaster,
    searchTerm
  } = React.useContext(SetupScreenContext) as SetupScreenContextType
  const toast = useInfoMsg()
  const dragTypeRef = useRef('')

  const toggleDropdown = (id: string) => {
    setCollapsedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getResource = (path: string) => {
    const copyOfLinkedData = structuredClone(linkedOrgData)
    return _.get(copyOfLinkedData, path) || []
  }

  const setResource = (path: string, value: any) => {
    const copyOfLinkedData = structuredClone(linkedOrgData)
    _.set(copyOfLinkedData, path, value)
    setLinkedOrgData(copyOfLinkedData)
  }

  const updateRecursively = (
    data: any,
    {
      replaceCode = false,
      sourceCode = '',
      targetCode = '',
      replaceIds = false
    } = {}
  ): any => {
    if (Array.isArray(data)) {
      return data.map(item =>
        updateRecursively(item, {
          replaceCode,
          sourceCode,
          targetCode,
          replaceIds
        })
      )
    }

    if (typeof data === 'object' && data !== null) {
      const updated: Record<string, any> = {}

      for (const [key, value] of Object.entries(data)) {
        if (replaceIds && key.toLowerCase().endsWith('id')) {
          updated[key] = uuidv4()
        } else if (
          replaceCode &&
          key.toLowerCase().endsWith('code') &&
          typeof value === 'string'
        ) {
          updated[key] = value.replace(sourceCode, targetCode)
        } else if (typeof value === 'object') {
          updated[key] = updateRecursively(value, {
            replaceCode,
            sourceCode,
            targetCode,
            replaceIds
          })
        } else {
          updated[key] = value
        }
      }

      return updated
    }

    return data
  }

  const checkCodeExist = (data: any[], code: string) => {
    return data.find(val =>
      Object.entries(val).find(([key, value]) => {
        if (
          key.toLowerCase().includes('code') &&
          typeof value === 'string' &&
          value.split('-').pop() === code.split('-').pop()
        ) {
          return true
        }
        return false
      })
    )
  }

  const handleDrop = (
    targetPath: string,
    droppedData: any,
    dropType: 'orgGrp' | 'org' | 'subOrg'
  ) => {
    const resource = getResource(targetPath)

    const codeKey =
      dropType === 'orgGrp'
        ? 'orgGrpCode'
        : dropType === 'org'
        ? 'orgCode'
        : 'subOrgCode'

    const codeValue = droppedData[codeKey]

    if (!codeValue) {
      toast('Invalid data - code not found', 'danger')
      return
    }

    const isCodeExist = checkCodeExist(resource, codeValue)
    if (isCodeExist) {
      toast('Item with same code already exists', 'warning')
      return
    }

    let dataToAdd: any

    if (dropType === 'orgGrp') {
      dataToAdd = {
        orgGrpCode: droppedData.orgGrpCode,
        orgGrpName: droppedData.orgGrpName,
        srcId: droppedData.orgGrpId,
        orgGrpId: uuidv4(),
        org: []
      }
    } else if (dropType === 'org') {
      const pathParts = targetPath.split('.')
      const isSubOrgGrp = pathParts.includes('subOrgGrp')

      if (isSubOrgGrp) {
        // Dropping into sub-org group
        dataToAdd = {
          subOrgCode: droppedData.orgCode,
          subOrgName: droppedData.orgName,
          srcId: droppedData.orgId,
          subOrgId: uuidv4(),
          psGrp: droppedData.psGrp || []
        }
      } else {
        // Dropping into org group
        dataToAdd = {
          orgCode: droppedData.orgCode,
          orgName: droppedData.orgName,
          srcId: droppedData.orgId,
          orgId: uuidv4(),
          psGrp: droppedData.psGrp || []
        }
      }
    }

    setResource(targetPath, [...resource, dataToAdd])
    toast('Item added to link successfully', 'success')
  }

  const handleRemoveFromLink = (path: string) => {
    const pathParts = path.split('.')
    const indexToRemove = parseInt(pathParts.pop() || '0')
    const parentPath = pathParts.join('.')
    if (!parentPath) {
      setLinkedOrgData((prev: any) =>
        prev.filter((_: any, idx: number) => idx !== indexToRemove)
      )
      toast('Item removed from link', 'success')
      return
    }
    const resource = getResource(parentPath)
    const updatedResource = resource.filter(
      (_: any, idx: number) => idx !== indexToRemove
    )
    setResource(parentPath, updatedResource)
    toast('Item removed from link', 'success')
  }

  // ============= ORG MASTER MANAGEMENT FUNCTIONS =============
  const checkCodeExistInMaster = (
    data: Record<string, any>[],
    code: string
  ) => {
    return data.find(val =>
      Object.entries(val).find(([key, value]) => {
        if (
          key.toLowerCase().includes('code') &&
          typeof value === 'string' &&
          value.split('-').pop() === code.split('-').pop()
        ) {
          return true
        }
        return false
      })
    )
  }

  const addOrgMasterContent = (
    path: string,
    value: { code: string; name: string },
    parentCode: string
  ) => {
    const depthOfPath = path.split('.').length
    if (!value.code || !value.name) {
      toast('Please fill all the fields', 'warning')
      return
    }

    const valueToBeAdded: Record<string, any> = {}
    const copyOfOrgMaster = structuredClone(orgMaster)

    switch (depthOfPath) {
      case 1:
        // Adding org group
        valueToBeAdded['orgGrpCode'] = value.code
        valueToBeAdded['orgGrpName'] = value.name
        valueToBeAdded['orgGrpId'] = uuidv4()
        valueToBeAdded['org'] = []

        const isExist = checkCodeExistInMaster(
          copyOfOrgMaster,
          `${parentCode}${value.code}`
        )
        if (isExist) {
          toast('Code already exists', 'warning')
          return
        } else {
          setOrgMaster((prev: any) => [...prev, valueToBeAdded])
          return
        }
      case 2:
        // Adding org
        valueToBeAdded['orgCode'] = value.code
        valueToBeAdded['orgName'] = value.name
        valueToBeAdded['orgId'] = uuidv4()
        valueToBeAdded['psGrp'] = []
        valueToBeAdded['subOrg'] = []
        break
      default:
        break
    }

    const resource = _.get(copyOfOrgMaster, path) || []
    const isExist = checkCodeExistInMaster(resource, value.code)
    if (isExist) {
      toast('Code already exists', 'warning')
    } else {
      _.set(copyOfOrgMaster, path, [...resource, valueToBeAdded])
      setOrgMaster(copyOfOrgMaster)
    }
  }

  const editOrgMasterContent = (
    path: string,
    value: { code: string; name: string }
  ) => {
    const copyOfOrgMaster = structuredClone(orgMaster)
    const resource = _.get(copyOfOrgMaster, path)

    if (resource && typeof resource === 'object') {
      Object.keys(resource).forEach(key => {
        if (key.toLowerCase().endsWith('name')) {
          resource[key] = value.name
        }
      })
      _.set(copyOfOrgMaster, path, resource)
      setOrgMaster(copyOfOrgMaster)
    }
  }

  const deleteOrgMasterContent = (path: string, deletionIndex: number) => {
    const copyOfOrgMaster = structuredClone(orgMaster)
    let resource: any[] = _.get(copyOfOrgMaster, path)
    resource = resource.filter((_, idx) => idx !== deletionIndex)
    _.set(copyOfOrgMaster, path, resource)
    setOrgMaster(copyOfOrgMaster)
  }

  const handleOrgDroppedIntoOrg = (
    targetOrgPath: string,
    droppedOrgData: any
  ) => {
    // When an org is dropped into another org, create/add to subOrgGrp
    const subOrgGrpPath = `${targetOrgPath}.subOrgGrp`
    const existingSubOrgGrps = getResource(subOrgGrpPath) || []

    // Create a new sub-org group or add to existing
    if (existingSubOrgGrps.length === 0) {
      // Create first sub-org group
      const newSubOrgGrp = {
        subOrgGrpCode: `${droppedOrgData.orgCode}-SOG`,
        subOrgGrpName: `${droppedOrgData.orgName} Group`,
        subOrgGrpId: uuidv4(),
        subOrg: [
          {
            subOrgCode: droppedOrgData.orgCode,
            subOrgName: droppedOrgData.orgName,
            subOrgId: uuidv4(),
            psGrp: droppedOrgData.psGrp || []
          }
        ]
      }
      setResource(subOrgGrpPath, [newSubOrgGrp])
    } else {
      // Add to first existing sub-org group
      const subOrg = {
        subOrgCode: droppedOrgData.orgCode,
        subOrgName: droppedOrgData.orgName,
        subOrgId: uuidv4(),
        psGrp: droppedOrgData.psGrp || []
      }

      const updatedSubOrgGrps = [...existingSubOrgGrps]
      updatedSubOrgGrps[0].subOrg.push(subOrg)
      setResource(subOrgGrpPath, updatedSubOrgGrps)
    }

    toast('Organization converted to sub-organization', 'success')
  }

  return (
    <OrgLinkContext.Provider
      value={{
        collapsedItems,
        toggleDropdown,
        handleDrop,
        handleRemoveFromLink,
        orgMaster,
        setOrgMaster,
        addOrgMasterContent,
        editOrgMasterContent,
        deleteOrgMasterContent,
        dragTypeRef
      }}
    >
      <div className='flex h-[83vh] w-full gap-[2vw]'>
        {/* LEFT PANEL - Organization Master */}
        <div className={twMerge('h-full w-1/2 rounded-lg border', borderColor)}>
          <div
            className={twMerge(
              'flex items-center justify-between border-b px-[1vw] py-[1.5vh]',
              borderColor
            )}
          >
            <Text contentAlign='left' variant={getFontSizeForHeader(branding.fontSize)} className='font-semibold'>
              Available Organizations
            </Text>
            <AddOrgGroupButton />
          </div>

          <div className='flex h-[calc(80vh-5vh)] flex-col gap-[1vh] overflow-y-auto px-[0.5vw] py-[1.5vh]'>
            {orgMaster
              .filter(
                (orgGrp: any) =>
                  orgGrp?.orgGrpName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((orgGrp: any, orgGrpIndex: number) => (
                <LeftPanelOrgGroup
                  key={orgGrpIndex}
                  orgGrp={orgGrp}
                  orgGrpIndex={orgGrpIndex}
                  srcOrgIds={srcOrgIds}
                />
              ))}
          </div>
        </div>

        {/* RIGHT PANEL - Linked Organization Structure */}
        <div className={twMerge('h-full w-1/2 rounded-lg border', borderColor)}>
          <div
            className={twMerge(
              'flex items-center justify-between border-b px-[1vw] py-[1.5vh]',
              borderColor
            )}
          >
            <Text contentAlign='left' variant={getFontSizeForHeader(branding.fontSize)} className='font-semibold'>
              Organization Links
            </Text>
          </div>

          <div
            className={twMerge(
              'flex h-[calc(82.2vh-5vh)] flex-col gap-[1vh] overflow-y-auto rounded-md border px-[0.5vw] py-[1.5vh]',
              borderColor
            )}
            onDragOver={e => {
              e.preventDefault()
              e.currentTarget.style.borderColor = brandColor
            }}
            onDrop={e => {
              e.preventDefault()
              e.currentTarget.style.borderColor = ''
              const type = e.dataTransfer.getData('type')
              const data = JSON.parse(e.dataTransfer.getData('data'))
              if (
                Array.isArray(linkedOrgData) &&
                linkedOrgData.find(
                  (orgGrp: any) => orgGrp.orgGrpCode === data.orgGrpCode
                )
              ) {
                toast('Organization group already linked', 'warning')
                return
              }

              if (type === 'orgGrp') {
                let orgArr =
                  data['org'] && Array.isArray(data['org'])
                    ? data['org'].map(org => ({
                        ...org,
                        srcId: org.orgId,
                        orgId: uuidv4()
                      }))
                    : []
                const newOrgGrp = {
                  orgGrpCode: data.orgGrpCode,
                  orgGrpName: data.orgGrpName,
                  srcId: data.orgGrpId,
                  orgGrpId: uuidv4(),
                  org: orgArr
                }
                setLinkedOrgData([...linkedOrgData, newOrgGrp])
                toast('Organization group added to links', 'success')
              }
            }}
            onDragLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            {linkedOrgData.length === 0 ? (
              <div
                className={twMerge(
                  'flex h-full items-center justify-center rounded-lg border-2 border-dashed',
                  borderColor
                )}
              >
                <p className='text-torus-text-opacity-50 text-sm'>
                  Drag organization groups here to create links
                </p>
              </div>
            ) : (
              linkedOrgData
                .filter(
                  (orgGrp: any) =>
                    orgGrp?.orgGrpName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((orgGrp: any, orgGrpIndex: number) => (
                  <RightPanelOrgGroup
                    key={orgGrpIndex}
                    orgGrp={orgGrp}
                    orgGrpIndex={orgGrpIndex}
                    assignedOPRList={assignedOPRList}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </OrgLinkContext.Provider>
  )
}

// Add Org Group Button
const AddOrgGroupButton = () => {
  const { addOrgMasterContent, orgMaster } = useOrgLink()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { branding } = useGlobal()
  const { brandColor } = branding

  return (
    <div>
      <Button
        className='rounded-md px-[0.5vw] py-[0.5vh] outline-none'
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusIcon fill={isLightColor(brandColor)} height='.9vw' width='.9vw' />
      </Button>
      <Modal
        className='w-[500px] lg:min-w-[500px]'
        onClose={() => setIsAddModalOpen(false)}
        open={isAddModalOpen}
        closeOnOverlayClick
        showCloseButton={false}
      >
        <AddGroupLevelModal
          close={() => setIsAddModalOpen(false)}
          path={`${orgMaster.length}`}
          addFunction={addOrgMasterContent}
          parentCode=''
          modalTitle='Add Organization Group'
          modalSubText='Create a new organization group.'
          resourceField='organization group'
        />
      </Modal>
    </div>
  )
}

// LEFT PANEL COMPONENTS
const LeftPanelOrgGroup = ({
  orgGrp,
  orgGrpIndex,
  srcOrgIds
}: {
  orgGrp: any
  orgGrpIndex: number
  srcOrgIds: Array<string>
}) => {
  const {
    collapsedItems,
    toggleDropdown,
    addOrgMasterContent,
    editOrgMasterContent,
    deleteOrgMasterContent,
    setOrgMaster,
    orgMaster,
    dragTypeRef
  } = useOrgLink()
  const isOpen = !collapsedItems[orgGrp.orgGrpId]
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { branding } = useGlobal()
  const { isDark } = useTheme()
  const { brandColor } = branding
  const toast = useInfoMsg()
  const popoverButtonElement = useRef(null)

  const handleDragStart = (e: React.DragEvent) => {
    dragTypeRef.current = 'orgGrp'
    e.dataTransfer.setData('type', 'orgGrp')
    e.dataTransfer.setData('data', JSON.stringify(orgGrp))
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        backgroundColor: hexWithOpacity(brandColor, 0.1)
      }}
      className='flex w-full cursor-grab flex-col gap-[1vh] rounded-lg px-[1vw] py-[1.5vh] active:cursor-grabbing'
    >
      <div className='flex items-center justify-between'>
        <div
          onClick={() => toggleDropdown(orgGrp.orgGrpId)}
          className='flex flex-1 items-center gap-[0.5vw]'
        >
          <span
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-[360deg]' : 'rotate-[270deg]'
            }`}
          >
            <DownArrow fill={isDark ? 'white' : 'black'} />
          </span>
          <FaRegFolderOpen color={isDark ? 'white' : 'black'} />
          <div>
            <Text contentAlign='left'>{orgGrp.orgGrpName}</Text>
          </div>
          <div>
            <Text contentAlign='left' color='secondary'>
              ({orgGrp.orgGrpCode})
            </Text>
          </div>
        </div>

        {/* Three Dots Menu */}
        <div>
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
            className='w-[12vw]'
            placement='left'
          >
            <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  e.stopPropagation()
                  setIsPopoverOpen(false)
                  setTimeout(() => setIsAddModalOpen(true), 100)
                }}
              >
                <PlusIcon
                  height='.8vw'
                  width='.8vw'
                  fill={isDark ? 'white' : 'black'}
                />
                Add Organization
              </div>
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  if (srcOrgIds.includes(orgGrp.orgGrpId)) {
                    toast(
                      'Organization group is linked with matrix and cannot be edited',
                      'warning'
                    )
                    return
                  }
                  e.stopPropagation()
                  setIsPopoverOpen(false)
                  setTimeout(() => setIsEditModalOpen(true), 100)
                }}
              >
                <EditIcon
                  fill={isDark ? 'white' : 'black'}
                  height='.8vw'
                  width='.8vw'
                />
                Edit Group
              </div>
              <div
                className='flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
                onClick={e => {
                  if (srcOrgIds.includes(orgGrp.orgGrpId)) {
                    toast(
                      'Organization group is linked with matrix and cannot be deleted',
                      'warning'
                    )
                    return
                  }
                  e.stopPropagation()
                  setIsPopoverOpen(false)
                  setOrgMaster((prev: any) =>
                    prev.filter((_: any, idx: number) => idx !== orgGrpIndex)
                  )
                  toast('Organization group deleted', 'success')
                }}
              >
                <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
                Delete
              </div>
            </div>
          </Popup>
        </div>

        {/* Add Modal */}
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
            path={`${orgGrpIndex}.org`}
            addFunction={addOrgMasterContent}
            parentCode={`${orgGrp.orgGrpCode}-`}
            modalTitle='Add Organization'
            modalSubText='Create a new organization in this group.'
            resourceField='organization'
          />
        </Modal>

        {/* Edit Modal */}
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
            path={`${orgGrpIndex}`}
            addFunction={editOrgMasterContent}
            parentCode=''
            modalTitle='Edit Organization Group'
            modalSubText='Update organization group name.'
            resourceField='organization group'
            resource={{
              code: orgGrp.orgGrpCode,
              name: orgGrp.orgGrpName
            }}
          />
        </Modal>
      </div>

      {isOpen && (
        <div className='flex flex-col gap-[0.5vh] px-[0.5vw]'>
          {(orgGrp.org || []).map((org: any, orgIndex: number) => (
            <LeftPanelOrg
              key={orgIndex}
              org={org}
              orgIndex={orgIndex}
              orgGrpIndex={orgGrpIndex}
              orgGrp={orgGrp}
              srcOrgIds={srcOrgIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const LeftPanelOrg = ({
  org,
  orgIndex,
  orgGrpIndex,
  orgGrp,
  srcOrgIds
}: {
  org: any
  orgIndex: number
  orgGrpIndex: number
  orgGrp: any
  srcOrgIds: Array<string>
}) => {
  const { editOrgMasterContent, deleteOrgMasterContent, dragTypeRef } =
    useOrgLink()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { branding } = useGlobal()
  const { isDark, bgColor, borderColor } = useTheme()
  const { brandColor } = branding
  const popoverButtonElement = useRef(null)
  const toast = useInfoMsg()

  const handleDragStart = (e: React.DragEvent) => {
    dragTypeRef.current = 'org'
    e.stopPropagation()
    e.dataTransfer.setData('type', 'org')
    e.dataTransfer.setData(
      'data',
      JSON.stringify({
        ...org,
        orgGrpCode: orgGrp.orgGrpCode,
        orgGrpName: orgGrp.orgGrpName,
        orgGrpId: orgGrp.orgGrpId
      })
    )
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={twMerge(
        'group flex cursor-grab items-center justify-between gap-[0.5vw] rounded-lg border px-[0.5vw] py-[1vh] hover:border-[var(--brand-color)] active:cursor-grabbing',
        bgColor,
        borderColor
      )}
    >
      <div className='flex items-center gap-[0.5vw]'>
        <SixDotsSvg fill={isDark ? 'white' : 'black'} />
        <LuBuilding2 className='h-[1.2vw] w-[1.5vw]' />
        <div className='flex flex-col'>
          <div>
            <Text contentAlign='left'>{org.orgName}</Text>
          </div>
          <div>
            <Text contentAlign='left' color='secondary'>
              {org.orgCode}
            </Text>
          </div>
        </div>
      </div>

      {/* Three Dots Menu */}
      <div className='p-[0.2vw] opacity-0 outline-none transition-opacity group-hover:opacity-100'>
        <Button
          onClick={() => setIsPopoverOpen(prev => !prev)}
          ref={popoverButtonElement}
          className='flex items-center rounded p-[0.3vw] outline-none'
        >
          <ThreeDots fill={isLightColor(brandColor)} />
        </Button>
        <Popup
          anchorRef={popoverButtonElement}
          open={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          className='w-[12vw]'
          placement='left'
        >
          <div className='flex flex-col gap-[0.58vh] px-[0.46vw] py-[0.58vh]'>
            <div
              className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
              onClick={e => {
                if (srcOrgIds.includes(orgGrp.orgGrpId)) {
                  toast(
                    'Organization group is linked with matrix and cannot be edited',
                    'warning'
                  )
                  return
                }
                e.stopPropagation()
                setIsPopoverOpen(false)
                setTimeout(() => setIsEditModalOpen(true), 100)
              }}
            >
              <EditIcon
                height='.8vw'
                width='.8vw'
                fill={isDark ? 'white' : 'black'}
              />
              Edit Organization
            </div>
            <div
              className='hover:bg-torus-bg-hover flex cursor-pointer items-center gap-[0.5vw] rounded p-[0.29vw] leading-[2.22vh] outline-none'
              onClick={e => {
                if (srcOrgIds.includes(org.orgId)) {
                  toast(
                    'Organization is linked with matrix and cannot be deleted',
                    'warning'
                  )
                  return
                }
                e.stopPropagation()
                setIsPopoverOpen(false)
                deleteOrgMasterContent(`${orgGrpIndex}.org`, orgIndex)
                toast('Organization deleted', 'success')
              }}
            >
              <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
              Delete
            </div>
          </div>
        </Popup>
      </div>

      {/* Edit Modal */}
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
          path={`${orgGrpIndex}.org.${orgIndex}`}
          addFunction={editOrgMasterContent}
          parentCode={`${orgGrp.orgGrpCode}-`}
          modalTitle='Edit Organization'
          modalSubText='Update organization name.'
          resourceField='organization'
          resource={{
            code: org.orgCode,
            name: org.orgName
          }}
        />
      </Modal>
    </div>
  )
}

// RIGHT PANEL COMPONENTS
const RightPanelOrgGroup = ({
  orgGrp,
  orgGrpIndex,
  assignedOPRList
}: {
  orgGrp: any
  orgGrpIndex: number
  assignedOPRList: Array<string>
}) => {
  const {
    collapsedItems,
    toggleDropdown,
    handleDrop,
    handleRemoveFromLink,
    dragTypeRef
  } = useOrgLink()
  const isOpen = !collapsedItems[`linked-${orgGrp.orgGrpId}`]
  const { branding } = useGlobal()
  const { isDark, borderColor } = useTheme()
  const { brandColor } = branding
  const toast = useInfoMsg()

  const handleDropOnOrgGroup = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const type = e.dataTransfer.getData('type')
    const data = JSON.parse(e.dataTransfer.getData('data'))

    if (type === 'org') {
      handleDrop(`${orgGrpIndex}.org`, data, 'org')
    }
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        if (dragTypeRef.current === 'org') {
          e.currentTarget.style.borderColor = brandColor
        }
        e.stopPropagation()
      }}
      onDrop={e => {
        handleDropOnOrgGroup(e)
        e.currentTarget.style.borderColor = ''
      }}
      onDragLeave={e => (e.currentTarget.style.borderColor = '')}
      style={{
        backgroundColor: hexWithOpacity(brandColor, 0.1)
      }}
      className={twMerge(
        'flex w-full flex-col gap-[1vh] rounded-lg border px-[1vw] py-[1.5vh]',
        borderColor
      )}
    >
      <div
        onClick={() => toggleDropdown(`linked-${orgGrp.orgGrpId}`)}
        className='group flex items-center justify-between'
      >
        <div className='flex items-center gap-[0.5vw]'>
          <span
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-[360deg]' : 'rotate-[270deg]'
            }`}
          >
            <DownArrow fill={isDark ? 'white' : 'black'} />
          </span>
          <FaRegFolderOpen color={isDark ? 'white' : 'black'} />
          <div>
            <Text contentAlign='left' className='font-semibold'>{orgGrp.orgGrpName}</Text>
          </div>
          <div>
            <Text contentAlign='left' color='secondary'>
              ({orgGrp.orgGrpCode})
            </Text>
          </div>
        </div>

        <button
          onClick={() => {
            if (assignedOPRList.includes(orgGrp.orgGrpId)) {
              toast(
                'Organization Group is assigned with a Template and cannot be deleted',
                'warning'
              )
              return
            }
            handleRemoveFromLink(`${orgGrpIndex}`)
          }}
          className='rounded p-[0.3vw] opacity-0 hover:bg-red-500/20 group-hover:opacity-100 '
        >
          <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
        </button>
      </div>

      {isOpen && (
        <div className='flex flex-col gap-[0.5vh] px-[0.2vw]'>
          {(orgGrp.org || []).map((org: any, orgIndex: number) => (
            <RightPanelOrg
              key={orgIndex}
              org={org}
              orgIndex={orgIndex}
              parentPath={`${orgGrpIndex}.org`}
              assignedOPRList={assignedOPRList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const RightPanelOrg = ({
  org,
  orgIndex,
  parentPath,
  assignedOPRList
}: {
  org: any
  orgIndex: number
  parentPath: string
  assignedOPRList: Array<string>
}) => {
  const { collapsedItems, toggleDropdown, handleRemoveFromLink, dragTypeRef } =
    useOrgLink()
  const toast = useInfoMsg()
  const { orgGrpData: linkedOrgData, setOrgGrpData: setLinkedOrgData } =
    React.useContext(SetupScreenContext) as SetupScreenContextType
  const isOpen = !collapsedItems[`linked-${org.orgId}`]
  const hasSubOrgs = org.subOrgGrp && org.subOrgGrp.length > 0
  const orgPath = `${parentPath}.${orgIndex}`
  const { branding } = useGlobal()
  const { borderColor, bgColor } = useTheme()
  const { brandColor } = branding

  const handleDropOnOrg = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const type = e.dataTransfer.getData('type')
    const data = JSON.parse(e.dataTransfer.getData('data'))

    if (type === 'org') {
      // Create sub-org group when org is dropped into another org
      const subOrgGrpPath = `${orgPath}.subOrgGrp`
      const existingSubOrgGrps = _.get(linkedOrgData, subOrgGrpPath) || []

      if (existingSubOrgGrps.length === 0) {
        // Create first sub-org group
        const newSubOrgGrp = {
          subOrgGrpCode: data.orgGrpCode,
          subOrgGrpName: data.orgGrpName,
          srcId: data.orgGrpId,
          subOrgGrpId: uuidv4(),
          subOrg: [
            {
              subOrgCode: data.orgCode,
              subOrgName: data.orgName,
              srcId: data.orgId,
              subOrgId: uuidv4(),
              psGrp: data.psGrp || []
            }
          ]
        }

        const updatedLinkedData = structuredClone(linkedOrgData)
        _.set(updatedLinkedData, subOrgGrpPath, [newSubOrgGrp])
        setLinkedOrgData(updatedLinkedData)
      } else {
        const isGroupExist = existingSubOrgGrps.find(
          (so: any) => so.subOrgGrpCode === data.orgGrpCode
        )

        if (isGroupExist) {
          const subGrpIndex = existingSubOrgGrps.findIndex(
            (so: any) => so.subOrgGrpCode === data.orgGrpCode
          )

          // Add to first existing sub-org group
          const checkExist = existingSubOrgGrps[subGrpIndex].subOrg.find(
            (so: any) => so.subOrgCode === data.orgCode
          )

          if (checkExist) {
            toast('Sub-organization with same code already exists', 'warning')
            return
          }

          const newSubOrg = {
            subOrgCode: data.orgCode,
            subOrgName: data.orgName,
            srcId: data.orgId,
            subOrgId: uuidv4(),
            psGrp: data.psGrp || []
          }

          const updatedLinkedData = structuredClone(linkedOrgData)
          const currentSubOrgGrps = _.get(updatedLinkedData, subOrgGrpPath)
          currentSubOrgGrps[subGrpIndex].subOrg.push(newSubOrg)
          setLinkedOrgData(updatedLinkedData)
        } else {
          const newSubOrgGrp = {
            subOrgGrpCode: data.orgGrpCode,
            subOrgGrpName: data.orgGrpName,
            srcId: data.orgGrpId,
            subOrgGrpId: uuidv4(),
            subOrg: [
              {
                subOrgCode: data.orgCode,
                subOrgName: data.orgName,
                srcId: data.orgId,
                subOrgId: uuidv4(),
                psGrp: data.psGrp || []
              }
            ]
          }

          const updatedLinkedData = structuredClone(linkedOrgData)
          const prevSubOrgGrps = _.get(updatedLinkedData, subOrgGrpPath)
          _.set(updatedLinkedData, subOrgGrpPath, [
            ...prevSubOrgGrps,
            newSubOrgGrp
          ])
          setLinkedOrgData(updatedLinkedData)
        }
      }

      toast('Organization converted to sub-organization', 'success')
    } else if (type === 'orgGrp') {
      // Create sub-org group when org is dropped into another org
      const subOrgGrpPath = `${orgPath}.subOrgGrp`
      const existingSubOrgGrps = _.get(linkedOrgData, subOrgGrpPath) || []

      if (existingSubOrgGrps.length === 0) {
        // Create first sub-org group
        const newSubOrgGrp = {
          subOrgGrpCode: data.orgGrpCode,
          subOrgGrpName: data.orgGrpName,
          srcId: data.orgGrpId,
          subOrgGrpId: uuidv4(),
          subOrg:
            data.org && Array.isArray(data.org)
              ? data.org.map((org: any) => ({
                  subOrgCode: org.orgCode,
                  subOrgName: org.orgName,
                  srcId: org.orgId,
                  subOrgId: uuidv4(),
                  psGrp: org.psGrp || []
                }))
              : []
        }

        const updatedLinkedData = structuredClone(linkedOrgData)
        _.set(updatedLinkedData, subOrgGrpPath, [newSubOrgGrp])
        setLinkedOrgData(updatedLinkedData)
      } else {
        const isGroupExist = existingSubOrgGrps.find(
          (so: any) => so.subOrgGrpCode === data.orgGrpCode
        )

        if (isGroupExist) {
          toast(
            'Sub-organization group with same code already exists',
            'warning'
          )
          return
        }
        const newSubOrgGrp = {
          subOrgGrpCode: data.orgGrpCode,
          subOrgGrpName: data.orgGrpName,
          srcId: data.orgGrpId,
          subOrgGrpId: uuidv4(),
          subOrg:
            data.org && Array.isArray(data.org)
              ? data.org.map((org: any) => ({
                  subOrgCode: org.orgCode,
                  subOrgName: org.orgName,
                  srcId: org.orgId,
                  subOrgId: uuidv4(),
                  psGrp: org.psGrp || []
                }))
              : []
        }

        const updatedLinkedData = structuredClone(linkedOrgData)
        _.set(updatedLinkedData, subOrgGrpPath, [
          ...existingSubOrgGrps,
          newSubOrgGrp
        ])
        setLinkedOrgData(updatedLinkedData)
      }
    }
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        e.currentTarget.style.borderColor = brandColor
        e.stopPropagation()
      }}
      onDragLeave={e => (e.currentTarget.style.borderColor = '')}
      onDrop={e => {
        handleDropOnOrg(e)
        e.currentTarget.style.borderColor = ''
      }}
      className={twMerge(
        'flex flex-col gap-[0.5vh] rounded-lg border pb-[1vh]',
        bgColor,
        borderColor
      )}
    >
      <div
        className={
          'bg-torus-bg group flex items-center justify-between px-[0.5vw] py-[1vh]'
        }
      >
        <div className='flex flex-1 items-center gap-[0.5vw]'>
          <LuBuilding2 className='h-[1.2vw] w-[1.5vw]' />
          <div className='flex flex-col'>
            <div>
              <Text contentAlign='left' className='font-semibold'>{org.orgName}</Text>
            </div>
            <div>
              <Text contentAlign='left' color='secondary'>
                {org.orgCode}
              </Text>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (assignedOPRList.includes(org.orgId)) {
              toast(
                'Organization is assigned with a Template and cannot be deleted',
                'warning'
              )
              return
            }
            handleRemoveFromLink(`${parentPath}.${orgIndex}`)
          }}
          className='rounded p-[0.3vw] opacity-0 hover:bg-red-500/20 group-hover:opacity-100'
        >
          <DeleteIcon fill='#EF4444' height='.8vw' width='.8vw' />
        </button>
      </div>

      {isOpen && hasSubOrgs && (
        <div className='flex flex-col gap-[0.5vh] px-[0.5vw]'>
          {org.subOrgGrp.map((subOrgGrp: any, subOrgGrpIndex: number) => (
            <RightPanelSubOrgGroup
              key={subOrgGrpIndex}
              subOrgGrp={subOrgGrp}
              subOrgGrpIndex={subOrgGrpIndex}
              parentPath={`${orgPath}.subOrgGrp`}
              assignedOPRList={assignedOPRList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const RightPanelSubOrgGroup = ({
  subOrgGrp,
  subOrgGrpIndex,
  parentPath,
  assignedOPRList
}: {
  subOrgGrp: any
  subOrgGrpIndex: number
  parentPath: string
  assignedOPRList: Array<string>
}) => {
  const { collapsedItems, toggleDropdown, handleRemoveFromLink, dragTypeRef } =
    useOrgLink()
  const { orgGrpData: linkedOrgData, setOrgGrpData: setLinkedOrgData } =
    React.useContext(SetupScreenContext) as SetupScreenContextType
  const { branding } = useGlobal()
  const { isDark, borderColor } = useTheme()
  const { brandColor } = branding
  const toast = useInfoMsg()
  const isOpen = !collapsedItems[`linked-${subOrgGrp.subOrgGrpId}`]

  const handleDropSubOrg = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const type = e.dataTransfer.getData('type')
    const data = JSON.parse(e.dataTransfer.getData('data'))

    if (type === 'org') {
      const checkExist = subOrgGrp.subOrg.find(
        (so: any) => so.subOrgCode === data.orgCode
      )
      if (checkExist) {
        toast('Organization already exists in this group', 'warning')
        return
      }

      const newSubOrg = {
        subOrgName: data.orgName,
        subOrgCode: data.orgCode,
        subOrgId: data.orgId
      }

      const existingSubOrgs = subOrgGrp.subOrg || []
      const updatedLinkedData = structuredClone(linkedOrgData)
      _.set(updatedLinkedData, `${parentPath}.${subOrgGrpIndex}.subOrg`, [
        ...existingSubOrgs,
        newSubOrg
      ])
      setLinkedOrgData(updatedLinkedData)
    }
  }

  return (
    <div
      style={{
        backgroundColor: hexWithOpacity(brandColor, 0.1)
      }}
      onDragOver={e => {
        e.preventDefault()
        if (dragTypeRef.current === 'org') {
          e.currentTarget.style.borderColor = brandColor
        }
        e.stopPropagation()
      }}
      onDragLeave={e => (e.currentTarget.style.borderColor = '')}
      onDrop={e => {
        handleDropSubOrg(e)
        e.currentTarget.style.borderColor = ''
      }}
      className={twMerge(
        'flex flex-col gap-[0.5vh] rounded-lg border px-[0.5vw] py-[0.5vh]',
        borderColor
      )}
    >
      <div
        onClick={() => toggleDropdown(`linked-${subOrgGrp.subOrgGrpId}`)}
        className='group flex items-center justify-between'
      >
        <div className='flex items-center gap-[0.5vw]'>
          <span
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-[360deg]' : 'rotate-[270deg]'
            }`}
          >
            <DownArrow fill={isDark ? 'white' : 'black'} />
          </span>
          <FaRegFolderOpen color={isDark ? 'white' : 'black'} size='0.7vw' />
          <span className='font-medium'>{subOrgGrp.subOrgGrpName}</span>
        </div>

        <button
          onClick={() => {
            if (assignedOPRList.includes(subOrgGrp.subOrgGrpId)) {
              toast(
                'Organization Group is assigned with a Template and cannot be deleted',
                'warning'
              )
              return
            }
            handleRemoveFromLink(`${parentPath}.${subOrgGrpIndex}`)
          }}
          className='rounded p-[0.2vw] opacity-0 hover:bg-red-500/20 group-hover:opacity-100'
        >
          <DeleteIcon fill='#EF4444' height='.7vw' width='.7vw' />
        </button>
      </div>

      {isOpen && (
        <div className='ml-[1vw] flex flex-col gap-[0.5vh] pb-[1vh]'>
          {(subOrgGrp.subOrg || []).map((subOrg: any, subOrgIndex: number) => (
            <RightPanelSubOrg
              key={subOrgIndex}
              subOrg={subOrg}
              subOrgIndex={subOrgIndex}
              parentPath={`${parentPath}.${subOrgGrpIndex}.subOrg`}
              assignedOPRList={assignedOPRList}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const RightPanelSubOrg = ({
  subOrg,
  subOrgIndex,
  parentPath,
  assignedOPRList
}: {
  subOrg: any
  subOrgIndex: number
  parentPath: string
  assignedOPRList: Array<string>
}) => {
  const { handleRemoveFromLink } = useOrgLink()
  const toast = useInfoMsg()
  const { branding } = useGlobal()
  const { borderColor, bgColor } = useTheme()
  const { brandColor } = branding

  return (
    <div
      className={twMerge(
        'group flex items-center justify-between rounded border px-[0.5vw] py-[0.5vh]',
        bgColor,
        borderColor
      )}
    >
      <div className='flex items-center gap-[0.5vw]'>
        <LuBuilding2 className='h-[1.2vw] w-[1.5vw]' />
        <div className='flex flex-col'>
          <div>
            <Text contentAlign='left'>{subOrg.subOrgName}</Text>
          </div>
          <div>
            <Text contentAlign='left' color='secondary'>
              {subOrg.subOrgCode}
            </Text>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (assignedOPRList.includes(subOrg.subOrgId)) {
            toast(
              'Organization is assigned with a Template and cannot be deleted',
              'warning'
            )
            return
          }
          handleRemoveFromLink(`${parentPath}.${subOrgIndex}`)
        }}
        className='rounded p-[0.2vw] opacity-0 hover:bg-red-500/20 group-hover:opacity-100'
      >
        <DeleteIcon fill='#EF4444' height='.7vw' width='.7vw' />
      </button>
    </div>
  )
}

export default OrganizationLink

function useOrgLink() {
  const context = React.useContext(OrgLinkContext)
  if (!context) {
    throw new Error('useOrgLink must be used within OrgLinkContext')
  }
  return context
}
