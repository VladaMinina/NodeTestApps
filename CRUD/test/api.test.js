import { server } from '../src/server.js';
import request from 'supertest';

afterAll(() => {
    server.close();
});

describe('Test API endpoints', () => {
    let userId;

    test('GET /api/users expect to return empty array',
        async () => {
            const res = await request(server).get('/api/users');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        }
    );
    test('POST /api/users expect to create a new user',
        async () => {
            const res = await request(server)
                .post('/api/users')
                .send({
                    "name": "Vlada",
                    "age": 30,
                    "hobbies": ["dramming"]
                });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('Vlada');
            userId = res.body.id;
        }
    );

    test('GET /api/users/:id should return the created user', async () => {
        const res = await request(server).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body.name).toBe('Vlada');
        expect(res.body.age).toBe(30);
    });

    test('PUT /api/users/{userId} should update the user', async () => {
        const res = await request(server)
            .put(`/api/users/${userId}`)
            .send({ name: 'Pavel' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body.name).toBe('Pavel');
    });

    test('DELETE /api/users/:id should delete the user', async () => {
        const res = await request(server).delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(204);
    });

    test('GET /api/users/:id should return 404 after deletion', async () => {
        const res = await request(server).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(404);
    });
})