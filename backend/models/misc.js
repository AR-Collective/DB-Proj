
import sql from "mssql"



export async function getNextSerial(role) {
	const mq = `Select max(userid) maxid From UserAccount Where role=@role`
	const request = new sql.Request()
	request.input('role', sql.VarChar, role)
	const res = await request.query(mq)
	const id = res.recordset[0].maxid
	if (id) {
		const prefix = id.charAt(0)
		let numeric = parseInt(id.substring(1))
		numeric += 1
		const nextSerial = prefix + numeric.toString().padStart(3, '0');
		return nextSerial
	}
}
