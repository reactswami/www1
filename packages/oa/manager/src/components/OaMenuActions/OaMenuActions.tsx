import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { useMemo } from 'react';
import { DeleteOaConfirmDialog, DisableOaConfirmDialog, FormDownloadUpdatedOaModal, ModalAssignServices, ModalEditForm } from '~/components';
import { type TableRowData, useAssignOaServices, useDeleteOa, useDisableOa, useUpdateOa } from '~/hooks';
import { useRebootOa } from '~/hooks/useRebootOa';

function OaMenuActions({ oa, shouldDisable = false }: { oa: TableRowData; shouldDisable?: boolean }) {

    const { handleClick, handleConfirm, isDisabled, ...rest } = useDisableOa({ oa });
    const disableProps = {
        onConfirm: handleConfirm, isDisabled, ...rest
    };

    const { onOpen, ...deleteProps } = useDeleteOa(oa);
    const { onOpen: openAssignService, ...assignProps } =
        useAssignOaServices({ oaAssign: oa });

    const { reboot } = useRebootOa({ oa });
    const { isUpdatingOa, isEditOpen, openEdit, closeEdit, onSubmit,
        isDownloadOpen,
        closeDownload,
        updatedOaName } =
        useUpdateOa({ oa });

    const editProps = {
        isOpen: isEditOpen,
        onClose: closeEdit,
        oa: oa,
        isSubmitting: isUpdatingOa,
        onSubmit: onSubmit,
    };

    const openTab = (
        type: 'download' | 'log',
        name: TableRowData['name'],
        mode: 'window' | 'tab' = 'tab'
    ) => {
        const options = mode === 'window' ? 'height=200,width=200' : undefined;
        const url =
            type === 'download'
                ? `/cgi/oa_image_downloader?name=${name}`
                : `/cgi/rnac02?type=${type}&name=${name}`;
        const newTab = window.open(url, '_blank', options);
        if (newTab) {
            newTab.focus();
        }
    };

    // Action Group Configuration
    interface OaActionContext {
        oa: TableRowData;
        isDisabled: boolean;
    }

    const actionContext: OaActionContext = {
        oa,
        isDisabled,
    };

    const actionGroups: ActionGroupConfig<OaActionContext>[] = useMemo(
        () => [
            {
                title: 'General',
                actions: [
                    createAction.menuItem({
                        key: 'edit',
                        label: 'Edit',
                        onClick: () => openEdit(),
                    }),
                    createAction.menuItem({
                        key: 'assign-services',
                        label: 'Assign services',
                        onClick: () => openAssignService(),
                    }),
                    createAction.menuItem({
                        key: 'view-performance',
                        label: 'View performance',
                        onClick: (ctx) => {
                            window.open(
                                `/#dashboards:StatseekerDefaultSystemOverviewHidden?var-Device=${ctx.oa?.name}`,
                                '_blank'
                            );
                        },
                    }),
                    createAction.menuItem({
                        key: 'view-logs',
                        label: 'View logs',
                        onClick: (ctx) => openTab('log', ctx.oa?.name),
                    }),
                    createAction.menuItem({
                        key: 'download-image',
                        label: 'Download image',
                        onClick: (ctx) => openTab('download', ctx.oa?.name),
                    }),
                    createAction.menuItem({
                        key: 'reboot',
                        label: 'Reboot',
                        onClick: () => reboot(),
                        requiresConfirmation: true,
                        confirmationMessage: 'Are you sure you want to reboot this Observability Appliance?',
                    }),
                    createAction.menuItem({
                        key: 'toggle-disable',
                        label: (ctx) => `${ctx.isDisabled ? 'Enable' : 'Disable'} Observability Appliance`,
                        onClick: () => handleClick(),
                    }),
                    createAction.menuItem({
                        key: 'delete',
                        label: 'Delete Observability Appliance',
                        onClick: () => onOpen(),
                        variant: 'danger',
                    }),
                ],
            },
        ],
        [openEdit, openAssignService, reboot, handleClick, onOpen]
    );

    return <>
        <ModalAssignServices {...assignProps} />
        <ModalEditForm {...editProps} />
        <FormDownloadUpdatedOaModal
            isOpen={isDownloadOpen}
            onClose={closeDownload}
            newOaName={updatedOaName ?? ''}
        />
        <DeleteOaConfirmDialog {...deleteProps} name={oa?.name} />
        <DisableOaConfirmDialog {...disableProps} />
        <MenuActions
            groups={actionGroups}
            context={actionContext}
            button={{
                label: 'Actions',
                variant: 'solid',
                disabled: shouldDisable,
            }}
        />
    </>;
}

export default OaMenuActions;