import { ChakraProvider, Box, VStack, Heading, Text, Code } from '@chakra-ui/react';
import { type Meta, type StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterActions, type FilterGroup, type FilterContext } from './FilterActions';

// Mock Chakra UI theme if needed
const meta: Meta<typeof FilterActions> = {
    title: 'Components/FilterActions',
    component: FilterActions,
    decorators: [
        (Story) => (
            <ChakraProvider>
                <Box padding="4">
                    <Story />
                </Box>
            </ChakraProvider>
        ),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof FilterActions>;

// Helper component to manage state in stories
const FilterWrapper = ({
    initialFilters,
    filterGroups,
    context,
}: {
    initialFilters: Record<string, string | string[]>;
    filterGroups: (filters: Record<string, string | string[]>) => FilterGroup<any>[];
    context?: any;
}) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleFilterChange = (filterId: string, value: string | string[]) => {
        setFilters((prev) => ({
            ...prev,
            [filterId]: value,
        }));
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
    };

    return (
        <VStack align="stretch" spacing={4} width="500px">
            <FilterActions
                filterGroups={filterGroups(filters)}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                context={context}
            />

            <Box
                padding={4}
                background="gray.50"
                borderRadius="md"
                fontSize="sm"
            >
                <Heading size="sm" marginBottom={2}>Current Filter State:</Heading>
                <Code display="block" whiteSpace="pre" padding={2}>
                    {JSON.stringify(filters, null, 2)}
                </Code>
            </Box>
        </VStack>
    );
};

// Story 1: Basic Radio Filters
export const BasicRadioFilters: Story = {
    render: () => {
        const initialFilters = {
            ping_state: '',
            snmp_state: '',
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'ping_state',
                title: 'Ping State',
                type: 'radio',
                value: filters.ping_state as string,
                options: [
                    { label: 'up', value: 'up' },
                    { label: 'down', value: 'down' },
                    { label: 'disabled', value: 'disabled' },
                    { label: 'poller down', value: 'poller_down' },
                ],
            },
            {
                id: 'snmp_state',
                title: 'SNMP State',
                type: 'radio',
                value: filters.snmp_state as string,
                options: [
                    { label: 'up', value: 'up' },
                    { label: 'down', value: 'down' },
                    { label: 'disabled', value: 'disabled' },
                ],
            },
        ];

        return <FilterWrapper initialFilters={initialFilters} filterGroups={getFilterGroups} />;
    },
};

// Story 2: Checkbox Filters with Status Colors
export const CheckboxWithStatusColors: Story = {
    render: () => {
        const initialFilters = {
            status: [] as string[],
            services: [] as string[],
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'status',
                title: 'Status',
                type: 'checkbox',
                value: filters.status as string[],
                options: [
                    {
                        label: 'Up',
                        value: 'up',
                        circleColor: 'green.500',
                        textTransform: 'capitalize'
                    },
                    {
                        label: 'Down',
                        value: 'down',
                        circleColor: 'red.500',
                        textTransform: 'capitalize'
                    },
                    {
                        label: 'Disabled',
                        value: 'disabled',
                        circleColor: 'gray.500',
                        textTransform: 'capitalize'
                    },
                ],
            },
            {
                id: 'services',
                title: 'Services',
                type: 'checkbox',
                value: filters.services as string[],
                options: [
                    { label: 'LTM', value: 'ltm', textTransform: 'uppercase' },
                    { label: 'PING', value: 'ping', textTransform: 'uppercase' },
                    { label: 'SNMP', value: 'snmp', textTransform: 'uppercase' },
                ],
            },
        ];

        return <FilterWrapper initialFilters={initialFilters} filterGroups={getFilterGroups} />;
    },
};

// Story 3: Multiple Filter Groups
export const MultipleFilterGroups: Story = {
    render: () => {
        const initialFilters = {
            ifAdminStatus: '',
            ifOperStatus: '',
            poll: '',
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'ifAdminStatus',
                title: 'Administration Status',
                type: 'radio',
                value: filters.ifAdminStatus as string,
                options: [
                    { label: 'up', value: 'up' },
                    { label: 'down', value: 'down' },
                    { label: 'disabled', value: 'disabled' },
                ],
            },
            {
                id: 'ifOperStatus',
                title: 'Operational Status',
                type: 'radio',
                value: filters.ifOperStatus as string,
                options: [
                    { label: 'up', value: 'up' },
                    { label: 'down', value: 'down' },
                    { label: 'disabled', value: 'disabled' },
                ],
            },
            {
                id: 'poll',
                title: 'SNMP Poll',
                type: 'radio',
                value: filters.poll as string,
                options: [
                    { label: 'on', value: 'on' },
                    { label: 'off', value: 'off' },
                    { label: 'exceeded', value: 'exceeded' },
                ],
            },
        ];

        return <FilterWrapper initialFilters={initialFilters} filterGroups={getFilterGroups} />;
    },
};

