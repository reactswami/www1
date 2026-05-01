import RemoteApp from '@statseeker/components/RemoteApp/RemoteApp';

import { createFileRoute } from '@tanstack/react-router';
import { remotesConfig } from '~/config/remotes.config';

const envConfig = import.meta.env.MODE === 'production' ? remotesConfig.production : remotesConfig.development;

export const Route = createFileRoute('/oa_manager')({
   component: OAManager,
});

function OAManager() {
   return (
      <RemoteApp appName='oaManager' moduleName='./RemoteApp' envConfig={envConfig} friendlyAppName='OA Manager' />
   );
}

