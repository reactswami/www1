import { Flex, Tag } from '@chakra-ui/react';

interface Props {
   servicesString: string; // Services are return as a comma separated string (service1, service2 ...)
}

export const TableServiceTag = ({ servicesString }: Props) => {

   const services = servicesString
      .split(',')
      .filter((service) => service.length > 0);
   const hasServices = services.length > 0;

   if (!hasServices) {
      return (
         <>
            <Tag size="sm" textTransform="uppercase">
               None
            </Tag>
         </>
      );
   }

   return (
      <Flex gap="sm" paddingLeft={2}>
         {services.map((service, idx) => (
            <Tag size="sm" key={idx} textTransform="uppercase">
               {service}
            </Tag>
         ))}
      </Flex>
   );
};
