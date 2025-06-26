import React from "react";
import { BoxProps, Card as GravityCard } from "@gravity-ui/uikit";
import { twMerge } from "tailwind-merge";

type SelectionCardView = "outlined" | "clear";
type ContainerCardView = "outlined" | "filled" | "raised";
export type CardType = "selection" | "action" | "container";
export type CardTheme = "normal" | "info" | "success" | "warning" | "danger" | "utility";
export type CardView = SelectionCardView | ContainerCardView;
export type CardSize = "m" | "l";
export type Variant = "info" | "success" | "danger" | "warning" | "normal" | "none";

const variantStyles: Record<Variant, string> = {
  info: "!bg-blue-500 !text-white !border !border-white",
  success: "!bg-green-500 !text-white !border !border-white",
  danger: "!bg-red-500 !text-white !border !border-white",
  warning: "!bg-orange-400 !text-white !border !border-white",
  normal: "",
  none: "",
};

const textStyles: Record<Variant, string> = {
  info: "text-white",
  success: "text-white",
  danger: "text-white",
  warning: "text-white",
  normal: "text-black",
  none: "text-black",
};

export interface TorusCardProps extends Omit<BoxProps<"div">, "as" | "onClick"> {
  children: React.ReactNode;
  title?: string; // New title prop
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  selected?: boolean;
  type?: CardType;
  view?: CardView;
  theme?: CardTheme;
  size?: CardSize;
  variant?: Variant;
  icon?: React.ReactNode; 
}

export const TorusCard: React.FC<TorusCardProps> = ({
  children,
  className = "",
  title,
  variant = "none",
  style = {},
  ...props
}) => {
  return (
    <GravityCard
      className={twMerge(`rounded-lg shadow-md p-4 overflow-hidden ${variantStyles[variant]}`, className)}
      {...props}
    >
      {/* Title Section */}
      {title && (
  <div className={twMerge(`text-lg font-semibold ${textStyles[variant]} w-full`)}>
     <div className="flex items-center gap-2 w-full ">
      <span className="w-6 h-6 flex items-center justify-center text-xl">
        {props.icon}
      </span>
      <span className="truncate">{title}</span>
    </div>
  </div>
)}

      {/* Card Content */}
      {children}
    </GravityCard>
  );
};
