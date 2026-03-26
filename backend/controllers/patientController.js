import { getCompatibleBloodForPatient } from '../models/patient.js'

const getCompatibleBlood = async (req, res) => {
    try {
        const { patientid } = req.body

        if (!patientid) {
            return res.status(400).json({ message: "Patient ID is required" })
        }

        const result = await getCompatibleBloodForPatient(patientid)

        res.status(200).json({
            message: "Compatible blood retrieved successfully",
            data: result.recordset
        })
    } catch (error) {
        console.error("Get compatible blood error: ", error)
        res.status(500).json({
            message: "Failed to retrieve compatible blood",
            error: error.message
        })
    }
}

export { getCompatibleBlood }
