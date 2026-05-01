// ============================================================================
// NavCard.tsx - Main navigation card component
// ============================================================================

import { Flex } from '@statseeker/components/Layout/Flex';
import { Heading, Text } from '@statseeker/components/Typography';
import { ActionButton, ActionButtonGroup } from './ActionButtonGroup';
import { NavCardContainer } from './NavCardContainer';
import { NavStatus } from './NavStatsus';
import { type NavCardInternalProps, type ActionButtonProps, type NavCardProps, type NavCardWithActionButtons, BUILDER_KEY } from './type';

/**
 * Type guard to check if props has an array of action buttons
 * @param props - NavCard props to check
 * @returns True if props contains actionButtons array
 */
function hasActionButtons(props: NavCardProps): props is NavCardWithActionButtons {
   return 'actionButtons' in props && Array.isArray(props.actionButtons);
}

/**
 * Type guard to check if props has a single action button
 * @param props - NavCard props to check
 * @returns True if props contains a single actionButton
 */
function hasSingleActionButton(props: NavCardProps): props is NavCardWithActionButtons {
   return 'actionButtons' in props && !Array.isArray(props.actionButtons);
}

/**
 * Main navigation card component
 * Displays a card with icon, title, description, and action buttons
 * Supports multiple layouts and states (loading, disabled, etc.)
 * 
 * @param props - Card configuration
 * @returns Navigation card element or null if not visible
 * 
 * @example
 * // Simple card with link
 * <NavCard
 *   text="Settings"
 *   description="Manage your preferences"
 *   icon={<SettingsIcon />}
 *   cardAction="/settings"
 * />
 * 
 * @example
 * // Card with action buttons
 * <NavCard
 *   text="Network Discovery"
 *   description="Scan the network"
 *   icon={<SearchIcon />}
 *   actionButtons={[
 *     { buttonText: "Start", buttonAction: () => start() },
 *     { buttonText: "Configure", linkTo: "/config" }
 *   ]}
 * />
 * 
 * @example
 * // Card with loading state
 * <NavCard
 *   text="Processing"
 *   header={<Spinner />}
 *   status="active"
 *   actionButtons={[
 *     { buttonText: "Stop", buttonAction: () => stop(), type: "warning" }
 *   ]}
 * />
 */
export function NavCard(props: NavCardProps) {

   // Component will be used across all the apps and to have it standardized with its usage,
   // its imperative to create it always using the factory so there is no different implementation
   // of layout is ever found anywhere.
   if (!(props as NavCardInternalProps)[BUILDER_KEY]) {
      throw new Error('NavCard must be created through NavBuilder');
   }
   const { className, cardAction } = props;
   const { text, description, icon, header, footer, status, statusText, actionButtons, disable } = props;
   const isVisible = props.visible ?? true;

   return <>
      {isVisible &&
         <NavCardContainer
            className={`nav-card ${className ?? ''}`}
            cardAction={cardAction}
            disable={disable}
         >
            <Flex position='relative' direction={'column'} flex={1} alignItems={'center'} gap={4} justifyContent={'center'}>
               {status &&
                  <NavStatus status={status} text={statusText} />
               }
               {header}
               {icon}
               <Heading size="md">{text}</Heading>
               {description && (
                  <Text justifyContent="center">{description}</Text>
               )}
               {hasSingleActionButton(props) && props?.actionButtons &&
                  <ActionButton {...(actionButtons as ActionButtonProps)} />
               }
               {hasActionButtons(props) && props.actionButtons && (
                  <ActionButtonGroup buttons={props.actionButtons} />
               )}
               {footer}
            </Flex>
         </NavCardContainer>
      }
   </>;
}
