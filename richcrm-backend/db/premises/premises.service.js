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
        if (p.PremisesId === undefined ||
            p.Name === undefined ||
            p.AddressId === undefined ||
            p.PropertyType === undefined) {
            console.log("[PREMISES-Create] Invalid premises object");
            return null;
        }

        const data = await Premises.createPremises(p);
        return data.Item;
    }

    async updatePremises(p) {
        // Check if the premises object is valid
        if (p.PremisesId === undefined ||
            p.Name === undefined ||
            p.AddressId === undefined ||
            p.PropertyType === undefined ||
            p.Block === undefined ||
            p.Lot === undefined ||
            p.Section === undefined ||
            p.VacantAtClosing === undefined ||
            p.SubjectToTenancy === undefined ||
            p.HOA === undefined ||
            p.ParkingSpaces === undefined ||
            p.MaintenanceFee === undefined ||
            p.MaintenanceFeePer === undefined ||
            p.Assessments === undefined ||
            p.AssessmentsPaidById === undefined ||
            p.ManagingCompany === undefined ||
            p.IsTwoFamily === undefined
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