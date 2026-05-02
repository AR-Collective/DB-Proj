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
        const result = await db.execute(sql`SELECT * FROM fn_update_donor_rating(${donorId}, ${rating})`);
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

const registerDonorModel = async (userId, age, bloodType) => {
    try {
        // Query for matching blood group
        let bgResult = await db.execute(sql`SELECT BloodGroupID FROM BloodGroup WHERE BloodType = ${bloodType}`);
        
        // Handle Result object - extract bloodGroupId (lowercase from API)
        let bloodGroupId;
        if (bgResult && bgResult.length > 0) {
            bloodGroupId = bgResult[0]?.bloodgroupid || bgResult[0]?.BloodGroupID;
        }
        
        if (!bloodGroupId) {
            throw new Error('Invalid blood type: ' + bloodType);
        }

        const result = await db.execute(sql`
            INSERT INTO Donor (DonorID, Age, BloodGroupID)
            VALUES (${userId}, ${age}, ${bloodGroupId})
            RETURNING *
        `);
        
        return result[0];
    } catch (err) {
        throw err;
    }
};

export { searchDonorByBloodType, getDonorHistory, updateDonorRating, getAverageDonationsPerDonor, getDonorsNeverTested, registerDonorModel };
