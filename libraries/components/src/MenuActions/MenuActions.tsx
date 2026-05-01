import {
    Box,
    LinkBox,
    LinkOverlay,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Portal,
    Spinner,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, Button, Flex, Text } from '@statseeker/components';
import { Link, type LinkProps } from '@tanstack/react-router';
import { type ReactElement, type ReactNode } from 'react';

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
/**
 * Defines the visual style variant for actions
 */
export type ActionVariant = 'default' | 'danger' | 'warning' | 'success' | 'info';

/**
 * Base configuration shared by all action types
 * @template TContext - The type of context data passed to action callbacks
 */
export interface BaseActionConfig<TContext> {
    /** Unique identifier for the action */
    key: string;
    /** Display label for the action. Can be dynamic based on context */
    label: string | ((context: TContext) => string);
    /** Optional icon to display with the action */
    icon?: ReactElement;
    /** Visual style variant of the action */
    variant?: ActionVariant;

    /** Controls visibility of the action. Can be dynamic based on context */
    show?: boolean | ((context: TContext) => boolean);

    /** Controls disabled state. Can be dynamic based on context */
    disabled?: boolean | ((context: TContext) => boolean);

    /** Tooltip text to show on hover. Can be dynamic based on context */
    tooltip?: string | ((context: TContext) => string | undefined);

    /** Shows loading state when true */
    loading?: boolean | ((context: TContext) => boolean);

    /** Whether action requires confirmation before execution */
    requiresConfirmation?: boolean;
    /** Custom confirmation message. Can be dynamic based on context */
    confirmationMessage?: string | ((context: TContext) => string);
}

/**
 * Configuration for a clickable menu item action
 * @template TContext - The type of context data passed to action callbacks
 * @example
 * ```tsx
 * const editAction: MenuActionConfig<User> = {
 *   type: 'menu-item',
 *   key: 'edit',
 *   label: 'Edit User',
 *   icon: <EditIcon />,
 *   onClick: (user) => console.log('Editing', user.name),
 *   disabled: (user) => !user.canEdit
 * };
 * ```
 */
export interface MenuActionConfig<TContext> extends BaseActionConfig<TContext> {
    type: 'menu-item';
    /** Callback executed when action is clicked */
    onClick: (context: TContext) => void | Promise<void>;
}

/**
 * Configuration for a submenu containing nested actions
 * @template TContext - The type of context data passed to action callbacks
 * @example
 * ```tsx
 * const exportSubmenu: SubMenuActionConfig<Document> = {
 *   type: 'submenu',
 *   key: 'export',
 *   label: 'Export',
 *   actions: [
 *     { type: 'menu-item', key: 'pdf', label: 'As PDF', onClick: exportPDF },
 *     { type: 'menu-item', key: 'csv', label: 'As CSV', onClick: exportCSV }
 *   ]
 * };
 * ```
 */
export interface SubMenuActionConfig<TContext> extends BaseActionConfig<TContext> {
    type: 'submenu';
    /** Nested actions within the submenu */
    actions: ActionConfig<TContext>[];
}

/**
 * Configuration for a visual divider between actions
 * @example
 * ```tsx
 * const divider: DividerActionConfig = {
 *   type: 'divider',
 *   key: 'divider-1'
 * };
 * ```
 */
export interface DividerActionConfig {
    type: 'divider';
    /** Unique identifier for the divider */
    key: string;
}

/**
 * Configuration for a custom-rendered action
 * @template TContext - The type of context data passed to render function
 * @example
 * ```tsx
 * const customAction: CustomActionConfig<User> = {
 *   type: 'custom',
 *   key: 'badge',
 *   render: (user) => <Badge>{user.role}</Badge>,
 *   show: (user) => user.role === 'admin'
 * };
 * ```
 */
export interface CustomActionConfig<TContext> {
    type: 'custom';
    /** Unique identifier for the custom action */
    key: string;
    /** Render function that returns custom React content */
    render: (context: TContext) => ReactNode;
    /** Controls visibility of the custom action */
    show?: boolean | ((context: TContext) => boolean);
}

