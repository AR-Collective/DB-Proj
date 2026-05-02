import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const getTestResultsForDonations = async () => {
    try {
        const result = await db.execute(sql`SELECT * FROM vw_comprehensive_test_log`);
        return result;
    } catch (err) {
        throw err;
    }
};

export { getTestResultsForDonations };
