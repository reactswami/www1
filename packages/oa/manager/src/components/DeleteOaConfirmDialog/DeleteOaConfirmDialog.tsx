import { type ConfirmationOptions } from "@statseeker/components";
import ConfirmationDialog from "@statseeker/components/Legacy/ConfirmDialog/ConfirmDialog";

interface Props {
    name: string;
    isOpen: boolean;
    onClose: () => void;
    isLoadingOrphanCount: boolean;
    count: number;
    isPending: boolean;
    handleConfirm: () => void;
}

export const DeleteOaConfirmDialog = ({
    name,
    isOpen,
    onClose,
    isLoadingOrphanCount,
    count,
    isPending,
    handleConfirm
}: Props) => {
    // Build options array based on conditions
    const getOptions = (): ConfirmationOptions[] => {
        const options: ConfirmationOptions[] = [];

        // Add warning about orphaned devices if applicable
        if (!isLoadingOrphanCount && count > 0) {
            options.push({
                title: `Delete Appliance - ${name}`,
                note: `There ${count > 1 ? 'are' : 'is'} ${count} device${count > 1 ? 's' : ''} that are only polled from ${name}. Proceeding with this action will permanently remove ${count > 1 ? 'them' : 'it'} from Statseeker.\n\nIf you want to continue monitoring these devices, please assign them to another poller first.`,
                confirmationLink: {
                    link: `${window.location.origin}/cgi/oa_ping_manager`,
                    title: 'Re-assign pollers'
                },
            });
        } else {
            // Just the title with main info note
            options.push({
                title: `Delete Appliance - ${name}`,
                note: `This will delete all ping data collected from ${name}.\n\nDeleting an Observability Appliance will only remove the configuration from Statseeker and will not remove the deployed Observability Appliance.`,
            });
        }

        return options;
    };

    // Show loading message while checking orphan count
    if (isLoadingOrphanCount) {
        return (
            <ConfirmationDialog
                title={`Delete Appliance - ${name}`}
                note={`Verifying the devices polled by ${name}, please wait.`}
                confirmation=""
                isOpen={isOpen}
                onClose={onClose}
                isPending={isPending}
                isLoading={isLoadingOrphanCount}
                action="Delete"
                onAction={handleConfirm}
            />
        );
    }

    return (
        <ConfirmationDialog
            options={getOptions()}
            confirmation={`Are you sure you wish to delete ${name}? This action can't be undone.`}
            isOpen={isOpen}
            onClose={onClose}
            isPending={isPending}
            isLoading={isLoadingOrphanCount}
            action="Delete"
            onAction={handleConfirm}
        />
    );
};