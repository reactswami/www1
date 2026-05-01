// ============================================================================
// NavSection.tsx - Section header component for grid layouts
// ============================================================================

import { Box, Divider } from "@chakra-ui/react";
import { Heading } from "@statseeker/components/Typography";
import type React from "react";
import { NavLayout } from "../../NavLayout";
import { type NavSectionProps } from "./type";

/**
 * Section header component for organizing NavCards in a grid
 * Spans the full width of a 3-column grid and includes a divider
 * 
 * @param props - Section configuration
 * @returns Section header element
 * 
 * @example
 * <NavCardContainer>
 *   <NavSection name="Discovery Options">
 *   <NavCard {...card1} />
 *   <NavCard {...card2} />
 *  </NavSection>
 * </NavCardContainer>
 */
export const NavSection: React.FC<NavSectionProps> = ({ name, children }) => {
    return (
        <Box gridColumn="span 3">
            <Divider mb={2} />
            <Heading
                as="h3"
                size="md"
                color="gray.700"
                mb="2"
            >
                {name}
            </Heading>
            <NavLayout>
                {children}
            </NavLayout>
        </Box>
    );
};