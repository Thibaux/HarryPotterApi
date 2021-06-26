const rateLimit = require("express-rate-limit");
const express = require('express');
const { getCharacters, getCharacterById, addOrUpdateCharacter, deleteCharacterById } = require('./src/dynamo');
const { body, validationResult, check } = require('express-validator');
const app = express();

const port = process.env.PORT || 3000;

// Rate limit a IP adress for 5 minutes after 25 calls
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 25
});


const logger = function (req, res, next) {
    const dateTime = new Date();
    const logmss = 'Log: ' + dateTime;

    console.log(logmss);
    next()
}

app.use(limiter);
app.use(logger);
app.use(express.json());


//  Healt check
app.get('api/', (req, res) => {
    const healtymss = 'API is healty!';

    res.send(healtymss);
    return healtymss;
});


// Get all characters

app.get('/characters', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});



// Get character by id
app.get('/characters/:id', async (req, res) => {
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
app.post('/characters/create', [
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
            const newChar = await addOrUpdateCharacter(character)

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
app.post('/characters/:id', async (req, res) => {
    const character = req.body;
    const id = req.params.id

    character.id = id;

    try {
        const updatedChar = await addOrUpdateCharacter(character)
        res.json(updatedChar);

    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Delete character
app.delete('/characters/:id', async (req, res) => {
    const id = req.params.id

    try {
        await deleteCharacterById(id);

        res.send("Character with id: " + id + " deleted.");
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});



app.listen(port, () => {
    console.log('Lisening on port ' + port);
})

