/**
 * Remote Module Loader for Module Federation
 * 
 * This module provides utilities for dynamically loading remote modules in a Module Federation architecture.
 * It handles shared dependencies, caching, and configuration management for both development and production environments.
 * 
 * Key Features:
 * - Dynamic remote module loading with shared dependency management
 * - Multi-environment configuration support (development/production)
 * - Intelligent caching for both remote containers and packages
 * - Preloading capabilities for performance optimization
 * - Comprehensive error handling and logging
 * 
 * @module remoteLoader
 */

/**
 * Represents a shared dependency configuration between host and remote applications.
 * Shared dependencies are loaded once by the host and shared across all remotes.
 */
export interface SharedDependency {
    /** NPM package name (e.g., 'react', '@chakra-ui/react') */
    packageName: string;
    /** Semantic version of the package (e.g., '18.3.1') */
    version: string;
}

/**
 * Configuration for a single remote application.
 */
export interface RemoteConfig {
    /** Unique identifier for the remote application */
    name: string;
    /** URL to the remote's entry point (remoteEntry.js) */
    url: string;
    /** Module Federation scope name for the remote */
    scope: string;
    /** Optional list of shared dependencies. Defaults to DEFAULT_SHARED_DEPENDENCIES if not provided */
    shared?: SharedDependency[];
}

/**
 * Complete remotes configuration for different environments.
 * Allows different remote URLs and configurations for development vs production.
 */
export interface RemotesConfiguration {
    /** Configuration map for development environment */
    development: Record<string, RemoteConfig>;
    /** Configuration map for production environment */
    production: Record<string, RemoteConfig>;
}

/**
 * Internal representation of a loaded remote container with metadata.
 */
interface LoadedRemote {
    /** The loaded Module Federation container with init() and get() methods */
    container: any;
    /** URL from which the remote was loaded */
    url: string;
    /** Timestamp when the remote was loaded (for cache management) */
    loadedAt: number;
}

/**
 * Cache for loaded remote containers to avoid redundant network requests.
 * Key: remote name, Value: LoadedRemote object
 */
const remoteCache = new Map<string, LoadedRemote>();

/**
 * Cache for imported packages to prevent duplicate imports.
 * Key: package name, Value: imported module
 */
const packageCache = new Map<string, any>();

/**
 * Default shared dependencies used when a remote doesn't specify its own.
 * These are common libraries that are typically shared across micro-frontends.
 */
export const DEFAULT_SHARED_DEPENDENCIES: SharedDependency[] = [
    { packageName: 'react', version: '18.3.1', },
    { packageName: 'react-dom', version: '18.3.1', },
    { packageName: '@chakra-ui/react', version: '2.0.0', },
    { packageName: 'react-select', version: '5.10.2', },
    { packageName: 'react-select/async', version: '5.10.2', },
];

/**
 * Retrieves and validates a remote configuration from the environment config.
 * Automatically applies default shared dependencies if none are specified.
 * 
 * @param remoteName - Name of the remote to retrieve
 * @param envConfig - Environment-specific configuration map
 * @returns The remote configuration with shared dependencies
 * @throws Error if the remote is not found in configuration
 * 
 * @example
 * ```typescript
 * const config = getRemoteConfig('myRemote', remotesConfig.development);
 * console.log(config.url); // 'http://localhost:3001/remoteEntry.js'
 * ```
 */
export function getRemoteConfig(remoteName: string, envConfig: Record<string, RemoteConfig>): RemoteConfig {
    const config = envConfig[remoteName];

    if (!config) {
        throw new Error(`Remote "${remoteName}" not found in configuration`);
    }

    if (!config.shared || config.shared.length === 0) {
        config.shared = DEFAULT_SHARED_DEPENDENCIES;
    }

    return config;
}


/**
 * Dynamically imports a package and caches the result.
 * Uses a switch statement for common packages to satisfy Vite's static analysis requirements.
 * 
 * @param packageName - NPM package name to import
 * @returns Promise resolving to the imported module
 * @throws Error if the package cannot be imported
 * 
 * @remarks
 * The switch statement is necessary because Vite requires package names to be known at build time.
 * For unlisted packages, it falls back to dynamic import with @vite-ignore comment.
 * 
 * @example
 * ```typescript
 * const React = await importPackage('react');
 * const { useState } = React;
 * ```
 */
