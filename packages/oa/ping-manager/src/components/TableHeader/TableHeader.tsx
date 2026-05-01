import { Thead, Tr } from '@chakra-ui/react';
import { type useDimensions } from '@statseeker/hooks';
import { type HeaderGroup } from '@tanstack/react-table';
import { type PingTableDeviceRow } from '~/components';
import { TableHeaderCell } from '~/components/TableHeaderCell';
import { usePingTableContext } from '~/contexts';

type Stringify<T extends {}> = Record<keyof T, string>;

interface Props {
   dimensions: ReturnType<typeof useDimensions>['dimensions'];
   getHeaderGroups: () => HeaderGroup<Stringify<PingTableDeviceRow>>[];
}

export const TableHeader = ({ dimensions, getHeaderGroups }: Props) => {
   const { sortBy, setSortBy } = usePingTableContext();
   return (
      <Thead
         zIndex={1}
         position={'sticky'}
         top={`${dimensions?.height}px`}
         background={'page.500'}
         borderBottom="1px"
         borderColor="gray.500"
         shadow="sm"
         _after={{
            content: "''",
            position: 'absolute',
            bottom: '-2px',
            width: '100%',
            height: '2px',
            backgroundColor: 'gray.500',
         }}
      >
         {getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
               {headerGroup.headers.map((header, idx) => {
                  return (
                     <TableHeaderCell
                        key={header.id}
                        header={header}
                        isCheckboxCell={idx === 0}
                        setSortBy={setSortBy}
                        sortBy={sortBy}
                     />
                  );
               })}
            </Tr>
         ))}
      </Thead>
   );
};
