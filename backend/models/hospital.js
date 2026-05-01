import db from '../config/db.js';

const getHospitalVsAvailableStock = async () => {
    try {
        const result = await db.query(`SELECT * FROM vw_hospital_demand_vs_stock');`);
        return result;
    } catch (err) {
        throw err;
    }
};

export { getHospitalVsAvailableStock };
