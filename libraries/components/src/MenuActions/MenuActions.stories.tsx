import {
    DeleteIcon,
    EditIcon,
    CopyIcon,
    DownloadIcon,
    ExternalLinkIcon,
    SettingsIcon,
} from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { action } from '@storybook/addon-actions';
import { type Meta, type StoryObj } from '@storybook/react';
import { MenuActions, createAction, presetActions, type ActionGroupProps } from './MenuActions';

// Sample context type for stories
interface StoryContext {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    canEdit: boolean;
    canDelete: boolean;
}

const meta: Meta<ActionGroupProps<StoryContext>> = {
    title: 'Components/MenuActions',
    component: MenuActions,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Box p={8}>
                <Story />
            </Box>
        ),
    ],
};

export default meta;
type Story = StoryObj<ActionGroupProps<StoryContext>>;

// Sample context
const sampleContext: StoryContext = {
    id: '123',
    name: 'Sample Item',
    status: 'active',
    canEdit: true,
    canDelete: true,
};

// Basic Example
export const Basic: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'General',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                    }),
                ],
            },
        ],
    },
};

// With Multiple Groups
export const MultipleGroups: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Edit',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                    }),
                ],
            },
            {
                title: 'Export',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'export-pdf',
                        label: 'Export as PDF',
                        icon: <DownloadIcon />,
                        onClick: action('export-pdf-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'export-csv',
                        label: 'Export as CSV',
                        icon: <DownloadIcon />,
                        onClick: action('export-csv-clicked'),
                    }),
                ],
            },
            {
                title: 'Danger Zone',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                        requiresConfirmation: true,
                    }),
                ],
            },
        ],
    },
};

// With Conditional Actions
export const ConditionalActions: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Actions',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                        show: (ctx) => ctx.canEdit,
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                        show: (ctx) => ctx.canDelete,
                        disabled: (ctx) => ctx.status === 'inactive',
                    }),
                ],
            },
        ],
    },
};

// With Links
export const WithLinks: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Actions',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.divider('divider-1'),
                    createAction.link<StoryContext>({
                        key: 'view-details',
                        label: 'View Details',
                        icon: <ExternalLinkIcon />,
                        href: (ctx) => `/items/${ctx.id}`,
                    }),
                    createAction.link<StoryContext>({
                        key: 'external-link',
                        label: 'Open Documentation',
                        icon: <ExternalLinkIcon />,
                        href: 'https://example.com/docs',
                        isExternal: true,
                    }),
                ],
            },
        ],
    },
};

// With Submenu
export const WithSubmenu: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.submenu<StoryContext>({
                        key: 'export',
                        label: 'Export',
                        icon: <DownloadIcon />,
                        actions: [
                            createAction.menuItem<StoryContext>({
                                key: 'export-pdf',
                                label: 'As PDF',
                                onClick: action('export-pdf-clicked'),
                            }),
                            createAction.menuItem<StoryContext>({
                                key: 'export-csv',
                                label: 'As CSV',
                                onClick: action('export-csv-clicked'),
                            }),
                            createAction.menuItem<StoryContext>({
                                key: 'export-json',
                                label: 'As JSON',
                                onClick: action('export-json-clicked'),
                            }),
                        ],
                    }),
                ],
            },
        ],
    },
};

// With Disabled Actions
export const DisabledActions: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Actions',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                        disabled: true,
                        tooltip: 'Duplication is not available for this item',
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                        disabled: true,
                    }),
                ],
            },
        ],
    },
};

// With Tooltips
export const WithTooltips: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                        tooltip: 'Edit this item',
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                        tooltip: 'Create a copy of this item',
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                        tooltip: 'Permanently delete this item',
                    }),
                ],
            },
        ],
    },
};

// Using Preset Actions
export const UsingPresets: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Common Actions',
                actions: [
                    presetActions.edit<StoryContext>(action('edit-clicked')),
                    presetActions.duplicate<StoryContext>(action('duplicate-clicked')),
                    presetActions.export<StoryContext>(action('export-clicked')),
                    createAction.divider('divider-1'),
                    presetActions.archive<StoryContext>(action('archive-clicked')),
                    presetActions.delete<StoryContext>(action('delete-clicked')),
                ],
            },
        ],
    },
};

