const express = require("express")
const sql = require("mssql")
const cors = require("cors")
require("dotenv").config({
  path: '../.env'
})

const app = express()
app.use(cors())

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
sql.connect(config)
  .then(() => console.log("✅ Connected to SQL Server successfully!"))
  .catch(err => console.error("❌ Database connection failed:", err.message));
app.get("/users", async (req, res) => {
  try {
    const result = await sql.query(`
    Select * from UserAccount
      `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.listen(3000, () => console.log("Backend running on port 3000"))
