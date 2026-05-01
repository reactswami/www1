import '@testing-library/jest-dom';

import { startMockServer } from './server';

beforeAll(() => {
   startMockServer();
});
