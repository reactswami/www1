/* react imports */
import React, { ReactNode, type Dispatch, memo, useCallback } from 'react';
/* 3rd party imports */
import { IconButton, FormLabel, FormControl, Box } from '@chakra-ui/react';
/* statseeker imports */
import { CrossIcon } from '@statseeker/components/Media/Icon/CrossIcon';
import { Input } from '@statseeker/components/Legacy/Input';
import { Button } from '@statseeker/components/Form/Button';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import { InfoCircleIcon } from '@statseeker/components/Media/Icon';
/* project imports */
import { type UserGroupSyncListReducerAction } from './userGroupSyncListReducer';

export type UserGroupSyncListProps = {
    /**
     * The header for the UserGroupSyncList, example: Excludes or Includes
     */
    list: 'include_groups' | 'include_users' | 'exclude_users';
    /**
     * The displayed header name
     */
    listHeader: string;
    /**
     * Is this list a required field?
     * @default false
     */
    isRequired?: boolean;
    /**
     * Beginning of the tab order
     */
    tabOrder: number;
    /**
     * The list of input values to render
     */
    value: (string | null)[];
    /**
     * The dispatch function for the main data reducer
     */
    dispatch: Dispatch<UserGroupSyncListReducerAction>;
    /**
     * The list of errors to show against the input values.
     * The index of the error message in this list is compared against the
     * index of the input values. `undefined` should be set for values without
     * errors.
     * @default undefined
     */
    errors?: (string | undefined)[];
    /**
     * If enabled, the component will be disabled.
     */
    isDisabled?: boolean;
};


/**
 * An input component for adding and removing a list of users or groups for AD user sync policies
 */
const UserGroupSyncList = memo(function UserGroupSyncList({
    isRequired = false,
    list,
    listHeader,
    tabOrder,
    value: internalValue,
    dispatch,
    errors,
    isDisabled = false,
}: UserGroupSyncListProps) {

    const handleInputChanged = useCallback(function handleInputChanged(index: number, newValue: string) {
        dispatch({
            type: 'UPDATE',
            list,
            index,
            value: newValue
        });
    }, [dispatch, list]);

    const handleInputRemoved = useCallback(function handleInputRemoved(index: number) {
        dispatch({
            type: 'REMOVE',
            list,
            index,
        });
    }, [dispatch, list]);

    const handleInputAdded = useCallback(() => {
        dispatch({
            type: 'ADD',
            list,
        });
    }, [dispatch, list]);

    const lastIndex = internalValue?.lastIndexOf('') || 0;

    const userGroupList: ReactNode[] = internalValue
        .map((name, i) => {
            // Nulls are not rendered
            if (name === null) {
                return null;
            }
            const error = errors?.[i];
            return (
                <UserGroupInput
                    key={`k${i}-h${list}`}
                    index={i}
                    value={name}
                    error={error}
                    autoFocus={i === lastIndex}
                    onChange={handleInputChanged}
                    onRemove={handleInputRemoved}
                    tabOrder={tabOrder}
                    isDisabled={isDisabled}
                />
            );
        })
        // Ensure we always have at least one input
        .filter((input) => input !== null);

    if (userGroupList.length === 0) {
        userGroupList.push(
            <UserGroupInput
                key={`k0-h${list}`}
                index={0}
                value={''}
                error={errors?.[0]}
                autoFocus={true}
                onChange={handleInputChanged}
                onRemove={handleInputRemoved}
                tabOrder={tabOrder}
                isDisabled={isDisabled}
            />
        );
    }

    const toolTipMap = {
        'include_groups': 'Synchronise users from the specified Active Directory groups',
        'include_users': 'Synchronise specific users from Active Directory. The sAMAccountName or ' +
            'userPrincipalName is used depending on your username attribute global setting.',
        'exclude_users': 'Exclude specific users that are in the included groups.',
    };


    return (
        <Flex flexDirection={'column'} gap={2} alignItems="start">
            <Flex gap={1}>
                <FormControl isRequired={isRequired}>
                    <FormLabel margin="0">{listHeader}</FormLabel>
                </FormControl>
                <Tooltip textTransform='none' placement="right" label={toolTipMap[list]}>
                    <Box position="relative" bottom="2px">
                        <InfoCircleIcon size='sm' />
                    </Box>
                </Tooltip>
            </Flex>
            {userGroupList}
            <Button
                tabIndex={tabOrder + 2 * internalValue.length}
                type="button"
                variant={'secondary'}
                onClick={handleInputAdded}
                isDisabled={isDisabled}
            >
                Add
            </Button>
        </Flex>
    );
});


type UserGroupInputProps = {
    index: number;
    value: string;
    error: string | undefined;
    onChange: (index: number, newInputValue: string) => void;
    onRemove: (index: number) => void;
    autoFocus: boolean;
} & Pick<UserGroupSyncListProps, 'tabOrder' | 'isDisabled'>;


const UserGroupInput = memo(function UserGroupInput({ index, value, error, onChange, onRemove, autoFocus, tabOrder, isDisabled }: UserGroupInputProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(index, e.target.value);
        },
        [onChange, index]
    );

    const handleRemove = useCallback(
        () => {
            onRemove(index);
        },
        [onRemove, index]
    );

    return (
        <Flex alignItems="start" gap={2}>
            <Input
                tabIndex={tabOrder + index}
                value={value}
                autoFocus={autoFocus}
                onChange={handleChange}
                error={error}
                isDisabled={isDisabled}
            />
            <IconButton
                colorScheme={'red'}
                tabIndex={tabOrder + index + 1}
                title={"Remove"}
                aria-label="Remove"
                variant={'outline'}
                icon={<CrossIcon />}
                onClick={handleRemove}
                isDisabled={isDisabled}
            />
        </Flex>
    );
});


export default UserGroupSyncList;
