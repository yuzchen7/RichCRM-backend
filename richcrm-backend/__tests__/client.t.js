import request from 'supertest';
import express from 'express';
import clientRouter from '../routes/v1/client';
import bodyParser from 'body-parser';

const app = new express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/v1/client', clientRouter);

var testClientId;

const clientObj = {
    clientId: "d5dbbca5-808c-4df8-b51b-b09b1cb595bd",
    clientType: 0,
    firstName: "John",
    lastName: "Doe",
    cellNumber: "1234567891",
    email: "john.doe@hotmail.com"
}

describe('Client Routes', function () {

    test('/client/register', async () => {
        const res = await request(app).post('/v1/client/register')
            .send(clientObj)
            .set('Accept', 'application/json');
        
        if (res.body.data) testClientId = res.body.data[0].clientId;
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].clientType).toEqual(clientObj.clientType);
        expect(res.body.data[0].firstName).toEqual(clientObj.firstName);
        expect(res.body.data[0].lastName).toEqual(clientObj.lastName);
        expect(res.body.data[0].cellNumber).toEqual(clientObj.cellNumber);
        expect(res.body.data[0].email).toEqual(clientObj.email);
    });

    
    test('client/query', async () => {
        const res = await request(app).post('/v1/client/query')
            .send({ keyword: clientObj.email })
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].firstName).toEqual(clientObj.firstName);
    });

    test('client/:clientId', async () => {
        const res = await request(app).get(`/v1/client/${testClientId}`);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].clientId).toEqual(testClientId);
    });

    test('client/delete', async () => {
        const res = await request(app).post('/v1/client/delete')
            .send({ clientId: testClientId })
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });
});