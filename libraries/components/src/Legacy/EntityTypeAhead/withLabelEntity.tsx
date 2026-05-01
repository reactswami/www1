import { FormControl } from '@chakra-ui/react';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { type ComponentType, type ReactElement } from 'react';
import EntityTypeAhead from './EntityTypeAhead';
import { type EntityBase, type EntityTypeAheadAllProps } from './type';

interface LabelConfig {
    label: string;
    withFormControl?: boolean;
};

/**
 * Higher-Order Component that wraps EntityTypeAhead with a label.
 * Returns a new component with the label configuration baked in.
 * 
 * @example
 * const PollerSelect = withLabel<PollerListItem, never>({ 
 *   label: 'Pollers', 
 * });
 * 
 * <PollerSelect
 *   entityQueryOption={getAllPollers}
 *   isMulti={true}
 *   onChange={(entities) => console.log(entities)}
 * />
 */
function withLabelEntity<Entity extends EntityBase, Filter = void>(
    config?: LabelConfig
): ComponentType<EntityTypeAheadAllProps<Entity, Filter>> {
    const { label = "Select Poller", withFormControl = false } = config ?? {};

    return function LabeledEntityTypeAhead(
        props: EntityTypeAheadAllProps<Entity, Filter>
    ): ReactElement {
        const typeAhead = (
            <FormLabel label={label}>
                <EntityTypeAhead<Entity, Filter> {...props} placeholder='Select...' />
            </FormLabel>
        );

        if (!withFormControl) {
            return typeAhead;
        }

        return (
            <FormControl>
                {typeAhead}
            </FormControl>

        );
    };
}

export default withLabelEntity;