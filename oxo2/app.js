const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// MongoDB Realm connection details
const mongoURI = "https://eu-central-1.aws.data.mongodb-api.com/app/data-riarh/endpoint/data/v1/action";
const apiKey = "I6X7310DikfXUg7DXpOLUpoZSiW5i3aLDCDzWIaG86NUY566kDs0ra9OyKf71mf4";
const database = "OXO_inst";
const collection = "database";

// Function to make API requests to MongoDB Realm
const makeRealmRequest = async (method, endpoint, data = {}) => {
    try {
        const response = await axios({
            method,
            url: `${mongoURI}/${endpoint}`,
            data,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// GET request for all data
app.get('/data', async (req, res) => {
    try {
        const response = await makeRealmRequest('POST', 'find', {
            collection,
            database,
            dataSource: "Cluster0",
            projection: { "_id": 1, "versionLink": 1, "versionID": 1, "releaseDate": 1, "variantCount": 1, "variantDetails": 1 }
        });
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET request for a specific data item by versionID
app.get('/data/:versionID', async (req, res) => {
    try {
        const versionID = req.params.versionID;

        // Implement code to retrieve a specific item by versionID
        const response = await makeRealmRequest('POST', 'find', {
            collection,
            database,
            dataSource: "Cluster0",
            filter: { versionID }
            // Add other conditions or projections if needed
        });

        if (response.length === 0) {
            return res.status(404).send('No item found');
        }

        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// POST request to add new data
app.post('/data', async (req, res) => {
    try {
        const newData = req.body;
        const response = await makeRealmRequest('POST', 'insertOne', {
            collection,
            database,
            dataSource: "Cluster0",
            document: newData
        });
        res.status(201).json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT request to update data
app.put('/data/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const response = await makeRealmRequest('POST', 'updateOne', {
            collection,
            database,
            dataSource: "Cluster0",
            query: { "_id": req.params.id },
            update: { $set: updatedData }
        });
        if (response.modifiedCount === 0) {
            return res.status(404).send('No item found');
        }
        res.json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE request to remove data
app.delete('/data/:versionID', async (req, res) => {
    try {
        const versionID = req.params.versionID;
        const response = await makeRealmRequest('POST', 'deleteOne', {
            collection,
            database,
            dataSource: "Cluster0",
            filter: { versionID }
        });
        if (response.deletedCount === 0) {
            return res.status(404).send('No item found');
        }
        res.status(200).send('Item deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
