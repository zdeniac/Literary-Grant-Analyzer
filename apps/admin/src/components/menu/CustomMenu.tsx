import { Menu } from "react-admin";

export const CustomMenu = () => (
    <Menu>
        <Menu.ResourceItem name="organizations" />
        <Menu.ResourceItem name="persons" />
        <Menu.ResourceItem name="journals" />
        <Menu.ResourceItem name="decision-authorities" />
        <Menu.ResourceItem name="award-schemes" />
        <Menu.ResourceItem name="award-decisions" />
        <Menu.ResourceItem name="source-documents" />
        <Menu.ResourceItem name="import-jobs" />
    </Menu>
);