async function importPackage(packageName: string): Promise<any> {
    // Check cache first
    if (packageCache.has(packageName)) {
        console.info(`[RemoteLoader] Using cached package: ${packageName}`);
        return packageCache.get(packageName);
    }

    console.info(`[RemoteLoader] Importing package: ${packageName}`);

    try {
        let module;

        // Use dynamic import with special handling for common packages
        // vite needs to know the names at the time of the bundling,
        // hence the switch case.
        switch (packageName) {
            case 'react':
                module = await import('react');
                break;
            case 'react-dom':
                module = await import('react-dom');
                break;
            case '@chakra-ui/react':
                module = await import('@chakra-ui/react');
                break;
            case '@emotion/react':
                module = await import('@emotion/react');
                break;
            case '@emotion/styled':
                module = await import('@emotion/styled');
                break;
            case 'framer-motion':
                module = await import('framer-motion');
                break;
            case 'react-select':
                module = await import('react-select');
                break;
            case 'react-select/async':
                module = await import('react-select/async');
                break;
            default:
                // For other packages, use dynamic import with template string
                module = await import(/* @vite-ignore */ packageName);
        }

        packageCache.set(packageName, module);
        return module;
    } catch (error) {
        console.error(`[RemoteLoader] Failed to import package ${packageName}:`, error);
        throw new Error(`Failed to import shared dependency: ${packageName}`);
    }
}

/**
 * Loads all shared dependencies and creates a shared scope object for Module Federation.
 * The shared scope allows remotes to use the host's versions of shared libraries.
 * 
 * @param sharedDeps - Array of shared dependency configurations
 * @returns Promise resolving to a Module Federation shared scope object
 * 
 * @remarks
 * The shared scope format follows Module Federation's specification:
 * ```
 * {
 *   'package-name': {
 *     'version': {
 *       get: () => Promise<Module>,
 *       loaded: true,
 *       from: 'host'
 *     }
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * const sharedScope = await loadSharedDependencies([
 *   { packageName: 'react', version: '18.3.1' }
 * ]);
 * await remoteContainer.init(sharedScope);
 * ```
 */
async function loadSharedDependencies(sharedDeps: SharedDependency[]): Promise<any> {
    console.info(`[RemoteLoader] Loading ${sharedDeps.length} shared dependencies...`);

    const sharedScope: any = {};

    for (const dep of sharedDeps) {
        try {
            const module = await importPackage(dep.packageName);

            sharedScope[dep.packageName] = {
                [dep.version]: {
                    get: async () => () => module,
                    loaded: true,
                    from: 'host',
                }
            };

            console.info(`[RemoteLoader] ✓ Loaded shared dependency: ${dep.packageName}@${dep.version}`);
        } catch (error) {
            console.error(`[RemoteLoader] ✗ Failed to load shared dependency: ${dep.packageName}`, error);
            // Continue with other dependencies even if one fails
        }
    }

    console.info(`[RemoteLoader] Shared dependencies loaded`);
    return sharedScope;
}

/**
 * Dynamically loads a module from a remote application using Module Federation.
 * Handles caching, shared dependencies, and initialization of the remote container.
 * 
 * @param remoteName - Name of the remote (must exist in envConfig)
 * @param moduleName - Module path to load from the remote (e.g., './App', './components/Button')
 * @param envConfig - Environment-specific remote configuration
 * @param options - Optional loading configuration
 * @param options.forceReload - If true, bypasses cache and reloads the remote
 * @param options.loadCSS - Reserved for future CSS loading functionality
 * @returns Promise resolving to the loaded module
 * @throws Error if remote is not found, container is invalid, or loading fails
 * 
 * @example
 * ```typescript
 * // Load a component from a remote
 * const RemoteApp = await loadRemoteModule(
 *   'myRemote',
 *   './App',
 *   remotesConfig.production
 * );
 * 
 * // Force reload without cache
 * const FreshModule = await loadRemoteModule(
 *   'myRemote',
 *   './App',
 *   remotesConfig.production,
 *   { forceReload: true }
 * );
 * ```
 */
