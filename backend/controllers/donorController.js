import { searchDonorByBloodType } from '../models/donor.js'

const searchDonors = async (req, res) => {
    try {
        const { bloodtype } = req.body

        if (!bloodtype) {
            return res.status(400).json({ message: "Blood type is required" })
        }

        const result = await searchDonorByBloodType(bloodtype)

        res.status(200).json({
            message: "Donor search successful",
            data: result.recordset
        })
    } catch (error) {
        console.error("Donor search error: ", error)
        res.status(500).json({
            message: "Donor search failed",
            error: error.message
        })
    }
}

export { searchDonors }
