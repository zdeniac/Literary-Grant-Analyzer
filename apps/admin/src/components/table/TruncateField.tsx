import { TextField } from "react-admin";

type TruncateFieldProps = {
    source: string;
    // Width in em
    maxWidth?: number;
};

export const TruncateField = ({source, maxWidth = 30}: TruncateFieldProps) => (
    <TextField
        source={source}
        sx={{
            display: 'inline-block', 
            maxWidth: `${maxWidth}em`,
            whiteSpace: 'nowrap',
            overflow: 'hidden', 
            textOverflow: 'ellipsis'
        }}
    />
);