import React, { useContext, useMemo, useState } from 'react'
import { SetupScreenContext, SetupScreenContextType } from './setup'
import CustomGrpMemberDropdown from './customGrpMemberDropdown'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { Pagination, Select } from '@gravity-ui/uikit'
import { useGravityThemeClass } from '../utils/useGravityUITheme'

const AccessTemplateTable = ({}) => {
  const toast = useInfoMsg()
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const {
    securityData,
    onUpdateSecurityData,
    orgGrpData,
    selectedRows,
    setSelectedRows,
    selectedOptions,
    setSelectedOptions,
    allOptions,
    setAllOptions,
    getRoleOptions,
    getPsOptions,
    searchTerm
  } = React.useContext(SetupScreenContext) as SetupScreenContextType
  const { property, setProperty } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'
  const [currentPage, setCurrentPage] = useState(1)
  const accessTemplatePerPage = 10
  const themeClass = useGravityThemeClass()

  const filteredData = Object.entries(securityData)
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
    const indexOfLastGroup = currentPage * accessTemplatePerPage
    const indexOfFirstGroup = indexOfLastGroup - accessTemplatePerPage

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup)
  }, [
    securityData,
    filteredData,
    onUpdateSecurityData,
    currentPage,
    searchTerm
  ])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / accessTemplatePerPage)
  }, [securityData, filteredData, currentPage, onUpdateSecurityData])

  function buildSelectedMembers(
    master: any[],
    selectedSecondLevel: any[],
    selectedThirdLevel: any[]
  ) {
    // Helper function to find an object by code
    const findByCode = (arr: any[], code: string, key: string) =>
      arr.find(item => item[key] === code)

    // Create a result array
    const result: any[] = []

    // Iterate over each selected second-level member
    selectedSecondLevel.forEach(secondLevel => {
      const { orgGrpCode, orgCode, roleGrpCode, roles } = secondLevel

      // Find the corresponding orgGrp in the master
      const orgGrp = findByCode(master, orgGrpCode, 'orgGrpCode')
      if (!orgGrp) return

      // Find the corresponding org in the orgGrp
      const org = findByCode(orgGrp.org, orgCode, 'orgCode')
      if (!org) return

      // Find the corresponding roleGrp in the org
      const roleGrp = findByCode(org.roleGrp, roleGrpCode, 'roleGrpCode')
      if (!roleGrp) return

      // Filter roles within the roleGrp based on the selection
      const filteredRoles = roles
        .map((role: any) => {
          const selectedRole = findByCode(
            roleGrp.roles,
            role.roleCode,
            'roleCode'
          )
          if (!selectedRole) return null

          // Filter psGrps within the role based on the third-level selection
          const filteredPsGrps = role.psGrp
            .map((psGrp: any) => {
              const selectedPsGrp = findByCode(
                selectedRole.psGrp,
                psGrp.psGrpCode,
                'psGrpCode'
              )
              if (!selectedPsGrp) return null

              // Filter ps within the psGrp based on the third-level selection
              const psInThirdLevel = findByCode(
                selectedThirdLevel,
                selectedPsGrp.psGrpCode,
                'psGrpCode'
              )
              if (psInThirdLevel) {
                return {
                  ...selectedPsGrp,
                  ps: selectedPsGrp.ps.filter((ps: any) =>
                    psInThirdLevel.ps.some(
                      (selPs: any) => selPs.psCode === ps.psCode
                    )
                  )
                }
              } else {
                return selectedPsGrp
              }
            })
            .filter((psGrp: any) => psGrp !== null)

          return {
            ...selectedRole,
            psGrp: filteredPsGrps
          }
        })
        .filter((role: any) => role !== null)

      // Build the result object for this second-level selection
      const existingOrgGrp = result.find(res => res.orgGrpCode === orgGrpCode)

      if (existingOrgGrp) {
        const existingOrg = existingOrgGrp.org.find(
          (o: any) => o.orgCode === orgCode
        )

        if (existingOrg) {
          const existingRoleGrp = existingOrg.roleGrp.find(
            (rg: any) => rg.roleGrpCode === roleGrpCode
          )

          if (existingRoleGrp) {
            existingRoleGrp.roles.push(...filteredRoles)
          } else {
            existingOrg.roleGrp.push({
              ...roleGrp,
              roles: filteredRoles
            })
          }
        } else {
          existingOrgGrp.org.push({
            ...org,
            roleGrp: [
              {
                ...roleGrp,
                roles: filteredRoles
              }
            ]
          })
        }
      } else {
        result.push({
          ...orgGrp,
          org: [
            {
              ...org,
              roleGrp: [
                {
                  ...roleGrp,
                  roles: filteredRoles
                }
              ]
            }
          ]
        })
      }
    })

    return result
  }

  const updateRolePsOptions = (
    key: string,
    assetType: 'role' | 'ps',
    asset: any[]
  ) => {
    const copyOfAllOptions: any = structuredClone(allOptions)
    switch (assetType) {
      case 'role':
        const roleOptions = getRoleOptions(asset)
        copyOfAllOptions[key].roleOptions = roleOptions
        setAllOptions(copyOfAllOptions)
        break

      default:
        const psOptions = getPsOptions(asset)
        copyOfAllOptions[key].psOptions = psOptions
        setAllOptions(copyOfAllOptions)
        break
    }
  }

  const updateValuesInSource = (
    item: any,
    key: string,
    value: any,
    resourceArray?: any[]
  ) => {
    if (resourceArray?.length) {
      const [organization, roles, ps] = resourceArray
      const copyOfDisplayedData = structuredClone(securityData)
      const indexTobeModifiled = copyOfDisplayedData.findIndex(
        (obj: any) => obj.createdOn === item.createdOn
      )
      copyOfDisplayedData[indexTobeModifiled][key] = value
      copyOfDisplayedData[indexTobeModifiled]['organization'] = organization
      copyOfDisplayedData[indexTobeModifiled]['roles'] = roles
      copyOfDisplayedData[indexTobeModifiled]['products/Services'] = ps
      onUpdateSecurityData(copyOfDisplayedData)
    }
  }

  const handleOrgSelection = (item: any, org: any) => {
    const copyOfSelectedOptions: any = structuredClone(selectedOptions)
    copyOfSelectedOptions[item.createdOn].selectedOrg = org
    copyOfSelectedOptions[item.createdOn].selectedRg = []
    copyOfSelectedOptions[item.createdOn].selectedPsg = []
    updateRolePsOptions(item.createdOn, 'role', org)
    setSelectedOptions(copyOfSelectedOptions)
  }

  const handleRoleSelection = (item: any, role: any) => {
    const copyOfSelectedOptions: any = structuredClone(selectedOptions)
    copyOfSelectedOptions[item.createdOn].selectedRg = role
    copyOfSelectedOptions[item.createdOn].selectedPsg = []
    updateRolePsOptions(item.createdOn, 'ps', role)
    setSelectedOptions(copyOfSelectedOptions)
  }

  const handlePsSelection = (item: any, ps: any) => {
    const copyOfSelectedOptions: any = structuredClone(selectedOptions)
    copyOfSelectedOptions[item.createdOn].selectedPsg = ps
    const { selectedOrg, selectedRg } = copyOfSelectedOptions[item.createdOn]
    const res = buildSelectedMembers(selectedOrg, selectedRg, ps)
    updateValuesInSource(item, 'orgGrp', res, [selectedOrg, selectedRg, ps])
    setSelectedOptions(copyOfSelectedOptions)
  }

  const handleRowSelection = (accessProfile: string) => {
    const copyOfSelectedRows = structuredClone(selectedRows)
    if (copyOfSelectedRows.has('all')) {
      copyOfSelectedRows.delete('all')
      securityData.forEach((item: any) => {
        if (item.accessProfile != accessProfile)
          copyOfSelectedRows.add(item.accessProfile)
      })
    } else if (copyOfSelectedRows.has(accessProfile)) {
      copyOfSelectedRows.delete(accessProfile)
    } else {
      copyOfSelectedRows.add(accessProfile)
    }
    setSelectedRows(copyOfSelectedRows)
  }

  const handleEdit = (path: string | null) => {
    setEditingCell(path)
  }

  const handleChangeValue = (item: any, key: string, value: string) => {
    const copyOfDisplayedData = structuredClone(securityData)
    const foundIndex = copyOfDisplayedData.findIndex(
      (obj: any) => obj.createdOn === item.createdOn
    )
    if (
      securityData.find((item: any) => item.accessProfile === value) &&
      key == 'accessProfile'
    ) {
      toast('Please provide unique access template name', 'warning')
      return
    }
    copyOfDisplayedData[foundIndex][key] = value
    onUpdateSecurityData(copyOfDisplayedData)
  }

  const TemplateNotEditable = (template: any, index: number) => {
    if (template['no.ofusers'] !== 0) {
      toast(
        "This Template is Assigned to the User, So it can't be edited.",
        'warning'
      )
      return
    }
    handleEdit(`${index}.accessProfile`)
  }

  const accessPrivilegeData = ['Full', 'Limited']

  return (
    <div className={`g-root h-full w-full ${themeClass}`}>
      <h2 className='mb-4 text-xl font-bold'>Access Template</h2>
      <div className='h-[72vh] w-full overflow-x-auto'>
        <table className='min-w-full rounded text-left'>
          <thead>
            <tr
              className='rounded border'
              style={{
                borderColor: 'var(--g-color-line-generic)'
              }}
            >
              <th className='px-1 py-4'>
                <input
                  type='checkbox'
                  className='cursor-pointer'
                  style={{ accentColor: brandcolor ?? 'unset' }}
                  checked={selectedRows.has('all')}
                  onChange={() => {
                    selectedRows.has('all')
                      ? setSelectedRows(new Set([]))
                      : setSelectedRows(new Set(['all']))
                  }}
                />
              </th>
              <th className='px-5 py-4'>Access Template</th>
              <th className='px-4 py-4'>Data Access Privilege</th>
              <th className='px-4 py-4'>Organization</th>
              <th className='px-4 py-4'>Roles</th>
              <th className='px-4 py-4'>Products/ Services</th>
              <th className='px-2 py-4'>No.ofusers</th>
              <th className='px-4 py-4'>Created On</th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map((template: any, index: number) => (
              <tr key={index}>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  <input
                    type='checkbox'
                    className='cursor-pointer'
                    style={{ accentColor: brandcolor ?? 'unset' }}
                    checked={
                      selectedRows.has(template.accessProfile) ||
                      selectedRows.has('all')
                    }
                    onChange={() => handleRowSelection(template.accessProfile)}
                    hidden={template['no.ofusers'] !== 0}
                  />
                </td>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  <div
                    onDoubleClick={() =>
                      TemplateNotEditable(template, template.originalIndex)
                    }
                    className={`ml-3 w-[12.29vw]  p-3 ${template['no.ofusers'] == 0 ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {template['no.ofusers'] == 0 &&
                    editingCell ===
                      `${template.originalIndex}.accessProfile` ? (
                      <input
                        type='text'
                        autoFocus
                        defaultValue={template?.accessProfile}
                        onFocus={() =>
                          handleEdit(`${template.originalIndex}.accessProfile`)
                        }
                        onKeyDown={(e: any) => {
                          if (e.key === 'Enter') {
                            handleChangeValue(
                              template,
                              `accessProfile`,
                              e.target.value
                            )
                            handleEdit(null)
                          }
                        }}
                        onBlur={e => {
                          handleChangeValue(
                            template,
                            `accessProfile`,
                            e.target.value
                          )
                          handleEdit(null)
                        }}
                        className={`border outline-none rounded p-1`}
                        style={{
                          backgroundColor: 'var(--g-color-base-background)',
                          color: 'var(--g-color-text-primary)',
                          borderColor: 'var(--g-color-line-generic)'
                        }}
                      />
                    ) : (
                      template.accessProfile
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    <Select
                      value={[
                        template.dap === 'f'
                          ? 'Full'
                          : template.dap === 'l'
                            ? 'Limited'
                            : 'Select DAP'
                      ]}
                      onUpdate={data =>
                        handleChangeValue(
                          template,
                          'dap',
                          data[0] === 'Full'
                            ? 'f'
                            : data[0] === 'Limited'
                              ? 'l'
                              : ''
                        )
                      }
                      width={'max'}
                      size='l'
                      placeholder='Select DAP'
                      className='w-full'
                    >
                      {accessPrivilegeData.map((item, index) => (
                        <Select.Option key={index} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </td>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  <div>
                    <CustomGrpMemberDropdown
                      data={orgGrpData}
                      groupKey='orgGrp'
                      memberKey='org'
                      memberCodeKey='orgCode'
                      memberNameKey='orgName'
                      groupCodeKey='orgGrpCode'
                      groupNameKey='orgGrpName'
                      selected={
                        selectedOptions[template?.createdOn]?.selectedOrg ?? []
                      }
                      setSelected={(org: any) =>
                        handleOrgSelection(template, org)
                      }
                    />
                  </div>
                </td>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  <div>
                    <CustomGrpMemberDropdown
                      data={allOptions[template?.createdOn]?.roleOptions ?? []}
                      groupKey='roleGrp'
                      memberKey='roles'
                      memberCodeKey='roleCode'
                      memberNameKey='roleName'
                      groupCodeKey='roleGrpCode'
                      groupNameKey='roleGrpName'
                      selected={
                        selectedOptions[template?.createdOn]?.selectedRg ?? []
                      }
                      setSelected={(role: any) =>
                        handleRoleSelection(template, role)
                      }
                      isDisabled={false}
                      parentKey='orgCode'
                    />
                  </div>
                </td>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  <div>
                    <CustomGrpMemberDropdown
                      data={allOptions[template?.createdOn]?.psOptions ?? []}
                      groupKey='psGrp'
                      memberKey='ps'
                      memberCodeKey='psCode'
                      memberNameKey='psName'
                      groupCodeKey='psGrpCode'
                      groupNameKey='psGrpName'
                      selected={
                        selectedOptions[template?.createdOn]?.selectedPsg ?? []
                      }
                      setSelected={(ps: any) => handlePsSelection(template, ps)}
                      isDisabled={false}
                      parentKey='roleCode'
                    />
                  </div>
                </td>
                <td className='px-[0.29vw] py-[0.31vh] text-center'>
                  {template['no.ofusers']}
                </td>
                <td className='px-[0.29vw] py-[0.31vh]'>
                  {template.createdOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        className='justify-center'
        page={currentPage}
        pageSize={accessTemplatePerPage}
        total={securityData.length}
        onUpdate={setCurrentPage}
      />
    </div>
  )
}

export default AccessTemplateTable
