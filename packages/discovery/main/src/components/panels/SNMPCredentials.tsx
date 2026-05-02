import {
   Button,
   Flex,
   Input,
   Text,
   useDisclosure,
} from '@statseeker/components/Layout';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities/snmp_credential';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { SSDataTable, type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { useDebounce } from '@statseeker/hooks';
import { type ApiFilter } from '@statseeker/utils/types';
import { useQuery } from '@tanstack/react-query';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { type ChangeEvent, useCallback, useState } from 'react';
import { AddCredentialsModal } from './AddCredentialsModal';
import { snmpCredentialQueryOptions } from '~/lib/ReactQuery';

const columns: ColumnDef[] = [
   { field: 'name', columnSize: 'lg' },
   { field: 'type', columnSize: 'lg' },
];

export function SNMPCredentialsPanel({
   onChange,
   defaultValues
}: {
   defaultValues?: number[] | undefined;
   onChange: (data: SNMPCredential[] | undefined) => void;
}) {
   const [filters, setFilters] = useState<ApiFilter>({
      sort: 'name',
      dir: 'asc',
   });
   const [text_filter, setTextFilter] = useState("");
   const { data, isSuccess: success } = useQuery(snmpCredentialQueryOptions.get({ ...filters, text_filter }));
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [selectedCount, setSelectedCount] = useState(data?.data_total);
   const [selectedIds, setSelectedIds] = useState<number[] | undefined>(defaultValues);

   const handleSearchChange = useDebounce((event: ChangeEvent<HTMLInputElement>) => {
      setTextFilter(event.target.value);
   }, 500);

   const handleOnChange = useCallback(
      (snmpCredentials: SNMPCredential[] | undefined, e: SelectionEventSourceType) => {
         const ids = snmpCredentials?.map((credentials) => credentials.id);
         if (e !== 'rowDataChanged') {
            setSelectedIds(ids);
            onChange(snmpCredentials);
         }
         setSelectedCount(ids?.length);
      },
      [onChange]
   );

   return (
      <Panel
         title="SNMP Credentials"
         className="panel-snmp-credentials"
         subTitle={`${selectedCount ?? 0} of ${data?.data_total ?? 0} selected`}
      >
         <Flex gap={4} flexDir="column">
            <Text>
               The following SNMP Credentials will be tested against all devices found during the
               ping step of the discovery process.
            </Text>
            <Text>
               Select one or more SNMP Credentials. All of the selected credentials will be tested
               against any device found during the Network Discovery process.
            </Text>
            <Flex gap={2} justifyContent={'space-between'}>
               <Input
                  placeholder="Search Credentials"
                  backgroundColor={'white.500'}
                  onChange={handleSearchChange}
                  width={'30%'}
               />
               <Button paddingX={6} onClick={onOpen} variant="outline">
                  Add a new credential
               </Button>
            </Flex>
            <SSDataTable<SNMPCredential>
               height="200px"
               columns={columns}
               rowData={data?.data}
               rowSelectMode="checkbox"
               selectedRows={selectedIds ?? data?.data.map((cred) => cred.id)}
               emptyMessage={
                  success
                     ? data?.data.length === 0
                        ? 'No SNMP Credentials found'
                        : undefined
                     : 'An unknown error occurred'
               }
               onChange={handleOnChange}
               onSort={(data) => {
                  const newFilters: ApiFilter = {
                     ...filters,
                     sort: data.column,
                     dir: data.order,
                  };
                  setFilters(newFilters);
               }}
               sortCol={filters.sort}
               sortDir={filters.dir}
               rowIdKey="id"
            />
            <AddCredentialsModal isOpen={isOpen} onClose={onClose} />
         </Flex>
      </Panel>
   );
}