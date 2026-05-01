import { action } from '@storybook/addon-actions';
import { type Meta, type StoryObj } from '@storybook/react';
import { GlobalSearch } from './GlobalSearch';


const meta = {
    title: 'Components/GlobalSearch',
    component: GlobalSearch,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onChange: { action: 'changed' },
        defaultValue: {
            control: 'text',
            description: 'Default value for the search input',
        },
        maxLength: {
            control: 'number',
            description: 'Maximum length of the search input',
        },
        width: {
            control: 'text',
            description: 'Width of the search input',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the search input is disabled',
        },
        label: {
            control: 'text',
            description: 'Label text for the search input',
        },
        tooltipLabel: {
            control: 'text',
            description: 'Tooltip text for the info icon',
        },
        showTooltip: {
            control: 'boolean',
            description: 'Whether to show the info tooltip',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input',
        },
        debounceDelay: {
            control: 'number',
            description: 'Debounce delay in milliseconds',
        },
    },
} satisfies Meta<typeof GlobalSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {
        onChange: action('onChange'),
    },
};

// With default value
export const WithDefaultValue: Story = {
    args: {
        onChange: action('onChange'),
        defaultValue: 'search term',
    },
};

// Disabled state
export const Disabled: Story = {
    args: {
        onChange: action('onChange'),
        disabled: true,
        defaultValue: 'disabled search',
    },
};

// Custom width
export const CustomWidth: Story = {
    args: {
        onChange: action('onChange'),
        width: '30ch',
    },
};

// Custom label
export const CustomLabel: Story = {
    args: {
        onChange: action('onChange'),
        label: 'Search devices',
    },
};

// Without tooltip
export const WithoutTooltip: Story = {
    args: {
        onChange: action('onChange'),
        showTooltip: false,
    },
};

// Custom tooltip
export const CustomTooltip: Story = {
    args: {
        onChange: action('onChange'),
        tooltipLabel: 'Custom tooltip text',
    },
};

// With placeholder
export const WithPlaceholder: Story = {
    args: {
        onChange: action('onChange'),
        placeholder: 'Type to search...',
    },
};

// Custom max length
export const CustomMaxLength: Story = {
    args: {
        onChange: action('onChange'),
        maxLength: 50,
    },
};

// Fast debounce
export const FastDebounce: Story = {
    args: {
        onChange: action('onChange'),
        debounceDelay: 200,
    },
    parameters: {
        docs: {
            description: {
                story: 'Search with a faster debounce delay of 200ms',
            },
        },
    },
};

// Slow debounce
export const SlowDebounce: Story = {
    args: {
        onChange: action('onChange'),
        debounceDelay: 1000,
    },
    parameters: {
        docs: {
            description: {
                story: 'Search with a slower debounce delay of 1000ms',
            },
        },
    },
};

// Full customization
export const FullyCustomized: Story = {
    args: {
        onChange: action('onChange'),
        defaultValue: 'custom search',
        width: '40ch',
        maxLength: 75,
        label: 'Custom Search Field',
        tooltipLabel: 'Advanced regex patterns supported',
        placeholder: 'Enter search query...',
        debounceDelay: 300,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example with all customization options applied',
            },
        },
    },
};