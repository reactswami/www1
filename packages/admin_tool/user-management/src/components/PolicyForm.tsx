import { Box, FormControl, FormLabel, Select, Switch } from '@chakra-ui/react';
import { updateUserSyncPolicies, addUserSyncPolicy } from '@statseeker/api/internal_api/entities/user_sync/api';
import { type getUserSyncFields, type addUserSyncFields } from "@statseeker/api/internal_api/entities/user_sync/type";
import { Button } from "@statseeker/components/Form/Button";
import { Divider } from "@statseeker/components/Layout/Divider";
import { Flex } from "@statseeker/components/Layout/Flex";
import { GroupMultiTypeahead, type GroupListItem } from '@statseeker/components/Legacy/GroupMultiTypeahead/GroupMultiTypeahead';
import { Input } from "@statseeker/components/Legacy/Input";
import { InfoCircleIcon } from '@statseeker/components/Media/Icon/InfoCircleIcon';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip/Tooltip';
import { Text } from "@statseeker/components/Typography/Text";
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useReducer } from "react";
import { Controller, useForm, type Control } from 'react-hook-form';
import { UserGroupSyncListBuilder } from "./UserGroupSyncListBuilder";
import { userGroupSyncListReducer } from "./userGroupSyncListReducer";
import { userSyncPoliciesQuery } from '~/lib/ReactQuery/queryOptions';

/* we have to slighlty reshape our data to work with react-hook-form and our
UserGroupSyncListBuilder component which expects all the lists to be in a single object */
export type PolicyFormConfig = Omit<getUserSyncFields, 'include_users' | 'include_groups' | 'exclude_users'> & {
    user_group_sync: {
        include_users: string[];
        include_groups: string[];
        exclude_users: string[];
    };
};


/* Remove empty and null values from the lists, and trim leading/trailing whitespace */
const cleanUserGroupSyncList = (list: string[]) => list.filter((r) => r !== null && r.trim() !== '').map((r) => r.trim());


const policyDataToRow = (data: PolicyFormConfig): Omit<addUserSyncFields, 'id'> => {
    return {
        name: data.name,
        priority: data.priority,
        enabled: data.enabled,
        include_groups: cleanUserGroupSyncList(data.user_group_sync.include_groups),
        include_users: cleanUserGroupSyncList(data.user_group_sync.include_users),
        exclude_users: cleanUserGroupSyncList(data.user_group_sync.exclude_users),
        user_template: data.user_template,
    };
};


