/**
 * Author: Eden Wu
 * Date: 2024-07-13
 * Database Model of Premises
 * 
 * @typedef {object} Premises
 * @property {string} PremisesId - Premises ID
 * @property {string} Name - Premises name
 * @property {string} AddressId - Foreign key to Address
 * @property {int} Block - Block number
 * @property {int} Lot - Lot number
 * @property {int} Section - Section number
 * @property {propertyType} PropertyType - Condo, Co-op, Townhouse, Vacant Land
 * @property {boolean} VacantAtClosing - Is this premises vacant at closing?
 * @property {boolean} SubjectToTenancy - Is this premises subject to tenancy?
 * @property {boolean} HOA - Is this premises subject to HOA?
 * @property {int} ParkingSpaces - Number of parking spaces
 * @property {int} MaintenanceFee - Unit maintenance fee
 * @property {maintenanceFeePer} MaintenanceFeePer - Maintenance fee per (month, quarter, year)
 * @property {int} Assessments - Assessments fee
 * @property {string} AssessmentsPaidById - Foreign key to User who paid assessments
 * @property {string} ManagingCompany - Name of managing company
 * @property {boolean} IsTwoFamily - Is this premises a two-family house?
 * @property {string} TwoFamilyFirstFloorTenantId - Foreign key to Client
 * @property {string} TwoFamilySecondFloorTenantId - Foreign key to Client
 */

const db = require('../dynamodb');
const {propertyType, maintenanceFeePer} = require("../types");

class Premises {
    constructor() {
        this.table = 'Premises';
    }

    async getPremisesById(premisesId) {
        const params = {
            TableName: this.table,
            Key: {
                PremisesId: premisesId,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async getPremisesByAddressId(addressId) {
        const params = {
            TableName: this.table,
            FilterExpression: 'AddressId = :a',
            ExpressionAttributeValues: {
                ':a': addressId,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async createPremises(premises) {
        // Check if the premises object is valid

        const params = {
            TableName: this.table,
            Item: {
                PremisesId: premises.premisesId,
                Name: premises.name,
                AddressId: premises.addressId,
                Block: premises.block,
                Lot: premises.lot,
                Section: premises.section,
                PropertyType: premises.propertyType,
                VacantAtClosing: premises.vacantAtClosing,
                SubjectToTenancy: premises.subjectToTenancy,
                HOA: premises.hoa,
                ParkingSpaces: premises.parkingSpaces,
                MaintenanceFee: premises.maintenanceFee,
                MaintenanceFeePer: premises.maintenanceFeePer,
                Assessments: premises.assessments,
                AssessmentsPaidById: premises.assessmentsPaidById,
                ManagingCompany: premises.managingCompany,
                IsTwoFamily: premises.isTwoFamily,
                TwoFamilyFirstFloorTenantId: premises.twoFamilyFirstFloorTenantId,
                TwoFamilySecondFloorTenantId: premises.twoFamilySecondFloorTenantId,
            },
        };
        await db.put(params).promise();
        return params.Item;
    }

    async updatePremises(premises) {
        console.log(premises);
        const params = {
            TableName: this.table,
            Key: {
                PremisesId: premises.premisesId,
            },
            UpdateExpression: 'set #n = :n, AddressId = :a, PropertyType = :p',
            ExpressionAttributeNames: {
                '#n': 'Name',
                '#b': 'Block',
                '#l': 'Lot',
                '#s': 'Section',
                '#h': 'HOA',
                '#as': 'Assessments',
            },
            ExpressionAttributeValues: {
                ':n': premises.name,
                ':a': premises.addressId,
                ':p': premises.propertyType,
            },
            ReturnValues: "UPDATED_NEW",
        };

        // Optional fields
        if (premises.block !== undefined)  { 
            params.ExpressionAttributeValues[':b'] = premises.block;
            params.UpdateExpression  += ", #b = :b"; 
        }
        if (premises.lot !== undefined)  { 
            params.ExpressionAttributeValues[':l'] = premises.lot;
            params.UpdateExpression  += ", #l = :l";
        }
        if (premises.section !== undefined)  {
            params.ExpressionAttributeValues[':s'] = premises.section;
            params.UpdateExpression  += ", #s = :s";
        }
        if (premises.vacantAtClosing !== undefined)  {
            params.ExpressionAttributeValues[':v'] = premises.vacantAtClosing;
            params.UpdateExpression  += ", VacantAtClosing = :v";
        }
        if (premises.subjectToTenancy !== undefined)  {
            params.ExpressionAttributeValues[':st'] = premises.subjectToTenancy;
            params.UpdateExpression  += ", SubjectToTenancy = :st";
        }
        if (premises.hoa !== undefined)  {
            params.ExpressionAttributeValues[':h'] = premises.hoa;
            params.UpdateExpression  += ", #h = :h";
        }
        if (premises.parkingSpaces !== undefined)  {
            params.ExpressionAttributeValues[':ps'] = premises.parkingSpaces;
            params.UpdateExpression  += ", ParkingSpaces = :ps";
        }
        if (premises.maintenanceFee !== undefined)  {
            params.ExpressionAttributeValues[':mf'] = premises.maintenanceFee;
            params.UpdateExpression  += ", MaintenanceFee = :mf";
        }
        if (premises.maintenanceFeePer !== undefined)  {
            params.ExpressionAttributeValues[':mfp'] = premises.maintenanceFeePer;
            params.UpdateExpression  += ", MaintenanceFeePer = :mfp";
        }
        if (premises.assessments !== undefined)  {
            params.ExpressionAttributeValues[':as'] = premises.assessments;
            params.UpdateExpression  += ", #as = :as";
        }
        if (premises.assessmentsPaidById !== undefined)  {
            params.ExpressionAttributeValues[':ap'] = premises.assessmentsPaidById;
            params.UpdateExpression  += ", AssessmentsPaidById = :ap";
        }
        if (premises.managingCompany !== undefined)  {
            params.ExpressionAttributeValues[':mc'] = premises.managingCompany;
            params.UpdateExpression  += ", ManagingCompany = :mc";
        }
        if (premises.isTwoFamily !== undefined)  {
            params.ExpressionAttributeValues[':itf'] = premises.isTwoFamily;
            params.UpdateExpression  += ", IsTwoFamily = :itf";
        }
        if (premises.twoFamilyFirstFloorTenantId !== undefined)  {
            params.ExpressionAttributeValues[':tff'] = premises.twoFamilyFirstFloorTenantId;
            params.UpdateExpression  += ", TwoFamilyFirstFloorTenantId = :tff";
        }
        if (premises.twoFamilySecondFloorTenantId !== undefined)  {
            params.ExpressionAttributeValues[':tfs'] = premises.twoFamilySecondFloorTenantId;
            params.UpdateExpression  += ", TwoFamilySecondFloorTenantId = :tfs";
        }

        const data = await db.update(params).promise();

        return data.Attributes;
    }

    async deletePremises(premisesId) {
        const params = {
            TableName: this.table,
            Key: {
                PremisesId: premisesId,
            },
        };
        const data = await db.delete(params).promise();
        return data;
    }
}

module.exports = new Premises();