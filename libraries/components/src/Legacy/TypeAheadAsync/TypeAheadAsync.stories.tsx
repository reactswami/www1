import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TypeAheadAsync, TypeAheadAsyncSingle, TypeAheadAsyncMulti } from './TypeAheadAsync';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SelectOption } from './type';
import { theme } from '@statseeker/ui/theme';


/**
 * Mock data for examples
 */
const mockUsers: SelectOption[] = [
    { value: 1, label: 'John Doe' },
    { value: 2, label: 'Jane Smith' },
    { value: 3, label: 'Bob Johnson' },
    { value: 4, label: 'Alice Williams' },
    { value: 5, label: 'Charlie Brown' },
    { value: 6, label: 'Diana Prince' },
    { value: 7, label: 'Edward Norton' },
    { value: 8, label: 'Fiona Apple' },
    { value: 9, label: 'George Harrison' },
    { value: 10, label: 'Helen Hunt' },
];

const mockCountries: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'br', label: 'Brazil' },
];

/**
 * Simulates an async API call with filtering
 */
const loadUsers = async (inputValue: string): Promise<SelectOption[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!inputValue) {
        return mockUsers;
    }

    return mockUsers.filter(user =>
        user.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

/**
 * Simulates an async API call for countries
 */
const loadCountries = async (inputValue: string): Promise<SelectOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!inputValue) {
        return mockCountries;
    }

    return mockCountries.filter(country =>
        country.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const meta: Meta = {
    title: 'Components/TypeAheadAsync',
    component: TypeAheadAsync,
    decorators: [
        (Story) => (
            <ChakraProvider theme={theme}>
                <div style={{ padding: '2rem', maxWidth: '500px' }}>
                    <Story />
                </div>
            </ChakraProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'An async type-ahead select component with Chakra UI theming support. Supports both single and multiple selection modes with automatic caching and debounced search functionality.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Basic single-select example with default options
 */
const SingleSelectExample = () => {
    return (
        <TypeAheadAsyncSingle
            loadOptions={loadUsers}
            defaultOptions={mockUsers}
            placeholder="Select a user..."
            isClearable={true}
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const SingleSelect: Story = {
    render: () => <SingleSelectExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Basic single-select dropdown with async search functionality. Users can search and select one option.',
            },
        },
    },
};

export const MultiSelect: Story = {
    render: () => {
        return (
            <TypeAheadAsyncMulti
                loadOptions={loadUsers}
                defaultOptions={mockUsers}
                placeholder="Select multiple users..."
                isClearable={true}
                onChange={(options) => {
                    console.log('Selected:', options);
                }}
            />
        );
    },
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Multi-select dropdown allowing multiple selections. Selected items appear as tags.',
            },
        },
    },
};

/**
 * Controlled single-select component
 */
const ControlledSingleExample = () => {
    const [selected, setSelected] = useState<SelectOption | null>(null);

    return (
        <div>
            <TypeAheadAsyncSingle
                value={selected}
                loadOptions={loadUsers}
                defaultOptions={mockUsers}
                onChange={setSelected}
                placeholder="Select a user..."
            />
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Selected:</strong> {selected?.label || 'None'}
            </div>
        </div>
    );
};

export const ControlledSingle: Story = {
    render: () => <ControlledSingleExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Controlled component example where the parent manages the selected value. Uses the TypeAheadAsyncSingle convenience wrapper.',
            },
        },
    },
};

/**
 * Controlled multi-select component
 */
const ControlledMultiExample = () => {
    const [selected, setSelected] = useState<SelectOption[]>([]);

    return (
        <div>
            <TypeAheadAsyncMulti
                value={selected}
                loadOptions={loadCountries}
                defaultOptions={mockCountries}
                onChange={setSelected}
                placeholder="Select countries..."
            />
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Selected ({selected.length}):</strong>{' '}
                {selected.map(s => s.label).join(', ') || 'None'}
            </div>
        </div>
    );
};

export const ControlledMulti: Story = {
    render: () => <ControlledMultiExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Controlled multi-select component. Uses the TypeAheadAsyncMulti convenience wrapper.',
            },
        },
    },
};

/**
 * With custom empty message
 */
const CustomEmptyMessageExample = () => {
    const loadEmpty = async (input: string): Promise<SelectOption[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return []; // Always return empty
    };

    return (
        <TypeAheadAsyncSingle
            loadOptions={loadEmpty}
            defaultOptions={[]}
            placeholder="Search for something..."
            emptyMessage="No matching results found. Try a different search."
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const CustomEmptyMessage: Story = {
    render: () => <CustomEmptyMessageExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Example with a custom message when no options are found.',
            },
        },
    },
};

/**
 * Loading state with default options set to true
 */
