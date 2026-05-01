export type SNMPCredential = {
   id: number;
   name: string;
   version: number;
   community?: string | null;
   auth_method?: string;
   auth_user?: string | null;
   auth_pass?: string | null;
   priv_method?: string;
   priv_pass?: string | null;
   context?: string | null;
};
