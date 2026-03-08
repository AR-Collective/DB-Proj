const sql = require("mssql")

// TODO: ABhi simple kiya hua iss mein sql injection ho skta
// ABhi sirf testing query not actual query
const registerUserModel = async (req, res) => {
	try {
		const result = await sql.query(`Select * FROM UserAccount`)
		res.json(result)

	} catch (err) {
		throw err
	}
}

module.exports = {
	registerUserModel
}
