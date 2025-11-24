import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Multiply, DownArrow, SearchIcon } from '../svgApplication'
import { hexWithOpacity } from '../utils'
import { twMerge } from 'tailwind-merge'
import { SetupScreenContext, SetupScreenContextType } from '../setup'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { Button } from '@gravity-ui/uikit'

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
interface OrgItem {
  orgCode: string
  orgName: string
  orgId: string
  psGrp: PsGrpItem[]
}
interface OrgGrpItem {
  orgGrpCode: string
  orgGrpName: string
  orgGrpId: string
  org: OrgItem[]
}

export default function SecurityTemplateSelection() {
  const { orgGrpData, templateToBeUpdated, setTemplateToBeUpdated } =
    React.useContext(SetupScreenContext) as SetupScreenContextType
  const roleIds = useMemo(() => {
    const roleIds: string[] = []
    templateToBeUpdated?.orgGrp?.forEach(
      (og: OrgGrpItem) =>
        og?.org?.forEach(
          (o: OrgItem) =>
            o?.psGrp?.forEach(
              (pg: PsGrpItem) =>
                pg?.ps?.forEach(
                  (p: PsItem) =>
                    p?.roleGrp?.forEach(
                      (rg: RoleGrp) =>
                        rg?.roles?.forEach((r: Role) => roleIds.push(r.roleId))
                    )
                )
            )
        )
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
  const { property } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'

  const handleOrgClick = (org: OrgItem) => {
    setSelectedOrgId(org.orgId)
    setSelectedPsId(org?.psGrp?.length && org?.psGrp?.[0]?.ps?.length ? org?.psGrp?.[0].ps?.[0].psId : null)
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
    for (const orgGrp of data) {
      const newOrgGrp: OrgGrpItem = { ...orgGrp, org: [] }

      for (const org of orgGrp.org) {
        const newOrg: OrgItem = { ...org, psGrp: [] }

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

        if (newOrg.psGrp.length > 0) newOrgGrp.org.push(newOrg)
      }

      if (newOrgGrp.org.length > 0) result.push(newOrgGrp)
    }
    return result
  }

  function mergeTree(target: OrgGrpItem[], source: OrgGrpItem[]) {
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

        for (const srcPsGrp of srcOrg.psGrp) {
          let tgtPsGrp = tgtOrg.psGrp.find(t => t.psGrpId === srcPsGrp.psGrpId)
          if (!tgtPsGrp) {
            tgtOrg.psGrp.push(JSON.parse(JSON.stringify(srcPsGrp)))
            continue
          }

          for (const srcPs of srcPsGrp.ps) {
            let tgtPs = tgtPsGrp.ps.find(t => t.psId === srcPs.psId)
            if (!tgtPs) {
              tgtPsGrp.ps.push(JSON.parse(JSON.stringify(srcPs)))
              continue
            }

            for (const srcRoleGrp of srcPs.roleGrp) {
              let tgtRoleGrp = tgtPs.roleGrp.find(
                t => t.roleGrpId === srcRoleGrp.roleGrpId
              )
              if (!tgtRoleGrp) {
                tgtPs.roleGrp.push(JSON.parse(JSON.stringify(srcRoleGrp)))
                continue
              }

              for (const role of srcRoleGrp.roles) {
                if (!tgtRoleGrp.roles.find(r => r.roleId === role.roleId))
                  tgtRoleGrp.roles.push(role)
              }
            }
          }
        }
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

  // Add this useEffect to sync selectedRoles with external changes
  useEffect(() => {
    setSelectedRoles(roleIds)
  }, [roleIds])

  return (
    <div className='flex w-full gap-[1vw]'>
      {/* ORG SECTION */}
      <div className='border-[var(--g-color-line-generic)] h-[74vh] w-1/3 rounded-xl border shadow-md'>
        <div className='bg-torus-bg-card flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <h2 className='text-lg font-semibold'>Organization</h2>
          {isSearchOpen === 'org' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={orgSearchTerm}
                onChange={e => setOrgSearchTerm(e.target.value)}
                placeholder='Search...'
                onFocus={e => (e.target.style.borderColor = brandcolor)}
                onBlur={e =>
                  (e.target.style.borderColor = 'var(--torus-text-opacity-15)')
                }
                className={`bg-[var(--g-color-base-background)] text-[var(--g-color-text-primary)] border-[var(--g-color-line-generic)] w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm outline-none`}
              />
              <Button
                onClick={() => {
                  setIsSearchOpen(null)
                  setOrgSearchTerm('')
                }}
                className='flex items-center'
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={'var(--g-color-text-primary)'}
                />
              </Button>
            </div>
          ) : (
            <Button
            className='flex items-center'
              onClick={() => {
                setIsSearchOpen('org')
                setOrgSearchTerm('')
                setPsSearchTerm('')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={'var(--g-color-text-primary)'} />
            </Button>
          )}
        </div>
        <hr className='border-[var(--g-color-line-generic)] border' />

        <div className='flex h-[72vh] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {orgGrpData
            .filter((grp: OrgGrpItem) =>
              grp.orgGrpName.toLowerCase().includes(orgSearchTerm.toLowerCase())
            )
            .map((grp: OrgGrpItem) => (
              <div
                key={grp.orgGrpId}
                className='rounded-lg px-[0.5vw] py-[1vh]'
                style={{ backgroundColor: hexWithOpacity(brandcolor, 0.1) }}
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
                      <DownArrow fill={'var(--g-color-text-primary)'} />
                    </span>
                    <span
                      style={{
                        fontSize: `${fontSize * 0.75}vw`
                      }}
                      className='text-torus-text'
                    >
                      {grp.orgGrpName}
                    </span>
                  </div>
                  <span>{grp.org.length}</span>
                </div>

                {/* ORG LIST */}
                {(openOrgGrp === 'ALL_OPEN' || openOrgGrp === grp.orgGrpId) &&
                  grp.org.map(org => (
                    <div
                      key={org.orgId}
                      onClick={() => handleOrgClick(org)}
                      className={twMerge(
                        `hover:border-[var(--brand-color)] hover:shadow mt-2 cursor-pointer rounded border-[var(--g-color-line-generic)] border p-2 bg-[var(--g-color-base-background)]`,

                        selectedOrgId === org.orgId
                          ? 'bg-unset border-[var(--brand-color)]'
                          : '',
                      )}
                    >
                      <div
                        style={{
                          fontSize: `${fontSize * 0.8}vw`
                        }}
                        className='text-torus-text'
                      >
                        {org.orgName}
                      </div>
                      <div
                        style={{
                          fontSize: `${fontSize * 0.7}vw`
                        }}
                        className='text-torus-text-opacity-50'
                      >
                        {org.orgCode.split("-").pop()}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>

      {/* PS SECTION */}
      <div className='border-[var(--g-color-line-generic)] h-[74vh] w-1/3 rounded-xl border shadow-md'>
        <div className='bg-torus-bg-card flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <h2 className='text-nowrap text-lg font-semibold'>
            Products / Services
          </h2>
          {isSearchOpen === 'ps' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={psSearchTerm}
                onChange={e => setPsSearchTerm(e.target.value)}
                placeholder='Search...'
                onFocus={e => (e.target.style.borderColor = brandcolor)}
                onBlur={e =>
                  (e.target.style.borderColor = 'var(--torus-text-opacity-15)')
                }
                className={`bg-[var(--g-color-base-background)] text-[var(--g-color-text-primary)] border-[var(--g-color-line-generic)] w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm focus:outline-none`}
              />
              <Button
                 className='flex items-center'
                onClick={() => {
                  setIsSearchOpen(null)
                  setPsSearchTerm('')
                }}
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={'var(--g-color-text-primary)'}
                />
              </Button>
            </div>
          ) : (
            <Button
               className='flex items-center'
              onClick={() => {
                setIsSearchOpen('ps')
                setPsSearchTerm('')
                setOrgSearchTerm('')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={'var(--g-color-text-primary)'} />
            </Button>
          )}
        </div>
        <hr className='border-[var(--g-color-line-generic)] border' />

        <div className='flex h-[72vh] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {orgGrpData.flatMap((grp: OrgGrpItem) =>
            grp.org
              .filter(
                org =>
                  // !selectedOrgId ||   //commented to show only selected org
                  org.orgId === selectedOrgId
              )
              .flatMap(org =>
                org.psGrp
                  .filter(org =>
                    org.psGrpName
                      .toLowerCase()
                      .includes(psSearchTerm.toLowerCase())
                  )
                  .map(pg => (
                    <div
                      key={pg.psGrpId}
                      className='rounded-lg px-[0.5vw] py-[1vh]'
                      style={{
                        backgroundColor: hexWithOpacity(brandcolor, 0.1)
                      }}
                    >
                      {/* PS GROUP HEADER */}
                      <div
                        className='flex cursor-pointer justify-between rounded p-2'
                        onClick={() =>
                          setOpenPsGrp(
                            openPsGrp === pg.psGrpId
                              ? null
                              : (pg.psGrpId as any)
                          )
                        }
                      >
                        <div className='flex items-center gap-[.6vw]'>
                          <span
                            className={`w-[0.52vw] ${
                              openPsGrp === 'ALL_OPEN' ||
                              openPsGrp === pg.psGrpId
                                ? ''
                                : 'rotate-[-90deg]'
                            }`}
                          >
                            <DownArrow fill={'var(--g-color-text-primary)'} />
                          </span>
                          <span
                            style={{
                              fontSize: `${fontSize * 0.75}vw`
                            }}
                            className='text-torus-text'
                          >
                            {pg.psGrpName}
                          </span>
                        </div>
                        <span>{pg.ps.length}</span>
                      </div>

                      {/* PS LIST */}
                      {(openPsGrp === 'ALL_OPEN' || openPsGrp === pg.psGrpId) &&
                        pg.ps.map(ps => (
                          <div
                            key={ps.psId}
                            onClick={() => handlePsClick(ps.psId)}
                            className={twMerge(
                              `hover:border-[var(--brand-color)] hover:shadow mt-2 cursor-pointer rounded border border-[var(--g-color-line-generic)] p-2 bg-[var(--g-color-base-background)]`,
                              selectedPsId === ps.psId
                                ? 'bg-unset border-[var(--brand-color)]'
                                : '',
                            )}
                          >
                            <div
                              style={{
                                fontSize: `${fontSize * 0.8}vw`
                              }}
                              className='text-torus-text'
                            >
                              {ps.psName}
                            </div>
                            <div
                              style={{
                                fontSize: `${fontSize * 0.7}vw`
                              }}
                              className='text-torus-text-opacity-50'
                            >
                              {ps.psCode.split("-").pop()}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))
              )
          )}
        </div>
      </div>

      {/* ROLES SECTION */}
      <div className='border-[var(--g-color-line-generic)] h-[74vh] w-1/3 rounded-xl border shadow-md'>
        <div className='bg-torus-bg-card flex w-full items-center justify-between rounded-t-lg px-[.8vw] py-[.5vh]'>
          <h2 className='text-lg font-semibold'>Roles</h2>
          {isSearchOpen === 'role' ? (
            <div className='flex w-[8vw] gap-[.5vw]'>
              <input
                value={roleSearchTerm}
                onChange={e => setRoleSearchTerm(e.target.value)}
                placeholder='Search...'
                onFocus={e => (e.target.style.borderColor = brandcolor)}
                onBlur={e =>
                  (e.target.style.borderColor = 'var(--torus-text-opacity-15)')
                }
                className={`bg-[var(--g-color-base-background)] text-[var(--g-color-text-primary)] border-[var(--g-color-line-generic)] w-full rounded-xl border px-[.5vw] py-[.2vh] text-sm focus:outline-none`}
              />
              <Button
                 className='flex items-center'
                onClick={() => {
                  setIsSearchOpen(null)
                  setRoleSearchTerm('')
                }}
              >
                <Multiply
                  height='.7vw'
                  width='.7vw'
                  fill={'var(--g-color-text-primary)'}
                />
              </Button>
            </div>
          ) : (
            <Button
               className='flex items-center'
              onClick={() => {
                setIsSearchOpen('role')
                setRoleSearchTerm('')
              }}
            >
              <SearchIcon fill={'var(--g-color-text-primary)'} />
            </Button>
          )}
        </div>
        <hr className='border-[var(--g-color-line-generic)] border' />

        <div className='flex h-[72vh] flex-col gap-[.8vh] overflow-y-auto px-[.5vw] py-[1.2vh] scrollbar-hide'>
          {orgGrpData.flatMap((grp: OrgGrpItem) =>
            grp.org
              .filter(
                org =>
                  // !selectedOrgId || //commented to show only selected org
                  org.orgId === selectedOrgId
              )
              .flatMap(org =>
                org.psGrp.flatMap(pg =>
                  pg.ps
                    .filter(
                      ps =>
                        //  !selectedPsId || //commented to show only selected ps
                        ps.psId === selectedPsId
                    )
                    .flatMap(ps =>
                      ps.roleGrp
                        .filter(ps =>
                          ps.roleGrpName
                            .toLowerCase()
                            .includes(roleSearchTerm.toLowerCase())
                        )
                        .map(rg => (
                          <div
                            key={rg.roleGrpId}
                            className='rounded-lg px-[0.5vw] py-[1vh]'
                            style={{
                              backgroundColor: hexWithOpacity(brandcolor, 0.1)
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
                                  <DownArrow fill={'var(--g-color-text-primary)'} />
                                </span>
                                <span
                                  style={{
                                    fontSize: `${fontSize * 0.75}vw`
                                  }}
                                  className='text-torus-text'
                                >
                                  {rg.roleGrpName}
                                </span>
                              </div>
                              <span>{rg.roles.length}</span>
                            </div>

                            {/* ROLE LIST */}
                            {(openRoleGrp === 'ALL_OPEN' ||
                              openRoleGrp === rg.roleGrpId) &&
                              rg.roles.map(role => (
                                <label
                                  key={role.roleId}
                                  className=' mt-2 flex cursor-pointer items-center justify-between rounded border border-[var(--g-color-line-generic)] p-2 hover:border-[var(--brand-color)] hover:shadow bg-[var(--g-color-base-background)]'
                                >
                                  <div>
                                    <div
                                      style={{
                                        fontSize: `${fontSize * 0.8}vw`
                                      }}
                                      className='text-torus-text'
                                    >
                                      {role.roleName}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: `${fontSize * 0.7}vw`
                                      }}
                                      className='text-torus-text-opacity-50'
                                    >
                                      {role.roleCode.split("-").pop()}
                                    </div>
                                  </div>

                                  <input
                                    type='checkbox'
                                    checked={selectedRoles.includes(
                                      role.roleId
                                    )}
                                    onChange={() => toggleRole(role.roleId)}
                                  />
                                </label>
                              ))}
                          </div>
                        ))
                    )
                )
              )
          )}
        </div>
      </div>
    </div>
  )
}
