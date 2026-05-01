import { Box, Flex, Button as ChakraButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { type UserSyncExecuteResult } from '@statseeker/api/internal_api/entities/user_sync_history';
import { AdminLayout, Button } from '@statseeker/components';
import { Spinner } from '@statseeker/components/Feedback/Spinner';
import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import UserSyncResults from '~/components/UserSyncResults';
import { runUserSync } from "~/utils/utils";


const ExecuteSchema = z.object({
    dry_run: z.boolean().optional(),
});


export const Route = createFileRoute('/user_sync_execute')({
    validateSearch: (search) => ExecuteSchema.parse(search),
    component: UserSyncExecution,
});


export function UserSyncExecution() {
    const search = Route.useSearch();
    const dryRun = search.dry_run ?? false;

    const [executeResults, setExecuteResults] = useState<{ success: boolean; errmsg?: string; data: UserSyncExecuteResult[]; time: number } | null>(null);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

    const executeMutation = useMutation({
        mutationKey: ['userSync', dryRun],
        mutationFn: async (dryRun: boolean) => {
            return await runUserSync(dryRun);
        },
        onSuccess: (response) => {
            setExecuteResults(response);
        },
        onError: (error: any) => {
            setExecuteResults({
                success: false,
                errmsg: error.message || 'An error occurred during execution.',
                data: [],
                time: Math.floor(Date.now() / 1000)
            });
        },
    });

    useEffect(() => {
        executeMutation.mutate(dryRun);
        /* no dependencies - run once on initial mount */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AdminLayout
            title={`${dryRun ? 'Dry Run' : 'Execution'} Results`}
            subtitle=""
            customBackButtonComponent={
                <Link
                    to={'/'}
                >
                    <ChakraButton variant="link" leftIcon={<ChevronLeftIcon />}>
                        Back to main menu
                    </ChakraButton>
                </Link>
            }
        >
            {executeMutation.isPending && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Spinner size="lg" />
                </Box>
            )}
            {executeResults && !executeMutation.isPending && (
                <>
                    <Box>
                        <UserSyncResults
                            success={executeResults.success}
                            errmsg={executeResults.errmsg}
                            finishTime={new Date(executeResults.time * 1000).toLocaleString()}
                            data={executeResults.data}
                            handlePageChange={setOffset}
                            handleLimitChange={setLimit}
                            offset={offset}
                            limit={limit}
                        />
                    </Box>
                    <Box mt={2}>
                        <Flex gap={4} justifyContent="flex-end">
                            <Button
                                variant='primary'
                                onClick={() => executeMutation.mutate(dryRun)}
                                isDisabled={executeMutation.isPending}
                            >
                                {'Run Again'}
                            </Button>
                        </Flex>
                    </Box>
                </>
            )}
        </AdminLayout >
    );
}
