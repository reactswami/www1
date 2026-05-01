import { Box } from '@chakra-ui/react';
import { Copy } from '@statseeker/components/Data/Copy';
import { Flex } from '@statseeker/components/Layout/Flex';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import { Text } from '@statseeker/components/Typography/Text';

interface LicenseMetadataItemProps {
   label: string;
   value: string | string[] | null;
   title?: string;
   copy?: boolean;
}

export const LicenseMetadataItem = (props: LicenseMetadataItemProps) => {
   const value = props.value || 'N/A';

   const dataValue = (
      <Flex flexDir={'column'} gap={2} alignItems={'flex-start'}>
         {Array.isArray(value) ? (
            value.map((v, index) => <Text key={index}>{v}</Text>)
         ) : (
            <Text>{value}</Text>
         )}
      </Flex>
   );

   return (
      <FormLabel label={props.label}>
         <Tooltip label={props.title}>
            <Box fontWeight={'normal'} textTransform={'none'} fontSize={'medium'} mt={2}>
               {props.copy ? <Copy text={Array.isArray(value) ? value.join(',') : value}>{dataValue}</Copy> : dataValue}
            </Box>
         </Tooltip>
      </FormLabel>
   );
};
