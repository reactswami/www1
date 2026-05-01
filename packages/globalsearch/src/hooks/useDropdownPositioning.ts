import React, { useCallback, useEffect, useState } from "react";


const useDropdownPositioning = (
    dropdownRef: React.RefObject<HTMLDivElement>,
    isOpen: boolean,
    offsetTop: number,
    offsetLeft: number

) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (!dropdownRef.current) return;

        setPosition({
            top: offsetTop,
            left: offsetLeft,
        });
    }, [dropdownRef, offsetLeft, offsetTop]);

    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        let resizeTimeout: any;
        let scrollTimeout: any;

        const throttledResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updatePosition, 16);
        };

        const throttledScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updatePosition, 16);
        };

        window.addEventListener('resize', throttledResize);
        window.addEventListener('scroll', throttledScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', throttledResize);
            window.removeEventListener('scroll', throttledScroll);
            clearTimeout(resizeTimeout);
            clearTimeout(scrollTimeout);
        };
    }, [isOpen, updatePosition]);

    return position;
};

export default useDropdownPositioning;