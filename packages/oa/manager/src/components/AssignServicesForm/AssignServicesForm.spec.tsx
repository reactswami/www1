import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AssignServicesForm } from './AssignServicesForm';
import { testWrapper } from '~/test';
import { failedOaHandlers, mockComponentsResponse, oaHandlers } from '~/test/server/handlers/oa';
import { server } from '~/test/server/node';

const MOCK_OA_ID = '99';
describe('<AssignServicesForm />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<AssignServicesForm onClose={vi.fn()} id={MOCK_OA_ID} />, testWrapper)
      ).not.toThrow();
   });

   it('should display an error when there is an error getting the services', async () => {
      server.use(
        ...failedOaHandlers
      );
      render(<AssignServicesForm id={MOCK_OA_ID} onClose={vi.fn()} />, testWrapper);

      await waitFor(() => expect(screen.getByText(/Error retrieving the list of services/i)).toBeInTheDocument());

   });

   it('should display a list of components that can be enabled/disabled', async () => {
      server.use(
         ...oaHandlers
       );
      render(<AssignServicesForm onClose={vi.fn()} id={MOCK_OA_ID} />, testWrapper);

      for (const {
         serviceName,
         enabled,
         serviceDescription,
      } of mockComponentsResponse) {
         // The enabled component returned from the fixtures
         const names = serviceName.split(','); // comma separated list, from the API (aggregation list unique);
         const enableds = enabled; // comma separated list, from the API (aggregation list unique);
         const descriptions = serviceDescription.split(','); // comma separated list, from the API (aggregation list unique);

         const components = names
            .map((name, idx) => ({
               name,
               description: descriptions[idx],
               enabled: enableds,
            }))
            .filter(({ enabled }) => enabled); // Get the enabled actions from the fixture, fitler out the disabled ones
         components.forEach(async ({ description, name }) => {
            await waitFor(() => expect(screen.getAllByText(new RegExp(description)).length).toBeGreaterThan(0)
            );
            expect(screen.getAllByText(new RegExp(name)).length).toBeGreaterThan(0);
         });
      }

      await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(mockComponentsResponse.length)); // There should be one checkbox per component service
   });
});
