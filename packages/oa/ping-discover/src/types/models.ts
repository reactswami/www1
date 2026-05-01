export interface DeviceOa {
   id: string;
   status: string;
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
   latitude: number;
   longitude: number;
}
