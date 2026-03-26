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

const getDonorHistory = async (donorId) => {
    try {
        const query = `
            SELECT d.DonationID, d.DonorID, d.DonationDate, d.Quantity, d.StaffID, 
                   donor.Name, donor.Contact, b.BloodType
            FROM Donation d
            JOIN Donor donor ON d.DonorID = donor.DonorID
            JOIN BloodGroup b ON donor.BloodGroupID = b.BloodGroupID
            WHERE d.DonorID = @donorid
            ORDER BY d.DonationDate DESC
        `
        const request = new sql.Request()
        request.input('donorid', sql.VarChar, donorId)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

const updateDonorRating = async (donorId, rating) => {
    try {
        const query = `
            UPDATE Donor
            SET Rating = @rating
            WHERE DonorID = @donorid
        `
        const request = new sql.Request()
        request.input('donorid', sql.VarChar, donorId)
        request.input('rating', sql.INT, rating)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

const getAverageDonationsPerDonor = async () => {
    try {
        const query = `
            SELECT d.DonorID, d.Name, d.Contact, COUNT(dn.DonationID) as TotalDonations,
                   AVG(dn.Quantity) as AverageDonationQuantity
            FROM Donor d
            LEFT JOIN Donation dn ON d.DonorID = dn.DonorID
            GROUP BY d.DonorID, d.Name, d.Contact
            ORDER BY TotalDonations DESC
        `
        const request = new sql.Request()
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

export { searchDonorByBloodType, getDonorHistory, updateDonorRating, getAverageDonationsPerDonor }
