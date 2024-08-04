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
        SETUP: 0,
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
    },

    // [DB] STAGE
    stageDefaultTaskList: {
        SETUP: [
            {
                taskType: 0,
                name: "Case set up",
                status: 0,
            },
            {
                taskType: 2,
                name: "Inspection report",
                status: 0,
            },
            {
                taskType: 1,
                name: "Confirm case details",
                status: 0,
                templates: [
                    {templateTitle: "Test Email Template 1"},
                    {templateTitle: "Test Email Template 2"},
                ]
            },
        ],
        CONTRACT_PREPARING: [],
        CONTRACT_SIGNING: [],
        MORTGAGE: [],
        CLOSING: []
    },
    

    // [DB] TASK
    taskType: {
        ACTION: 0,
        CONTACT: 1,
        UPLOAD: 2,
    },

    status: {
        NOT_STARTED: 0,
        PENDING: 1,
        FINISHED: 2,
        OVERDUE: 3,
    }
};