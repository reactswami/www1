import { vi } from 'vitest';
/**
 * Test related utility, such as MockProviders
 */

/**
 * Silence the console (usefule when testing fail network requests)
 */
export const silenceConsole = () => {
   vi.spyOn(global.console, 'error').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'warn').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'log').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'info').mockImplementation(vi.fn());
};
