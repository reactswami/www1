import { TypeAheadSelectInput } from '@statseeker/components';
import { useQuery } from '@tanstack/react-query';
import { networkQueryOptions } from '~/features/networks/queryOptions';

export function NetworkTypeahead({
   defaultValue,
   onChange,
}: {
   defaultValue?: number | undefined;
   onChange: (value: string) => void;
}) {
   const { data: networks, isLoading, isSuccess, isError } = useQuery(networkQueryOptions.get());
   let selectedValue;

   if (defaultValue) {
      const foundNetwork = networks?.data.find((network) => network.id === defaultValue);
      selectedValue = {
         value: foundNetwork?.id.toString() || '',
         name: foundNetwork?.scannerNetworkTitle || '',
      };
   }

   return (
      <TypeAheadSelectInput
         label="Network"
         defaultIsName={true}
         onChange={onChange}
         isLoading={isLoading}
         isSuccess={isSuccess}
         isError={isError}
         options={
            networks?.data.map((network) => ({
               value: network.id.toString(),
               name: network.scannerNetworkTitle,
            })) || []
         }
         defaultValue={selectedValue}
      />
   );
}
