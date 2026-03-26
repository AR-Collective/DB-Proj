import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reqRoutes from "./routes/reqRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";

const app = express()

app.use(cors())
app.use(cookies())
app.use(express.json())
await db.connect()
app.use('/auth', authRoutes)
app.use('/bloodrequest', reqRoutes)
app.use('/donor', donorRoutes)


app.listen(3000, () => console.log("Backend running on port 3000"))
