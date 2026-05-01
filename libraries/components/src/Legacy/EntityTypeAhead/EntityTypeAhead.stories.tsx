import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import EntityTypeAhead from './EntityTypeAhead';
import { EntityBase } from './type';
import { theme } from '@statseeker/ui/theme';

interface User extends EntityBase {
    email: string;
    role: string;
    department: string;
}

interface Department extends EntityBase {
    code: string;
    location: string;
}

const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Design' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', department: 'Management' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Developer', department: 'Engineering' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'QA', department: 'Quality' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Product Owner', department: 'Product' },
    { id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'Developer', department: 'Engineering' },
    { id: 8, name: 'Fiona Apple', email: 'fiona@example.com', role: 'Designer', department: 'Design' },
];

const mockDepartments: Department[] = [
    { id: 1, name: 'Engineering', code: 'ENG', location: 'Building A' },
    { id: 2, name: 'Design', code: 'DSN', location: 'Building B' },
    { id: 3, name: 'Management', code: 'MGT', location: 'Building C' },
    { id: 4, name: 'Quality', code: 'QA', location: 'Building A' },
    { id: 5, name: 'Product', code: 'PRD', location: 'Building B' },
];

const fetchUsers = async (search?: string, params?: Record<string, any>): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let results = mockUsers;
    if (search) {
        results = results.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (params?.departmentId) {
        const dept = mockDepartments.find(d => d.id === params.departmentId);
        if (dept) {
            results = results.filter(user => user.department === dept.name);
        }
    }
    return results;
};

const fetchDepartments = async (search?: string): Promise<Department[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!search) return mockDepartments;
    return mockDepartments.filter(dept =>
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.code.toLowerCase().includes(search.toLowerCase())
    );
};

