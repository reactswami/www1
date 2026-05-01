import { Circle, Flex, Tooltip } from '@chakra-ui/react';
import {
   CheckIcon,
   CircleBackslashIcon,
   QuestionMarkIcon,
} from '@statseeker/ui/icons';
import { type ReactNode } from 'react';

interface Props {
   status: 'up' | 'down';
   isDisabled: boolean;
}

export const TableStatusTag = ({ status, isDisabled }: Props) => {
   const { tooltip, circleColor, color, content } = getStatusProps(
      isDisabled ? 'disabled' : status
   );
   return (
      <Tooltip label={tooltip}>
         <Flex justifyContent={'center'} alignItems="center">
            <Circle background={circleColor} size={4} padding={1} color={color}>
               {content}
            </Circle>
         </Flex>
      </Tooltip>
   );
};

export const getStatusProps = (
   status: 'disabled' | 'up' | 'down' | 'unknown' = 'unknown'
): {
   tooltip: string;
   circleColor: string;
   color?: string;
   content: ReactNode | string;
} => {
   switch (status) {
      case 'unknown':
      case null:
         return {
            tooltip: 'unknown',
            circleColor: 'gray.300',
            color: 'gray.600',
            content: <QuestionMarkIcon />,
         };
      case 'up':
         return {
            tooltip: 'up',
            circleColor: 'green.500',
            color: 'green.300',
            content: <CheckIcon />,
         };
      case 'down':
         return {
            tooltip: status,
            circleColor: 'red.300',
            color: 'red.600',
            content: '!',
         };
      case 'disabled':
         return {
            tooltip: 'disabled',
            circleColor: 'orange.300',
            color: 'orange.600',
            content: <CircleBackslashIcon />,
         };
   }
};
