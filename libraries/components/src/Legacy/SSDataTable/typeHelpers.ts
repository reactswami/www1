//
// Utility functions to assist with Typescript
//

import { memo as _memo } from 'react';

/**
 * Wrap React's memo to maintain type information
 */

export const memo: <T>(c: T) => T = _memo;