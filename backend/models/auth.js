import db from '../config/db.js';

export const registerUserModel = async (data) => {
	try {
		const now = new Date();

		const query = `
		      INSERT INTO UserAccount (UserID, Username, Email, Password, Role, LastLogin, Status)
		      VALUES (@userid, @username, @email, @password, @role, @lastLogin, @status)
		    `;

		await db.query(query, {
			userid: data.userid,
			username: data.username,
			email: data.email,
			password: data.password,
			role: data.role,
			lastLogin: now,
			status: 'Active'
		});

	} catch (err) {
		throw err;
	}
};
export const loginUserModel = async (username) => {
	try {
		const result = await db.query(
			'SELECT * FROM UserAccount WHERE Username = @username',
			{ username }
		);
		return result.recordset[0];

	} catch (err) {
		throw err;
	}
}
