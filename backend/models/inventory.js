import db from '../config/db.js';

const getInventoryByLocation = async () => {
    try {
        return await db.query('SELECT * FROM vw_inventory_by_location');
    } catch (err) {
        throw err;
    }
};

const getExpiringUnits = async (days) => {
    try {
        return await db.query('SELECT * FROM fn_get_expiring_units($1)', [days]);
    } catch (err) {
        throw err;
    }
};

const removeExpiredUnits = async () => {
    try {
        return await db.query('CALL sp_purge_expired_units()');
    } catch (err) {
        throw err;
    }
};

const getBloodDemandByType = async () => {
    try {
        return await db.query('SELECT * FROM vw_blood_demand_analytics');
    } catch (err) {
        throw err;
    }
};

const getBloodAvailabilityReport = async () => {
    try {
        return await db.query('SELECT * FROM vw_availability_report');
    } catch (err) {
        throw err;
    }
};

export { getInventoryByLocation, getExpiringUnits, removeExpiredUnits, getBloodDemandByType, getBloodAvailabilityReport };
