import { getInventoryByLocation, getExpiringUnits as getExpiringUnitsModel, removeExpiredUnits as removeExpiredUnitsModel, getBloodDemandByType, getBloodAvailabilityReport } from '../models/inventory.js'

const getBloodInventory = async (req, res) => {
    try {
        const result = await getInventoryByLocation()

        res.status(200).json({
            message: "Blood inventory retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get inventory error: ", error)
        res.status(500).json({
            message: "Failed to retrieve inventory",
            error: error.message
        })
    }
}

const getExpiringUnits = async (req, res) => {
    try {
        const { days } = req.query
        
        if (!days) {
            return res.status(400).json({ message: "Days parameter is missing" })
        }

        const result = await getExpiringUnitsModel(days)

        res.status(200).json({
            message: "Expiring blood units retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get expiring units error: ", error)
        res.status(500).json({
            message: "Failed to retrieve expiring units",
            error: error.message
        })
    }
}

const removeExpiredUnits = async (req, res) => {
    try {
        const result = await removeExpiredUnitsModel()

        res.status(200).json({
            message: "Expired blood units removed successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Remove expired units error: ", error)
        res.status(500).json({
            message: "Failed to remove expired units",
            error: error.message
        })
    }
}

const getBloodDemand = async (req, res) => {
    try {
        const result = await getBloodDemandByType()

        res.status(200).json({
            message: "Blood demand by type retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get blood demand error: ", error)
        res.status(500).json({
            message: "Failed to retrieve blood demand",
            error: error.message
        })
    }
}

const getAvailabilityReport = async (req, res) => {
    try {
        const result = await getBloodAvailabilityReport()

        res.status(200).json({
            message: "Blood availability report retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get availability report error: ", error)
        res.status(500).json({
            message: "Failed to retrieve availability report",
            error: error.message
        })
    }
}

export { getBloodInventory, getExpiringUnits, removeExpiredUnits, getBloodDemand, getAvailabilityReport }
