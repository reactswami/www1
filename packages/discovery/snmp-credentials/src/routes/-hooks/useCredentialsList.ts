import { type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';

const snmpCredentialColumns: ColumnDef[] = [
   {
      field: 'name',
      headerName: 'name',
      showTooltip: true
   },
   {
      field: 'type',
      headerName: 'type' ,
      flex: 0.1,
      minWidth: 80
   },
   {
      field: 'devices',
      flex: 0.1,
      minWidth: 75
   },
];

export default function useCredentialsList() {
   return {
      snmpCredentialColumns,
   };
}
