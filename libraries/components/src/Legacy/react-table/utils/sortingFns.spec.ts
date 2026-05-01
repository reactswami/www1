import { sortByIpAddress } from './sortingFns';
describe('sortingFns', () => {
   describe('sort by ipaddress', () => {
      it('should sort the function by ip address', () => {
         const input = [
            '192.168.1.1',
            '192.168.2.3',
            '192.168.1.00',
            '192.168.1.3',
            '22.168.1.3',
            '234.168.1.3',
            '120.168.1.3',
         ];
         const output = [
            '22.168.1.3',
            '120.168.1.3',
            '192.168.1.00',
            '192.168.1.1',
            '192.168.1.3',
            '192.168.2.3',
            '234.168.1.3',
         ];

         expect(input.sort(sortByIpAddress)).toEqual(output);
      });
   });
});
