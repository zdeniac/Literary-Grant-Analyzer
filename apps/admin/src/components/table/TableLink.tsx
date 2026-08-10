import type { LinkProps } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-admin";

type TableLinkProps = {
    to: string;
    children: ReactNode;
} & Omit<LinkProps, 'to' | 'children'>;

export const TableLink = ({
    to,
    children,
    ...props
}: TableLinkProps) => (
    <Link
        {...props}
        to={to}
        style={{ display: 'block' }}
        onClick={event => event.stopPropagation()}
    >
        { children }
    </Link>
);