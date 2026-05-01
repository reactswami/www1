export type User = {
   id: number;
   name?: string;
   auth?: string;
   is_admin: number;
   auth_refresh: number;
   tz: string;
   password: string;
   reportRowSpacing: string;
   exportDateFormat: string;
   top_n: number;
   auth_ttl: number;
   api: string;
   email: string;
};
