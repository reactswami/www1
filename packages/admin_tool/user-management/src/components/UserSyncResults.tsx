import { Flex, Accordion, Box } from '@chakra-ui/react';
import { type UserSyncExecuteResult } from '@statseeker/api/internal_api/entities/user_sync_history';
import { Panel } from '@statseeker/components/Disclosure/Panel/Panel';
import { Alert } from '@statseeker/components/Feedback/Alert';
import { Text } from '@statseeker/components/Typography';
import { useMemo } from 'react';
import MissingDataTable from './MissingDataTable';
import SynchronizedUserTable, { type SynchronizedUserRow } from './SynchronizedUserTable';


function getSynchronizedUserData(input: any[]): SynchronizedUserRow[] {
    const ret = input.flatMap(policy =>
        (policy.synchronized_users || []).map((user: any) => ({
            policy_name: policy.policy_name,
            policy_id: policy.policy_id,
            ...user
        }))
    );
    if (!Array.isArray(ret)) {
        return [];
    }
    return ret;
}


function getMissingData(
    input: any[],
    property: string,
): any[] {
    return input.flatMap(policy =>
        (policy[property] || []).map((item: any) => ({
            policy_name: policy.policy_name,
            policy_id: policy.policy_id,
            name: item
        }))
    );
}


export default function UserSyncResults({
    data,
    success,
    errmsg,
    finishTime,
    offset,
    limit,
    handlePageChange,
    handleLimitChange,
}: {
    data: UserSyncExecuteResult[];
    success: boolean;
    errmsg?: string;
    finishTime?: string;
    offset?: number;
    limit?: number;
    handlePageChange: (newOffset: number) => void;
    handleLimitChange: (newLimit: number) => void;
}) {

    const synchronizedUserData = success ? getSynchronizedUserData(data) : null;

    const missingDataTables = useMemo(() => [
        {
            heading: "Active Directory Groups Not Found",
            description: "Groups that were specified in the policy, but were not found in Active Directory.",
            columns: [
                { field: 'name', headerName: 'Group Name', canSort: false },
                { field: 'policy_name', headerName: 'Policy', canSort: false },
            ],
            rowData: success ? getMissingData(data, 'missing_include_groups') : []
        },
        {
            heading: "Active Directory Users Not Found",
            description: "Users that were specified in the policy, but were not found in Active Directory.",
            columns: [
                { field: 'name', headerName: 'User Name', canSort: false },
                { field: 'policy_name', headerName: 'Policy', canSort: false },
            ],
            rowData: success ? getMissingData(data, 'missing_include_users') : []
        },
        {
            heading: "Policy Exclude Users Not Found",
            description: "Users that were specified to be excluded from the policy, but were not found.",
            columns: [
                { field: 'name', headerName: 'User Name', canSort: false },
                { field: 'policy_name', headerName: 'Policy', canSort: false },
            ],
            rowData: success ? getMissingData(data, 'missing_exclude_users') : []
        }
    ], [data, success]);

    const defaultIndex = useMemo(() => {
        // Show the synchronised users accordion tab if there are no missing data tables, otherwise
        // collapse all tabs.
        return missingDataTables.some(table => table.rowData && table.rowData.length > 0) ? [] : [0];
    }, [missingDataTables]);

    return (
        <Flex gap={4} flexDirection="column">
            <Alert
                variant={success ? 'success' : 'error'}
                title={success ? 'Success' : 'Failed'}
                description={success ? '' : errmsg || 'An error occurred during synchronization'}
            />
            {finishTime && (
                <Flex alignItems="center" gap={1}>
                    <Text as='b'>{'Completed '}</Text>
                    <Text>{finishTime}</Text>
                </Flex>
            )}

            {success && (
                <Accordion
                    defaultIndex={defaultIndex}
                    allowMultiple
                    display={'flex'}
                    gap={4}
                    flexDir={'column'}
                >
                    <Panel title="Synchronized Users" >
                        <SynchronizedUserTable
                            data={synchronizedUserData}
                            handlePageChange={handlePageChange}
                            offset={offset}
                            limit={limit}
                            handleLimitChange={handleLimitChange}
                        />
                    </Panel>
                    {missingDataTables.map((table, index) => (!table.rowData || table.rowData.length === 0 ? null : (
                        <Panel key={index} title={table.heading} subTitle={table.description}>
                            <MissingDataTable
                                {...table}
                            />
                        </Panel>
                    )))}
                </Accordion>
            )}
        </Flex>
    );
}