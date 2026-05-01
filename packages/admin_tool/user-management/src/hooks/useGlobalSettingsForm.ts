import { type UserSyncExecuteOptions } from "@statseeker/api/internal_api/entities/user_sync/type";
import {
    getUserSyncAuth, updateUserSyncAuth, addUserSyncAuth, executeUserSyncAuth,
    type addUserSyncAuthFields, type updateUserSyncAuthFields, type getUserSyncAuthFields
} from '@statseeker/api/internal_api/entities/user_sync_auth';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { userSyncAuthQuery, userSyncTaskQuery } from '~/lib/ReactQuery';
import { type GlobalOptionsFormProps } from '~/types/type';
import { updateUserSyncSchedule } from "~/utils/utils";


const prepare_payload = (
    formData: updateUserSyncAuthFields,
    isBindPasswordAlreadySet: boolean,
    isCertificateAlreadySet: boolean
): updateUserSyncAuthFields => {
    /* remove bind password if it has already been set and the user did not provide a new one */
    let payload = { ...formData };
    if (isBindPasswordAlreadySet && formData.ldap_bind_password === '') {
        const { ldap_bind_password, ...payload_no_password } = payload;
        payload = { ...payload_no_password };
    }

    /* remove certificate if it has been set and unchanged */
    if (isCertificateAlreadySet && formData.ldap_certificate === '') {
        const { ldap_certificate, ...payload_no_certificate } = payload;
        payload = { ...payload_no_certificate };
    }
    return payload;
};


const updateUserSyncAuthConfig = async (
    formData: addUserSyncAuthFields | updateUserSyncAuthFields,
    isBindPasswordAlreadySet: boolean,
    isCertificateAlreadySet: boolean
) => {
    const user_sync_auth_resp = await getUserSyncAuth();

    if (!user_sync_auth_resp.success) {
        throw new Error(user_sync_auth_resp.errmsg || 'Failed to fetch existing user sync authentication configuration.');
    }

    const id = user_sync_auth_resp.data.length > 0 ? user_sync_auth_resp.data[0].id : undefined;

    /* Perform an add/update depending on whether the ID was set */
    if (id !== undefined) {
        /* add the ID to the payload for the update call */
        let payload = { ...formData, id } as updateUserSyncAuthFields;
        payload = prepare_payload(payload, isBindPasswordAlreadySet, isCertificateAlreadySet);
        return updateUserSyncAuth(payload);
    }
    else {
        // Omit 'id' from payload
        const { id, ...payload_no_id } = formData;
        let payload = { ...payload_no_id } as addUserSyncAuthFields;
        return addUserSyncAuth(payload);
    }
};


export default function useGlobalSettingsForm({
    executeOptions,
    initialUserSyncAuthConfig,
}: {
    executeOptions: UserSyncExecuteOptions;
    initialUserSyncAuthConfig: getUserSyncAuthFields | undefined;
}) {
    /* If no initial config was provided, we create a blank one */
    const userSyncAuthConfig: getUserSyncAuthFields | addUserSyncAuthFields = initialUserSyncAuthConfig ? initialUserSyncAuthConfig : {
        id: undefined,
        ldap_server: '',
        ldap_port: 389,
        ldap_base_dn: '',
        ldap_bind_dn: '',
        ldap_bind_password: '',
        ldap_ad_domain: '',
        ldap_secure_mode: 'NONE',
    };

    const methods = useForm<GlobalOptionsFormProps>({
        defaultValues: {
            ...userSyncAuthConfig,
            ldap_bind_password: '',
            ldap_certificate: '',
            use_user_auth: executeOptions.use_user_auth ?? true,
            force: executeOptions.force ?? true,
            username_attribute: executeOptions.username_attribute || 'sAMAccountName',
        },
    });
    const { handleSubmit, watch, formState: { isSubmitting }, getValues } = methods;

    const use_user_auth = watch('use_user_auth');

    /* Flag to indicate whether the bind password has already been set (impacts whether we mandate
    the password field being set) */
    const isBindPasswordAlreadySet = userSyncAuthConfig.ldap_bind_password === "set";
    const isCertificateAlreadySet = userSyncAuthConfig.ldap_certificate === "set";

    /* initialise toast for success/error messages */
    const toast = useToast();
    const queryClient = useQueryClient();


    /* Handler function for tesing the user auth config */
    async function handleTest(formData: addUserSyncAuthFields | updateUserSyncAuthFields) {
        const payload = formData.id === undefined ? formData as addUserSyncAuthFields : prepare_payload(formData as updateUserSyncAuthFields, isBindPasswordAlreadySet, isCertificateAlreadySet);
        const result = await executeUserSyncAuth(payload);

        if (!result.success) {
            throw new Error(result.errmsg || 'Active Directory authentication test failed.');
        }

        return result;
    }

    /* Handler for when the save button was clicked */
    const saveConfig = async (data: GlobalOptionsFormProps) => {
        const { use_user_auth, username_attribute, force, ...payload } = data;

        /* only update the user sync auth config if we're not using the existing auth config */
        if (!use_user_auth) {
            const auth_response = await updateUserSyncAuthConfig(payload, isBindPasswordAlreadySet, isCertificateAlreadySet);

            if (!auth_response.success) {
                throw new Error(auth_response.errmsg || 'Failed to save user sync authentication configuration.');
            }
        }

        /* always update the use_user_auth value */
        const task_response = await updateUserSyncSchedule({
            queryClient,
            updateOptions: { use_user_auth: use_user_auth, username_attribute: username_attribute, force: force }
        });
        if (task_response && !task_response.success) {
            throw new Error(task_response.errmsg || 'Failed to update user sync task with new authentication configuration.');
        }

        return {
            success: true,
        };
    };


    /* Mutation for saving the user sync auth config */
    const saveMutation = useMutation({
        mutationFn: saveConfig,
        onSuccess: async () => {
            toast({
                status: 'success',
                title: 'Success',
                description: 'Global settings saved successfully.',
            });
            await queryClient.invalidateQueries({ queryKey: userSyncAuthQuery.queryKey });
            await queryClient.invalidateQueries({ queryKey: userSyncTaskQuery.queryKey });
        },
        onError: (error) => {
            toast({
                status: 'error',
                title: 'Error',
                description:
                    error.message || 'An error has occurred.',
            });
        },
    });

    const testMutation = useMutation({
        mutationFn: async (formData: GlobalOptionsFormProps) => {
            const { use_user_auth, ...userSyncAuthConfig } = formData;
            if (use_user_auth) {
                /* not expected to hit this case */
                throw new Error('Cannot test configuration when using existing authentication details.');
            }
            return await handleTest(userSyncAuthConfig);
        },
        onSuccess: () => {
            toast({
                status: 'success',
                title: 'Test Succeeded',
                description: 'Active Directory authentication test succeeded.',
            });
        },
        onError: (error) => {
            toast({
                status: 'error',
                title: 'Test Error',
                description: error.message || 'An error has occurred.',
            });
        },
    });

    const isSaving = saveMutation.isPending || isSubmitting;
    const isDisabled = isSaving || use_user_auth || testMutation.isPending;

    return {
        methods,
        isDisabled,
        isSaving,
        isBindPasswordAlreadySet,
        testMutation,
        use_user_auth,
        onTestClick: () => testMutation.mutate(getValues()),
        onSubmit: handleSubmit((data) => saveMutation.mutate(data)),
    };
}