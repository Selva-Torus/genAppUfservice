import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  DeleteIcon,
  DownArrow,
  PlusIcon,
  SixDotsSvg,
  UpArrow
} from '../components/svgApplication'
import _ from 'lodash'
import { findPath } from '../components/utils'
// import { Pagination } from "../torusComponents/torusTable";
import { SetupScreenContext, SetupScreenContextType } from './setup'
import { isLightColor } from '@/app/components/utils'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { Pagination, Popup, TextInput } from '@gravity-ui/uikit'
import { TotalContext, TotalContextProps } from '@/app/globalContext'

type ProductService = {
  psCode: string
  psName: string
}

type ProductServiceGroup = {
  psGrpCode: string
  psGrpName: string
  ps: ProductService[]
}

type Role = {
  roleCode: string
  roleName: string
  psGrp: ProductServiceGroup[]
}

type RoleGroup = {
  roleGrpName: string
  roleGrpCode: string
  roles: Role[]
}

type Organization = {
  orgCode: string
  orgName: string
  roleGrp: RoleGroup[]
}

type OrganizationGroup = {
  orgGrpName: string
  orgGrpCode: string
  org: Organization[]
}

interface OrgMatrixProps {
  data: OrganizationGroup[]
  setData: React.Dispatch<React.SetStateAction<OrganizationGroup[]>>
  focusedPath: null | string
  setFocusedPath: React.Dispatch<React.SetStateAction<null | string>>
  groupsPerPage?: number
  psList: Set<string>
}

interface OrgMatrixContextType {
  isInput: null | string
  setIsInput: React.Dispatch<React.SetStateAction<null | string>>
  focusedPath: null | string
  setFocusedPath: React.Dispatch<React.SetStateAction<null | string>>
  updateData: (path: string, value: any) => void
  deleteItems: (path: string, isCalledfromNav?: boolean) => void
  getDataFromSrcObj: (path: string) => any
  psList: Set<string>
  currentPage: number
}

export const OrgMatrixContext =
  React.createContext<OrgMatrixContextType | null>(null)

