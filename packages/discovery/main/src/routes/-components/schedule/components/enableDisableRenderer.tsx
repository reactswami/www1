import { Box, Flex, Tooltip } from '@chakra-ui/react';
import OnlineIcon from '@statseeker/components/Legacy/OnlineIcon/OnlineIcon';
import { type CellRendererProps } from '@statseeker/components/Legacy/SSDataTable';

const EnableDisableRender = ({ data: { enabled } }: CellRendererProps) => {
   return (
      <Flex justifyContent={'flex-start'} height={'100%'}>
         <Tooltip label={enabled ? 'Enabled' : 'Disabled'} alignSelf={'center'} placement={'bottom-start'}>
            <Box
               alignSelf={'center'}
               display={'flex'}
               alignItems={'center'}
               width={'100%'}
               height={'100%'}
               color={enabled ? 'green.500' : 'orange.300'}
            >
               <OnlineIcon />
            </Box>
         </Tooltip>
      </Flex>
   );
};

export default EnableDisableRender;
