import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Multiply, PlusIcon, SearchIcon } from '../svgApplication'
import { isLightColor, hexWithOpacity } from '../utils'
import AddGroupLevelModal from './AddGroupLevelModal'
import _ from 'lodash'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { v4 as uuidv4 } from 'uuid'
import RenderGroup from './RenderGrp'
import RenderChild from './RenderChild'
import RenderSubOrg from './SubOrg'
import { LuBuilding2 } from 'react-icons/lu'
import { BiPackage } from 'react-icons/bi'
import { RiUserShared2Fill } from 'react-icons/ri'
import { SetupScreenContext, SetupScreenContextType } from '@/app/user/components'
import { Text } from '@/components/Text'
import { useGlobal } from '@/context/GlobalContext'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { twMerge } from 'tailwind-merge'
import i18n from '../i18n'
import clsx from 'clsx'
import {
  hasMatchingOrgOrSubOrg,
  hasMatchingPsGrpOrPs,
  hasMatchingRoleGrpOrRole
} from '@/app/user/components/AccessTemplateTable/SearchHelpers'

interface OprMatrixContextType {
  isSearchOpen: string
  searchTerm: string
  collapsedItems: Record<string, boolean>
  toggleDropdown: (code: string) => void
  handleDroppingOfResource: (
    path: string,
    data: any,
    sourceCodePrefix: string,
    targetCodePrefix: string
  ) => void
}

const OprMatrixContext = React.createContext<OprMatrixContextType | null>(null)

