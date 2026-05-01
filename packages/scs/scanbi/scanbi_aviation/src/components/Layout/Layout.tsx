import { Button, Flex, Heading } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { environment } from '~/config/environment';
import { Routes } from '~/types/routes';
import { toTitleCase } from '~/utils/string';

interface Props {
   children: ReactNode;
   subtitle?: string;
}

export const Layout = ({ children, subtitle }: Props) => {
   const navigate = useNavigate();
   const { pathname: rawPathname } = useLocation();

   const pathname = environment.baseRouteName
      ? rawPathname.replace(environment.baseRouteName, '')
      : rawPathname;
   const router = useRouter();

   const isOnMenuPage = pathname === Routes.menu.toString() || pathname === Routes.home.toString();

   const isOnBasePage = [
      Routes.lanes,
      Routes.airports,
      Routes.terminals,
      Routes.screeningPoints,
      Routes.equipments,
      Routes.networks,
      Routes.certificates,
   ]
      .map((route) => route.toString())
      .includes(pathname);

   const getLabel = () => {
      if (isOnBasePage) {
         return 'back to main menu';
      }
      return '';
   };

   const getIcon = () => {
      if ((!isOnMenuPage && !isOnBasePage) || isOnBasePage) {
         return <ChevronLeftIcon />;
      }
      return <></>;
   };

   const getLink = () =>
      getLabel() === 'back to main menu' ? navigate({ to: Routes.home }) : router.history.back();

   return (
      <Flex padding={6} minHeight="100vh" direction="column">
         <Flex justifyContent={'space-between'} alignItems={'center'} paddingBottom={2}>
            <Flex flexGrow={1} direction="column" gap="sm" alignItems={'start'} paddingBottom={2}>
               <Button onClick={getLink} variant="link" leftIcon={getIcon()}>
                  {getLabel()}
               </Button>
               <Heading size="lg" color={'primary.500'}>
                  Equipment Manager
               </Heading>
               <Heading size="md" color={'gray.700'}>
                  {toTitleCase(subtitle ?? '')}
               </Heading>
            </Flex>
         </Flex>
         <Flex as="main" direction="column" flexGrow={1}>
            {children}
         </Flex>
      </Flex>
   );
};