const orpMatrixTemplate = [
  {
    orgGrpName: '',
    orgGrpCode: '',
    org: [
      {
        orgCode: '',
        orgName: '',
        roleGrp: [
          {
            roleGrpName: '',
            roleGrpCode: '',
            roles: [
              {
                roleCode: '',
                roleName: '',
                psGrp: [
                  {
                    psGrpCode: '',
                    psGrpName: '',
                    ps: [
                      {
                        psCode: '',
                        psName: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

const RenderMembers = ({
  code,
  name,
  keyOfName,
  expanded,
  setExpanded,
  path,
  chilldArrayKeyName,
  parentCode
}: {
  code: string
  name: string
  keyOfName: string
  expanded?: boolean
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>
  path: string
  chilldArrayKeyName?: string
  parentCode: string
}) => {
  const toast = useInfoMsg()
  const { property, setProperty } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'
  const {
    isInput,
    setIsInput,
    focusedPath,
    setFocusedPath,
    updateData,
    deleteItems,
    getDataFromSrcObj,
    psList,
    currentPage
  } = React.useContext(OrgMatrixContext) as OrgMatrixContextType

  const updatedParentCode = parentCode ? `${parentCode}-` : ''
  const isFocused = focusedPath == `${path}.${chilldArrayKeyName}`
  const buttonElement = useRef(null)
  const [open, setOpen] = useState(false)
  const isNonDeletable = useMemo(() => {
    let deletable = false
    psList.forEach(item => {
      //x-y-z-a-b-c
      if (code && item.includes(code)) {
        //item = x-y-z-a-b-c , code = x-y-z
        deletable = true
      }
    })
    return deletable
  }, [psList, currentPage])

  const transformObj = (
    obj: Record<string, any>,
    oldParentCode: string,
    newParentCode: string
  ): Record<string, any> => {
    const newObj: Record<string, any> = {}

    for (const key in obj) {
      if (
        typeof obj[key] === 'string' &&
        obj[key].toLowerCase().includes('code')
      ) {
        // Replace the string values containing oldParentCode with newParentCode
        newObj[key] = obj[key].replace(oldParentCode, newParentCode)
      } else if (Array.isArray(obj[key])) {
        // If the value is an array, map over it and transform each element
        newObj[key] = obj[key].map((item: any) =>
          transformObj(item, oldParentCode, newParentCode)
        )
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // If the value is an object, recursively transform it
        newObj[key] = transformObj(obj[key], oldParentCode, newParentCode)
      } else {
        // For other data types, copy as is
        newObj[key] = obj[key]
      }
    }
    return newObj
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const pathOfSrcNode = e.dataTransfer.getData('pathOfSrcNode')
    const parentCodeOfSrcNode = e.dataTransfer.getData('parentCodeOfSrcNode')
    const pathOfTargetNode = `${path}.${chilldArrayKeyName}`
    const parentPathOfSrcNode = pathOfSrcNode.split('.').slice(0, -1).join('.')
    const indexToModify = parseInt(
      pathOfSrcNode.split('.')[pathOfSrcNode.split('.').length - 1]
    )
    const lengthOfPathOfSrcNode = pathOfSrcNode.split('.').length
    const lengthOfPathOfTargetNode = pathOfTargetNode.split('.').length

    if (lengthOfPathOfSrcNode !== lengthOfPathOfTargetNode + 1 || !code) {
      return toast("Can't drop here", 'warning')
    }

    const dataToBeMoved = getDataFromSrcObj(pathOfSrcNode)
    const destinationData = getDataFromSrcObj(pathOfTargetNode)
    const parentOfSrcNode = getDataFromSrcObj(parentPathOfSrcNode)
    const convertedSrcObj = transformObj(
      dataToBeMoved,
      parentCodeOfSrcNode,
      `${code}-`
    )
    parentOfSrcNode.splice(indexToModify, 1)
    destinationData.push(convertedSrcObj)
    updateData(pathOfTargetNode, destinationData)
    updateData(parentPathOfSrcNode, parentOfSrcNode)
  }

  const handleSetRestrictionBasedOnParentCode = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!parentCode && keyOfName !== 'orgGrpName') {
      e.target.value = ''
      toast('Please Enter Parent Code', 'warning')
    }
  }

  return (
    <div
      draggable={!isNonDeletable}
      className={`group relative mr-1 flex w-full flex-[0_0_18%] cursor-pointer items-center rounded border p-[0.58vw]`}
      style={{
        backgroundColor: keyOfName == 'orgName' ? 'transparent' : '#F4F5FA',
        color: '#000000',
        width: `${
          keyOfName === 'orgName'
            ? '12vw'
            : keyOfName === 'roleGrpName'
              ? '11vw'
              : keyOfName === 'roleName'
                ? '10.5vw'
                : keyOfName === 'psGrpName'
                  ? '10vw'
                  : '9.4vw'
        }`,
        borderColor: isFocused
          ? brandcolor
          : keyOfName == 'orgName'
            ? 'transparent'
            : '#00000059',
        margin:
          expanded && keyOfName === 'orgName'
            ? '0.3vw 0.3vw 0.6vw'
            : '0.2vw 0.2vw 0.3vw 0.2vw'
      }}
      onContextMenu={e => {
        e.preventDefault()
      }}
      onDragOver={e => e.preventDefault()}
      onDragStart={e => {
        if (isNonDeletable) return
        e.dataTransfer.setData('pathOfSrcNode', `${path}`)
        e.dataTransfer.setData('parentCodeOfSrcNode', updatedParentCode)
      }}
      onDrop={e => {
        handleDrop(e)
      }}
      onClick={() =>
        keyOfName != 'psName' && setFocusedPath(`${path}.${chilldArrayKeyName}`)
      }
    >
      <span>
        <SixDotsSvg fill={'#000000'} />
      </span>
      {
        <span
          className={`flex flex-col leading-[2.22vh]`}
          style={{
            fontSize: `0.83vw`,
            width: `${
              keyOfName === 'orgName'
                ? '8vw'
                : keyOfName === 'roleGrpName'
                  ? '6.5vw'
                  : keyOfName === 'roleName'
                    ? '6vw'
                    : keyOfName === 'psGrpName'
                      ? '5.5vw'
                      : keyOfName === 'psName'
                        ? '6vw'
                        : '8vw'
            }`
          }}
          onDoubleClick={e => {
            e.stopPropagation()
            setIsInput(`${path}.${keyOfName}`)
          }}
        >
          {isInput == `${path}.${keyOfName}` || !name ? (
            <input
              className={`bg-transparent outline-none`}
              defaultValue={name}
              placeholder={`Enter ${keyOfName}`}
              onChange={handleSetRestrictionBasedOnParentCode}
              onBlur={e => {
                updateData(`${path}.${keyOfName}`, e.target.value)
                setIsInput(null)
              }}
              onKeyDown={(e: any) => {
                if (e.key === 'Escape') {
                  setIsInput(null)
                } else if (e.key === 'Enter') {
                  updateData(`${path}.${keyOfName}`, e.target.value)
                  setIsInput(null)
                }
              }}
            />
          ) : (
            <span className='w-full truncate'>{name}</span>
          )}
          {code.replace(updatedParentCode, '') ? (
            <span className='w-full truncate text-[0.63vw]'>
              {code.replace(updatedParentCode, '')}
            </span>
          ) : (
            <input
              className={`bg-transparent outline-none`}
              defaultValue={code.replace(updatedParentCode, '')}
              placeholder={`Enter ${keyOfName.replace('Name', 'Code')}`}
              onChange={(e) => {handleSetRestrictionBasedOnParentCode(e);  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "")}}
              onBlur={e =>
                updateData(
                  `${path}.${keyOfName.replace('Name', 'Code')}`,
                  `${updatedParentCode}${e.target.value}`
                )
              }
              onKeyDown={(e: any) =>
                e.key === 'Enter'
                  ? updateData(
                      `${path}.${keyOfName.replace('Name', 'Code')}`,
                      `${updatedParentCode}${e.target.value}`
                    )
                  : null
              }
            />
          )}
        </span>
      }
      {isNonDeletable ? (
        <>
          <button
            ref={buttonElement as any}
            onClick={() => setOpen(prevOpen => !prevOpen)}
            className='ml-auto mr-[0.29vw] flex h-full items-center justify-center opacity-0 transition-opacity focus:outline-none group-hover:opacity-100'
          >
            <DeleteIcon fill='#EF4444' />
          </button>
          <Popup
            onClose={() => setOpen(false)}
            anchorRef={buttonElement}
            open={open}
            placement='bottom'
          >
            <div className='flex flex-col gap-[0.58vw] px-[1.46vw] py-[0.58vw]'>
              <p
                style={{ fontSize: `0.72vw` }}
                className='w-[10vw] text-wrap font-medium leading-[2.22vh]'
              >
                Selected {keyOfName} cannot be deleted as it assigned with some
                template , please try deleting after deleting the template
              </p>
            </div>
          </Popup>
        </>
      ) : keyOfName == 'orgGrpName' ? (
        <>
          <button
            ref={buttonElement as any}
            onClick={() => setOpen(prevOpen => !prevOpen)}
            className='ml-auto mr-[0.29vw] flex h-full items-center justify-center opacity-0 transition-opacity focus:outline-none group-hover:opacity-100'
          >
            <DeleteIcon fill='#EF4444' />
          </button>
          <Popup
            onClose={() => setOpen(false)}
            anchorRef={buttonElement}
            open={open}
            placement='bottom'
          >
            <div className='flex flex-col gap-[0.58vw] px-[1.46vw] py-[0.58vw]'>
              <p
                style={{ fontSize: `0.72vw` }}
                className='w-[10vw] text-wrap font-medium leading-[2.22vh]'
              >
                Are you sure, you want to delete this Organisation?
              </p>
              <button
                onClick={() => {
                  deleteItems(
                    path,
                    keyOfName == 'orgGrpName' ? true : undefined
                  )
                  setOpen(false)
                }}
                className={
                  'ml-auto rounded-md bg-[#EF4444] px-[0.58vw] py-[0.64vh] leading-[2.22vh] text-white outline-none'
                }
                style={{ fontSize: `0.72vw` }}
              >
                Delete
              </button>
            </div>
          </Popup>
        </>
      ) : (
        <button
          onClick={() => {
            deleteItems(path, keyOfName == 'orgGrpName' ? true : undefined)
          }}
          className='ml-auto mr-[0.29vw] flex h-full items-center justify-center opacity-0 transition-opacity focus:outline-none group-hover:opacity-100'
        >
          <DeleteIcon fill='#EF4444' />
        </button>
      )}
      {setExpanded && (
        <div
          className={`transition-all duration-300 ease-in-out focus:outline-none`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <UpArrow fill={'#000000'} />
          ) : (
            <DownArrow fill={'#000000'} />
          )}
        </div>
      )}
    </div>
  )
}

const RenderPSGrp = ({
  psGrpCode,
  psGrpName,
  ps,
  path,
  parentCode
}: ProductServiceGroup & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <RenderMembers
        code={psGrpCode}
        name={psGrpName}
        keyOfName='psGrpName'
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName='ps'
        parentCode={parentCode}
      />
      {/* <AnimatePresence> */}
      <div className='ml-2'>
        {expanded
          ? ps.map(({ psCode, psName }: any, index) => (
              <RenderMembers
                code={psCode}
                name={psName}
                keyOfName='psName'
                key={index}
                parentCode={psGrpCode}
                path={`${path}.ps.${index}`}
              />
            ))
          : null}
      </div>
      {/* </AnimatePresence> */}
    </div>
  )
}

const RenderRole = ({
  psGrp,
  roleCode,
  roleName,
  path,
  parentCode
}: Role & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <RenderMembers
        code={roleCode}
        name={roleName}
        keyOfName='roleName'
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName='psGrp'
        parentCode={parentCode}
      />
      {/* <AnimatePresence> */}
      <div className='ml-2 flex flex-col gap-[1vh]'>
        {expanded
          ? psGrp.map((psG: any, index: number) => (
              <RenderPSGrp
                ps={psG.ps}
                psGrpCode={psG.psGrpCode}
                psGrpName={psG.psGrpName}
                path={`${path}.psGrp.${index}`}
                parentCode={roleCode}
                key={index}
              />
            ))
          : null}
      </div>
      {/* </AnimatePresence> */}
    </div>
  )
}

const RenderRoleGroup = ({
  roleGrpCode,
  roleGrpName,
  roles,
  path,
  parentCode
}: RoleGroup & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <RenderMembers
        code={roleGrpCode}
        name={roleGrpName}
        keyOfName='roleGrpName'
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName='roles'
        parentCode={parentCode}
      />
      {/* <AnimatePresence> */}
      <div className='ml-2 flex flex-col gap-[1vh]'>
        {expanded
          ? roles.map((role: any, index: number) => (
              <RenderRole
                psGrp={role.psGrp}
                roleCode={role.roleCode}
                roleName={role.roleName}
                path={`${path}.roles.${index}`}
                parentCode={roleGrpCode}
                key={index}
              />
            ))
          : null}
      </div>
      {/* </AnimatePresence> */}
    </div>
  )
}

const RenderOrg = ({
  orgCode,
  orgName,
  roleGrp,
  path,
  parentCode
}: Organization & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      style={{
        color: '#000000',
        borderColor: '#00000026'
      }}
      className='flex justify-end'
    >
      <div
        style={{ borderColor: '#00000059' }}
        className='cursor-pointer rounded border pb-2'
      >
        <RenderMembers
          code={orgCode}
          name={orgName}
          keyOfName='orgName'
          path={path}
          expanded={expanded}
          setExpanded={setExpanded}
          chilldArrayKeyName='roleGrp'
          parentCode={parentCode}
        />
        {/* <AnimatePresence> */}
        <div className='ml-2 flex flex-col gap-[1vh]'>
          {expanded
            ? roleGrp.map((rGrp: any, index: number) => (
                <RenderRoleGroup
                  roleGrpCode={rGrp.roleGrpCode}
                  roleGrpName={rGrp.roleGrpName}
                  roles={rGrp.roles}
                  path={`${path}.roleGrp.${index}`}
                  parentCode={orgCode}
                  key={index}
                />
              ))
            : null}
        </div>
        {/* </AnimatePresence> */}
      </div>
    </div>
  )
}

const OrgMatrix = ({
  groupsPerPage = 5,
  tenantAccess
}: {
  groupsPerPage?: number
  tenantAccess?: 'view' | 'edit' | null | undefined
}) => {
  const {
    orgGrpData: data,
    setOrgGrpData: setData,
    focusedPath,
    setFocusedPath,
    psList,
    searchTerm
  } = React.useContext(SetupScreenContext) as SetupScreenContextType
  const headerSectionRef = useRef<HTMLDivElement>(null)
  const contentSectionRef = useRef<HTMLDivElement>(null)
  const { property, setProperty } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'
  const [isInput, setIsInput] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const toast = useInfoMsg()

  const filteredData = Object.entries(data)
    .filter(([key, value]) => {
      if (typeof value === 'string') {
        return (value as string)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      } else if (Array.isArray(value)) {
        return value.some(role => {
          return Object.values(role).some(val => {
            return (
              typeof val === 'string' &&
              val.toLowerCase().includes(searchTerm.toLowerCase())
            )
          })
        })
      } else {
        return Object.values(value as any).some(val => {
          if (typeof val === 'string') {
            return val.toLowerCase().includes(searchTerm.toLowerCase())
          } else if (Array.isArray(val)) {
            return val.some(role => {
              return Object.values(role).some(v => {
                return (
                  typeof v === 'string' &&
                  v.toLowerCase().includes(searchTerm.toLowerCase())
                )
              })
            })
          }
        })
      }
    })
    .map(([key, value], index) => ({ ...(value as any), originalIndex: key }))

  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * groupsPerPage
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup)
  }, [data, filteredData, currentPage, setData, searchTerm])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / groupsPerPage)
  }, [data, filteredData, currentPage, groupsPerPage])

  const updateOrgMatrixData = (path: string, value: any) => {
    const copyOfOrgMatrixData = structuredClone(data)
    if (path) {
      _.set(copyOfOrgMatrixData, path, value)
      setData(copyOfOrgMatrixData)
    }
  }

  const deleteItems = (path: string, isCalledfromNav?: boolean) => {
    const copyOfOrgMatrixData = structuredClone(data)
    if (isCalledfromNav) {
      const indexToDelete = parseInt(path)
      copyOfOrgMatrixData.splice(indexToDelete, 1)
      if (currentGroups.length == 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      }
      setData(copyOfOrgMatrixData)
    } else {
      const parentPath = path.split('.').slice(0, -1).join('.')
      const indexToDelete = parseInt(
        path.split('.')[path.split('.').length - 1]
      )
      const parentData: any = _.get(copyOfOrgMatrixData, parentPath)
      parentData.splice(indexToDelete, 1)
      updateOrgMatrixData(parentPath, parentData)
    }
  }

  const addTopLevelOrganization = () => {
    if (findPath(data, orpMatrixTemplate[0])) {
      toast('Already group created', 'warning')
    } else {
      if (currentGroups.length == groupsPerPage) {
        setCurrentPage(prev => prev + 1)
      }
      setData((prev: any) => [...prev, orpMatrixTemplate[0]])
    }
  }

  const handleAddValue = () => {
    if (focusedPath) {
      const pathInTemplate = focusedPath
        ?.split('.') // Split by dot
        .map(segment => (isNaN(Number(segment)) ? segment : '0')) // Replace numbers with "0"
        .join('.')
      const dataToAdd = _.get(orpMatrixTemplate, `${pathInTemplate}.0`)
      const focusedData = _.get(data, focusedPath)
      if (
        focusedData &&
        Array.isArray(focusedData) &&
        !findPath(focusedData, dataToAdd)
      ) {
        focusedData.push(dataToAdd)
        updateOrgMatrixData(focusedPath, focusedData)
      } else {
        toast('Already member created', 'warning')
      }
    }
  }

  const getDataFromSrcObj = (path: string) => {
    if (path) {
      return _.get(data, path)
    }
  }

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    target.scrollLeft = source.scrollLeft
  }

  useEffect(() => {
    const headerSection = headerSectionRef.current
    const contentSection = contentSectionRef.current

    if (headerSection && contentSection) {
      const handleHeaderScroll = () => syncScroll(headerSection, contentSection)
      const handleContentScroll = () =>
        syncScroll(contentSection, headerSection)

      headerSection.addEventListener('scroll', handleHeaderScroll)
      contentSection.addEventListener('scroll', handleContentScroll)

      return () => {
        headerSection.removeEventListener('scroll', handleHeaderScroll)
        contentSection.removeEventListener('scroll', handleContentScroll)
      }
    }
  }, [])

  return (
    <OrgMatrixContext.Provider
      value={{
        isInput,
        setIsInput,
        focusedPath,
        setFocusedPath,
        updateData: updateOrgMatrixData,
        deleteItems,
        getDataFromSrcObj,
        psList,
        currentPage
      }}
    >
      <div className='flex w-full items-center justify-between'>
        <h1
          style={{
            color: '#000000',
            fontSize: `1.25vw`
          }}
          className=' font-semibold leading-[1.04vw]'
        >
          {'Organization Matrix'}
        </h1>
        <button
          id='orpsAdditionBtnWithFocus'
          className={`hidden`}
          onClick={handleAddValue}
        >
          <PlusIcon fill='white' width={'1.04vw'} height={'1.04vw'} />
        </button>
      </div>
      <div
        className='mt-[2vh] flex items-center justify-between rounded-xl px-3'
        style={{
          backgroundColor: '#F4F5FA',
          color: '#000000',
          borderColor: '#00000026'
        }}
      >
        <div
          ref={headerSectionRef}
          className='scrollbar-hide flex w-full gap-[0.88vw] overflow-x-auto p-[0.29vw]'
        >
          {currentGroups.map((node: any, id: number) => (
            <RenderMembers
              code={node.orgGrpCode}
              name={node.orgGrpName}
              keyOfName='orgGrpName'
              path={`${node.originalIndex}`}
              chilldArrayKeyName='org'
              key={id}
              parentCode=''
            />
          ))}
        </div>
        <button
          className='mr-[0.29vw] flex items-center rounded px-[0.58vw] py-[1vh] focus:outline-none'
          onClick={addTopLevelOrganization}
          style={{
            borderColor: '#00000026',
            backgroundColor: brandcolor
          }}
          disabled={tenantAccess !== 'edit'}
        >
          <PlusIcon fill={isLightColor(brandcolor)} />
        </button>
      </div>
      <div
        ref={contentSectionRef}
        className={`scrollbar-thin mt-2 flex h-[70%] w-[95%] overflow-x-auto`}
      >
        {currentGroups.map((node: any, id: number) => (
          <div className='flex flex-[0_0_19.5%] flex-col gap-[1vh]' key={id}>
            {node.org.map((org: any, index: number) => {
              return (
                <RenderOrg
                  key={index}
                  orgCode={org.orgCode}
                  orgName={org.orgName}
                  roleGrp={org.roleGrp}
                  path={`${node.originalIndex}.org.${index}`}
                  parentCode={node.orgGrpCode}
                />
              )
            })}
          </div>
        ))}
      </div>

        <Pagination
          className='justify-center'
          page={currentPage}
          pageSize={groupsPerPage}
          onUpdate={setCurrentPage}
          total={data.length}
        />
    </OrgMatrixContext.Provider>
  )
}

export default OrgMatrix