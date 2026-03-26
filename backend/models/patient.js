import sql from 'mssql'

const getCompatibleBloodForPatient = async (patientId) => {
    try {
        const query = `
            SELECT p.PatientID, p.Name as PatientName, p.Disease, b.BloodType,
                   bu.UnitID, bu.Quantity, bu.ExpiryDate, sl.LocationName, bu.Status
            FROM Patient p
            JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
            LEFT JOIN BloodUnit bu ON b.BloodGroupID = bu.BloodGroupID AND bu.Status = 'Available'
            LEFT JOIN StorageLocation sl ON bu.LocationID = sl.LocationID
            WHERE p.PatientID = @patientid
            ORDER BY bu.ExpiryDate ASC
        `
        const request = new sql.Request()
        request.input('patientid', sql.VarChar, patientId)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

const searchPatientByDisease = async (disease) => {
    try {
        const query = `
            SELECT p.PatientID, p.Name, p.Age, p.Gender, p.Disease, h.Name as HospitalName,
                   b.BloodType
            FROM Patient p
            JOIN Hospital h ON p.HospitalID = h.HospitalID
            JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
            WHERE p.Disease LIKE @disease
            ORDER BY p.Name ASC
        `
        const request = new sql.Request()
        request.input('disease', sql.VarChar, `%${disease}%`)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

export { getCompatibleBloodForPatient, searchPatientByDisease }
