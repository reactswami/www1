import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityActionColumn } from '~/components/EntityActionColumn';
import { type RowData } from '~/types/models';
import { ENTITY_TYPE, LOCATION_CATEGORY } from '~/utils/constants';

const columnHelper = createColumnHelper<RowData>();

export const screeningPointcolumns = [
   columnHelper.accessor('airportTitle', {
      header: 'Airport',
      enableColumnFilter: true,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('terminalTitle', {
      header: 'Terminal',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('title', {
      enableColumnFilter: false,
      header: 'Screening Point',
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('locationCategory', {
      enableColumnFilter: false,
      header: 'Location',
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   EntityActionColumn({
      entityType: ENTITY_TYPE.SCREENING_POINT,
      title: 'Edit Screening Point',
      warningType: 'screening point',
   }),
];
