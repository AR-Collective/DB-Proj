import { getCompatibleBloodForPatient, searchPatientByDisease } from '../models/patient.js'

const getCompatibleBlood = async (req, res) => {
    try {
        const { patientid } = req.body

        if (!patientid) {
            return res.status(400).json({ message: "Patient ID is required" })
        }

        const result = await getCompatibleBloodForPatient(patientid)

        res.status(200).json({
            message: "Compatible blood retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get compatible blood error: ", error)
        res.status(500).json({
            message: "Failed to retrieve compatible blood",
            error: error.message
        })
    }
}

const searchByDisease = async (req, res) => {
    try {
        const { disease } = req.body

        if (!disease) {
            return res.status(400).json({ message: "Disease search term is required" })
        }

        const result = await searchPatientByDisease(disease)

        res.status(200).json({
            message: "Patient search successful",
            data: result
        })
    } catch (error) {
        console.error("Search patient by disease error: ", error)
        res.status(500).json({
            message: "Failed to search patients",
            error: error.message
        })
    }
}

export { getCompatibleBlood, searchByDisease }
