import React, { useEffect, useMemo, useState } from 'react'
import { Multiply, DownArrow, SearchIcon } from '../../../components/svgApplication'
import { hexWithOpacity } from '../../../components/utils'
import { twMerge } from 'tailwind-merge'
import { SetupScreenContext, SetupScreenContextType } from '..'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useGlobal } from '@/context/GlobalContext'
import { useTheme } from '@/hooks/useTheme'
import i18n from '../../../components/i18n'
import clsx from 'clsx'
import {
  hasMatchingOrgOrSubOrg,
  hasMatchingPsGrpOrPs,
  hasMatchingRoleGrpOrRole,
  hasMatchingSubOrg,
  highlightText
} from './SearchHelpers'

interface Role {
  roleCode: string
  roleName: string
  roleId: string
}
interface RoleGrp {
  roleGrpCode: string
  roleGrpName: string
  roleGrpId: string
  roles: Role[]
}
interface PsItem {
  psCode: string
  psName: string
  psId: string
  roleGrp: RoleGrp[]
}
interface PsGrpItem {
  psGrpCode: string
  psGrpName: string
  psGrpId: string
  ps: PsItem[]
}
interface SubOrgItem {
  subOrgCode: string
  subOrgName: string
  subOrgId: string
  psGrp: PsGrpItem[]
  subOrgGrp?: SubOrgGrpItem[]
}
interface SubOrgGrpItem {
  subOrgGrpCode: string
  subOrgGrpName: string
  subOrgGrpId: string
  subOrg: SubOrgItem[]
}
interface OrgItem {
  orgCode: string
  orgName: string
  orgId: string
  psGrp: PsGrpItem[]
  subOrgGrp?: SubOrgGrpItem[]
}
interface OrgGrpItem {
  orgGrpCode: string
  orgGrpName: string
  orgGrpId: string
  org: OrgItem[]
}
// Recursive component to render SubOrg structure
const RenderSubOrg = ({
  subOrgGrp,
  selectedOrgId,
  setSelectedOrgId,
  setSelectedPsId,
  setOpenOrgGrp,
  setOpenPsGrp,
  setOpenRoleGrp,
  openOrgGrp,
  accentColor,
  fontSize,
  orgSearchTerm
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const { borderColor, textColor, bgColor, isDark } = useTheme()

  // Check if this group or any nested content matches search
  const matchesSearch = useMemo(() => {
    return hasMatchingSubOrg(subOrgGrp, orgSearchTerm)
  }, [subOrgGrp, orgSearchTerm])

  // Auto-expand if search term matches something inside
  React.useEffect(() => {
    if (orgSearchTerm && matchesSearch) {
      setIsOpen(true)
    } else if (!orgSearchTerm) {
      setIsOpen(false)
    }
  }, [orgSearchTerm, matchesSearch])

  // Don't render if doesn't match search
  if (!matchesSearch) {
    return null
  }

  return (
    <div
      className='mt-2 rounded-md p-2'
      style={{ backgroundColor: hexWithOpacity(accentColor, 0.05) }}
    >
      {/* SubOrg Group Header */}
      <div
        className='hover:bg-torus-bg-hover flex cursor-pointer justify-between rounded p-2'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-[.6vw]'>
          <DownArrow fill={isDark ? 'white' : 'black'} />
          <span
            style={{ fontSize: `${fontSize * 0.7}vw` }}
            className='text-torus-text-opacity-75'
          >
            {highlightText(subOrgGrp.subOrgGrpName, orgSearchTerm, accentColor)}
          </span>
        </div>
        <span className='text-torus-text-opacity-50'>
          {subOrgGrp.subOrg?.length || 0}
        </span>
      </div>

      {/* SubOrg List */}
      {isOpen &&
        subOrgGrp.subOrg?.map((subOrg: SubOrgItem) => {
          // Check if this specific subOrg matches or has matching children
          const subOrgMatches =
            !orgSearchTerm ||
            subOrg.subOrgName
              .toLowerCase()
              .includes(orgSearchTerm.toLowerCase()) ||
            subOrg.subOrgGrp?.some((nested: any) =>
              hasMatchingSubOrg(nested, orgSearchTerm)
            )

          if (!subOrgMatches) return null

          return (
            <div key={subOrg.subOrgId}>
              <div
                onClick={() => {
                  setSelectedOrgId(subOrg.subOrgId)
                  setSelectedPsId(
                    subOrg.psGrp?.length && subOrg.psGrp[0]?.ps?.length
                      ? subOrg.psGrp[0].ps[0].psId
                      : null
                  )
                  setOpenOrgGrp('ALL_OPEN')
                  setOpenPsGrp('ALL_OPEN')
                  setOpenRoleGrp('ALL_OPEN')
                }}
                style={{
                  borderColor:
                    selectedOrgId === subOrg.subOrgId ? accentColor : ''
                }}
                className={twMerge(
                  `ml-[1vw] mt-2 w-[300px] cursor-pointer rounded border-2 p-2`,
                  bgColor
                )}
              >
                <div
                  style={{ fontSize: `${fontSize * 0.75}vw` }}
                  className='text-torus-text truncate'
                  title={subOrg.subOrgName}
                >
                  {highlightText(subOrg.subOrgName, orgSearchTerm, accentColor)}
                </div>
                <div
                  style={{ fontSize: `${fontSize * 0.65}vw` }}
                  className='text-torus-text-opacity-50'
                >
                  {subOrg.subOrgCode.split('-').pop()}
                </div>
              </div>

              {/* Recursively render nested subOrgGrp */}
              {subOrg.subOrgGrp?.map((nestedSubOrgGrp: any) => (
                <div key={nestedSubOrgGrp.subOrgGrpId} className='ml-[0.5vw]'>
                  <RenderSubOrg
                    subOrgGrp={nestedSubOrgGrp}
                    selectedOrgId={selectedOrgId}
                    setSelectedOrgId={setSelectedOrgId}
                    setSelectedPsId={setSelectedPsId}
                    setOpenOrgGrp={setOpenOrgGrp}
                    setOpenPsGrp={setOpenPsGrp}
                    setOpenRoleGrp={setOpenRoleGrp}
                    openOrgGrp={openOrgGrp}
                    accentColor={accentColor}
                    fontSize={fontSize}
                    orgSearchTerm={orgSearchTerm}
                  />
                </div>
              ))}
            </div>
          )
        })}
    </div>
  )
}

export default function SecurityTemplateSelection({
  isView = false
}: {
  isView: boolean
}) {
  const { orgGrpData, templateToBeUpdated, setTemplateToBeUpdated } =
    React.useContext(SetupScreenContext) as SetupScreenContextType

  // Updated to collect roles from subOrg as well
  const roleIds = useMemo(() => {
    const roleIds: string[] = []
    const collectRolesFromOrg = (org: OrgItem | SubOrgItem) => {
      org?.psGrp?.forEach(
        (pg: PsGrpItem) =>
          pg?.ps?.forEach(
            (p: PsItem) =>
              p?.roleGrp?.forEach(
                (rg: RoleGrp) =>
                  rg?.roles?.forEach((r: Role) => roleIds.push(r.roleId))
              )
          )
      )

      // Recursively collect from subOrg
      if ('subOrgGrp' in org) {
        org.subOrgGrp?.forEach(
          (subOrgGrp: SubOrgGrpItem) =>
            subOrgGrp?.subOrg?.forEach((subOrg: SubOrgItem) =>
              collectRolesFromOrg(subOrg)
            )
        )
      }
    }

    templateToBeUpdated?.orgGrp?.forEach(
      (og: OrgGrpItem) =>
        og?.org?.forEach((o: OrgItem) => collectRolesFromOrg(o))
    )
    return roleIds
  }, [templateToBeUpdated])

  const [selectedRoles, setSelectedRoles] = useState(roleIds)
  const [openOrgGrp, setOpenOrgGrp] = useState<string | 'ALL_OPEN'>('ALL_OPEN')
  const [openPsGrp, setOpenPsGrp] = useState<string | 'ALL_OPEN'>('ALL_OPEN')
  const [openRoleGrp, setOpenRoleGrp] = useState<string | 'ALL_OPEN'>(
    'ALL_OPEN'
  )
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [selectedPsId, setSelectedPsId] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState<string | null>(null)
  const [orgSearchTerm, setOrgSearchTerm] = useState('')
  const [psSearchTerm, setPsSearchTerm] = useState('')
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const fontSize = 1
  const { branding } = useGlobal()
  const { borderColor, textColor, bgColor, isDark } = useTheme()
  const { brandColor } = branding
  const keyset = i18n.keyset('language')

  const handleOrgClick = (org: OrgItem | SubOrgItem) => {
    setSelectedOrgId((org as OrgItem).orgId || (org as SubOrgItem).subOrgId)
    setSelectedPsId(
      org.psGrp.length && org.psGrp[0].ps.length
        ? org.psGrp[0].ps[0].psId
        : null
    )
    setOpenOrgGrp('ALL_OPEN')
    setOpenPsGrp('ALL_OPEN')
    setOpenRoleGrp('ALL_OPEN')
  }

  const handlePsClick = (psId: string) => {
    setSelectedPsId(psId)
    setOpenPsGrp('ALL_OPEN')
    setOpenRoleGrp('ALL_OPEN')
  }

  function getStructureForSingleRole(roleId: string, data: OrgGrpItem[]) {
    const result: OrgGrpItem[] = []

    const processOrg = (
      org: OrgItem | SubOrgItem
    ): OrgItem | SubOrgItem | null => {
      const newOrg: any = { ...org, psGrp: [] }

      for (const psGrp of org.psGrp) {
        const newPsGrp: PsGrpItem = { ...psGrp, ps: [] }

        for (const ps of psGrp.ps) {
          const newPs: PsItem = { ...ps, roleGrp: [] }

          for (const roleGrp of ps.roleGrp) {
            const roles = roleGrp.roles.filter(r => r.roleId === roleId)
            if (roles.length > 0) newPs.roleGrp.push({ ...roleGrp, roles })
          }

          if (newPs.roleGrp.length > 0) newPsGrp.ps.push(newPs)
        }

        if (newPsGrp.ps.length > 0) newOrg.psGrp.push(newPsGrp)
      }

      // Process subOrgGrp recursively
      if ('subOrgGrp' in org && org.subOrgGrp) {
        newOrg.subOrgGrp = []
        for (const subOrgGrp of org.subOrgGrp) {
          const newSubOrgGrp: SubOrgGrpItem = { ...subOrgGrp, subOrg: [] }

          for (const subOrg of subOrgGrp.subOrg) {
            const processedSubOrg = processOrg(subOrg)
            if (
              processedSubOrg &&
              (processedSubOrg.psGrp.length > 0 ||
                (processedSubOrg as SubOrgItem).subOrgGrp?.length)
            ) {
              newSubOrgGrp.subOrg.push(processedSubOrg as SubOrgItem)
            }
          }

          if (newSubOrgGrp.subOrg.length > 0)
            newOrg.subOrgGrp.push(newSubOrgGrp)
        }
      }

      if (newOrg.psGrp.length > 0 || newOrg.subOrgGrp?.length > 0) return newOrg
      return null
    }

    for (const orgGrp of data) {
      const newOrgGrp: OrgGrpItem = { ...orgGrp, org: [] }

      for (const org of orgGrp.org) {
        const processedOrg = processOrg(org)
        if (processedOrg) newOrgGrp.org.push(processedOrg as OrgItem)
      }

      if (newOrgGrp.org.length > 0) result.push(newOrgGrp)
    }

    return result
  }

  function mergeTree(target: OrgGrpItem[], source: OrgGrpItem[]) {
    const mergeOrgLevel = (tgtOrg: any, srcOrg: any) => {
      // Merge psGrp
      for (const srcPsGrp of srcOrg.psGrp) {
        let tgtPsGrp = tgtOrg.psGrp.find(
          (t: any) => t.psGrpId === srcPsGrp.psGrpId
        )
        if (!tgtPsGrp) {
          tgtOrg.psGrp.push(JSON.parse(JSON.stringify(srcPsGrp)))
          continue
        }

        for (const srcPs of srcPsGrp.ps) {
          let tgtPs = tgtPsGrp.ps.find((t: any) => t.psId === srcPs.psId)
          if (!tgtPs) {
            tgtPsGrp.ps.push(JSON.parse(JSON.stringify(srcPs)))
            continue
          }

          for (const srcRoleGrp of srcPs.roleGrp) {
            let tgtRoleGrp = tgtPs.roleGrp.find(
              (t: any) => t.roleGrpId === srcRoleGrp.roleGrpId
            )
            if (!tgtRoleGrp) {
              tgtPs.roleGrp.push(JSON.parse(JSON.stringify(srcRoleGrp)))
              continue
            }

            for (const role of srcRoleGrp.roles) {
              if (!tgtRoleGrp.roles.find((r: any) => r.roleId === role.roleId))
                tgtRoleGrp.roles.push(role)
            }
          }
        }
      }

      // Merge subOrgGrp
      if (srcOrg.subOrgGrp) {
        if (!tgtOrg.subOrgGrp) tgtOrg.subOrgGrp = []

        for (const srcSubOrgGrp of srcOrg.subOrgGrp) {
          let tgtSubOrgGrp = tgtOrg.subOrgGrp.find(
            (t: any) => t.subOrgGrpId === srcSubOrgGrp.subOrgGrpId
          )
          if (!tgtSubOrgGrp) {
            tgtOrg.subOrgGrp.push(JSON.parse(JSON.stringify(srcSubOrgGrp)))
            continue
          }

          for (const srcSubOrg of srcSubOrgGrp.subOrg) {
            let tgtSubOrg = tgtSubOrgGrp.subOrg.find(
              (t: any) => t.subOrgId === srcSubOrg.subOrgId
            )
            if (!tgtSubOrg) {
              tgtSubOrgGrp.subOrg.push(JSON.parse(JSON.stringify(srcSubOrg)))
              continue
            }

            mergeOrgLevel(tgtSubOrg, srcSubOrg)
          }
        }
      }
    }

    for (const srcGrp of source) {
      let tgtGrp = target.find(t => t.orgGrpId === srcGrp.orgGrpId)
      if (!tgtGrp) {
        target.push(JSON.parse(JSON.stringify(srcGrp)))
        continue
      }

      for (const srcOrg of srcGrp.org) {
        let tgtOrg = tgtGrp.org.find(t => t.orgId === srcOrg.orgId)
        if (!tgtOrg) {
          tgtGrp.org.push(JSON.parse(JSON.stringify(srcOrg)))
          continue
        }

        mergeOrgLevel(tgtOrg, srcOrg)
      }
    }
  }

  function getMergedStructureForRoles(
    roleIds: string[],
    fullData: OrgGrpItem[]
  ) {
    const output: OrgGrpItem[] = []
    for (const id of roleIds) {
      mergeTree(output, getStructureForSingleRole(id, fullData))
    }
    return output
  }

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      const updated = prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]

      const merged = getMergedStructureForRoles(updated, orgGrpData)
      setTemplateToBeUpdated((prev: any) => ({ ...prev, orgGrp: merged }))
      return updated
    })
  }

  useEffect(() => {
    setSelectedRoles(roleIds)
  }, [roleIds])

  // Flatten all orgs including subOrgs for rendering

  const flattenOrgsForDisplay = (orgGrpData: OrgGrpItem[]) => {
    const result: any[] = []

    const processOrg = (org: OrgItem | SubOrgItem, parentId?: string) => {
      result.push({ ...org, parentId })

      if ('subOrgGrp' in org && org.subOrgGrp) {
        org.subOrgGrp.forEach((subOrgGrp: SubOrgGrpItem) => {
          subOrgGrp.subOrg.forEach((subOrg: SubOrgItem) => {
            processOrg(
              subOrg,
              (org as OrgItem).orgId || (org as SubOrgItem).subOrgId
            )
          })
        })
      }
    }

    orgGrpData.forEach((grp: OrgGrpItem) => {
      grp.org.forEach((org: OrgItem) => processOrg(org))
    })

    return result
  }

  const flattenedOrgs = useMemo(
    () => flattenOrgsForDisplay(orgGrpData),
    [orgGrpData]
  )

  return (
    <div className='flex w-full min-w-[650px] gap-[1vw]'>
      {/* ORG SECTION */}
      <div
        className={twMerge(
          'h-[70vh] w-1/3 min-w-[200px] rounded-xl border shadow-md lg:h-[72vh]',
          borderColor
        )}
      >
        <div className='flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <Text
            contentAlign='left'
            className='w-4/5 truncate text-nowrap text-lg font-semibold'
          >
            <span title={keyset('Organization')}>{keyset('Organization')}</span>
          </Text>
          {isSearchOpen === 'org' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={orgSearchTerm}
                onChange={e => setOrgSearchTerm(e.target.value)}
                placeholder={keyset('Search')}
                className={twMerge(
                  `w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm outline-none`,
                  borderColor
                )}
              />
              <Button
                onClick={() => {
                  setIsSearchOpen(null)
                  setOrgSearchTerm('')
                }}
                className='!w-fit !bg-[unset] p-1'
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={isDark ? 'white' : 'black'}
                />
              </Button>
            </div>
          ) : (
            <Button
              className='!w-fit !bg-[unset] p-1'
              onClick={() => {
                setIsSearchOpen('org')
                setOrgSearchTerm('')
                setPsSearchTerm('')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={isDark ? 'white' : 'black'} />
            </Button>
          )}
        </div>
        <hr className={twMerge('border', borderColor)} />

        <div className='flex h-[600px] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {orgGrpData
            .filter((grp: OrgGrpItem) => {
              const lowerSearch = orgSearchTerm.toLowerCase()

              // Check if group name matches
              if (grp.orgGrpName.toLowerCase().includes(lowerSearch)) {
                return true
              }

              // Check if any org or subOrg in this group matches
              return grp.org.some((org: any) =>
                hasMatchingOrgOrSubOrg(org, orgSearchTerm)
              )
            })
            .map((grp: OrgGrpItem) => (
              <div
                key={grp.orgGrpId}
                className='rounded-lg px-[0.5vw] py-[1vh]'
                style={{ backgroundColor: hexWithOpacity(brandColor, 0.1) }}
              >
                {/* ORG GROUP HEADER */}
                <div
                  className='flex cursor-pointer justify-between rounded p-2'
                  onClick={() =>
                    setOpenOrgGrp(
                      openOrgGrp === 'ALL_OPEN' || openOrgGrp === grp.orgGrpId
                        ? ''
                        : grp.orgGrpId
                    )
                  }
                >
                  <div className='flex items-center gap-[.6vw]'>
                    <span
                      className={`w-[0.52vw] ${
                        openOrgGrp === 'ALL_OPEN' || openOrgGrp === grp.orgGrpId
                          ? ''
                          : 'rotate-[-90deg]'
                      }`}
                    >
                      <DownArrow fill={isDark ? 'white' : 'black'} />
                    </span>
                    <Text contentAlign='left' className='text-nowrap'>
                      {grp.orgGrpName}
                    </Text>
                  </div>
                  <Text contentAlign='right'>{grp.org.length}</Text>
                </div>

                {/* ORG LIST */}
                {(openOrgGrp === 'ALL_OPEN' || openOrgGrp === grp.orgGrpId) &&
                  grp.org
                    .filter(org => hasMatchingOrgOrSubOrg(org, orgSearchTerm))
                    .map(org => (
                      <div
                        className={twMerge(
                          'mt-[.8vh] rounded px-2 py-1.5',
                          bgColor
                        )}
                        key={org.orgId}
                      >
                        <div
                          onClick={() => handleOrgClick(org)}
                          style={{
                            borderColor:
                              selectedOrgId === org.orgId ? brandColor : ''
                          }}
                          className={twMerge(`mt-2 w-full cursor-pointer rounded border-2 p-2`, borderColor)}
                        >
                          <div
                            style={{ fontSize: `${fontSize * 0.8}vw` }}
                            className='text-torus-text truncate'
                            title={org.orgName}
                          >
                            {org.orgName}
                          </div>
                          <div
                            style={{ fontSize: `${fontSize * 0.7}vw` }}
                            className='text-torus-text-opacity-50 truncate'
                          >
                            {org.orgCode.split('-').pop()}
                          </div>
                        </div>

                        {/* Render SubOrg Groups */}
                        {org.subOrgGrp?.map((subOrgGrp: SubOrgGrpItem) => (
                          <RenderSubOrg
                            key={subOrgGrp.subOrgGrpId}
                            subOrgGrp={subOrgGrp}
                            selectedOrgId={selectedOrgId}
                            setSelectedOrgId={setSelectedOrgId}
                            setSelectedPsId={setSelectedPsId}
                            setOpenOrgGrp={setOpenOrgGrp}
                            setOpenPsGrp={setOpenPsGrp}
                            setOpenRoleGrp={setOpenRoleGrp}
                            openOrgGrp={openOrgGrp}
                            accentColor={brandColor}
                            fontSize={fontSize}
                            orgSearchTerm={orgSearchTerm}
                          />
                        ))}
                      </div>
                    ))}
              </div>
            ))}
        </div>
      </div>

      {/* PS SECTION */}
      <div
        className={twMerge(
          'h-[70vh] w-1/3 min-w-[200px] rounded-xl border shadow-md lg:h-[72vh]',
          borderColor
        )}
      >
        <div className='flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <Text contentAlign='left' className='w-4/5 truncate text-nowrap text-lg font-semibold'>
            <span title={keyset('Products/Services')}>
              {keyset('Products/Services')}
            </span>
          </Text>
          {isSearchOpen === 'ps' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={psSearchTerm}
                onChange={e => setPsSearchTerm(e.target.value)}
                placeholder={keyset('Search')}
                className={twMerge(
                  `w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm outline-none`,
                  borderColor
                )}
              />
              <Button
                className='!w-fit !bg-[unset] p-1'
                onClick={() => {
                  setIsSearchOpen(null)
                  setPsSearchTerm('')
                }}
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={isDark ? 'white' : 'black'}
                />
              </Button>
            </div>
          ) : (
            <Button
              className='!w-fit !bg-[unset] p-1'
              onClick={() => {
                setIsSearchOpen('ps')
                setPsSearchTerm('')
                setOrgSearchTerm('')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={isDark ? 'white' : 'black'} />
            </Button>
          )}
        </div>

        <hr className={twMerge('border', borderColor)} />

        <div className='flex h-[600px] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {flattenedOrgs
            .filter((org: any) => {
              const orgId = org.orgId || org.subOrgId
              return orgId === selectedOrgId
            })
            .flatMap((org: any) =>
              org.psGrp
                .filter((psGrp: any) =>
                  hasMatchingPsGrpOrPs(psGrp, psSearchTerm)
                )
                .map((pg: any) => (
                  <div
                    key={pg.psGrpId}
                    className='rounded-lg px-[0.5vw] py-[1vh]'
                    style={{
                      backgroundColor: hexWithOpacity(brandColor, 0.1)
                    }}
                  >
                    {/* PS GROUP HEADER */}
                    <div
                      className='flex cursor-pointer justify-between rounded p-2'
                      onClick={() =>
                        setOpenPsGrp(
                          openPsGrp === pg.psGrpId ? null : (pg.psGrpId as any)
                        )
                      }
                    >
                      <div className='flex items-center gap-[.6vw]'>
                        <span
                          className={`w-[0.52vw] ${
                            openPsGrp === 'ALL_OPEN' || openPsGrp === pg.psGrpId
                              ? ''
                              : 'rotate-[-90deg]'
                          }`}
                        >
                          <DownArrow fill={isDark ? 'white' : 'black'} />
                        </span>
                        <Text contentAlign='left' className='text-nowrap'>
                          {highlightText(
                            pg.psGrpName,
                            psSearchTerm,
                            brandColor
                          )}
                        </Text>
                      </div>
                      <Text contentAlign='right'>{pg.ps.length}</Text>
                    </div>

                    {/* PS LIST */}
                    {(openPsGrp === 'ALL_OPEN' || openPsGrp === pg.psGrpId) &&
                      pg.ps.map((ps: any) => (
                        <div
                          key={ps.psId}
                          onClick={() => handlePsClick(ps.psId)}
                          className={twMerge(
                            `mt-2 cursor-pointer rounded border hover:border-[var(--brand-color)] hover:shadow ${borderColor} bg-[var(--g-color-base-background)] p-2`,
                            bgColor
                          )}
                        >
                          <Text contentAlign='left'>
                            {highlightText(ps.psName, psSearchTerm, brandColor)}
                          </Text>
                          <Text contentAlign='left' color='secondary'>
                            {ps.psCode.split('-').pop()}
                          </Text>
                        </div>
                      ))}
                  </div>
                ))
            )}
        </div>
      </div>

      {/* ROLES SECTION */}
      <div
        className={twMerge(
          'h-[600px] w-1/3 min-w-[200px] rounded-xl border shadow-md lg:h-[72vh]',
          borderColor
        )}
      >
        <div className='flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <Text contentAlign='left' className='w-4/5 truncate text-nowrap text-lg font-semibold'>
            <span title={keyset('Roles')}>{keyset('Roles')}</span>
          </Text>
          {isSearchOpen === 'role' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={roleSearchTerm}
                onChange={e => setRoleSearchTerm(e.target.value)}
                placeholder={twMerge('Search')}
                className={twMerge(
                  `w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm outline-none`,
                  borderColor
                )}
              />
              <Button
                className='!w-fit !bg-[unset] p-1'
                onClick={() => {
                  setIsSearchOpen(null)
                  setRoleSearchTerm('')
                }}
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={isDark ? 'white' : 'black'}
                />
              </Button>
            </div>
          ) : (
            <Button
              className='!w-fit !bg-[unset] p-1'
              onClick={() => {
                setIsSearchOpen('role')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={isDark ? 'white' : 'black'} />
            </Button>
          )}
        </div>
        <hr className={twMerge('border', borderColor)} />

        <div className='flex h-[600px] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {flattenedOrgs
            .filter((org: any) => {
              const orgId = org.orgId || org.subOrgId
              return orgId === selectedOrgId
            })
            .flatMap((org: any) =>
              org.psGrp
                .flatMap((pg: any) =>
                  pg.ps.filter((ps: any) => ps.psId === selectedPsId)
                )
                .flatMap((ps: any) =>
                  ps.roleGrp
                    .filter((rg: any) =>
                      hasMatchingRoleGrpOrRole(rg, roleSearchTerm)
                    )
                    .map((rg: any) => (
                      <div
                        key={rg.roleGrpId}
                        className='rounded-lg px-[0.5vw] py-[1vh]'
                        style={{
                          backgroundColor: hexWithOpacity(brandColor, 0.1)
                        }}
                      >
                        {/* ROLE GROUP HEADER */}
                        <div
                          className='flex cursor-pointer justify-between rounded p-2'
                          onClick={() =>
                            setOpenRoleGrp(
                              openRoleGrp === rg.roleGrpId
                                ? null
                                : (rg.roleGrpId as any)
                            )
                          }
                        >
                          <div className='flex items-center gap-[.6vw]'>
                            <span
                              className={`w-[0.52vw] ${
                                openRoleGrp === 'ALL_OPEN' ||
                                openRoleGrp === rg.roleGrpId
                                  ? ''
                                  : 'rotate-[-90deg]'
                              }`}
                            >
                              <DownArrow fill={isDark ? 'white' : 'black'} />
                            </span>
                            <Text contentAlign='left' className='text-nowrap'>
                              {highlightText(
                                rg.roleGrpName,
                                roleSearchTerm,
                                brandColor
                              )}
                            </Text>
                          </div>
                          <Text contentAlign='right'>{rg.roles.length}</Text>
                        </div>

                        {/* ROLE LIST */}
                        {(openRoleGrp === 'ALL_OPEN' ||
                          openRoleGrp === rg.roleGrpId) &&
                          rg.roles.map((role: any) => (
                            <label
                              key={role.roleId}
                              className={twMerge(
                                `mt-2 flex cursor-pointer items-center justify-between rounded border ${borderColor} bg-[var(--g-color-base-background)] p-2 hover:border-[var(--brand-color)] hover:shadow`,
                                bgColor
                              )}
                            >
                              <div>
                                <Text>
                                  {highlightText(
                                    role.roleName,
                                    roleSearchTerm,
                                    brandColor
                                  )}
                                </Text>
                                <Text color='secondary'>
                                  {role.roleCode.split('-').pop()}
                                </Text>
                              </div>

                              <input
                                type='checkbox'
                                checked={selectedRoles.includes(role.roleId)}
                                onChange={() => toggleRole(role.roleId)}
                                disabled={isView}
                                style={{
                                  accentColor: brandColor
                                }}
                              />
                            </label>
                          ))}
                      </div>
                    ))
                )
            )}
        </div>
      </div>
    </div>
  )
}
