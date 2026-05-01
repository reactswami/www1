import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { type ReactNode } from 'react';

export interface AdminLayoutProps {
   /** The react component to render as the page body. Note that this is typically a `Page` component. */
   children: ReactNode;
   /** The primary page title, mandatory. */
   title: string;
   /** Optional page sub-title, shown under the primary title. */
   subtitle?: string;
   /** Optional button to show in the top right as page-level navigation */
   buttonComponent?: ReactNode;
   /** Optional to set where the back to back button goes */
   backButtonLink?: string;
   /** If provided this will be shown before the back button link */
   customBackButtonComponent?: ReactNode;
   /** Optional prop to control the initial setup state */
   isInitialSetup?: boolean;
   // optional prop to control the height
   height?: string;
}

/**
 * This component is the standard for all Admin Tool configuration-style pages.
 *
 * It handles page title, subtitle, and page-level navigation button.
 *
 * Additionally it emulates the app bar and admin tool in development mode.
 */
export const AdminLayout = ({ children, title, height = "100vh", ...props }: AdminLayoutProps) => {
   // @ts-ignore
   if (import.meta.env.MODE === 'development') {
      return (
         // This component simulate the top navbar and the side bar of the admin panel
         <Flex height={'100vh'} flexDir={'column'}>
            <Flex backgroundColor="primary.500" maxHeight={'66px'} flex={1}></Flex>
            <Flex height='calc(100vh-66px)' flex={1}>
               <Flex minWidth={'210px'} backgroundColor="gray.500"></Flex>
               <AdminContent title={title} {...props}>
                  {children}
               </AdminContent>
            </Flex>
         </Flex>
      );
   }
   return (
      <Flex flexGrow={1} height={height} paddingTop={props?.isInitialSetup ? 'var(--app-bar-height)' : '0'}>
         <AdminContent title={title} {...props}>
            {children}
         </AdminContent>
      </Flex>
   );
};

const AdminContent = ({ children, title, ...props }: AdminLayoutProps) => {
   return (
      <Flex width="100%" direction="column" padding={6} background={'background.500'}>
         <Flex
            paddingTop={2}
            flexDir={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            marginBottom={4}
         >
            <Flex flexDir={'column'} alignItems={'start'}>
               {renderBackButton(props)}
               <Heading as="h1">{title}</Heading>
               <Heading size="md" color={'gray.600'}>
                  {props.subtitle}
               </Heading>
            </Flex>
            {props.buttonComponent}
         </Flex>
         {children}
      </Flex>
   );
};

function renderBackButton({
   customBackButtonComponent,
   backButtonLink,
}: Pick<AdminLayoutProps, 'customBackButtonComponent' | 'backButtonLink'>) {
   return customBackButtonComponent ? (
      customBackButtonComponent
   ) : backButtonLink ? (
      <Link to={backButtonLink}>
         <Button variant="link" leftIcon={<ChevronLeftIcon />}>
            Back to main menu
         </Button>
      </Link>
   ) : null;
}
