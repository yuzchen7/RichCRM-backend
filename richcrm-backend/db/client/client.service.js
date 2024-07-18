const Client = require("./client.db")

class ClientService {
    async readClient(clientId) {
        const data = await Client.getClientById(clientId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async createClient(client) {
        // Check if the client object is valid
        if (client.clientId === undefined ||
            client.title === undefined ||
            client.firstName === undefined ||
            client.lastName === undefined ||
            client.cellNumber === undefined ||
            client.email === undefined ||
            client.ssn === undefined ||
            client.addressId === undefined) {
            console.log('[CLIENT-Create] Invalid client object');
            return null;
        }

        const data = await Client.createClient(client);
        return data;
    }

    async updateClient(client) {
        // Check if the client object is valid
        if (client.clientId === undefined) {
            console.log('[CLIENT-Update] Invalid client object');
            return null;
        }

        const data = await Client.updateClient(client);
        return data;
    }

    async deleteClient(clientId) {
        const data = await Client.deleteClient(clientId);
        return data;
    }
}

module.exports = new ClientService();