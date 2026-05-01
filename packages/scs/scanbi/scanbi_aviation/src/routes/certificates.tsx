import {
   Box,
   Button,
   Flex,
   Grid,
   GridItem,
   Text,
   Heading,
   useColorModeValue,
   VStack,
} from '@chakra-ui/react';
import { CheckCircledIcon, DownloadIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Layout } from '~/components';
import { FileUploader } from '~/features/certificate/FileUploader';
import { useFetchEntity } from '~/hooks';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/certificates')({
   component: CertificatesRoute,
});

function CertificatesRoute() {
   const borderColor = useColorModeValue('gray.200', 'gray.600');
   const { data } = useFetchEntity(ENTITY_TYPE.CERTIFICATES);
   const hasNoData =
      ((data && data[0].client_cert === '') || (data && data[0].client_key === 'unset')) ?? true;
   const [showUpload, setShowUpload] = useState(hasNoData);

   useEffect(() => {
      if (data) {
         setShowUpload(hasNoData);
      }
   }, [data, hasNoData]);

   const downloadTextFile = (content: string) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'client_cert';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
   };

   return (
      <Layout subtitle="CT Certificates">
         {showUpload ? (
            <FileUploader
               closeScheduler={() => setShowUpload(false)}
               showCancelButton={hasNoData === false}
            />
         ) : (
            <>
               <Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
                  <GridItem
                     colSpan={{ base: 12, md: 6 }}
                     justifyContent={'center'}
                     alignItems={'center'}
                  >
                     <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.3s"
                        _hover={{ boxShadow: 'lg' }}
                        height="100%"
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDirection={'column'}
                     >
                        <CertificateStatus
                           text="Public Certificate"
                           status={data && data[0].client_cert === '' ? 'not-set' : 'set'}
                        />
                     </Box>
                  </GridItem>
                  <GridItem
                     colSpan={{ base: 12, md: 6 }}
                     justifyContent={'center'}
                     alignItems={'center'}
                  >
                     <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.3s"
                        _hover={{ boxShadow: 'lg' }}
                        height="100%"
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDirection={'column'}
                     >
                        <CertificateStatus
                           text="Private Certificate"
                           status={data && data[0].client_key === 'set' ? 'set' : 'not-set'}
                        />
                     </Box>
                  </GridItem>
               </Grid>
               <Flex mt={5} justifyContent={'flex-end'} w={'100%'} gap={2}>
                  {data && data[0].client_cert ? (
                     <Flex justifyContent={'center'} paddingBottom={2}>
                        <Button
                           onClick={() => downloadTextFile(data[0].client_cert)}
                           variant={'outline'}
                           rightIcon={<DownloadIcon />}
                        >
                           Download client certificate
                        </Button>
                     </Flex>
                  ) : null}
                  <Button onClick={() => setShowUpload(true)}>Upload</Button>
               </Flex>
            </>
         )}
      </Layout>
   );
}

export function CertificateStatus({ text, status }: { text: string; status: 'set' | 'not-set' }) {
   return (
      <Box p={4}>
         <VStack>
            <Flex>
               <VStack>
                  {status === 'set' ? (
                     <CheckCircledIcon color="green" width={24} height={24} />
                  ) : (
                     <InfoCircledIcon width={24} height={24} />
                  )}
                  <Heading size="md" fontWeight="semibold">
                     {text}
                  </Heading>
                  {status === 'set' ? <Text>Uploaded</Text> : <Text>Not Uploaded</Text>}
               </VStack>
            </Flex>
         </VStack>
      </Box>
   );
}
