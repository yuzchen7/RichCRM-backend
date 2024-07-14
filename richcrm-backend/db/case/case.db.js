/**
 * Author: Eden Wu
 * Date: 2024-07-11
 * Database Model of Case
 * 
 * @typedef {object} Case
 * @property {string} CaseId - Case ID
 * @property {string} PremisesId - Foreign key to Premises
 * @property {enum} ClientType - Is this case for buyside or sellside clients?
 * @property {string} BuyerIds - Foreign key to Buyers
 * @property {string} SellerIds - Foreign key to Sellers
 * @property {Date} CreateAt - When this case was created
 * @property {Date} ClosingDate - When this case was closed
 */

const db = require('../dynamodb');

class Case {
    // TBD
}

module.exports = new Case();