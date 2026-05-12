import i18n from '@/app/components/i18n'
import { useGlobal } from '@/context/GlobalContext'
import JsonView from 'react18-json-view'
import { Text } from "./Text";
import { getFontSizeForSubHeader } from '@/app/utils/branding'
import { HeaderPosition, TooltipProps as TooltipPropsType } from '@/types/global'
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'

interface JsonViewerProps {
  data: any
  className?: string
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
}

export const JsonViewer = ({
  data,
  className = '',
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top'
}: JsonViewerProps) => {
  const keyset = i18n.keyset('language')
  const {branding} = useGlobal()

  const jsonViewerElement = (
    <div
      className={`mt-2
      h-full w-full items-center rounded-lg`}
    >
      <div className={`ml-2 h-[92%] w-[100%]`}>
        {data ? (
          <JsonView
            theme='atom'
            enableClipboard={false}
            src={data ?? { data: 'data not available' }}
            className='max-h-[60vh] overflow-y-scroll md:max-h-[80vh]'
          />
        ) : (
          <Text className='p-2 text-center'>
            {keyset('No Data available')}
          </Text>
        )}
      </div>
    </div>
  )

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
    >
      {jsonViewerElement}
    </CommonHeaderAndTooltip>
  )
}