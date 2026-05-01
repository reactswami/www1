// ============================================================================
// NavCardBuilder - Builder for Navigation Card
// ============================================================================

import { type DropDownType } from '@statseeker/components/Legacy/DropdownButton/DropdownButton';
import { type LinkProps } from '@tanstack/react-router';
import type React from 'react';
import { type NavCardStatus, type ActionButtonProps, BUILDER_KEY, type NavCardInternalProps, type NavCardProps } from './type';

/**
 * Builder class for constructing NavCard components
 * 
 * @example
 * const card = new NavCardBuilder()
 *   .text('Network Discovery')
 *   .description('Scan the network')
 *   .icon(<SearchIcon />)
 *   .addLinkButton('Customize', '/network')
 *   .addStandardButton('Run Now', () => run())
 *   .build();
 */
export class NavCardBuilder {
    private props: Partial<NavCardProps> = {
        visible: true,
    };
    private buttons: ActionButtonProps[] = [];

    // Set the card title
    text(text: string): this {
        this.props.text = text;
        return this;
    }

    // Set the card description
    description(description: string): this {
        this.props.description = description;
        return this;
    }

    // Set the card status
    status(status: NavCardStatus, statusText?: string): this {
        this.props.status = status;
        this.props.statusText = statusText;
        return this;
    }

    // Disable card
    disable(disable: boolean): this {
        this.props.disable = disable;
        return this;
    }

    // Set the card icon
    icon(icon: React.JSX.Element): this {
        this.props.icon = icon;
        return this;
    }

    // Set custom CSS class
    className(className: string): this {
        this.props.className = className;
        return this;
    }

    // Set visibility of the card
    visible(visible: boolean): this {
        this.props.visible = visible;
        return this;
    }

    // Set custom header element
    header(header: React.ReactElement): this {
        this.props.header = header;
        return this;
    }

    // Set custom footer element
    footer(footer: React.ReactElement): this {
        this.props.footer = footer;
        return this;
    }

    // Set card action (makes entire card clickable)
    cardAction(action: (() => void) | LinkProps['to']): this {
        this.props.cardAction = action;
        return this;
    }

    // Add a standard button with onClick handler
    addStandardButton(
        buttonText: string,
        buttonAction: () => void,
        options?: {
            disabled?: boolean;
            visible?: boolean;
            type?: 'normal' | 'warning';
        }
    ): this {
        this.buttons.push({
            buttonText,
            buttonAction,
            disabled: options?.disabled,
            visible: options?.visible,
            type: options?.type,
        } as ActionButtonProps);
        return this;
    }

    // Add a link button that navigates to a route
    addLinkButton(
        buttonText: string,
        to: LinkProps['to'],
        search?: LinkProps['search'],
        options?: {
            disabled?: boolean;
            visible?: boolean;
            type?: 'normal' | 'warning';
        }
    ): this {
        this.buttons.push({
            buttonText,
            to,
            search,
            disabled: options?.disabled,
            visible: options?.visible,
            type: options?.type,
        } as ActionButtonProps);
        return this;
    }

    // Add a dropdown button with multiple actions
    addDropdownButton(
        dropDown: DropDownType[],
        options?: {
            visible?: boolean;
        }
    ): this {
        this.buttons.push({
            dropDown,
            visible: options?.visible,
        } as ActionButtonProps);
        return this;
    }

    // Add a custom action button
    addButton(button: ActionButtonProps): this {
        this.buttons.push(button);
        return this;
    }

