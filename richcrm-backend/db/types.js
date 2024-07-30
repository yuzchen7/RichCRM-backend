// Cast Int to Enum
const castIntToEnum = (enuTable, value) => {
    
    var keys = Object.keys(enuTable).sort(function(a, b){
        return enuTable[a] - enuTable[b];
    }); //sorting is required since the order of keys is not guaranteed.
    
    var getEnum = function(value) {
        return keys[value];
    }

    return getEnum(value);
}

module.exports = {
    // [UTILS]
    castIntToEnum: castIntToEnum,

    // [DB] USER
    userRole: {
        ADMIN: 0,
        ATTORNEY: 1,
        CLIENT: 2,
    },

    // [DB] CASE
    stage: {
        START: 0,
        CONTRACT_PREPARING: 1,
        CONTRACT_SIGNING: 2,
        MORTGAGE: 3,
        CLOSING: 4,
    },

    clientType: {
        BUYER: 0,
        SELLER: 1,
    },

    // [DB] PREMISES
    propertyType: {
        CONDO: 0,
        COOP: 1,
        TOWNHOUSE: 2,
        VACANT_LAND: 3,
    },
    
    maintenanceFeePer: {
        MONTH: 0,
        QUARTER: 1,
        YEAR: 2,
    },

    // [DB] CLIENT
    title: {
        NA: 0,
        MR: 1,
        MRS: 2,
        MS: 3,
        DR: 4,
    },

    gender: {
        NA: 0,
        MALE: 1,
        FEMALE: 2,
    }


};