import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const rootDir = path.resolve(process.cwd(), '..');
const envPath = path.join(rootDir, '.env');
const localEnvPath = path.join(rootDir, '.env.local');

if (fs.existsSync(localEnvPath)) {
	dotenv.config({ path: localEnvPath });
}
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const pool = mysql.createPool({
	host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
	user: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'defaultdb',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	namedPlaceholders: true,
});

const db = {
	connect: async () => {
		try {
			const connection = await pool.getConnection();
			connection.release();
			console.log('Connected to MySQL successfully!');
		} catch (err) {
			console.error('Database connection failed:', err.message || err);
			throw err;
		}
	},
	query: async (sqlQuery, params = {}) => {
		const normalized = sqlQuery.replace(/@(\w+)/g, ':$1');
		const [rows] = await pool.execute(normalized, params);
		return { recordset: rows };
	}
};

export default db;
