// ============================================================
// EntityCard.stories.tsx
// ============================================================

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EntityCard } from './EntityCard';
import type { BaseEntity } from '@statseeker/hooks';
import type { EntityCardProps, EntityPanelProps } from './type';
import { Box, Input, Select, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form';
import { Flex } from '@statseeker/components/Layout';

// ============================================================
// Mock Entity Types
// ============================================================

interface Device extends BaseEntity {
    ipAddress: string;
    name: string;
    snmpCredentials: 'no-credentials' | 'default' | 'snmpv2' | 'snmpv3';
}

interface User extends BaseEntity {
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
}

interface Product extends BaseEntity {
    name: string;
    sku: string;
    price: number;
    category: string;
}

// ============================================================
// Default Entities
// ============================================================

const DEFAULT_DEVICE: Omit<Device, 'id'> = {
    ipAddress: '',
    name: '',
    snmpCredentials: 'default',
};

const DEFAULT_USER: Omit<User, 'id'> = {
    name: '',
    email: '',
    role: 'viewer',
};

const DEFAULT_PRODUCT: Omit<Product, 'id'> = {
    name: '',
    sku: '',
    price: 0,
    category: 'general',
};

// ============================================================
// Validation Functions
// ============================================================

const validateDevices = (devices: Device[]) => {
    const errors = [];
    const ipAddresses = new Set<string>();

    for (const device of devices) {
        if (!device.ipAddress || !device.name) {
            errors.push({
                id: device.id,
                message: 'IP Address and Name are required',
            });
        }

        if (ipAddresses.has(device.ipAddress) && device.ipAddress) {
            errors.push({
                id: device.id,
                message: `Duplicate IP Address: ${device.ipAddress}`,
            });
        }

        ipAddresses.add(device.ipAddress);
    }

    return errors;
};


// ============================================================
// Panel Components
// ============================================================

const DevicePanel: React.FC<EntityPanelProps<Device>> = ({
    entity,
    entitiesLength,
    onUpdate,
    onRemove,
    validate,
    error,
    displayHeader,
}) => {
    const isInvalid = validate && !!error;

    return (
        <Box>
            {displayHeader && (
                <Flex gap={2} mb={2} fontWeight="bold">
                    <Box flex={1}>IP Address</Box>
                    <Box flex={1}>Name</Box>
                    <Box flex={1}>SNMP Credentials</Box>
                    <Box w="80px">Action</Box>
                </Flex>
            )}
            <Flex gap={2} align="start">
                <FormControl flex={1} isInvalid={isInvalid}>
                    <Input
                        placeholder="192.168.1.1"
                        value={entity.ipAddress}
                        onChange={(e) => onUpdate(entity.id, 'ipAddress', e.target.value)}
                    />
                </FormControl>
                <FormControl flex={1} isInvalid={isInvalid}>
                    <Input
                        placeholder="Device Name"
                        value={entity.name}
                        onChange={(e) => onUpdate(entity.id, 'name', e.target.value)}
                    />
                </FormControl>
                <FormControl flex={1} isInvalid={isInvalid}>
                    <Select
                        value={entity.snmpCredentials}
                        onChange={(e) => onUpdate(entity.id, 'snmpCredentials', e.target.value)}
                    >
                        <option value="no-credentials">No Credentials</option>
                        <option value="default">Default</option>
                        <option value="snmpv2">SNMP v2</option>
                        <option value="snmpv3">SNMP v3</option>
                    </Select>
                </FormControl>
                <Box w="80px">
                    <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onRemove(entity.id)}
                        isDisabled={entitiesLength === 1}
                    >
                        Remove
                    </Button>
                </Box>
            </Flex>
            {isInvalid && error && (
                <FormErrorMessage mt={1}>{error.message}</FormErrorMessage>
            )}
        </Box>
    );
};

// ============================================================
// Storybook Meta
// ============================================================

const meta: Meta<typeof EntityCard> = {
    title: 'Components/EntityCard',
    component: EntityCard,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A generic card component for managing collections of entities with add, edit, remove, and validation capabilities.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

// ============================================================
// Stories - Device Examples
// ============================================================

export const DeviceCardUncontrolled: Story = {
    name: 'Device Card (Uncontrolled)',
    args: {
        title: 'Network Devices',
        initialEntities: [
            { ipAddress: '192.168.1.1', name: 'Router 1', snmpCredentials: 'default' },
        ],
        defaultEntity: DEFAULT_DEVICE,
        validateEntity: [validateDevices],
        renderPanel: (props) => <DevicePanel {...props} />,
        maxWidth: '900px',
        validate: false,
        entityCountText: (count) => `${count} device${count > 1 ? 's' : ''} configured`,
    } as EntityCardProps<Device>,
};

export const DeviceCardWithValidation: Story = {
    name: 'Device Card (With Validation)',
    args: {
        title: 'Network Devices - Validation Enabled',
        initialEntities: [
            { ipAddress: '', name: '', snmpCredentials: 'default' },
        ],
        defaultEntity: DEFAULT_DEVICE,
        validateEntity: [validateDevices],
        renderPanel: (props) => <DevicePanel {...props} />,
        maxWidth: '900px',
        validate: true,
        entityCountText: (count) => `${count} device${count > 1 ? 's' : ''} configured`,
    } as EntityCardProps<Device>,
};

export const DeviceCardControlled: Story = {
    name: 'Device Card (Controlled)',
    render: () => {
        const [devices, setDevices] = useState<Device[]>([
            { id: 1, ipAddress: '192.168.1.1', name: 'Router 1', snmpCredentials: 'default' },
            { id: 2, ipAddress: '192.168.1.2', name: 'Switch 1', snmpCredentials: 'snmpv2' },
        ]);
        const [validate, setValidate] = useState(false);

        return (
            <Box>
                <Button onClick={() => setValidate(!validate)} mb={4}>
                    {validate ? 'Disable' : 'Enable'} Validation
                </Button>
                <EntityCard<Device>
                    title="Network Devices (Controlled)"
                    entities={devices}
                    onChange={setDevices}
                    defaultEntity={DEFAULT_DEVICE}
                    validateEntity={[validateDevices]}
                    renderPanel={(props) => <DevicePanel {...props} />}
                    maxWidth="900px"
                    validate={validate}
                    entityCountText={(count) => `${count} device${count > 1 ? 's' : ''} configured`}
                />
            </Box>
        );
    },
};
