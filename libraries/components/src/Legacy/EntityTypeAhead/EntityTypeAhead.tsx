import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { type SelectOption, useAsyncSelect } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { TypeAheadAsyncMulti, TypeAheadAsyncSingle } from '@statseeker/components/Legacy/TypeAheadAsync/TypeAheadAsync';
import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { type EntityBase, type EntityTypeAheadAllProps, type MultiEntityHandler, type SingleEntityHandler } from './type';

const mapToOption = <T extends EntityBase>(entity: T) => ({ ...entity, value: entity.id, label: entity?.name });

/**
 * A type-ahead select component for entity selection with async data loading.
 * Supports both single and multiple selection modes, with automatic caching
 * and debounced search functionality.
 * 
 * @template Entity - Entity type extending EntityBase with id and name properties
 * 
 * @param props - Component props (see EntityTypeAheadSingleProps or EntityTypeAheadMultiProps)
 * 
 * @example
 * // Single selection
 * <EntityTypeAhead
 *   entityQueryOption={(search, params) => ({
 *     queryKey: ['users', search, params],
 *     queryFn: () => fetchUsers(search, params)
 *   })}
 *   onChange={(user) => console.log('Selected:', user)}
 *   defaultValue={123}
 * />
 * 
 * @example
 * // Multiple selection with initialization
 * <EntityTypeAhead
 *   isMulti
 *   initialize
 *   queryParams={{ departmentId: 5 }}
 *   entityQueryOption={(search, params) => ({
 *     queryKey: ['users', search, params],
 *     queryFn: () => fetchUsers(search, params)
 *   })}
 *   onChange={(users) => console.log('Selected:', users)}
 *   defaultValue={[1, 2, 3]}
 * />
 * 
 * @example
 * // With custom entity type
 * interface CustomUser extends EntityBase {
 *   email: string;
 *   role: string;
 * }
 * 
 * <EntityTypeAhead<CustomUser>
 *   entityQueryOption={(search) => ({
 *     queryKey: ['custom-users', search],
 *     queryFn: () => fetchCustomUsers(search)
 *   })}
 *   onChange={(user) => console.log(user?.email)}
 * />
 */
