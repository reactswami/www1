type DownloadLicenseResponse =
   | {
        status: 'success';
        product_key: string;
     }
   | {
        status: 'error';
        msg: string;
     };

export const downloadLicense = async ({
   version,
   server_id,
   hardware_id,
   device_count,
   port_count,
}: {
   version: string;
   server_id: string;
   hardware_id: string;
   device_count?: number;
   port_count?: number;
}): Promise<{
   server_id: string;
   key: string;
}> => {
   let url = `https://key-server.statseeker.com/api/license?v=${version}&server_id=${server_id}&hardware_id=${hardware_id}&referurl=${window.location.toString()}`;
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
