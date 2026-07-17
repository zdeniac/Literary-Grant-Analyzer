import { Inbox } from "@mui/icons-material";
import { styled, Typography, useThemeProps, Stack } from "@mui/material";
import {
    CreateButton,
    useResourceDefinition,
    useResourceContext,
    useTranslate,
    useGetResourceLabel,
    EmptyClasses,
} from "react-admin";
import { ImportButton } from "../../features/import/components/ImportButton";
import type { ModelName } from "../../features/import/types/import-button.types";

export interface CustomEmptyProps {
    resource?: string;
    hasCreate?: boolean;
    hasImport?: boolean;
    className?: string;
    model?: ModelName;
}

export const CustomEmpty = (inProps: CustomEmptyProps) => {
    const props = useThemeProps({
        props: inProps,
        name: 'RaEmpty',
    });
    const { className } = props;
    const { hasCreate } = useResourceDefinition(props);
    const resource = useResourceContext(props);
    const { hasImport, model } = inProps;

    const translate = useTranslate();

    const getResourceLabel = useGetResourceLabel();
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 0,
        _: resource ? getResourceLabel(resource, 0) : undefined,
    });

    const emptyMessage = translate('ra.page.empty', { name: resourceName });
    const inviteMessage = 'Do you want to add one?';

    const Root = styled('span', {
        name: 'RaEmpty',
        overridesResolver: (props, styles) => styles.root,
    })(({ theme }) => ({
        flex: 1,
        [`& .${EmptyClasses.message}`]: {
            textAlign: 'center',
            margin: '0 1em',
            color: (theme.vars || theme).palette.text.disabled,
        },

        [`& .${EmptyClasses.icon}`]: {
            width: '9em',
            height: '9em',
        },

        [`& .${EmptyClasses.toolbar}`]: {
            textAlign: 'center',
            marginTop: '2em',
        },
    }));

    return (
        <Root className={className}>
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography variant="h4">
                    {translate(`resources.${resource}.empty`, {
                        _: emptyMessage,
                    })}
                </Typography>
                {hasCreate && (
                    <Typography variant="body1" sx={{ padding: 2 }}>
                       { inviteMessage }
                    </Typography>
                )}
            </div>
            <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
            >
                {hasCreate && (
                    <CreateButton variant="contained" />
                )}
                {hasImport && model && (
                    <ImportButton model={model} variant="contained"/>
                )}
            </Stack>
        </Root>
    );
};