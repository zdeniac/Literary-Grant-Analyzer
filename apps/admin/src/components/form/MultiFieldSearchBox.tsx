import { Box } from "@mui/material";
import { useEffect } from "react";
import { SelectArrayInput, TextInput, useListContext } from "react-admin";
import { useWatch } from "react-hook-form";
import { ClearFiltersButton } from "../inputs/ClearFiltersInput";

type MultiFieldSearchProps<T extends string = string> = {
    fields: readonly T[];
};

export const MultiFieldSearchBox = <T extends string>(
    { fields }: MultiFieldSearchProps<T>, 
) => {
    const { setFilters } = useListContext();

    const search = useWatch({ name: 'q' });
    const selectedFields = useWatch({ name: 'fields' })

    useEffect(() => {
        const value = search?.trim();

        if (!value || !selectedFields?.length) {
            setFilters({});
            return;
        }

        const timer = setTimeout(() => {
            setFilters({
                q: value,
                fields: selectedFields,
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [search, selectedFields, setFilters]);

    return (
        <Box sx={{ display: "flex" }}>
            <Box component="span" sx={{ mr: 2 }}>
                <TextInput
                    resettable
                    source="q"
                    label="Search"
                />
            </Box>
            <Box component="span" sx={{ mr: 2 }}>
                <SelectArrayInput
                    source="fields"
                    choices={fields.map(field => ({
                        id: field,
                        name: field,
                    }))}
                />
            </Box>
            <ClearFiltersButton />
        </Box>
    );
};