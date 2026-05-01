import { render, screen } from '@testing-library/react';

import { AffectedEntityList } from './AffectedEntitiesList';
import { db } from '~/test/server/db';

describe('AffecteEntitiesListMessage', () => {
   it('should display the list in alphabetical order', () => {
      const networks = Array(9)
         .fill(null)
         .map((_) => db.network.create());

      render(
         <AffectedEntityList
            selectedEntities={networks.map(({ name }) => name)}
            type={'network'}
         />
      );
      const expectedResult = networks.map(({ name }) => name).sort();

      screen.getAllByRole('listitem').map((li, idx) => {
         const regexp = new RegExp(expectedResult[idx], 'i');
         expect(li).toHaveTextContent(regexp);
      });
   });
});
