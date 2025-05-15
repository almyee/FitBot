/**
 * mongo.js
 * ----------
 * This module handles all database operations for the "fitbot" application using MongoDB.
 * It provides functions to create, read, update, and delete activity logs stored in the "activitylogs" collection.
 * It can also be run directly to test specific database operations.
 */


// mongo.js - this works to print out all the databases, DO NOT DELETE COMMENTS... please :)

// Import required modules
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Get MongoDB connection URI from environment variables
const uri = process.env.MONGO_URI
// const client = new MongoClient(uri);
// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


// ========== DATABASE OPERATION FUNCTIONS ========== //

// Insert a single activity log into the "activitylogs" collection
async function createActivtyLog (client, newActivtyLog) {
  const result = await client.db ("fitbot"). collection ("activitylogs").insertOne(newActivtyLog);
  console.log(`New activity log created with the following id: ${result.insertedId}`);
}

// Insert multiple activity logs at once
async function createMultipleActivtyLogs (client, newActivtyLog) {
  const result = await client.db ("fitbot"). collection ("activitylogs").insertMany(newActivtyLog);
  console.log(`${result.insertedCount} new activity logs created with the following id(s): `);
  console.log(result.insertedIds)
}

// Find a single activity log by name
async function findOneActivtyLogByName (client, nameOfActivtyLog) {
  const result = await client.db ("fitbot"). collection ("activitylogs").findOne({name: nameOfActivtyLog});
  if (result) {
    console.log(`Found an activity log in the collection with the name: ${nameOfActivtyLog}`);
    console.log(result);
  } else {
    console.log(`No activity logs found with the name: ${nameOfActivtyLog}`);
  }
  console.log(`New activity log created with the following id: ${result.insertedId}`);
}

// Find all activity logs (basic query)
async function findActivtyLogs (client) {
  const result = await client.db ("fitbot"). collection ("activitylogs").find();
  if (result) {
    console.log(`Found an activity logs in the collection: `);
    console.log(result);
  } else {
    console.log(`No activity logs found.`);
  }
}

// Find activity logs within a specified duration range
async function findActivtyLogsWithMaxMinDuration (client, {
  minDuration = 0, maxDuration = 0, maxNumResults = Number.MAX_SAFE_INTEGER} = {}) {
  const cursor = client.db ("fitbot"). collection ("activitylogs").find(
    {
      duration: { $gte: minDuration},
      duration: { $lte: maxDuration}
    }).sort({last_review: -1}).limit(maxNumResults);
    const results = await cursor.toArray();
    if (results.length > 0) {
      console.log(`Found activity log(s) with at least ${minDuration} and max ${maxDuration}`);
      // results.forEach((result, i) => {
      //   date = new Date(result.last_review).toDateString();
      //   console.log()
      // })
    }
}

// Update an activity log by name
async function updateActivityLogByName(client, nameOfActivtyLog, updatedActivityLog) {
  const result = await client.db("fitbot").collection ("activitylogs").updateOne({name: nameOfActivtyLog}, {$set: updatedActivityLog});
  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

// Delete a single activity log by name
async function deleteActivityLogByName(client, nameOfActivtyLog) {
  const result = await client.db("fitbot").collection("activitylogs").deleteOne({name: nameOfActivtyLog});
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

// Delete all activity logs with a specific name
async function deleteManyActivityLogByName(client, nameOfActivtyLog) {
  const result = await client.db("fitbot").collection("activitylogs").deleteMany({name: nameOfActivtyLog});
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

// List all databases (used for debugging or setup)
async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// List all documents from a specific database and collection
async function listActivityLogs(client, dbName, collectionName) {
  const collection = client.db(dbName).collection(collectionName);
  const documents = await collection.find({}).toArray();

  // console.log(`Documents in ${dbName}.${collectionName}:`);
  // documents.forEach(doc => console.log(doc));
  return documents
}
  // Create a new MongoDB client instance
  const client = new MongoClient(uri);

// ========== MAIN EXECUTION FUNCTION ========== //

async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */

  const uri = process.env.MONGO_URI  

  try {
      // Connect to the MongoDB cluster
      await client.connect();
      // await findActivtyLogs(client);
      await listActivityLogs(client, "fitbot", "activitylogs");
      // await deleteManyActivityLogByName(client, "alyssa2");
      // await deleteActivityLogByName(client, "alyssa2");
      // await updateActivityLogByName(client, "alyssa2", {duration: 15, action: "cardio"});
      // await findActivtyLogsWithMaxMinDuration(client, {
      //   minDuration: 5,
      //   maxDuration: 60,
      //   maxNumResults: 5
      // });
      // await findOneActivtyLogByName(client, "alyssa");
      // Make the appropriate DB calls
      // await  listDatabases(client);
      await createActivtyLog(client, {
        user: "alyssa",
        action: "jump rope",
        workoutType: "cardio",
        duration: "30",
        timestamp: "2019-02-16T05:00:00.000+00:00",
        intensity: "hard",
        caloriesBurned: 240
      })
      // await createMultipleActivtyLogs(client, [
      //   {
      //     name: "alyssa3",
      //     action: "workout9",
      //     timestamp: "2022-12-10T05:00:00.000+00:00",
      //     duration: 60
      //   },
      //   {
      //     name: "alyssa10",
      //     action: "workout7",
      //     timestamp: "2029-01-11T05:00:00.000+00:00",
      //     duration: 65
      //   }
      // ])

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);

// ========== EXPORT FUNCTIONS FOR USE IN OTHER FILES ========== //

module.exports = {
  listActivityLogs,
  createActivtyLog,
  createMultipleActivtyLogs,
  findOneActivtyLogByName,
  findActivtyLogs,
  findActivtyLogsWithMaxMinDuration,
  updateActivityLogByName,
  deleteActivityLogByName,
  deleteManyActivityLogByName,
  listDatabases,
  client
};
