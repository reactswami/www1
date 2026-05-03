import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@chakra-ui/react';
import { SSAlertDialog } from './SSAlertDialog';
import { Button } from '../../Form/Button/Button';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '../../Feedback/Alert/Alert';
import { Text } from '../../Typography/Text/Text';
import { Flex } from '../Flex/Flex';

const meta = {
   component: SSAlertDialog,
   parameters: {
      docs: {
         description: {
            component:
               'Destructive-action confirmation dialogs. Renders with `role="alertdialog"` ' +
               '(unlike SSModal which uses `role="dialog"`) — required for accessibility and ' +
               'for tests that query by `screen.getByRole("alertdialog")`.\n\n' +
               'The `leastDestructiveRef` (Cancel button focus) is managed internally.',
         },
      },
   },
} satisfies Meta<typeof SSAlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Trigger({ label, children }: { label: string; children: (d: ReturnType<typeof useDisclosure>) => React.ReactNode }) {
   const d = useDisclosure();
   return (
      <>
         <Button variant="danger" onClick={d.onOpen}>{label}</Button>
         {children(d)}
      </>
   );
}

export const SimpleDelete: Story = {
   render: () => (
      <Trigger label="Delete item">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Delete item"
               confirmButton={{ label: 'Delete', variant: 'danger', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
            >
               <Text>Are you sure? This action can't be undone.</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const WithWarningAlert: Story = {
   render: () => (
      <Trigger label="Delete Appliance">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Delete Appliance - my-oa"
               size="xl"
               isCentered
               confirmButton={{ label: 'Delete', variant: 'danger', isLoading: false, onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
            >
               <Flex gap="sm" flexDirection="column" alignItems="flex-start">
                  <Alert status="error" display="flex" flexDirection="column" alignItems="flex-start" gap="sm" borderRadius="sm">
                     <Flex gap="sm"><AlertIcon /><AlertTitle>Warning</AlertTitle></Flex>
                     <AlertDescription>
                        There are 3 devices that are only polled from this appliance.
                        Proceeding will permanently remove them from Statseeker.
                     </AlertDescription>
                  </Alert>
                  <Alert status="info" display="flex" flexDirection="column" alignItems="flex-start" gap="sm" borderRadius="sm">
                     <Flex gap="sm"><AlertIcon /><AlertTitle>Note</AlertTitle></Flex>
                     <AlertDescription>This will delete all ping data collected from this appliance.</AlertDescription>
                  </Alert>
                  <Text paddingY={2}>Are you sure you wish to delete? This action can't be undone.</Text>
               </Flex>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const DisclosureDriven: Story = {
   render: () => (
      <Trigger label="Open via disclosure">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Confirm action"
               confirmButton={{ label: 'Confirm', variant: 'primary', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
            >
               <Text>Are you sure you want to proceed?</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const NoHeader: Story = {
   render: () => (
      <Trigger label="No header dialog">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               confirmButton={{ label: 'Delete', variant: 'danger', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
            >
               <Text fontWeight="bold" fontSize="lg" mb={2}>Are you sure?</Text>
               <Text>This action cannot be undone.</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const LoadingState: Story = {
   render: () => (
      <Trigger label="Delete (loading)">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Delete in progress"
               confirmButton={{ label: 'Delete', variant: 'danger', isLoading: true }}
               cancelButton={{ label: 'Cancel', isDisabled: true }}
            >
               <Text>Deletion in progress...</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};
