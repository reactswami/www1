import { memo } from 'react';

/** Typed wrapper around React.memo which is needed if using generics. */
export const memoTyped: <T>(component: T) => T = memo;