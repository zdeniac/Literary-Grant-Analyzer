import { Layout } from "react-admin";
import { CustomMenu } from "./components/menu/CustomMenu";
import type { ReactNode } from "react";

export const CustomLayout = ({ children }: { children: ReactNode }) => (
    <Layout menu={CustomMenu}>
        {children}
    </Layout>
);