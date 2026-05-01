// ============================================================================
// NavCardContainer.tsx - Container component for NavCard
// ============================================================================

import { Card } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { type NavCardContainerProps } from "./type";

/**
 * Container component that wraps NavCard content
 * Handles three states:
 * 1. Plain card (no action)
 * 2. Clickable card with function action
 * 3. Clickable card with link navigation
 * 
 * @param props - Container configuration
 * @returns Wrapped card component
 * 
 * @example
 * // Plain card
 * <NavCardContainer>
 *   <div>Content</div>
 * </NavCardContainer>
 * 
 * @example
 * // Clickable card
 * <NavCardContainer cardAction={() => console.log('clicked')}>
 *   <div>Content</div>
 * </NavCardContainer>
 * 
 * @example
 * // Link card
 * <NavCardContainer cardAction="/settings">
 *   <div>Content</div>
 * </NavCardContainer>
 */
export function NavCardContainer({
    children,
    className,
    cardAction,
    disable = false
}: NavCardContainerProps) {
    const borderProps = {
        border: '1px solid',
        borderColor: 'gray.100',
        borderRadius: 'sm',
        padding: 4,
        justifyContent: 'center' as const,
        textAlign: 'center' as const,
        flexDirection: 'row' as const,
        gap: '4',
        height: '100%',
        display: 'flex',
        className: className
    };

    // No action - just a plain card
    if (!cardAction) {
        return <Card {...borderProps}>
            {children}
        </Card>;
    }

    // Function action - clickable card
    if (typeof cardAction === 'function') {
        return (
            <Link onClick={disable ? undefined : cardAction} search={true} disabled={disable}>
                <Card {...borderProps}>
                    {children}
                </Card>
            </Link>
        );
    }

    // Link action - wrapped in Link component
    return (
        <Link to={disable ? undefined : cardAction} search={true} disabled={disable}>
            <Card {...borderProps}>
                {children}
            </Card>
        </Link>
    );
}
