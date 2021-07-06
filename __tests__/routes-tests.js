const server = require('../src/server')
const supertest = require('supertest')

it('The API to be healthy.', async () => {
    await supertest(server)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.text).toEqual('API is healthy!')
        })
})


const expectedId = { id: '18' };

it('The API to return all the characters.', async () => {
    await supertest(server)
        .get('/api/characters')
        .expect(200)
        .then((response) => {
            expect(typeof (response.body)).toBe('object')
            expect(response.body.Items[0].ancestry).toEqual('pure-blood')
            expect(response.body.Items[0]).toEqual(
                expect.objectContaining(expectedId)
            )
        })
})


const characterId = 1;
const expectedBody = ['species', 'id', 'house', 'actor', 'firstName', 'lastName'];
const testCharacterId = 111;
const character = {
    "id": `${testCharacterId}`,
    "firstName": "TestCharFirst",
    "lastName": "TestCharLast",
    "species": "human",
    "actor": "Pietje Puk",
    "house": "Yes pleas"
};

it('The API to return one character by its id.', async () => {
    await supertest(server)
        .get(`/api/characters/${characterId}`)
        .expect(200)
        .then((response) => {
            expect(typeof (response.body)).toBe('object')
            expect(response.body.actor).toEqual('Pietje Puk')
            expect(response.body).toContainAllKeys(expectedBody)
        })
})

it('The API to be able to create a character.', async () => {
    await supertest(server)
        .post('/api/characters/create')
        .send({
            "id": "111",
            "firstName": "TestCharFirst",
            "lastName": "TestCharLast",
            "species": "human",
            "actor": "Pietje Puk",
            "house": "Yes pleas"
        })
        .expect(201)
        .then((response) => {
            expect(typeof (response.body)).toBe('object')
            expect(response.body).toContainAllKeys(expectedBody)
        })
        .catch((error) => {
            console.log(error);
        })
})

it('The API to be able to delete a character.', async () => {
    await supertest(server)
        .delete(`/api/characters/${testCharacterId}`)
        .expect(204)
})
