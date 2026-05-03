import { Box } from '@statseeker/components/Layout/Box';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { type DiffOp } from '@statseeker/api/internal_api/entities/user_sync_history';
import { Button, Tag } from '@statseeker/components';
import { SSDataTable, type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';

const viewChangesColumns: ColumnDef[] = [
   {
      field: 'path',
      headerName: 'Field',
      canSort: false,
      valueFormatter: (params: any) => {
         switch (params.value) {
            case '/enabled': return 'Status';
            case '/is_admin': return 'Admin Access';
            case '/api': return 'API Permissions';
            case '/auth': return 'Auth Method';
            case '/auth_refresh': return 'Auth Refresh';
            case '/auth_ttl': return 'Auth TTL';
            case '/exportDateFormat': return 'Export Date Format';
            case '/top_n': return 'Top N';
            case '/reportRowSpacing': return 'Report Row Spacing';
            case '/tz': return 'Timezone';
            case '/name': return 'Name';
            case '/email': return 'Email';
            case '/groups': return 'Groups';
            case '/managed_by': return 'Policy';
            default: return params.value.slice(1);
         }
      },
   },
   {
      field: 'op',
      headerName: 'Operation',
      cellRenderer: (cell) => {
         const variantOpMap: Record<string, 'success' | 'blue' | 'danger'> = {
            add: 'success',
            replace: 'blue',
            remove: 'danger',
         };
         return (
            <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
               <Tag variant={variantOpMap[cell.value]} verticalAlign={'middle'}>
                  {cell.value === 'add' ? 'New' : cell.value === 'replace' ? 'Modified' : 'Removed'}
               </Tag>
            </Box>
         );
      },
      canSort: false,
   },
   {
      field: 'value',
      headerName: 'New Value',
      showTooltip: true,
      canSort: false,
      cellRenderer: (cell) => {
         if (cell.data.path === '/enabled') return cell.value === 1 ? 'Enabled' : 'Disabled';
         if (cell.data.path === '/is_admin') return cell.value === 1 ? 'Yes' : 'No';
         if (cell.data.path === '/api') return cell.value === 'r' ? 'Read-Only' : cell.value === 'rw' ? 'Read/Write' : 'None';
         if (cell.data.path === '/groups') return cell.value.join(', ');
         return cell.value;
      },
   },
];

const HIDDEN_USER_FIELDS = ['/id'];

export default function ViewChanges({
   changes,
   disclosure,
}: {
   changes: { name: string; diff: DiffOp[] };
   disclosure: { isOpen: boolean; onClose: () => void };
}) {
   return (
      <SSModal
         isOpen={disclosure.isOpen}
         onClose={disclosure.onClose}
         size="3xl"
         title={`Changes for user '${changes.name}'`}
         confirmButton={{ label: 'Close', variant: 'primary', onClick: disclosure.onClose }}
      >
         <SSDataTable
            columns={viewChangesColumns}
            rowData={changes.diff.filter((change: any) => !HIDDEN_USER_FIELDS.includes(change.path))}
            width="100%"
         />
      </SSModal>
   );
}