// Story 4: Context-Based Visibility
export const ContextBasedVisibility: Story = {
    render: () => {
        interface VisibilityContext extends FilterContext {
            hasSelectedDevices: boolean;
            dataTypeSelected: boolean;
        }

        const ContextController = () => {
            const [filters, setFilters] = useState({
                status: [] as string[],
                services: [] as string[],
                poll: '',
            });
            const [hasSelectedDevices, setHasSelectedDevices] = useState(false);
            const [dataTypeSelected, setDataTypeSelected] = useState(false);

            const context: VisibilityContext = {
                hasSelectedDevices,
                dataTypeSelected,
            };

            const filterGroups: FilterGroup<VisibilityContext>[] = [
                {
                    id: 'status',
                    title: 'Status',
                    type: 'checkbox',
                    value: filters.status,
                    options: [
                        { label: 'Up', value: 'up', circleColor: 'green.500' },
                        { label: 'Down', value: 'down', circleColor: 'red.500' },
                        { label: 'Disabled', value: 'disabled', circleColor: 'gray.500' },
                    ],
                    visible: true,
                },
                {
                    id: 'services',
                    title: 'Services (visible when devices selected)',
                    type: 'checkbox',
                    value: filters.services,
                    options: [
                        { label: 'LTM', value: 'ltm' },
                        { label: 'PING', value: 'ping' },
                        { label: 'SNMP', value: 'snmp' },
                    ],
                    visible: (ctx) => ctx.hasSelectedDevices,
                },
                {
                    id: 'poll',
                    title: 'SNMP Poll (disabled until data type selected)',
                    type: 'radio',
                    value: filters.poll,
                    options: [
                        { label: 'on', value: 'on' },
                        { label: 'off', value: 'off' },
                        { label: 'exceeded', value: 'exceeded' },
                    ],
                    disabled: (ctx) => !ctx.dataTypeSelected,
                },
            ];

            const handleFilterChange = (filterId: string, value: string | string[]) => {
                setFilters((prev) => ({
                    ...prev,
                    [filterId]: value,
                }));
            };

            const handleResetFilters = () => {
                setFilters({
                    status: [],
                    services: [],
                    poll: '',
                });
            };

            return (
                <VStack align="stretch" spacing={4} width="600px">
                    <Box padding={4} background="blue.50" borderRadius="md">
                        <Heading size="sm" marginBottom={3}>Context Controls:</Heading>
                        <VStack align="stretch" spacing={2}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={hasSelectedDevices}
                                    onChange={(e) => setHasSelectedDevices(e.target.checked)}
                                />
                                <Text>Has Selected Devices (shows "Services" filter)</Text>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={dataTypeSelected}
                                    onChange={(e) => setDataTypeSelected(e.target.checked)}
                                />
                                <Text>Data Type Selected (enables "SNMP Poll" filter)</Text>
                            </label>
                        </VStack>
                    </Box>

                    <FilterActions<VisibilityContext>
                        filterGroups={filterGroups}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        context={context}
                    />

                    <Box padding={4} background="gray.50" borderRadius="md" fontSize="sm">
                        <Heading size="sm" marginBottom={2}>Current State:</Heading>
                        <Code display="block" whiteSpace="pre" padding={2}>
                            {JSON.stringify({ filters, context }, null, 2)}
                        </Code>
                    </Box>
                </VStack>
            );
        };

        return <ContextController />;
    },
};

// Story 5: Loading State
export const LoadingState: Story = {
    render: () => {
        const initialFilters = {
            status: [] as string[],
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'status',
                title: 'Status',
                type: 'checkbox',
                value: filters.status as string[],
                options: [
                    { label: 'Up', value: 'up', circleColor: 'green.500' },
                    { label: 'Down', value: 'down', circleColor: 'red.500' },
                ],
            },
        ];

        return (
            <VStack align="stretch" spacing={4} width="500px">
                <Text fontWeight="bold">Filter in loading state:</Text>
                <FilterActions
                    filterGroups={getFilterGroups(initialFilters)}
                    onFilterChange={() => { }}
                    onResetFilters={() => { }}
                    isLoading={true}
                />
            </VStack>
        );
    },
};

