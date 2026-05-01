import { Flex, Progress, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { CheckIcon, GearIcon } from '@radix-ui/react-icons';
import { Loader } from '@statseeker/components';
import { theme } from '@statseeker/ui/theme';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { Layout } from '~/components';
import { useFetchAllEntities } from '~/hooks/useFetchAllEntites';
import { type AllEntities, Routes } from '~/types';

type IncludedRoute = {
   title: string;
   link: string;
   objectName: keyof Omit<AllEntities, 'equipment_type'>;
};

const StyledLink = styled(Link)`
   width: 20rem;
   padding: 0.5rem 1rem;
   transition: all 200ms ease-in;
   position: relative;
   font-size: ${theme.textStyles.body.fontSize};
   border: 1px solid transparent;
   border-radius: 0.5rem;
   ::before {
      transition: opacity 200ms ease-in;
      content: '>';
      position: absolute;
      left: 0.5rem;
      opacity: 0;
   }
   :hover {
      ::before {
         opacity: 1;
      }
      background-color: ${theme.colors.white};
      padding-left: 1.5rem;
      font-weight: 700;
      color: ${theme.colors.primary[700]};
   }
`;

// order must not change
export const includedRoutes: IncludedRoute[] = [
   { title: 'Airport', link: Routes.airports, objectName: 'airport' },
   { title: 'Terminal', link: Routes.terminals, objectName: 'terminal' },
   {
      title: 'Screening Point',
      link: Routes.screeningPoints,
      objectName: 'screening_point',
   },
   { title: 'Lane', link: Routes.lanes, objectName: 'lane' },
   {
      title: 'Equipment',
      link: Routes.equipments,
      objectName: 'device_equipment',
   },
];

export const systemRoutes: IncludedRoute[] = [
   { title: 'Scanner Networks', link: '/networks', objectName: 'networks' },
   { title: 'CT Certificates', link: '/certificates', objectName: 'certificates' },
];

const keysToCheck = ['airport', 'terminal', 'screening_point', 'lane', 'device_equipment'];
function calculateProgress(obj: { [key: string]: any[] } | undefined) {
   if (!obj) {
      return 100; // Return 100 if the object is undefined
   }

   const relevantKeys = keysToCheck.filter((key) => key in obj);
   const totalKeys = relevantKeys.length;

   if (totalKeys === 0) {
      return 0; // Avoid division by zero
   }

   const nonEmptyArraysCount = relevantKeys.filter((key) => obj[key].length > 0).length;

   return (nonEmptyArraysCount / totalKeys) * 100;
}

function findNextItemInWizard(obj: any) {
   if (obj === null || typeof obj === 'undefined') {
      return null;
   }

   for (const key of keysToCheck) {
      if (Array.isArray(obj[key]) && obj[key].length === 0) {
         return key;
      }
   }
   return null; // If no empty array is found
}

export const Menu = () => {
   const { isLoading, data } = useFetchAllEntities();
   const progress = calculateProgress(data);
   const isComplete = progress === 100;
   const nextItemName = findNextItemInWizard(data);
   return isLoading ? (
      <Loader color="primary.500" />
   ) : (
      <Layout subtitle="Menu">
         <Flex gap="xs" paddingTop={4} direction="column">
            {isComplete ? (
               <>
                  {includedRoutes.map(({ link, title }, index) => (
                     <StyledLink key={index} to={link}>
                        {title}
                     </StyledLink>
                  ))}
                  <Flex borderTop="1px solid" borderColor="gray.100" marginY={4} />
                  {systemRoutes.map(({ link, title }, index) => (
                     <StyledLink key={index} to={link}>
                        {title}
                     </StyledLink>
                  ))}
               </>
            ) : (
               <>
                  <Flex
                     marginBottom={'30px'}
                     flexDir={'column'}
                     border={'solid'}
                     borderWidth={'1px'}
                     borderColor={'gray.100'}
                     borderRadius={'sm'}
                  >
                     <Flex padding={'20px'} flexDir={'column'}>
                        <>
                           <Text>Get Started</Text>
                           <Flex alignItems={'center'} gap={'5px'}>
                              <Progress
                                 colorScheme="green"
                                 value={progress}
                                 width={'100%'}
                                 borderRadius={'10px'}
                              />
                              <Text>{`${progress}%`}</Text>
                           </Flex>
                        </>
                     </Flex>
                     {includedRoutes.map((route) => (
                        <MenuItem
                           key={route.objectName}
                           text={route.title}
                           link={route.link}
                           objectName={route.objectName}
                        />
                     ))}
                     <Flex borderTop="1px solid" borderColor="gray.100" />
                     {systemRoutes.map((route) => (
                        <Link key={route.objectName} to={route.link}>
                           <Flex borderTop={'1px'} borderColor={'gray.100'} alignItems={'center'}>
                              <Flex
                                 borderRight={'1px'}
                                 borderColor={'gray.100'}
                                 color={'gray.100'}
                                 padding={5}
                              >
                                 <GearIcon width={30} height={30} />
                              </Flex>
                              <Flex borderColor={'gray.100'} padding={'10px'}>
                                 {route.title}
                              </Flex>
                           </Flex>
                        </Link>
                     ))}
                  </Flex>
               </>
            )}
         </Flex>
      </Layout>
   );

   function MenuItem({
      text,
      objectName,
      link,
   }: {
      text: string;
      objectName: keyof Omit<AllEntities, 'equipment_type'>;
      link: string;
   }) {
      const isCurrentItem = objectName?.toLowerCase() === nextItemName?.toLowerCase();
      const hasItems = data ? data[objectName].length > 0 : null;

      return hasItems ? (
         <Link to={link}>
            <MenuItemWrapper iconColor="green">
               {text === 'equipment' ? text : `${text}s`}
            </MenuItemWrapper>
         </Link>
      ) : isCurrentItem ? (
         <Link to={link}>
            <MenuItemWrapper
               fontWeight="bold"
               textColor="var(--chakra-colors-primary-500);"
            >{`Create ${text}`}</MenuItemWrapper>
         </Link>
      ) : (
         <MenuItemWrapper>{`Create ${text}`}</MenuItemWrapper>
      );
   }
};

function MenuItemWrapper({
   children,
   iconColor = 'gray.100',
   textColor,
   fontWeight = 'normal',
}: {
   children: React.ReactNode;
   iconColor?: string;
   textColor?: string;
   fontWeight?: string;
}) {
   return (
      <Flex borderTop={'1px'} borderColor={'gray.100'} alignItems={'center'}>
         <Flex borderRight={'1px'} borderColor={'gray.100'} color={iconColor} padding={5}>
            <CheckIcon width={30} height={30} />
         </Flex>
         <Flex borderColor={'gray.100'} padding={'10px'} color={textColor} fontWeight={fontWeight}>
            {children}
         </Flex>
      </Flex>
   );
}
