import { render, screen } from '@testing-library/react';

import { TableServiceTag } from './TableServiceTag';

describe('<TableServiceTag />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<TableServiceTag servicesString="ltm,ssh" id={'1'} />)
      ).not.toThrow();
   });

   it('should display the services tag', () => {
      render(<TableServiceTag servicesString="ltm,ssh" id={'1'} />);
      expect(screen.getByText('ssh')).toBeInTheDocument();
      expect(screen.getByText('ltm')).toBeInTheDocument();
   });
});