// Story 6: Custom Applied Filters Count
export const CustomAppliedFiltersCount: Story = {
    render: () => {
        const initialFilters = {
            status: ['up', 'down'] as string[],
            services: ['ping'] as string[],
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'status',
                title: 'Status',
                type: 'checkbox',
                value: filters.status as string[],
                options: [
                    { label: 'Up', value: 'up', circleColor: 'green.500' },
                    { label: 'Down', value: 'down', circleColor: 'red.500' },
                    { label: 'Disabled', value: 'disabled', circleColor: 'gray.500' },
                ],
            },
            {
                id: 'services',
                title: 'Services',
                type: 'checkbox',
                value: filters.services as string[],
                options: [
                    { label: 'LTM', value: 'ltm' },
                    { label: 'PING', value: 'ping' },
                    { label: 'SNMP', value: 'snmp' },
                ],
            },
        ];

        return (
            <VStack align="stretch" spacing={4} width="500px">
                <Text fontWeight="bold">
                    Filter with custom applied filters count (should show 3):
                </Text>
                <FilterWrapper
                    initialFilters={initialFilters}
                    filterGroups={getFilterGroups}
                />
            </VStack>
        );
    },
};

// Story 7: Mixed Radio and Checkbox
export const MixedRadioAndCheckbox: Story = {
    render: () => {
        const initialFilters = {
            priority: '',
            categories: [] as string[],
            status: '',
        };

        const getFilterGroups = (filters: Record<string, string | string[]>): FilterGroup[] => [
            {
                id: 'priority',
                title: 'Priority (Radio)',
                type: 'radio',
                value: filters.priority as string,
                options: [
                    { label: 'High', value: 'high' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Low', value: 'low' },
                ],
            },
            {
                id: 'categories',
                title: 'Categories (Checkbox)',
                type: 'checkbox',
                value: filters.categories as string[],
                options: [
                    { label: 'Bug', value: 'bug' },
                    { label: 'Feature', value: 'feature' },
                    { label: 'Enhancement', value: 'enhancement' },
                    { label: 'Documentation', value: 'docs' },
                ],
            },
            {
                id: 'status',
                title: 'Status (Radio)',
                type: 'radio',
                value: filters.status as string,
                options: [
                    { label: 'Open', value: 'open' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Closed', value: 'closed' },
                ],
            },
        ];

        return <FilterWrapper initialFilters={initialFilters} filterGroups={getFilterGroups} />;
    },
};

// Story 8: Option-Level Visibility and Disabled
export const OptionLevelControl: Story = {
    render: () => {
        interface OptionControlContext extends FilterContext {
            isPremiumUser: boolean;
        }

        const OptionController = () => {
            const [filters, setFilters] = useState({
                features: [] as string[],
            });
            const [isPremiumUser, setIsPremiumUser] = useState(false);

            const context: OptionControlContext = {
                isPremiumUser,
            };

            const filterGroups: FilterGroup<OptionControlContext>[] = [
                {
                    id: 'features',
                    title: 'Features',
                    type: 'checkbox',
                    value: filters.features,
                    options: [
                        { label: 'Basic', value: 'basic' },
                        { label: 'Standard', value: 'standard' },
                        {
                            label: 'Premium (visible only to premium users)',
                            value: 'premium',
                            visible: (ctx) => ctx.isPremiumUser,
                        },
                        {
                            label: 'Enterprise (disabled for non-premium)',
                            value: 'enterprise',
                            disabled: (ctx) => !ctx.isPremiumUser,
                        },
                    ],
                },
            ];

            const handleFilterChange = (filterId: string, value: string | string[]) => {
                setFilters((prev) => ({
                    ...prev,
                    [filterId]: value,
                }));
            };

            const handleResetFilters = () => {
                setFilters({ features: [] });
            };

            return (
                <VStack align="stretch" spacing={4} width="600px">
                    <Box padding={4} background="purple.50" borderRadius="md">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={isPremiumUser}
                                onChange={(e) => setIsPremiumUser(e.target.checked)}
                            />
                            <Text fontWeight="bold">Premium User</Text>
                        </label>
                        <Text fontSize="sm" marginTop={2} color="gray.600">
                            Toggle to see option-level visibility and disabled states
                        </Text>
                    </Box>

                    <FilterActions<OptionControlContext>
                        filterGroups={filterGroups}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        context={context}
                    />

                    <Box padding={4} background="gray.50" borderRadius="md" fontSize="sm">
                        <Code display="block" whiteSpace="pre" padding={2}>
                            {JSON.stringify({ filters, isPremiumUser }, null, 2)}
                        </Code>
                    </Box>
                </VStack>
            );
        };

        return <OptionController />;
    },
};