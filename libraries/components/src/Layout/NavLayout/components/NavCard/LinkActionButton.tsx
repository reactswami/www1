import { Button } from "@statseeker/components/Form";
import { Link } from "@tanstack/react-router";
import { type LinkButtonProps } from "./type";

// Link button component
export function LinkActionButton({
    to,
    search,
    disabled,
    buttonText,
    type = 'normal'
}: LinkButtonProps) {

    return (
        <Link to={to} disabled={disabled} search={search ?? true}>
            <Button
                variant="secondary"
                colorScheme={type === 'warning' ? 'red' : undefined}
                isDisabled={disabled}
            >
                {buttonText}
            </Button>
        </Link>
    );
}
