import { Flex, Accordion } from '@chakra-ui/react';
import { type UserSyncExecuteOptions } from "@statseeker/api/internal_api/entities/user_sync/type";
import { type getUserSyncAuthFields } from '@statseeker/api/internal_api/entities/user_sync_auth';
import { Button } from '@statseeker/components/Form/Button';
import { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import AuthenticationPanel from './AuthenticationPanel';
import SynchronizationOptionsPanel from './SynchronizationOptionsPanel';
import useGlobalSettingsForm from '~/hooks/useGlobalSettingsForm';


export function GlobalSettingsForm({
    executeOptions,
    initialUserSyncAuthConfig,
    selectedAuthMethod
}: {
    executeOptions: UserSyncExecuteOptions;
    initialUserSyncAuthConfig: getUserSyncAuthFields | undefined;
    selectedAuthMethod: string;
}) {

    const {
        methods,
        isDisabled,
        isSaving,
        use_user_auth,
        onSubmit,
        isBindPasswordAlreadySet,
        testMutation,
        onTestClick
    } = useGlobalSettingsForm({ executeOptions, initialUserSyncAuthConfig });

    // This list is the indexes of the accordian panels that are expanded by default.
    // Show the auth panel by default if it is being used.
    const defaultIndex = useMemo(() => {
        const indexes = [0];
        if (!use_user_auth) {
            indexes.push(1);
        }
        return indexes;
    }, [use_user_auth]);

    return (
        <Flex
            direction="column"
            as='form'
            onSubmit={onSubmit}
            alignContent={'center'}
            width={'100%'}
            pt={'4'}
            gap={'4'}
            maxWidth={'container.lg'}
            marginX={'auto'}
            overflowY={'auto'}
            paddingX={'1rem'}
        >
            <FormProvider {...methods}>
                <Accordion
                    defaultIndex={defaultIndex}
                    allowMultiple
                    display={'flex'}
                    gap={4}
                    flexDir={'column'}
                >
                    <SynchronizationOptionsPanel />
                    <AuthenticationPanel
                        use_user_auth={use_user_auth ?? true}
                        selectedAuthMethod={selectedAuthMethod}
                        isDisabled={isDisabled}
                        isBindPasswordAlreadySet={isBindPasswordAlreadySet}
                    />

                </Accordion>

                <Flex gap={'2'} justify="flex-end">
                    <Button
                        variant={'secondary'}
                        type='button'
                        isDisabled={isSaving || use_user_auth}
                        isLoading={testMutation.isPending}
                        onClick={onTestClick}
                    >
                        Test
                    </Button>
                    <Button
                        variant={'primary'}
                        type='submit'
                        isLoading={isSaving}
                        isDisabled={isSaving || testMutation.isPending}
                    >
                        Save
                    </Button>
                </Flex>
            </FormProvider>
        </Flex >
    );
}
