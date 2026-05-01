import { render, screen } from '@testing-library/react';
import { Menu, includedRoutes } from './Menu';
import { testWrapper } from '~/test/utils';


describe('Menu', () => {
   it('should render', () => {
      expect(() => render(<Menu />, testWrapper)).not.toThrow();
   });

   it('should have a link for each routes', () => {
      render(<Menu />, testWrapper);
      includedRoutes.forEach(({ title }) => {
         const regexp = new RegExp(title, 'i');
         expect(screen.getByRole('link', { name: regexp })).toBeInTheDocument();
      });
   });
});
