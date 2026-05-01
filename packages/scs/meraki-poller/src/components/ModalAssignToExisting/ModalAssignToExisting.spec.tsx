import { useDisclosure } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { ModalAssignToExisting } from './ModalAssignToExisting';
import { testWrapper } from '~/test/utils';

describe('<ModalAssignToExisting />', () => {
   it('should render successfully', () => {
      const TestBed = () => {
         const disclosure = useDisclosure();
         return <ModalAssignToExisting disclosure={disclosure} type="networks" selectedRows={[]} />;
      };

      expect(() => render(<TestBed />, testWrapper)).not.toThrow();
   });

   it.todo('should have more tests');
});
