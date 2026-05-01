import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AssignServicesFormInput } from './AssignServicesFormInput';

describe('<OaAssignServicesFormInput />', () => {
   const defaultProps = {
      name: 'hello',
      description: 'world',
      enabled: '0' as const,
      id: 'id',
   };

   // A test wrapper to provide the FormProvider
   const TestFormProvider = ({ children }: { children: ReactNode }) => {
      const methods = useForm();
      return <FormProvider {...methods}>{children}</FormProvider>;
   };

   it('should render successfully', () => {
      expect(() =>
         render(<AssignServicesFormInput {...defaultProps} />, {
            wrapper: TestFormProvider,
         })
      ).not.toThrow();
   });

   it('should display the name, the description and a checbox to enable/disable the component', () => {
      render(<AssignServicesFormInput {...defaultProps} />, {
         wrapper: TestFormProvider,
      });

      expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
   });

   it('should be checked if enable is "1"', () => {
      const TestFormProvider = ({ children }: { children: ReactNode }) => {
         const methods = useForm({ defaultValues: { [defaultProps.id]: '1' } });
         return <FormProvider {...methods}>{children}</FormProvider>;
      };

      render(
         <AssignServicesFormInput
            {...{ ...defaultProps, enabled: '1' as const }}
         />,
         { wrapper: TestFormProvider }
      );
      expect(screen.getByRole('checkbox')).toBeChecked();
   });

   it("should disabled the checkboxes when the form is being submitted and the user can't interact with them", async () => {
      // Arrange
      const user = await userEvent.setup();
      // Create a testbed component to test the form with a fake save button to test submitting state
      const TestBed = () => {
         const methods = useForm({ defaultValues: { [defaultProps.id]: '1' } });
         return (
            <FormProvider {...methods}>
               <AssignServicesFormInput
                  {...{ ...defaultProps, enabled: '1' as const }}
               />
               <button
                  onClick={methods.handleSubmit(async () => {
                     // sleep for 500ms so we can test the disabled state
                     await new Promise((resolve) => setTimeout(resolve, 500));
                  })}
               >
                  Save
               </button>
            </FormProvider>
         );
      };
      render(<TestBed />);

      // Act
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Assert
      await waitFor(() => {
         expect(screen.getByRole('checkbox')).toBeDisabled();
      });
   });
});
