import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import { SSAlertDialog, SSAlertDialogAlert } from './SSAlertDialog';
import { Button } from '../../Form/Button/Button';
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
               '`leastDestructiveRef` (Cancel button focus) is managed internally.\n\n' +
               'Use **SSAlertDialogAlert** for the standardised info/warning/error alert panels inside the body.',
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

// ── SSAlertDialog stories ──────────────────────────────────────────────────────────

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

export const WithSSAlertDialogAlert: Story = {
   name: 'With SSAlertDialogAlert panels',
   render: () => (
      <Trigger label="Delete Appliance">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Delete Appliance - my-oa"
               size="xl"
               isCentered
               confirmButton={{ label: 'Delete', variant: 'danger', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
               bodyProps={{ gap: 'sm', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
               <SSAlertDialogAlert
                  status="error"
                  title="Warning"
                  descriptions={[
                     'There are 3 devices that are only polled from this appliance. Proceeding will permanently remove them from Statseeker.',
                     'If you want to continue monitoring these devices, please assign them to another poller first.',
                  ]}
                  footer={
                     <Link href="/cgi/oa_ping_manager">
                        <Button variant="secondary" colorScheme="red">Re-assign pollers</Button>
                     </Link>
                  }
               />
               <SSAlertDialogAlert
                  status="info"
                  title="Note"
                  descriptions={[
                     'This will delete all ping data collected from this appliance.',
                     'Deleting an Observability Appliance will only remove the configuration from Statseeker and will not remove the deployed appliance.',
                  ]}
               />
               <Text paddingY={2}>Are you sure you wish to delete? This action can't be undone.</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const SingleInfoAlert: Story = {
   name: 'Single SSAlertDialogAlert (info)',
   render: () => (
      <Trigger label="Delete record">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Delete"
               size="xl"
               isCentered
               confirmButton={{ label: 'Delete', variant: 'danger', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
               bodyProps={{ gap: 'sm', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
               <SSAlertDialogAlert
                  status="info"
                  title="Note"
                  descriptions={['This record will be permanently removed. This action cannot be undone.']}
               />
               <Text paddingY={2}>Do you wish to delete? This action can't be undone.</Text>
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};

export const NoTitleAlert: Story = {
   name: 'SSAlertDialogAlert without title',
   render: () => (
      <Trigger label="Open">
         {(d) => (
            <SSAlertDialog
               disclosure={d}
               title="Confirm"
               confirmButton={{ label: 'Confirm', variant: 'primary', onClick: d.onClose }}
               cancelButton={{ label: 'Cancel' }}
            >
               <SSAlertDialogAlert
                  status="warning"
                  descriptions={['Proceeding will affect all selected items.', 'This cannot be reversed.']}
               />
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
               <SSAlertDialogAlert
                  status="info"
                  title="Note"
                  descriptions={['Deletion in progress, please wait.']}
               />
            </SSAlertDialog>
         )}
      </Trigger>
   ),
};
