import { type UserGroupSyncListWithNulls } from "./UserGroupSyncListBuilder";


export type UserGroupSyncListReducerAction = (
    (
        { type: 'ADD' } |
        { type: 'REMOVE'; index: number } |
        { type: 'UPDATE'; index: number; value: string | null }
    ) &
    { list: 'include_groups' | 'include_users' | 'exclude_users' } |

    { type: 'REPLACE'; value: UserGroupSyncListWithNulls }
);


export function userGroupSyncListReducer(currentRange: UserGroupSyncListWithNulls, action: UserGroupSyncListReducerAction) {
    let newRange: UserGroupSyncListWithNulls = {
        include_groups: [],
        include_users: [],
        exclude_users: [],
    };
    let list: (string | null)[] = [];

    if (action.type !== 'REPLACE') {
        newRange = {
            include_groups: [...currentRange.include_groups],
            include_users: [...currentRange.include_users],
            exclude_users: [...currentRange.exclude_users],
        };
        list = newRange[action.list];
    }

    switch (action.type) {
        case 'ADD': {
            // Because we always render one input, an add action on an empty list should
            // actually add a second element, not a first
            if (list.length === 0) {
                list.push('');
            }
            list.push('');
            break;
        }

        case 'REMOVE': {
            /*
             * As an optimization don't actually remove values, just null them out.
             * This way list indexes don't change, saving rerenders.
             */
            let delValue = null;
            // Don't delete (null) if this is the last value, just empty it
            if (list.length === 0 || list.filter((v) => v !== null).length === 1) {
                delValue = '';
            }
            list[action.index] = delValue;
            break;
        }

        case 'UPDATE': {
            // We allow calling update on an empty list because we always render at least one input
            if (action.index === list.length) {
                list.push(null);
            }
            list[action.index] = action.value;
            break;
        }

        case 'REPLACE': {
            newRange = {
                include_groups: [...action.value.include_groups],
                include_users: [...action.value.include_users],
                exclude_users: [...action.value.exclude_users],
            };
            break;
        }
    }

    return newRange;
}