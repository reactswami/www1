import { Button, Flex, Heading } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGeneralStatusAlert } from '..';
import { useInitialSetup } from '~/hooks/useInitialSetup';
import { Routes } from '~/types/routes';
import { toTitleCase } from '~/utils/string';

interface Props {
   children: ReactNode;
   subtitle?: string;
}

export const Layout = ({ children, subtitle }: Props) => {
   const navigate = useNavigate();
   const { pathname } = useLocation();

   const isOnMenuPage =
      pathname === Routes.menu.toString() ||
      pathname === Routes.home.toString();

   const isOnConnectionSetup = pathname === Routes.firstVisit.toString();

   const isOnBasePage = [
      Routes.networkExplorer,
      Routes.organizationExplorer,
      Routes.settings,
   ]
      .map((route) => route.toString())
      .includes(pathname);

   const { isFirstVisit } = useInitialSetup();

   const getLabel = () => {
      if (!isOnMenuPage && !isOnConnectionSetup && !isOnBasePage) {
         return 'back';
      }
      if (isOnBasePage) {
         return 'back to main menu';
      }
      return '';
   };

   const getIcon = () => {
      if (
         (!isOnMenuPage && !isOnConnectionSetup && !isOnBasePage) ||
         isOnBasePage
      ) {
         return <ChevronLeftIcon />;
      }
      return <></>;
   };

   const getLink = () =>
      getLabel() === 'back to main menu' ? navigate(Routes.menu) : navigate(-1);

   return (
      <Flex padding={6} minHeight="100vh" direction="column">
         <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            paddingBottom={2}
         >
            <Flex
               flexGrow={1}
               direction="column"
               gap="sm"
               alignItems={'start'}
               paddingBottom={2}
            >
               <Button onClick={getLink} variant="link" leftIcon={getIcon()}>
                  {getLabel()}
               </Button>
               <Heading size="lg" color={'blue.800'}>
                  Meraki Configuration
               </Heading>
               <Heading size="md" color={'gray.700'}>
                  {toTitleCase(subtitle ?? '')}
               </Heading>
            </Flex>

            {!isFirstVisit && <LayoutGeneralStatusAlert />}
         </Flex>
         <Flex
            as="main"
            direction="column"
            flexGrow={1}
            minWidth={'fit-content'}
         >
            {children}
         </Flex>
      </Flex>
   );
};
