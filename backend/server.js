const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js")
app.use(cors())
app.use(express.json())
db.connect()
app.use('/auth', authRoutes)


app.listen(3000, () => console.log("Backend running on port 3000"))
