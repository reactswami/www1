/**
 * Test related utility, such as MockProviders
 */

/**
 * Silence the console (usefule when testing fail network requests)
 */
export const silenceConsole = () => {
   jest.spyOn(global.console, 'error').mockImplementation();
   jest.spyOn(global.console, 'warn').mockImplementation();
   jest.spyOn(global.console, 'log').mockImplementation();
   jest.spyOn(global.console, 'info').mockImplementation();
};
