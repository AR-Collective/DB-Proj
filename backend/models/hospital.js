import db from '../config/db.js';

const getHospitalVsAvailableStock = async () => {
    try {
        const query = `
            SELECT h.HospitalID, h.Name as HospitalName, h.Location,
                   b.BloodType, COALESCE(COUNT(br.RequestID), 0) as RequestCount,
                   COALESCE(SUM(CASE WHEN bu.Status = 'Available' THEN bu.Quantity ELSE 0 END), 0) as AvailableUnits
            FROM Hospital h
            LEFT JOIN BloodRequest br ON h.HospitalID = br.HospitalID
            LEFT JOIN BloodGroup b ON br.BloodGroupID = b.BloodGroupID OR (br.BloodGroupID IS NULL AND b.BloodGroupID = b.BloodGroupID)
            LEFT JOIN BloodUnit bu ON b.BloodGroupID = bu.BloodGroupID AND bu.Status = 'Available'
            GROUP BY h.HospitalID, h.Name, h.Location, b.BloodType, b.BloodGroupID
            ORDER BY h.HospitalID, b.BloodType
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

export { getHospitalVsAvailableStock };
