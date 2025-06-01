require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const csvFilePath = path.join(__dirname, '../sample.csv'); // adjust if your CSV is elsewhere

async function importCSV() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('fitbot'); // <-- replace with your DB name
    const collection = db.collection('activitylogs'); // <-- replace with your collection name

    // Read and parse CSV
    const records = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data) => records.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Parsed ${records.length} records`);

    if (records.length > 0) {
      const insertResult = await collection.insertMany(records);
      console.log(`Inserted ${insertResult.insertedCount} records`);
    } else {
      console.log('No records found to insert');
    }
  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

importCSV();
