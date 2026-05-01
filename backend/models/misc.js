import db from '../config/db.js';

export async function getNextSerial(role) {
	const mq = `SELECT MAX(UserID) as maxid FROM UserAccount WHERE Role = $1`;
	const res = await db.query(mq, [role]);
	const id = res[0]?.maxid;
	if (id) {
		const prefix = id.charAt(0);
		let numeric = parseInt(id.substring(1), 10);
		numeric += 1;
		const nextSerial = prefix + numeric.toString().padStart(3, '0');
		return nextSerial;
	}
}
