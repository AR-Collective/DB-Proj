const express = require("express")
const cors = require("cors")
const cookies = require("cookie-parser")
const app = express()
const db = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js")
const reqRoutes = require("./routes/insertreqRoutes.js")

app.use(cors())
app.use(cookies())
app.use(express.json())
db.connect()
app.use('/auth', authRoutes)
app.use('req', reqRoutes)


app.listen(3000, () => console.log("Backend running on port 3000"))
