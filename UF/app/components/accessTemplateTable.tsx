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
      arr.find((item) => item[key] === code);

    // Create a result array
    const result: any[] = [];

    // Iterate over each selected second-level member
    selectedSecondLevel.forEach((secondLevel) => {
      const { orgGrpCode, orgCode, psGrpCode, ps } = secondLevel;

      // Find the corresponding orgGrp in the master
      const orgGrp = findByCode(master, orgGrpCode, "orgGrpCode");
      if (!orgGrp) return;

      // Find the corresponding org in the orgGrp
      const org = findByCode(orgGrp.org, orgCode, "orgCode");
      if (!org) return;

      // Find the corresponding roleGrp in the org
      const psGrp = findByCode(org.psGrp, psGrpCode, "psGrpCode");
      if (!psGrp) return;

      // Filter roles within the roleGrp based on the selection
      const filteredPS = ps
        .map((prod: any) => {
          const selectedPs = findByCode(
            psGrp.ps,
            prod.psCode,
            "psCode"
          );
          if (!selectedPs) return null;

          // Filter psGrps within the role based on the third-level selection
          const filteredRoleGrps = prod.roleGrp
            .map((roleGrp: any) => {
              const selectedRoleGrp = findByCode(
                selectedPs.roleGrp,
                roleGrp.roleGrpCode,
                "roleGrpCode"
              );
              if (!selectedRoleGrp) return null;

              // Filter role within the roleGrp based on the third-level selection
              const roleInThirdLevel = findByCode(
                selectedThirdLevel,
                selectedRoleGrp.roleGrpCode,
                "roleGrpCode"
              );
              if (roleInThirdLevel) {
                return {
                  ...selectedRoleGrp,
                  roles: selectedRoleGrp.roles.filter((role: any) =>
                    roleInThirdLevel.roles.some(
                      (selRole: any) => selRole.roleCode === role.roleCode
                    )
                  ),
                };
              } else {
                return {
                  ...selectedRoleGrp,
                  roles : []
                };
              }
            })
            .filter((roleGrp: any) => roleGrp !== null);

          return {
            ...selectedPs,
            roleGrp: filteredRoleGrps,
          };
        })
        .filter((prod: any) => prod !== null);

      // Build the result object for this second-level selection
      const existingOrgGrp = result.find((res) => res.orgGrpCode === orgGrpCode);

      if (existingOrgGrp) {
        const existingOrg = existingOrgGrp.org.find(
          (o: any) => o.orgCode === orgCode
        );

        if (existingOrg) {
          const existingPsGrp = existingOrg.psGrp.find(
            (psg: any) => psg.psGrpCode === psGrpCode
          );

          if (existingPsGrp) {
            existingPsGrp.ps.push(...filteredPS);
          } else {
            existingOrg.psGrp.push({
              ...psGrp,
              ps: filteredPS,
            });
          }
        } else {
          existingOrgGrp.org.push({
            ...org,
            psGrp: [
              {
                ...psGrp,
                ps: filteredPS,
              },
            ],
          });
        }
      } else {
        result.push({
          ...orgGrp,
          org: [
            {
              ...org,
              psGrp: [
                {
                  ...psGrp,
                  ps: filteredPS,
                },
              ],
            },
          ],
        });
      }
    });

    return result;
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

  const handleOrgSelection = (item:any ,org: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedOrg = org;
    copyOfSelectedOptions[item.createdOn].selectedRg = [];
    copyOfSelectedOptions[item.createdOn].selectedPsg = [];
    updateRolePsOptions(item.createdOn, "ps", org);
    setSelectedOptions(copyOfSelectedOptions);
  };

  const handlePsSelection = (item:any ,ps: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedPsg = ps;
    copyOfSelectedOptions[item.createdOn].selectedRg = [];
    updateRolePsOptions(item.createdOn, "role", ps);
    setSelectedOptions(copyOfSelectedOptions);
  };

  const handleRoleSelection = (item:any ,role: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedRg = role;
    const { selectedOrg, selectedPsg } = copyOfSelectedOptions[item.createdOn];
    const res = buildSelectedMembers(selectedOrg, selectedPsg , role);
    updateValuesInSource(item, "orgGrp", res, [selectedOrg, role, selectedPsg]);
    setSelectedOptions(copyOfSelectedOptions);
  };

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
      <div className='h-[73vh] w-full overflow-x-auto'>
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
                  disabled={
                    currentGroups.some((item: any) => item['no.ofusers'] !== 0)
                  }
                />
              </th>
              <th className='px-4 py-4 w-[250px]'>Access Template</th>
              <th className='px-4 py-4 w-[200px]'>Data Access Privilege</th>
              <th className='px-4 py-4 w-[250px]'>Organization</th>
              <th className='px-4 py-4 w-[220px]'>Products/ Services</th>
              <th className='px-4 py-4 w-[220px]'>Roles</th>
              <th className='px-2 py-4 w-[220px]'>No.ofusers</th>
              <th className='px-4 py-4 w-[220px]'>Created On</th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map((template: any, index: number) => (
              <tr key={index}>
                <td className='px-1 py-1'>
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
                <td className='px-1 py-1  w-[250px]'>
                  <div
                    onDoubleClick={() =>
                      TemplateNotEditable(template, template.originalIndex)
                    }
                    className={`ml-3 w-[12.29vw] truncate p-3 ${template['no.ofusers'] == 0 ? 'cursor-pointer' : 'cursor-default'}`}
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
                <td className='px-1 py-1 w-[200px]'>
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
                <td className='px-1 py-1 w-[250px]'>
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
                <td className='px-1 py-1 w-[220px]'>
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
                      parentKey='orgCode'
                    />
                  </div>
                </td>
                <td className='px-1 py-1 w-[220px]'>
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
                      parentKey='psCode'
                    />
                  </div>
                </td>
                
                <td className='px-1 py-1 text-center'>
                  {template['no.ofusers']}
                </td>
                <td className='px-1 py-1 w-[220px]'>
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
