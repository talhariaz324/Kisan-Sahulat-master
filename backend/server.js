const app = require("./app");
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: Error Path is: ${err.message}`);
  console.log(`Shutting Down Server`);
  server.close(() => {
    process.exit(1);
  });
});
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
// Use functions which are using dotenv below or after dotenv configuration
const connectDB = require("./config/database");
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on the port http:localhost:${process.env.PORT}`
  );
});

// Unhandled promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: Error Path is: ${err.message}`);
  console.log(`Shutting Down Server`);
  server.close(() => {
    process.exit(1);
  });
});
