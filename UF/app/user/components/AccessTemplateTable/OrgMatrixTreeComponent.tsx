import React, { memo, useContext, useMemo, useState } from 'react'
import { DownArrow, EditIcon, SearchIcon, Security } from '../../../components/svgApplication'
import { SetupScreenContext, SetupScreenContextType } from '..'
import { capitalize } from 'lodash'
import SecurityTemplateSelection from './SecurityTemplateSelection'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { Text } from '@/components/Text'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { twMerge } from 'tailwind-merge'
import i18n from '../../../components/i18n'
import clsx from 'clsx'
import { ArrowBackward } from '@/app/utils/svgApplications'
import { getFontSizeForHeader } from '@/app/utils/branding'

const OrgMatrixTreeComponent = ({
  isView = false,
  setIsView
}: {
  isView: boolean
  setIsView: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    setIndexOfTemplateToBeUpdated,
    templateToBeUpdated,
    setTemplateToBeUpdated,
  } = useContext(SetupScreenContext) as SetupScreenContextType
  const fontSize = 1
  const { branding } = useGlobal()
  const { borderColor, isDark, bgColor } = useTheme()
  const { brandColor } = branding
  const keyset = i18n.keyset('language')
  const [isEdit, setIsEdit] = useState(false)

  const SecurityTree = memo(({ organizationData }: any) => {
    return (
      <div className='flex w-full flex-1 flex-col gap-[0.83vh]'>
        {organizationData?.map((item: any, index: number) => {
          let keys = Object.keys(item).filter(key => Array.isArray(item[key]))
          return <DisplayTree item={item} keys={keys} key={index} />
        })}
      </div>
    )
  })

  SecurityTree.displayName = 'SecurityTree'

  const DisplayTree = memo(({ item, keys }: { item: any; keys: any }) => {
    const [show, setShow] = useState(true)
    const { templateToBeUpdated, setTemplateToBeUpdated } = useContext(
      SetupScreenContext
    ) as SetupScreenContextType

    const name = useMemo(() => {
      let nameKeys = Object.keys(item).filter(key =>
        key.toLowerCase().endsWith('name')
      )
      return nameKeys.length > 0 ? item[nameKeys[0]] : null
    }, [item])

    function camelCaseToParagraphCase(str: string) {
      // Step 1: Insert spaces before capital letters
      let result = str.replace(/([A-Z])/g, ' $1')

      result = result
        .split(' ')
        .map(word => capitalize(word))
        .join(' ')

      return result
    }

    const keyName = useMemo(() => {
      let nameKeys = Object.keys(item).filter(key =>
        key.toLowerCase().endsWith('name')
      )
      return camelCaseToParagraphCase(nameKeys[0].replace('Name', ''))
    }, [item])

    function removeRoleFromTemplate(item: any, templateToBeUpdated: any) {
      const roleIdToRemove = item.roleId

      // Deep clone to avoid mutating original
      const newTemplate = JSON.parse(JSON.stringify(templateToBeUpdated))

      // Helper function to process psGrp recursively
      function processPsGrp(psGrp: any) {
        psGrp.ps = psGrp.ps
          .map((ps: any) => {
            ps.roleGrp = ps.roleGrp
              .map((roleGrp: any) => {
                // Remove matching role
                roleGrp.roles = roleGrp.roles.filter(
                  (role: any) => role.roleId !== roleIdToRemove
                )
                return roleGrp.roles.length > 0 ? roleGrp : null
              })
              .filter(Boolean) // remove empty roleGrp
            return ps.roleGrp.length > 0 ? ps : null
          })
          .filter(Boolean) // remove empty ps
        return psGrp.ps.length > 0 ? psGrp : null
      }

      // Helper function to process subOrg recursively
      function processSubOrg(subOrg: any): any {
        // Process psGrp in subOrg
        if (subOrg.psGrp && Array.isArray(subOrg.psGrp)) {
          subOrg.psGrp = subOrg.psGrp
            .map((psGrp: any) => processPsGrp(psGrp))
            .filter(Boolean) // remove empty psGrp
        }

        // Process nested subOrgGrp recursively
        if (subOrg.subOrgGrp && Array.isArray(subOrg.subOrgGrp)) {
          subOrg.subOrgGrp = subOrg.subOrgGrp
            .map((subOrgGrp: any) => processSubOrgGrp(subOrgGrp))
            .filter(Boolean) // remove empty subOrgGrp
        }

        // Keep subOrg if it has psGrp or subOrgGrp
        return (subOrg.psGrp && subOrg.psGrp.length > 0) ||
          (subOrg.subOrgGrp && subOrg.subOrgGrp.length > 0)
          ? subOrg
          : null
      }

      // Helper function to process subOrgGrp recursively
      function processSubOrgGrp(subOrgGrp: any): any {
        if (subOrgGrp.subOrg && Array.isArray(subOrgGrp.subOrg)) {
          subOrgGrp.subOrg = subOrgGrp.subOrg
            .map((subOrg: any) => processSubOrg(subOrg))
            .filter(Boolean) // remove empty subOrg
        }

        return subOrgGrp.subOrg && subOrgGrp.subOrg.length > 0
          ? subOrgGrp
          : null
      }

      // Main processing
      newTemplate.orgGrp = newTemplate.orgGrp
        .map((orgGrp: any) => {
          orgGrp.org = orgGrp.org
            .map((org: any) => {
              // Process direct psGrp
              org.psGrp = org.psGrp
                .map((psGrp: any) => processPsGrp(psGrp))
                .filter(Boolean) // remove empty psGrp

              // Process subOrgGrp
              if (org.subOrgGrp && Array.isArray(org.subOrgGrp)) {
                org.subOrgGrp = org.subOrgGrp
                  .map((subOrgGrp: any) => processSubOrgGrp(subOrgGrp))
                  .filter(Boolean) // remove empty subOrgGrp
              }

              // Keep org if it has psGrp or subOrgGrp
              return (org.psGrp && org.psGrp.length > 0) ||
                (org.subOrgGrp && org.subOrgGrp.length > 0)
                ? org
                : null
            })
            .filter(Boolean) // remove empty org

          return orgGrp.org.length > 0 ? orgGrp : null
        })
        .filter(Boolean) // remove empty orgGrp

      return newTemplate
    }

    const handleChange = () => {
      const newTemplate = removeRoleFromTemplate(item, templateToBeUpdated)
      setTemplateToBeUpdated(newTemplate)
    }

    return (
      <div className='flex w-full flex-1 flex-col gap-[0.83vh] '>
        <div
          className={twMerge(
            'bg-torus-bg-card group flex h-[5vh] w-full cursor-pointer items-center justify-between gap-2 rounded-[.4vw] border px-[0.78vw]',
            borderColor
          )}
          onClick={() => keys && keys.length > 0 && setShow(!show)}
        >
          <div
            className='text-torus-text flex items-center justify-start gap-2 truncate'
            title={name}
          >
            {keys && keys.length > 0 ? (
              <span
                className={`w-[0.52vw] transition-transform ease-in ${
                  show ? '' : 'rotate-[-90deg]'
                }`}
              >
                <DownArrow
                  fill={isDark ? 'white' : 'black'}
                  width='0.5vw'
                  height='0.5vw'
                />
              </span>
            ) : (
              <input
                type='checkbox'
                className='h-[.8vw] w-[1.2vw] rounded-lg'
                checked
                style={{ accentColor: brandColor }}
                onChange={handleChange}
                disabled={isView}
              />
            )}
            {name}
          </div>
          <div>
            <Text
              color='positive-heavy'
              className='inline-block text-nowrap rounded-full border px-[0.3vw] py-[0.5vh] text-xs font-medium opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100'
            >
              {keyName}
            </Text>
          </div>
        </div>

        <div
          className={`w-full overflow-hidden transition-all`}
          style={{ height: show ? 'auto' : 0 }}
        >
          {show &&
            keys?.map((key: any) => (
              <div key={key} className='w-full pl-3'>
                <SecurityTree organizationData={item[key]} />
              </div>
            ))}
        </div>
      </div>
    )
  })

  DisplayTree.displayName = 'DisplayTree'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateToBeUpdated((prev: any) => ({
      ...prev,
      accessProfile: e.target.value
    }))
    setIsEdit(false)
  }
  const accessPrivilegeData = ['Full', 'Limited']

  return (
    <div className='flex h-full w-full flex-col gap-[1vh]'>
      <div className='flex flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex w-[30%] items-center gap-[.8vw]'>
            <div>
              <Text
                color='secondary'
                className='flex items-center gap-2 text-nowrap'
              >
                <Security fill={isDark ? 'white' : 'black'} />{' '}
                {keyset('Access Template')}
              </Text>
            </div>
            <div>
              <Text variant={getFontSizeForHeader(branding.fontSize)} color='primary'>
                {'>'}
              </Text>
            </div>

            <Text contentAlign='left'>{templateToBeUpdated?.accessProfile}</Text>
          </div>

          <div>
            <Select
              options={accessPrivilegeData.map(item => ({
                value: item,
                label: item
              }))}
              value={
                templateToBeUpdated?.dap === 'f'
                  ? 'Full'
                  : templateToBeUpdated?.dap === 'l'
                  ? 'Limited'
                  : 'Select DAP'
              }
              onChange={e =>
                setTemplateToBeUpdated((prev: any) => ({
                  ...prev,
                  dap: e == 'Full' ? 'f' : 'l'
                }))
              }
              size='s'
              placeholder='Select DAP'
              className='w-[200px]'
              disabled={isView}
            ></Select>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => {
              setTemplateToBeUpdated(null)
              setIndexOfTemplateToBeUpdated(null)
              setIsView(false)
            }}
          >
            <ArrowBackward fill={isDark ? 'white' : 'black'} />
          </button>
          <div
            className={clsx('flex gap-2', {
              'w-full': isEdit
            })}
          >
            {!isEdit ? (
              <Text variant={getFontSizeForHeader(branding.fontSize)}>
                {templateToBeUpdated?.accessProfile}
              </Text>
            ) : (
              <input
                type='text'
                defaultValue={templateToBeUpdated?.accessProfile}
                title={templateToBeUpdated?.accessProfile}
                readOnly={templateToBeUpdated?.['no.ofusers'] !== 0}
                className={twMerge(
                  'w-full truncate border-none py-0.5 text-xl outline-none',
                  bgColor
                )}
                disabled={!isEdit}
                onBlur={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleInputChange(e as any)
                  }
                }}
              />
            )}
            {!isEdit && (
              <button
                disabled={isView}
                className='outline-none'
                onClick={() => setIsEdit(true)}
              >
                <EditIcon height='.8vw' width='.8vw' />
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className={twMerge('w-full border', borderColor)} />

      <div className='flex h-full w-full gap-4 '>
        <div className='flex h-full w-1/3 flex-col gap-3'>
          <span className='flex flex-col'>
            <Text contentAlign='left' variant={getFontSizeForHeader(branding.fontSize)}>{keyset('Organization Matrix')}</Text>
            <Text contentAlign='left' color='secondary'>
              {keyset('Interact with the tree to modify')}
            </Text>
          </span>
          <div
            style={{ fontSize: `${fontSize * 0.72}vw` }}
            className={twMerge(
              'flex w-full items-center gap-[.5vw] rounded-lg border px-[1vw] py-[1vh]',
              borderColor
            )}
          >
            <span>
              <SearchIcon
                fill={isDark ? 'white' : 'black'}
                height='0.83vw'
                width='0.83vw'
              />
            </span>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={keyset('Search')}
              className={twMerge(`w-full outline-none`, bgColor)}
            />
          </div>

          <div className='max-h-[55vh] overflow-y-auto scrollbar-hide xl:max-h-[58vh]'>
            <SecurityTree organizationData={templateToBeUpdated?.orgGrp} />
          </div>
        </div>

        <hr className={twMerge('h-full border', borderColor)} />

        <div className='w-full overflow-x-auto'>
          <SecurityTemplateSelection isView={isView} />
        </div>
      </div>
    </div>
  )
}

export default OrgMatrixTreeComponent
