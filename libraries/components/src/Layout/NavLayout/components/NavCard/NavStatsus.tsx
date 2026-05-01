// ============================================================================
// NavStatus - Status indicator for the NavCard 
// ============================================================================

import { Box } from "@chakra-ui/react";
import { Tag } from '@statseeker/components/Data/Tag';
import { Tooltip } from "@statseeker/components/Overlay";
import type React from "react";
import { type NavStatusTags, type NavStatusProps } from "./type";

/**
 * Style mappings for different status types
 * Maps status values to their corresponding visual styles
 * @constant
 * @type {Record<NavStatusProps['status'], Style>}
 */
const statusStyles: Record<NavStatusProps['status'], NavStatusTags> = {
    active: 'success',
    disable: 'gray',
};

/**
 * NavStatus Component
 * 
 * Displays a colored status indicator circle with a tooltip.
 * The circle's color changes based on the status prop (active or disabled).
 * 
 * @component
 * @param {NavStatusProps} props - Component props
 * @param {('active'|'disable'|undefined)} props.status - The current status to display
 * @param {string} [props.text] - Tooltip text to show on hover
 * @returns {React.ReactElement | null} A status indicator with tooltip, or null if no status is provided
 * 
 * @example
 * // Active status with tooltip
 * <NavStatus status="active" text="System is running" />
 * 
 * @example
 * // Disabled status
 * <NavStatus status="disable" text="System is offline" />
 * 
 * @example
 * // No status (renders nothing)
 * <NavStatus status={undefined} text="No status" />
 */
export const NavStatus: React.FC<NavStatusProps> = ({ status, text }) => {
    if (!status) {
        return null;
    }
    const currentStyle = statusStyles[status];
    return (
        <Box position={'absolute'} top={0} right={0}>
            <Tooltip label={text}>
                <Tag
                    size={'sm'}
                    textTransform={'capitalize'}
                    fontSize={'smaller'}
                    variant={currentStyle}
                    userSelect={'none'}
                >
                    {text ?? ''}
                </Tag>
            </Tooltip>
        </Box>
    );
};