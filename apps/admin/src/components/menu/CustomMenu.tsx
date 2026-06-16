import { Menu } from "react-admin";

export const CustomMenu = () => (
    <Menu>
        <Menu.ResourceItem name="organizations" />
        <Menu.ResourceItem name="journals" />
    </Menu>
);