import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EntityTypeAhead, { type EntityBase } from './EntityTypeAhead';

// Mock Chakra theme
vi.mock('@chakra-ui/react', async () => {
    const actual = await vi.importActual('@chakra-ui/react');
    return {
        ...actual,
        useTheme: () => ({
            components: {
                SSTypeAhead: {
                    baseStyle: () => ({
                        control: {},
                        menu: {},
                        menuPortal: { zIndex: 9999 },
                        dropdownIndicator: {},
                        clearIndicator: {},
                        valueContainer: {}
                    })
                }
            }
        })
    };
});

interface TestEntity extends EntityBase {
    id: number;
    name: string;
}

const mockEntities: TestEntity[] = [
    { id: 1, name: 'Entity 1' },
    { id: 2, name: 'Entity 2' },
    { id: 3, name: 'Entity 3' },
    { id: 4, name: 'Another Entity' },
    { id: 5, name: 'Test Entity' }
];

const createQueryOption = (search?: string, params?: Record<string, any>) => ({
    queryKey: ['entities', search, params],
    queryFn: async (): Promise<TestEntity[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!search) {
            return mockEntities;
        }

        // Filter entities based on search
        return mockEntities.filter(entity =>
            entity.name.toLowerCase().includes(search.toLowerCase())
        );
    }
});

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0 // Disable cache between tests
            }
        }
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider>
                {children}
            </ChakraProvider>
        </QueryClientProvider>
    );
};

describe('EntityTypeAhead', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('Single Select Mode', () => {
        it('renders with default props', async () => {
            render(
                <EntityTypeAhead<TestEntity, never>
                    entityQueryOption={createQueryOption}
                />,
                { wrapper: createWrapper() }
            );

            // Wait for initial load
            await waitFor(() => {
                expect(screen.getByText('Select Entity')).toBeInTheDocument();
            });
        });

        it('displays loading placeholder when loading', async () => {
            const slowQueryOption = (search?: string) => ({
                queryKey: ['entities', search],
                queryFn: async () => {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return mockEntities;
                }
            });

            render(
                <EntityTypeAhead<TestEntity>
                    entityQueryOption={slowQueryOption}
                />,
                { wrapper: createWrapper() }
            );

            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
});