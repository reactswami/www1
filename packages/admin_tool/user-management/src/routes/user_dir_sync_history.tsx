import { Box, Flex, Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { type UserSyncHistory } from '@statseeker/api/internal_api/entities/user_sync_history/type';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { FilterActions } from '@statseeker/components/FilterActions/FilterActions';
import { type FilterGroup } from '@statseeker/components/FilterActions/type';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { Pagination } from '@statseeker/components/Legacy/Pagination';
import {
    type ColumnDef,
    ROWS_PER_PAGE,
    SSDataTable,
    type SortEventPayload,
} from '@statseeker/components/Legacy/SSDataTable';
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import * as z from 'zod';
import HistoryMenuActions from '~/components/HistoryMenuActions';
import { getSynchronizedUsersQuery, getUsersQuery, getUserSyncHistoryQuery } from '~/lib/ReactQuery';
import { type UserFilterType } from '~/types/type';



const SyncHistorySchema = z.object({
    text_filter: z.string().optional(),
    dry_run: z.boolean().optional(),
    force: z.boolean().optional(),
    status: z.string().optional(),
    duration: z.string().optional(),
    finish: z.string().optional(),
    id: z.number().optional(),
    offset: z.number().optional(),
    limit: z.number().default(ROWS_PER_PAGE).optional(),
    sort: z.string().optional().default('finish'),
    dir: z.enum(['asc', 'desc']).optional().default('desc'),
    user: z.number().optional(), // filter changes by user ID
});

export const Route = createFileRoute('/user_dir_sync_history')({
    validateSearch: (search) => SyncHistorySchema.parse(search),
    loaderDeps: ({
        search: {
            text_filter,
            offset,
            limit,
            sort = 'finish',
            dir = 'desc',
            status,
            finish,
            duration,
            force,
            dry_run,
            user,
        },
    }) => ({
        status,
        finish,
        duration,
        text_filter,
        offset,
        limit,
        sort,
        dir,
        force,
        dry_run,
        user
    }),
    loader: async ({ context, deps }) => {
        const selectedUserId = deps.user;
        let selectedUserName: string | undefined = undefined;
        if (selectedUserId) {
            const users = await context.queryClient.ensureQueryData(getUsersQuery());
            selectedUserName = users.data.find((user) => user.id === selectedUserId)?.name;
        }

        const userSyncHistoryResponse = await context.queryClient.fetchQuery(getUserSyncHistoryQuery(deps, selectedUserName));
        return { userSyncHistoryResponse, searchUser: selectedUserName };
    },
    staleTime: 0,
    component: SyncHistoryRoute,
});

const colDefs: ColumnDef[] = [
    {
        field: 'finish',
        headerName: 'Date',
        columnSize: 'sm',
    },
    {
        field: 'dry_run',
        columnSize: 'sm',
        headerName: 'Mode',
        valueFormatter: (params: any) => (params.value === 1 ? 'Dry Run' : 'Execute'),
    },
    {
        field: 'force',
        columnSize: 'sm',
        headerName: 'Force',
        valueFormatter: (params: any) => (params.value === 1 ? 'Yes' : 'No'),
    },
    {
        field: 'duration',
        columnSize: 'sm',
    },
    {
        field: 'status',
        columnSize: 'lg',
        showTooltip: true,
    }
];


function SyncHistoryRoute() {
    const searchUserId = Route.useSearch().user;
    const { userSyncHistoryResponse, searchUser } = Route.useLoaderData();
    const userSyncHistory = userSyncHistoryResponse.data;

    const navigate = useNavigate();
    const search = Route.useSearch();

    const onSort = useCallback(
        ({ column, order }: SortEventPayload) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    sort: column,
                    dir: order,
                }),
            });
        },
        [navigate]
    );

    const onChangeUser = useCallback(
        (userFilter?: number) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    user: userFilter,
                }),
            });
        },
        [navigate]
    );

    const onPageChange = useCallback(
        (newOffSet: number) => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    offset: newOffSet,
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
                    selectedIds: undefined,
                }),
                replace: true,
            });
        },
        [navigate]
    );

    const handleResetFilters = useCallback(() => {
        navigate({
            search: {
                sort: search.sort,
                dir: search.dir,
                limit: search.limit,
            },
        });
    }, [navigate, search.sort, search.dir, search.limit]);


    const handleFilterChange = useCallback((filterId: string, value: string | string[]) => {
        let searchParams = {};
        if (filterId === 'mode') {
            searchParams = {
                dry_run: value === 'dry_run' ? true : value === 'execute' ? false : undefined,
            };
        }
        else if (filterId === 'force') {
            searchParams = {
                force: value === 'force' ? true : value === 'normal' ? false : undefined,
            };
        }
        else if (filterId === 'status') {
            searchParams = {
                status: value || undefined,
            };
        }
        navigate({
            search: (prev) => ({
                ...prev,
                ...searchParams
            }),
        });
    },
        [navigate]
    );

    const dryRunFilterValue = search.dry_run ? 'dry_run' : search.dry_run === false ? 'execute' : undefined;
    const forceFilterValue = search.force ? 'force' : search.force === false ? 'normal' : undefined;
    const statusFilterValue = search.status || undefined;

    const filterGroups: FilterGroup[] = [
        {
            id: 'mode',
            title: 'Mode',
            value: dryRunFilterValue,
            options: [
                { label: 'Dry Run', value: 'dry_run' },
                { label: 'Execute', value: 'execute' },
            ],
        },
        {
            id: 'force',
            title: 'Force',
            value: forceFilterValue,
            options: [
                { label: 'Force', value: 'force' },
                { label: 'Normal', value: 'normal' },
            ],
        },
        {
            id: 'status',
            title: 'Status',
            value: statusFilterValue,
            options: [
                { label: 'Success', value: 'Success' },
                { label: 'Failed', value: 'Failed' },
            ],
        },
    ];

    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
    const handleSelection = useCallback((selectedRow?: UserSyncHistory[]) => {
        setSelectedHistoryId(selectedRow?.[0]?.id ?? null);
    }, []);

    return (
        <AdminLayout
            title='User Directory Synchronization History'
            subtitle=""
            customBackButtonComponent={
                <Link
                    to={'/'}
                    search={(prev) => ({
                        ...prev,
                        sort: undefined,
                        search: undefined,
                        selectedIds: undefined,
                        limit: undefined,
                        text_filter: undefined,
                    })}
                >
                    <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                        Back to main menu
                    </Button>
                </Link>
            }
        >
            <AdminPage className="user-sync-history">
                <Flex
                    className="header"
                    paddingBottom="md"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    width="100%"
                    gap={2}
                    minW={600} // Collapsing filters looks weird. This will scroll card instead
                >
                    <Flex className="filters" gap={2} alignItems="flex-end" width="100%">
                        <Box mt={'3px'} mr={'3px'}>
                            <EntityTypeAhead<UserFilterType>
                                isMulti={false}
                                defaultValue={searchUserId ? { id: searchUserId, name: searchUser ?? '' } : undefined}
                                entityQueryOption={getSynchronizedUsersQuery}
                                onChange={usr_obj => usr_obj ? onChangeUser(usr_obj.id) : onChangeUser(undefined)}
                                label='Find Changes Relating to User'
                                placeholder='Search Users...'
                            />
                        </Box>
                        <Flex ml="auto" gap={5}>
                            <FilterActions
                                filterGroups={filterGroups}
                                onFilterChange={handleFilterChange}
                                onResetFilters={handleResetFilters}
                                appliedFiltersCount={[forceFilterValue, dryRunFilterValue, statusFilterValue].filter(Boolean).length}
                            />
                            <HistoryMenuActions id={selectedHistoryId ?? 0} shouldDisable={!selectedHistoryId} />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexGrow={1} minHeight={0} flexShrink={1} flexDirection={'column'}>
                    <SSDataTable<UserSyncHistory>
                        rowSelectMode="single"
                        columns={colDefs}
                        sortCol={search.sort}
                        sortDir={search.dir}
                        rowData={userSyncHistory}
                        height="100%"
                        onSort={onSort}
                        rowIdKey="id"
                        onChange={handleSelection}
                        emptyMessage={
                            userSyncHistory.length === 0
                                ? 'No User Directory Synchronization History Found'
                                : 'Failed to Find Synchronization History'
                        }
                    />
                </Flex>
                <Pagination
                    totalCount={userSyncHistoryResponse.data_total}
                    limit={search.limit !== undefined ? search.limit : ROWS_PER_PAGE}
                    offset={search.offset}
                    onPageChange={onPageChange}
                    onLimitChange={handleLimitChange}
                />
                <Outlet />
            </AdminPage>
        </AdminLayout>
    );
}
