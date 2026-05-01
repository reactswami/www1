import { AdminLayout, MapPinRadarIcon } from '@statseeker/components';
import { NavLayout } from '@statseeker/components/Layout/NavLayout';
import { NavCard, NavCardBuilder } from '@statseeker/components/Layout/NavLayout/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { DeviceIcon } from '~/components';
import { PortIcon } from '~/components/icons/PortIcon';
import { SNMPEntityIcon } from '~/components/icons/SNMPEntityIcon';

const RootComponent = () => {

   const navigate = useNavigate();
   const url =
      window?.parent.parent.document.querySelectorAll('iframe')[0]?.contentDocument?.documentURI ??
      '';

   if (url) {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      if (params.get('selected-devices')) {
         navigate({
            to: '/devices',
            search: { text_filter: params.get('selected-devices') ?? '' },
         });
      } else if (params.get('selected-ports')) {
         navigate({
            to: '/interfaces',
            search: { text_filter: params.get('selected-ports') ?? '' },
         });
      }
   }
   const deviceCard = useMemo(() => new NavCardBuilder()
      .text('Device Management')
      .description('Manage network devices across your infrastructure')
      .icon(<DeviceIcon />)
      .className('device-management')
      .cardAction('/devices')
      .addLinkButton('View', '/devices')
      .build(), []);
   const interfaceCard = useMemo(() => new NavCardBuilder()
      .text('Interface Management')
      .description('Manage network interfaces across your infrastructure')
      .icon(<PortIcon />)
      .className('interface-management')
      .cardAction('/interfaces')
      .addLinkButton('View', '/interfaces')
      .build(), []);
   const snmpEntityCard = useMemo(() => new NavCardBuilder()
      .text('SNMP Entity Management')
      .description('Manage polling for other SNMP entities across your infrastructure')
      .icon(<SNMPEntityIcon />)
      .className('interface-management')
      .cardAction('/snmp_entities')
      .addLinkButton('View', '/snmp_entities')
      .build(), []);
   const oaManagerCard = useMemo(() => new NavCardBuilder()
      .text('Observability Appliance Management')
      .description('Create and Manage your Observability Appliances')
      .icon(<MapPinRadarIcon />)
      .className('oa-management')
      .cardAction('/oa_manager')
      .addLinkButton('View', '/oa_manager')
      .build(), []);

   return (
      <AdminLayout title={'Manage Devices'} subtitle="Menu">
         <NavLayout>
            <NavCard {...deviceCard} />
            <NavCard {...interfaceCard} />
            <NavCard {...snmpEntityCard} />
            <NavCard {...oaManagerCard} />
         </NavLayout>
      </AdminLayout >
   );
};

export const Route = createFileRoute('/')({
   component: RootComponent,
});
