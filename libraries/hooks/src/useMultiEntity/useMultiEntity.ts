// ============================================================
// useMultiEntity.ts
// ============================================================

import { useCallback, useState } from "react";
import { type EntityErrors, type BaseEntity, type MultiEntityResult, type UseMultiEntityParams } from "./type";

/**
 * Generic custom hook for managing multiple entities with CRUD operations.
 * 
 * Supports both controlled and uncontrolled modes:
 * - **Controlled mode**: Pass `controlledEntities` and `onChange` to manage state externally
 * - **Uncontrolled mode**: Pass `initialEntities` or omit it to manage state internally
 * 
 * Features:
 * - Add new entities using a default template
 * - Remove entities by id (prevents removal if only one entity remains)
 * - Update specific fields of entities
 * - Automatic id generation using timestamps
 * - Type-safe operations with TypeScript generics
 * 
 * @template T - Entity type that extends BaseEntity
 * @param {UseMultiEntityParams<T>} params - Hook parameters
 * @param {Omit<T, 'id'>[]} [params.initialEntities] - Initial entities for uncontrolled mode
 * @param {T[]} [params.controlledEntities] - Controlled entities from parent
 * @param {(entities: T[]) => void} [params.onChange] - Change handler for controlled mode
 * @param {Omit<T, 'id'>} params.defaultEntity - Default entity template for new entities
 * @returns {MultiEntityResult<T>} Object containing entities array and CRUD methods
 * 
 * @example
 * // Uncontrolled mode
 * const { entities, addEntity, updateEntity, removeEntity } = useEntityManager({
 *   defaultEntity: { name: '', ipAddress: '' },
 *   initialEntities: [{ name: 'Router', ipAddress: '192.168.1.1' }]
 * });
 * 
 * @example
 * // Controlled mode
 * const [devices, setDevices] = useState<Device[]>([]);
 * const { entities, addEntity, updateEntity, removeEntity } = useEntityManager({
 *   controlledEntities: devices,
 *   onChange: setDevices,
 *   defaultEntity: { name: '', ipAddress: '' }
 * });
 */
export function useEntityManager<T extends BaseEntity>({
    initialEntities,
    controlledEntities,
    onChange,
    defaultEntity,
    validateEntity
}: UseMultiEntityParams<T>): MultiEntityResult<T> {
    /**
     * Internal state for uncontrolled mode.
     * Initialized lazily with either provided initialEntities or a single defaultEntity.
     * Each entity is assigned a unique id using Date.now() + index.
     * 
     * @type {T[]}
     */
    const [internalEntities, setInternalEntities] = useState<T[]>(() => {
        const entities = initialEntities || [defaultEntity];
        return entities.map((entity, index) => ({
            ...entity,
            id: entity?.id ?? Date.now() + index,
        } as T));
    });

    /**
     * Determines if the hook is operating in controlled mode.
     * @type {boolean}
     */
    const isControlled = controlledEntities !== undefined;

    /**
     * Current entities array - uses controlled entities if provided, otherwise internal state.
     * @type {T[]}
     */
    const entities = isControlled ? controlledEntities : internalEntities;

    const computeValidation = useCallback((entities: T[]) => {
        let validations: EntityErrors = [];
        if (validateEntity) {
            validateEntity.forEach(v => {
                const error = v(entities);
                if (error.length > 0) {
                    validations = [...validations, ...error];
                }
            });
        }
        return validations;
    }, [validateEntity]);

    /**
     * Update handler that works for both controlled and uncontrolled modes.
     * In controlled mode, calls the onChange callback.
     * In uncontrolled mode, updates internal state.
     * 
     * @callback updateEntities
     * @param {T[] | ((prev: T[]) => T[])} newEntities - New entities array or updater function
     */
    const updateEntities = useCallback(
        (newEntities: T[] | ((prev: T[]) => T[])) => {
            if (isControlled) {
                // Controlled mode: call onChange
                const updatedEntities = typeof newEntities === 'function'
                    ? newEntities(controlledEntities)
                    : newEntities;

                let validations: EntityErrors = computeValidation(updatedEntities);

                onChange?.(updatedEntities, validations, true);
            } else {
                // Uncontrolled mode: update internal state                
                let validations: EntityErrors = computeValidation(newEntities as T[]);
                onChange?.(newEntities as T[], validations, true);
                setInternalEntities(newEntities);
            }
        },
        [isControlled, controlledEntities, onChange, computeValidation]
    );

    /**
     * Adds a new entity to the array using the defaultEntity template.
     * Generates a unique id using Date.now().
     * 
     * @function addEntity
     * @returns {void}
     */
    const addEntity = useCallback(() => {
        updateEntities((prev) => [
            ...prev,
            {
                ...defaultEntity,
                id: Date.now(),
            } as T,
        ]);
    }, [updateEntities, defaultEntity]);

    /**
     * Removes an entity by id.
     * Prevents removal if only one entity remains to maintain at least one entity.
     * 
     * @function removeEntity
     * @param {number} id - The id of the entity to remove
     * @returns {void}
     */
    const removeEntity = useCallback((id: number) => {
        updateEntities((prev) => {
            if (prev.length > 1) {
                return prev.filter((entity) => entity.id !== id);
            }
            return prev;
        });
    }, [updateEntities]);

    /**
     * Resets the entity
     * Removes all the entities and add the default one
     * 
     * @function resetEntity
     * @param {number} id - The id of the entity to remove
     * @returns {void}
     */
    const resetEntity = useCallback(() => {
        updateEntities(() => {
            return [defaultEntity];
        });
    }, [updateEntities, defaultEntity]);

    /**
     * Updates a specific field of an entity identified by id.
     * 
     * @function updateEntity
     * @param {number} id - The id of the entity to update
     * @param {keyof Omit<T, 'id'>} field - The field name to update (excludes 'id')
     * @param {string} value - The new value for the field
     * @returns {void}
     * 
     * @example
     * updateEntity(1, 'name', 'New Router Name');
     */
    const updateEntity = useCallback(
        (id: number, field: keyof Omit<T, 'id'>, value: string) => {
            updateEntities((prev) =>
                prev.map((entity) =>
                    entity.id === id ? { ...entity, [field as unknown as string]: value } : entity
                )
            );
        },
        [updateEntities]
    );

    return {
        entities,
        addEntity,
        removeEntity,
        updateEntity,
        resetEntity,
        validateEntity: computeValidation
    };
}
