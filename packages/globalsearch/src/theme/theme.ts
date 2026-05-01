import { extendTheme } from '@chakra-ui/react';
import { theme } from '@statseeker/ui/theme';

const searchTheme = extendTheme(theme, {
    colors: {
        search: {
            selectedBg: "color-mix(in srgb, transparent, #2196f3 20%)",
            selectedColor: "white",
            body: "var(--chakra-colors-gray-800)",
            hoverbg: 'color-mix(in srgb, transparent, #2196f3 12%)',
            hoverSelectedBg: 'color-mix(in srgb, transparent, #2196f3 30%)',
            hovercolor: 'white',
            subText: 'var(--chakra-colors-gray-800)',
            highlightText: 'var(--chakra-colors-search-highlightText)',
            highlightBg: 'var(--chakra-colors-yellow-200)',
            actionColor: 'var(--chakra-colors-blue-600)',
        },
    },
});

export default searchTheme;