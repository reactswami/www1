import { Box } from '@chakra-ui/react';
import { Flex } from '@statseeker/components/Layout/Flex';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { memo, useReducer, useEffect, useState } from 'react';
import UserGroupSyncList from './UserGroupSyncList';
import { userGroupSyncListReducer } from './userGroupSyncListReducer';

export type UserGroupSyncListWithNulls = {
    include_groups: (string | null)[];
    include_users: (string | null)[];
    exclude_users: (string | null)[];
};
export type UserGroupSyncListBuilderProps = {
    /**
     * The includes and excludes lists to render
     */
    value: UserGroupSyncListWithNulls;
    /**
     * The onChange callback for when the input values are modified
     * @param newValue The new lists of values
     */
    onChange: (newValue: UserGroupSyncListWithNulls) => void;
    /**
     * If enabled the internal list manipulation state will be returned in the onChange listener.
     * This includes null values for any users or groups in the original value that were removed.
     * Turning this on and then only filtering out nulls when sending to the server will provide
     * a performance benefit for large lists as the list indexes won't be changing.
     * @default false
     */
    exposeNulls?: boolean;
    /**
     * If enabled, the component will be disabled.
     */
    isDisabled?: boolean;
};

/**
 * An input component for building the lists of users and groups for AD user sync policies from
 * separate lists of included groups, included users, and excluded users.
 */
export const UserGroupSyncListBuilder = memo(function UserGroupSyncListBuilder({
    value,
    onChange,
    exposeNulls = false,
    isDisabled = false,
}: UserGroupSyncListBuilderProps) {
    const [internalValue, dispatch] = useReducer(userGroupSyncListReducer, value);

    // If our props value changes and it isn't the same as our internal state
    // then update our internal state to match it.
    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(internalValue)) {
            dispatch({
                type: 'REPLACE',
                value,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // When internal state changes update parent
    useEffect(() => {
        if (exposeNulls === false) {
            internalValue.include_groups = internalValue.include_groups.filter((r) => r !== null);
            internalValue.include_users = internalValue.include_users.filter((r) => r !== null);
            internalValue.exclude_users = internalValue.exclude_users.filter((r) => r !== null);
        }
        onChange(internalValue);
    }, [onChange, internalValue, exposeNulls]);

    return (
        <Flex flexDirection={'row'} alignItems="start" gap={4}>
            <FormLabel label='Active Directory Groups and Users'>
                <>
                    <Box h="15"></Box>
                    <Flex flexDirection={'row'} alignItems="start" gap={20}>
                        <UserGroupSyncList
                            tabOrder={101}
                            list="include_groups"
                            listHeader='Security Groups to Include'
                            value={internalValue.include_groups}
                            dispatch={dispatch}
                            isDisabled={isDisabled}
                            key="include_groups"
                            isRequired
                        />
                        <UserGroupSyncList
                            tabOrder={103}
                            list="exclude_users"
                            listHeader='Users to Exclude'
                            value={internalValue.exclude_users}
                            dispatch={dispatch}
                            key="exclude_users"
                            isDisabled={isDisabled}
                        />
                        <UserGroupSyncList
                            tabOrder={102}
                            list="include_users"
                            listHeader='Include Additional Users'
                            value={internalValue.include_users}
                            dispatch={dispatch}
                            key="include_users"
                            isDisabled={isDisabled}
                            isRequired
                        />
                    </Flex>
                </>
            </FormLabel>
        </Flex>
    );
});
