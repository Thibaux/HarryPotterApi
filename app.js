const { RDS } = require('aws-sdk');
const express = require('express');
const { getCharacters, getCharacterById, addOrUpdateCharacter, deleteCharacterById } = require('./dynamo');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());


//  Healt check
app.get('/', (req, res) => {
    res.send('API is healty!');
});


// Get all characters
app.get('/characters', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);

    } catch (error) {
        console.log(err);
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
        console.log(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

// Post a new character
app.post('/characters/create', async (req, res) => {
    const character = req.body;

    try {
        const newChar = await addOrUpdateCharacter(character)
        res.json(newChar);

    } catch (error) {
        console.log(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

// Update character
app.post('/characters/:id', async (req, res) => {
    const character = req.body;
    const id = req.params.id

    character.id = id;

    try {
        const updatedChar = await addOrUpdateCharacter(character)
        res.json(updatedChar);

    } catch (error) {
        console.log(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});


// Delete character
app.delete('/characters/:id', async (req, res) => {
    const id = req.params.id

    try {
        res.json(await deleteCharacterById(id));

    } catch (error) {
        console.log(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});



app.listen(port, () => {
    console.log('Lisening on port ' + port);
})



