import { render } from '@testing-library/react';
import { vi } from 'vitest';
import {
   FormNetworkConfigPollingIntervalRadio,
   type Props,
} from './FormNetworkConfigPollingIntervalRadio';
import { testWrapper } from '~/test/utils';

describe('<FormNetworkConfigPollingIntervalRadio />', () => {
   const defaultProps: Props = {
      value: 0,
      label: '',
      isSelected: false,
      setValue: vi.fn(),
   };
   it('should render successfully', () => {
      expect(() =>
         render(
            <FormNetworkConfigPollingIntervalRadio {...defaultProps} />,
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
