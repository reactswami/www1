import { TypeAheadSelectInput } from '@statseeker/components/Legacy/TypeAheadSelectInput';
import { useQuery } from '@tanstack/react-query';
import { getCredentialsQuery } from '~/lib/ReactQuery';

export function CredentialsTypeahed({ onChange, defaultValue }: { onChange: (arg: number) => void; defaultValue?: number }) {
   const { data, isLoading, isSuccess, isError } = useQuery(getCredentialsQuery()) ?? [];

   let defaultOption = undefined;
   const defaultData = data?.data.find((d) => d.id === defaultValue);
   if (defaultData && isSuccess) {
      defaultOption = {
         name: defaultData.name,
         value: defaultData.id.toString(),
      };
   }
   return (
      <TypeAheadSelectInput
         defaultValue={defaultOption}
         onChange={(credential) => onChange(Number(credential))}
         isLoading={isLoading}
         defaultIsName={true}
         isSuccess={isSuccess}
         isError={isError}
         options={
            data?.data.map((credential) => ({
               name: credential.name,
               value: credential.id.toString(),
            })) ?? []
         }
         label={'SNMP Credential'}
         placeholder="Select..."
      />
   );
}
