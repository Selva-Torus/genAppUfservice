import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { Text } from '@/components/Text'

const RenderChild = ({
  displayName,
  displayCode,
  codePrefix,
  isSelected,
  onClick,
  existsInContext = true,
}: {
  displayName: string
  displayCode: string
  codePrefix: string
  isSelected: boolean
  onClick: () => void
  existsInContext: boolean
}) => {
  const { borderColor } = useTheme()

  return (
    <div
      style={{
        fontSize: `0.7vw`
      }}
      className={twMerge(
        'group group flex w-full items-center justify-between rounded-lg border bg-[var(--g-color-base-background)] px-[.5vw] py-[1vh] font-semibold hover:border-[var(--brand-color)] hover:shadow',
        !existsInContext ? 'pr-[0.8vw]' : '',
        isSelected ? 'bg-unset border-[var(--brand-color)]' : borderColor
      )}
      onClick={() => existsInContext && onClick()}
      key={displayCode}
    >
      <div className='flex items-center gap-[0.5vw]'>
        <div className='flex flex-col'>
          <Text variant='body-2'>{displayName}</Text>
          <Text color='secondary'>{displayCode.replace(codePrefix, '')}</Text>
        </div>
      </div>
    </div>
  )
}

export default RenderChild
