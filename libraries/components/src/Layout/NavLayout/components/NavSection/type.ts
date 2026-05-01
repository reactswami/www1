import { type ReactElement } from "react";
import { type NavCardProps } from "../NavCard";

export interface NavSectionProps {
    name: string;
    children?: ReactElement<NavCardProps>[] | ReactElement<NavCardProps>;
}

