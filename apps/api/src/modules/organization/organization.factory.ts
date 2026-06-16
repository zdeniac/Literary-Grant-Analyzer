import { OrganizationService } from "./organization.service";

export const createOrganizationModule = () => ({
    service: new OrganizationService(),
});