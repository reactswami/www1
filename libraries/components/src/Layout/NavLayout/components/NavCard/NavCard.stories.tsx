// ============================================================================
// NavCard.stories.tsx - Storybook stories for NavCard component
// ============================================================================

import type { Meta, StoryObj } from '@storybook/react';
import { NavCard } from './NavCard';
import { NavCardBuilder, NavCardFactory } from './NavCardBuilder';
import { Spinner, Box } from '@chakra-ui/react';
import {
    RadarIcon,
    RotateCwIcon,
    SearchIcon,
    SquarePenIcon,
    HistoryIcon,
    MapPinRadarIcon,
} from '@statseeker/components';

// Mock router setup for Storybook
const meta = {
    title: 'Components/NavCard',
    component: NavCard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `test`,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
            description: 'Main title text displayed on the card',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
            },
        },
        description: {
            control: 'text',
            description: 'Optional description text below the title',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
            },
        },
        visible: {
            control: 'boolean',
            description: 'Controls visibility of the card',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        disable: {
            control: 'boolean',
            description: 'Whether the card and its actions are disabled',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        '__NAVCARD_VALIDATED__': {
            control: 'text',
            description: 'Forbidden',
            table: {
                disable: true,
            },

        },
        status: {
            control: 'select',
            options: ['active', 'disable', undefined],
            description: 'Status indicator (active/disable)',
            table: {
                type: { summary: "'active' | 'disable'" },
                defaultValue: { summary: 'undefined' },
            },
        },
        statusText: {
            control: 'text',
            description: 'Text to display with the status',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
            },
        },
        className: {
            control: 'text',
            description: 'Optional CSS class name for custom styling',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
            },
        },
    },
    decorators: [
        (Story) => (
            <Box width="300px">
                <Story />
            </Box>
        ),
    ],
} satisfies Meta<typeof NavCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Simple: Story = {
    args: NavCardFactory.simple(
        'Simple Card',
        'This is a basic card with just text and description'
    ),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {... NavCardFactory.simple(
               'Simple Card',
            'This is a basic card with just text and description'
        )} />
     `,
            },
            description: {
                story: 'A simple card created using NavCardFactory.simple() with just text and description.',
            },
        },
    },
};

export const WithIcon: Story = {
    args: new NavCardBuilder()
        .text('Settings')
        .description('Manage your application settings')
        .icon(<MapPinRadarIcon size={'xl'} />)
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
    },
    parameters: {
        docs: {
            source: {
                code: `
                <NavCard {...new NavCardBuilder()
                .text('Settings')
                .description('Manage your application settings')
                .icon(<SettingsIcon />)
                .build()} />
                `
            },
            description: {
                story: 'Card with an icon displayed above the title.',
            },
        },
    },
};

export const WithStatus: Story = {
    args: new NavCardBuilder()
        .text('Network Discovery')
        .description('Active network scanning')
        .icon(<SquarePenIcon size={'xl'} />)
        .status('active', 'Running')
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Network Discovery')
        .description('Active network scanning')
        .icon(<NetworkIcon />)
        .status('active', 'Running')
        .build()} />`
            },
            description: {
                story: 'Card displaying an active status indicator with tooltip text.',
            },
        },
    },
};

export const DisabledStatus: Story = {
    args: new NavCardBuilder()
        .text('Maintenance Mode')
        .description('System is currently unavailable')
        .icon(<RotateCwIcon size={'xl'} />)
        .status('disable', 'Offline')
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Maintenance Mode')
        .description('System is currently unavailable')
        .icon(<AlertTriangleIcon />)
        .status('disable', 'Offline')
        .build()} />`
            },
            description: {
                story: 'Card showing a disabled status indicator.',
            },
        },
    },
};

// ============================================================================
// Card Actions (Clickable Cards)
// ============================================================================

export const ClickableCard: Story = {
    args: new NavCardBuilder()
        .text('View History')
        .description('See past discoveries and events')
        .icon(<HistoryIcon size={'xl'} />)
        .cardAction(() => console.log('Card clicked!'))
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('View History')
        .description('See past discoveries and events')
        .icon(<HistoryIcon />)
        .cardAction(() => alert('Card clicked! In a real app, this would navigate or perform an action.'))
        .build()} />`
            },
            description: {
                story: 'Entire card is clickable and executes a function when clicked. Check the console to see the action fired.',
            },
        },
    },
};

export const LinkCard: Story = {
    args: NavCardFactory.linkCard(
        'Configuration',
        'Configure system settings',
        '/settings',
        <MapPinRadarIcon size={'xl'} />
    ),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Configuration')
        .description('Configure system settings')
        .icon(<SettingsIcon />)
        .cardAction(() => alert('Navigation to /settings. In your app, this would use the router.'))
        .build()}/>`,
            },
            description: {
                story: 'Card that navigates to a route when clicked. Created using NavCardFactory.linkCard(). Click the card to navigate to /settings.',
            },
        },
    },
};

// ============================================================================
// Action Buttons
// ============================================================================

export const SingleActionButton: Story = {
    args: NavCardFactory.singleActionCard(
        'Network Scan',
        'Scan the network for devices',
        'Start Scan',
        () => console.log('Scan started!'),
        <SearchIcon size={'xl'} />
    ),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...NavCardFactory.singleActionCard(
        'Network Scan',
        'Scan the network for devices',
        'Start Scan',
        () => alert('Scan started!')} />`
            },
            description: {
                story: 'Card with a single action button. Created using NavCardFactory.singleActionCard().',
            },
        },
    },
};

