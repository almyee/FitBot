/**
 * test-mongo.js
 * -------------------------
 * This script demonstrates how to connect to a MongoDB Atlas cluster using the MongoDB Node.js driver.
 * It creates a MongoClient instance with a connection URI and connects to the MongoDB database.
 * The script sends a 'ping' command to the database to confirm the connection is successful.
 * After completing the operation, it ensures the MongoClient connection is closed.
 *
 * Used for verifying connectivity to the MongoDB database and ensuring the connection is established properly.
 */

// this works
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://almeyee:Erniedog2000!@cluster0.qnvu6r0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
