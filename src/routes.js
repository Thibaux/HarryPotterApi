const express = require('express');
const { getCharacters, getCharacterById, addOrUpdateCharacter, deleteCharacterById } = require('./dynamo');
const { validationResult, check } = require('express-validator');
const bodyParser = require('body-parser');

const apiRouter = express.Router();

apiRouter.use(express.urlencoded({
    extended: true
}));
apiRouter.use(express.json());

apiRouter.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next()
})



//  Health check
apiRouter.get('/', (req, res) => {
    console.log('target')
    const healthMss = 'API is healthy!';

    res.send(healthMss);
    return healthMss;
});


// Get all characters
apiRouter.get('/characters', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Get character by id
apiRouter.get('/characters/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const checkedId = await checkItem(id);

        if (checkedId === false) {
            res.status(400)
            res.json('The character with id: ' + id + ' could not be found.');
        } else {
            await getCharacterById(id);

            res.json(checkedId.Item);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});

// Post a new character
apiRouter.post('/characters/create', [
    check('id').not().isEmpty(),
    check('id').isInt().withMessage("id must be a int."),
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('species').not().isEmpty(),
    check('actor').not().isEmpty(),
    check('house').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const character = req.body;

    try {
        const newChar = await checkItem(req.body.id);

        if (newChar === false) {
            await addOrUpdateCharacter(character);

            res.status(201)
            res.json(character);

        } else {
            res.status(400)
            res.json('The character with id: ' + req.body.id + ' already exist.');
        }

    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ err: "Something went wrong" });
    }
});


// Update character
apiRouter.post('/characters/update/:id', async (req, res) => {
    const character = req.body;
    character.id = req.params.id;

    try {
        const updatedChar = await addOrUpdateCharacter(character)

        if (updatedChar) {
            res.json(character);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Delete character
apiRouter.delete('/characters/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const checkedId = await checkItem(id);

        if (checkedId === false) {
            res.status(400)
            res.json('The character with id: ' + id + ' could not be found.');
        } else {
            await deleteCharacterById(id);
            res.status(204)
            res.json("Character with id: " + id + " deleted.");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Check if a item with the id already exists.
async function checkItem(characterId) {
    const id = await getCharacterById(characterId);

    if (Object.entries(id).length === 0 && id.constructor === Object) {
        return false;
    } else {
        return id;
    }
}


module.exports = apiRouter;