export function PolicyForm({
    mode,
    initialPolicy,
    timezones,
    selectedAuthMethod,
}: {
    mode: 'add' | 'edit';
    initialPolicy?: PolicyFormConfig;
    timezones: { name: string }[];
    selectedAuthMethod: string;
}) {

    const showAuthTokenConfig = selectedAuthMethod !== 'SAML';
    const userGroupList = initialPolicy?.user_group_sync || {
        include_groups: [],
        include_users: [],
        exclude_users: [],
    };
    const [internalValue, dispatch] = useReducer(userGroupSyncListReducer, userGroupList);
    const methods = useForm<PolicyFormConfig>({
        defaultValues: initialPolicy,
    });
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        register,
        setValue,
        watch,
        setError,
    } = methods;

    const queryClient = useQueryClient();
    const toast = useToast();
    const navigate = useNavigate();

    // If our props value changes and it isn't the same as our internal state
    // then update our internal state to match it.
    useEffect(() => {
        if (JSON.stringify(userGroupList) !== JSON.stringify(internalValue)) {
            dispatch({
                type: 'REPLACE',
                value: userGroupList,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userGroupList]);

    const updatePolicies = async (data: PolicyFormConfig) => {

        let resp = null;
        if (mode === 'edit') {
            resp = await updateUserSyncPolicies([{
                id: data.id,
                ...policyDataToRow(data)
            }]);
        }
        else {
            const row = policyDataToRow(data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { priority, ...rowWithoutPriority } = row; /* priority is assigned by the back-end so we need to remove it for adds */
            resp = await addUserSyncPolicy(rowWithoutPriority);
        }

        if (!resp.success) {
            throw new Error(resp.errmsg || 'Unknown error');
        }
        return data;
    };

    const { mutate, isPending: isSaving } = useMutation({
        mutationFn: updatePolicies,
        onSuccess: async (submittedPolicy: PolicyFormConfig) => {
            await queryClient.invalidateQueries({ queryKey: ['user_sync_policy'] });

            toast({
                status: 'success',
                title: 'Success',
                description: 'Policies updated successfully.',
            });

            if (mode === 'add') {
                // This means we just added a new policy and need to find out what ID the back-end assigned it
                const policiesResp = await queryClient.fetchQuery(userSyncPoliciesQuery);
                const newPolicy = policiesResp.data.find((policy) => policy.name === submittedPolicy.name);
                if (newPolicy) {
                    submittedPolicy.id = newPolicy.id;
                }
            }

            await navigate({
                to: submittedPolicy?.id !== undefined ? `/directory/ad/edit/${submittedPolicy?.id}` : '/directory/ad',
                search: {
                    selectedIds: submittedPolicy?.id !== undefined ? [submittedPolicy?.id] : [],
                },
                replace: true,
            });
        },
        onError: (response: any) => {
            toast({
                status: 'error',
                title: 'Error',
                description: response?.message || 'An error occurred while updating policies.',
            });
        },
    });

    // Need to reload the form if anything changes.
    useEffect(() => {
        if (mode === 'edit') {
            methods.reset(initialPolicy);
        }
    }, [methods, mode, initialPolicy]);

    const isDisabled = isSubmitting || isSaving;

    const handleGroupChange = useCallback((groupIds: GroupListItem[] | null | undefined) => {
        setValue('user_template.groups', (groupIds ?? []).map((groupObj) => (groupObj.id)));
    }, [setValue]);

    const onSubmit = (data: PolicyFormConfig) => {
        // Extra validation
        const isUserGroupEmpty =
            (data.user_group_sync.include_groups ?? []).filter((r) => r !== null && r.trim() !== '').length === 0 &&
            (data.user_group_sync.include_users ?? []).filter((r) => r !== null && r.trim() !== '').length === 0;
        if (isUserGroupEmpty) {
            setError('user_group_sync', { type: 'manual', message: 'At least one user or group must be included' });
            return;
        }
        mutate(data);
    };

    return (
        <form
            id="PolicyForm"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Flex gap={2} flexDir={'column'}>
                <Flex gap={2} flexDir={'column'}>
                    <FormControl maxWidth={300}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Policy Name"
                            {...register("name", {
                                required: "Policy name is required",
                                pattern: {
                                    value: /^[a-zA-Z][a-zA-Z0-9- ]*$/,
                                    message:
                                        "Invalid name. Name must start with a letter and only contain letters, numbers, spaces, and '-'.",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Policy name cannot exceed 50 characters",
                                },
                                validate: (value) => value.trim() !== '' || 'Policy name cannot be empty',
                            })}
                            error={errors.name?.message}
                            isDisabled={isDisabled}
                        />
                    </FormControl>
                    <Divider my={2} />
                    <FormControl>
                        <FormLabel mb={5}>User Attribute Template</FormLabel>
                        <Flex flexDirection='row' gap={10}>
                            <Flex flexDirection='column' gap={3} width={'300px'}>
                                <Flex alignItems={'center'} gap={1}>
                                    <FormLabel>Synchronized Fields</FormLabel>
                                    <Tooltip textTransform='none' placement="right" label='These fields are automatically updated on sync and cannot be manually overridden.'>
                                        <Box position="relative" bottom="2px">
                                            <InfoCircleIcon size='sm' />
                                        </Box>
                                    </Tooltip>
                                </Flex>

                                <FormControl>
                                    <FormLabel>Admin Access</FormLabel>
                                    <Switch
                                        mb={3.5}
                                        isChecked={watch('user_template.is_admin') === 1}
                                        isDisabled={isDisabled}
                                        onChange={(e) => setValue("user_template.is_admin", e.target.checked ? 1 : 0)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>API Access</FormLabel>
                                    <Select
                                        {...register("user_template.api")}
                                        isDisabled={isDisabled}
                                    >
                                        <option value="">None</option>
                                        <option value="r">Read</option>
                                        <option value="rw">Read/Write</option>
                                    </Select>
                                </FormControl>
                                {showAuthTokenConfig && (
                                    <>
                                        <FormControl>
                                            <FormLabel>Auth TTL (seconds)</FormLabel>
                                            <Input
                                                type="number"
                                                {...register("user_template.auth_ttl", { valueAsNumber: true })}
                                                isDisabled={isDisabled}
                                                error={errors.user_template?.auth_ttl?.message}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Auth Refresh (seconds)</FormLabel>
                                            <Input
                                                type="number"
                                                {...register("user_template.auth_refresh", { valueAsNumber: true })}
                                                isDisabled={isDisabled}
                                                error={errors.user_template?.auth_refresh?.message}
                                            />
                                        </FormControl>
                                    </>
                                )}
                            </Flex>
                            <Divider height={'auto'} orientation='vertical' />
                            <Flex flexDirection='column' flex={1}>
                                <Flex flexDirection='row' gap={10}>
                                    <Flex flexDirection='column' gap={3} width={'300px'}>
                                        <Flex alignItems={'center'} gap={1} width={'300px'}>
                                            <FormLabel>Unsynchronized Fields</FormLabel>
                                            <Tooltip textTransform='none' placement="right" label='These fields are used when creating users but are not automatically updated. This allows you to set default values for new users while still allowing manual overrides.'>
                                                <Box position="relative" bottom="2px">
                                                    <InfoCircleIcon size='sm' />
                                                </Box>
                                            </Tooltip>
                                        </Flex>
                                        <FormControl>
                                            <FormLabel>Time Zone</FormLabel>
                                            <Select
                                                {...register("user_template.tz")}
                                                isDisabled={isDisabled}
                                            >
                                                {timezones.map(tz => (
                                                    <option key={tz.name} value={tz.name}>
                                                        {tz.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Top N</FormLabel>
                                            <Input
                                                type="number"
                                                {...register("user_template.top_n", { valueAsNumber: true })}
                                                isDisabled={isDisabled}
                                                error={errors.user_template?.top_n?.message}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Report Row Spacing</FormLabel>
                                            <Select
                                                {...register("user_template.reportRowSpacing")}
                                                isDisabled={isDisabled}
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="compact">Compact</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Export Date Format</FormLabel>
                                            <Select
                                                {...register("user_template.exportDateFormat")}
                                                isDisabled={isDisabled}
                                                sx={{
                                                    // Truncate selected value in collapsed state
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                }}
                                                title={watch("user_template.exportDateFormat")}
                                            >
                                                <option value="%s">Epoch timestamp (seconds since 1st Jan 1970)</option>
                                                <option value="%m/%d/%y %H:%M:%S">MM/DD/YY hh:mm:ss</option>
                                                <option value="%d/%m/%y %H:%M:%S">DD/MM/YY hh:mm:ss</option>
                                                <option value="%y/%m/%d %H:%M:%S">YY/MM/DD hh:mm:ss</option>
                                            </Select>
                                        </FormControl>
                                    </Flex>
                                    <Flex width={'300px'} flexDirection={'column'}>
                                        <Box height={'30px'} />
                                        <FormControl flexDirection='column'>
                                            <FormLabel>Group</FormLabel>
                                            <Box width={'300px'}>
                                                <Controller
                                                    name="user_template.groups"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <GroupMultiTypeahead
                                                            values={field.value?.map((id: number) => ({ id, name: '' })) ?? []}
                                                            onChange={handleGroupChange}
                                                            isDisabled={isDisabled}
                                                            size='lg'
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </FormControl>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </FormControl>
                    <Divider my={2} />
                    <Controller
                        control={control as Control<any>}
                        name="user_group_sync"
                        rules={{}}
                        render={({ field }) => {
                            return (
                                <UserGroupSyncListBuilder
                                    value={field.value}
                                    onChange={field.onChange}
                                    exposeNulls={true}
                                    isDisabled={isDisabled}
                                />
                            );
                        }}
                    />
                    {errors.user_group_sync?.message && (
                        <Text color="red.500">{errors.user_group_sync.message}</Text>
                    )}
                </Flex>
            </Flex>
            <Flex gap={'2'} justifyContent='left' mt={4} mb={4}>
                <Button
                    variant={'primary'}
                    type="submit"
                    isDisabled={isDisabled}
                    isLoading={isSaving}
                >
                    Save
                </Button>
            </Flex>
        </form >
    );
}
