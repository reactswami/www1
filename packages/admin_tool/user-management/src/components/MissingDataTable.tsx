import { Box } from '@chakra-ui/react';
import { Pagination } from '@statseeker/components';
import { SSDataTable } from '@statseeker/components/Legacy/SSDataTable';
import { useCallback, useMemo, useState } from 'react';



interface MissingDataTableProps {
    columns: any[];
    rowData: any[];
    defaultLimit?: number;
}

export default function MissingDataTable({
    columns,
    rowData,
    defaultLimit = 10,
}: MissingDataTableProps) {
    const [limit, setLimit] = useState(defaultLimit);
    const [offset, setOffset] = useState(0);

    // Reset offset to 0 if limit changes (to avoid out-of-bounds)
    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setOffset(0);
    }, []);

    const pagedRows = useMemo(() => rowData.slice(offset, offset + limit), [rowData, offset, limit]);

    if (!rowData || rowData.length === 0) return null;

    return (
        <Box width="100%" display="flex" flexDirection="column" alignItems="left">
            <SSDataTable
                columns={columns}
                rowData={pagedRows}
                selectText={true}
            />
            {rowData.length > defaultLimit && (
                <Pagination
                    limit={limit}
                    totalCount={rowData.length}
                    onPageChange={setOffset}
                    offset={offset}
                    onLimitChange={handleLimitChange}
                />
            )}
        </Box>
    );
}

