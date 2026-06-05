import { OrganizationService } from "./organization.service";

export function createOrganizationModule(): { 
    service: OrganizationService,
} {
    const service = new OrganizationService();

    return {
        service,
    };
}