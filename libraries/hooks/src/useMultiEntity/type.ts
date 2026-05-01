// ============================================================
// type.ts
// ============================================================

/**
 * Base interface for all entities managed by the multi-entity hook.
 * Requires an id field for unique identification.
 * 
 * @interface BaseEntity
 * @property {number} id - Unique identifier for the entity
 * 
 * @example
 * interface Device extends BaseEntity {
 *   name: string;
 *   ipAddress: string;
 * }
 */
export interface BaseEntity {
    id: number;
};

export type EntityError =
    {
        id: number;
        error?: string;
    };


export type EntityErrors =
    Array<EntityError>;

type ValidateEnity<T extends BaseEntity> = (entity: T[]) => EntityErrors;

/**
 * Parameters for the useEntityManager hook.
 * Supports both controlled and uncontrolled modes for entity management.
 * 
 * @template T - Entity type that extends BaseEntity
 * @interface UseMultiEntityParams
 * 
 * @property {Omit<T, 'id'>[]} [initialEntities] - Initial entities for uncontrolled mode (without ids)
 * @property {T[]} [controlledEntities] - Entity array from parent component (controlled mode)
 * @property {(entities: T[]) => void} [onChange] - Callback fired when entities change (controlled mode)
 * @property {Omit<T, 'id'>} defaultEntity - Template object used when creating new entities
 * 
 * @example
 * const params: UseMultiEntityParams<Device> = {
 *   defaultEntity: { name: '', ipAddress: '', snmpCredentials: 'default' },
 *   onChange: (devices) => setDevices(devices)
 * };
 */
export interface UseMultiEntityParams<T extends BaseEntity> {
    initialEntities?: T[];
    controlledEntities?: T[];
    onChange?: (entities: T[], error?: EntityErrors, isDirty?: boolean) => void;
    defaultEntity: T;
    validateEntity?: ValidateEnity<T>[];
}

/**
 * Return type for the useEntityManager hook.
 * Provides entities array and CRUD operations.
 * 
 * @template T - Entity type that extends BaseEntity
 * @interface MultiEntityResult
 * 
 * @property {T[]} entities - Current array of entities
 * @property {() => void} addEntity - Function to add a new entity using defaultEntity template
 * @property {(id: number) => void} removeEntity - Function to remove an entity by id
 * @property {(id: number, field: keyof Omit<T, 'id'>, value: string) => void} updateEntity - Function to update a specific field of an entity
 * 
 * @example
 * const { entities, addEntity, removeEntity, updateEntity } = useEntityManager({...});
 * 
 * // Add a new entity
 * addEntity();
 * 
 * // Update an entity
 * updateEntity(1, 'name', 'New Name');
 * 
 * // Remove an entity
 * removeEntity(1);
 */
export interface MultiEntityResult<T extends BaseEntity> {
    entities: T[];
    addEntity: () => void;
    resetEntity: () => void;
    removeEntity: (id: number) => void;
    updateEntity: (id: number, field: keyof Omit<T, 'id'>, value: string) => void;
    validateEntity: (entities: T[]) => EntityErrors;
}
