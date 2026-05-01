import { useDisclosure } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { ModalAddForm } from './ModalAddForm';
import { testWrapper } from '~/test/utils';

describe('<OaModalEditForm />', () => {
   it('should render successfully', () => {
      const ModalWrapper = () => {
         const disclosure = useDisclosure();

         return (
            <div>
               <ModalAddForm disclosure={disclosure} />
            </div>
         );
      };

      expect(() => render(<ModalWrapper />, testWrapper)).not.toThrow();
   });

   it.todo('should have more tests');
});
