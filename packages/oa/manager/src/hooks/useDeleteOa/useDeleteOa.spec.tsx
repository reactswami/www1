import { renderHook } from '@testing-library/react';
import { useDeleteOa } from './useDeleteOa';
import { db } from '~/test/server/db';
import { testWrapper } from '~/test/utils';

const ID = '99';
describe('<UseDeleteOa />', () => {
   beforeAll(() => {
      if (!db.device_oa.findFirst({ where: { id: { equals: ID } } })) {
         db.device_oa.create({ id: ID }); // Creating a device that has a known id if there are none (some tests will delete it)
      }
   });
   it('should render successfully', () => {
      expect(() =>
         renderHook(() => useDeleteOa({ id: ID, name: 'oa' }), testWrapper)
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