    // Build and return the NavCardProps
    build(): NavCardProps {
        if (!this.props.text) {
            throw new Error('NavCard requires a text property');
        }

        if (this.props.cardAction && this.buttons.length > 1) {
            throw new Error('NavCard with multiple buttons cannot have a default card action');
        }

        // If single button, then make it the action of the card
        if (this.buttons?.length === 1) {
            return {
                ...this.props,
                text: this.props.text,
                cardAction: this.props.cardAction ?? this.buttons[0].buttonAction ?? this.buttons[0].to ?? this.buttons?.[0]?.dropDown?.[0],
                actionButtons: this.buttons[0],
                [BUILDER_KEY]: true,
            } as NavCardInternalProps;
        }

        if (this.buttons.length > 0) {
            return {
                ...this.props,
                text: this.props.text,
                actionButtons: this.buttons,
                [BUILDER_KEY]: true,
            } as NavCardInternalProps;
        }

        // Card with no actions
        return {
            ...this.props,
            text: this.props.text,
            [BUILDER_KEY]: true,
        } as NavCardInternalProps;

    }

    // Reset the builder to initial state
    reset(): this {
        this.props = { visible: true };
        this.buttons = [];
        return this;
    }

    // Clone the current builder state
    clone(): NavCardBuilder {
        const cloned = new NavCardBuilder();
        cloned.props = { ...this.props };
        cloned.buttons = [...this.buttons];
        return cloned;
    }
}

// Factory functions for common NavCard patterns
export class NavCardFactory {
    // Create a simple card with just text and description
    static simple(text: string, description?: string): NavCardProps {
        return new NavCardBuilder()
            .text(text)
            .description(description || '')
            .build();
    }

    // Create a clickable card that navigates to a route
    static linkCard(
        text: string,
        description: string,
        linkTo: LinkProps['to'],
        icon?: React.JSX.Element
    ): NavCardProps {
        const builder = new NavCardBuilder()
            .text(text)
            .description(description)
            .cardAction(linkTo);

        if (icon) {
            builder.icon(icon);
        }

        return builder.build();
    }

    // Create a card with a single action button
    static singleActionCard(
        text: string,
        description: string,
        buttonText: string,
        buttonAction: () => void,
        icon?: React.JSX.Element
    ): NavCardProps {
        const builder = new NavCardBuilder()
            .text(text)
            .description(description)
            .addStandardButton(buttonText, buttonAction);

        if (icon) {
            builder.icon(icon);
        }

        return builder.build();
    }

    static singleActionLinkCard(
        text: string,
        description: string,
        buttonText: string,
        to: LinkProps['to'],
        icon?: React.JSX.Element,
        navStatus?: { status: NavCardStatus; statusText: string }
    ): NavCardProps {
        const builder = new NavCardBuilder()
            .text(text)
            .description(description)
            .addLinkButton(buttonText, to);
        if (icon) {
            builder.icon(icon);
        }

        if (navStatus) {
            const { status, statusText } = navStatus;
            builder.status(status, statusText);
        }

        return builder.build();
    }


}

/**
 * Usage Examples:
 * 
 * // Using Builder
 * const card1 = new NavCardBuilder()
 *   .text('Network Discovery')
 *   .description('Scan the network')
 *   .icon(<SearchIcon />)
 *   .className('network-discovery')
 *   .addLinkButton('Customize', '/network')
 *   .addDropdownButton([
 *     { buttonText: 'Run Now', link: () => run() },
 *     { buttonText: 'Schedule', link: () => schedule() }
 *   ])
 *   .build();
 * 
 * // Using Factory - Simple Card
 * const card2 = NavCardFactory.simple('Title', 'Description');
 * 
 * // Using Factory - Link Card
 * const card3 = NavCardFactory.linkCard(
 *   'View History',
 *   'See past discoveries',
 *   '/history',
 *   <HistoryIcon />
 * );
 * 
 * // Cloning and modifying
 * const baseBuilder = new NavCardBuilder()
 *   .text('Base Card')
 *   .icon(<Icon />);
 * 
 * const card5 = baseBuilder.clone()
 *   .description('Variant 1')
 *   .addStandardButton('Action 1', () => {})
 *   .build();
 * 
 * const card6 = baseBuilder.clone()
 *   .description('Variant 2')
 *   .addStandardButton('Action 2', () => {})
 *   .build();
 */