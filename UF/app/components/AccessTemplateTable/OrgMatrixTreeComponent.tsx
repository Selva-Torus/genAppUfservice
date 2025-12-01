import React, { memo, useContext, useMemo, useState } from 'react'
import { DownArrow, SearchIcon, Security } from '../svgApplication'
import { SetupScreenContext, SetupScreenContextType } from '../setup'
import { capitalize } from 'lodash'
import SecurityTemplateSelection from './SecurityTemplateSelection'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { Text } from '@/components/Text'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'

const OrgMatrixTreeComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    setIndexOfTemplateToBeUpdated,
    templateToBeUpdated,
    setTemplateToBeUpdated
  } = useContext(SetupScreenContext) as SetupScreenContextType
  const fontSize = 1
  const { branding } = useGlobal()
  const { borderColor, isDark } = useTheme()
  const { brandColor } = branding

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

      newTemplate.orgGrp = newTemplate.orgGrp
        .map((orgGrp: any) => {
          orgGrp.org = orgGrp.org
            .map((org: any) => {
              org.psGrp = org.psGrp
                .map((psGrp: any) => {
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
                })
                .filter(Boolean) // remove empty psGrp

              return org.psGrp.length > 0 ? org : null
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
          className='bg-torus-bg-card group flex h-[5vh] w-full cursor-pointer items-center justify-between gap-[0.30vw] rounded-[.4vw] border border-[var(--g-color-line-generic)] px-[0.78vw]'
          onClick={() => keys && keys.length > 0 && setShow(!show)}
        >
          <div className='text-torus-text flex items-center justify-start gap-[0.30vw]'>
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
              />
            )}
            {name}
          </div>
          <Text
            color='positive-heavy'
            className='inline-block rounded-full border px-[0.3vw] py-[0.5vh] text-xs font-medium opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100'
            // style={{
            //   color: isLightColor(brandColor),
            //   backgroundColor: hexWithOpacity(brandColor, 0.2),
            //   borderColor: brandColor
            // }}
          >
            {keyName}
          </Text>
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
  }
  const accessPrivilegeData = ['Full', 'Limited']

  return (
    <div className='flex h-full w-full flex-col gap-[1vh]'>
      <div className='flex flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[.8vw]'>
            <Text
              variant='body-3'
              color='secondary'
              className='flex items-center gap-2 text-nowrap'
            >
              <Security fill={isDark ? 'white' : 'black'} /> {'Access Template'}
            </Text>
            <Text variant='header-2' color='primary'>
              {'>'}
            </Text>
            <div className='w-[10vw]'>
              <TextInput
                size='s'
                type='text'
                onChange={handleInputChange}
                value={templateToBeUpdated?.accessProfile}
                readOnly={templateToBeUpdated?.['no.ofusers'] !== 0}
                view='clear'
              />
            </div>
          </div>

          {/* <input
              className={'text-torus-text bg-torus-bg outline-none'}
              type='text'
              defaultValue={templateToBeUpdated?.accessProfile}
              onChange={handleInputChange}
              readOnly={templateToBeUpdated?.['no.ofusers'] !== 0}
              style={{
                backgroundColor: 'var(--g-color-base-background)',
                color: 'var(--g-color-text-primary)'
              }}
            /> */}
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
            ></Select>
            {/* <Select
              value={[
                templateToBeUpdated?.dap === 'f'
                  ? 'Full'
                  : templateToBeUpdated?.dap === 'l'
                  ? 'Limited'
                  : 'Select DAP'
              ]}
              onUpdate={e =>
                setTemplateToBeUpdated((prev: any) => ({
                  ...prev,
                  dap: e[0] == 'Full' ? 'f' : 'l'
                }))
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
            </Select> */}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => {
              setTemplateToBeUpdated(null)
              setIndexOfTemplateToBeUpdated(null)
            }}
          >
            ←
          </Button>
          <Text variant='header-2'>{templateToBeUpdated?.accessProfile}</Text>
        </div>
      </div>

      <hr style={{ borderColor: borderColor }} className='w-full border' />

      <div className='flex h-full w-full gap-4'>
        <div className='flex h-full flex-col gap-3'>
          <span className='flex flex-col'>
            <Text variant='header-1'>Organization Matrix</Text>
            <Text variant='body-1' color='secondary'>
              Interact with the tree to modify
            </Text>
          </span>
          <div
            style={{ fontSize: `${fontSize * 0.72}vw` }}
            className='bg-torus-bg-card flex w-[25vw] items-center gap-[.5vw] rounded-lg border border-[var(--g-color-line-generic)] px-[1vw] py-[1vh]'
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
              placeholder={'Search'}
              className={`bg-torus-bg-card text-torus-text w-full outline-none`}
              style={{
                backgroundColor: 'var(--g-color-base-background)',
                color: 'var(--g-color-text-primary)'
              }}
            />
          </div>

          <div className='h-[62vh] overflow-y-auto scrollbar-hide'>
            <SecurityTree organizationData={templateToBeUpdated?.orgGrp} />
          </div>
        </div>

        <hr style={{ borderColor: borderColor }} className='h-full border' />

        <div className='w-full'>
          <SecurityTemplateSelection />
        </div>
      </div>
    </div>
  )
}

export default OrgMatrixTreeComponent
