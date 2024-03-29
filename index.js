const express = require('express');
const { MongoClient } = require('mongodb');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

const port = 3000;
const uri = 'your own mongodb uri';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/api', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    console.log(req.body)
    const collectionName = req.body.collection;
    const data = req.body.data;

    const db = client.db('test');
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(data);
    res.json(result);

    await client.close()
})

server.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});