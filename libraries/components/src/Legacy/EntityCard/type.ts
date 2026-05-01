// ============================================================
// type.ts - Updated with Generic EntityCard Types
// ============================================================

import { type LayoutProps } from "@chakra-ui/react";
import { type EntityErrors, type BaseEntity } from "@statseeker/hooks";
import { type ReactNode } from "react";

/**
 * Props passed to the panel renderer function.
 * Contains callbacks and state for managing individual entity panels.
 * 
 * @interface EntityPanelProps
 * 
 * @property {number} index - Index of the entity in the list
 * @property {number} entitiesLength - Total number of entities
 * @property {(id: number, field: string, value: any) => void} onUpdate - Callback to update entity field
 * @property {(id: number) => void} onRemove - Callback to remove entity
 * @property {boolean} validate - Whether to show validation errors
 * @property {EntityErrors[0]} [error] - Validation error for this entity
 * @property {boolean} displayHeader - Whether to display column headers
 */
export interface EntityPanelProps<Entity> {
    index: number;
    entitiesLength: number;
    onUpdate: (id: number, field: keyof Omit<Entity, 'id'>, value: any) => void;
    onRemove: (id: number) => void;
    validate: boolean;
    error?: EntityErrors[0];
    displayHeader: boolean;
    entity: Entity;
}

/**
 * Props for the generic EntityCard component.
 * Supports both controlled and uncontrolled modes for entity management.
 * 
 * @interface EntityCardProps
 * @template T - Entity type that extends BaseEntity
 * 
 * @property {string} [title] - Optional heading text displayed at the top of the card
 * @property {Omit<T, 'id'>[]} [initialEntities] - Initial entities for uncontrolled mode
 * @property {T[]} [entities] - Controlled entity list from parent component
 * @property {(entities: T[], error?: EntityErrors) => void} [onChange] - Callback fired when entities change
 * @property {string} [addButtonText] - Custom text for the add button (default: 'Add')
 * @property {Omit<T, 'id'>} defaultEntity - Default entity template for new items
 * @property {Array<(entities: T[]) => EntityErrors>} [validateEntity] - Array of validation functions
 * @property {(entity: T, props: EntityPanelProps) => React.ReactNode} renderPanel - Function to render each entity panel
 * @property {LayoutProps['maxW']} [maxWidth] - Maximum width of the container (Chakra UI maxW values)
 * @property {boolean} [validate] - Enable validation mode to show error states
 * @property {string | ((count: number) => string)} [entityCountText] - Custom text for entity count display
 * 
 * @example
 * // With custom count text function
 * <EntityCard<Device>
 *   entities={devices}
 *   onChange={setDevices}
 *   defaultEntity={DEFAULT_DEVICE}
 *   validateEntity={[validateDuplicateDevices]}
 *   renderPanel={(device, props) => <DevicePanel device={device} {...props} />}
 *   entityCountText={(count) => `${count} device${count > 1 ? 's' : ''} configured`}
 * />
 * 
 * @example
 * // With static count text
 * <EntityCard<User>
 *   initialEntities={[]}
 *   defaultEntity={{ name: '', email: '' }}
 *   renderPanel={(user, props) => <UserPanel user={user} {...props} />}
 *   entityCountText="users added"
 * />
 */
export interface EntityCardProps<T extends BaseEntity> {
    title?: string;
    initialEntities?: T[];
    entities?: T[];
    onChange?: (entities: T[], error?: EntityErrors, isDirty?: boolean) => void;
    addButtonText?: string;
    defaultEntity: T;
    validateEntity?: Array<(entities: T[]) => EntityErrors>;
    renderPanel: (props: EntityPanelProps<T>) => ReactNode;
    maxWidth?: LayoutProps['maxW'];
    shouldValidate?: boolean;
    entityCountText?: string | ((count: number) => string);
    maxHeight?: LayoutProps['maxH'];
}

