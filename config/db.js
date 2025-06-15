const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  const db =
    "mongodb+srv://faith-thedev:Missnigeria.@cluster0.18qdq7q.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0";
  mongoose
    .connect(db)
    .then(() => winston.info(`Database Connected...`))
    .catch((err) => winston.error(`Could not connect to Database:`, err));

  // Log the connection status
  winston.info(
    `Database connection established at ${new Date().toISOString()}`
  );
};
