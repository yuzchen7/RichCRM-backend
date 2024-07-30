const Premises = require("./premises.db");

class PremisesService {
    async readPremises(premisesId) {
        const data = await Premises.getPremisesById(premisesId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readPremisesByAddressId(addressId) {
        const data = await Premises.getPremisesByAddressId(addressId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createPremises(p) {
        // Check if the premises object is valid
        if (p.premisesId === undefined ||
            p.name === undefined ||
            p.addressId === undefined ||
            p.propertyType === undefined) {
            console.log("[PREMISES-Create] Invalid premises object");
            return null;
        }

        const data = await Premises.createPremises(p);
        return data;
    }

    async updatePremises(p) {
        // Check if the premises object is valid
        if (p.premisesId === undefined ||
            p.name === undefined ||
            p.addressId === undefined ||
            p.propertyType === undefined
        ) {
            console.log("[PREMISES-Update] Invalid premises object");
            return null;
        }

        const data = await Premises.updatePremises(p);
        return data;
    }

    async deletePremises(premisesId) {
        // Check if the premises ID is valid
        if (premisesId === undefined) {
            console.log("[PREMISES-Delete] Invalid premises ID");
            return null;
        }

        const data = await Premises.deletePremises(premisesId);
        return data;
    }
}

module.exports = new PremisesService();