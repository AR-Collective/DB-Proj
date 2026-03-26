import { getInventoryByLocation } from '../models/inventory.js'

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

export { getBloodInventory }
