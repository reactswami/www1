import { render, screen } from '@testing-library/react';

import { ReactQueryProvider } from './ReactQueryProvider';

describe('<ReactQueryProvider />', () => {
   it('should render successfully', () => {
      const Children = () => <p>Hello</p>;
      render(
         <ReactQueryProvider>
            <Children />
         </ReactQueryProvider>
      );

      expect(screen.getByText(/hello/i)).toBeInTheDocument();
   });
});
