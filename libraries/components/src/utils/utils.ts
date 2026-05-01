import {
    type StylesConfig,
} from 'react-select';
/**
 * Converts Chakra UI theme styles to React Select compatible styles.
 * 
 * @template IsMulti - Boolean indicating if multiple selections are allowed
 * @param chakraTheme - The Chakra UI theme object
 * @param customStyles - Optional custom style overrides
 * @returns React Select StylesConfig object
 */
export function getReactSelectStyles<IsMulti extends boolean, Option extends { label: string; value: string | number }>(
    chakraTheme: any,
    customStyles?: StylesConfig<Option, IsMulti>
): StylesConfig<Option, IsMulti> {
    const baseStyle = chakraTheme?.components?.TypeAhead?.baseStyle?.() || {};

    return {
        control: (base, state) => ({
            ...base,
            ...(baseStyle.control || {}),
            ...(state.isFocused && baseStyle?.control?._focus),
            ...(state.isDisabled && baseStyle?.control?._disabled),
            ...(customStyles?.control as any)?.(base, state),
        }),
        menu: (base, state) => ({
            ...base,
            ...(baseStyle.menu || {}),
            ...(customStyles?.menu as any)?.(base, state),
        }),
        menuPortal: (base, state) => ({
            ...base,
            ...(baseStyle.menuPortal || {}),
            ...(customStyles?.menuPortal as any)?.(base, state),
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            ...(baseStyle.dropdownIndicator || {}),
            ...(state.isDisabled && baseStyle?.control?._disabled),
            ...(customStyles?.dropdownIndicator as any)?.(base, state),
        }),
        clearIndicator: (base, state) => ({
            ...base,
            ...(baseStyle.clearIndicator || {}),
            ...(customStyles?.clearIndicator as any)?.(base, state),
        }),
        valueContainer: (base, state) => ({
            ...base,
            ...(baseStyle.valueContainer || {}),
            ...(customStyles?.valueContainer as any)?.(base, state),
        }),
        option: (base, state) => ({
            ...base,
            ...(baseStyle.option || {}),
            backgroundColor: state.isSelected && state.isFocused ? baseStyle?.option?.hoverSelectedBgColor : state.isSelected ? baseStyle?.option?.selectedBgColor : state.isFocused ? baseStyle?.option?.hoverBgColor : 'white',
            color: 'black',
            ...(customStyles?.valueContainer as any)?.(base, state),
        }),
        placeholder: (provided, state) => ({
            ...provided,
            ...(state.isDisabled && baseStyle?.control?._disabled),
        }),
    };
}
