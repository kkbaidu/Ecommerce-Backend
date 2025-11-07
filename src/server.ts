// @ts-nocheck
import "dotenv/config";
import "express-async-errors";

// import the express app configured in app.js (CommonJS)
// import the express app configured in app.js (ESM)
import app from "./app.js";
import connectDB from "./db/connect.js";

const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";

const start = async () => {
  try {
    const dbconnection = await connectDB(process.env.MONGO_URL);
    if (dbconnection.connection.readyState === 1) {
      console.log("Connected to the database successfully");
    } else {
      console.log("Database connection failed");
    }
    if (env === "development") {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
