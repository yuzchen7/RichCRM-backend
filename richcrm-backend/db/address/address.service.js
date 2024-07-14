const Address = require('./address.db');

class AddressService {
    async readAddress (addressId) {
        const data = await Address.getAddressById(addressId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllAddresses () {
        const data = await Address.getAllAddresses();

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllAddressesBatch (addressIds) {
        const data = await Address.queryAllAddressesBatch(addressIds);

        if (data.Responses !== undefined) {
            return data.Responses.Address;
        }

        return null;
    }

    async createAddress (address) {
        // Check if the address object is valid
        if (address.addressId === undefined ||
            address.addressLine1 === undefined ||
            address.city === undefined ||
            address.state === undefined ||
            address.zipCode === undefined) {
            console.log('[ADDRESS-Create] Invalid address object');
            return null;
        }

        const data = await Address.createAddress(address);
        return data;
    }

    async updateAddress (address) {
        // Check if the address object is valid
        if (address.addressId === undefined) {
            console.log('[ADDRESS-Update] Invalid address object');
            return null;
        }

        const data = await Address.updateAddress(address);
        return data;
    }

    async deleteAddress (addressId) {
        // Check if the address ID is valid
        if (addressId === undefined) {
            console.log('[ADDRESS-Delete] Invalid address ID');
            return null;
        }

        const data = await Address.deleteAddress(addressId);
        return data;
    }
}

module.exports = new AddressService();