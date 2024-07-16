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
    // TBD
}

module.exports = new Premises();