function EntityTypeAhead<Entity extends EntityBase, Filter = void>(
    props: EntityTypeAheadAllProps<Entity, Filter>
) {
    const {
        onChange,
        defaultValue,
        value: controlledValue,
        initialize = false,
        entityQueryOption,
        isMulti = false,
        queryParams,
        placeholder = "Select Entity",
        mapToOptions = mapToOption,
        filterInitialValue = null,
        isDisabled = false,
        label = null,
        error = null
    } = props;


    type SelectEntityType = Entity & SelectOption;

    // Initialize async select with entity query options
    const entityOptions = useAsyncSelect<Entity, Filter>(
        mapToOptions,
        entityQueryOption,
        queryParams
    );

    /**
     * Converts a SelectOption back to an EntityBase object.
     * Used when onChange events fire to convert the internal option format
     * back to the entity format expected by consumers.
     */
    const optionToEntity = useCallback((option: SelectOption & Entity): Entity => ({
        ...option
    }), []);

    const filteredOption = useMemo(() => {

        let filterValue = null;
        if (filterInitialValue) {
            if (isMulti) {
                filterValue = entityOptions.defaultOptions?.filter(filterInitialValue);
            } else {
                filterValue = entityOptions.defaultOptions?.filter(filterInitialValue)?.[0];
            }
        }

        return filterValue;
    }, [entityOptions.defaultOptions, isMulti, filterInitialValue]);


    /**
     * Tracks whether auto-initialization has occurred.
     * Prevents multiple initialization calls if defaultOptions change.
     */
    const hasInitialized = useRef(false);

    /**
     * Calculates the current selected value(s) based on value or defaultValue prop.
     * Finds matching options from defaultOptions by ID.
     * Returns undefined if no value is provided or options aren't loaded yet.
     */
    const defaultOptions = useMemo(() => {
        if (!entityOptions.defaultOptions) return null;


        if (initialize && hasInitialized.current === false && filteredOption && onChange) {
            if (isMulti) {
                (onChange as MultiEntityHandler<Entity>)(filteredOption as Entity[]);
            } else {

                (onChange as SingleEntityHandler<Entity>)(filteredOption as Entity);
            }
            hasInitialized.current = true;
        }

        const valueToUse = defaultValue ?? filteredOption;

        if (defaultValue === undefined || (initialize && filteredOption == null)) return null;
        if (valueToUse === undefined) return undefined;

        if (isMulti && Array.isArray(valueToUse)) {
            const v = valueToUse.map(mapToOption).map(v => v.id);
            const selected = entityOptions.defaultOptions.filter(opt =>
                v.includes(Number(opt.value))
            );
            return selected.length > 0 ? selected : null;
        }

        if (!isMulti) {
            const v = mapToOption(valueToUse as Entity);
            return entityOptions.defaultOptions.find(opt =>
                opt.value === v.value
            ) ?? null;
        }

        return undefined;
    }, [entityOptions.defaultOptions, isMulti, initialize, onChange, filteredOption, defaultValue]);

    /**
     * Calculates the current controlled values based on value or the controlled prop.
     * Finds matching options from defaultOptions by ID.
     * Returns undefined if no value is provided or options aren't loaded yet.
     */
    const valueOptions = useMemo(() => {
        if (!entityOptions.defaultOptions) return null;

        const valueToUse = controlledValue;

        if (controlledValue === null) return null;
        if (valueToUse === undefined) return undefined;

        if (isMulti && Array.isArray(valueToUse)) {
            const v = valueToUse.map(mapToOption).map(v => v.id);
            const selected = entityOptions.defaultOptions.filter(opt =>
                v.includes(Number(opt.value))
            );
            return selected.length > 0 ? selected : null;
        }

        if (!isMulti) {
            const v = mapToOption(valueToUse as Entity);
            return entityOptions.defaultOptions.find(opt =>
                opt.value === v.value
            ) ?? null;
        }

        return undefined;
    }, [entityOptions.defaultOptions, controlledValue, isMulti]);

    /**
     * Handles selection changes from the TypeAheadAsync component.
     * Converts SelectOption format to Entity format and calls the appropriate
     * onChange handler based on single/multi mode.
     */
    const handleEntitySelectionChange = useCallback(
        (selection: SelectOption | SelectOption[] | null) => {
            if (!onChange) return;

            if (isMulti) {
                const selectionData = selection as SelectEntityType[];
                // Multi-select mode: convert array of options to array of entities
                const entities = Array.isArray(selection)
                    ? selectionData.map(optionToEntity)
                    : [];
                (onChange as MultiEntityHandler<Entity>)(entities);
            } else {
                const selectionData = selection as SelectEntityType;
                // Single-select mode: convert single option to entity or null
                const entity = selection && !Array.isArray(selection)
                    ? optionToEntity(selectionData)
                    : null;
                (onChange as SingleEntityHandler<Entity>)(entity);
            }
        },
        [onChange, isMulti, optionToEntity]
    );

    // Shared props for both single and multi TypeAheadAsync components
    const commonProps = {
        isClearable: !initialize,
        placeholder: entityOptions.isLoading ? "Loading..." : placeholder,
        isLoading: entityOptions.isLoading,
        defaultOptions: entityOptions.defaultOptions,
        loadOptions: entityOptions.loadOptions,
        onChange: handleEntitySelectionChange,
        isDisabled,
        size: props.size
    };

    // Render appropriate component based on isMulti flag
    const typeAheadComponent = isMulti ? (
        <TypeAheadAsyncMulti
            key={JSON.stringify((defaultOptions as SelectOption[])?.map(v => v.value))}
            {...commonProps}
            value={valueOptions as SelectOption[] | undefined}
            defaultValue={defaultOptions}
        />
    ) : (
        <TypeAheadAsyncSingle
            key={(defaultOptions as SelectOption)?.value ?? 'empty'}
            defaultValue={defaultOptions}
            {...commonProps}
            value={valueOptions as SelectOption | null | undefined}
        />
    );

    // Conditionally wrap with label and/or error handling
    if (label) {
        if (error) {
            return (
                <FormControl isInvalid={!!error}>
                    <FormLabel label={label} >
                        {typeAheadComponent}
                    </FormLabel>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
            );
        }
        return (
            <FormLabel label={label}>
                {typeAheadComponent}
            </FormLabel>
        );
    }

    // No label, no error - return the component directly
    return typeAheadComponent;
}

export default EntityTypeAhead;