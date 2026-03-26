import sql from 'mssql'

const getInventoryByLocation = async () => {
    try {
        const query = `
            SELECT sl.LocationID, sl.LocationName, sl.Address, sl.Capacity,
                   b.BloodType, SUM(bu.Quantity) as TotalUnits, COUNT(bu.UnitID) as NumberOfUnits
            FROM StorageLocation sl
            JOIN BloodUnit bu ON sl.LocationID = bu.LocationID
            JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
            GROUP BY sl.LocationID, sl.LocationName, sl.Address, sl.Capacity, b.BloodType
            ORDER BY sl.LocationName, b.BloodType
        `
        const request = new sql.Request()
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

const getExpiringUnits = async (days) => {
    try {
        const query = `
            SELECT bu.UnitID, b.BloodType, bu.ExpirationDate, sl.LocationName
            FROM BloodUnit bu
            JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
            JOIN StorageLocation sl ON bu.LocationID = sl.LocationID
            WHERE DATEDIFF(day, GETDATE(), bu.ExpirationDate) <= @days
            ORDER BY bu.ExpirationDate ASC
        `
        const request = new sql.Request()
        request.input('days', sql.Int, days)
        
        return await request.query(query)
    } catch (err) {
        throw err
    }
}

export { getInventoryByLocation, getExpiringUnits }
