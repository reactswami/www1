import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { SearchProvider } from './components/SearchContext/SearchContext';
import { ReactQueryProvider } from './lib';
import searchTheme from './theme/theme';

const root = ReactDOM.createRoot(document.getElementById('global-search') as HTMLElement);

window.addEventListener('hashchange', () => {
   startKeyLogging();
});

function addKeyLogger(frame: HTMLIFrameElement) {
   const iframeDoc: HTMLDocument | undefined =
      frame?.contentDocument || frame?.contentWindow?.document;

   if (!iframeDoc) {
      return;
   }

   if (
      Array.from(iframeDoc.head.getElementsByTagName('script')).some((script) =>
         script.text.includes(eventLoggerScript)
      )
   ) {
      return;
   }

   // Create a script element
   const script = iframeDoc.createElement('script');
   script.type = 'text/javascript';

   script.text = eventLoggerScript;

   iframeDoc.head.appendChild(script);
}

function addRecursiveLogging(adminFrame: HTMLIFrameElement) {
   const adminIframeDoc: HTMLDocument | undefined =
      adminFrame?.contentDocument || adminFrame?.contentWindow?.document;

   if (!adminIframeDoc) {
      return;
   }

   const framsets = adminIframeDoc.querySelectorAll('frameset');
   if (framsets.length === 0) {
      return;
   }
   framsets[0].childNodes.forEach((node) => {
      if (node.nodeName === 'FRAME') {
         addKeyLogger(node as HTMLIFrameElement);
         node?.addEventListener('load', () => {
            addKeyLogger(node as HTMLIFrameElement);
         });
      }
   });
}

function startKeyLogging() {
   const iframe: any = document.getElementById('app-body');
   iframe?.addEventListener('load', () => {
      addKeyLogger(iframe);
      setTimeout(() => {
         const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
         const adminFrame: HTMLIFrameElement = iframeDoc.getElementById('admin_content');
         addKeyLogger(adminFrame);
         if (adminFrame) {
            adminFrame?.addEventListener('load', () => {
               addKeyLogger(adminFrame);
               addRecursiveLogging(adminFrame);
            });
         }
      }, 0);
   });
}

startKeyLogging();

window.addEventListener('message', (event) => {
   if (event.data.type === 'relay-keydown') {
      const simulatedEvent = new KeyboardEvent('keydown', {
         key: event.data.key,
         code: event.data.code,
         altKey: event.data.altKey,
         ctrlKey: event.data.ctrlKey,
         shiftKey: event.data.shiftKey,
         metaKey: event.data.metaKey,
         bubbles: true,
      });

      document.dispatchEvent(simulatedEvent);
   } else if (event.data.type === 'relay-mousedown') {
      const simulatedEvent = new MouseEvent('mousedown', {
         altKey: event.data.altKey,
         ctrlKey: event.data.ctrlKey,
         shiftKey: event.data.shiftKey,
         metaKey: event.data.metaKey,
         bubbles: true,
      });
      document.dispatchEvent(simulatedEvent);
   }
});

/**
 * Bootstrap the application with the mockServer, if not in production
 */
//@ts-ignore
if (import.meta.env.MODE === 'development') {
   import('./test/server').then(async (res) => await res.startMockServer());
}

root.render(
   <StrictMode>
      <ChakraProvider theme={extendTheme(searchTheme)}>
         <ReactQueryProvider>
            <SearchProvider>
               <ErrorBoundary>
                  <App />
               </ErrorBoundary>
            </SearchProvider>
         </ReactQueryProvider>
      </ChakraProvider>
   </StrictMode>
);

export const eventLoggerScript = `
// Configuration
const GSXX_KB_LOG_EVENT_SEARCH_CONFIG = {
   ALLOWED_ORIGIN: '*',
   TARGET_KEYS: ['k', 'Escape'],
   SCRIPT_PATH: '/js/eventlogger.js',
};

const GSXX_KB_LOG_createEventData = {
   keydown: (event) => ({
      type: 'relay-keydown',
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
   }),

   mousedown: (event) => ({
      type: 'relay-mousedown',
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
   }),
};

const GSXX_KB_LOG_shouldInterceptKey = (event) => {
   return (
      (event.ctrlKey && event.key === 'k') ||
      event.key === 'Escape'
   );
};

const GSXX_KB_LOG_handleKeydown = (event) => {
   try {
      const eventData = GSXX_KB_LOG_createEventData.keydown(event);

      if (GSXX_KB_LOG_shouldInterceptKey(event)) {
         window.parent.postMessage(eventData, GSXX_KB_LOG_EVENT_SEARCH_CONFIG.ALLOWED_ORIGIN);
         event.preventDefault();
      }
   } catch (error) {
      console.warn('Failed to relay keydown event:', error);
   }
};

const GSXX_KB_LOG_handleMousedown = (event) => {
   try {
      const eventData = GSXX_KB_LOG_createEventData.mousedown(event);
      window.parent.postMessage(eventData, GSXX_KB_LOG_EVENT_SEARCH_CONFIG.ALLOWED_ORIGIN);
   } catch (error) {
      console.warn('Failed to relay mousedown event:', error);
   }
};

const GSXX_KB_LOG_handleMessage = (event) => {
   if (!event.data || typeof event.data.type !== 'string') {
      return;
   }

   try {
      switch (event.data.type) {
         case 'relay-keydown':
            GSXX_KB_LOG_simulateKeydownEvent(event.data);
            break;
         case 'relay-mousedown':
            GSXX_KB_LOG_simulateMousedownEvent(event.data);
            break;
         default:
            // Ignore unknown event types
            break;
      }
   } catch (error) {
      console.warn('Failed to simulate event:', error);
   }
};

// Event simulation functions
const GSXX_KB_LOG_simulateKeydownEvent = (data) => {
   const simulatedEvent = new KeyboardEvent('keydown', {
      key: data.key,
      code: data.code,
      altKey: data.altKey,
      ctrlKey: data.ctrlKey,
      shiftKey: data.shiftKey,
      metaKey: data.metaKey,
      bubbles: true,
      cancelable: true,
   });

   document.dispatchEvent(simulatedEvent);
};

const GSXX_KB_LOG_simulateMousedownEvent = (data) => {
   const simulatedEvent = new MouseEvent('mousedown', {
      altKey: data.altKey,
      ctrlKey: data.ctrlKey,
      shiftKey: data.shiftKey,
      metaKey: data.metaKey,
      bubbles: true,
      cancelable: true,
   });

   document.dispatchEvent(simulatedEvent);
};

let GSXX_KB_LOG_cleanupFunctions = [];

const cleanup = () => {
   GSXX_KB_LOG_cleanupFunctions.forEach(fn => fn());
   GSXX_KB_LOG_cleanupFunctions = [];
};

const GSXX_KB_LOG_initializeEventLogger = () => {
   cleanup();

   window.addEventListener('keydown', GSXX_KB_LOG_handleKeydown, { passive: false });
   window.addEventListener('mousedown', GSXX_KB_LOG_handleMousedown, { passive: false });
   window.addEventListener('message', GSXX_KB_LOG_handleMessage);

   GSXX_KB_LOG_cleanupFunctions = [
      () => window.removeEventListener('keydown', GSXX_KB_LOG_handleKeydown),
      () => window.removeEventListener('mousedown', GSXX_KB_LOG_handleMousedown),
      () => window.removeEventListener('message', GSXX_KB_LOG_handleMessage),
   ];

   // Cleanup on page unload
   window.addEventListener('beforeunload', cleanup, { once: true });
};

// Auto-initialize when script loads
GSXX_KB_LOG_initializeEventLogger();

`;
