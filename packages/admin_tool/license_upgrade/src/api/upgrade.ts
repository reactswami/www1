/**
 * Cancels a pending upgrade
 */
export const cancelUpgrade = async ({
   csrf_token,
   version,
}: {
   csrf_token?: string | null;
   version?: string | null;
}) => {
   /* Default to the lowest allowed version, 5.6.2 */
   const v_arr = version?.split('.') || ['5', '6', '2'];
   let resp;
   if (v_arr[0] == '5') {
      /* Version 5.x.x requires a simple GET request */
      resp = await fetch('/cgi/base-web-ssadmin-wrapper?mode=save&option=upgrade&action=cancel');
   } else {
      resp = await fetch('/cgi/base-web-ssadmin-wrapper', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: new URLSearchParams({
            mode: 'save',
            option: 'upgrade',
            action: 'cancel',
            ...(csrf_token && { csrf_token }),
         }),
      });
   }

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
