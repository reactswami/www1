import { Button } from "@statseeker/components/Form";
import { type StandardButtonProps } from "./type";

// Standard button component
export function StandardActionButton({
    buttonAction,
    disabled,
    buttonText,
    type = 'normal'
}: StandardButtonProps) {

    return (
        <Button
            variant={type === 'warning' ? 'danger' : 'primary'}
            isDisabled={disabled}
            onClick={buttonAction}
        >
            {buttonText}
        </Button>
    );
}
