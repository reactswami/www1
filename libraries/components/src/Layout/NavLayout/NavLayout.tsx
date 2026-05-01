import { Grid } from "@chakra-ui/react";
import React from "react";
import { type NavLayoutProps } from "./type";

export const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {

    return <Grid
        className="discovery-menu"
        gridTemplateColumns={'repeat(3, 1fr)'}
        gridGap={'5'}
        mb={2}
    >
        {children}
    </Grid>;
};
