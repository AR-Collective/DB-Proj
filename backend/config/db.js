// FOR PRODUCTION
// import { drizzle } from 'drizzle-orm/postgres-js';
// import dotenv from 'dotenv'
//
// dotenv.config({ path: '../../.env' })
// const db = drizzle({
// 	connection: {
// 		url: process.env.DATABASE_URL,
// 	}
// });
// export default db



import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const globalForDb = globalThis;

const queryClient = globalForDb.postgres || postgres(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') globalForDb.postgres = queryClient;

const db = drizzle(queryClient);

export default db;
