import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';
import { type AlertVariantType } from '@statseeker/components/Feedback/Alert';

interface TimePart {
   value: number;
   unit: 'day' | 'hour' | 'minute' | 'second';
   pretty: string;
}

/**
 * Calculate the number of days between two dates.
 *
 * @param from The start date
 * @param to The end date
 *
 * @returns The number of days between the two dates
 */
export const timeDifference = (
   from: Date,
   to: Date,
   precision: number = 1
): {
   parts: TimePart[];
   diffMs: number;
   pretty: string;
   negative: boolean;
} => {
   const diffMs = to.getTime() - from.getTime(); // signed
   const absMs = Math.abs(diffMs);

   let remaining = absMs;

   const units: { unit: TimePart['unit']; ms: number }[] = [
      { unit: 'day', ms: 1000 * 60 * 60 * 24 },
      { unit: 'hour', ms: 1000 * 60 * 60 },
      { unit: 'minute', ms: 1000 * 60 },
      { unit: 'second', ms: 1000 },
   ];

   const parts: TimePart[] = [];

   for (const { unit, ms } of units) {
      if (parts.length >= precision) break;
      const value = Math.floor(remaining / ms);
      if (value > 0 || parts.length > 0) {
         parts.push({
            value,
            unit,
            pretty: `${value} ${unit}${value !== 1 ? 's' : ''}`,
         });
         remaining -= value * ms;
      }
   }

   // If all zero (e.g. same date), add "0 seconds"
   if (parts.length === 0) {
      parts.push({ value: 0, unit: 'second', pretty: '0 seconds' });
   }

   const pretty = parts.map((p) => p.pretty).join(' ');
   const negative = diffMs < 0;

   return { parts, diffMs, pretty, negative };
};

/**
 *
 * Determine the status of a license based on its properties.
 *
 * @param license The license object to evaluate
 *
 * @returns An object containing the status and message
 *
 */
export const licenseStatus = (
   license?: APILicense,
   errmsg?: string
): { status: AlertVariantType; message: string } => {
   if (errmsg) {
      return {
         status: 'error',
         message: errmsg,
      };
   }

   if (!license) {
      return {
         status: 'error',
         message: 'Failed to load license',
      };
   }

   if (!license.licenced) {
      return {
         status: 'warning',
         message: 'A license is required to continue. Use the "Actions" menu to install a license.',
      };
   }

   if (!license.perpetual && license.not_after != null) {
      const timediff = timeDifference(new Date(), new Date(license.not_after * 1000));

      if (timediff.negative) {
         return {
            status: 'error',
            message: `License expired ${timediff.pretty} ago`,
         };
      }

      if (timediff.diffMs < 86400 * 30 * 1000) {
         return {
            status: 'warning',
            message: `License expires in ${timediff.pretty}`,
         };
      }
   }

   return {
      status: 'success',
      message: 'License is active',
   };
};
