import '@testing-library/jest-dom';
import { vi } from 'vitest';

// mock window.matchMedia which is used by Chakra UI's useMediaQuery
Object.defineProperty(window, 'matchMedia', {
   writable: true,
   value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
   })),
});

// mock intersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
   observe: vi.fn(),
   unobserve: vi.fn(),
   disconnect: vi.fn(),
}));

// resizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
   observe: vi.fn(),
   unobserve: vi.fn(),
   disconnect: vi.fn(),
}));

// window.open
Object.defineProperty(window, 'open', {
   writable: true,
   value: vi.fn(() => ({
      addEventListener: vi.fn(),
      focus: vi.fn(),
      close: vi.fn(),
   })),
});

// console methods
global.console = {
   ...console,
   // Uncomment the line below to hide console.log during tests
   // log: vi.fn(),
   warn: vi.fn(),
   error: vi.fn(),
};

// Setup global test environment
beforeEach(() => {
   // Reset DOM
   document.body.innerHTML = '';
});