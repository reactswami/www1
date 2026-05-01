import { useDisclosure } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { PingDiscoveryHelpModal } from './PingDiscoveryHelpModal';

describe('<PingDiscoveryHelpModal />', () => {
   it('should render successfully', () => {
      const Test = () => {
         const disclosure = useDisclosure();
         return <PingDiscoveryHelpModal disclosure={disclosure} />;
      };
      expect(() => render(<Test />)).not.toThrow();
   });
   it('should match the snapshot', async () => {
      // This doesn't need more tests at it is purely text,
      // A snapshot allows to not accidentally introduce change in the content, it has to be updated for tests to pass
      const Test = () => {
         const disclosure = useDisclosure({ defaultIsOpen: true });
         return <PingDiscoveryHelpModal disclosure={disclosure} />;
      };

      const output = render(<Test />);
      expect(output).toMatchSnapshot();
   });
});