export type LinkActionConfig<TContext> = BaseActionConfig<TContext> & (
    | {
        href: string | ((context: TContext) => string);
        isExternal?: boolean;
    }
    | {
        to: LinkProps['to'];
        from?: LinkProps['from'];
        search?: LinkProps['search'];
        params?: LinkProps['params'];
    }) & { type: 'link' };

/**
 * Union type of all possible action configurations
 * @template TContext - The type of context data passed to action callbacks
 */
export type ActionConfig<TContext> =
    | MenuActionConfig<TContext>
    | SubMenuActionConfig<TContext>
    | DividerActionConfig
    | CustomActionConfig<TContext>
    | LinkActionConfig<TContext>;

/**
 * Configuration for a group of related actions
 * @template TContext - The type of context data passed to action callbacks
 * @example
 * ```tsx
 * const editGroup: ActionGroupConfig<Document> = {
 *   title: 'Edit',
 *   actions: [
 *     { type: 'menu-item', key: 'edit', label: 'Edit', onClick: handleEdit },
 *     { type: 'menu-item', key: 'duplicate', label: 'Duplicate', onClick: handleDuplicate }
 *   ]
 * };
 * ```
 */
export interface ActionGroupConfig<TContext> {
    /** Optional title displayed above the group */
    title?: string;
    /** Array of actions in this group */
    actions: ActionConfig<TContext>[];
}

/**
 * Props for the MenuActions component
 * @template TContext - The type of context data passed to all actions
 */
export interface ActionGroupProps<TContext> {
    /** Array of action groups to display in the menu */
    groups: ActionGroupConfig<TContext>[];

    /** Context data passed to all action callbacks and conditions */
    context: TContext;

    /** Configuration for the trigger button */
    button?: {
        /** Button label text */
        label?: string;
        /** Icon to display in the button */
        icon?: ReactElement;
        /** Button visual style */
        variant?: 'solid' | 'outline' | 'ghost' | 'link';
        /** Button color scheme */
        colorScheme?: string;
        /** Button size */
        size?: 'xs' | 'sm' | 'md' | 'lg';
        /** Render as icon button instead of text button */
        isIconButton?: boolean;
        /** Control disabled state. Can be dynamic based on context */
        disabled?: boolean | ((context: TContext) => boolean);
        /** Tooltip text for the button */
        tooltip?: string;
    };

    /** Configuration for the dropdown menu */
    menu?: {
        /** Menu placement relative to button */
        placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
        /** Whether menu closes when action is selected */
        closeOnSelect?: boolean;
        /** Whether to render menu in a portal */
        usePortal?: boolean;
    };

    /** Callback fired when any action is clicked */
    onActionClick?: (actionKey: string, context: TContext) => void;
    /** Callback fired when action execution throws error */
    onActionError?: (actionKey: string, error: Error, context: TContext) => void;
}

/**
 * Evaluates a condition that can be static or dynamic
 * @template T - Type of context
 * @param condition - Boolean value or function returning boolean
 * @param context - Context data to pass to function
 * @param defaultValue - Default value if condition is undefined
 * @returns Resolved boolean value
 */
const evaluateCondition = <T,>(
    condition: boolean | ((context: T) => boolean) | undefined,
    context: T,
    defaultValue: boolean = true
): boolean => {
    if (condition === undefined) return defaultValue;
    if (typeof condition === 'boolean') return condition;
    return condition(context);
};

/**
 * Maps action variant to corresponding color
 * @param variant - Action variant type
 * @returns Color string for the variant
 */
const getVariantColor = (variant?: ActionVariant): string => {
    switch (variant) {
        case 'danger':
            return 'red.600';
        case 'warning':
            return 'orange.600';
        case 'success':
            return 'green.600';
        case 'info':
            return 'blue.600';
        default:
            return 'inherit';
    }
};

