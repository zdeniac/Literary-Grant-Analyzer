import { Edit, type EditProps } from "react-admin";

export const CustomEdit = (props: EditProps) => (
    <Edit 
        {...props} 
        mutationMode="pessimistic" 
        redirect={false}
    />
);