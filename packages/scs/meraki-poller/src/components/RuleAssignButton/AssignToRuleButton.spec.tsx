import { type Cell } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { AssignToRuleButton } from './AssignToRuleButton';
import { testWrapper } from '~/test/utils';

describe('<AssignToRuleButton />', () => {
   it('should render successfully', () => {
      expect(() => render(<AssignToRuleButton cell={{} as Cell<any,any>} type="networks"  />, testWrapper)).not.toThrow();
   });

   it.todo('should have more tests');
});
