/// <reference types="vite/client" />

declare module 'oaManager/App' {
    import type React from "react";
    const App: React.ComponentType<any>;
    export default App;
}

declare module 'oaManager/*' {
    const component: any;
    export default component;
}