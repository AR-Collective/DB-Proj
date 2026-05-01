import db from '../config/db.js';

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
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

const getExpiringUnits = async (days) => {
    try {
        return await db.query('SELECT * FROM fn_get_expiring_units($1)', [days]);
    } catch (err) {
        throw err;
    }
};

const removeExpiredUnits = async () => {
    try {
        const query = `
            DELETE FROM BloodUnit
            WHERE ExpiryDate < CURRENT_DATE
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

const getBloodDemandByType = async () => {
    try {
        const query = `
            SELECT b.BloodType, COUNT(br.RequestID) as DemandCount
            FROM BloodRequest br
            JOIN BloodGroup b ON br.BloodGroupID = b.BloodGroupID
            GROUP BY b.BloodType, b.BloodGroupID
            HAVING COUNT(br.RequestID) > 0
            ORDER BY DemandCount DESC
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

const getBloodAvailabilityReport = async () => {
    try {
        const query = `
            SELECT b.BloodType, SUM(bu.Quantity) as TotalQuantity, bu.Status
            FROM BloodUnit bu
            JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
            WHERE bu.Status = 'Available'
            GROUP BY b.BloodType, bu.Status
            
            UNION
            
            SELECT b.BloodType, SUM(bu.Quantity) as TotalQuantity, bu.Status
            FROM BloodUnit bu
            JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
            WHERE bu.Status = 'Reserved'
            GROUP BY b.BloodType, bu.Status
            
            ORDER BY BloodType, Status
        `;

        return await db.query(query);
    } catch (err) {
        throw err;
    }
};

export { getInventoryByLocation, getExpiringUnits, removeExpiredUnits, getBloodDemandByType, getBloodAvailabilityReport };
