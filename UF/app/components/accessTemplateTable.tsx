import React, { useMemo, useState } from 'react'
import { SetupScreenContext, SetupScreenContextType } from './setup'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { EditIcon } from './svgApplication'
import OrgMatrixTreeComponent from './AccessTemplateTable/OrgMatrixTreeComponent'
import { Text } from '@/components/Text'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { Pagination } from '@/components/Pagination'

const AccessTemplateTable = ({}) => {
  const toast = useInfoMsg()
  const {
    securityData,
    onUpdateSecurityData,
    selectedRows,
    setSelectedRows,
    searchTerm,
    templateToBeUpdated,
    setTemplateToBeUpdated,
    setIndexOfTemplateToBeUpdated
  } = React.useContext(SetupScreenContext) as SetupScreenContextType
  const [currentPage, setCurrentPage] = useState(1)
  const accessTemplatePerPage = 10
  const { branding } = useGlobal()
  const { borderColor } = useTheme()
  const { brandColor } = branding

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

  const accessPrivilegeData = ['Full', 'Limited']

  if (templateToBeUpdated) {
    return <OrgMatrixTreeComponent />
  }

  return (
    <div className={`g-root h-full w-full`}>
      <Text variant='body-2' className='mb-4 text-xl font-bold'>Access Template</Text>
      <div className='h-[73vh] w-full overflow-x-auto'>
        <table className='min-w-full rounded text-left'>
          <thead>
            <tr
              className='rounded border'
              style={{
                borderColor: borderColor
              }}
            >
              <th className='px-1 py-4'>
                <input
                  type='checkbox'
                  className='cursor-pointer'
                  style={{ accentColor: brandColor ?? 'unset' }}
                  checked={selectedRows.has('all')}
                  onChange={() => {
                    selectedRows.has('all')
                      ? setSelectedRows(new Set([]))
                      : setSelectedRows(new Set(['all']))
                  }}
                  disabled={currentGroups.some(
                    (item: any) => item['no.ofusers'] !== 0
                  )}
                />
              </th>
              <th className='w-[250px] px-4 py-4'>Access Template</th>
              <th className='w-[200px] px-4 py-4'>Data Access Privilege</th>
              <th className='w-[220px] px-2 py-4'>No.ofusers</th>
              <th className='w-[220px] px-4 py-4'>Created On</th>
              <th className='w-[600px] px-4 py-4'></th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map((template: any, index: number) => (
              <tr key={index}>
                <td className='w-8 px-1 py-1'>
                  <input
                    type='checkbox'
                    className='cursor-pointer'
                    style={{ accentColor: brandColor ?? 'unset' }}
                    checked={
                      selectedRows.has(template.accessProfile) ||
                      selectedRows.has('all')
                    }
                    onChange={() => handleRowSelection(template.accessProfile)}
                    hidden={template['no.ofusers'] !== 0}
                  />
                </td>
                <td className='w-[250px] px-1  py-1'>
                  <div
                    className={`ml-3 w-[12.29vw] cursor-default truncate rounded border border-[var(--g-color-line-generic)] p-3`}
                  >
                    {template?.accessProfile}
                  </div>
                </td>
                <td className='w-[200px] px-1 py-1'>
                  <div
                    className={`ml-3 w-[12.29vw] cursor-default truncate rounded border border-[var(--g-color-line-generic)] p-3`}
                  >
                    {template.dap === 'f'
                      ? 'Full'
                      : template.dap === 'l'
                      ? 'Limited'
                      : 'Select DAP'}
                  </div>
                </td>
                <td className='px-1 py-1 text-center'>
                  {template['no.ofusers']}
                </td>
                <td className='w-[220px] px-1 py-1'>{template.createdOn}</td>
                <td className='flex w-[600px] items-center justify-end px-1 py-1'>
                  <button
                    className='g-button g-button_view_normal g-button_size_m g-button_pin_round-round flex items-center'
                    onClick={() => {
                      if (template?.['no.ofusers'] !== 0) {
                        toast(
                          "This Template is Assigned to the User, So it can't be edited.",
                          'warning'
                        )
                        return
                      }
                      setTemplateToBeUpdated(template)
                      setIndexOfTemplateToBeUpdated(
                        securityData.indexOf(template)
                      )
                    }}
                  >
                    <EditIcon
                      fill='var(--g-color-text-primary)'
                      height='0.8vw'
                      width='0.8vw'
                    />
                    edit
                  </button>
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
        onUpdate={(data) => setCurrentPage(data.page)}
      />
    </div>
  )
}

export default AccessTemplateTable
