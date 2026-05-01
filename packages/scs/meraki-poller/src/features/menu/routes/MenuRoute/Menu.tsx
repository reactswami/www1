import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { theme } from '@statseeker/ui/theme';
import { Link } from 'react-router-dom';
import { Layout } from '~/components';
import { Routes } from '~/types';

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
      font-weight: bold;
      color: ${theme.colors.primary[700]};
   }
`;

export const includedRoutes = [
   { title: 'General Settings', link: Routes.settings },
   {
      title: 'Organizations',
      link: Routes.organizationExplorer,
   },
   { title: 'Networks', link: Routes.networkExplorer },
];

export const Menu = () => {
   return (
      <Layout subtitle="Menu">
         <Flex gap="xs" paddingTop={4} direction="column">
            {includedRoutes.map(({ link, title }, index) => (
               <StyledLink key={index} to={link}>
                  {title}
               </StyledLink>
            ))}
         </Flex>
      </Layout>
   );
};
