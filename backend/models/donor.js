import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const searchDonorByBloodType = async (bloodType) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_search_donors_by_blood_type(${bloodType})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonorHistory = async (donorId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_donor_history(${donorId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const updateDonorRating = async (donorId, rating) => {
    try {
        const result = await db.execute(sql`CALL sp_update_donor_rating(${donorId}, ${rating})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getAverageDonationsPerDonor = async () => {
    try {
        const result = await db.execute(sql`SELECT * FROM vw_donor_donation_stats`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonorsNeverTested = async () => {
    try {
        const result = await db.execute(sql`SELECT * FROM vw_unscreened_or_failed_donors`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getBloodGroups = async () => {
    try {
        const result = await db.execute(sql`SELECT * FROM vw_blood_groups`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonorProfile = async (donorId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_donor_profile(${donorId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getDonationHistory = async (donorId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_donor_history(${donorId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const getMatchingRequests = async (donorId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_matching_requests(${donorId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const reserveRequest = async (requestId) => {
    try {
        const result = await db.execute(sql`CALL sp_reserve_request(${requestId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

export {
    searchDonorByBloodType,
    getDonorHistory,
    updateDonorRating,
    getAverageDonationsPerDonor,
    getDonorsNeverTested,
    getBloodGroups,
    getDonorProfile,
    getDonationHistory,
    getMatchingRequests,
    reserveRequest
};
