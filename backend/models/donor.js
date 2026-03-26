import sql from 'mssql'

const searchDonorByBloodType = async (bloodType) => {
    try {
        const query = `
            SELECT d.DonorID, d.Name, d.Contact, d.Age, d.Gender, b.BloodType, d.Rating
            FROM Donor d
            JOIN BloodGroup b ON d.BloodGroupID = b.BloodGroupID
            WHERE b.BloodType = @bloodtype
        `
        const request = new sql.Request()
        request.input('bloodtype', sql.VarChar, bloodType)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

export { searchDonorByBloodType }
