import { type RemotesConfiguration } from "@statseeker/utils/remoteLoader";

export const remotesConfig: RemotesConfiguration = {
  development: {
    oaManager: {
      name: 'oaManager',
      url: 'http://localhost:5001/assets/remoteEntry.js',
      scope: 'default',
    },
  },
  production: {
    oaManager: {
      name: 'oaManager',
      url: '/assets/remoteEntry.js',
      scope: 'default',
    },
  },
};