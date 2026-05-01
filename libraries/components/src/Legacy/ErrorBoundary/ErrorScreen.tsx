import { WarningIcon } from '@chakra-ui/icons';
import { theme } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const ErrorScreen = ({ message }: { message: string }) => {
   return (
      <Container>
         <WarningIcon />
         <p>{message}</p>
      </Container>
   );
};

const Container = styled.div`
   display: flex;
   align-items: center;
   direction: row;
   gap: 1rem;
   padding: 2rem;
   border: 1px solid ${theme.colors.gray[300]};
   border-radius: 0.25rem;
   background: ${theme.colors.gray[200]};
   margin: 1rem;
`;
