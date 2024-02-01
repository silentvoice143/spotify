const mongoose = require("mongoose");
require("dotenv").config;

// const Grid = require("gridfs-stream");

// Adjust the path accordingly

// Replace 'your_database_name' with the actual name of your MongoDB database
const databaseName = "spotify";

// Connection URI
const uri = process.env.MONGODB_URI;

async function ConnectDB() {
  console.log(uri);
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const conn = mongoose.connection;

    console.log(`mongoDb connected: ${databaseName}`);
  } catch (err) {
    console.log(`Error connecting to database: ${err}`);
  }

  // Get the default connection
  //   const db = mongoose.connection;

  // Event listener for successful connection
  //   db.once("open", () => {
  //     console.log(`Connected to MongoDB: ${databaseName}`);
  //   });

  // Event listener for connection errors
  //   db.on("error", (error) => {
  //     console.error(`MongoDB connection error: ${error}`);
  //   });
}

module.exports = { ConnectDB, uri };
