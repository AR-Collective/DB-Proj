import db from '../config/db.js';

const searchDonorByBloodType = async (bloodType) => {
    try {
        const query = `
            SELECT d.DonorID, u.FirstName, u.LastName, u.Contact, u.Gender, d.Age, b.BloodType, d.Rating
            FROM Donor d
            JOIN UserAccount u ON d.DonorID = u.UserID
            JOIN BloodGroup b ON d.BloodGroupID = b.BloodGroupID
            WHERE b.BloodType = @bloodtype
        `;

        return await db.query(query, { bloodtype: bloodType });
    } catch (err) {
        throw err;
    }
};

const getDonorHistory = async (donorId) => {
    try {
        const query = `
            SELECT d.DonationID, d.DonorID, d.DonationDate, d.Quantity, d.StaffID,
                   u.FirstName AS DonorFirstName, u.LastName AS DonorLastName, u.Contact, b.BloodType
            FROM Donation d
            JOIN Donor donor ON d.DonorID = donor.DonorID
            JOIN UserAccount u ON donor.DonorID = u.UserID
            JOIN BloodGroup b ON donor.BloodGroupID = b.BloodGroupID
            WHERE d.DonorID = @donorid
            ORDER BY d.DonationDate DESC
        `;

        return await db.query(query, { donorid: donorId });
    } catch (err) {
        throw err;
    }
};

const updateDonorRating = async (donorId, rating) => {
    try {
        const query = `
            UPDATE Donor
            SET Rating = @rating
            WHERE DonorID = @donorid
        `;

        return await db.query(query, { donorid: donorId, rating });
    } catch (err) {
        throw err;
    }
};

const getAverageDonationsPerDonor = async () => {
    try {
        const query = `
            SELECT d.DonorID, u.FirstName, u.LastName, u.Contact, COUNT(dn.DonationID) as TotalDonations,
                   AVG(dn.Quantity) as AverageDonationQuantity
            FROM Donor d
            JOIN UserAccount u ON d.DonorID = u.UserID
            LEFT JOIN Donation dn ON d.DonorID = dn.DonorID
            GROUP BY d.DonorID, u.FirstName, u.LastName, u.Contact
            ORDER BY TotalDonations DESC
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

const getDonorsNeverTested = async () => {
    try {
        const query = `
            SELECT d.DonorID, u.FirstName, u.LastName, u.Contact, d.Age, b.BloodType
            FROM Donor d
            JOIN UserAccount u ON d.DonorID = u.UserID
            JOIN BloodGroup b ON d.BloodGroupID = b.BloodGroupID
            WHERE d.DonorID NOT IN (
                SELECT DISTINCT donor.DonorID
                FROM Donation dn
                INNER JOIN Donor donor ON dn.DonorID = donor.DonorID
                INNER JOIN TestResult tr ON dn.DonationID = tr.DonationID
                WHERE tr.ScreeningStatus = 'Pass'
            )
            ORDER BY u.FirstName ASC, u.LastName ASC
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

export { searchDonorByBloodType, getDonorHistory, updateDonorRating, getAverageDonationsPerDonor, getDonorsNeverTested };
