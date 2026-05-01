import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityActionColumn } from '~/components/EntityActionColumn';
import { type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

const columnHelper = createColumnHelper<RowData>();

export const equipmentColumns = [
   columnHelper.accessor('airportTitle', {
      header: 'Airport',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('terminalTitle', {
      header: 'Terminal',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('screeningPointTitle', {
      header: 'Screening point',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('laneTitle', {
      header: 'Lane',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('name', {
      header: 'Equipment',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('equipmentType', {
      header: 'Type',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('productLine', {
      header: 'Product Line',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('modelName', {
      header: 'Model',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('firmware', {
      header: 'Firmware version',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('serialNumber', {
      header: 'Serial Number',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('ipaddress', {
      header: 'IP Address',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   EntityActionColumn({
      entityType: ENTITY_TYPE.DEVICE_EQUIPMENT,
      title: 'Edit Equipment',
      warningType: 'equipment',
   }),
];
