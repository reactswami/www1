import { Button, Box } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import * as z from 'zod';
import UserSyncResults from '~/components/UserSyncResults';
import { queryClient, getUserSyncHistoryByIdQuery } from '~/lib/ReactQuery';


const tablePaginationSearchSchema = z.object({
    offset: z.number().optional(),
    limit: z.number().optional(),
});


export const Route = createFileRoute('/user_dir_sync_history/$id')({
    validateSearch: (search) => tablePaginationSearchSchema.parse(search),
    parseParams: (params: any) => {
        return {
            id: z.number().int().parse(Number(params.id)),
        };
    },
    loader: async ({ params }) => {
        return await queryClient.ensureQueryData(getUserSyncHistoryByIdQuery({ id: params.id }));
    },
    component: ViewUserSyncChanges,
});


function ViewUserSyncChanges() {
    const navigate = useNavigate();
    const { offset, limit } = Route.useSearch();
    const resp = Route.useLoaderData();
    const data = resp.data;
    const executeResults = data[0].details;

    /* update the search params when the page or limit changes */
    const handlePageChange = useCallback(
        function handlePageChange(newOffset: number) {
            navigate({
                search: (prev) => ({
                    ...prev,
                    offset: newOffset,
                }),
            });
        },
        [navigate]
    );

    const handleLimitChange = useCallback(
        function handleLimitChange(newLimit: number) {
            navigate({
                search: (prev) => ({
                    ...prev,
                    limit: newLimit,
                    offset: 0,
                }),
            });
        },
        [navigate]
    );


    if (data.length === 0) {
        return (
            <AdminLayout title="Active Directory User Synchronization">
                <AdminPage className='user-dir-sync-history'>
                    Error loading synchronization changes
                </AdminPage>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title='User Directory Synchronization History'
            subtitle=""
            customBackButtonComponent={
                <Link
                    to={'/user_dir_sync_history'}
                    search={(prev) => ({ ...prev })}
                >
                    <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                        Back to History Browser
                    </Button>
                </Link>
            }
        >
            <UserSyncResults
                data={executeResults}
                success={data[0].status.startsWith('Success')}
                finishTime={data[0].finish}
                errmsg={data[0].status.split('Failed: ')[1] || 'An error occurred during synchronization'}
                offset={offset}
                limit={limit}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
            />
        </AdminLayout>
    );
}
