import dotenv from 'dotenv';

dotenv.config({
	path: '../.env'
});
import sql from "mssql"

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
const db = {
	connect: async () => {
		try {
			await sql.connect(config)
			console.log("Connected to SQL Server successfully!");
		}
		catch (err) {
			console.error("Database connection failed:", err.message);
			throw err; // Important: let the caller know it failed
		}
	}
}
export default db
