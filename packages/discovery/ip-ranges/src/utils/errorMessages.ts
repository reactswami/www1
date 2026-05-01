const errorMessages: Record<string, string> = {
   'Unable to insert entry: Another entry already exists':
      'Another IP Address range already exists with this information.',
   'Unable to insert entry: Data provided is incorrect - Please look at logs for further information':
      'The information provided for this IP Address range is invalid.',
};

export function getErrorMessage(error: string) {
   return errorMessages[error] || error;
}
