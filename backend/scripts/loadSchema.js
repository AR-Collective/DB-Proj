import fs from 'fs';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function loadSchema() {
    try {
        const sql = postgres(process.env.DATABASE_URL);
        
        console.log('Loading database schema from features.sql...');
        
        const schema = fs.readFileSync('../sql/features.sql', 'utf8');
        
        // Execute the entire file as-is, which properly handles dollar-quoted strings
        await sql.unsafe(schema);
        
        console.log('✅ Schema loaded successfully!');
        await sql.end();
    } catch (err) {
        console.error('❌ Error loading schema:', err.message);
        throw err;
    }
}

export default loadSchema;
