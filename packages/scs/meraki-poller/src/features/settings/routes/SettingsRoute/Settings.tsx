import { Layout } from 'packages/scs/meraki-poller/src/components';
import { SettingsForm } from '../../components/SettingsForm/SettingsForm';

export const Settings = () => (
   <Layout subtitle={'General settings'}>
      <SettingsForm />
   </Layout>
);
