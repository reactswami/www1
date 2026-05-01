// ============================================================
// DeviceCard.tsx - Updated to use generic EntityCard
// ============================================================

import {
    DevicePanel,
    type Device,
    DEFAULT_DEVICE,
    validateDuplicateDevices,
    validateEmptyDevices,
} from '@statseeker/components/Legacy/DevicePanel';
import { EntityCard } from '@statseeker/components/Legacy/EntityCard';
import React from 'react';
import { type DeviceCardProps } from './type';

export const DeviceCard: React.FC<DeviceCardProps> = ({
    title,
    initialEntities: initialDevices,
    entities: devices,
    onChange,
    addButtonText = 'Add',
    maxWidth = '100%',
    shouldValidate = false,
    snmpOptions,
    maxHeight = 'fit-content',
}) => {
    return (
        <EntityCard<Device>
            title={title}
            initialEntities={initialDevices}
            entities={devices}
            onChange={onChange}
            addButtonText={addButtonText}
            defaultEntity={DEFAULT_DEVICE}
            validateEntity={[validateDuplicateDevices, validateEmptyDevices]}
            maxHeight={maxHeight}
            renderPanel={(props) => (
                <DevicePanel
                    {...props}
                    snmpOptions={snmpOptions}
                />
            )}
            maxWidth={maxWidth}
            shouldValidate={shouldValidate}
            entityCountText={(count) => `${count} device${count > 1 ? 's' : ''} added`}
        />
    );
};