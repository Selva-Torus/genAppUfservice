import React, { useMemo, useState } from 'react'
import { SetupScreenContext, SetupScreenContextType } from '..'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { EditIcon, Preview } from '../../../components/svgApplication'
import OrgMatrixTreeComponent from './OrgMatrixTreeComponent'
import { Text } from '@/components/Text'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { Pagination } from '@/components/Pagination'
import i18n from '../../../components/i18n'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/Button'
import ViewSecurityTemplate from './ViewSecurityTemplate'
import { getFontSizeForHeader } from '@/app/utils/branding'

const AccessTemplateTable = ({
  isView = false,
  setIsView
}: {
  isView: boolean
  setIsView: React.Dispatch<React.SetStateAction<boolean>>
}) => {
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
  const { borderColor, isDark, hoverBgColor } = useTheme()
  const { brandColor } = branding
  const keyset = i18n.keyset('language')

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

  if (templateToBeUpdated) {
    if (isView) return <ViewSecurityTemplate setIsView={setIsView} />
    return <OrgMatrixTreeComponent isView={isView} setIsView={setIsView} />
  }

  return (
    <div className={`g-root h-full w-full`}>
      <Text variant={getFontSizeForHeader(branding.fontSize)} contentAlign='left' className='!h-fit mb-4 font-bold'>
        {keyset('Access Template')}
      </Text>
      <div className='h-[73vh] w-[80vw] sm:w-[75vw] 2xl:w-[unset] overflow-auto'>
        <table className='min-w-full rounded text-left'>
          <thead
            className={twMerge(
              'rounded-full',
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            )}
          >
            <tr>
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
              <th style={{ fontSize: branding.fontSize }} className='w-[150px] px-4 py-4'>
                {keyset('Access Template')}
              </th>
              <th style={{ fontSize: branding.fontSize }} className='w-[100px] px-4 py-4'>
                {keyset('Data Access Privilege')}
              </th>
              <th style={{ fontSize: branding.fontSize }} className='w-[100px] px-2 py-4'>{keyset('No.ofusers')}</th>
              <th style={{ fontSize: branding.fontSize }} className='w-[220px] px-4 py-4'>{keyset('Created On')}</th>
              <th style={{ fontSize: branding.fontSize }} className='w-[250px] px-4 py-4 lg:w-[600px]'></th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map((template: any, index: number) => (
              <tr key={index} className={twMerge('', hoverBgColor)}>
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
                    className={twMerge(
                      `ml-3 w-[12.29vw] cursor-default truncate rounded border p-3`,
                      borderColor
                    )}
                    style={{ fontSize: branding.fontSize }}
                  >
                    {template?.accessProfile}
                  </div>
                </td>
                <td className='w-[200px] px-1 py-1'>
                  <div
                    className={twMerge(
                      `ml-3 w-[12.29vw] cursor-default truncate rounded border p-3`,
                      borderColor
                    )}
                    style={{ fontSize: branding.fontSize }}
                  >
                    {template.dap === 'f'
                      ? 'Full'
                      : template.dap === 'l'
                      ? 'Limited'
                      : 'Select DAP'}
                  </div>
                </td>
                <td style={{ fontSize: branding.fontSize }} className='px-1 py-1 text-center'>
                  {template['no.ofusers']}
                </td>
                <td style={{ fontSize: branding.fontSize }} className='w-[220px] px-4 py-1'>{template.createdOn}</td>
                <td className='flex w-[250px] items-center justify-end px-1 py-1 xl:w-[600px]'>
                  <div className='flex gap-3 items-center'>
                    <Button
                      onClick={() => {
                        setTemplateToBeUpdated(template)
                        setIndexOfTemplateToBeUpdated(template.originalIndex)
                        setIsView(true)
                      }}
                      className='px-0.5 rounded-md'
                    >
                      <span className='flex items-center gap-1'>
                        <Preview
                          height='28px'
                          width='28px'
                          fill={isDark ? 'white' : 'black'}
                        />
                        {keyset('view')}
                      </span>
                    </Button>
                    <Button
                      onClick={() => {
                        if (template?.['no.ofusers'] !== 0) {
                          toast(
                            "This Template is Assigned to the User, So it can't be edited.",
                            'warning'
                          )
                          return
                        }
                        setTemplateToBeUpdated(template)
                        setIndexOfTemplateToBeUpdated(template.originalIndex)
                      }}
                      className='px-1.5 py-0.5 rounded-md'
                    >
                      <span className='flex items-center gap-2'>
                        <EditIcon
                          fill={isDark ? 'white' : 'black'}
                          height='15px'
                          width='15px'
                        />
                        {keyset('edit')}
                      </span>
                    </Button>
                  </div>
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
        onUpdate={data => setCurrentPage(data.page)}
        alignment='middle'
        showButtonText={true}
      />
    </div>
  )
}

export default AccessTemplateTable
