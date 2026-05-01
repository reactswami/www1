import { Box, Flex } from '@chakra-ui/react';
import React, { memo, forwardRef } from 'react';
import { CONTAINER_WIDTHS } from '../../utils';
import SearchInputPanel from '../SearchInputPanel/SearchInputPanel';
import SearchPanel from '../SearchPanel/SearchPanel';

type SearchPortalContentProps = {
    isOpen: boolean;
    isMobile: boolean;
    isIconMode: boolean;
    position: { top: number; left: number };
    inputPanelProps: { isOpen: boolean; onOpen: () => void; onClose: () => void };
};
// Separate component for search portal content
const SearchPortalContent = memo(
    forwardRef(
        (
            { isOpen, isMobile, position, inputPanelProps, isIconMode }: SearchPortalContentProps,
            ref: React.LegacyRef<HTMLDivElement>
        ) => (
            <Box
                ref={ref}
                position="fixed"
                top={`${position.top}px`}
                {...!isMobile && { left: isIconMode ? `calc(${position.left}px - ${CONTAINER_WIDTHS.OPEN} - ${CONTAINER_WIDTHS.INPUT_MARGIN})` : `calc(${position.left}px - ${CONTAINER_WIDTHS.OPEN} + ${CONTAINER_WIDTHS.INPUT_WIDTH})` }}
                zIndex="overlay"
                width={isMobile ? 'stretch' : undefined}
                minWidth={!isMobile ? CONTAINER_WIDTHS.OPEN : undefined}
                id="gb-search-content"
            >
                <Flex height="100%" gap={0} flexDirection={'column'}>
                    {<SearchInputPanel {...inputPanelProps} />}
                    {isOpen && <SearchPanel />}
                </Flex>
            </Box>
        )
    )
);

SearchPortalContent.displayName = 'SearchPortalContent';

export default SearchPortalContent;