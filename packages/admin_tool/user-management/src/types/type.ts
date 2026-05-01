import { type getUserSyncFields, type UserSyncExecuteOptions } from '@statseeker/api/internal_api/entities/user_sync/type';
import { type addUserSyncAuthFields, type getUserSyncAuthFields } from '@statseeker/api/internal_api/entities/user_sync_auth';

export const dirTypes = ['ad'] as const;
export type DirType = (typeof dirTypes)[number];

export type PolicyConfig = getUserSyncFields;


export type UserGroupSyncList = {
   include_groups: string[];
   include_users: string[];
   exclude_users: string[];
};


export type UserAuthConfig = {
   // Common fields
   AUTHMETHOD: string;
   PRODUCT: string;
   // LDAP fields
   LDAP_SERVER?: string;
   LDAP_PORT?: string;
   LDAP_BASE_DN?: string;
   LDAP_SECURE_MODE?: string;
   LDAP_CERTIFICATE?: string;
   LDAP_BIND_DN?: string;
   LDAP_AD_DOMAIN?: string;
   LDAP_USERNAME_ATTRIBUTE?: string;
   // RADIUS fields
   RADIUS_SERVER?: string;
   RADIUS_PORT?: string;
   RADIUS_TIMEOUT?: string;
   RADIUS_RETRIES?: string;
   // SAML fields
   SAML_LOCAL_ENTITY_ID?: string;
   SAML_REMOTE_ENTITY_ID?: string;
   SAML_UID_OID?: string;
   SAML_IDP_METADATA?: string;
   SAML_USE_CERTIFICATE?: string;
};


export type GlobalOptionsFormProps = (getUserSyncAuthFields | addUserSyncAuthFields) & UserSyncExecuteOptions;

export type UserFilterType = {
    id: number;
    name: string;
};