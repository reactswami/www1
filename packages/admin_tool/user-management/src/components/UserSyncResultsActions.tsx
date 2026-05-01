import { useDisclosure } from '@chakra-ui/react';
import { type DiffOp } from '@statseeker/api/internal_api/entities/user_sync_history';
import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { useMemo } from 'react';
import ViewChanges from './ViewChanges';

// Action Group Configuration
interface UserSyncResultsActionContext {
    result: { name: string; diff: DiffOp[] };
}


export default function UserSyncResultsActions({
    result
}: {
    result: undefined | { name: string; diff: DiffOp[] };
}) {
    const disclosure = useDisclosure();

    const changes = result ?? { name: '', diff: [] };
    const actionContext: UserSyncResultsActionContext = { result: changes };

    const actionGroups: ActionGroupConfig<UserSyncResultsActionContext>[] = useMemo(
        () => [
            {
                title: 'General',
                actions: [
                    createAction.menuItem({
                        key: 'view-changes',
                        label: 'View Changes',
                        onClick: disclosure.onOpen,
                    })
                ],
            },
        ],
        [disclosure]
    );

    const shouldDisable = result === undefined || (result.diff.length === 0);

    return (
        <>
            <ViewChanges changes={{ name: changes.name, diff: changes.diff }} disclosure={disclosure} />
            <MenuActions
                groups={actionGroups}
                context={actionContext}
                button={{
                    label: 'Actions',
                    variant: 'solid',
                    disabled: shouldDisable,
                }}
            />
        </>
    );
}
