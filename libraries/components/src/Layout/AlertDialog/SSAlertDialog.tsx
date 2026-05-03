import {
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
   type UseDisclosureReturn,
   useDisclosure,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { type ReactNode, useRef } from 'react';
import { type ModalButtonConfig } from '../Modal/SSModal';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export type SSAlertDialogProps = {
   // ── Open / close ──────────────────────────────────────────────────────────
   /**
    * Controlled open state.
    * Either pass `isOpen + onClose` OR a `disclosure` object.
    */
   isOpen?: boolean;
   /** Close handler paired with `isOpen`. */
   onClose?: () => void;
   /**
    * Pass a `UseDisclosureReturn` object directly instead of `isOpen`/`onClose`.
    * Matches the same API as SSModal for consistency.
    */
   disclosure?: UseDisclosureReturn;

   // ── Header ────────────────────────────────────────────────────────────────
   /**
    * Text shown in the `AlertDialogHeader`.
    * If omitted the header element is not rendered.
    */
   title?: string;
   /** Hide the × close button in the top-right corner. Defaults to false. */
   hideCloseButton?: boolean;

   // ── Body ──────────────────────────────────────────────────────────────────
   /**
    * Content rendered inside `AlertDialogBody`.
    * Typically Alerts, Text, or any confirmation message.
    */
   children: ReactNode;
   /** Extra Chakra props forwarded to `AlertDialogBody`. */
   bodyProps?: AlertDialogBodyProps;

   // ── Footer buttons ────────────────────────────────────────────────────────
   /**
    * The primary (often destructive) action button.
    * Rendered on the left so the user's eye naturally reaches Cancel first —
    * consistent with Chakra's AlertDialog accessibility guidance.
    */
   confirmButton?: ModalButtonConfig;
   /**
    * The safe / cancel button.
    * This element receives `leastDestructiveRef` focus automatically —
    * no need to pass a ref from the caller.
    */
   cancelButton?: ModalButtonConfig;
   /**
    * Any extra buttons inserted between confirm and cancel.
    */
   extraButtons?: ModalButtonConfig[];

   // ── Layout & behaviour ────────────────────────────────────────────────────
   /** Chakra AlertDialog `size` prop. @default 'md' */
   size?: AlertDialogProps['size'];
   /** Centre the dialog vertically in the viewport. */
   isCentered?: boolean;
   /** Prevent closing when the user clicks the overlay. Defaults to true. */
   closeOnOverlayClick?: boolean;
   /** Extra props forwarded to `AlertDialogContent`. */
   contentProps?: AlertDialogContentProps;
   /**
    * Any other Chakra AlertDialog props
    * (scrollBehavior, returnFocusOnClose, motionPreset, etc.).
    * `leastDestructiveRef` is managed internally — do not pass it here.
    */
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
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **SSAlertDialog** — the single wrapper for all destructive-action confirmation
 * dialogs in this codebase.
 *
 * ## Why not SSModal?
 *
 * Chakra's `AlertDialog` renders with `role="alertdialog"` (vs `role="dialog"`
 * for Modal). This distinction matters for:
 * - **Accessibility** — screen readers announce alertdialog content immediately
 *   and interrupt the user, signalling that a response is required.
 * - **Tests** — existing specs query by `screen.getByRole('alertdialog')`;
 *   using Modal underneath would silently break them.
 *
 * SSAlertDialog deliberately mirrors the SSModal prop API so the two feel
 * identical to callers — swap one for the other with minimal diff.
 *
 * ## Key differences from SSModal
 * - Uses `AlertDialog` / `AlertDialogBody` etc. underneath.
 * - Manages `leastDestructiveRef` internally (always points to Cancel button).
 * - Footer order is **Confirm → Cancel** (left → right) — matches Chakra's
 *   AlertDialog convention where Cancel is the safe default and gets initial
 *   focus, but is placed last visually.
 *
 * @example Destructive confirmation
 * ```tsx
 * <SSAlertDialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Delete Appliance"
 *   size="xl"
 *   confirmButton={{ label: 'Delete', variant: 'danger', onClick: handleDelete, isLoading: isPending }}
 *   cancelButton={{ label: 'Cancel', onClick: onClose }}
 * >
 *   <Alert status="error">...</Alert>
 *   <Text>Are you sure? This action can't be undone.</Text>
 * </SSAlertDialog>
 * ```
 *
 * @example Disclosure-driven
 * ```tsx
 * const disclosure = useDisclosure();
 * <SSAlertDialog disclosure={disclosure} title="Delete" ...>
 *   ...
 * </SSAlertDialog>
 * ```
 */
export function SSAlertDialog({
   // open / close
   isOpen: isOpenProp,
   onClose: onCloseProp,
   disclosure,
   // header
   title,
   hideCloseButton = false,
   // body
   children,
   bodyProps,
   // footer
   confirmButton,
   cancelButton,
   extraButtons,
   // layout
   size = 'md',
   isCentered = false,
   closeOnOverlayClick = true,
   contentProps,
   modalProps,
}: SSAlertDialogProps) {
   // Resolve open/close from either the disclosure object or individual props
   const isOpen = disclosure?.isOpen ?? isOpenProp ?? false;
   const onClose = disclosure?.onClose ?? onCloseProp ?? (() => {});

   // leastDestructiveRef must point to the least-destructive interactive
   // element — always the Cancel button per Chakra's AlertDialog contract.
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
                  {/* Confirm (destructive) renders first / left */}
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

                  {/* Cancel renders last / right and receives leastDestructiveRef */}
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

// Re-export hook + type so callers don't need to reach into Chakra directly
export { useDisclosure };
export type { UseDisclosureReturn };
