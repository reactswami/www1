import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   AlertDialog as ChakraAlertDialog,
   AlertDialogBody,
   AlertDialogCloseButton,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   type AlertDialogProps,
   type AlertDialogBodyProps,
   type AlertDialogContentProps,
   type AlertProps,
   type UseDisclosureReturn,
   useDisclosure,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { Flex } from '@statseeker/components/Layout/Flex';
import { type ReactNode, useRef } from 'react';
import { type ModalButtonConfig } from '../Modal/SSModal';

// ─────────────────────────────────────────────────────────────────────────────
// SSAlertDialogAlert
// ─────────────────────────────────────────────────────────────────────────────

export type SSAlertDialogAlertProps = {
   /**
    * Chakra Alert status — controls the colour scheme and default icon.
    * @default 'info'
    */
   status?: AlertProps['status'];
   /**
    * Bold title shown next to the icon.
    * If omitted, only the icon and descriptions are rendered.
    */
   title?: string;
   /**
    * One or more description strings rendered as separate `<AlertDescription>`
    * elements below the title row.
    */
   descriptions: ReactNode[];
   /**
    * Optional content rendered after the descriptions — e.g. a Link, Button,
    * or any JSX that should appear at the bottom of the alert panel.
    */
   footer?: ReactNode;
   /** Any extra Chakra `Alert` props (e.g. custom borderRadius, marginTop). */
   alertProps?: Omit<AlertProps, 'status'>;
};

/**
 * **SSAlertDialogAlert** — the standardised alert panel used inside
 * `SSAlertDialog` body content.
 *
 * Wraps the repetitive
 * ```tsx
 * <Alert status="..." display="flex" flexDirection="column" ...>
 *   <Flex gap="sm"><AlertIcon /><AlertTitle>...</AlertTitle></Flex>
 *   <AlertDescription>line 1</AlertDescription>
 *   <AlertDescription>line 2</AlertDescription>
 *   {optionalFooter}
 * </Alert>
 * ```
 * pattern that appears in every destructive confirmation dialog into a
 * single declarative component.
 *
 * @example
 * ```tsx
 * <SSAlertDialogAlert
 *   status="error"
 *   title="Warning"
 *   descriptions={[
 *     `There are 3 devices only polled from ${name}. They will be permanently removed.`,
 *     'If you want to keep monitoring them, re-assign their poller first.',
 *   ]}
 *   footer={
 *     <Link href="/cgi/oa_ping_manager">
 *       <Button variant="secondary" colorScheme="red">Re-assign pollers</Button>
 *     </Link>
 *   }
 * />
 *
 * <SSAlertDialogAlert
 *   status="info"
 *   title="Note"
 *   descriptions={['This will delete all ping data collected from this appliance.']}
 * />
 * ```
 */
export function SSAlertDialogAlert({
   status = 'info',
   title,
   descriptions,
   footer,
   alertProps,
}: SSAlertDialogAlertProps) {
   return (
      <Alert
         status={status}
         display="flex"
         flexDirection="column"
         alignItems="flex-start"
         gap="sm"
         borderRadius="sm"
         {...alertProps}
      >
         {title && (
            <Flex gap="sm">
               <AlertIcon />
               <AlertTitle>{title}</AlertTitle>
            </Flex>
         )}
         {!title && <AlertIcon />}

         {descriptions.map((desc, i) => (
            <AlertDescription key={i}>{desc}</AlertDescription>
         ))}

         {footer}
      </Alert>
   );
}

// ─────────────────────────────────────────────────────────────────────────────
// SSAlertDialog props
// ─────────────────────────────────────────────────────────────────────────────

export type SSAlertDialogProps = {
   // ── Open / close
   isOpen?: boolean;
   onClose?: () => void;
   disclosure?: UseDisclosureReturn;

   // ── Header
   title?: string;
   hideCloseButton?: boolean;

   // ── Body
   children?: ReactNode;
   bodyProps?: AlertDialogBodyProps;

   // ── Footer buttons
   confirmButton?: ModalButtonConfig;
   cancelButton?: ModalButtonConfig;
   extraButtons?: ModalButtonConfig[];

   // ── Layout & behaviour
   size?: AlertDialogProps['size'];
   isCentered?: boolean;
   closeOnOverlayClick?: boolean;
   contentProps?: AlertDialogContentProps;
   modalProps?: Omit<
      AlertDialogProps,
      | 'isOpen'
      | 'onClose'
      | 'leastDestructiveRef'
      | 'size'
      | 'isCentered'
      | 'closeOnOverlayClick'
      | 'children'
   >;
};

