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

const getStaffProfile = async (staffId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_staff_profile(${staffId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

export { getHospitalVsAvailableStock, getStaffProfile };
