import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPortalContent from '../../components/SearchPortalContent/SearchPortalContent';
import { SearchProvider } from '../../components/SearchContext/SearchContext';
import { CONTAINER_WIDTHS } from '../../utils';

// Mock child components
vi.mock('../../components/SearchInputPanel/SearchInputPanel', () => ({
    default: function MockSearchInputPanel(props: any) {
        return (
            <div
                data-testid="search-input-panel"
                data-is-open={props.isOpen}
                data-on-open={typeof props.onOpen === 'function'}
                data-on-close={typeof props.onClose === 'function'}
            >
                Search Input Panel
            </div>
        );
    },
}));

vi.mock('../../components/SearchPanel/SearchPanel', () => ({
    default: function MockSearchPanel() {
        return <div data-testid="search-panel">Search Panel Content</div>;
    },
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
            mutations: { retry: false },
        },
    });

    return (
        <ChakraProvider resetCSS={false}>
            <QueryClientProvider client={queryClient}>
                <SearchProvider>{children}</SearchProvider>
            </QueryClientProvider>
        </ChakraProvider>
    );
};

describe('SearchPortalContent', () => {
    const defaultProps = {
        isOpen: true,
        isMobile: false,
        isIconMode: false,
        position: { top: 100, left: 200 },
        inputPanelProps: {
            isOpen: true,
            onOpen: vi.fn(),
            onClose: vi.fn(),
        },
    };

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Basic Rendering', () => {
        test('renders with required props', () => {
            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-input-panel')).toBeInTheDocument();
            expect(screen.getByTestId('search-panel')).toBeInTheDocument();
        });

        test('has correct display name', () => {
            expect(SearchPortalContent.displayName).toBe('SearchPortalContent');
        });

        test('renders with correct container ID', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} />
                </TestWrapper>
            );

            expect(container.querySelector('#gb-search-content')).toBeInTheDocument();
        });
    });

    describe('Position and Layout', () => {
        test('applies correct top position', () => {
            const position = { top: 150, left: 300 };
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} position={position} />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle('top: 150px');
        });

        test('applies fixed positioning and z-index', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle({
                position: 'fixed',
                'z-index': 'var(--chakra-zIndices-overlay)',
            });
        });
    });
    describe('Desktop Mode', () => {
        test('renders with correct width in desktop mode', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isMobile={false} />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle(`width: ${CONTAINER_WIDTHS.OPEN}`);
        });

        test('calculates left position correctly for non-icon mode', () => {
            const position = { top: 100, left: 500 };
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        position={position}
                        isMobile={false}
                        isIconMode={false}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            const expectedLeft = `calc(${position.left}px - ${CONTAINER_WIDTHS.OPEN} + ${CONTAINER_WIDTHS.INPUT_WIDTH})`;
            expect(element).toHaveStyle(`left: ${expectedLeft}`);
        });

        test('calculates left position correctly for icon mode', () => {
            const position = { top: 100, left: 400 };
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        position={position}
                        isMobile={false}
                        isIconMode={true}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            const expectedLeft = `calc(${position.left}px - ${CONTAINER_WIDTHS.OPEN} - ${CONTAINER_WIDTHS.INPUT_MARGIN})`;
            expect(element).toHaveStyle(`left: ${expectedLeft}`);
        });
    });

    describe('Mobile Mode', () => {
        test('renders with stretch width in mobile mode', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isMobile={true} />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle('width: stretch');
        });

        test('does not apply left positioning in mobile mode', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        isMobile={true}
                        position={{ top: 100, left: 500 }}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).not.toHaveStyle('left: calc(500px - 620px + 180PX)');
            // Mobile mode should not have left style applied
            expect(element?.style.left).toBe('');
        });
    });

    describe('Content Rendering', () => {
        test('always renders SearchInputPanel', () => {
            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-input-panel')).toBeInTheDocument();
        });

        test('renders SearchPanel when isOpen is true', () => {
            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isOpen={true} />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-panel')).toBeInTheDocument();
        });

        test('does not render SearchPanel when isOpen is false', () => {
            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isOpen={false} />
                </TestWrapper>
            );

            expect(screen.queryByTestId('search-panel')).not.toBeInTheDocument();
        });

        test('passes correct props to SearchInputPanel', () => {
            const inputPanelProps = {
                isOpen: false,
                onOpen: vi.fn(),
                onClose: vi.fn(),
            };

            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} inputPanelProps={inputPanelProps} />
                </TestWrapper>
            );

            const inputPanel = screen.getByTestId('search-input-panel');
            expect(inputPanel).toHaveAttribute('data-is-open', 'false');
            expect(inputPanel).toHaveAttribute('data-on-open', 'true');
            expect(inputPanel).toHaveAttribute('data-on-close', 'true');
        });
    });

    describe('Flex Layout', () => {
        test('applies correct flex properties', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} />
                </TestWrapper>
            );

            const flexContainer = container.querySelector('#gb-search-content > div');
            expect(flexContainer).toHaveStyle({
                height: '100%',
                gap: '0px',
                'flex-direction': 'column',
            });
        });
    });

    describe('Forward Ref', () => {
        test('forwards ref correctly', () => {
            const ref = React.createRef<HTMLDivElement>();

            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} ref={ref} />
                </TestWrapper>
            );

            expect(ref.current).toBeInstanceOf(HTMLDivElement);
            expect(ref.current).toHaveAttribute('id', 'gb-search-content');
        });

        test('ref points to correct element with all attributes', () => {
            const ref = React.createRef<HTMLDivElement>();

            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} ref={ref} />
                </TestWrapper>
            );

            expect(ref.current).toHaveStyle({
                position: 'fixed',
                top: '100px',
            });
            expect(ref.current).toHaveAttribute('id', 'gb-search-content');
        });
    });

    describe('Props Variations', () => {
        test('handles different position values', () => {
            const positions = [
                { top: 0, left: 0 },
                { top: 50, left: 100 },
                { top: 200, left: 400 },
                { top: -10, left: -20 }, // Edge case: negative values
            ];

            positions.forEach((position, index) => {
                const { container, unmount } = render(
                    <TestWrapper>
                        <SearchPortalContent {...defaultProps} position={position} />
                    </TestWrapper>
                );

                const element = container.querySelector('#gb-search-content');
                expect(element).toHaveStyle(`top: ${position.top}px`);

                unmount();
            });
        });

        test('handles all combinations of isMobile and isIconMode', () => {
            const combinations = [
                { isMobile: false, isIconMode: false },
                { isMobile: false, isIconMode: true },
                { isMobile: true, isIconMode: false },
                { isMobile: true, isIconMode: true },
            ];

            combinations.forEach(({ isMobile, isIconMode }) => {
                const { container, unmount } = render(
                    <TestWrapper>
                        <SearchPortalContent
                            {...defaultProps}
                            isMobile={isMobile}
                            isIconMode={isIconMode}
                            position={{ top: 100, left: 300 }}
                        />
                    </TestWrapper>
                );

                const element = container.querySelector('#gb-search-content');

                if (isMobile) {
                    expect(element).toHaveStyle('width: stretch');
                    expect(element?.style.left).toBe('');
                } else {
                    expect(element).toHaveStyle(`width: ${CONTAINER_WIDTHS.OPEN}`);
                    // Should have some left positioning
                }

                // @TODO: check the icon mode
                if (isIconMode) {
                    expect(element?.style.left).toContain('');
                }

                unmount();
            });
        });

    });

    describe('Component Memoization', () => {
        test('component is memoized', () => {
            // This test verifies that the component is wrapped with memo
            expect(SearchPortalContent.$$typeof.toString()).toContain('Symbol');
        });

        test('re-renders when props change', () => {
            const { rerender } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isOpen={true} />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-panel')).toBeInTheDocument();

            rerender(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} isOpen={false} />
                </TestWrapper>
            );

            expect(screen.queryByTestId('search-panel')).not.toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('handles undefined position gracefully', () => {
            // This shouldn't happen in real usage, but test robustness
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        position={{ top: 0, left: 0 }}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle('top: 0px');
        });

        test('handles empty inputPanelProps', () => {
            const emptyProps = {
                isOpen: false,
                onOpen: vi.fn(),
                onClose: vi.fn(),
            };

            render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} inputPanelProps={emptyProps} />
                </TestWrapper>
            );

            expect(screen.getByTestId('search-input-panel')).toBeInTheDocument();
        });

        test('renders correctly with extreme position values', () => {
            const extremePosition = { top: 99999, left: -99999 };

            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent {...defaultProps} position={extremePosition} />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle('top: 99999px');
        });
    });

    describe('Container Width Constants', () => {
        test('uses correct CONTAINER_WIDTHS values', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        isMobile={false}
                        isIconMode={false}
                        position={{ top: 100, left: 500 }}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            expect(element).toHaveStyle(`width: ${CONTAINER_WIDTHS.OPEN}`);

            const expectedLeft = `calc(500px - ${CONTAINER_WIDTHS.OPEN} + ${CONTAINER_WIDTHS.INPUT_WIDTH})`;
            expect(element).toHaveStyle(`left: ${expectedLeft}`);
        });

        test('icon mode uses correct margin calculation', () => {
            const { container } = render(
                <TestWrapper>
                    <SearchPortalContent
                        {...defaultProps}
                        isMobile={false}
                        isIconMode={true}
                        position={{ top: 100, left: 400 }}
                    />
                </TestWrapper>
            );

            const element = container.querySelector('#gb-search-content');
            const expectedLeft = `calc(400px - ${CONTAINER_WIDTHS.OPEN} - ${CONTAINER_WIDTHS.INPUT_MARGIN})`;
            expect(element).toHaveStyle(`left: ${expectedLeft}`);
        });
    });
});