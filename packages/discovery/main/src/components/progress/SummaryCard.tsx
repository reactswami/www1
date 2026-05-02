import { Button, Card, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, Box } from '@statseeker/components/Layout';
import { type UseDisclosureReturn } from '@chakra-ui/react';
import  { type DiscoverHistoryDetails } from '@statseeker/api/internal_api/entities';
import { CheckIcon, Cross1Icon, QuestionMarkCircledIcon } from '@statseeker/ui/icons';

export type SummaryCardProps = {
   title: string;
   description?: string;
   status: 'todo' | 'progress' | 'done' | 'error' | 'warning';
   text: string;
   className?: string;
};

export function SummaryCard({
   title,
   description,
   status,
   text,
   className,
}: SummaryCardProps) {
   const modalDisclosure = useDisclosure();

   let cardColor = 'placeholder';
   let textColor: string | undefined = undefined;
   let icon = <Box width={'16px'}></Box>;
   switch (status) {
      case 'progress':
         cardColor = 'blue.100';
         icon = <Spinner size={'xs'} />;
         break;
      case 'done':
         cardColor = 'success';
         textColor = 'white';
         icon = <CheckIcon />;
         break;
      case 'error':
         cardColor = 'error';
         textColor = 'white';
         icon = <Cross1Icon />;
         break;
      case 'warning':
         cardColor = 'warning';
         textColor = 'white';
         icon = <Cross1Icon />;
   }

   return (
      <Card
         textAlign={'center'}
         justifyContent={'space-between'}
         height={'100%'}
         padding={2}
         flexDirection={'column'}
         gap="2"
         background={cardColor}
         borderRadius={'md'}
         color={textColor}
         className={className}
      >
         <Flex
            justifyContent={'space-between'}
            flexGrow={0}
         >
            {description && <Flex title="More Info..." onClick={modalDisclosure.onOpen} _hover={{cursor: 'pointer'}}>
               <QuestionMarkCircledIcon />
            </Flex> }
            {!description && <Box width={'16px'}></Box>}
            <Heading size={'sm'} fontWeight={'normal'}>{title}</Heading>
            {icon}
         </Flex>
         <Text
            fontSize={'xx-large'}
            fontWeight={'bold'}
            justifyContent={'center'}
            flexGrow={1}
         >
            {text}
         </Text>
         {description && <SummaryCardModal title={title} description={description} disclosure={modalDisclosure} /> }
      </Card>
   );
}

function SummaryCardModal({ title, description, disclosure }: { title: string; description: string; disclosure: UseDisclosureReturn }) {
   const { isOpen, onClose } = disclosure;

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent maxWidth={'80vw'} width={'lg'}>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody padding={4} overflowY={'auto'} dangerouslySetInnerHTML={{ __html: description }}></ModalBody>

            <ModalFooter>
               <Button mr={3} onClick={onClose} autoFocus>
                  Close
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}

export type SummaryCardWrapperProps = {
   details: DiscoverHistoryDetails;
   discoverInProgress: boolean;
   mode?: string;
};
