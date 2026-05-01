import { render } from '@testing-library/react';

import App from './App';

describe('App', () => {
   it('should render successfully', () => {
      expect(() => render(<App />)).not.toThrow();
   });
});
