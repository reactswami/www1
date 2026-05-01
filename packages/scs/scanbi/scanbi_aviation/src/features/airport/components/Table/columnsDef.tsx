import { Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityActionColumn } from '~/components/EntityActionColumn';
import { type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

const columnHelper = createColumnHelper<RowData>();

export const columns = [
   columnHelper.accessor('title', {
      header: 'Airport',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   EntityActionColumn({
      entityType: ENTITY_TYPE.AIRPORT,
      title: 'Edit Airport',
      warningType: 'airport',
   }),
];