const meta: Meta = {
    title: 'Components/EntityTypeAhead',
    component: EntityTypeAhead,
    // ✅ Fresh QueryClient per story — prevents cache pollution between stories
    decorators: [
        (Story) => {
            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false, staleTime: 30000 } },
            });
            return (
                <QueryClientProvider client={queryClient}>
                    <ChakraProvider theme={theme}>
                        <div style={{ padding: '2rem', maxWidth: '500px' }}>
                            <Story />
                        </div>
                    </ChakraProvider>
                </QueryClientProvider>
            );
        },
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A type-ahead select component for entity selection with async data loading. Supports both single and multiple selection modes.',
            },
        },
    },
    argTypes: {
        isMulti: {
            control: 'boolean',
            description: 'Enable multiple selection mode',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
        initialize: {
            control: 'boolean',
            description: 'Automatically select the first option when loaded',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
        onChange: {
            action: 'changed',
            description: 'Callback fired when selection changes',
            table: { type: { summary: '(entity: EntityBase | null) => void | (entities: EntityBase[]) => void' } },
        },
        entityQueryOption: {
            description: 'Query option builder function for TanStack Query',
            table: { type: { summary: '(search?: string, params?: Record<string, any>) => UseQueryOptions<Entity[]>' } },
        },
        queryParams: {
            control: 'object',
            description: 'Additional query parameters to filter results',
            table: { type: { summary: 'Record<string, any>' } },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SingleSelect: Story = {
    render: () => {
        const [selected, setSelected] = useState<User | null>(null);
        return (
            <div>
                <EntityTypeAhead<User>
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    onChange={(entity) => setSelected(entity as User | null)}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected:</strong> {selected ? `${selected.name} (ID: ${selected.id})` : 'None'}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Basic single-select dropdown with async entity loading.' } },
    },
};

export const MultiSelect: Story = {
    render: () => {
        const [selected, setSelected] = useState<User[]>([]);
        return (
            <div>
                <EntityTypeAhead<User>
                    isMulti
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    onChange={(entities) => setSelected(entities as User[])}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected ({selected.length}):</strong>{' '}
                    {selected.map(s => s.name).join(', ') || 'None'}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Multi-select dropdown allowing multiple entity selections.' } },
    },
};

// ✅ Fixed: defaultValue now receives full entity objects, not raw IDs
export const WithDefaultValue: Story = {
    render: () => {
        const [selected, setSelected] = useState<User | null>(null);
        return (
            <div>
                <EntityTypeAhead<User>
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    onChange={(entity) => setSelected(entity as User | null)}
                    defaultValue={mockUsers[0]} // ✅ full entity object, not raw ID
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected:</strong> {selected ? selected.name : 'None'}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Example with a pre-selected entity using defaultValue prop.' } },
    },
};

// ✅ Fixed: defaultValue now receives full entity objects
export const MultiWithDefaultValues: Story = {
    render: () => {
        const [selected, setSelected] = useState<User[]>([]);
        return (
            <div>
                <EntityTypeAhead<User>
                    isMulti
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    onChange={(entities) => setSelected(entities as User[])}
                    defaultValue={mockUsers.filter(u => [1, 2, 3].includes(u.id))} // ✅ full entity objects
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected ({selected.length}):</strong>{' '}
                    {selected.map(s => s.name).join(', ') || 'None'}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Multi-select with multiple pre-selected entities.' } },
    },
};

// ✅ Fixed: added filterInitialValue so initialize actually fires
export const WithInitialization: Story = {
    render: () => {
        const [selected, setSelected] = useState<User | null>(null);
        return (
            <div>
                <EntityTypeAhead<User>
                    initialize
                    filterInitialValue={(opt) => opt.value === mockUsers[0].id} // ✅ required for initialize to work
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    onChange={(entity) => setSelected(entity as User | null)}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected:</strong> {selected ? selected.name : 'None'}
                    <div style={{ marginTop: '0.5rem', color: 'gray' }}>
                        Note: First option is auto-selected when options load
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Automatically selects the first available option when entities are loaded.' } },
    },
};

export const WithQueryParams: Story = {
    render: () => {
        const [departmentId, setDepartmentId] = useState<number | undefined>(1);
        const [selected, setSelected] = useState<User | null>(null);
        return (
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>
                        Filter by Department:
                    </label>
                    <select
                        value={departmentId || ''}
                        onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
                        style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">All Departments</option>
                        {mockDepartments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <EntityTypeAhead<User, { departmentId: number | undefined }>
                    entityQueryOption={(search, params) => ({
                        queryKey: ['users', search, params],
                        queryFn: () => fetchUsers(search, params),
                    })}
                    queryParams={{ departmentId }}
                    onChange={(entity) => setSelected(entity as User | null)}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected:</strong> {selected ? selected.name : 'None'}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Example showing how to pass additional query parameters to filter results dynamically.' } },
    },
};

// ✅ Fixed: removed isMulti — value and onChange are typed for single select
export const Controlled: Story = {
    render: () => {
        const [selectedId, setSelectedId] = useState<number | undefined>(2);
        const [entity, setEntity] = useState<User | null>(null);

        const handleChange = (selected: User | null) => {
            setEntity(selected);
            setSelectedId(selected?.id);
        };

        return (
            <div>
                <EntityTypeAhead<User>
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    value={selectedId !== undefined ? mockUsers.find(u => u.id === selectedId) : undefined}
                    onChange={(e) => handleChange(e as User | null)}
                // ✅ removed isMulti — single controlled
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected ID:</strong> {selectedId || 'None'}
                    <br />
                    <strong>Entity:</strong> {entity?.name || 'None'}
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => setSelectedId(1)} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>
                        Select User 1
                    </button>
                    <button onClick={() => setSelectedId(3)} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>
                        Select User 3
                    </button>
                    <button onClick={() => setSelectedId(undefined)} style={{ padding: '0.25rem 0.5rem' }}>
                        Clear
                    </button>
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Fully controlled single-select component where the parent manages the selected value.' } },
    },
};

export const MultiControlled: Story = {
    render: () => {
        const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);
        const [entities, setEntities] = useState<User[]>([]);

        const handleChange = (selected: User[]) => {
            setEntities(selected);
            setSelectedIds(selected.map(e => e.id));
        };

        return (
            <div>
                <EntityTypeAhead<User>
                    isMulti
                    entityQueryOption={(search) => ({
                        queryKey: ['users', search],
                        queryFn: () => fetchUsers(search),
                    })}
                    value={mockUsers.filter(u => selectedIds.includes(u.id))} // ✅ full entity objects
                    onChange={(e) => handleChange(e as User[])}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong>Selected IDs:</strong> {selectedIds.join(', ') || 'None'}
                    <br />
                    <strong>Entities:</strong> {entities.map(e => e.name).join(', ') || 'None'}
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => setSelectedIds([1, 3, 5])} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>
                        Select Users 1, 3, 5
                    </button>
                    <button onClick={() => setSelectedIds([])} style={{ padding: '0.25rem 0.5rem' }}>
                        Clear All
                    </button>
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Controlled multi-select component with external state management.' } },
    },
};

export const CustomEntityType: Story = {
    render: () => {
        const [selected, setSelected] = useState<Department | null>(null);
        return (
            <div>
                <EntityTypeAhead<Department>
                    entityQueryOption={(search) => ({
                        queryKey: ['departments', search],
                        queryFn: () => fetchDepartments(search),
                    })}
                    onChange={(dept) => setSelected(dept as Department | null)}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    {selected ? (
                        <>
                            <strong>Selected Department:</strong>
                            <div>Name: {selected.name}</div>
                            <div>Code: {selected.code}</div>
                            <div>Location: {selected.location}</div>
                        </>
                    ) : (
                        <div>No department selected</div>
                    )}
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Example using a custom entity type (Department) with additional properties.' } },
    },
};

export const LoadingState: Story = {
    render: () => {
        const slowFetchUsers = async (search?: string): Promise<User[]> => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchUsers(search);
        };

        return (
            <div>
                <EntityTypeAhead<User>
                    entityQueryOption={(search) => ({
                        queryKey: ['slow-users', search],
                        queryFn: () => slowFetchUsers(search),
                    })}
                    onChange={() => { }}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'gray' }}>
                    Note: Simulates a slow API (2 second delay)
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Demonstrates loading states with a slow API response.' } },
    },
};

export const EmptyResults: Story = {
    render: () => {
        const fetchNoResults = async (search?: string): Promise<User[]> => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return search ? [] : mockUsers;
        };

        return (
            <div>
                <EntityTypeAhead<User>
                    entityQueryOption={(search) => ({
                        queryKey: ['no-results', search],
                        queryFn: () => fetchNoResults(search),
                    })}
                    onChange={() => { }}
                />
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'gray' }}>
                    Note: Try typing to search - no results will be found
                </div>
            </div>
        );
    },
    parameters: {
        docs: { description: { story: 'Example showing behavior when no matching entities are found.' } },
    },
};