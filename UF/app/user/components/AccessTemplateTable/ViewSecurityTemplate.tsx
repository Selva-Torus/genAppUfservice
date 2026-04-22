import React, { useMemo } from 'react'
import { SetupScreenContext, SetupScreenContextType } from '..'
import { Security } from '../../../components/svgApplication'
import { ArrowBackward } from '@/app/utils/svgApplications'
import { useGlobal } from '@/context/GlobalContext'
import { useTheme } from '@/hooks/useTheme'
import { Text } from '@/components/Text'
import i18n from '../../../components/i18n'
import { hexWithOpacity } from '../../../components/utils'
import { Table } from '@/components/Table'
import { getFontSizeForHeader } from '@/app/utils/branding'

const CustomTable = Table

const ViewSecurityTemplate = ({
  setIsView
}: {
  setIsView: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {
    templateToBeUpdated,
    setTemplateToBeUpdated,
    setIndexOfTemplateToBeUpdated
  } = React.useContext(SetupScreenContext) as SetupScreenContextType
  const { branding } = useGlobal()
  const { isDark } = useTheme()
  const { brandColor, hoverColor } = branding
  const keyset = i18n.keyset('language')
  const columns: { name: string; id: string }[] = [
    {
      name: 'Organization Group',
      id: 'orgGrpName'
    },
    {
      name: 'Organization Name',
      id: 'orgName'
    },
    {
      name: 'Sub Group',
      id: 'subOrgGrpName'
    },
    {
      name: 'Sub Name',
      id: 'subOrgName'
    },
    {
      name: 'Product Group',
      id: 'psGrpName'
    },
    {
      name: 'Product Name',
      id: 'psName'
    },
    {
      name: 'Role Group',
      id: 'roleGrpName'
    },
    {
      name: 'Role Name',
      id: 'roleName'
    }
  ]

  const transformedCombinations = useMemo(() => {
    const combinations: any = []
    templateToBeUpdated!.orgGrp?.forEach((orgGrp: any) => {
      const { orgGrpCode, orgGrpName } = orgGrp

      orgGrp.org?.forEach((org: any) => {
        const { orgCode, orgName } = org

        /* ------------------------------
             1️⃣ ORG-LEVEL COMBINATIONS
             org → psGrp → ps → roleGrp → role
          --------------------------------*/
        org.psGrp?.forEach((psGrp: any) => {
          const { psGrpCode, psGrpName } = psGrp

          psGrp.ps?.forEach((ps: any) => {
            const { psCode, psName } = ps

            ps.roleGrp?.forEach((roleGrp: any) => {
              const { roleGrpCode, roleGrpName } = roleGrp

              roleGrp.roles?.forEach((role: any) => {
                const { roleCode, roleName } = role

                combinations.push({
                  //   orgGrpCode,
                  orgGrpName,
                  //   orgCode,
                  orgName,

                  //   subOrgGrpCode: "",
                  subOrgGrpName: '-',
                  //   subOrgCode: "",
                  subOrgName: '-',

                  //   psGrpCode,
                  psGrpName,
                  //   psCode,
                  psName,
                  //   roleGrpCode,
                  roleGrpName,
                  //   roleCode,
                  roleName
                })
              })
            })
          })
        })

        /* ------------------------------
             2️⃣ SUB-ORG-LEVEL COMBINATIONS
             org → subOrgGrp → subOrg → psGrp → ps → roleGrp → role
          --------------------------------*/
        org.subOrgGrp?.forEach((subOrgGrp: any) => {
          const { subOrgGrpCode, subOrgGrpName } = subOrgGrp

          subOrgGrp.subOrg?.forEach((subOrg: any) => {
            const { subOrgCode, subOrgName } = subOrg

            subOrg.psGrp?.forEach((psGrp: any) => {
              const { psGrpCode, psGrpName } = psGrp

              psGrp.ps?.forEach((ps: any) => {
                const { psCode, psName } = ps

                ps.roleGrp?.forEach((roleGrp: any) => {
                  const { roleGrpCode, roleGrpName } = roleGrp

                  roleGrp.roles?.forEach((role: any) => {
                    const { roleCode, roleName } = role

                    combinations.push({
                      //   orgGrpCode,
                      orgGrpName,
                      //   orgCode,
                      orgName,

                      //   subOrgGrpCode,
                      subOrgGrpName,
                      //   subOrgCode,
                      subOrgName,

                      //   psGrpCode,
                      psGrpName,
                      //   psCode,
                      psName,

                      //   roleGrpCode,
                      roleGrpName,
                      //   roleCode,
                      roleName
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
    return combinations
  }, [templateToBeUpdated])

  return (
    <div style={{ overflow: 'hidden' }} className='h-full w-full'>
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

          <Text contentAlign='left'>
            {templateToBeUpdated?.accessProfile}
          </Text>
        </div>
      </div>
      <div className='flex w-full justify-between'>
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
          <div className='flex gap-2'>
            <Text variant={getFontSizeForHeader(branding.fontSize)}>{templateToBeUpdated?.accessProfile}</Text>
          </div>
        </div>
        <div className='flex gap-2 px-4'>
          <div
            style={{ backgroundColor: hexWithOpacity(brandColor, 0.3) }}
            className='flex items-center text-nowrap rounded p-2'
          >
            {templateToBeUpdated?.dap && templateToBeUpdated?.dap == 'f'
              ? 'Full Access'
              : 'Limited Access'}
          </div>
        </div>
      </div>

      <div className='flex h-[74vh] w-full flex-col overflow-y-auto mt-2'>
        <CustomTable
          data={transformedCombinations}
          columns={columns}
          emptyMessage='No data available'
          tableSettings
        />
      </div>
    </div>
  )
}

export default ViewSecurityTemplate
