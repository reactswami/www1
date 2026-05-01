import { type SNMPCredential } from '@statseeker/api/internal_api/entities';

export type SNMPCredentialListEntry = Pick<SNMPCredential, 'id' | 'name'> & {
   type: string;
   devices: number;
};

export type SNMPCredentialListEntryFromAPI = Pick<SNMPCredential, 'id' | 'name' | 'version'> & Pick<SNMPCredentialListEntry, 'type'>;

export type AddSNMPCredentialData = Omit<SNMPCredential, 'id'>;

export type GetCredentialsQueryParams = {
   text_filter?: string;
   sort?: string;
   dir?: string;
   limit?: number;
};
