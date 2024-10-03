const Organization = require('./organization.db');

class OrganizationService {
    async readOrganization(organizationId) {
        const data = await Organization.getOrganizationById(organizationId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }


    async readAllOrganizations() {
        const data = await Organization.getAllOrganizations();

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readOrganizationsByType(organizationType) {
        const data = await Organization.getOrganizationByType(organizationType);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readOrganizationByKeyWord(keyword) {
        if (keyword === undefined || keyword === "") {
            console.log("[OrganizationService][readOrganizationByKeyWord] Invalid keyword");
            return null;
        }
        const data = await Organization.getOrganizationByKeyword(keyword);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createOrganization(organization) {
        if (organization.organizationId === undefined ||
            organization.organizationType === undefined ||
            organization.organizationName === undefined) {
            console.log("[OrganizationService][createOrganization] Invalid organization");
            return null;
        }
        const data = await Organization.createOrganization(organization);

        return data;
    }

    async updateOrganization(organization) {
        if (organization.organizationId === undefined) {
            console.log("[OrganizationService][updateOrganization] Invalid organization");
            return null;
        }
        const data = await Organization.updateOrganization(organization);

        return data;
    }

    async deleteOrganization(organizationId) {
        const data = await Organization.deleteOrganization(organizationId);

        return data;
    }

}

module.exports = new OrganizationService();