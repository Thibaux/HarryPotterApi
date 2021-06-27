const express = require('express');
const { getCharacters, getCharacterById, addOrUpdateCharacter, deleteCharacterById } = require('./dynamo');
const { body, validationResult, check } = require('express-validator');
const bodyParser = require('body-parser');

const apiRouter = express.Router();

apiRouter.use(bodyParser.json());

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
        const checkedId = await checkItem(id);

        if (checkedId === 'err') {
            res.status(400)
            res.json('The character with id: ' + id + ' could not be found.');
        } else {
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
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const character = req.body;

        try {
            const newChar = await addOrUpdateCharacter(character);

            if (Object.keys(newChar).length === 0 && newChar.constructor === Object) {
                res.status(400)
                res.json('The character with id: ' + newChar + 'already exist.');
            } else {
                res.json(character);
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ err: "Something went wrong" });
        }

    }
);


// Update character
apiRouter.  post('/characters/update/:id', async (req, res) => {
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

        if (checkedId === 'err') {
            res.status(400)
            res.json('The character with id: ' + id + ' could not be found.');
        } else {
            res.json("Character with id: " + id + " deleted.");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});

async function checkItem (characterId) {
    const id = await getCharacterById(characterId);

    if (Object.keys(id).length === 0 && id.constructor === Object) {
        console.log('sdf')
        return 'err';
    } else {
        return id;
    }
}


module.exports = apiRouter;