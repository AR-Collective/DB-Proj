require("dotenv").config({
  path: '../.env'
})
const sql = require("mssql")

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}
const connect = () => {
  sql.connect(config)
    .then(() => console.log("Connected to SQL Server successfully!"))
    .catch(err => console.error("Database connection failed:", err.message));
}
module.exports.connect = connect
