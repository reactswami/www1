// ============================================================================
// type.ts - Type definitions for NavCard components
// ============================================================================

import {
    type DropDownType,
} from '@statseeker/components/Legacy/DropdownButton/DropdownButton';
import { type LinkProps } from '@tanstack/react-router';
import type React from 'react';

// Private symbol that only the factory has access to
export const BUILDER_KEY = '__NAVCARD_VALIDATED__' as const;

/**
 * Status of a navigation card
 */
export type NavCardStatus = 'active' | 'disable';
export type NavStatusTags = 'success' | 'gray';

/**
 * Props for the NavStatus component
 */
export type NavStatusProps = {
    /** Current status of the card */
    status: NavCardStatus;
    /** Optional text to display with the status */
    text?: string;
};

/**
 * Props for the NavSection component
 */
export type NavSectionProps = {
    /** Name of the section to display */
    name: string;
};

/**
 * Type for card action - either a function callback or a router link
 */
export type CardActionType = (() => void) | LinkProps['to'];

/**
 * Base properties shared by all navigation card types
 */
export interface BaseNavCardProps {
    /** Main title text displayed on the card */
    text: string;
    /** Optional description text displayed below the title */
    description?: string;
    /** Optional icon element displayed at the top of the card */
    icon?: React.JSX.Element;
    /** Optional CSS class name for custom styling */
    className?: string;
    /** Controls visibility of the card (default: true) */
    visible?: boolean;
    /** Optional header element (e.g., spinner for loading state) */
    header?: React.ReactElement;
    /** Optional footer element */
    footer?: React.ReactElement;
    /** Optional status indicator (active/disable) */
    status?: NavCardStatus;
    /** Optional text to display with the status */
    statusText?: string;
    /** Whether the card and its actions are disabled */
    disable?: boolean;
}

/**
 * Navigation card with a clickable action
 * The entire card acts as a clickable element
 */
export interface NavCardWithCardAction extends BaseNavCardProps {
    /** Action to execute when card is clicked (function or route) */
    cardAction: CardActionType;
    /** Action buttons are not allowed when using cardAction */
    actionButtons?: ActionButtonProps;
}

/**
 * Navigation card with action buttons
 * The card displays one or more action buttons at the bottom
 */
export interface NavCardWithActionButtons extends BaseNavCardProps {
    /** Card action is not allowed when using action buttons */
    cardAction?: never;
    /** Array of action button configurations */
    actionButtons: ActionButtonProps[];
}

/**
 * Union type for all NavCard prop variants
 */
export type NavCardProps = NavCardWithCardAction | NavCardWithActionButtons;

export type NavCardInternalProps = NavCardProps & {
    [BUILDER_KEY]: true;
};

/**
 * Base properties for all action button types
 */
export interface BaseButtonProps {
    /** Text displayed on the button */
    buttonText: string;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Whether the button is visible (default: true) */
    visible?: boolean;
    /** Button style variant */
    type?: 'normal' | 'warning';
}

/**
 * Standard button with onClick handler
 */
export interface StandardButtonProps extends BaseButtonProps {
    /** Function to call when button is clicked */
    buttonAction: () => void;
    /** Link destination is not allowed for standard buttons */
    to?: never;
    search?: never;
    /** Dropdown menu is not allowed for standard buttons */
    dropDown?: never;
}

/**
 * Link button that navigates to a route
 */
export interface LinkButtonProps extends BaseButtonProps {
    /** Route to navigate to when button is clicked */
    to: LinkProps['to'];
    /** Search Params for navigation */
    search?: LinkProps['search'];
    /** Action function is not allowed for link buttons */
    buttonAction?: never;
    /** Dropdown menu is not allowed for link buttons */
    dropDown?: never;
}

/**
 * Dropdown button with multiple actions
 */
export interface DropdownButtonProps {
    /** Action function is not allowed for dropdown buttons */
    buttonAction?: never;
    /** Link destination is not allowed for dropdown buttons */
    to?: never;
    search?: never;
    /** Array of dropdown menu items */
    dropDown: DropDownType[];
    /** Whether the dropdown is visible (default: true) */
    visible?: boolean;
}

/**
 * Union type for all action button variants
 */
export type ActionButtonProps = StandardButtonProps | LinkButtonProps | DropdownButtonProps;

/**
 * Props for the NavCardContainer component
 */
export interface NavCardContainerProps {
    /** Child elements to render inside the card */
    children: React.ReactNode;
    /** Optional CSS class name for custom styling */
    className?: string;
    /** Optional action when card is clicked */
    cardAction?: CardActionType;
    /** Whether the card is disabled */
    disable?: boolean;
}
