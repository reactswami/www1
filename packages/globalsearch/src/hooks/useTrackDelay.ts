import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Enumeration of possible tracking delay statuses
 */
export enum TRACK_DELAY_STATUS {
    /** Idle state - resets the tracking timer */
    IDLE = 'track_idle',
    /** Start state - begins timing delay */
    START = 'track_start',
    /** End state - stops timing and executes callback with final delay */
    END = 'track_end',
    /** Pause state - executes callback with current delay but continues tracking */
    PAUSE = 'track_pause',
}

/**
 * Hook parameters interface
 */
interface UseTrackDelayParams<T> {
    /** The item being tracked (e.g., search term, user ID, etc.) */
    tracker: T;
    /** Current status of the tracking operation */
    status: TRACK_DELAY_STATUS;
    /** Callback function executed when status changes to END or PAUSE */
    callback: (tracker: T, delay: number, status: TRACK_DELAY_STATUS) => void;
}

/**
 * Hook return interface
 */
interface UseTrackDelayReturn {
    /** Function to get the current delay in milliseconds */
    getDelay: () => number;
}

/**
 * Custom hook for tracking time delays between status changes
 * 
 * This hook is useful for measuring performance metrics, user interaction delays,
 * or timing operations that span multiple state changes.
 * 
 * @example
 * ```typescript
 * const trackSearchCallback = useCallback(
 *   (searchTerm: string, delay: number, status: TRACK_DELAY_STATUS) => {
 *     console.log(`Search for "${searchTerm}" took ${delay}ms`);
 *   },
 *   []
 * );
 * 
 * const { getDelay } = useTrackDelay({
 *   tracker: searchTerm,
 *   status: trackingStatus,
 *   callback: trackSearchCallback
 * });
 * ```
 * 
 * @param params - Configuration object for the tracking hook
 * @param params.tracker - The value being tracked (generic type T)
 * @param params.status - Current status determining hook behavior
 * @param params.callback - Function called when END or PAUSE status is reached
 * @returns Object containing utility functions for delay tracking
 */
function useTrackDelay<T>({ tracker, status, callback }: UseTrackDelayParams<T>): UseTrackDelayReturn {
    // Ref to store the latest callback to avoid stale closures
    const callbackRef = useRef(callback);

    // State to track the start timestamp (in milliseconds)
    const [start, setStart] = useState(0);

    // Always keep the callback ref updated with the latest callback
    callbackRef.current = callback;

    /**
     * Effect to handle status changes and timing logic
     * Responds to different statuses:
     * - START: Records current timestamp as start time
     * - END: Calculates final delay, executes callback, and resets
     * - PAUSE: Executes callback with current delay (without resetting)
     * - IDLE: Resets the start time to 0
     */
    useEffect(() => {
        if (status === TRACK_DELAY_STATUS.END) {
            // Calculate final delay and execute callback
            callbackRef.current(tracker, Date.now() - start, status);
            // Reset start time for next tracking cycle
            setStart(0);
        }

        if (status === TRACK_DELAY_STATUS.IDLE) {
            // Reset tracking without executing callback
            setStart(0);
        }

        if (status === TRACK_DELAY_STATUS.PAUSE) {
            // Execute callback with current delay but don't reset
            callbackRef.current(tracker, Date.now() - start, status);
        }

        if (status === TRACK_DELAY_STATUS.START) {
            // Begin tracking by recording current timestamp
            setStart(Date.now());
        }
    }, [status, tracker]); // Re-run when status or tracker changes

    /**
     * Memoized function to calculate current delay from start time
     * @returns The number of milliseconds elapsed since tracking started
     */
    const getDelay = useCallback(() => {
        return Date.now() - start;
    }, [start]);

    return {
        getDelay,
    };
}

export default useTrackDelay;