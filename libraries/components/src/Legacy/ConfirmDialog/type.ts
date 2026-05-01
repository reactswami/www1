type BaseDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    isPending?: boolean;
    isLoading?: boolean;
    action?: string;
    onAction: () => void;
    confirmation?: string;
};

type ConfirmationLink = {
    link: string;
    title: string;
};

export type ConfirmationOptions = {
    title: string;
    note?: string;
    confirmationLink?: ConfirmationLink;
};

export type ConfirmationDialogProps = BaseDialogProps &
    (
        | {
            options: ConfirmationOptions[] | ConfirmationOptions;
            title?: never;
            note?: never;
            confirmationLink?: never;
        }
        | {
            options?: never;
            title: string;
            note?: string;
            confirmationLink?: ConfirmationLink;
        }
    );