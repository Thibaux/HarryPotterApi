const express = require('express');
const app = express();
const { getCharacters, getCharacterById, addOrUpdateCharacter, deleteCharacterById } = require('./dynamo');
const { body, validationResult, check } = require('express-validator');
const apiRouter = express.Router();

//  Health check
apiRouter.get('/', (req, res) => {
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
        const characters = await getCharacterById(id);
        res.json(characters);

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
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const character = req.body;

        try {
            const newChar = await addOrUpdateCharacter(character);

            if (newChar) {
                res.send(character);
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ err: "Something went wrong" });
        }
    }
);

// Update character
apiRouter.post('/characters/update/:id', async (req, res) => {
    const character = req.body;
    character.id = req.params.id;

    try {
        const updatedChar = await addOrUpdateCharacter(character)
        res.json(updatedChar);

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Delete character
apiRouter.delete('/characters/:id', async (req, res) => {
    const id = req.params.id

    try {
        await deleteCharacterById(id);

        res.json("Character with id: " + id + " deleted.");
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


module.exports = apiRouter;