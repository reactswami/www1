// ============================================================================
// ActionButtonGroup.tsx - Action button components for NavCard
// ============================================================================

import { Flex } from "@chakra-ui/react";
import DropdownButton from "@statseeker/components/Legacy/DropdownButton/DropdownButton";
import { LinkActionButton } from "./LinkActionButton";
import { StandardActionButton } from "./StandardActionButton";
import {
    type ActionButtonProps,
    type DropdownButtonProps,
    type LinkButtonProps,
    type StandardButtonProps
} from "./type";

/**
 * Type guard to check if action button props represent a standard button
 * Standard buttons have a buttonAction function
 * 
 * @param props - Action button props to check
 * @returns True if props represent a standard button with onClick handler
 * 
 * @example
 * const props = { buttonText: "Save", buttonAction: () => save() };
 * if (hasStandardButton(props)) {
 *   // TypeScript knows props is StandardButtonProps
 *   props.buttonAction(); // Safe to call
 * }
 */
function hasStandardButton(props: ActionButtonProps): props is StandardButtonProps {
    return 'buttonAction' in props && typeof props.buttonAction === 'function';
}

/**
 * Type guard to check if action button props represent a link button
 * Link buttons have a linkTo property for navigation
 * 
 * @param props - Action button props to check
 * @returns True if props represent a link button with route destination
 * 
 * @example
 * const props = { buttonText: "Settings", linkTo: "/settings" };
 * if (hasLinkButton(props)) {
 *   // TypeScript knows props is LinkButtonProps
 *   console.log(props.linkTo); // Safe to access
 * }
 */
function hasLinkButton(props: ActionButtonProps): props is LinkButtonProps {
    return 'to' in props;
}

/**
 * Type guard to check if action button props represent a dropdown button
 * Dropdown buttons have a dropDown array with multiple menu items
 * 
 * @param props - Action button props to check
 * @returns True if props represent a dropdown button with menu items
 * 
 * @example
 * const props = { dropDown: [{ buttonText: "Run", link: () => run() }] };
 * if (hasDropDownButton(props)) {
 *   // TypeScript knows props is DropdownButtonProps
 *   console.log(props.dropDown.length); // Safe to access
 * }
 */
function hasDropDownButton(props: ActionButtonProps): props is DropdownButtonProps {
    return 'dropDown' in props;
}

/**
 * Renders a group of action buttons in a horizontal flex layout
 * Filters out invisible buttons and arranges visible buttons with consistent spacing
 * 
 * @param props - Configuration object
 * @param props.buttons - Array of action button configurations to render
 * @returns Flex container with buttons, or null if no visible buttons
 * 
 * @example
 * <ActionButtonGroup 
 *   buttons={[
 *     { buttonText: "Save", buttonAction: () => save() },
 *     { buttonText: "Cancel", linkTo: "/back", visible: false },
 *     { buttonText: "Delete", buttonAction: () => del(), type: "warning" }
 *   ]} 
 * />
 * // Renders: [Save] [Delete] (Cancel is hidden)
 */
export function ActionButtonGroup({ buttons }: { buttons: ActionButtonProps[] }) {
    const visibleButtons = buttons
        .filter(btn => btn.visible ?? true)
        .map((btn, index) => <ActionButton key={index} {...btn} />);

    if (visibleButtons.length === 0) {
        return null;
    }

    return (
        <Flex gap={2} width="100%" justifyContent="center">
            {visibleButtons}
        </Flex>
    );
}

/**
 * Renders a single action button based on its type
 * Uses type guards to discriminate between button variants and render the appropriate component
 * 
 * Supports three button types:
 * - Standard: Button with onClick handler
 * - Link: Button that navigates to a route
 * - Dropdown: Button with dropdown menu
 * 
 * @param props - Action button configuration (discriminated union type)
 * @returns Appropriate button component or null if type is unknown
 * 
 * @example
 * // Standard button
 * <ActionButton 
 *   buttonText="Save" 
 *   buttonAction={() => save()} 
 * />
 * 
 * @example
 * // Link button
 * <ActionButton 
 *   buttonText="Settings" 
 *   linkTo="/settings" 
 * />
 * 
 * @example
 * // Dropdown button
 * <ActionButton 
 *   dropDown={[
 *     { buttonText: "Run Now", link: () => run() },
 *     { buttonText: "Schedule", link: () => schedule() }
 *   ]} 
 * />
 */
export function ActionButton(props: ActionButtonProps) {
    if (hasStandardButton(props)) {
        return <StandardActionButton {...props} />;
    }

    if (hasLinkButton(props)) {
        return <LinkActionButton {...props} />;
    }

    if (hasDropDownButton(props)) {
        return <DropdownButton buttonTypes={props.dropDown} />;
    }

    return null;
}