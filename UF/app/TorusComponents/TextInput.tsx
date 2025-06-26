import { TextInput, TextInputProps } from "@gravity-ui/uikit";


interface TorusTextInputProps extends TextInputProps {

}

type props = TorusTextInputProps

export function TorusTextInput(props: props) {
    return (
        <div  >
            <TextInput {...props} />
        </div>
    );
}