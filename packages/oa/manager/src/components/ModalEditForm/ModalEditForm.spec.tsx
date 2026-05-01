import { render } from '@testing-library/react';
import { ModalEditForm, type Props } from './ModalEditForm';
import { type TableRowData } from '~/hooks/useFetchOaTableData';
import { testWrapper } from '~/test/utils';
import { vi } from 'vitest';

describe('<OaModalEditForm />', () => {
   const Oa: TableRowData = {
      services: [],
      manual_name: '',
      id: '',
      status: '',
      timeout: 0,
      uptime: 0,
      version: '',
      poll: 'on',
      name: '',
      hostname: '',
      ipaddress: '',
      netmask: '',
      gateway: '',
      region: '',
      site: '',
      location: '',
   };
   const defaultProps: Props = {
      disclosure: {
         isOpen: false,
         onOpen: vi.fn(),
         onClose: vi.fn(),
         onToggle: vi.fn(),
         isControlled: false,
         getButtonProps: vi.fn(),
         getDisclosureProps: vi.fn(),
      },
      Oa,
   };
   it('should render successfully', () => {
      expect(() =>
         render(<ModalEditForm {...defaultProps} />, testWrapper)
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
