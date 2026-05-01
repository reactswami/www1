import { useCallback, useEffect } from "react";

const useOutsideClick = (
    handler: (node: Element) => void,
) => {
    const memoizedHandler = useCallback(handler, [handler]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            memoizedHandler(event.target as Element);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [memoizedHandler]);
};

export default useOutsideClick;