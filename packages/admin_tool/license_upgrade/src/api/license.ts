import { type LicenseResponse } from './type';

/**
 * Gets license information
 */
export const getLicense = async () => {
   const resp = await fetch('/cgi/license_upgrade');

   if (!resp.ok) {
      /* Try to get the error message */
      let errorBody;
      try {
         errorBody = await resp.json();
      } catch {
         errorBody = await resp.text();
      }

      throw new Error(
         `Request failed: ${resp.status} ${resp.statusText} - ${JSON.stringify(errorBody)}`
      );
   }

   return resp.json() as unknown as LicenseResponse;
};

/**
 * Adds a new license
 */
export const addLicense = async ({ key }: { key: string }) => {
   const resp = await fetch('/cgi/license_upgrade', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: key.trim() }),
   });

   if (!resp.ok) {
      /* Try to get the error message */
      let errorBody;
      try {
         errorBody = await resp.json();
      } catch {
         errorBody = await resp.text();
      }

      throw new Error(
         `Request failed: ${resp.status} ${resp.statusText} - ${JSON.stringify(errorBody)}`
      );
   }
};

type DownloadLicenseResponse =
   | {
        status: 'success';
        product_key: string;
     }
   | {
        status: 'error';
        msg: string;
     };

/**
 * Downloads a license key from the key server
 * @param server_id - The server ID for the license download
 * @param hardware_id - The hardware ID for the license download
 * @param device_count - The number of devices discovered (optional)
 * @param port_count - The number of ports discovered (optional)
 * @returns The downloaded license information
 */
export const downloadLicense = async ({
   server_id,
   hardware_id,
   device_count,
   port_count,
}: {
   server_id: string;
   hardware_id: string;
   device_count: number | null;
   port_count: number | null;
}): Promise<{
   server_id: string;
   key: string;
}> => {
   let url = `https://key-server.statseeker.com/api/license?version=25.3&server_id=${server_id}&hardware_id=${hardware_id}&referurl=${window.location.toString()}`;
   if (typeof(device_count) === 'number') {
      url += `&dc=${device_count}`;
   }
   if (typeof(port_count) === 'number') {
      url += `&pc=${port_count}`;
   }

   const resp = await fetch(url);
   if (!resp.ok) {
      /* Try to get the error message */
      let errorBody;
      try {
         errorBody = await resp.json();
      } catch {
         errorBody = await resp.text();
      }

      throw new Error(
         `Request failed: ${resp.status} ${resp.statusText} - ${JSON.stringify(errorBody)}`
      );
   }

   const res = (await resp.json()) as DownloadLicenseResponse;
   if (res.status === 'error') {
      throw new Error(res.msg);
   }

   return {
      server_id: server_id,
      key: res.product_key,
   };
};
