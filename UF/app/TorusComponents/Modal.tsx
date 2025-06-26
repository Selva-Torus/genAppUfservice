import { Modal, ModalProps, Popup, PopupProps } from "@gravity-ui/uikit";


interface TorusModal extends ModalProps {
}

type props = TorusModal
export default function TorusModal(props: props) {
    return (
        <Modal {...props}>
            {props.children}
        </Modal>
    )
}