const request = require('supertest')
const server = require('../src/server')

describe('Test the routes.', () => {
    it('The API to be healthy.', async () => {
        request(server).get('/')
        expect(200)
        expect('API is healthy!')
    })

    it('The get characters route returns objects of characters.', async () => {
        await request(server)
            .get('/api/characters')
            .expect(200)
            .then((response) => {
                expect(response.body.Items[0]).toEqual(firstChar)
            })
    })

    it('The post characters route.', async () => {
        request(server)
            .post('/api/characters/create')
            .send({ "id": "101" })
            .expect(200)
            .then((response) => {
                expect(response.body.id).toEqual("101")
            })
    })
})

// Helper functions
const firstChar = {
    "ancestry": "pure-blood",
    "hairColour": "brown",
    "wand": {
        "length": "",
        "core": "",
        "wood": ""
    },
    "hogwartsStaff": false,
    "eyeColour": "brown",
    "name": "Kingsley Shacklebolt",
    "gender": "male",
    "actor": "George Harris",
    "yearOfBirth": "",
    "species": "human",
    "alive": true,
    "hogwartsStudent": false,
    "image": "http://hp-api.herokuapp.com/images/kingsley.jpg",
    "dateOfBirth": "",
    "patronus": "lynx",
    "id": "18",
    "house": ""
}