// Custom Button Styling
export const CustomButton: Story = {
    args: {
        context: sampleContext,
        button: {
            label: 'Custom Actions',
            icon: <SettingsIcon />,
            variant: 'outline',
            colorScheme: 'blue',
            size: 'lg',
        },
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                    }),
                ],
            },
        ],
    },
};

// Icon Button
export const IconButton: Story = {
    args: {
        context: sampleContext,
        button: {
            label: 'Actions',
            icon: <SettingsIcon />,
            isIconButton: true,
            tooltip: 'Open actions menu',
        },
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                    }),
                ],
            },
        ],
    },
};

// With Loading State
export const LoadingState: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'save',
                        label: 'Save',
                        onClick: action('save-clicked'),
                        loading: true,
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                    }),
                ],
            },
        ],
    },
};

// Different Variants
export const ActionVariants: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                title: 'Variant Examples',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'default',
                        label: 'Default Action',
                        onClick: action('default-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'danger',
                        label: 'Danger Action',
                        variant: 'danger',
                        onClick: action('danger-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'warning',
                        label: 'Warning Action',
                        variant: 'warning',
                        onClick: action('warning-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'success',
                        label: 'Success Action',
                        variant: 'success',
                        onClick: action('success-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'info',
                        label: 'Info Action',
                        variant: 'info',
                        onClick: action('info-clicked'),
                    }),
                ],
            },
        ],
    },
};

// Dynamic Labels
export const DynamicLabels: Story = {
    args: {
        context: sampleContext,
        groups: [
            {
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'toggle-status',
                        label: (ctx) => (ctx.status === 'active' ? 'Deactivate' : 'Activate'),
                        onClick: action('toggle-status-clicked'),
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'view',
                        label: (ctx) => `View ${ctx.name}`,
                        onClick: action('view-clicked'),
                    }),
                ],
            },
        ],
    },
};

// Complex Real-World Example
export const ComplexExample: Story = {
    args: {
        context: sampleContext,
        button: {
            label: 'Actions',
            variant: 'outline',
            size: 'md',
        },
        groups: [
            {
                title: 'Edit',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'edit',
                        label: 'Edit Item',
                        icon: <EditIcon />,
                        onClick: action('edit-clicked'),
                        show: (ctx) => ctx.canEdit,
                        tooltip: 'Edit this item',
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'duplicate',
                        label: 'Duplicate',
                        icon: <CopyIcon />,
                        onClick: action('duplicate-clicked'),
                    }),
                ],
            },
            {
                title: 'Share',
                actions: [
                    createAction.link<StoryContext>({
                        key: 'share-link',
                        label: 'Copy Share Link',
                        icon: <ExternalLinkIcon />,
                        href: (ctx) => `/share/${ctx.id}`,
                    }),
                    createAction.submenu<StoryContext>({
                        key: 'export',
                        label: 'Export',
                        icon: <DownloadIcon />,
                        actions: [
                            createAction.menuItem<StoryContext>({
                                key: 'export-pdf',
                                label: 'Export as PDF',
                                onClick: action('export-pdf-clicked'),
                            }),
                            createAction.menuItem<StoryContext>({
                                key: 'export-csv',
                                label: 'Export as CSV',
                                onClick: action('export-csv-clicked'),
                            }),
                        ],
                    }),
                ],
            },
            {
                title: 'Danger Zone',
                actions: [
                    createAction.menuItem<StoryContext>({
                        key: 'archive',
                        label: 'Archive',
                        variant: 'warning',
                        onClick: action('archive-clicked'),
                        requiresConfirmation: true,
                    }),
                    createAction.menuItem<StoryContext>({
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteIcon />,
                        variant: 'danger',
                        onClick: action('delete-clicked'),
                        show: (ctx) => ctx.canDelete,
                        disabled: (ctx) => ctx.status === 'inactive',
                        requiresConfirmation: true,
                        confirmationMessage: (ctx) => `Are you sure you want to delete "${ctx.name}"?`,
                        tooltip: 'Permanently delete this item',
                    }),
                ],
            },
        ],
    },
};