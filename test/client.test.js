const request = require('supertest')
const app = require('./app_test')
require('./config')

describe('Client API', () => {
    
    let token
    const invalid_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODExMGI1Nzg1YTA4MWJiODYyYmNkZDkiLCJpYXQiOjE3NDYwMjg0NTksImV4cCI6MTc0NjAzNTY1OX0.StqfoTIifNMzaZjtY4Xff4QUcItGQKWJNip55DdJz1I'
    let client
    const invalid_id = '1111281cf060c6f2deb1b11k'
    
    beforeAll(async () => {
        const res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'testpassword123',
            autonomous: true
        })
        expect(res.body.token).toBeDefined()
        token = res.body.token
    })

    test('POST /client/create - crea cliente', async () => {
        const res = await request(app).post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestClient',
            email: 'testclient@example.com',
            password: 'test'
        })
        expect(res.statusCode).toBe(403)
    })

    test('POST /client/create - crea cliente', async () => {
        const res = await request(app).post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestClient',
            email: 'testclient@example.com',
            password: 'testpassword123'
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        client = res.body
    })

    test('POST /client/create - crea cliente', async () => {
        const res = await request(app).post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestClient',
            email: 'testclient@example.com',
            password: 'testpassword123'
        })
        expect(res.statusCode).toBe(403)
    })

    test('GET /client - accede con token', async () => {
        const res = await request(app)
            .get('/api/client/')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /client/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /client/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/client/${invalid_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('GET /client/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/client/${client._id}`)
            .set('Authorization', `Bearer ${invalid_token}`)
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /client/update - actualiza client', async () => {
        const res = await request(app)
            .patch('/api/client/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testClientUpdated',
                email: 'testclient@example.com',
                address: 'exampleAdress'
            })
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /client/update - actualiza client', async () => {
        const res = await request(app)
            .patch('/api/client/update')
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                name: 'testClientUpdated',
                email: 'testclient@example.com',
                address: 'exampleAdress'
            })
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /client/update - actualiza client', async () => {
        const res = await request(app)
            .patch('/api/client/update')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('PATCH /client/update - actualiza client', async () => {
        const res = await request(app)
            .patch('/api/client/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testUserUpdated',
                email: 'testclient_1@example.com',
                address: 'exampleAddress'
            })
        expect(res.statusCode).toBe(404)
    })

    test('DELETE /client/delete - elimina client', async () => {
        const res = await request(app)
            .delete('/api/client/delete')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'testclient@example.com'})
        expect(res.statusCode).toBe(200)
    })

    test('DELETE /client/delete - elimina client', async () => {
        const res = await request(app)
            .delete('/api/client/delete')
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({ email: 'testclient@example.com'})
        expect(res.statusCode).toBe(401)
    })

    test('DELETE /client/delete - elimina client', async () => {
        const res = await request(app)
            .delete('/api/client/delete')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('DELETE /client/delete - elimina client', async () => {
        const res = await request(app)
            .delete('/api/client/delete')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'testclient_1@example.com'})
        expect(res.statusCode).toBe(404)
    })

    test('GET /client/archived - accede con token', async () => {
        const res = await request(app)
            .get('/api/client/archived')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /client/recover - recupera clientes archivados', async () => {
        const res = await request(app)
            .patch('/api/client/recover')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'testclient@example.com'
            })
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /client/recover - recupera clientes archivados', async () => {
        const res = await request(app)
            .patch('/api/client/recover')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'testclient_1@example.com'
            })
        expect(res.statusCode).toBe(404)
    })
})