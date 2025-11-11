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
      const newUser = req.body;

      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send('user alrady exits. do not need to insert again');
      } else {
        const result = await modelsCollection.insertOne(newUser);
        res.send(result);
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
