import { getTestResultsForDonations } from '../models/testing.js'

const getTestResults = async (req, res) => {
    try {
        const result = await getTestResultsForDonations()

        res.status(200).json({
            message: "Test results retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get test results error: ", error)
        res.status(500).json({
            message: "Failed to retrieve test results",
            error: error.message
        })
    }
}

export { getTestResults }
