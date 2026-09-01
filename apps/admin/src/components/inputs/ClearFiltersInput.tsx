import { Button, useListContext } from 'react-admin';
import { useFormContext } from "react-hook-form";

export const ClearFiltersButton = () => {
    const { reset } = useFormContext();
    const { setFilters } = useListContext();

    const handleClick = () => {
        reset();
        setFilters({});
    };

    return (
        <Button
            label="Clear filters"
            onClick={handleClick}
        />
    );
};