const request = require('supertest')
const app = require('./app_test')
require('./config')

describe('Deliverynote API', () => {
    let token
    let client
    let project
    let deliverynote
    const invalid_token = 'invalid.token.value'
    const invalid_id = '1111281cf060c6f2deb1b11k'

    beforeAll(async () => {
        const user_res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'deliverynoteuser@example.com',
            password: 'testpassword123',
            autonomous: true
        })
        token = user_res.body.token

        const user2_res = await request(app).post('/api/users/register').send({
            name: 'TestUser',
            email: 'deliverynoteuser2@example.com',
            password: 'testpassword123',
            autonomous: true
        })
        token2 = user2_res.body.token

        const client_res = await request(app).post('/api/client/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'TestClient',
                email: 'deliveryclient@example.com',
                password: 'testpassword123'
            })
        client = client_res.body

        const project_res = await request(app).post('/api/project/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'project_1A',
                projectCode: "01",
                client_email: client.email
            })
        project = project_res.body

        const deliverynote_res = await request(app).post('/api/deliverynote/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
            project_name: "project_1A",
            number: "02",
            people: [{
                name: "Juan Piedra",
                rol: "transportista",
                hours: "8"
            }],
            materials: [{
                name: "Placas Aluminio",
                units: "20"
            }]
        })
        deliverynoteToDelete = deliverynote_res.body
    })

    test('POST /deliverynote/create - crear deliverynote', async () => {
        const res = await request(app).post('/api/deliverynote/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                project_name: "project_1A",
                number: "01",
                people: [{
                    name: "Juan Piedra",
                    rol: "transportista",
                    hours: "8"
                }],
                materials: [{
                    name: "Placas Aluminio",
                    units: "20"
                }]
            })
        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        deliverynote = res.body
    })

    test('GET /deliverynote/ - obtener todos', async () => {
        const res = await request(app)
            .get('/api/deliverynote/')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    }) 

    test('GET /deliverynote/:id - obtener uno por ID', async () => {
        const res = await request(app)
            .get(`/api/deliverynote/${deliverynote._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /deliverynote/pdf/:id - descarga PDF', async () => {
        const res = await request(app)
            .get(`/api/deliverynote/pdf/${deliverynote._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('GET /deliverynote/pdf/:id - descarga PDF', async () => {
        const res = await request(app)
            .get(`/api/deliverynote/pdf/${deliverynote._id}`)
            .set('Authorization', `Bearer ${token2}`)
        expect(res.statusCode).toBe(403)
    })

    test('GET /deliverynote/pdf/:id - descarga PDF', async () => {
        const res = await request(app)
            .get(`/api/deliverynote/pdf/${invalid_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('PATCH /deliverynote/sign/:id - firmar deliverynote', async () => {
        const res = await request(app)
            .patch(`/api/deliverynote/sign/${deliverynote._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                signature: "abcdefghij"
            })
        expect(res.statusCode).toBe(200)
    })

    test('DELETE /deliverynote/delete/:id - eliminar deliverynote', async () => {
        const res = await request(app)
            .delete(`/api/deliverynote/delete/${deliverynoteToDelete._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    test('DELETE /deliverynote/delete/:id - eliminar deliverynote', async () => {
        const res = await request(app)
            .delete(`/api/deliverynote/delete/${deliverynote._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(403)
    })

    test('POST /deliverynote/create - token invalido', async () => {
        const res = await request(app).post('/api/deliverynote/create')
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                project_name: project.name,
                number: "01"
            })
        expect(res.statusCode).toBe(401)
    })

    test('PATCH /deliverynote/sign/:id - token inválido', async () => {
        const res = await request(app)
            .patch(`/api/deliverynote/sign/${invalid_id}`)
            .set('Authorization', `Bearer ${invalid_token}`)
            .send({
                signature: "abcdefghij"
            })
        expect(res.statusCode).toBe(401)
    })
})