/**
 * MenuActions Component
 * 
 * A flexible, type-safe dropdown menu component for displaying contextual actions.
 * Supports multiple action types, conditional visibility, dynamic labels, and nested submenus.
 * 
 * @component
 * @template TContext - The type of context data passed to all actions
 * 
 * @example
 * Basic usage:
 * ```tsx
 * import { MenuActions, createAction } from './MenuActions';
 * 
 * interface User {
 *   id: string;
 *   name: string;
 *   canEdit: boolean;
 * }
 * 
 * function UserMenu({ user }: { user: User }) {
 *   return (
 *     <MenuActions
 *       context={user}
 *       groups={[
 *         {
 *           title: 'Actions',
 *           actions: [
 *             createAction.menuItem({
 *               key: 'edit',
 *               label: 'Edit User',
 *               onClick: (user) => console.log('Edit', user.name),
 *               show: (user) => user.canEdit
 *             }),
 *             createAction.menuItem({
 *               key: 'delete',
 *               label: 'Delete',
 *               variant: 'danger',
 *               onClick: (user) => console.log('Delete', user.id),
 *               requiresConfirmation: true
 *             })
 *           ]
 *         }
 *       ]}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * With custom button and multiple groups:
 * ```tsx
 * <MenuActions
 *   context={document}
 *   button={{
 *     label: 'Document Actions',
 *     variant: 'outline',
 *     icon: <SettingsIcon />
 *   }}
 *   groups={[
 *     {
 *       title: 'Edit',
 *       actions: [
 *         createAction.menuItem({
 *           key: 'edit',
 *           label: 'Edit',
 *           onClick: handleEdit
 *         })
 *       ]
 *     },
 *     {
 *       title: 'Share',
 *       actions: [
 *         createAction.link({
 *           key: 'share',
 *           label: 'Share Link',
 *           href: (doc) => `/share/${doc.id}`
 *         }),
 *         createAction.submenu({
 *           key: 'export',
 *           label: 'Export',
 *           actions: [
 *             createAction.menuItem({
 *               key: 'pdf',
 *               label: 'As PDF',
 *               onClick: exportPDF
 *             })
 *           ]
 *         })
 *       ]
 *     }
 *   ]}
 * />
 * ```
 * 
 * @example
 * Using preset actions:
 * ```tsx
 * import { MenuActions, presetActions } from './MenuActions';
 * 
 * <MenuActions
 *   context={item}
 *   groups={[
 *     {
 *       actions: [
 *         presetActions.edit(handleEdit),
 *         presetActions.duplicate(handleDuplicate),
 *         presetActions.delete(handleDelete)
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export function MenuActions<TContext>({
    groups,
    context,
    button = {},
    menu = {},
    onActionClick,
    onActionError,
}: ActionGroupProps<TContext>) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    /**
     * Handles action click, including confirmation and error handling
     * @param action - The menu action configuration
     */
    const handleActionClick = async (action: MenuActionConfig<TContext>) => {
        try {
            // Notify parent component
            onActionClick?.(action.key, context);

            // Handle confirmation if required
            if (action.requiresConfirmation) {
                const message =
                    typeof action.confirmationMessage === 'function'
                        ? action.confirmationMessage(context)
                        : action.confirmationMessage || `Are you sure you want to ${action.label}?`;

                // @TODO: Unify confirmation message handler
                console.info(message);
            }

            // Execute action
            await action.onClick(context);

            // Close menu if configured
            if (menu.closeOnSelect !== false) {
                onClose();
            }
        } catch (error) {
            onActionError?.(action.key, error as Error, context);
            console.error(`Error executing action ${action.key}:`, error);
        }
    };

    /**
     * Renders an action based on its type
     * @param action - The action configuration to render
     * @returns React node or null if not visible
     */
    const renderAction = (action: ActionConfig<TContext>): ReactNode => {
        switch (action.type) {
            case 'divider':
                return <MenuDivider key={action.key} />;

            case 'custom': {
                const isVisible = evaluateCondition(action.show, context, true);
                if (!isVisible) return null;
                return <div key={action.key}>{action.render(context)}</div>;
            }

            case 'link': {
                const isVisible = evaluateCondition(action.show, context, true);
                if (!isVisible) return null;
                if ('href' in action) {
                    return renderLinkItem(action);
                }

                if ('to' in action) {
                    return renderRouterLinkItem(action);
                }
                return null;
            }

            case 'submenu': {
                const isVisible = evaluateCondition(action.show, context, true);
                if (!isVisible) return null;
                return renderSubMenu(action);
            }

            case 'menu-item':
            default: {
                const isVisible = evaluateCondition(action.show, context, true);
                if (!isVisible) return null;
                return renderMenuItem(action);
            }
        }
    };

    /**
     * Renders a standard menu item
     * @param action - Menu item action configuration
     * @returns MenuItem component
     */
    const renderMenuItem = (action: MenuActionConfig<TContext>) => {
        const isDisabled = evaluateCondition(action.disabled, context, false);
        const isLoading = evaluateCondition(action.loading, context, false);
        const tooltip =
            typeof action.tooltip === 'function' ? action.tooltip(context) : action.tooltip;
        const color = getVariantColor(action.variant);
        const label = typeof action.label === 'function' ? action.label(context) : action.label;

        const menuItem = (
            <MenuItem
                key={action.key}
                onClick={() => handleActionClick(action)}
                isDisabled={isDisabled}
                icon={action.icon}
                color={color}
            >
                <Flex gap={2}>
                    {isLoading && <Spinner margin={'auto'} display={'block'} color="primary.500" size={'xs'} />}
                    <Text>{label}</Text>
                </Flex>
            </MenuItem>
        );

        if (tooltip && !isDisabled) {
            return (
                <Tooltip key={action.key} label={tooltip} placement="left">
                    {menuItem}
                </Tooltip>
            );
        }

        return menuItem;
    };

    /**
     * Renders a link menu item
     * @param action - Link action configuration
     * @returns Link wrapped MenuItem component
     */
    const renderLinkItem = (action: LinkActionConfig<TContext>) => {
        const isDisabled = evaluateCondition(action.disabled, context, false);
        const tooltip =
            typeof action.tooltip === 'function' ? action.tooltip(context) : action.tooltip;
        const color = getVariantColor(action.variant);
        const label = typeof action.label === 'function' ? action.label(context) : action.label;

        const resolvedHref = 'href' in action
            ? (typeof action.href === 'function' ? action.href(context) : action.href)
            : action.to;
        const isExternal = 'href' in action ? action.isExternal : false;

        const linkItem = (
            <LinkBox as={MenuItem} key={action.key} isDisabled={isDisabled} color={color}>
                <LinkOverlay href={resolvedHref} isExternal={isExternal}>
                    {action.icon && (
                        <Box as="span" display="inline-flex" mr={2}>
                            {action.icon}
                        </Box>
                    )}
                    {label}
                </LinkOverlay>
            </LinkBox>
        );

        if (tooltip && !isDisabled) {
            return (
                <Tooltip key={action.key} label={tooltip} placement="left">
                    {linkItem}
                </Tooltip>
            );
        }

        return linkItem;
    };

    /**
     * Renders a router link menu item
     * @param action - Link action configuration
     * @returns Link wrapped MenuItem component
     */
    const renderRouterLinkItem = (action: LinkActionConfig<TContext>) => {
        if (!('to' in action)) {
            return null;
        }
        const isDisabled = evaluateCondition(action.disabled, context, false);
        const tooltip =
            typeof action.tooltip === 'function' ? action.tooltip(context) : action.tooltip;
        const color = getVariantColor(action.variant);
        const label = typeof action.label === 'function' ? action.label(context) : action.label;
        const search: LinkProps['search'] = 'search' in action ? action?.search : true;

        const linkItem = (
            <Box as="span" {...isDisabled && { color: 'gray.500' }} _hover={{ backgroundColor: 'var(--chakra-colors-primary-50)' }}>
                <Link to={action.to} from={action?.from} search={search} disabled={isDisabled} params={action?.params}>
                    <MenuItem disabled={isDisabled} icon={action?.icon} color={color} {...isDisabled && { cursor: 'not-allowed' }}>
                        {label}
                    </MenuItem>
                </Link>
            </Box>
        );

        if (tooltip && !isDisabled) {
            return (
                <Tooltip key={action.key} label={tooltip} placement="left">
                    {linkItem}
                </Tooltip>
            );
        }

        return linkItem;
    };


    /**
     * Renders a submenu with nested actions
     * @param action - Submenu action configuration
     * @returns Nested Menu component
     */
    const renderSubMenu = (action: SubMenuActionConfig<TContext>) => {
        const isDisabled = evaluateCondition(action.disabled, context, false);
        const label = typeof action.label === 'function' ? action.label(context) : action.label;

        return (
            <Menu key={action.key} placement="right-start">
                <MenuButton
                    as={Button}
                    isDisabled={isDisabled}
                    icon={action.icon}
                    rightIcon={<ChevronDownIcon />}
                >
                    {label}
                </MenuButton>
                <MenuList>
                    {action.actions.map((subAction) => renderAction(subAction))}
                </MenuList>
            </Menu>
        );
    };

    /**
     * Renders all action groups with dividers between them
     * @returns Array of group elements
     */
    const renderGroups = () => {
        return groups.map((group, groupIndex) => {
            const visibleActions = group.actions.filter((action) => {
                if (action.type === 'divider') return true;
                return evaluateCondition(action.show, context, true);
            });

            if (visibleActions.length === 0) return null;

            return (
                <div key={group.title || `group-${groupIndex}`}>
                    {group.title ? (
                        <MenuGroup title={group.title}>
                            {group.actions.map((action) => renderAction(action))}
                        </MenuGroup>
                    ) : (
                        group.actions.map((action) => renderAction(action))
                    )}
                    {groupIndex < groups.length - 1 && <MenuDivider />}
                </div>
            );
        });
    };

    const isButtonDisabled = evaluateCondition(button.disabled, context, false);

    // Count visible actions
    const hasVisibleActions = groups.some((group) =>
        group.actions.some((action) => {
            if (action.type === 'divider') return false;
            if (action.type === 'link' || action.type === 'custom' || action.type === 'submenu' || action.type === 'menu-item') {
                return evaluateCondition(action.show, context, true);
            }
            return false;
        })
    );

    /**
     * Renders the menu trigger button
     * @returns MenuButton component (text or icon button)
     */
    const renderMenuButton = () => {
        const buttonProps = {
            variant: button.variant || 'solid',
            colorScheme: button.colorScheme,
            size: button.size || 'sm',
            isDisabled: isButtonDisabled || !hasVisibleActions,
            rightIcon: button.isIconButton ? undefined : <ChevronDownIcon />,
        };

        if (button.isIconButton && button.icon) {
            return (
                <Tooltip label={button.tooltip || button.label} isDisabled={!button.tooltip}>
                    <MenuButton
                        as={Button}
                        aria-label={button.label || 'Actions'}
                        {...buttonProps}
                    />
                </Tooltip>
            );
        }

        const menuButton = (
            <MenuButton as={Button} leftIcon={button.icon} {...buttonProps}>
                {button.label || 'Actions'}
            </MenuButton>
        );

        if (button.tooltip) {
            return <Tooltip label={button.tooltip}>{menuButton}</Tooltip>;
        }

        return menuButton;
    };


    // Main Render
    const menuContent = <MenuList>{renderGroups()}</MenuList>;

    return (
        <Menu
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement={menu.placement || 'bottom-end'}
            closeOnSelect={menu.closeOnSelect}
        >
            {renderMenuButton()}
            {!isButtonDisabled ? menu.usePortal ? <Portal>{menuContent}</Portal> : menuContent : null}
        </Menu>
    );
}

