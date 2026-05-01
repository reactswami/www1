import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AssignServicesService } from './AssignServicesService';
import { type Services } from '~/hooks/useAssignOaServices';

describe('<OaAssignServicesServiceRow />', () => {
   const service: Services[number] = {
      name: 'hello',
      description: 'world',
      components: [
         {
            id: 'a',
            name: 'comp1',
            description: 'the comp 1',
            enabled: '1',
         },
         {
            id: 'b',
            name: 'comp2',
            description: 'the comp 2',
            enabled: '0',
         },
      ],
   };

   const TestProvider = ({ children }: { children: ReactNode }) => {
      const methods = useForm();
      return <FormProvider {...methods}>{children}</FormProvider>;
   };
   it('should render successfully', () => {
      expect(() =>
         render(<AssignServicesService service={service} />, {
            wrapper: TestProvider,
         })
      ).not.toThrow();
   });

   it('should display the name of the service, its descriptions and the components', () => {
      render(<AssignServicesService service={service} />, {
         wrapper: TestProvider,
      });

      expect(screen.getByText(service.name)).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox')).toHaveLength(
         service.components.length
      );
      for (const { name, description } of service.components) {
         expect(screen.getByText(name)).toBeInTheDocument();
         expect(screen.getByText(description)).toBeInTheDocument();
      }
   });
});
