import { getHospitalVsAvailableStock } from '../models/hospital.js'

const getHospitalStock = async (req, res) => {
    try {
        const result = await getHospitalVsAvailableStock()

        res.status(200).json({
            message: "Hospital vs available stock retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get hospital stock error: ", error)
        res.status(500).json({
            message: "Failed to retrieve hospital stock comparison",
            error: error.message
        })
    }
}

export { getHospitalStock }
