// mongo.js - this works to print out all the databases
const { MongoClient } = require("mongodb");
require("dotenv").config();
// const uri = process.env.MONGO_URI
// const client = new MongoClient(uri);
// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

async function createActivtyLog (client, newActivtyLog) {
  const result = await client.db ("fitbot"). collection ("activitylogs").insertOne(newActivtyLog);
  console.log(`New activity log created with the following id: ${result.insertedId}`);
}

async function createMultipleActivtyLogs (client, newActivtyLog) {
  const result = await client.db ("fitbot"). collection ("activitylogs").insertMany(newActivtyLog);
  console.log(`${result.insertedCount} new activity logs created with the following id(s): `);
  console.log(result.insertedIds)
}

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

async function updateActivityLogByName(client, nameOfActivtyLog, updatedActivityLog) {
  const result = await client.db("fitbot").collection ("activitylogs").updateOne({name: nameOfActivtyLog}, {$set: updatedActivityLog});
  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function deleteActivityLogByName(client, nameOfActivtyLog) {
  const result = await client.db("fitbot").collection("activitylogs").deleteOne({name: nameOfActivtyLog});
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

async function deleteManyActivityLogByName(client, nameOfActivtyLog) {
  const result = await client.db("fitbot").collection("activitylogs").deleteMany({name: nameOfActivtyLog});
  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";
  const uri = process.env.MONGO_URI  //"mongodb+srv://almeyee:Erniedog2000!@cluster0.qnvu6r0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();
      // await deleteManyActivityLogByName(client, "alyssa2");
      // await deleteActivityLogByName(client, "alyssa2");
      // await updateActivityLogByName(client, "alyssa2", {duration: 15, action: "cardio"});
      // await findActivtyLogsWithMaxMinDuration(client, {
      //   minDuration: 5,
      //   maxDuration: 60,
      //   maxNumResults: 5
      // });
      await findOneActivtyLogByName(client, "alyssa");
      // Make the appropriate DB calls
      // await  listDatabases(client);
      // await createActivtyLog(client, {
      //   name: "alyssa",
      //   action: "workout1",
      //   timestamp: "2019-02-16T05:00:00.000+00:00"
      // })
      // await createMultipleActivtyLogs(client, [
      //   {
      //     name: "alyssa2",
      //     action: "workout5",
      //     timestamp: "2020-05-13T05:00:00.000+00:00",
      //     duration: 10
      //   },
      //   {
      //     name: "alyssa2",
      //     action: "workout6",
      //     timestamp: "2022-12-10T05:00:00.000+00:00",
      //     duration: 30
      //   },
      //   {
      //     name: "alyssa2",
      //     action: "workout7",
      //     timestamp: "2029-01-11T05:00:00.000+00:00",
      //     duration: 25
      //   },
      //   {
      //     name: "alyssa3",
      //     action: "workout8",
      //     timestamp: "2020-05-13T05:00:00.000+00:00",
      //     duration: 45
      //   },
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

// async function connectToDB() {
//   try {
//     if (!client.topology || !client.topology.isConnected()) {
//       await client.connect();
//       console.log("✅ Connected to MongoDB");
//     }
//     return client.db("fitbot"); // Use your actual database name
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     throw err;
//   }
// }

// module.exports = connectToDB;
