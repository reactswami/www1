import { validate } from './validator';

describe('validator', () => {
   it('should validate integers', () => {
      const valids = ['-1', '-0', '1', '0'];
      const unvalids = ['-180.01', '-81.2', '18.1', 'a'];

      for (const input of valids) {
         expect(validate(input).isInteger()).toBeTruthy();
      }
      for (const input of unvalids) {
         expect(validate(input).isInteger()).toBeFalsy();
      }
   });
   it('should validate longitude', () => {
      const valids = ['-180.00', '-89.99', '90.00', '0.00', '0', '45', '-45', '-180.00', '179.99'];
      const unvalids = ['-180.01', '-181', '181', 'a'];

      for (const input of valids) {
         expect(validate(input).isLongitude()).toBeTruthy();
      }
      for (const input of unvalids) {
         expect(validate(input).isLongitude()).toBeFalsy();
      }
   });
   it('should validate latitude', () => {
      const valids = ['-90.00', '-89.99', '90.00', '0.00', '-0.00', '89.99', '45', '-2', '0'];
      const unvalids = ['-90.01', '-91', '91', 'a', '-123'];

      for (const input of valids) {
         expect(validate(input).isLatitude()).toBeTruthy();
      }
      for (const input of unvalids) {
         expect(validate(input).isLatitude()).toBeFalsy();
      }
   });
   it('should validate IP addresses', () => {
      const validAddresses = [
         '230.252.44.235',
         '232.40.6.235',
         '173.182.70.197',
         '228.5.172.78',
         '186.225.130.123',
         '58.43.99.219',
         '86.171.193.154',
         '186.124.207.87',
         '179.140.203.80',
         '225.54.244.105',
      ];

      for (const address of validAddresses) {
         expect(validate(address).isIpAddress()).toBeTruthy();
      }
      const unvalidAddress = [
         '230.252.44.256',
         '232.40.',
         '173.182.70',
         '-228.5.172.78',
         'abc.225.130.123',
         '58.256.99.219',
         '86.171.256.154',
         '186.124.207.3000',
         '00.140.203.80',
         '.54.244.105',
      ];

      for (const address of unvalidAddress) {
         expect(validate(address).isIpAddress()).toBeFalsy();
      }
   });
   it('should validate the netmask format', () => {
      const values: [string, boolean][] = [
         ['255.255.255.0', true],
         ['254.255.255.0', true],
         ['abc', false],
         ['123', false],
         ['0.0.0.0', true],
         ['255.255.255.255', true],
         ['0.0.0.0', true],
         ['255.255.255.255.255', false],
      ];

      for (const [value, result] of values) {
         expect(validate(value).isIpAddress()).toBe(result);
      }
   });
});
