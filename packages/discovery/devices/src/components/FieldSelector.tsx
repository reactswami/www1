import { Box, Divider, Flex, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { type InterfaceFormField } from './InterfaceFormModal/types';
import { type FormField as DeviceFormField } from '~/types/deviceForm';

const MotionBox = motion(Box);

type FieldSelectorProps = {
   availableFields: DeviceFormField[] | InterfaceFormField[];
   onAddField: (fieldName: string) => void;
};

export function FieldSelector({ availableFields, onAddField }: FieldSelectorProps) {
   const bgColor = useColorModeValue('gray.50', 'gray.800');

   return (
      <Box>
         <Heading size="md" mb={4}>
            Available Fields
         </Heading>
         <Text fontSize="sm" color="gray.600" mb={4}>
            Select fields to add to your form:
         </Text>
         <Divider mb={6} />

         {availableFields?.length === 0 ? (
            <Box textAlign="center" py={6} bg={bgColor} borderRadius="md">
               <Text color="gray.500">All fields have been added to the form.</Text>
            </Box>
         ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
               {availableFields?.map((field, index) => (
                  <MotionBox
                     key={index}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ duration: 0.2 }}
                  >
                     <Box
                        p={2}
                        borderWidth="1px"
                        borderColor={'var(--chakra-colors-gray-200)'}
                        borderRadius="sm"
                        cursor="pointer"
                        _hover={{ bg: 'var(--chakra-colors-primary-50)', boxShadow: 'md' }}
                        onClick={() => onAddField(field.name)}
                        position="relative"
                        transition="all 0.2s"
                     >
                        <Flex justifyContent="space-between" alignItems="center">
                           <Box>
                              <Text fontWeight="var(--chakra-fontWeights-bold);">
                                 {field.label}
                              </Text>
                           </Box>
                        </Flex>
                     </Box>
                  </MotionBox>
               ))}
            </SimpleGrid>
         )}
      </Box>
   );
}
