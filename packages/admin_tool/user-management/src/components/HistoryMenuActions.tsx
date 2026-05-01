import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

function HistoryMenuActions({ id, shouldDisable = false }: { id: number; shouldDisable?: boolean }) {
    const navigate = useNavigate();

    // Action Group Configuration
    interface HistoryActionContext {
        id: number;
    }

    const actionContext: HistoryActionContext = {
        id,
    };

    const actionGroups: ActionGroupConfig<HistoryActionContext>[] = useMemo(
        () => [
            {
                title: 'General',
                actions: [
                    createAction.menuItem({
                        key: 'view-summary',
                        label: 'View Summary',
                        onClick: (ctx) => {
                            navigate({ to: `/user_dir_sync_history/${ctx.id}`, search: true });
                        },
                    })
                ],
            },
        ],
        [navigate]
    );

    return (
        <MenuActions
            groups={actionGroups}
            context={actionContext}
            button={{
                label: 'Actions',
                variant: 'solid',
                disabled: shouldDisable,
            }}
        />
    );
}

export default HistoryMenuActions;