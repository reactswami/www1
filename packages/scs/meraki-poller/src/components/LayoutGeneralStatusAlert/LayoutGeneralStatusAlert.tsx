import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { getGlobalConfig } from '~/api';
import { DEFAULT_REFRESH_DATA_TABLE_VIEW_IN_MS } from '~/config/defaults';
import { queryKeys } from '~/lib/ReactQuery';
import { type APIGlobalSchema } from '~/types/api';
import { Routes } from '~/types/routes';

export const LayoutGeneralStatusAlert = () => {
   const navigate = useNavigate();
   const { data } = useQuery<AxiosResponse<APIGlobalSchema>>({
      queryKey: queryKeys.layoutAlert,
      // Note that here we're not invaliding anything...
      // This will always be refetching every 30 seconds. If it happened that you were doing something while it refetch, it would create all sort of weird behaviors.
      // Since we're only using this to display the 'main' alert at the top of the application, we don't need to make it subscribe to anything really.
      queryFn: getGlobalConfig,
      refetchInterval: DEFAULT_REFRESH_DATA_TABLE_VIEW_IN_MS,
   });
   if (!data) {
      return null;
   }

   return (
      <>
         {data.data.disable_polling === true && (
            <Alert
               status="warning"
               flexGrow={0}
               alignSelf={'center'}
               flexBasis={'auto'}
               width={'auto'}
               background="yellow.50"
               border="1px"
               borderColor="yellow.300"
               borderRadius="md"
            >
               <AlertIcon />
               <AlertTitle>Meraki poller disabled globally</AlertTitle>
               <AlertDescription>
                  <Button
                     variant={'outline'}
                     onClick={() => navigate(Routes.settings)}
                     rightIcon={<ChevronRightIcon />}
                  >
                     Settings
                  </Button>
               </AlertDescription>
            </Alert>
         )}
         {data?.data.is_polling === false &&
            data?.data.api_key &&
            data?.data.disable_polling == false && (
               <Alert
                  status="error"
                  flexGrow={0}
                  alignSelf={'center'}
                  flexBasis={'auto'}
                  width={'auto'}
                  background="red.50"
                  border="1px"
                  borderColor="red.300"
                  borderRadius="md"
               >
                  <AlertIcon />
                  <AlertTitle>{data?.data.down_message}</AlertTitle>
                  <AlertDescription>
                     <Button
                        variant={'outline'}
                        onClick={() => navigate(Routes.settings)}
                        rightIcon={<ChevronRightIcon />}
                     >
                        Settings
                     </Button>
                  </AlertDescription>
               </Alert>
            )}
         {data?.data.is_polling === true &&
            data?.data.is_exceeded === true &&
            data?.data.api_key &&
            data?.data.disable_polling == false && (
               <Alert
                  status="error"
                  flexGrow={0}
                  alignSelf={'center'}
                  flexBasis={'auto'}
                  width={'auto'}
                  background="red.50"
                  border="1px"
                  borderColor="red.300"
                  borderRadius="md"
               >
                  <AlertIcon />
                  <AlertTitle>{data?.data.exceeded_message}</AlertTitle>
               </Alert>
            )}
      </>
   );
};
