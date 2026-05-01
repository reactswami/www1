import { render, screen } from '@testing-library/react';
import { AdminLayout, type AdminLayoutProps } from './AdminLayout';

describe('<AdminLayout />', () => {
   const defaultProps: AdminLayoutProps = {
      children: undefined,
      title: ''
   };

   it('should render successfully', () => {
      expect(() => render(<AdminLayout {...defaultProps} />)).not.toThrow();
   });

   it('should display the subtitle and the content', () => {
      const text = 'Hello, world!';
      const subtitle = 'Statseeker';

      render(
         <AdminLayout {...{ ...defaultProps, title: subtitle }}>
            <h1>{text}</h1>
         </AdminLayout>
      );

      expect(
         screen.getByRole('heading', { name: new RegExp(text, 'i') })
      ).toBeInTheDocument();
      expect(
         screen.getByRole('heading', { name: new RegExp(subtitle, 'i') })
      ).toBeInTheDocument();
   });
});
