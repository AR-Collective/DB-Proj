import db from '../config/db.js';

const searchDonorByBloodType = async (bloodType) => {
    try {
        const result = await db.query(`SELECT * FROM fn_search_donors_by_blood_type($1)`, [bloodType]);
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonorHistory = async (donorId) => {
    try {
        const result = await db.query('SELECT * FROM fn_get_donor_history($1)', [donorId]);
        return result;
    } catch (err) {
        throw err;
    }
};

const updateDonorRating = async (donorId, rating) => {
    try {
        const result = await db.query('SELECT * FROM fn_update_donor_rating($1, $2)', [donorId, rating]);
        return result;
        
    } catch (err) {
        throw err;
    }
};

const getAverageDonationsPerDonor = async () => {
    try {
        const result = await db.query('SELECT * FROM vw_donor_donation_stats');
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonorsNeverTested = async () => {
    try {
        const result = await db.query('SELECT * FROM vw_unscreened_or_failed_donors');
        return result;
    } catch (err) {
        throw err;
    }
};

export { searchDonorByBloodType, getDonorHistory, updateDonorRating, getAverageDonationsPerDonor, getDonorsNeverTested };
