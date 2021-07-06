const request = require('supertest')
const server = require('./src/server')

const characterId = 101;

// Fake timers using Jest
// beforeEach(() => {
//     jest.useFakeTimers()
// })

// describe('Test if we can create a character', () => {
//     it('Be able to create a character.', async () => {
//         request(server)
//             .post('/api/characters/create')
//             .send({ "id": `"${characterId}"` })
//             .expect(200)
//             .then((response) => {
//                 expect(response.body.id).toEqual(`"${characterId}"`)
//             })
        // .catch((error) => {
        //     expect(error).toEqual('');
        // })
        // .end()

        // .get(`/api/characters/${characterId}`)
        // .expect(200)
        // .then((response) => {
        //     expect(response.body.id).toEqual(`${characterId}`)
        // })
//     })
// });
