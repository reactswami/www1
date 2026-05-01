import { type ReactElement } from 'react';
import { PingDiscoveryRoute } from './PingDiscoveryRoute';
import { RemotePingDiscoveryRoute } from './PingDiscoveryRoute/RemotePingDiscoveryRoute';
import { type PingDiscoverProps } from '~/types';

export const AppRoutes = (): ReactElement => <PingDiscoveryRoute />;
export const RemoteAppRoutes = (props: PingDiscoverProps): ReactElement => <RemotePingDiscoveryRoute {...props} />;
