import { type EntityType, ORDERED_ENTITIES } from '~/types';

export function showEntityDropdown(entityType: EntityType, formType: EntityType): boolean {
   const entityIndex = ORDERED_ENTITIES.findIndex((item) => item.type === entityType);
   const formIndex = ORDERED_ENTITIES.findIndex((item) => item.type === formType);

   return entityIndex !== -1 && formIndex !== -1 && entityIndex < formIndex;
}
