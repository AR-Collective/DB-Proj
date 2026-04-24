import db from '../config/db.js';

const getTestResultsForDonations = async () => {
    try {
        const query = `
            SELECT tr.TestID, tr.DonationID, d.DonorID, donor.Name as DonorName, d.DonationDate,
                   b.BloodType, tr.ScreeningStatus, tr.DiseaseIndicators, tr.TestDate
            FROM TestResult tr
            JOIN Donation d ON tr.DonationID = d.DonationID
            JOIN Donor donor ON d.DonorID = donor.DonorID
            JOIN BloodGroup b ON donor.BloodGroupID = b.BloodGroupID
            LEFT JOIN Patient p ON tr.PatientID = p.PatientID
            ORDER BY tr.TestDate DESC
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

export { getTestResultsForDonations }
