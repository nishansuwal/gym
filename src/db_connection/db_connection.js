const mongoose = require("mongoose");
const { mongodbURL,mongodbUrlProd } = require("../configs/configuration");
mongoose.set('strictQuery', true);
mongoose.set('strictPopulate',true)
const databaseConnection = async () => {
  try {
    // console.log(process.env.NODE_ENV)
    // if (process.env.NODE_ENV !== "test") {
      const db_connection = await mongoose.connect(mongodbURL, {});
      db_connection && console.log("Database connection established");
    // }
  } catch (err) {
    console.log("Error in database connection", err);
  }
};

module.exports = databaseConnection;
