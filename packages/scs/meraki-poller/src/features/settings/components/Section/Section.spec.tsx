import { render, screen } from '@testing-library/react';

import { Section } from '.';

describe('<Section />', () => {
   it('should render its children', () => {
      const Child = () => <h1>Hello World</h1>;
      render(
         <Section>
            <Child />
         </Section>
      );
      expect(
         screen.getByRole('heading', { name: /hello.world/i })
      ).toBeInTheDocument();
   });
});
