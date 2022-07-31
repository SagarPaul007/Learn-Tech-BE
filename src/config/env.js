require("dotenv").config();
const { DB_URI, JWT_SECRET, PORT } = process.env;
module.exports = {
  DB_URI,
  JWT_SECRET,
  PORT,
};
