import { type SNMPCredential } from '@statseeker/api/internal_api/entities';

// Default form values for an 'add' action
export const SNMPCredentialsFormDefaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
   version: 2,
};
