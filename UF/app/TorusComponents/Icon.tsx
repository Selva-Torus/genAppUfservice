import { Icon } from "@gravity-ui/uikit";

interface IconProps {
    children: React.ReactNode,
    className?: string
}
type Props = IconProps

export default function TorusIcon(props: Props) {
    return (
        <span className={` ${props.className ? props.className : "flex justify-center items-center"}`} >
            {props.children}
        </span>
    );
}
