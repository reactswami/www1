// ============================================================
// EntityCard.tsx
// ============================================================

import {
    Box,
    Heading,
    Divider,
    Container,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form';
import { Flex } from '@statseeker/components/Layout';
import { Text } from '@statseeker/components/Typography';
import { useEntityManager, type BaseEntity } from '@statseeker/hooks';
import React, { useCallback, useEffect, useRef } from 'react';
import { type EntityCardProps } from './type';

/**
 * Generic EntityCard component for managing multiple entities.
 * Provides a form interface to add, edit, and remove entities with validation.
 * 
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Pass `entities` and `onChange` props to manage state externally
 * - Uncontrolled: Pass `initialEntities` to manage state internally
 * 
 * Features:
 * - Add/remove entity entries dynamically
 * - Validate entity fields with custom validators
 * - Disable "Add" button when any entity has invalid fields
 * - Show visual validation errors when `validate` prop is true
 * - Responsive layout with configurable max width
 * - Custom panel renderer for flexible UI
 * 
 * @component
 * @template T - Entity type that extends BaseEntity
 * @param {EntityCardProps<T>} props - Component props
 * @returns {React.ReactElement} Rendered entity management card
 * 
 * @example
 * // Controlled mode with validation
 * const [devices, setDevices] = useState<Device[]>([]);
 * 
 * <EntityCard<Device>
 *   title="Network Devices"
 *   entities={devices}
 *   onChange={setDevices}
 *   validate={true}
 *   defaultEntity={DEFAULT_DEVICE}
 *   validateEntity={[validateDuplicateDevices, validateEmptyDevices]}
 *   renderPanel={(entity, props) => <DevicePanel device={entity} {...props} />}
 *   maxWidth="container.md"
 * />
 * 
 * @example
 * // Uncontrolled mode
 * <EntityCard<User>
 *   initialEntities={[{ id: 1, name: 'John', email: 'john@example.com' }]}
 *   defaultEntity={{ name: '', email: '' }}
 *   renderPanel={(user, props) => <UserPanel user={user} {...props} />}
 *   addButtonText="Add User"
 * />
 */
export const EntityCard = <T extends BaseEntity>({
    title,
    initialEntities,
    entities: controlledEntities,
    onChange,
    addButtonText = 'Add',
    defaultEntity,
    validateEntity: validateEntityFn,
    renderPanel,
    maxWidth = '100%',
    shouldValidate = false,
    entityCountText,
    maxHeight = 'fit-content'
}: EntityCardProps<T>): React.ReactElement => {

    const errorRef = useRef<(HTMLDivElement | null)[]>([]);
    /**
     * Hook for managing entities with add/remove/update operations.
     * Handles both controlled and uncontrolled modes automatically.
     */
    const {
        entities,
        addEntity,
        removeEntity,
        updateEntity,
        validateEntity,
        resetEntity
    } = useEntityManager<T>({
        initialEntities,
        controlledEntities,
        onChange,
        defaultEntity,
        validateEntity: validateEntityFn
    });
    const error = validateEntity(entities);

    const prevEntitiesRef = useRef(entities);


    // Scroll to last panel when entities array length changes    
    useEffect(() => {
        errorRef.current[entities?.length - 1]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        const currentErrors = validateEntity(entities);
        if (prevEntitiesRef.current === entities) return;
        prevEntitiesRef.current = entities;
        onChange?.(entities, currentErrors ?? []);

    }, [entities, validateEntity]);

    useEffect(() => {
        if (shouldValidate && error && error.length > 0) {
            const firstErrorIndex = entities.findIndex(entity =>
                error.some(err => Number(err.id) === Number(entity.id))
            );

            if (firstErrorIndex !== -1 && errorRef.current[firstErrorIndex]) {
                console.log('Scrolling to error at index:', firstErrorIndex);
                errorRef.current[firstErrorIndex]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [shouldValidate, error, entities]);

    /**
     * Total number of entities currently in the list.
     * @type {number}
     */
    const entitiesLength = entities.length;

    const hasError = useCallback(
        (entityId: number) => error?.some(err => Number(err.id) === Number(entityId)),
        [error]
    );

    const errors = useCallback(
        (entityId: number) => error?.filter(err => err.id === entityId),
        [error]
    );

    /**
     * Get the entity count display text
     */
    const getEntityCountText = () => {
        if (entities?.length <= 1) return null;

        if (entityCountText) {
            return typeof entityCountText === 'function'
                ? entityCountText(entities.length)
                : entityCountText;
        }

        return `${entities.length} items added`;
    };

    return (
        <Container maxW={maxWidth} p={0}>
            <Box bg="white">
                {title && (
                    <Heading size="lg" mb={6}>
                        {title}
                    </Heading>
                )}
                <Flex flexDirection='column' gap={3} align="stretch">
                    <Flex
                        flexDirection='column'
                        gap={3}
                        align="stretch"
                        maxH={maxHeight}
                        overflowY={'auto'}
                        paddingRight={'2'}
                    >
                        {entities.map((entity, index) => (
                            <Box
                                key={entity.id}
                                ref={(el) => {
                                    errorRef.current[index] = el;
                                }}
                                scrollMarginTop={'2'}
                            >
                                {renderPanel({
                                    index,
                                    entitiesLength,
                                    onUpdate: (id, field, value) => {
                                        updateEntity(id, field, value);
                                    },
                                    onRemove: removeEntity,
                                    validate: shouldValidate && hasError(entity.id),
                                    error: errors(entity.id)?.[0],
                                    displayHeader: index === 0,
                                    entity
                                })}
                            </Box>
                        ))}
                    </Flex>
                    <Divider />
                    <Flex justifyContent={'space-between'}>
                        <Text>{getEntityCountText()}</Text>
                        <Flex gap='5px'>
                            {entitiesLength > 1 &&
                                <Button
                                    size="sm"
                                    variant="tertiary"
                                    onClick={resetEntity}
                                >
                                    Reset
                                </Button>
                            }
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={addEntity}
                            >
                                {addButtonText}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Container>
    );
};