import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityActionColumn } from '~/components/EntityActionColumn';
import { type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

const columnHelper = createColumnHelper<RowData>();

export const TerminalColumns = [
   columnHelper.accessor('airportTitle', {
      header: 'Airport',
      enableColumnFilter: false,
      enableHiding: true,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('title', {
      header: 'Terminal',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   EntityActionColumn({
      entityType: ENTITY_TYPE.TERMINAL,
      title: 'Edit Terminal',
      warningType: 'terminal',
   }),
];
