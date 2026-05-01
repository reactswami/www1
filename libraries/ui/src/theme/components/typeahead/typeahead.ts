/**
 * Chakra UI theme extension for TypeAhead component.
 * Provides consistent styling that integrates with your Chakra theme.
 *
 */
const DISABLED_COLOR = 'var(--chakra-colors-gray-100)';
const CONTROL_FOCUS_COLOR = 'var(--chakra-colors-blue-500)';
export const TypeAheadTheme = {
    baseStyle: () => {
        return {
            control: {
                minHeight: 0,
                borderRadius: '0.125rem',
                borderColor: 'inherit',
                ':focus-visible': {
                    borderColor: CONTROL_FOCUS_COLOR,
                    boxShadow: `0 0 0 1px ${CONTROL_FOCUS_COLOR}`,
                },
                _disabled: {
                    backgroundColor: 'inherit',
                    cursor: 'not-allowed',
                    borderColor: DISABLED_COLOR,
                    color: DISABLED_COLOR,
                },
                fontSize: 'var(--chakra-fontSizes-sm)',
                fontWeight: 'var(--chakra-fontWeights-normal)',
                color: 'inherit',
                textTransform: 'none',
                width: 'inherit',
            },
            menuPortal: {
                zIndex: 9999,
            },
            menu: {
                width: 'inherit',
                zIndex: 999
            },
            dropdownIndicator: {
                color: '#3d4e61',
                _disabled: {
                    color: DISABLED_COLOR,
                },
                padding: '5px',
                svg: {
                    width: '16px',
                    height: '16px',
                },
            },
            clearIndicator: {
                padding: '6px',
            },
            valueContainer: {
                maxHeight: '35px',
                overflowY: "auto"
            },
            option: {
                selectedBgColor: 'var(--chakra-colors-blue-100)',
                hoverBgColor: 'color-mix(in srgb, transparent, #2196f3 12%)',
                hoverSelectedBgColor: 'color-mix(in srgb, transparent, #2196f3 30%)',
            }
        };
    },
};
