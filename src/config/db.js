const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === "test"
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

    await mongoose.connect(uri);

    if (process.env.NODE_ENV !== "test") {
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;