/**
 * Helper object for creating typed action configurations
 * 
 * @example
 * ```tsx
 * const editAction = createAction.menuItem({
 *   key: 'edit',
 *   label: 'Edit',
 *   onClick: handleEdit
 * });
 * 
 * const exportSubmenu = createAction.submenu({
 *   key: 'export',
 *   label: 'Export',
 *   actions: [...]
 * });
 * ```
 */
export const createAction = {
    /**
     * Creates a menu item action configuration
     * @template T - Context type
     * @param config - Menu item configuration
     * @returns Typed MenuActionConfig
     */
    menuItem: <T,>(config: Omit<MenuActionConfig<T>, 'type'>): MenuActionConfig<T> => ({
        type: 'menu-item',
        ...config,
    }),

    /**
     * Creates a link action configuration
     * @template T - Context type
     * @param config - Link configuration
     * @returns Typed LinkActionConfig
     */
    link: <T,>(config: DistributiveOmit<LinkActionConfig<T>, 'type'>): LinkActionConfig<T> => ({
        ...config,
        type: 'link',
    }) as LinkActionConfig<T>,

    /**
     * Creates a submenu action configuration
     * @template T - Context type
     * @param config - Submenu configuration
     * @returns Typed SubMenuActionConfig
     */
    submenu: <T,>(config: Omit<SubMenuActionConfig<T>, 'type'>): SubMenuActionConfig<T> => ({
        type: 'submenu',
        ...config,
    }),

    /**
     * Creates a divider action configuration
     * @param key - Unique key for the divider
     * @returns DividerActionConfig
     */
    divider: (key: string): DividerActionConfig => ({
        type: 'divider',
        key,
    }),

    /**
     * Creates a custom action configuration
     * @template T - Context type
     * @param config - Custom action configuration
     * @returns Typed CustomActionConfig
     */
    custom: <T,>(config: Omit<CustomActionConfig<T>, 'type'>): CustomActionConfig<T> => ({
        type: 'custom',
        ...config,
    }),
};

