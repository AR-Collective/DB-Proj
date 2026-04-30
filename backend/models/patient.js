import db from '../config/db.js';

const getCompatibleBloodForPatient = async (patientId) => {
    try {
        const query = `
            SELECT p.PatientID, u.FirstName AS PatientFirstName, u.LastName AS PatientLastName,
                   u.Gender, p.Disease, b.BloodType,
                   bu.UnitID, bu.Quantity, bu.ExpiryDate, sl.LocationName, bu.Status
            FROM Patient p
            JOIN UserAccount u ON p.PatientID = u.UserID
            JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
            LEFT JOIN BloodUnit bu ON b.BloodGroupID = bu.BloodGroupID AND bu.Status = 'Available'
            LEFT JOIN StorageLocation sl ON bu.LocationID = sl.LocationID
            WHERE p.PatientID = @patientid
            ORDER BY bu.ExpiryDate ASC
        `;

        return await db.query(query, { patientid: patientId });
    } catch (err) {
        throw err;
    }
};

const searchPatientByDisease = async (disease) => {
    try {
        const query = `
            SELECT p.PatientID, u.FirstName, u.LastName, p.Age, u.Gender, p.Disease, h.Name as HospitalName,
                   b.BloodType
            FROM Patient p
            JOIN UserAccount u ON p.PatientID = u.UserID
            JOIN Hospital h ON p.HospitalID = h.HospitalID
            JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
            WHERE p.Disease LIKE @disease
            ORDER BY u.FirstName ASC, u.LastName ASC
        `;

        return await db.query(query, { disease: `%${disease}%` });
    } catch (err) {
        throw err;
    }
};

export { getCompatibleBloodForPatient, searchPatientByDisease };
