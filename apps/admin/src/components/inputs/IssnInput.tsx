import { TextInput, type TextInputProps } from "react-admin";

export const IssnInput = (props: TextInputProps) => (
    <TextInput
        {...props}
        slotProps={{
            htmlInput: {
                maxLength: 9,
            },
        }}        
        parse={(value?: string) =>
            value
                ?.replace(/\D/g, '')
                .slice(0, 8)
        }
        format={(value?: string) => {
            if (!value) {
                return '';
            }

            const digits = value.replace(/\D/g, '').slice(0, 8);

            return digits.length > 4
                ? `${digits.slice(0, 4)}-${digits.slice(4)}`
                : digits;
        }}
    />
);