var axios = require('axios');

// Validate address
const standardizeAddress = async (addressLine1, addressLine2, city, state, zipCode) => {
    
    const addresses = addressLine1.split(' ');
    if (isNaN(parseInt(addresses[0]))) {
        return res.status(400).json({
            status: "failed",
            data: [],
            message: 'Address Line 1 must start with a number and follow with the street name, please check and try again'
        });
    }
    const number = addresses[0];
    addresses.shift();
    const street = addresses.join(' ');
    try {
        const res = await axios.get("https://api.radar.io/v1/addresses/validate", {
            params: {
                "countryCode": "US",
                "stateCode": state,
                "city": city,
                "postalCode": zipCode,
                "street": street,
                "number": number
            },
            headers: {
                'Authorization': `${process.env.RADAR_TEST_KEY}`
            }
        });
        if (res.data.meta === undefined ||
            res.data.result.verificationStatus === undefined ||
            res.data.result.verificationStatus === "unverified" ||
            res.data.meta.code !== 200) {
            return null;
        }
        return res.data.address;
    } catch (err) {
        return null;
    }
}

module.exports = {
    standardizeAddress: standardizeAddress,
};