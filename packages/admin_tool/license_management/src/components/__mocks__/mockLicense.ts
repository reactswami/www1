import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';

export const mockLicense: APILicense = {
   id: 1,
   version: '1.0',
   server_id: 'server-123',
   hardware_id: 'hw-456',
   tier: 'Enterprise',
   licenced: true,
   perpetual: false,
   not_after: 1750000000,
   not_before: 1700000000,
   features: [],
};

export const nullLicense: APILicense = {
   id: 2,
   version: '1.0',
   server_id: null,
   hardware_id: '',
   tier: null,
   licenced: false,
   perpetual: false,
   not_after: null,
   not_before: null,
   features: [],
};
