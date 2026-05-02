import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import db from "./config/db.js";
import loadSchema from "./scripts/loadSchema.js";
import authRoutes from "./routes/authRoutes.js";
import authStepRoutes from "./routes/authStepRoutes.js";
import reqRoutes from "./routes/reqRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import testingRoutes from "./routes/testingRoutes.js";

const app = express()

app.use(cors())
app.use(express.json())
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Invalid JSON payload passed.",
            details: err.message
        });
    }
    next(err);
});
app.use(cookies())
app.use('/auth', authRoutes)
app.use('/auth/step', authStepRoutes)
app.use('/bloodrequest', reqRoutes)
app.use('/donor', donorRoutes)
app.use('/inventory', inventoryRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/patient', patientRoutes)
app.use('/testing', testingRoutes)

// Load database schema on startup
async function startServer() {
    try {
        await loadSchema();
        app.listen(3000, () => console.log("Backend running on port 3000"));
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
