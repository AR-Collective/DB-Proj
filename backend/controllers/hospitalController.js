import { getHospitalVsAvailableStock, getStaffProfile as getStaffProfileModel } from '../models/hospital.js';
import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const getHospitalStock = async (req, res) => {
    try {
        const result = await getHospitalVsAvailableStock()

        res.status(200).json({
            message: "Hospital vs available stock retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get hospital stock error: ", error)
        res.status(500).json({
            message: "Failed to retrieve hospital stock comparison",
            error: error.message
        })
    }
}

const getStaffProfile = async (req, res) => {
    try {
        const staffId = req.user?.userid;
        if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await getStaffProfileModel(staffId);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Staff profile not found' });
        }

        res.status(200).json({ message: 'Profile retrieved successfully', data: result[0] });
    } catch (error) {
        console.error('Get staff profile error:', error);
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
};
const getDonors = async (req, res) => {
    try {
        const donors = await db.execute(sql`
            SELECT
                d.DonorID,
                ua.FirstName,
                ua.LastName,
                ua.Email,
                bg.BloodType,
                d.BloodGroupID
            FROM Donor d
            JOIN UserAccount ua ON d.DonorID = ua.UserID
            JOIN BloodGroup bg ON d.BloodGroupID = bg.BloodGroupID
            ORDER BY ua.FirstName
        `);
        res.status(200).json({ message: 'Donors retrieved', data: donors });
    } catch (error) {
        console.error('Get donors error:', error);
        res.status(500).json({ message: 'Failed to retrieve donors', error: error.message });
    }
};

const recordDonation = async (req, res) => {
    try {
        const staffId = req.user?.userid;
        if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

        const { donorid, quantity, expirydate, locationid } = req.body;

        if (donorid == null || quantity == null || !expirydate || locationid == null) {
            return res.status(400).json({ message: 'donorid, quantity, expirydate, and locationid are required' });
        }

        // Get donor's blood group
        const donorRes = await db.execute(sql`
            SELECT BloodGroupID FROM Donor WHERE DonorID = ${donorid}
        `);
        if (!donorRes || donorRes.length === 0) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        const bloodGroupId = donorRes[0].bloodgroupid;

        // Insert into Donation table
        const donationRes = await db.execute(sql`
            INSERT INTO Donation (DonorID, Quantity, StaffID, DonationDate)
            VALUES (${donorid}, ${quantity}, ${staffId}, CURRENT_DATE)
            RETURNING DonationID
        `);
        const donationId = donationRes[0].donationid;

        // Insert into BloodUnit table
        await db.execute(sql`
            INSERT INTO BloodUnit (BloodGroupID, Quantity, ExpiryDate, LocationID, DonationID, Status)
            VALUES (${bloodGroupId}, ${quantity}, ${expirydate}, ${locationid}, ${donationId}, 'Available')
        `);

        res.status(201).json({
            message: 'Donation recorded and blood unit added to inventory successfully',
            donationId
        });
    } catch (error) {
        console.error('Record donation error:', error);
        res.status(500).json({ message: 'Failed to record donation', error: error.message });
    }
};

export { getHospitalStock, getStaffProfile, getDonors, recordDonation }
