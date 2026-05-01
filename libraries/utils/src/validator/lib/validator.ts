/**
 * Validation on a value
 * @param value the value to test
 * @example validate(123).isLatitude() // => false
 */
export function validate(value: string) {
   return {
      isInteger(): boolean {
         const regExp = /^-?[0-9]*$/;
         return regExp.test(value);
      },
      isIpAddress(): boolean {

         // IPv6: must match colon-hex pattern before trusting URL parsing
         const isIPv6Pattern = /^[\da-f]{0,4}(?::[\da-f]{0,4}){2,7}$/i.test(value);
         if (isIPv6Pattern) {
            try {
               const url = new URL(`https://[${value}]`);
               const parsed = url.hostname.slice(1, -1); // strip brackets         
               if (parsed.toLowerCase() === value.toLowerCase()) return true;
               // eslint-disable-next-line no-empty
            } catch { }
         }

         // IPv4: must be exactly 4 dot-separated decimal octets (0–255), no hostnames
         const isIPv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(value);
         if (isIPv4Pattern) {
            try {
               const url = new URL(`https://${value}`);
               if (url.hostname === value) return true;
               // eslint-disable-next-line no-empty
            } catch { }

         }

         return false;
      },
      isLatitude(): boolean {
         const regexExp = /^-?([0-8]?[0-9]|90)(\.[0-9]*)?$/;
         if (Number(value) > 90 || Number(value) < -90) {
            return false;
         }
         return regexExp.test(value);
      },
      isLongitude(): boolean {
         if (Number(value) > 180 || Number(value) < -180) {
            return false;
         }
         const regexExp = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]*)?$/;
         return regexExp.test(value);
      },
      isDeviceName(): boolean {
         const regexExp = /[^a-zA-Z0-9-._]/;
         // If regex gets updated, we need to update the misc_valid_device_name validator in utils/misc/net.c
         return regexExp.test(value) === false;
      },
      isIPv6Prefix(): boolean {
         if (Number(value) >= 0 && Number(value) <= 128) {
            return true;
         }
         return false;
      }
   };
}
