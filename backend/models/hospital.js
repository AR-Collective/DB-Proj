import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const getHospitalVsAvailableStock = async () => {
    try {
        const result = await db.execute(sql`SELECT * FROM vw_hospital_demand_vs_stock`);
        return result;
    } catch (err) {
        throw err;
    }
};

export { getHospitalVsAvailableStock };
