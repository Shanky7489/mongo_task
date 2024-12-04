const mongoose = require("mongoose");
require("dotenv").config(); // dotenv ko import karna

const ConnectDB = async () => {
  try {
    const MONGOURL = process.env.MONGO_URL; // .env se MONGO_URL lena

    // Mongoose ke connect function ka sahi use
    await mongoose.connect(MONGOURL);

    console.log("DB connection successfully");
  } catch (error) {
    console.error("DB connection error:", error); // Error message print karna
    process.exit(1); // Agar error aaye toh process exit kar dena
  }
};

module.exports = ConnectDB;
