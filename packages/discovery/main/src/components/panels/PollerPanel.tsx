import { Box, Text } from '@chakra-ui/react';
import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { Flex } from '@statseeker/components';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { filterStatseekerServer, getAllPollers, type PollerSelect, snmpPollerSelect } from '@statseeker/utils/apiOptions';
import { Panel } from '@statseeker/components/Disclosure/Panel';

export function PollerPanel({
    defaultValues,
    onChange,
}: {
    defaultValues?: PollerListItem;
    onChange: (data?: PollerListItem | null) => void;
}) {
    return (
        <Panel
            title="Pollers"
            className="panel-poller-options"
            subTitle={
                defaultValues !== undefined ? "Poller Selected"
                    : undefined
            }
        >
            <Flex gap={4} flexDir={'column'}>
                <Text>Select the default poller for running the discovery</Text>
                <Box width={'200px'}>
                    <EntityTypeAhead<PollerListItem, PollerSelect> initialize={true} defaultValue={defaultValues}
                        onChange={onChange} entityQueryOption={getAllPollers} filterInitialValue={filterStatseekerServer}
                        queryParams={snmpPollerSelect}
                    />
                </Box>
            </Flex>
        </Panel>
    );
}
