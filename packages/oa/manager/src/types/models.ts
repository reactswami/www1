export interface DeviceOa {
   id: string;
   status: string;
   manual_name: string;
   timeout: number;
   uptime: number;
   version: string;
   poll: 'on' | 'off';
   name: string;
   hostname: string;
   ipaddress: string;
   netmask: string;
   gateway: string;
   region: string;
   site: string;
   location: string;
   latitude: number;
   longitude: number;
   ipv6address?: string;
   ipv6gateway?: string;
   ipv6prefix?: number;
}
