
export type UserTemplateConfig = {
   tz: string;
   api: string;
   is_admin: number;
   exportDateFormat: string;
   top_n: number;
   reportRowSpacing: string;
   auth_ttl?: number;
   auth_refresh?: number;
   groups?: number[];
};


/* Everything is mandatory for a getting a policy */
export type getUserSyncFields = {
   id: number;
   priority: number;
   name: string;
   enabled: boolean;
   include_users: string[];
   include_groups: string[];
   exclude_users: string[];
   user_template: UserTemplateConfig;
};

/* all fields are mandatory except for ID and priority when we create a policy */
export type addUserSyncFields = Omit<getUserSyncFields, 'id' | 'priority'> & { id?: number; priority?: number };

/* all fields except id are optional when we update a policy, but at least one must be provided */
export type updateUserSyncFields = Partial<Omit<getUserSyncFields, 'id'>> & { id: number };


export type UserSyncExecuteOptions = {
   dry_run?: boolean;
   force?: boolean;
   use_user_auth?: boolean;
   username_attribute?: 'sAMAccountName' | 'userPrincipalName';
};