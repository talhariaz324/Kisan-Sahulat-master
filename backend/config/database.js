const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`MongoDB connected Successfully at ${data.connection.host}`);
  });
};

module.exports = connectDB;
