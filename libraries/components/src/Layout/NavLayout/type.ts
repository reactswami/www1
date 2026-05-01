import { type ReactElement } from "react";
import { type NavSectionProps, type NavCardProps } from "./components";

export interface NavLayoutProps {
    children?: ReactElement<NavCardProps>[] | ReactElement<NavCardProps> | ReactElement<NavSectionProps> | ReactElement<NavSectionProps>[];
};
