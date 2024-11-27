const axios = require('axios');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Schlüssel aus Firebase herunterladen

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server läuft!');
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://DEIN_PROJEKT.firebaseio.com"
});

const db = admin.firestore();

app.post('/register-player', async (req, res) => {
    const { playerId, email } = req.body;

    try {
        await db.collection('players').doc(playerId).set({ email, friends: [] });
        res.status(200).send('Spieler erfolgreich registriert!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Fehler beim Speichern des Spielers.');
    }
});

app.get('/search-player', async (req, res) => {
    const { playerId } = req.query;

    try {
        const playerDoc = await db.collection('players').doc(playerId).get();

        if (!playerDoc.exists) {
            return res.status(404).send('Spieler nicht gefunden.');
        }

        res.status(200).json({ playerId, ...playerDoc.data() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Fehler bei der Spielersuche.');
    }
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
