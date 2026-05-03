import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useDisclosure } from '@chakra-ui/react';
import { SSModal } from './SSModal';
import { Text } from '../../Typography/Text/Text';
import { Button } from '../../Form/Button/Button';

const meta = {
   component: SSModal,
   parameters: {
      docs: {
         description: {
            component:
               'A unified modal wrapper that covers every dialog pattern in the codebase: ' +
               'confirmation dialogs, form modals, info/content modals, disclosure-driven modals, ' +
               'and modals with external form submission.',
         },
      },
   },
} satisfies Meta<typeof SSModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helper trigger wrapper ─────────────────────────────────────────────────
function ModalTrigger({ label, children }: { label: string; children: (disclosure: ReturnType<typeof useDisclosure>) => React.ReactNode }) {
   const disclosure = useDisclosure();
   return (
      <>
         <Button variant="primary" onClick={disclosure.onOpen}>{label}</Button>
         {children(disclosure)}
      </>
   );
}

// ─────────────────────────────────────────────────────────────────────────────

export const ConfirmationDialog: Story = {
   render: () => (
      <ModalTrigger label="Open Confirmation">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Delete IP Address Ranges"
               confirmButton={{
                  label: 'Delete',
                  variant: 'danger',
                  onClick: disclosure.onClose,
               }}
               cancelButton={{
                  label: 'Cancel',
                  onClick: disclosure.onClose,
               }}
            >
               <Text>Are you sure you want to delete these IP Address Ranges?</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const ConfirmationWithLoadingState: Story = {
   render: () => (
      <ModalTrigger label="Open with Loading">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Confirm Execute"
               size="lg"
               confirmButton={{
                  label: 'Run',
                  variant: 'primary',
                  isLoading: true,
               }}
               cancelButton={{
                  label: 'Cancel',
                  onClick: disclosure.onClose,
               }}
            >
               <Text>Are you sure you want to perform a user synchronization?</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const FormModal: Story = {
   render: () => (
      <ModalTrigger label="Open Form Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Add SNMP Credentials"
               size="6xl"
               form={{
                  id: 'StoryForm',
                  onSubmit: (e) => { e.preventDefault(); disclosure.onClose(); },
               }}
               confirmButton={{ label: 'Save', variant: 'primary', formId: 'StoryForm' }}
               cancelButton={{ label: 'Cancel', onClick: disclosure.onClose }}
            >
               <Text>Form content goes here…</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const NoHeaderModal: Story = {
   render: () => (
      <ModalTrigger label="Open No-Header Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               closeOnOverlayClick={false}
               contentProps={{ maxWidth: '100vw', width: 'max-content', padding: 8 }}
               bodyProps={{ padding: 0 }}
            >
               <Text fontWeight="bold" fontSize="xl">Create Observability Appliance</Text>
               <Text mt={2}>Form content goes here…</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const InfoModalCentered: Story = {
   render: () => (
      <ModalTrigger label="Open Info Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Important Note"
               isCentered
               confirmButton={{ label: 'Close', variant: 'primary', onClick: disclosure.onClose }}
            >
               <Text>By running a discovery, we will automatically assign the selected Observability Appliance as the default poller.</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const HtmlBodyModal: Story = {
   render: () => (
      <ModalTrigger label="Open HTML Body Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Discovery Summary"
               bodyProps={{
                  padding: 4,
                  overflowY: 'auto',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  dangerouslySetInnerHTML: { __html: '<p>Step 1: <b>Completed</b></p><p>Step 2: <b>In progress</b></p>' } as any,
               }}
               confirmButton={{ label: 'Close', variant: 'primary', onClick: disclosure.onClose }}
            />
         )}
      </ModalTrigger>
   ),
};

export const ExtraButtons: Story = {
   render: () => (
      <ModalTrigger label="Open Three-Action Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Save Changes"
               cancelButton={{ label: 'Discard', onClick: disclosure.onClose }}
               extraButtons={[{ label: 'Save Draft', variant: 'tertiary', onClick: disclosure.onClose }]}
               confirmButton={{ label: 'Publish', variant: 'primary', onClick: disclosure.onClose }}
            >
               <Text>You have unsaved changes. What would you like to do?</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};

export const NoFooter: Story = {
   render: () => (
      <ModalTrigger label="Open No-Footer Modal">
         {(disclosure) => (
            <SSModal
               disclosure={disclosure}
               title="Add IP Ranges"
               size="xl"
            >
               <Text>This modal has no footer — the form inside manages its own submit button.</Text>
            </SSModal>
         )}
      </ModalTrigger>
   ),
};