export const MultipleActionButtons: Story = {
    args: new NavCardBuilder()
        .text('Network Discovery')
        .description('Configure and run network scans')
        .icon(<SquarePenIcon size={'xl'} />)
        .addStandardButton('Run Now', () => console.log('Running...'))
        .addLinkButton('Customize', '/network/config')
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        className: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Network Discovery')
        .description('Configure and run network scans')
        .icon(<NetworkIcon />)
        .addStandardButton('Run Now', () => alert('Running network scan...'))
        .addStandardButton('Customize', () => alert('In your app, this would be a link button to /network/config'))
        .build()} />`,
            },
            description: {
                story: 'Card with multiple action buttons - one standard button and one link button that navigates to /network/config.',
            },
        },
    },
};

export const WarningButton: Story = {
    args: new NavCardBuilder()
        .text('Delete Configuration')
        .description('Permanently remove this configuration')
        .icon(<RotateCwIcon size={'xl'} />)
        .addStandardButton('Delete', () => console.log('Deleted!'), {
            type: 'warning',
        })
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Delete Configuration')
        .description('Permanently remove this configuration')
        .icon(<AlertTriangleIcon />)
        .addStandardButton('Delete', () => alert('Configuration deleted!'), {
            type: 'warning',
        })
        .build()} />`
            },
            description: {
                story: 'Card with a warning-styled button for destructive actions.',
            },
        },
    },
};

export const DisabledButton: Story = {
    args: new NavCardBuilder()
        .text('Premium Feature')
        .description('Upgrade to access this feature')
        .icon(<RadarIcon size={'xl'} />)
        .addStandardButton('Activate', () => console.log('Activated'), {
            disabled: true,
        })
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Premium Feature')
        .description('Upgrade to access this feature')
        .icon(<CheckCircleIcon />)
        .addStandardButton('Activate', () => console.log('Activated'), {
            disabled: true,
        })
        .build()} />`
            },
            description: {
                story: 'Card with a disabled action button.',
            },
        },
    },
};

export const DropdownButton: Story = {
    args: new NavCardBuilder()
        .text('Scheduled Tasks')
        .description('Manage automated tasks')
        .icon(<HistoryIcon size={'xl'} />)
        .addDropdownButton([
            { buttonText: 'Run Now', link: () => console.log('Run now') },
            { buttonText: 'Schedule', link: () => console.log('Schedule') },
            { buttonText: 'View History', link: () => console.log('History') },
        ])
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        className: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Scheduled Tasks')
        .description('Manage automated tasks')
        .icon(<HistoryIcon />)
        .addDropdownButton([
            { buttonText: 'Run Now', link: () => alert('Run now') },
            { buttonText: 'Schedule', link: () => alert('Schedule task') },
            { buttonText: 'View History', link: () => alert('View history') },
        ])
        .build()} />`
            },
            description: {
                story: 'Card with a dropdown button containing multiple actions.',
            },
        },
    },
};

// ============================================================================
// Loading States
// ============================================================================

export const LoadingState: Story = {
    args: new NavCardBuilder()
        .text('Processing')
        .description('Please wait while we process your request')
        .header(<Spinner size="lg" />)
        .status('active', 'In Progress')
        .addStandardButton('Cancel', () => console.log('Cancelled'), {
            type: 'warning',
        })
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Processing')
        .description('Please wait while we process your request')
        .header(<Spinner size="lg" />)
        .status('active', 'In Progress')
        .addStandardButton('Cancel', () => alert('Operation cancelled'), {
            type: 'warning',
        })
        .build()} />`
            },
            description: {
                story: 'Card showing a loading state with a spinner in the header.',
            },
        },
    },
};

export const WithFooter: Story = {
    args: new NavCardBuilder()
        .text('Statistics')
        .description('View system statistics')
        .icon(<SquarePenIcon size={'xl'} />)
        .footer(<Box fontSize="sm" color="gray.500">Last updated: 2 hours ago</Box>)
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        className: { control: 'text' },
    },
    parameters: {
        source: {
            code: `<NavCard {...new NavCardBuilder()
        .text('Statistics')
        .description('View system statistics')
        .icon(<NetworkIcon />)
        .footer(<Box fontSize="sm" color="gray.500">Last updated: 2 hours ago</Box>)
        .build()} />`
        },
        docs: {
            description: {
                story: 'Card with custom footer content.',
            },
        },
    },
};

// ============================================================================
// Disabled States
// ============================================================================

export const DisabledCard: Story = {
    args: new NavCardBuilder()
        .text('Locked Feature')
        .description('This feature is currently locked')
        .icon(<RotateCwIcon size={'xl'} />)
        .disable(true)
        .addStandardButton('Unlock', () => console.log('Unlock'))
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Locked Feature')
        .description('This feature is currently locked')
        .icon(<AlertTriangleIcon />)
        .disable(true)
        .addStandardButton('Unlock', () => console.log('Unlock'))
        .build()} />`
            },
            description: {
                story: 'Entire card and its actions are disabled.',
            },
        },
    },
};

