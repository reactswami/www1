export type OaFormValues = {
   // This type is used to describe the Oa form
   id?: string;
   name: string;
   manual_name: string;
   hostname: string;
   ipaddress: string;
   netmask: string;
   gateway: string;
   ipv6address?: string;
   ipv6prefix?: number;
   ipv6gateway?: string;
   timeout: string;
   region?: string;
   site?: string;
   location?: string;
   latitude?: string;
   longitude?: string;
   dirtyFields: boolean;
};
