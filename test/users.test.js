const request = require('supertest')
const app = require('./app_test')
require('./config')

describe('Users API', () => {
    
    let token
    let code
    const invalid_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODExMGI1Nzg1YTA4MWJiODYyYmNkZDkiLCJpYXQiOjE3NDYwMjg0NTksImV4cCI6MTc0NjAzNTY1OX0.StqfoTIifNMzaZjtY4Xff4QUcItGQKWJNip55DdJz1I'
    
    test('POST /users/register - crea usuario', async () => {
        const res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'testpassword123'
        })
        expect(res.statusCode).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user).toBeDefined()
        token = res.body.token
        code = res.body.user.code
        console.log(`✅--------${code}`)
    })

    test('POST /users/register - crea usuario', async () => {
        const res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'test'
        })
        expect(res.statusCode).toBe(403)
    })

    test('POST /users/login - login correcto y guarda token', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'testpassword123'
        })
        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBeDefined()
        token = res.body.token
    })

    test('POST /users/login - login correcto y guarda token', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'testpassword121'
        })
        expect(res.statusCode).toBe(403)
    })

    test('POST /users/login - login correcto y guarda token', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'testuser_1@example.com',
            password: 'testpassword123'
        })
        expect(res.statusCode).toBe(404)
    })

    test('GET /users - accede con token', async () => {
        const res = await request(app)
            .get('/api/users/')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('PUT /users/validation - valida user', async () => {
        const res = await request(app)
            .put('/api/users/validation')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testUserUpdated',
                email: 'testuser@example.com',
                code: code
            })
        expect(res.statusCode).toBe(200)
    })

    test('PUT /users/validation - valida user', async () => {
        const res = await request(app)
            .put('/api/users/validation')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testUserUpdated',
                email: 'testuser@example.com',
                code: 123456
            })
        expect(res.statusCode).toBe(403)
    })

    test('PATCH /users/update - actualiza user', async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testUserUpdated',
                lastName: 'lastUse',
                nif: '123456789',
                address: 'exampleAdress'
            })
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /users/update - actualiza user', async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testUserUpdated',
                lastName: 'lastUse'
            })
        expect(res.statusCode).toBe(403)
    })

    test('DELETE /users/delete - elimina user', async () => {
        const res = await request(app)
            .delete('/api/users/delete')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('DELETE /users/delete - elimina user', async () => {
        const res = await request(app)
            .delete('/api/users/delete')
            .set('Authorization', `Bearer ${invalid_token}`)
        expect(res.statusCode).toBe(401)
    })
})