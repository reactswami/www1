import { getCronValue } from '@statseeker/components';
import { type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { type ITooltipParams, type ValueFormatterParams } from 'ag-grid-community';
import EnableDisableRender from './enableDisableRenderer';

function formatDuration(totalSeconds: number) {
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;

   let parts = [];

   if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
   if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
   if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
   }

   // Joins with commas and adds "and" before the last item
   if (parts.length <= 1) return parts[0];
   const last = parts.pop();
   return `${parts.join(', ')} and ${last}`;
}

const scheduleColDefs: ColumnDef[] = [
   {
      field: 'enabled',
      cellRenderer: EnableDisableRender,
      headerName: '',
      minWidth: 50,
      maxWidth: 50,
   },
   { field: 'name', headerName: 'Name' },
   {
      field: 'mode',
      headerName: 'Mode',
   },
   {
      field: 'time',
      headerName: 'Schedule',
      valueFormatter: (item: ValueFormatterParams) => getCronValue(null, item.value),
      tooltipValueGetter: (item: ITooltipParams) => getCronValue(null, item.value),
   },
   {
      field: 'poller_name',
      headerName: 'Poller',
      valueFormatter: (item: ValueFormatterParams) => item.data?.mode === 'Rewalk' ? '' : item.value,
   },
   {
      field: 'last_run_state',
      headerName: 'Last Run State',
      valueFormatter: (item: ValueFormatterParams) => item.value === 1 ? 'Success' : 'Failed',
      tooltipValueGetter: (item: ITooltipParams) => item.value !== 1 ? item.data?.results?.[0]?.errmsg : '',
   },
   {
      // not sure why these 2 fields cannot be sorted, must be something with the query that needs to be fixed later
      field: 'finish',
      headerName: 'Last Run Time',
      valueFormatter: (item: ValueFormatterParams) => new Date(item.value * 1000).toLocaleString(),
      canSort: false,
   },
   {
      field: 'duration',
      headerName: 'Last Run Duration',
      valueFormatter: (item: ValueFormatterParams) => formatDuration(item.value),
      canSort: false,
   },
];

export default scheduleColDefs;
