/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
import { MongoClient, ObjectId } from "mongodb";
import assert from "assert";

const agg = [
  {
    $match: {
      product: new ObjectId("615c873ad584c748cc86e5bb"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numberOfReviews: {
        $sum: 1,
      },
    },
  },
];

// Modern MongoDB driver uses promises. Use an async IIFE for the example.
(async () => {
  const client = await MongoClient.connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
  try {
    const coll = client.db("").collection("");
    const cursor = coll.aggregate(agg);
    // consume cursor or convert to array
    const result = await cursor.toArray();
    // optionally assert on result
    // assert.equal(null, cmdErr);
  } finally {
    await client.close();
  }
})();
