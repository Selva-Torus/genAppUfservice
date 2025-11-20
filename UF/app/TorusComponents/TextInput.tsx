import { TextInput, TextInputProps } from '@gravity-ui/uikit'

interface TorusTextInputProps extends TextInputProps {
  require?: boolean
}

type props = TorusTextInputProps

export function TorusTextInput(props: props) {
  return (
    <div>
      <TextInput {...props} style={{ border: 'red' }} />
    </div>
  )
}