// ============================================================================
// Complex Examples
// ============================================================================

export const ComplexCard: Story = {
    args: new NavCardBuilder()
        .text('Network Discovery')
        .description('Advanced network scanning and analysis')
        .icon(<SearchIcon size={'xl'} />)
        .status('active', 'Running')
        .className('network-discovery-card')
        .addStandardButton('Stop', () => console.log('Stopped'), {
            type: 'warning',
        })
        .addLinkButton('View Results', '/results')
        .footer(<Box fontSize="xs" color="gray.500">45 devices found</Box>)
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        className: { control: 'text' },
    },
    parameters: {
        docs: {
            source: {
                code: `
        <NavCard {...new NavCardBuilder()
        .text('Network Discovery')
        .description('Advanced network scanning and analysis')
        .icon(<SearchIcon />)
        .status('active', 'Running')
        .className('network-discovery-card')
        .addStandardButton('Stop', () => alert('Scan stopped'), {
            type: 'warning',
        })
        .addStandardButton('View Results', () => alert('In your app, use .addLinkButton() for navigation'))
        .footer(<Box fontSize="xs" color="gray.500">45 devices found</Box>)
        .build()} />`,
            },
            description: {
                story: 'A complex card combining multiple features: icon, status, multiple buttons (with navigation), and footer.',
            },
        },
    },
};

export const HiddenCard: Story = {
    args: new NavCardBuilder()
        .text('Hidden Card')
        .description('This card should not be visible')
        .visible(false)
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Hidden Card')
        .description('This card should not be visible')
        .visible(false)
        .build()} />`
            },
            description: {
                story: 'Card with visible set to false. Nothing will be rendered. Toggle the "visible" control to see it.',
            },
        },
    },
};

// ============================================================================
// Builder Pattern Examples
// ============================================================================

export const BuilderPattern: Story = {
    render: () => {
        const baseBuilder = new NavCardBuilder()
            .text('Base Configuration')
            .icon(<MapPinRadarIcon size={'xl'} />);

        const variant1 = baseBuilder.clone()
            .description('Variant with standard action')
            .addStandardButton('Action', () => console.log('Action 1'))
            .build();

        return <NavCard {...variant1} />;
    },
    args: new NavCardBuilder()
        .text('Base Configuration')
        .description('Variant with standard action')
        .icon(<MapPinRadarIcon size={'xl'} />)
        .addStandardButton('Action', () => console.log('Action 1'))
        .build(),
    argTypes: {
        text: { control: 'text' },
        description: { control: 'text' },
        visible: { control: 'boolean' },
        disable: { control: 'boolean' },
        status: { control: 'select', options: ['active', 'disable', undefined] },
        statusText: { control: 'text' },
        className: { control: 'text' },
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates using the builder pattern with clone() to create card variants from a base configuration.',
            },
            source: {
                code: `
const baseBuilder = new NavCardBuilder()
  .text('Base Configuration')
  .icon(<SettingsIcon size={'xl'} />);

const variant1 = baseBuilder.clone()
  .description('Variant with standard action')
  .addStandardButton('Action', () => console.log('Action 1'))
  .build();

const variant2 = baseBuilder.clone()
  .description('Another variant')
  .addStandardButton('Different Action', () => console.log('Action 2'))
  .build();

<NavCard {...variant1} />
<NavCard {...variant2} />
        `,
            },
        },
    },
};

// ============================================================================
// Interactive Playground
// ============================================================================

export const Playground: Story = {
    args: new NavCardBuilder()
        .text('Playground Card')
        .description('Customize this card using the controls panel')
        .icon(<SearchIcon size={'xl'} />)
        .status('active', 'Active')
        .addStandardButton('Primary Action', () => alert('Button clicked!'))
        .build(),
    argTypes: {
        text: {
            control: 'text',
            description: 'Main title text',
        },
        description: {
            control: 'text',
            description: 'Description text below the title',
        },
        visible: {
            control: 'boolean',
            description: 'Show or hide the card',
        },
        disable: {
            control: 'boolean',
            description: 'Disable the entire card',
        },
        status: {
            control: 'select',
            options: ['active', 'disable', undefined],
            description: 'Status indicator',
        },
        statusText: {
            control: 'text',
            description: 'Text shown in status tooltip',
        },
        className: {
            control: 'text',
            description: 'Custom CSS class',
        },
    },
    parameters: {
        docs: {
            source: {
                code: `<NavCard {...new NavCardBuilder()
        .text('Playground Card')
        .description('Customize this card using the controls panel')
        .icon(<SearchIcon />)
        .status('active', 'Active')
        .addStandardButton('Primary Action', () => alert('Button clicked!'))
        .build()} />`
            },
            description: {
                story: 'Use the controls panel to interactively customize this card and see how different props affect its appearance and behavior.',
            },
        },
    },
};