import { type UseQueryOptions } from "@tanstack/react-query";
import { type SelectOption } from "../TypeAheadAsync/type";

/**
 * Base interface for entities that can be used with EntityTypeAhead.
 * All entities must have an id and name property.
 */
export interface EntityBase {
    /** Unique identifier for the entity */
    id: number;
    /** Display name for the entity */
    name: string;
}

/**
 * Callback type for single entity selection changes.
 * @param entity - The selected entity, or null if cleared
 */
export type SingleEntityHandler<Entity> = (entity: Entity | null) => void;

/**
 * Callback type for multiple entity selection changes.
 * @param entities - Array of selected entities
 */
export type MultiEntityHandler<Entity> = (entities: Entity[]) => void;

/**
 * Base props shared by all EntityTypeAhead variants.
 * @template Entity - Entity type extending EntityBase
 */
export interface EntityTypeAheadBaseProps<Entity extends EntityBase, Filter> {
    /**
     * If true, automatically selects the first option when options are loaded.
     * Useful for scenarios where a default selection is required.
     * @default false
     */
    initialize?: boolean;

    /**
     * Additional query parameters to pass to the entity query function.
     * These parameters are combined with the search input value.
     * @example { departmentId: 5, status: 'active' }
     */
    queryParams?: Filter;

    /**
     * Query option builder function for fetching entities.
     * Should return a TanStack Query configuration object.
     * @param entitySearch - Optional search string from user input
     * @param params - Additional query parameters from queryParams prop
     * @returns TanStack Query options for fetching entities
     */
    entityQueryOption: (entitySearch?: string, params?: Filter) => UseQueryOptions<Entity[]>;

    /**
     * Placeholder to display the type of entity in the list     
     * @example "Select Group"
     */
    placeholder?: string;
    /**
     * Map to options converts the custom entities to the options
     */
    mapToOptions?: (option: Entity) => SelectOption & Entity;
    /**
     * Filter function that will map the initial values of the entity
     */
    filterInitialValue?: (option: Entity) => boolean | undefined;
    /**
     * Enable/Disable the component
     */
    isDisabled?: boolean;
    /**
     * Label of the component
     */
    label?: string;
    /**
     * Validation errors
     */
    error?: string;
     /**
     * Height of the component
     */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for single-selection mode.
 * @template Entity - Entity type extending EntityBase
 */
export interface EntityTypeAheadSingleProps<Entity extends EntityBase, Filter> extends EntityTypeAheadBaseProps<Entity, Filter> {
    /**
     * When false or undefined, only single selection is allowed.
     * @default false
     */
    isMulti?: false;

    /**
     * Callback fired when the selected entity changes.
     * Receives null when selection is cleared.
     */
    onChange?: SingleEntityHandler<Entity>;

    /**
     * ID of the entity to select by default.
     * Must match an entity ID in the default options.
     */
    defaultValue?: Entity;

    /**
     * The currently selected entity ID for controlled component usage.
     */
    value?: Entity | null;
}

/**
 * Props for multi-selection mode.
 * @template Entity - Entity type extending EntityBase
 */
export interface EntityTypeAheadMultiProps<Entity extends EntityBase, Filter> extends EntityTypeAheadBaseProps<Entity, Filter> {
    /**
     * When true, multiple selections are allowed.
     */
    isMulti: true;

    /**
     * Callback fired when the selected entities change.
     * Receives an array of selected entities.
     */
    onChange?: MultiEntityHandler<Entity>;

    /**
     * Array of entity IDs to select by default.
     * Must match entity IDs in the default options.
     */
    defaultValue?: Entity[];

    /**
     * The currently selected entity IDs for controlled component usage.
     */
    value?: Entity[] | null;
}

/**
 * Union type for all EntityTypeAhead prop variants.
 * @template Entity - Entity type extending EntityBase
 * @template Filter - Filter for Entity
 */
export type EntityTypeAheadAllProps<Entity extends EntityBase, Filter> =
    | EntityTypeAheadSingleProps<Entity, Filter>
    | EntityTypeAheadMultiProps<Entity, Filter>;