// ─────────────────────────────────────────────────────────────────────────────
// SSAlertDialog component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **SSAlertDialog** — unified wrapper for all destructive-action confirmation
 * dialogs. Renders with `role="alertdialog"` (unlike SSModal which uses
 * `role="dialog"`) preserving accessibility semantics and test queries.
 *
 * Use **SSAlertDialogAlert** for the standardised Alert panels inside the body:
 *
 * ```tsx
 * <SSAlertDialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Delete Appliance"
 *   size="xl"
 *   isCentered
 *   confirmButton={{ label: 'Delete', variant: 'danger', onClick: handleDelete, isLoading: isPending }}
 *   cancelButton={{ label: 'Cancel' }}
 *   bodyProps={{ gap: 'sm', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
 * >
 *   <SSAlertDialogAlert
 *     status="error"
 *     title="Warning"
 *     descriptions={['3 devices will be permanently removed.']}
 *     footer={<Link href="/cgi/..."><Button>Re-assign pollers</Button></Link>}
 *   />
 *   <SSAlertDialogAlert
 *     status="info"
 *     title="Note"
 *     descriptions={['All ping data will be deleted.']}
 *   />
 *   <Text paddingY={2}>Are you sure? This action can't be undone.</Text>
 * </SSAlertDialog>
 * ```
 */
export function SSAlertDialog({
   isOpen: isOpenProp,
   onClose: onCloseProp,
   disclosure,
   title,
   hideCloseButton = false,
   children,
   bodyProps,
   confirmButton,
   cancelButton,
   extraButtons,
   size = 'md',
   isCentered = false,
   closeOnOverlayClick = true,
   contentProps,
   modalProps,
}: SSAlertDialogProps) {
   const isOpen = disclosure?.isOpen ?? isOpenProp ?? false;
   const onClose = disclosure?.onClose ?? onCloseProp ?? (() => {});
   const cancelRef = useRef<HTMLButtonElement>(null);
   const hasFooter = !!(confirmButton || cancelButton || extraButtons?.length);

   return (
      <ChakraAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         leastDestructiveRef={cancelRef}
         size={size}
         isCentered={isCentered}
         closeOnOverlayClick={closeOnOverlayClick}
         {...modalProps}
      >
         <AlertDialogOverlay />
         <AlertDialogContent {...contentProps}>
            {!hideCloseButton && <AlertDialogCloseButton />}

            {title && (
               <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {title}
               </AlertDialogHeader>
            )}

            <AlertDialogBody {...bodyProps}>{children}</AlertDialogBody>

            {hasFooter && (
               <AlertDialogFooter gap="sm">
                  {confirmButton && (
                     <Button
                        variant={confirmButton.variant ?? 'danger'}
                        onClick={confirmButton.onClick}
                        isLoading={confirmButton.isLoading}
                        isDisabled={confirmButton.isDisabled}
                        className={confirmButton.className}
                     >
                        {confirmButton.label}
                     </Button>
                  )}
                  {extraButtons?.map((btn, i) => (
                     <Button
                        key={i}
                        variant={btn.variant ?? 'secondary'}
                        onClick={btn.onClick}
                        isLoading={btn.isLoading}
                        isDisabled={btn.isDisabled}
                        className={btn.className}
                     >
                        {btn.label}
                     </Button>
                  ))}
                  {cancelButton && (
                     <Button
                        ref={cancelRef}
                        variant={cancelButton.variant ?? 'tertiary'}
                        onClick={cancelButton.onClick ?? onClose}
                        isDisabled={cancelButton.isDisabled}
                        className={cancelButton.className}
                     >
                        {cancelButton.label}
                     </Button>
                  )}
               </AlertDialogFooter>
            )}
         </AlertDialogContent>
      </ChakraAlertDialog>
   );
}

export { useDisclosure };
export type { UseDisclosureReturn };
