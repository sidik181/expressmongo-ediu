const { MongoClient, ServerApiVersion } = require('mongodb');

const devDbUrl = "mongodb+srv://sidik:password123!@eduwork.tb5pgu6.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || devDbUrl;

const client = new MongoClient(mongoDB, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
});

async () => {
    try {
      await client.connect();
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch(e) {
      console.log(e)
    }
}

const db = client.db('eduwork-native');

module.exports = db;
