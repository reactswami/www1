import {
   Modal as ChakraModal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   type ModalProps as ChakraModalProps,
   type ModalContentProps,
   type ModalBodyProps,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Footer button config
// ─────────────────────────────────────────────────────────────────────────────

export type ModalButtonConfig = {
   /** Button label */
   label: string;
   /** Maps to the Button variant system ('primary' | 'secondary' | 'danger' | etc.) */
   variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'danger-light' | 'warning' | 'link';
   /** Called when the button is clicked */
   onClick?: () => void;
   /** True while an async action is in-flight — shows a spinner and disables */
   isLoading?: boolean;
   /** Disabled state */
   isDisabled?: boolean;
   /** Set to the id of a <form> element to act as that form's submit button */
   formId?: string;
   /** className forwarded to the underlying button element */
   className?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main props
// ─────────────────────────────────────────────────────────────────────────────

export type SSModalProps = {
   // ── Open / close ──────────────────────────────────────────────────────────
   /** Controlled open state.  Either pass `isOpen + onClose` OR a `disclosure` object. */
   isOpen?: boolean;
   /** Close handler.  Either pass `isOpen + onClose` OR a `disclosure` object. */
   onClose?: () => void;
   /**
    * Pass a `UseDisclosureReturn` object directly instead of `isOpen` / `onClose`.
    * Useful when the caller already has a disclosure hook.
    */
   disclosure?: UseDisclosureReturn;

   // ── Header ────────────────────────────────────────────────────────────────
   /**
    * Text shown in the `ModalHeader`.
    * If omitted, no header element is rendered (the body begins immediately).
    */
   title?: string;
   /** Hide the × close button in the top-right corner. Defaults to false. */
   hideCloseButton?: boolean;

   // ── Body ──────────────────────────────────────────────────────────────────
   /**
    * Content rendered inside `ModalBody`.
    * Can be anything: text, forms, tables, arbitrary JSX.
    */
   children: ReactNode;
   /** Extra Chakra props forwarded to `ModalBody` (e.g. padding={0}, overflowY='auto'). */
   bodyProps?: ModalBodyProps;

   // ── Footer ────────────────────────────────────────────────────────────────
   /**
    * Primary action button (right-aligned, rendered last).
    * Omit to suppress the footer entirely when you only need a close button.
    */
   confirmButton?: ModalButtonConfig;
   /**
    * Secondary / cancel button (rendered to the left of confirmButton).
    * When omitted and confirmButton is present, only the confirm button is shown.
    */
   cancelButton?: ModalButtonConfig;
   /**
    * Any extra buttons inserted between cancel and confirm.
    * Useful for three-action footers (e.g. "Save draft" alongside "Publish" and "Cancel").
    */
   extraButtons?: ModalButtonConfig[];
   /**
    * Wrap the ModalBody + ModalFooter in a `<form>` element.
    * This lets footer buttons submit the form via `formId` without prop-drilling.
    *
    * Pass the form `id`, `onSubmit` handler, and optional `className`.
    */
   form?: {
      id: string;
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
      className?: string;
   };

   // ── Layout & behaviour ────────────────────────────────────────────────────
   /**
    * Chakra Modal `size` prop.
    * @default 'md'
    */
   size?: ChakraModalProps['size'];
   /** Centre the modal vertically in the viewport. */
   isCentered?: boolean;
   /** Prevent closing when the user clicks the overlay. Defaults to true. */
   closeOnOverlayClick?: boolean;
   /** Extra props forwarded directly to `ModalContent`. */
   contentProps?: ModalContentProps;
   /** Any other Chakra Modal props (scrollBehavior, returnFocusOnClose, etc.). */
   modalProps?: Omit<
      ChakraModalProps,
      'isOpen' | 'onClose' | 'size' | 'isCentered' | 'closeOnOverlayClick' | 'children'
   >;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper – render a single footer button
// ─────────────────────────────────────────────────────────────────────────────

function FooterButton({ btn, autoFocus = false }: { btn: ModalButtonConfig; autoFocus?: boolean }) {
   return (
      <Button
         variant={btn.variant ?? 'secondary'}
         onClick={btn.onClick}
         isLoading={btn.isLoading}
         isDisabled={btn.isDisabled}
         form={btn.formId}
         type={btn.formId ? 'submit' : 'button'}
         className={btn.className}
         autoFocus={autoFocus}
      >
         {btn.label}
      </Button>
   );
}

// ─────────────────────────────────────────────────────────────────────────────
// SSModal component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **SSModal** — the single wrapper for all modal dialogs in this codebase.
 *
 * Covers every pattern found across packages:
 * - Confirmation dialogs (header + text body + Cancel/Confirm buttons)
 * - Form modals (body = form content, footer buttons submit via `formId`)
 * - Info / content modals (rich children, optional single Close button)
 * - No-header modals (omit `title`; place a `<Heading>` inside `children`)
 * - `UseDisclosureReturn`-driven modals (pass `disclosure` instead of `isOpen`/`onClose`)
 * - HTML body content (`bodyProps={{ dangerouslySetInnerHTML: ... }}`)
 *
 * @example Confirmation dialog
 * ```tsx
 * <SSModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Delete IP Address Ranges"
 *   confirmButton={{ label: 'Delete', variant: 'danger', onClick: handleDelete, isLoading }}
 *   cancelButton={{ label: 'Cancel', onClick: onClose }}
 * >
 *   <Text>Are you sure you want to delete these IP Address Ranges?</Text>
 * </SSModal>
 * ```
 *
 * @example Form modal (external form element)
 * ```tsx
 * <SSModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Add SNMP Credentials"
 *   form={{ id: 'AddCredForm', onSubmit: handleSubmit(onSubmit) }}
 *   confirmButton={{ label: 'Save', variant: 'primary', formId: 'AddCredForm' }}
 *   cancelButton={{ label: 'Cancel', onClick: onClose }}
 * >
 *   <CredentialsForm />
 * </SSModal>
 * ```
 *
 * @example Disclosure-driven modal
 * ```tsx
 * const disclosure = useDisclosure();
 * <SSModal disclosure={disclosure} title="Important note" ...>
 *   ...
 * </SSModal>
 * ```
 *
 * @example No-header modal (heading lives inside body)
 * ```tsx
 * <SSModal isOpen={isOpen} onClose={onClose}>
 *   <Heading>Create Observability Appliance</Heading>
 *   <FormOa ... />
 * </SSModal>
 * ```
 *
 * @example Info modal with HTML content
 * ```tsx
 * <SSModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title={title}
 *   bodyProps={{ padding: 4, overflowY: 'auto', dangerouslySetInnerHTML: { __html: description } }}
 *   confirmButton={{ label: 'Close', variant: 'primary', onClick: onClose }}
 * />
 * ```
 */
export function SSModal({
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
   form,
   // layout
   size = 'md',
   isCentered = false,
   closeOnOverlayClick = true,
   contentProps,
   modalProps,
}: SSModalProps) {
   // Resolve open/close from either the disclosure object or individual props
   const isOpen = disclosure?.isOpen ?? isOpenProp ?? false;
   const onClose = disclosure?.onClose ?? onCloseProp ?? (() => {});

   const hasFooter = !!(confirmButton || cancelButton || (extraButtons && extraButtons.length > 0));

   // The body + footer – optionally wrapped in a <form> element
   const bodyAndFooter = (
      <>
         <ModalBody {...bodyProps}>
            {children}
         </ModalBody>

         {hasFooter && (
            <ModalFooter gap={2}>
               {cancelButton && (
                  <FooterButton btn={{ variant: 'secondary', ...cancelButton }} />
               )}
               {extraButtons?.map((btn, i) => (
                  <FooterButton key={i} btn={btn} />
               ))}
               {confirmButton && (
                  <FooterButton btn={{ variant: 'primary', ...confirmButton }} autoFocus />
               )}
            </ModalFooter>
         )}
      </>
   );

   return (
      <ChakraModal
         isOpen={isOpen}
         onClose={onClose}
         size={size}
         isCentered={isCentered}
         closeOnOverlayClick={closeOnOverlayClick}
         {...modalProps}
      >
         <ModalOverlay />
         <ModalContent {...contentProps}>
            {title && <ModalHeader>{title}</ModalHeader>}
            {!hideCloseButton && <ModalCloseButton />}

            {form ? (
               <form
                  id={form.id}
                  onSubmit={form.onSubmit}
                  className={form.className}
               >
                  {bodyAndFooter}
               </form>
            ) : (
               bodyAndFooter
            )}
         </ModalContent>
      </ChakraModal>
   );
}

// Re-export hook and type so consumers don't need to reach into Chakra directly
export { useDisclosure };
export type { UseDisclosureReturn };
