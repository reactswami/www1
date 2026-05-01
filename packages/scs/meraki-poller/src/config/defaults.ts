import { type Props } from '~/components/FormNetworkConfig';
import { AppDatatype } from '~/types/app';

// Number of retries when doing an API call
export const NUMBER_OF_REQUEST_RETRIES = 3;

// Default polling interval options
export const POLLING_INTERVAL_OPTIONS: Props[] = [
   {
      value: 300,
      label: 'every 5 minutes',
      isSelected: true,
   },
   {
      value: 3600,
      label: 'hourly',
      isSelected: true,
   },
   {
      value: 86400,
      label: 'daily',
      isSelected: true,
   },
];

export const DEFAULT_POLLING_INTERVAL_VALUE = '300';

// Default datatype endpoints collecterd
export const DEFAULT_DATAYPES_VALUES = Object.values(AppDatatype)
   .map((name) => ({
      [name]: true,
   }))
   .reduce((current, previous) => ({ ...current, ...previous }), {});

export const DEFAULT_RATE_LIMIT = 5;

// Page sizes for the tables
export const DEFAULT_PAGE_SIZES = [50, 100];

export const DEFAULT_CUSTOMRULE_NAME = '-';

export const DEFAULT_REFRESH_DATA_TABLE_VIEW_IN_MS = 30_000; // 30 seconds refresh