/**
 * Pre-built common action configurations
 * 
 * @example
 * ```tsx
 * const actions = [
 *   presetActions.edit(handleEdit),
 *   presetActions.duplicate(handleDuplicate),
 *   presetActions.delete(handleDelete)
 * ];
 * ```
 */
export const presetActions = {
    /**
     * Creates an edit action
     * @template T - Context type
     * @param onClick - Click handler
     * @param options - Additional configuration options
     * @returns Edit action configuration
     */
    edit: <T,>(onClick: (context: T) => void, options?: Partial<MenuActionConfig<T>>) =>
        createAction.menuItem({
            key: 'edit',
            label: 'Edit',
            onClick,
            ...options,
        }),

    /**
     * Creates a delete action with danger variant and confirmation
     * @template T - Context type
     * @param onClick - Click handler
     * @param options - Additional configuration options
     * @returns Delete action configuration
     */
    delete: <T,>(onClick: (context: T) => void, options?: Partial<MenuActionConfig<T>>) =>
        createAction.menuItem({
            key: 'delete',
            label: 'Delete',
            onClick,
            variant: 'danger',
            requiresConfirmation: true,
            confirmationMessage: 'Are you sure you want to delete this item?',
            ...options,
        }),

    /**
     * Creates a duplicate action
     * @template T - Context type
     * @param onClick - Click handler
     * @param options - Additional configuration options
     * @returns Duplicate action configuration
     */
    duplicate: <T,>(onClick: (context: T) => void, options?: Partial<MenuActionConfig<T>>) =>
        createAction.menuItem({
            key: 'duplicate',
            label: 'Duplicate',
            onClick,
            ...options,
        }),

    /**
     * Creates an archive action with warning variant and confirmation
     * @template T - Context type
     * @param onClick - Click handler
     * @param options - Additional configuration options
     * @returns Archive action configuration
     */
    archive: <T,>(onClick: (context: T) => void, options?: Partial<MenuActionConfig<T>>) =>
        createAction.menuItem({
            key: 'archive',
            label: 'Archive',
            onClick,
            variant: 'warning',
            requiresConfirmation: true,
            ...options,
        }),

    /**
     * Creates an export action
     * @template T - Context type
     * @param onClick - Click handler
     * @param options - Additional configuration options
     * @returns Export action configuration
     */
    export: <T,>(onClick: (context: T) => void, options?: Partial<MenuActionConfig<T>>) =>
        createAction.menuItem({
            key: 'export',
            label: 'Export',
            onClick,
            ...options,
        }),
};