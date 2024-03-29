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

app.get('/find', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const q = req.query;

    const db = client.db('test');
    const collection = db.collection('test');

    const result = await collection.find({name:q.name, password:q.password}).toArray()
    res.json(result);

    await client.close()
})

app.post('/api', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    console.log(req.body)
    const collectionName = req.body.collection;
    const data = req.body.data;

    const db = client.db('test');
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(data);

    res.json(result)

    await client.close()
})

server.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});