const request = require('supertest')
const app = require('./app_test')
require('./config')

describe('Proyect API', () => {
    
    let token
    const invalid_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODExMGI1Nzg1YTA4MWJiODYyYmNkZDkiLCJpYXQiOjE3NDYwMjg0NTksImV4cCI6MTc0NjAzNTY1OX0.StqfoTIifNMzaZjtY4Xff4QUcItGQKWJNip55DdJz1I'
    let client
    const invalid_id = '1111281cf060c6f2deb1b11k'
    let project
    
    beforeAll(async () => {
        const user_res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'testpassword123'
        })
        expect(user_res.body.token).toBeDefined()
        token = user_res.body.token

        const client_res = await request(app).post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestClient',
            email: 'testclient@example.com',
            password: 'testpassword123'
        })
        expect(client_res.body).toBeDefined()
        client = client_res.body
    })

    test('POST /project/create - crea proyecto', async () => {
        const res = await request(app).post('/api/project/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestProject',
        })
        expect(res.statusCode).toBe(403)
    })

    test('POST /project/create - crea proyecto', async () => {
        const res = await request(app).post('/api/project/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestProject',
            client_email: client.email,
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        project = res.body
    })

    test('POST /project/create - crea proyecto', async () => {
        const res = await request(app).post('/api/project/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestProject',
            client_email: client.email,
        })
        expect(res.statusCode).toBe(403)
    })

    test('POST /project/create - crea proyecto', async () => {
        const res = await request(app).post('/api/project/create')
        .set('Authorization', `Bearer ${invalid_token}`)
        .send({
            name: 'TestProject',
            client_email: client.email,
        })
        expect(res.statusCode).toBe(401)
    })
    
    test('POST /project/create - crea proyecto', async () => {
        const res = await request(app).post('/api/project/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TestProject',
            client_email: 'fakeclient@gmail.com',
        })
        expect(res.statusCode).toBe(403)
    })

    test('GET /project/ - accede con token', async () => {
        const res = await request(app)
            .get('/api/project/')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /project/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /project/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/project/${invalid_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('GET /project/:id - accede con token', async () => {
        const res = await request(app)
            .get(`/api/project/${project._id}`)
            .set('Authorization', `Bearer ${invalid_token}`)
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /project/update/:id - actualiza project', async () => {
        const res = await request(app)
            .patch(`/api/project/update/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testProjectUpdated'
            })
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /project/update/:id - actualiza project', async () => {
        const res = await request(app)
            .patch(`/api/project/update/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('PATCH /project/update/:id - actualiza project', async () => {
        const res = await request(app)
            .patch(`/api/project/update/${project._id}`)
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                name: 'testProjectUpdated'
            })
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /project/update/:id - actualiza project', async () => {
        const res = await request(app)
            .patch(`/api/project/update/${invalid_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'testProjectUpdated'
            })
        expect(res.statusCode).toBe(403 )
    })

    test('DELETE /project/delete/ - elimina project', async () => {
        const res = await request(app)
            .delete(`/api/project/delete/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'TestProjectUpdated'
            })
        expect(res.statusCode).toBe(200)
    })

    test('DELETE /project/delete/ - elimina project', async () => {
        const res = await request(app)
            .delete(`/api/project/delete/`)
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                name: 'TestProjectUpdated'
            })
        expect(res.statusCode).toBe(401)
    })

    test('DELETE /project/delete/ - elimina project', async () => {
        const res = await request(app)
            .delete(`/api/project/delete/`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('GET /project/archived - accede con token', async () => {
        const res = await request(app)
            .get('/api/project/archived')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /project/recover/ - recupera project archivado', async () => {
        const res = await request(app)
            .patch(`/api/project/recover/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'TestProjectUpdated'
            })
        expect(res.statusCode).toBe(200)
    })

    test('PATCH /project/recover/ - recupera project archivados', async () => {
        const res = await request(app)
            .patch(`/api/project/recover/`)
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                name: 'TestProjectUpdated'
            })
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /project/recover/ - recupera project archivados', async () => {
        const res = await request(app)
            .patch(`/api/project/recover/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'fakeProject'
            })
        expect(res.statusCode).toBe(404)
    })
})