// ============= REUSABLE COLUMN HEADER COMPONENT =============
interface ColumnHeaderProps {
  title: string
  searchKey: string
  isSearchOpen: string
  searchTerm: string
  setSearchTerm: (term: string) => void
  setIsSearchOpen: (key: string) => void
  borderColor: string
  brandColor: string
  showAddButton?: boolean
  isAddDisabled?: boolean
  addContentProps: any
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  searchKey,
  isSearchOpen,
  searchTerm,
  setSearchTerm,
  setIsSearchOpen,
  borderColor,
  brandColor,
  showAddButton = true,
  isAddDisabled = false,
  addContentProps
}) => {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()

  return (
    <div
      className={twMerge(
        'flex w-full items-center justify-between rounded border px-[.5vw] py-[1vh]',
        borderColor
      )}
    >
      <Text contentAlign='left' className='font-semibold'>
        {title}
      </Text>
      <div>
        {isSearchOpen === searchKey ? (
          <div className='flex w-[10vw] gap-[.25vw]'>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search...'
              className={`w-full rounded-xl border border-[var(--g-color-line-generic)] bg-[var(--g-color-base-background)] px-[.5vw] py-[.2vh] text-sm text-[var(--g-color-text-primary)] focus:outline-none`}
            />
            <Button
              className={'!w-fit !bg-[unset] p-1 disabled:opacity-50'}
                onClick={() => {
                setSearchTerm('')
                setIsSearchOpen('')
              }}
            >
              <Multiply height='.7vw' width='.7vw' fill={isDark ? 'white' : 'black'} />
            </Button>
          </div>
        ) : (
          <div className='flex gap-[.5vw] items-center'>
            {showAddButton && addContentProps && (
              <>
                {title !== 'Organization' && (
                  <Button
                    onClick={() => setOpen(true)}
                    disabled={isAddDisabled}
                    className='rounded-md p-1'
                  >
                    <PlusIcon
                      height='.8vw'
                      width='.8vw'
                      fill={isLightColor(brandColor)}
                    />
                  </Button>
                )}
                <Modal
                  showCloseButton={false}
                  className='w-[500px]'
                  onClose={() => setOpen(false)}
                  open={open}
                >
                  <AddGroupLevelModal
                    close={() => setOpen(false)}
                    {...addContentProps}
                  />
                </Modal>
              </>
            )}
            <Button
              onClick={() => {
                setSearchTerm('')
                setIsSearchOpen(searchKey)
              }}
              className={'!w-fit !bg-[unset] p-1 disabled:opacity-50'}
              disabled={isAddDisabled && searchKey !== 'org'}
            >
              <SearchIcon
                height='.8vw'
                width='.8vw'
                fill={isDark ? 'white' : 'black'}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============= MAIN COMPONENT =============
const OPRMatrix = ({ assignedOPRList }: { assignedOPRList: Array<string> }) => {
  const [isSearchOpen, setIsSearchOpen] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  )
  const [selectedOrg, setSelectedOrg] = useState<Record<string, string>>({})
  const [selectedPs, setSelectedPs] = useState<Record<string, string>>({})
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})
  const [refetchGroups, setRefetchGroups] = useState(false)
  const { orgGrpData: orgData, setOrgGrpData: setOrgData } = React.useContext(
    SetupScreenContext
  ) as SetupScreenContextType
  const toast = useInfoMsg()
  const { branding } = useGlobal()
  const { borderColor } = useTheme()
  const { brandColor } = branding
  const keyset = i18n.keyset('language')

  // ============= UTILITY FUNCTIONS =============
  const assignOriginalIndex = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const updatedItem = { ...item, originalIndex: index }
        for (const key in updatedItem) {
          if (
            Array.isArray(updatedItem[key]) ||
            typeof updatedItem[key] === 'object'
          ) {
            updatedItem[key] = assignOriginalIndex(updatedItem[key])
          }
        }
        return updatedItem
      })
    } else if (typeof data === 'object' && data !== null) {
      const result: any = {}
      for (const key in data) {
        const value = data[key]
        if (Array.isArray(value) || typeof value === 'object') {
          result[key] = assignOriginalIndex(value)
        } else {
          result[key] = value
        }
      }
      return result
    }
    return data
  }

  const organizationDataWithIndexing = useMemo(() => {
    return assignOriginalIndex(orgData)
  }, [orgData])

  const toggleDropdown = (code: string) => {
    setCollapsedItems(prev => ({ ...prev, [code]: !prev[code] }))
  }

  const handleResetSearchFilters = () => {
    setIsSearchOpen('')
    setSearchTerm('')
  }

  const getResource = (requestedPath: string, desiredDataType: [] | {}) => {
    const copyOfOrgData = structuredClone(organizationDataWithIndexing)
    const requestedResource = _.get(copyOfOrgData, requestedPath)
    return requestedResource ? requestedResource : desiredDataType
  }

  const setResource = (path: string, value: any) => {
    const copyOfOrgData = structuredClone(orgData)
    _.set(copyOfOrgData, path, value)
    setOrgData(copyOfOrgData)
  }

  const checkCodeExist = (data: Record<string, any>[], code: string) => {
    return data.find(val =>
      Object.entries(val).find(([key, value]) => {
        if (
          key.toLowerCase().includes('code') &&
          value.split('-').pop() == code.split('-').pop()
        ) {
          return true
        }
        return false
      })
    )
  }

  // ============= SELECTION HANDLERS WITH AUTO-CASCADE =============
  const handleOrgClick = (obj: Record<string, string>) => {
    handleResetSearchFilters()
    setSelectedOrg(obj)

    // Auto-select first PS group and PS
    const requiredPsGroup = getResource(`${obj['path']}.0`, {})
    if (requiredPsGroup && typeof requiredPsGroup?.['ps']?.[0] == 'object') {
      const firstPs = requiredPsGroup?.['ps'][0]
      handlePsClick({
        psGrpName: requiredPsGroup.psGrpName,
        psGrpCode: requiredPsGroup.psGrpCode,
        psName: firstPs.psName,
        psCode: firstPs.psCode,
        path: `${obj['path']}.0.ps.0.roleGrp`,
        id: firstPs.psId
      })
    } else {
      setSelectedPs({})
      setSelectedRole({})
    }
  }

  const handlePsClick = (obj: Record<string, string>) => {
    handleResetSearchFilters()
    setSelectedPs(obj)

    // Auto-select first role group and role
    const requiredRoleGrp = getResource(`${obj['path']}.0`, {})
    if (requiredRoleGrp && typeof requiredRoleGrp?.['roles']?.[0] == 'object') {
      const firstRole = requiredRoleGrp?.['roles'][0]
      handleRoleClick({
        roleGrpName: requiredRoleGrp.roleGrpName,
        roleGrpCode: requiredRoleGrp.roleGrpCode,
        roleName: firstRole.roleName,
        roleCode: firstRole.roleCode,
        roleCount: requiredRoleGrp?.['roles']?.length ?? 0,
        path: `${obj['path']}.0.roles.0`,
        id: firstRole.roleId
      })
    } else {
      setSelectedRole({})
    }
  }

  const handleRoleClick = (obj: Record<string, string>) => {
    handleResetSearchFilters()
    setSelectedRole(obj)
  }

  // ============= GET SELECTED GROUPS =============
  const getSelectedPsGrps = useCallback(() => {
    if (selectedOrg && selectedOrg?.path) {
      return getResource(selectedOrg?.path, [])
    }
    return []
  }, [selectedOrg, refetchGroups])

  const getSelectedRoleGrps = useCallback(() => {
    if (selectedPs && selectedPs?.path) {
      return getResource(selectedPs?.path, [])
    }
    return []
  }, [selectedPs, refetchGroups])

  // ============= ADD CONTENT =============
  const addContent = (path: string, value: { code: string; name: string; logo?: string }) => {
    const depthOfPath = path.split('.').length
    if (!value.code || !value.name) {
      toast('Please fill all the Data', 'warning')
      return
    }

    const valueToBeAdded: Record<string, any> = {}
    const copyOfOrgData = structuredClone(orgData)

    switch (depthOfPath) {
      case 1:
        valueToBeAdded['orgGrpCode'] = `${value.code}`
        valueToBeAdded['orgGrpName'] = value.name
        valueToBeAdded['orgGrpId'] = uuidv4()
        valueToBeAdded['org'] = []
        const isExist = checkCodeExist(copyOfOrgData, `${value.code}`)
        if (isExist) {
          toast('code already exists', 'warning')
          return
        } else {
          setOrgData((prev: any) => [...prev, valueToBeAdded])
          return
        }
      case 2:
        valueToBeAdded['orgCode'] = `${value.code}`
        valueToBeAdded['orgName'] = value.name
        valueToBeAdded['orgId'] = uuidv4()
        valueToBeAdded['subOrgGrp'] = []
        valueToBeAdded['psGrp'] = []
        break
      case 3:
        valueToBeAdded['subOrgGrpCode'] = `${value.code}`
        valueToBeAdded['subOrgGrpName'] = value.name
        valueToBeAdded['subOrgGrpId'] = uuidv4()
        valueToBeAdded['subOrg'] = []
        break
      case 4:
        // Check if path contains "subOrgGrp" - then it's subOrg, otherwise psGrp
        if (path.includes('subOrgGrp')) {
          valueToBeAdded['subOrgCode'] = `${value.code}`
          valueToBeAdded['subOrgName'] = value.name
          valueToBeAdded['subOrgId'] = uuidv4()
          valueToBeAdded['subOrgGrp'] = []
          valueToBeAdded['psGrp'] = []
        } else {
          valueToBeAdded['psGrpCode'] = `${value.code}`
          valueToBeAdded['psGrpName'] = value.name
          valueToBeAdded['psGrpId'] = uuidv4()
          valueToBeAdded['ps'] = []
        }
        break
      case 5:
        valueToBeAdded['subOrgGrpCode'] = `${value.code}`
        valueToBeAdded['subOrgGrpName'] = value.name
        valueToBeAdded['subOrgGrpId'] = uuidv4()
        valueToBeAdded['subOrg'] = []
        break
      case 6:
        if (path.includes('subOrgGrp') && path.includes('subOrg')) {
          valueToBeAdded['subOrgCode'] = `${value.code}`
          valueToBeAdded['subOrgName'] = value.name
          valueToBeAdded['subOrgId'] = uuidv4()
          valueToBeAdded['subOrgGrp'] = []
          valueToBeAdded['psGrp'] = []
        } else if (path.includes('subOrg') && !path.includes('subOrgGrp.')) {
          valueToBeAdded['psGrpCode'] = `${value.code}`
          valueToBeAdded['psGrpName'] = value.name
          valueToBeAdded['psGrpId'] = uuidv4()
          valueToBeAdded['ps'] = []
        } else {
          valueToBeAdded['psCode'] = `${value.code}`
          valueToBeAdded['psName'] = value.name
          valueToBeAdded['psLogo'] = value?.logo || ''
          valueToBeAdded['psId'] = uuidv4()
          valueToBeAdded['roleGrp'] = []
        }
        break
      case 7:
        valueToBeAdded['subOrgGrpCode'] = `${value.code}`
        valueToBeAdded['subOrgGrpName'] = value.name
        valueToBeAdded['subOrgGrpId'] = uuidv4()
        valueToBeAdded['subOrg'] = []
        break
      case 8:
        if (path.includes('subOrg') && path.includes('psGrp')) {
          valueToBeAdded['psGrpCode'] = `${value.code}`
          valueToBeAdded['psGrpName'] = value.name
          valueToBeAdded['psGrpId'] = uuidv4()
          valueToBeAdded['ps'] = []
        } else if (path.includes('roleGrp')) {
          valueToBeAdded['roleGrpCode'] = `${value.code}`
          valueToBeAdded['roleGrpName'] = value.name
          valueToBeAdded['roleGrpId'] = uuidv4()
          valueToBeAdded['roles'] = []
        } else {
          valueToBeAdded['subOrgCode'] = `${value.code}`
          valueToBeAdded['subOrgName'] = value.name
          valueToBeAdded['subOrgId'] = uuidv4()
          valueToBeAdded['subOrgGrp'] = []
          valueToBeAdded['psGrp'] = []
        }
        break
      case 9:
        valueToBeAdded['subOrgGrpCode'] = `${value.code}`
        valueToBeAdded['subOrgGrpName'] = value.name
        valueToBeAdded['subOrgGrpId'] = uuidv4()
        valueToBeAdded['subOrg'] = []
        break
      case 10:
        if (
          path.includes('subOrg') &&
          path.includes('psGrp') &&
          path.includes('ps.')
        ) {
          valueToBeAdded['roleGrpCode'] = `${value.code}`
          valueToBeAdded['roleGrpName'] = value.name
          valueToBeAdded['roleGrpId'] = uuidv4()
          valueToBeAdded['roles'] = []
        } else if (path.includes('ps.') && !path.includes('subOrg')) {
          valueToBeAdded['roleCode'] = `${value.code}`
          valueToBeAdded['roleName'] = value.name
          valueToBeAdded['roleId'] = uuidv4()
        } else if (path.includes('psGrp') && path.includes('ps')) {
          valueToBeAdded['psCode'] = `${value.code}`
          valueToBeAdded['psName'] = value.name
          valueToBeAdded['psLogo'] = value?.logo || ''
          valueToBeAdded['psId'] = uuidv4()
          valueToBeAdded['roleGrp'] = []
        } else {
          valueToBeAdded['subOrgCode'] = `${value.code}`
          valueToBeAdded['subOrgName'] = value.name
          valueToBeAdded['subOrgId'] = uuidv4()
          valueToBeAdded['subOrgGrp'] = []
          valueToBeAdded['psGrp'] = []
        }
        break
      default:
        // For deeper nesting, determine by path content
        if (path.endsWith('subOrg')) {
          valueToBeAdded['subOrgCode'] = `${value.code}`
          valueToBeAdded['subOrgName'] = value.name
          valueToBeAdded['subOrgId'] = uuidv4()
          valueToBeAdded['subOrgGrp'] = []
          valueToBeAdded['psGrp'] = []
        } else if (path.endsWith('subOrgGrp')) {
          valueToBeAdded['subOrgGrpCode'] = `${value.code}`
          valueToBeAdded['subOrgGrpName'] = value.name
          valueToBeAdded['subOrgGrpId'] = uuidv4()
          valueToBeAdded['subOrg'] = []
        } else if (path.endsWith('psGrp')) {
          valueToBeAdded['psGrpCode'] = `${value.code}`
          valueToBeAdded['psGrpName'] = value.name
          valueToBeAdded['psGrpId'] = uuidv4()
          valueToBeAdded['ps'] = []
        } else if (path.endsWith('ps')) {
          valueToBeAdded['psCode'] = `${value.code}`
          valueToBeAdded['psName'] = value.name
          valueToBeAdded['psLogo'] = value?.logo || ''
          valueToBeAdded['psId'] = uuidv4()
          valueToBeAdded['roleGrp'] = []
        } else if (path.endsWith('roleGrp')) {
          valueToBeAdded['roleGrpCode'] = `${value.code}`
          valueToBeAdded['roleGrpName'] = value.name
          valueToBeAdded['roleGrpId'] = uuidv4()
          valueToBeAdded['roles'] = []
        } else if (path.endsWith('roles')) {
          valueToBeAdded['roleCode'] = `${value.code}`
          valueToBeAdded['roleName'] = value.name
          valueToBeAdded['roleId'] = uuidv4()
        }
        break
    }

    const resource = getResource(path, [])
    const isExist = checkCodeExist(resource, value.code)
    if (isExist) {
      toast('code already exists', 'warning')
    } else {
      setResource(path, [...resource, valueToBeAdded])
      setRefetchGroups(prev => !prev)
    }
  }

  const editContent = (
    path: string,
    value: { code: string; name: string ; logo?: string},
    parentCode: string
  ) => {
    const resource = getResource(path, {})

    if (resource && typeof resource === 'object') {
      Object.keys(resource).forEach(key => {
        if (key.toLowerCase().endsWith('name')) {
          resource[key] = value.name
        }else if(key.toLowerCase().endsWith('logo')){
          resource[key] = value.logo || ''
        }
      })
      setResource(path, resource)
    }
    setRefetchGroups(prev => !prev)
  }

  const handleDeletionOfSelectedResource = (resource: any) => {
    // subfunction to get all child codes
    const collectDeletedCodes = (
      data: any,
      deletedCodes: string[] = []
    ): string[] => {
      if (Array.isArray(data)) {
        // If it's an array, process each element
        data.forEach(item => collectDeletedCodes(item, deletedCodes))
      } else if (typeof data === 'object' && data !== null) {
        // If it's an object, check all keys
        Object.entries(data).forEach(([key, value]) => {
          if (key.toLowerCase().endsWith('code') && typeof value === 'string') {
            deletedCodes.push(value)
          } else if (typeof value === 'object') {
            collectDeletedCodes(value, deletedCodes)
          }
        })
      }
      return deletedCodes
    }

    // 1️⃣ Collect all deleted codes
    const deletedCodes: string[] = collectDeletedCodes(resource)

    // 2️⃣ Check all selected states
    const selectedKeys = [
      { state: selectedOrg, setter: setSelectedOrg },
      { state: selectedPs, setter: setSelectedPs },
      { state: selectedRole, setter: setSelectedRole }
    ]

    // 3️⃣ Reset if deleted
    for (const { state, setter } of selectedKeys) {
      const shouldReset = Object.entries(state).some(
        ([key, value]) =>
          key.toLowerCase().endsWith('code') &&
          deletedCodes.includes(value as string)
      )

      if (shouldReset) setter({})
    }
  }

  const deleteResource = (path: string, deletionIndex: number) => {
    const copyOfOrgData = structuredClone(orgData)
    let resource: any[] = _.get(copyOfOrgData, path)
    if (resource[deletionIndex]) {
      handleDeletionOfSelectedResource(resource[deletionIndex])
    }
    resource = resource.toSpliced(deletionIndex, 1)
    _.set(copyOfOrgData, path, resource)
    setOrgData(copyOfOrgData)
    setRefetchGroups(prev => !prev)
  }

  // ============= AGGREGATE ALL PRODUCTS/ROLES =============
  const allProducts = useMemo(() => {
    const result: any[] = []
    organizationDataWithIndexing.forEach((orgGrp: any) => {
      orgGrp?.org?.forEach((org: any) => {
        org?.psGrp?.forEach((psGrp: any) => {
          const existingGroup = result.find(
            g =>
              g.orgGrpCode === orgGrp.orgGrpCode &&
              g.orgCode === org.orgCode &&
              g.psGrpCode === psGrp.psGrpCode
          )

          const products = psGrp?.ps?.map((ps: any) => ({
            orgGrpCode: orgGrp.orgGrpCode,
            orgCode: org.orgCode,
            psGrpCode: psGrp.psGrpCode,
            psGrpName: psGrp.psGrpName,
            ...ps
          }))

          if (existingGroup) {
            existingGroup.ps.push(...products)
          } else {
            result.push({
              orgGrpCode: orgGrp.orgGrpCode,
              orgCode: org.orgCode,
              psGrpCode: psGrp.psGrpCode,
              psGrpName: psGrp.psGrpName,
              psGrpId: psGrp.psGrpId,
              originalIndex: psGrp.originalIndex,
              ps: products
            })
          }
        })
      })
    })
    return result
  }, [organizationDataWithIndexing])

  const classifiedProducts = useMemo(() => {
    const selectedPsGrps = getSelectedPsGrps()
    return allProducts.map(group => {
      const match = selectedPsGrps.find(
        (g: any) =>
          g?.psGrpCode?.split('-')?.pop() ===
          group?.psGrpCode?.split('-')?.pop()
      )

      const psWithFlags = group.ps.map((ps: any) => {
        const exists = match?.ps?.some(
          (p: any) => p.psCode.split('-').pop() === ps.psCode.split('-').pop()
        )
        return { ...ps, existsInCurrentOrg: !!exists }
      })

      return {
        ...group,
        ps: psWithFlags,
        existsInCurrentOrg: !!match
      }
    })
  }, [allProducts, selectedOrg, refetchGroups, organizationDataWithIndexing])

  const allRoles = useMemo(() => {
    const result: any[] = []
    organizationDataWithIndexing.forEach((orgGrp: any) => {
      orgGrp.org.forEach((org: any) => {
        org.psGrp.forEach((psGrp: any) => {
          psGrp.ps.forEach((ps: any) => {
            ps.roleGrp.forEach((roleGrp: any) => {
              const existingGroup = result.find(
                g =>
                  g.orgGrpCode === orgGrp.orgGrpCode &&
                  g.orgCode === org.orgCode &&
                  g.psGrpCode === psGrp.psGrpCode &&
                  g.psCode === ps.psCode &&
                  g.roleGrpCode === roleGrp.roleGrpCode
              )

              const roles =
                roleGrp.roles?.map((role: any) => ({
                  orgGrpCode: orgGrp.orgGrpCode,
                  orgCode: org.orgCode,
                  psGrpCode: psGrp.psGrpCode,
                  psGrpName: psGrp.psGrpName,
                  psCode: ps.psCode,
                  psName: ps.psName,
                  roleGrpCode: roleGrp.roleGrpCode,
                  roleGrpName: roleGrp.roleGrpName,
                  ...role
                })) || []

              if (existingGroup) {
                existingGroup.roles.push(...roles)
              } else {
                result.push({
                  orgGrpCode: orgGrp.orgGrpCode,
                  orgCode: org.orgCode,
                  psGrpCode: psGrp.psGrpCode,
                  psGrpName: psGrp.psGrpName,
                  psCode: ps.psCode,
                  psName: ps.psName,
                  roleGrpCode: roleGrp.roleGrpCode,
                  roleGrpName: roleGrp.roleGrpName,
                  roleGrpId: roleGrp.roleGrpId,
                  originalIndex: roleGrp.originalIndex,
                  roles
                })
              }
            })
          })
        })
      })
    })
    return result
  }, [organizationDataWithIndexing])

  const classifiedRoles = useMemo(() => {
    const selectedRoleGrps = getSelectedRoleGrps()
    return allRoles.map(group => {
      const matchRoleGrp = selectedRoleGrps.find(
        (rg: any) =>
          rg.roleGrpCode.split('-').pop() === group.roleGrpCode.split('-').pop()
      )

      const rolesWithFlags = group.roles.map((role: any) => {
        const exists = matchRoleGrp?.roles?.some(
          (r: any) =>
            r.roleCode.split('-').pop() === role.roleCode.split('-').pop()
        )
        return { ...role, existsInCurrentRoleGrp: !!exists }
      })

      return {
        ...group,
        roles: rolesWithFlags,
        existsInCurrentRoleGrp: !!matchRoleGrp
      }
    })
  }, [allRoles, selectedPs, refetchGroups, organizationDataWithIndexing])

  // ============= UPDATE RECURSIVELY =============
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

  // ============= ADD TO CONTEXT HANDLERS =============
  const handleAddProductToSelectedOrg = (
    productservice: any,
    productservicegroup: any
  ) => {
    const resource = getResource(selectedOrg?.path, [])
    const isPsGrpExist = checkCodeExist(
      resource,
      productservicegroup?.psGrpCode
    )

    if (isPsGrpExist) {
      const existingPsGrp = resource.find(
        (psg: any) =>
          psg.psGrpCode.split('-').pop() ==
          productservicegroup?.psGrpCode?.split('-').pop()
      )
      const existingPsGrpIndex = resource.findIndex(
        (psg: any) =>
          psg.psGrpCode.split('-').pop() ==
          productservicegroup?.psGrpCode?.split('-').pop()
      )
      const psList = getResource(
        `${selectedOrg?.path}.${existingPsGrpIndex}.ps`,
        []
      )
      const productserviceNeedToAdd = updateRecursively(
        {
          psCode: productservice.psCode,
          psName: productservice.psName,
          psId: productservice.psId,
          roleGrp: productservice.roleGrp
        },
        {
          replaceIds: true,
          replaceCode: true,
          sourceCode: productservicegroup?.psGrpCode,
          targetCode: existingPsGrp?.psGrpCode
        }
      )
      setResource(`${selectedOrg?.path}.${existingPsGrpIndex}.ps`, [
        ...psList,
        productserviceNeedToAdd
      ])
    } else {
      const psGrpNeedToAdd = updateRecursively(
        {
          psGrpCode: productservicegroup.psGrpCode,
          psGrpName: productservicegroup.psGrpName,
          psGrpId: productservicegroup.psGrpId,
          ps: [
            {
              psCode: productservice.psCode,
              psName: productservice.psName,
              psId: productservice.psId,
              roleGrp: productservice.roleGrp
            }
          ]
        },
        {
          replaceCode: true,
          sourceCode: productservicegroup?.orgCode,
          targetCode: selectedOrg?.orgCode,
          replaceIds: true
        }
      )
      setResource(selectedOrg?.path, [...resource, psGrpNeedToAdd])
    }
    setRefetchGroups(prev => !prev)
    handleResetSearchFilters()
  }

  const handleAddRoleToSelectedProduct = (role: any, roleGrp: any) => {
    const resource = getResource(selectedPs?.path, [])
    const isroleGrpExist = checkCodeExist(resource, roleGrp?.roleGrpCode)
    if (isroleGrpExist) {
      const existingRoleGrp = resource.find(
        (psg: any) =>
          psg.roleGrpCode.split('-').pop() ==
          roleGrp?.roleGrpCode?.split('-').pop()
      )
      const existingRoleGrpIndex = resource.findIndex(
        (psg: any) =>
          psg.roleGrpCode.split('-').pop() ==
          roleGrp?.roleGrpCode?.split('-').pop()
      )
      const rolesList = getResource(
        `${selectedPs?.path}.${existingRoleGrpIndex}.roles`,
        []
      )

      const roleNeedToAdd = updateRecursively(
        {
          roleCode: role.roleCode,
          roleName: role.roleName,
          roleId: role.roleId
        },
        {
          replaceIds: true,
          replaceCode: true,
          sourceCode: roleGrp?.roleGrpCode,
          targetCode: existingRoleGrp?.roleGrpCode
        }
      )
      setResource(`${selectedPs?.path}.${existingRoleGrpIndex}.roles`, [
        ...rolesList,
        roleNeedToAdd
      ])
    } else {
      const roleGrpNeedToAdd = updateRecursively(
        {
          roleGrpCode: roleGrp.roleGrpCode,
          roleGrpName: roleGrp.roleGrpName,
          roleGrpId: roleGrp.roleGrpId,
          roles: [
            {
              roleCode: role.roleCode,
              roleName: role.roleName,
              roleId: role.roleId
            }
          ]
        },
        {
          replaceCode: true,
          sourceCode: roleGrp?.psCode,
          targetCode: selectedPs?.psCode,
          replaceIds: true
        }
      )
      setResource(selectedPs?.path, [...resource, roleGrpNeedToAdd])
    }
    setRefetchGroups(prev => !prev)
    handleResetSearchFilters()
  }

  const handleDroppingOfResource = (
    path: string,
    data: any,
    sourceCodePrefix: string,
    targetCodePrefix: string
  ) => {
    const resource = getResource(path, [])
    const codeValueToCheck = Object.entries(data).find(
      ([key, value]) =>
        key.toLowerCase().endsWith('code') && typeof value == 'string'
    )?.[1]
    if (!codeValueToCheck) {
      toast('code not found', 'warning')
      return
    }
    const isCodeExist = checkCodeExist(resource, codeValueToCheck as string)
    if (isCodeExist) {
      toast("Can't drop here as same code exist in target", 'warning')
      return
    }
    const resourceToBeAddded = updateRecursively(data, {
      replaceCode: true,
      replaceIds: true,
      sourceCode: sourceCodePrefix,
      targetCode: targetCodePrefix
    })
    setResource(path, [...resource, resourceToBeAddded])
    setRefetchGroups(prev => !prev)
  }

  const blocks = useMemo(() => {
    const data = [
      {
        icon: LuBuilding2,
        group: selectedOrg.orgGrpName,
        title: selectedOrg.orgName,
        subtitle: selectedOrg.orgCode
      },
      {
        icon: BiPackage,
        group: selectedPs.psGrpName,
        title: selectedPs.psName,
        subtitle: selectedPs.psCode
      },
      {
        icon: RiUserShared2Fill,
        group: selectedRole.roleGrpName,
        title: selectedRole?.roleCount ? `${selectedRole.roleCount} Role` : ''
      }
    ]
    return data
  }, [selectedOrg, selectedPs, selectedRole])

  return (
    <OprMatrixContext.Provider
      value={{
        collapsedItems,
        toggleDropdown,
        isSearchOpen,
        searchTerm,
        handleDroppingOfResource
      }}
    >
      <div className='flex h-full w-full flex-col gap-[2vh]'>
        <div className='flex h-[20vh] w-full items-center justify-center rounded-lg'>
          {blocks.map((block, idx) => (
            <div key={idx} className='flex items-center '>
              {/* Circle */}
              <div className='flex w-[8vw] flex-col items-center gap-[0.5vh]'>
                <div
                  style={{
                    backgroundColor: hexWithOpacity(brandColor, 0.8)
                  }}
                  className={clsx(
                    `flex h-[2.5vw] w-[2.5vw] items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-in-out`,
                    {
                      'h-[4vw] w-[4vw]': !block?.group || !block?.title
                    }
                  )}
                >
                  <block.icon
                    className={clsx(
                      'h-[0.7vw] w-[0.7vw] transition-all duration-300 ease-in-out',
                      {
                        'h-[1.1vw] w-[1.1vw]': !block?.group || !block?.title
                      }
                    )}
                    style={{
                      color: isLightColor(brandColor)
                    }}
                  />
                </div>

                {/* Texts */}
                <div className='flex w-full flex-col items-center'>
                  <Text
                    className={`w-full truncate text-nowrap text-center`}
                  >
                    {block?.group}
                  </Text>
                  <Text
                    className='w-full truncate text-nowrap text-center font-semibold'
                  >
                    {block?.title}
                  </Text>
                  <Text
                    className='w-full truncate text-nowrap text-center'
                    color='secondary'
                  >
                    {block.subtitle}
                  </Text>
                </div>
              </div>

              {/* Arrow */}
              {idx < blocks.length - 1 && (
                <div className='mx-4 text-lg text-gray-400'>→</div>
              )}
            </div>
          ))}
        </div>
        <div className='flex w-full items-center gap-[2vw]'>
          {/* ============= ORGANIZATION COLUMN ============= */}
          <div
            className={twMerge('h-[66vh] w-1/3 rounded-lg border', borderColor)}
          >
            <ColumnHeader
              title={keyset('Organization')}
              searchKey='org'
              isSearchOpen={isSearchOpen}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setIsSearchOpen={setIsSearchOpen}
              borderColor={borderColor}
              brandColor={brandColor}
              addContentProps={{
                path: `${orgData.length}`,
                addFunction: addContent,
                parentCode: '',
                modalTitle: keyset('Add Organization Group'),
                modalSubText: keyset(
                  'Create a new organization group to organize your organizations.'
                ),
                resourceField: keyset('organization group')
              }}
            />

            <div className='flex h-[60vh] w-full flex-col gap-[1vh] overflow-y-auto px-[.5vw] py-[1.5vh]'>
              {organizationDataWithIndexing
                .filter((group: any) => {
                  if (isSearchOpen !== 'org') return true
                  const term = searchTerm.toLowerCase()

                  // Check if group name matches
                  if (group.orgGrpName.toLowerCase().includes(term)) {
                    return true
                  }

                  // Check if any org or subOrg in this group matches
                  return group.org.some((org: any) =>
                    hasMatchingOrgOrSubOrg(org, searchTerm)
                  )
                })
                .map((orgGrp: any, orgGrpIndex: number) => (
                  <React.Fragment key={orgGrpIndex}>
                    <RenderGroup
                      item={orgGrp}
                      displayCode={orgGrp.orgGrpCode}
                      displayName={orgGrp.orgGrpName}
                      codePrefix={''}
                      itemId={orgGrp.orgGrpId}
                      resourceField='Organization'
                      contextKey='org'
                      addContentProps={{
                        path: `${orgGrp?.originalIndex}.org`,
                        addFunction: addContent,
                        parentCode: `${orgGrp.orgGrpCode}-`,
                        modalTitle: keyset('Add Organization'),
                        modalSubText: keyset(
                          'Create a new organization in this group.'
                        ),
                        resourceField: 'organization'
                      }}
                      editContentProps={{
                        path: `${orgGrp?.originalIndex}`,
                        addFunction: editContent,
                        parentCode: ``,
                        modalTitle: keyset('Edit Organization group'),
                        modalSubText: keyset('Update a organization group.'),
                        resourceField: 'organization group',
                        resource: {
                          code: orgGrp.orgGrpCode,
                          name: orgGrp.orgGrpName
                        }
                      }}
                      onDelete={() => {
                        if (assignedOPRList.includes(orgGrp?.orgGrpId)) {
                          toast(
                            "Can't delete this organization group as it assigned to a template",
                            'warning'
                          )
                          return
                        }
                        setOrgData((prev: any) =>
                          prev.toSpliced(orgGrp?.originalIndex, 1)
                        )
                        handleDeletionOfSelectedResource(
                          orgData[orgGrp?.originalIndex]
                        )
                        setRefetchGroups(prev => !prev)
                      }}
                      path={`${orgGrp?.originalIndex}.org`}
                    >
                      {orgGrp.org.map((org: any, orgIndex: number) => (
                        <RenderChild
                          item={org}
                          displayName={org.orgName}
                          displayCode={org.orgCode}
                          codePrefix={`${orgGrp.orgGrpCode}-`}
                          isSelected={selectedOrg.id === org.orgId}
                          existsInContext={true}
                          onClick={() =>
                            handleOrgClick({
                              orgGrpCode: orgGrp.orgGrpCode,
                              orgGrpName: orgGrp.orgGrpName,
                              orgName: org.orgName,
                              orgCode: org.orgCode,
                              path: `${orgGrp?.originalIndex}.org.${org?.originalIndex}.psGrp`,
                              id: org.orgId
                            })
                          }
                          onDelete={
                            isSearchOpen === 'org'
                              ? null
                              : () => {
                                  if (assignedOPRList.includes(org.orgId)) {
                                    toast(
                                      "Can't delete this organization as it assigned to a template",
                                      'warning'
                                    )
                                    return
                                  }
                                  deleteResource(
                                    `${orgGrp?.originalIndex}.org`,
                                    org?.originalIndex
                                  )
                                }
                          }
                          addContentProps={{
                            path: `${orgGrp?.originalIndex}.org.${org?.originalIndex}.subOrgGrp`,
                            addFunction: addContent,
                            parentCode: `${org.orgCode}-`,
                            modalTitle: keyset('Add Sub Organization Group'),
                            modalSubText: keyset(
                              'Create a new sub organization group.'
                            ),
                            resourceField: 'sub organization group'
                          }}
                          editContentProps={{
                            path: `${orgGrp?.originalIndex}.org.${org?.originalIndex}`,
                            addFunction: editContent,
                            parentCode: `${orgGrp.orgGrpCode}-`,
                            modalTitle: keyset('Edit Organization'),
                            modalSubText: keyset('Update a organization.'),
                            resourceField: 'organization',
                            resource: {
                              code: org.orgCode,
                              name: org.orgName
                            }
                          }}
                          resourceField='org'
                          key={org.orgId}
                        >
                          {/* Render SubOrgGrp */}
                          {org?.subOrgGrp?.map(
                            (subOrgGrp: any, subOrgGrpIndex: number) => (
                              <RenderSubOrg
                                key={subOrgGrp.subOrgGrpId}
                                subOrgGrp={subOrgGrp}
                                subOrgGrpIndex={subOrgGrpIndex}
                                parentPath={`${orgGrp?.originalIndex}.org.${org?.originalIndex}.subOrgGrp`}
                                parentCode={org.orgCode}
                                assignedOPRList={assignedOPRList}
                                deleteResource={deleteResource}
                                handleOrgClick={handleOrgClick}
                                editContent={editContent}
                                addContent={addContent}
                                isSearchOpen={isSearchOpen}
                                searchTerm={searchTerm}
                                orgGrpCode={orgGrp.orgGrpCode}
                                orgGrpName={orgGrp.orgGrpName}
                                selectedOrg={selectedOrg}
                              />
                            )
                          )}
                        </RenderChild>
                      ))}
                    </RenderGroup>
                  </React.Fragment>
                ))}
            </div>
          </div>

          {/* ============= PRODUCTS/SERVICES COLUMN ============= */}
          <div
            className={twMerge(
              'flex-flex-col h-[66vh] w-1/3 rounded-lg border',
              borderColor
            )}
          >
            <ColumnHeader
              title={keyset('Products/Services')}
              searchKey='product'
              isSearchOpen={isSearchOpen}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setIsSearchOpen={setIsSearchOpen}
              borderColor={borderColor}
              brandColor={brandColor}
              isAddDisabled={!Object.entries(selectedOrg).length}
              addContentProps={{
                path: `${selectedOrg?.path}`,
                addFunction: addContent,
                parentCode: `${selectedOrg?.orgCode}-`,
                modalTitle: keyset('Add Product Group'),
                modalSubText: keyset(
                  'Create a new product group to organize your products.'
                ),
                resourceField: 'product group'
              }}
            />

            <div className='flex h-[60vh] w-full flex-col gap-[1vh] overflow-y-auto px-[.5vw] py-[1.5vh]'>
              {(isSearchOpen === 'product' && searchTerm
                ? classifiedProducts.filter(group =>
                    hasMatchingPsGrpOrPs(group, searchTerm)
                  )
                : getSelectedPsGrps() ?? []
              ).map((psg: any, psgIndex: number) => (
                <React.Fragment key={psgIndex}>
                  <RenderGroup
                    item={psg}
                    displayCode={psg.psGrpCode}
                    displayName={psg.psGrpName}
                    codePrefix={`${selectedOrg.orgCode}-`}
                    itemId={psg.psGrpId}
                    resourceField='Product'
                    contextKey='product'
                    onDelete={
                      isSearchOpen === 'product'
                        ? null
                        : () => {
                            if (assignedOPRList.includes(psg?.psGrpId)) {
                              toast(
                                "Can't delete this product/service group as it assigned to a template",
                                'warning'
                              )
                              return
                            }
                            deleteResource(selectedOrg.path, psg?.originalIndex)
                          }
                    }
                    addContentProps={{
                      path: `${selectedOrg.path}.${psg?.originalIndex}.ps`,
                      addFunction: addContent,
                      parentCode: `${psg.psGrpCode}-`,
                      modalTitle: keyset('Add Product'),
                      modalSubText: keyset(
                        'Create a new product in this group.'
                      ),
                      resourceField: 'product'
                    }}
                    editContentProps={{
                      path: `${selectedOrg.path}.${psg?.originalIndex}`,
                      addFunction: editContent,
                      parentCode: `${selectedOrg.orgCode}-`,
                      modalTitle: keyset('Edit Product group'),
                      modalSubText: keyset('Update a product group.'),
                      resourceField: 'product group',
                      resource: {
                        code: psg.psGrpCode,
                        name: psg.psGrpName
                      }
                    }}
                    path={`${selectedOrg.path}.${psg?.originalIndex}.ps`}
                  >
                    {psg.ps
                      .filter((val: any) =>
                        isSearchOpen === 'product' && searchTerm
                          ? val.psName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          : true
                      )
                      .map((ps: any, psIndex: number) => {
                        const isExist =
                          isSearchOpen === 'product'
                            ? ps?.existsInCurrentOrg
                            : true

                        return (
                          <RenderChild
                            item={ps}
                            displayName={ps.psName}
                            displayCode={ps.psCode}
                            codePrefix={`${psg.psGrpCode}-`}
                            isSelected={selectedPs.id === ps.psId}
                            onClick={() =>
                              handlePsClick({
                                psGrpCode: psg.psGrpCode,
                                psGrpName: psg.psGrpName,
                                psCode: ps.psCode,
                                psName: ps.psName,
                                path: `${selectedOrg.path}.${psg?.originalIndex}.ps.${ps?.originalIndex}.roleGrp`,
                                id: ps.psId
                              })
                            }
                            existsInContext={isExist}
                            onAddToContext={
                              !isExist
                                ? () => handleAddProductToSelectedOrg(ps, psg)
                                : undefined
                            }
                            onDelete={
                              isSearchOpen === 'product'
                                ? null
                                : () => {
                                    if (assignedOPRList.includes(ps.psId)) {
                                      toast(
                                        "Can't delete this product as it assigned to a template",
                                        'warning'
                                      )
                                      return
                                    }
                                    deleteResource(
                                      `${selectedOrg.path}.${psg?.originalIndex}.ps`,
                                      ps?.originalIndex
                                    )
                                  }
                            }
                            editContentProps={{
                              path: `${selectedOrg.path}.${psg?.originalIndex}.ps.${ps?.originalIndex}`,
                              addFunction: editContent,
                              parentCode: `${psg.psGrpCode}-`,
                              modalTitle: keyset('Edit Product'),
                              modalSubText: keyset('Update a product.'),
                              resourceField: 'product',
                              resource: {
                                code: ps.psCode,
                                name: ps.psName,
                                logo : ps?.psLogo
                              }
                            }}
                            resourceField='product'
                            key={ps.psId}
                          />
                        )
                      })}
                  </RenderGroup>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ============= ROLES COLUMN ============= */}
          <div
            className={twMerge(
              'flex-flex-col h-[66vh] w-1/3 rounded-lg border',
              borderColor
            )}
          >
            <ColumnHeader
              title={keyset('Roles')}
              searchKey='role'
              isSearchOpen={isSearchOpen}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setIsSearchOpen={setIsSearchOpen}
              borderColor={borderColor}
              brandColor={brandColor}
              isAddDisabled={!Object.entries(selectedPs).length}
              addContentProps={{
                path: `${selectedPs.path}`,
                addFunction: addContent,
                parentCode: `${selectedPs.psCode}-`,
                modalTitle: keyset('Add Role Group'),
                modalSubText: keyset(
                  'Create a new role group to organize your roles.'
                ),
                resourceField: 'role group'
              }}
            />

            <div className='flex h-[60vh] w-full flex-col gap-[1vh] overflow-y-auto px-[.5vw] py-[1.5vh]'>
              {(isSearchOpen === 'role' && searchTerm
                ? classifiedRoles.filter(group =>
                    hasMatchingRoleGrpOrRole(group, searchTerm)
                  )
                : getSelectedRoleGrps() ?? []
              ).map((roleGrp: any, roleGrpIndex: number) => (
                <React.Fragment key={roleGrpIndex}>
                  <RenderGroup
                    item={roleGrp}
                    displayCode={roleGrp.roleGrpCode}
                    displayName={roleGrp.roleGrpName}
                    codePrefix={`${selectedPs.psCode}-`}
                    itemId={roleGrp.roleGrpId}
                    resourceField='Role'
                    contextKey='role'
                    addContentProps={{
                      path: `${selectedPs.path}.${roleGrp?.originalIndex}.roles`,
                      addFunction: addContent,
                      parentCode: `${roleGrp?.roleGrpCode}-`,
                      modalTitle: keyset('Add Role'),
                      modalSubText: keyset('Create a new role in this group.'),
                      resourceField: 'role'
                    }}
                    onDelete={
                      isSearchOpen === 'role'
                        ? null
                        : () => {
                            if (assignedOPRList.includes(roleGrp?.roleGrpId)) {
                              toast(
                                "Can't delete this role group as it assigned to a template",
                                'warning'
                              )
                              return
                            }
                            deleteResource(
                              selectedPs.path,
                              roleGrp?.originalIndex
                            )
                          }
                    }
                    editContentProps={{
                      path: `${selectedPs.path}.${roleGrp?.originalIndex}`,
                      addFunction: editContent,
                      parentCode: `${selectedPs.psCode}-`,
                      modalTitle: keyset('Edit Role group'),
                      modalSubText: keyset('Update a role group.'),
                      resourceField: 'role group',
                      resource: {
                        code: roleGrp.roleGrpCode,
                        name: roleGrp.roleGrpName
                      }
                    }}
                    path={`${selectedPs.path}.${roleGrp?.originalIndex}.roles`}
                  >
                    {roleGrp.roles.map((role: any, roleIndex: number) => {
                      const isExist =
                        isSearchOpen === 'role'
                          ? role.existsInCurrentRoleGrp
                          : true

                      return (
                        <RenderChild
                          item={role}
                          displayName={role.roleName}
                          displayCode={role.roleCode}
                          codePrefix={`${roleGrp.roleGrpCode}-`}
                          isSelected={selectedRole.id === role.roleId}
                          onClick={() =>
                            handleRoleClick({
                              roleGrpCode: roleGrp.roleGrpCode,
                              roleGrpName: roleGrp.roleGrpName,
                              roleCode: role.roleCode,
                              roleName: role.roleName,
                              roleCount: roleGrp.roles?.length ?? 0,
                              path: `${selectedPs.path}.${roleGrp?.originalIndex}.roles.${role?.originalIndex}`,
                              id: role.roleId
                            })
                          }
                          existsInContext={isExist}
                          onAddToContext={
                            !isExist
                              ? () =>
                                  handleAddRoleToSelectedProduct(role, roleGrp)
                              : undefined
                          }
                          onDelete={
                            isSearchOpen === 'role'
                              ? null
                              : () => {
                                  if (assignedOPRList.includes(role.roleId)) {
                                    toast(
                                      "Can't delete this role as it assigned to a template",
                                      'warning'
                                    )
                                    return
                                  }
                                  deleteResource(
                                    `${selectedPs.path}.${roleGrp?.originalIndex}.roles`,
                                    role?.originalIndex
                                  )
                                }
                          }
                          editContentProps={{
                            path: `${selectedPs.path}.${roleGrp?.originalIndex}.roles.${role?.originalIndex}`,
                            addFunction: editContent,
                            parentCode: `${roleGrp.roleGrpCode}-`,
                            modalTitle: keyset('Edit Role'),
                            modalSubText: keyset('Update a role.'),
                            resourceField: 'role',
                            resource: {
                              code: role.roleCode,
                              name: role.roleName
                            }
                          }}
                          resourceField='role'
                          key={role.roleId}
                        />
                      )
                    })}
                  </RenderGroup>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OprMatrixContext.Provider>
  )
}

export default OPRMatrix

export function useOPRMatrix() {
  const context = useContext(OprMatrixContext)
  if (!context) {
    throw new Error(
      'useOPRMatrix must be used within a OprMatrixContext Provider'
    )
  }
  return context
}