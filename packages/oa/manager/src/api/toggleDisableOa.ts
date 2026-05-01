import { updateOa } from './updateOa';

export const toggleDisableOa = (name: string, shouldEnable: boolean) =>
   updateOa({ name, poll: shouldEnable ? 'on' : 'off' });