const WithLoadingStateExample = () => {
    return (
        <TypeAheadAsyncSingle
            loadOptions={loadUsers}
            defaultOptions={true} // Load options on mount
            placeholder="Select a user..."
            isLoading={false}
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const WithLoadingState: Story = {
    render: () => <WithLoadingStateExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Example showing loading behavior. Set defaultOptions to true to load options on mount.',
            },
        },
    },
};

/**
 * Disabled state
 */
const DisabledExample = () => {
    return (
        <TypeAheadAsyncSingle
            loadOptions={loadUsers}
            defaultOptions={mockUsers}
            placeholder="This field is disabled"
            isDisabled={true}
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const Disabled: Story = {
    render: () => <DisabledExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Disabled state prevents user interaction.',
            },
        },
    },
};

/**
 * Not clearable
 */
const NotClearableExample = () => {
    return (
        <TypeAheadAsyncSingle
            loadOptions={loadUsers}
            defaultOptions={mockUsers}
            placeholder="Select a user..."
            isClearable={false}
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const NotClearable: Story = {
    render: () => <NotClearableExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'When isClearable is false, users cannot clear their selection.',
            },
        },
    },
};

/**
 * With initial value
 */
const WithInitialValueExample = () => {
    const [selected, setSelected] = useState<SelectOption | null>(mockUsers[0]);

    return (
        <TypeAheadAsyncSingle
            value={selected}
            loadOptions={loadUsers}
            defaultOptions={mockUsers}
            onChange={setSelected}
            placeholder="Select a user..."
        />
    );
};

export const WithInitialValue: Story = {
    render: () => <WithInitialValueExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Example with a pre-selected value on mount.',
            },
        },
    },
};

/**
 * Multi-select with initial values
 */
const MultiWithInitialValuesExample = () => {
    const [selected, setSelected] = useState<SelectOption[]>([
        mockCountries[0],
        mockCountries[2],
    ]);

    return (
        <TypeAheadAsyncMulti
            value={selected}
            loadOptions={loadCountries}
            defaultOptions={mockCountries}
            onChange={setSelected}
            placeholder="Select countries..."
        />
    );
};

export const MultiWithInitialValues: Story = {
    render: () => <MultiWithInitialValuesExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Multi-select with pre-selected values on mount.',
            },
        },
    },
};

/**
 * Slow loading simulation
 */
const SlowLoadingExample = () => {
    const loadSlow = async (inputValue: string): Promise<SelectOption[]> => {
        // Simulate slow API
        await new Promise(resolve => setTimeout(resolve, 2000));
        return loadUsers(inputValue);
    };

    return (
        <TypeAheadAsyncSingle
            loadOptions={loadSlow}
            defaultOptions={mockUsers}
            placeholder="Type to search (slow)..."
            onChange={(option) => {
                console.log('Selected:', option);
            }}
        />
    );
};

export const SlowLoading: Story = {
    render: () => <SlowLoadingExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Simulates a slow API response to demonstrate loading states.',
            },
        },
    },
};

/**
 * Error handling example
 */
const WithErrorHandlingExample = () => {
    const [error, setError] = useState<string>('');

    const loadWithError = async (inputValue: string) => {
        try {
            if (inputValue.toLowerCase().includes('error')) {
                throw new Error('Search failed');
            }
            return await loadUsers(inputValue);
        } catch (err) {
            setError((err as Error).message);
            return [];
        }
    };

    return (
        <div>
            <TypeAheadAsyncSingle
                loadOptions={loadWithError}
                defaultOptions={mockUsers}
                onChange={(option) => {
                    setError('');
                    console.log('Selected:', option);
                }}
                placeholder="Type 'error' to trigger error..."
            />
            {error && (
                <div style={{
                    marginTop: '0.5rem',
                    color: 'red',
                    fontSize: '0.875rem'
                }}>
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export const WithErrorHandling: Story = {
    render: () => <WithErrorHandlingExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Example showing how to handle errors in loadOptions. Type "error" to trigger an error.',
            },
        },
    },
};

/**
 * Complex object mapping
 */
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

const complexUsers: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
];

const loadComplexUsers = async (input: string): Promise<SelectOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return complexUsers
        .filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(input.toLowerCase())
        )
        .map(user => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName} (${user.email})`,
        }));
};

const ComplexObjectMappingExample = () => {
    const [selected, setSelected] = useState<SelectOption | null>(null);

    return (
        <div>
            <TypeAheadAsyncSingle
                value={selected}
                loadOptions={loadComplexUsers}
                defaultOptions={complexUsers.map(user => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName} (${user.email})`,
                }))}
                onChange={setSelected}
                placeholder="Select a user..."
            />
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Selected ID:</strong> {selected?.value || 'None'}
            </div>
        </div>
    );
};

export const ComplexObjectMapping: Story = {
    render: () => <ComplexObjectMappingExample />,
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Example showing how to map complex objects to SelectOption format.',
            },
        },
    },
};