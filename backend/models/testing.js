import db from '../config/db.js';

const getTestResultsForDonations = async () => {
    try {
        return await db.query('SELECT * FROM vw_comprehensive_test_log');
    } catch (err) {
        throw err;
    }
};

export { getTestResultsForDonations };
