import { afterAll, afterEach, beforeEach } from 'vitest';
import { server } from './server/node';

beforeEach(() => {
   server.listen();
});

afterEach(() => {
   server.resetHandlers();
});

afterAll(() => {
   server.close();
});
