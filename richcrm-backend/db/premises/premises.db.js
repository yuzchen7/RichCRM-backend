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
                PremisesId: premises.PremisesId,
                Name: premises.Name,
                AddressId: premises.AddressId,
                Block: premises.Block,
                Lot: premises.Lot,
                Section: premises.Section,
                PropertyType: premises.PropertyType,
                VacantAtClosing: premises.VacantAtClosing,
                SubjectToTenancy: premises.SubjectToTenancy,
                HOA: premises.HOA,
                ParkingSpaces: premises.ParkingSpaces,
                MaintenanceFee: premises.MaintenanceFee,
                MaintenanceFeePer: premises.MaintenanceFeePer,
                Assessments: premises.Assessments,
                AssessmentsPaidById: premises.AssessmentsPaidById,
                ManagingCompany: premises.ManagingCompany,
                IsTwoFamily: premises.IsTwoFamily,
                TwoFamilyFirstFloorTenantId: premises.TwoFamilyFirstFloorTenantId,
                TwoFamilySecondFloorTenantId: premises.TwoFamilySecondFloorTenantId,
            },
        };
        const data = await db.put(params).promise();
        return data;
    }

    async updatePremises(premises) {

        const params = {
            TableName: this.table,
            Key: {
                PremisesId: premises.PremisesId,
            },
            UpdateExpression: 'set #n = :n, AddressId = :a, Block = :b, \
            Lot = :l, Section = :s, PropertyType = :p, VacantAtClosing = :v, \
            SubjectToTenancy = :st, HOA = :h, ParkingSpaces = :ps, \
            MaintenanceFee = :mf, MaintenanceFeePer = :mfp, Assessments = :as, \
            AssessmentsPaidById = :ap, ManagingCompany = :mc, IsTwoFamily = :itf, \
            TwoFamilyFirstFloorTenantId = :tff, TwoFamilySecondFloorTenantId = :tfs',
            ExpressionAttributeNames: {
                '#n': 'Name',
            },
            ExpressionAttributeValues: {
                ':n': premises.Name,
                ':a': premises.AddressId,
                ':b': premises.Block,
                ':l': premises.Lot,
                ':s': premises.Section,
                ':p': premises.PropertyType,
                ':v': premises.VacantAtClosing,
                ':st': premises.SubjectToTenancy,
                ':h': premises.HOA,
                ':ps': premises.ParkingSpaces,
                ':mf': premises.MaintenanceFee,
                ':mfp': premises.MaintenanceFeePer,
                ':as': premises.Assessments,
                ':ap': premises.AssessmentsPaidById,
                ':mc': premises.ManagingCompany,
                ':itf': premises.IsTwoFamily,
                ':tff': premises.TwoFamilyFirstFloorTenantId,
                ':tfs': premises.TwoFamilySecondFloorTenantId,
            },
            ReturnValues: "UPDATED_NEW",
        };
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
        await db.delete(params).promise();
    }
}

module.exports = new Premises();