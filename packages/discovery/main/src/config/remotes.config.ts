import { type RemotesConfiguration } from "@statseeker/utils/remoteLoader";

export const remotesConfig: RemotesConfiguration = {
  development: {
    pingDiscover: {
      name: 'pingDiscover',
      url: 'http://localhost:5001/assets/remoteEntry.js',
      scope: 'default',
    },
  },
  production: {
    pingDiscover: {
      name: 'pingDiscover',
      url: '/assets/remotePingDiscover.js',
      scope: 'default',
    },
  },
};