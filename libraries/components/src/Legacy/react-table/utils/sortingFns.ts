export const sortByIpAddress = (
   ipaddressA: string,
   ipaddressB: string
): 1 | -1 => {
   const normalizedAddressA = ipaddressA
      .split('.')
      .map((part) => part.padStart(3, '0'));
   const normalizedAddressB = ipaddressB
      .split('.')
      .map((part) => part.padStart(3, '0'));
   return normalizedAddressA > normalizedAddressB ? 1 : -1;
};
