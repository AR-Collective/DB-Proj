import sql from "mssql"


export const registerUserModel = async (data) => {
	try {
		const now = new Date();

		const query = `
		      INSERT INTO USERACCOUNT (UserID, Username, Email, Password, Role, LastLogin, Status)
		      VALUES (@userid, @username, @email, @password, @role, @lastLogin, @status)
		    `;

		const request = new sql.Request();
		request.input('userid', sql.VarChar, data.userid);
		request.input('username', sql.VarChar, data.username);
		request.input('email', sql.VarChar, data.email);
		request.input('password', sql.VarChar, data.password);
		request.input('role', sql.VarChar, data.role);
		request.input('lastLogin', sql.DateTime, now);
		request.input('status', sql.VarChar, 'Active');


		await request.query(query);

	} catch (err) {
		throw err;
	}
};
export const loginUserModel = async (username) => {
	try {
		const result = await sql.query(`
			Select * FROM UserAccount WHERE Username = '${username}'
			`)
		return result.recordset[0]

	} catch (err) {
		throw err
	}
}
