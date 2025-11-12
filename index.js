const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lr5e3w.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('server is running!!!');
});

async function run() {
  try {
    await client.connect();

    const db = client.db('AiModelsManager');
    const modelsCollection = db.collection('models');

    // Models API

    // Post User API
    app.post('/models', async (req, res) => {
      try {
        const newModel = req.body;

        const query = { name: newModel.name };
        const existing = await modelsCollection.findOne(query);

        if (existing) {
          return res.send({ message: 'Model already exists' });
        }

        const result = await modelsCollection.insertOne(newModel);
        res.send(result);
      } catch (error) {
        console.error('Error adding model:', error);
        res.status(500).send({ message: 'Failed to add model' });
      }
    });

    // grt modeldetails
    app.get('/modeldetails/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await modelsCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: 'Model not found' });
        }

        res.send(result);
      } catch (error) {
        console.error('Error fetching model:', error);
        res.status(500).send({ message: 'Failed to fetch model' });
      }
    });

    // get all user
    app.get('/models', async (req, res) => {
      const result = await modelsCollection.find().toArray();
      res.send(result);
    });

    // most recent models
    app.get('/latest-models', async (req, res) => {
      const result = await modelsCollection
        .find()
        .sort({ created_at: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // get one models API
    app.get('/modeldetails/:id', async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID' });
      }

      const query = { _id: id };
      console.log(id);
      console.log(query);

      const result = await modelsCollection.findOne(query);
      console.log('result for server', result);
      res.json(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`Server is Running on ${port}`);
});
