export function formatErrorMessages(error: string) {
   const errorMessages: Record<string, string> = {
      'Unable to insert entry: Another entry already exists':
         'Another SNMP Credential already exists with this information.',
      'Unable to insert entry: Data provided is incorrect - Please look at logs for further information':
         'The information provided for this SNMP Credential is invalid.',
   };

   return errorMessages[error] || error;
}
