import { Box, Heading } from '@statseeker/components/Layout';

export function NavBar() {
   return (
      <Box
         as='header'
         position={'fixed'}
         width="100%"
         height="var(--app-bar-height)"
         backgroundColor="primary.500"
         color=" #FFF"
         textAlign="center"
         overflow="auto"
         z-index="100"
         top={0}
      >
         <Box
            position={'absolute'}
            height={'var(--app-bar-height)'}
            padding={11}
            display="flex"
            alignItems="center"
            maxWidth="200px"
            minWidth="200px"
         >
            <img
               src="/img/logo_light.svg"
               style={{
                  height: '30px',
                  width: '100%',
               }}
            />
         </Box>
         <Heading
            fontSize="18px"
            margin={'auto'}
            height={'var(--app-bar-height)'}
            lineHeight={'var(--app-bar-height)'}
         >
            Network Discovery
         </Heading>
      </Box>
   );
}
