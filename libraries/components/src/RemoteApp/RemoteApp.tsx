import { Alert, AlertDescription, AlertIcon, Box, Spinner, Center } from '@chakra-ui/react';
import { loadRemoteModule, type RemoteConfig } from '@statseeker/utils/remoteLoader';
import React, { useState, useEffect, } from 'react';

/**
 * RemoteApp Component
 * 
 * A React component that dynamically loads and renders remote micro-frontend modules
 * using Module Federation or similar remote module loading patterns.
 * 
 * @component
 * @example
 * ```tsx
 * <RemoteApp 
 *   appName="oaManager" 
 *   moduleName="./App" 
 *   remotesConfig={remotesConfiguration}
 *   friendlyAppName='OA Manager'
 *   props={{ userId: 123, theme: 'dark' }}
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} props.appName - The name/identifier of the remote application to load
 * @param {string} props.moduleName - The specific module path within the remote app (e.g., "./App")
 * @param {RemotesConfiguration} props.remotesConfig - Configuration object containing remote app URLs and settings
 * @param {string} props.friendlyAppName - The name given to the app so it can be identified in the remote loading logs and alerts
 * @param {T} props.props - Props to be passed through to the loaded remote component
 * 
 * @returns {JSX.Element} The rendered remote component, loading spinner, or error message
 */
export default function RemoteApp<T extends Record<string, unknown> = Record<string, never>>({
    appName,
    moduleName,
    envConfig,
    friendlyAppName = `Remote Component`,
    props,
}: {
    props?: T;
    appName: string;
    moduleName: string;
    envConfig: Record<string, RemoteConfig>;
    friendlyAppName?: string;
}) {
    // State to store the dynamically loaded remote component
    const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType<T> | null>(null);

    // Loading state to show spinner while fetching remote module
    const [loading, setLoading] = useState(true);

    // Error state to capture and display any loading failures
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Track if component is still mounted to prevent state updates after unmount
        let mounted = true;

        /**
         * Asynchronously loads the remote module and updates component state
         * Handles the complete lifecycle of remote module loading including error handling
         */
        const loadRemote = async () => {
            try {
                console.info(`[${appName.toUpperCase()}] Starting to load ${friendlyAppName}...`);

                // Load the remote module using the provided configuration
                const module = await loadRemoteModule(
                    appName,
                    moduleName,
                    envConfig
                );

                console.info(`[${appName.toUpperCase()}] ${friendlyAppName} loaded successfully:`, module);

                if (mounted) {
                    // Extract the component from module (handles both default and named exports)
                    const Component = module.default || module;

                    if (!Component) {
                        throw new Error('No component found in remote module');
                    }

                    console.info(`[${appName.toUpperCase()}] Setting remote component`);
                    // Store component in state using function form to avoid immediate invocation
                    setRemoteComponent(() => Component as React.ComponentType<T>);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`[${appName.toUpperCase()}] Failed to load remote:`, err);
                if (mounted) {
                    // Store error message for display
                    setError(err instanceof Error ? err.message : String(err));
                    setLoading(false);
                }
            }
        };

        loadRemote();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            mounted = false;
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Loading state UI - shows spinner while remote module is being fetched
    if (loading) {
        return (
            <Center p={8}>
                <Spinner size="xl" />
                <Box ml={4}>{`Loading ${friendlyAppName}...`}</Box>
            </Center>
        );
    }

    // Error state UI - displays error message if loading failed
    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                <Box>
                    <AlertDescription mb={2}>
                        {`Failed to load ${friendlyAppName}: ${error}`}
                    </AlertDescription>
                    <AlertDescription fontSize="sm" color="gray.600">
                        Check browser console for detailed logs
                    </AlertDescription>
                </Box>
            </Alert>
        );
    }

    // Fallback UI if no component was loaded but no error occurred
    if (!RemoteComponent) {
        return (
            <Alert status="warning">
                <AlertIcon />
                <AlertDescription>
                    {`${friendlyAppName} not available`}
                </AlertDescription>
            </Alert>
        );
    }

    // Render the successfully loaded remote component wrapped in error boundary
    return (
        <ErrorBoundary appName={friendlyAppName}>
            <RemoteComponent {...(props ?? {} as T)} />
        </ErrorBoundary>
    );
}

/**
 * ErrorBoundary Component
 * 
 * A React error boundary that catches and handles errors thrown by the remote component
 * during rendering. Prevents the entire application from crashing due to remote component errors.
 * 
 * @class
 * @extends {React.Component}
 * 
 * Features:
 * - Catches errors in child component tree
 * - Displays user-friendly error message
 * - Logs detailed error information to console
 * - Prevents error propagation to parent components
 */
class ErrorBoundary extends React.Component<
    { children: React.ReactNode; appName: string },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * Static lifecycle method called when an error is thrown in a child component
     * Updates state to trigger error UI rendering
     * 
     * @param {Error} error - The error that was thrown
     * @returns {Object} New state object with error information
     */
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called after an error is caught
     * Used for logging error details to console or external error tracking service
     * 
     * @param {Error} error - The error that was thrown
     * @param {React.ErrorInfo} errorInfo - Additional information about the error (component stack)
     */
    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`[ErrorBoundary] ${this.props.appName} error:`, error, errorInfo);
    }

    override render() {
        // If error occurred, render error UI instead of children
        if (this.state.hasError) {
            return (
                <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>
                        {`${this.props.appName} crashed: ${this.state.error?.message}`}
                    </AlertDescription>
                </Alert>
            );
        }

        // No error - render children normally
        return this.props.children;
    }
}