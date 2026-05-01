import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import {
   PingDiscoveryOutputSection,
   type Props,
} from './PingDiscoveryOutputSection';

describe('<PingDiscoveryOutputSection />', () => {
   const defaultProps: Props = {
      iframeURL: '',
      iframeRef: createRef<HTMLIFrameElement>(),
      isRunning: false,
   };

   it('should render successfully', () => {
      expect(() =>
         render(<PingDiscoveryOutputSection {...defaultProps} />)
      ).not.toThrow();
   });
   it('should show an instruction message when there is no iframe', () => {
      render(
         <PingDiscoveryOutputSection
            {...{ ...defaultProps, iframeURL: null }}
         />
      );
      expect(
         screen.getByText(/the.results.*will.*be.*displayed/i)
      ).toBeInTheDocument();
      expect(screen.getAllByText(/output/i).length).toBeGreaterThan(0);
   });
   it('should not show an instruction message when there is an iframe', () => {
      render(
         <PingDiscoveryOutputSection
            {...{ ...defaultProps, isRunning: true, iframeURL: 'a-fake-url' }}
         />
      );
      expect(
         screen.queryByText(/the.results.*will.*be.*displayed/i)
      ).toBeNull();
   });
});
