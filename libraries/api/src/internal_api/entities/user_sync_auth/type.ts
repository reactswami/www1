
export type getUserSyncAuthFields = {
   id: number;
   ldap_server: string;
   ldap_port: number;
   ldap_base_dn: string;
   ldap_secure_mode: 'NONE' | 'SSL' | 'STARTTLS';
   ldap_certificate?: string;
   ldap_bind_dn: string;
   ldap_bind_password?: string;
   ldap_ad_domain: string;
};

export type addUserSyncAuthFields = Omit<getUserSyncAuthFields, 'id' | 'ldap_bind_password'> & { id?: number; ldap_bind_password: string };

export type updateUserSyncAuthFields = getUserSyncAuthFields;