export async function loadRemoteModule(
    remoteName: string,
    moduleName: string,
    envConfig: Record<string, RemoteConfig>,
    options?: {
        forceReload?: boolean;
        loadCSS?: boolean;
    }
): Promise<any> {
    const {
        forceReload = false,
    } = options || {};

    console.info(`[RemoteLoader] Loading module "${moduleName}" from remote "${remoteName}"`);

    try {
        // Get remote configuration
        const config = getRemoteConfig(remoteName, envConfig);
        const { url: remoteUrl, shared } = config;

        console.info(`[RemoteLoader] Remote URL: ${remoteUrl}`);
        console.info(`[RemoteLoader] Shared dependencies configured: ${shared ? shared.length : 0}`);

        // Check cache
        if (!forceReload && remoteCache.has(remoteName)) {
            const cached = remoteCache.get(remoteName)!;
            console.info(`[RemoteLoader] Using cached remote (loaded ${Date.now() - cached.loadedAt}ms ago)`);

            const factory = await cached.container.get(moduleName);
            return await factory();
        }

        // Import the remoteEntry.js as an ES module
        console.info(`[RemoteLoader] Importing remote container...`);
        const remoteContainer = await import(remoteUrl);

        if (!remoteContainer.get || !remoteContainer.init) {
            throw new Error('Remote container missing get() or init() methods');
        }

        // Load shared dependencies from configuration
        const sharedDeps = shared || [];
        const sharedScope = await loadSharedDependencies(sharedDeps);

        // Initialize the remote with shared dependencies
        console.info(`[RemoteLoader] Initializing remote with shared scope...`);
        await remoteContainer.init(sharedScope);

        remoteCache.set(remoteName, {
            container: remoteContainer,
            url: remoteUrl,
            loadedAt: Date.now(),
        });

        console.info(`[RemoteLoader] Remote initialized successfully`);

        const factory = await remoteContainer.get(moduleName);
        const module = await factory();

        console.info(`[RemoteLoader] Module loaded successfully`);

        return module;
    } catch (error) {
        console.error(`[RemoteLoader] Error loading remote "${remoteName}":`, error);
        throw error;
    }
}

/**
 * Preloads a remote application's entry script for improved performance.
 * Uses browser's modulepreload to fetch the remote's JavaScript before it's needed.
 * 
 * @param remoteName - Name of the remote to preload
 * @param envConfig - Environment-specific remote configuration
 * 
 * @remarks
 * Preloading is useful for critical remotes that will be needed soon.
 * The browser downloads the script in the background but doesn't execute it.
 * 
 * @example
 * ```typescript
 * // Preload a remote during app initialization
 * preloadRemote('myRemote', remotesConfig.production);
 * 
 * // Later, when you actually need it, it loads faster
 * const module = await loadRemoteModule('myRemote', './App', remotesConfig.production);
 * ```
 */
export function preloadRemote(remoteName: string, envConfig: Record<string, RemoteConfig>,): void {
    try {
        const config = getRemoteConfig(remoteName, envConfig);

        // Preload JS
        const jsLink = document.createElement('link');
        jsLink.rel = 'modulepreload';
        jsLink.href = config.url;
        document.head.appendChild(jsLink);
        console.info(`[RemoteLoader] Preloading remote JS: ${remoteName}`);

    } catch (error) {
        console.error(`[RemoteLoader] Error preloading remote:`, error);
    }
}

/**
 * Clears the remote container cache for one or all remotes.
 * Useful for development, hot reloading, or forcing fresh loads.
 * 
 * @param remoteName - Optional name of specific remote to clear. If omitted, clears all remotes.
 * 
 * @example
 * ```typescript
 * // Clear specific remote
 * clearRemoteCache('myRemote');
 * 
 * // Clear all remotes
 * clearRemoteCache();
 * ```
 */
export function clearRemoteCache(remoteName?: string): void {
    if (remoteName) {
        remoteCache.delete(remoteName);
        console.info(`[RemoteLoader] Cleared cache for: ${remoteName}`);
    } else {
        remoteCache.clear();
        console.info(`[RemoteLoader] Cleared all remote cache`);
    }
}


/**
 * Clears the package import cache.
 * Forces fresh imports of all packages on next use.
 * 
 * @example
 * ```typescript
 * clearPackageCache();
 * // Next importPackage() call will re-import from source
 * ```
 */
export function clearPackageCache(): void {
    packageCache.clear();
    console.info(`[RemoteLoader] Cleared package cache`);
}

/**
 * Clears both remote and package caches.
 * Convenience method for complete cache reset.
 * 
 * @example
 * ```typescript
 * // Reset everything
 * clearAllCaches();
 * ```
 */
export function clearAllCaches(): void {
    clearRemoteCache();
    clearPackageCache();
}

/**
 * Returns statistics about current cache state.
 * Useful for debugging, monitoring, and performance analysis.
 * 
 * @returns Object containing cache statistics
 * @returns remotesLoaded - Number of cached remote containers
 * @returns remotes - Array of cached remote names
 * @returns packagesLoaded - Number of cached packages
 * @returns packages - Array of cached package names
 * 
 * @example
 * ```typescript
 * const stats = getRemoteCacheStats();
 * console.log(`Loaded ${stats.remotesLoaded} remotes:`, stats.remotes);
 * console.log(`Cached ${stats.packagesLoaded} packages:`, stats.packages);
 * ```
 */
export function getRemoteCacheStats() {
    return {
        remotesLoaded: remoteCache.size,
        remotes: Array.from(remoteCache.keys()),
        packagesLoaded: packageCache.size,
        packages: Array.from(packageCache.keys()),
    };
}
