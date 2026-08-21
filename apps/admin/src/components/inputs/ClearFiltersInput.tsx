import { Button } from 'react-admin';
import { useFormContext } from "react-hook-form";

export const ClearFiltersButton = () => {
    const { reset } = useFormContext();

    const handleClick = () => {
        reset();
    };

    return (
        <Button
            label="Clear filters"
            onClick={handleClick}
        />
    );
};