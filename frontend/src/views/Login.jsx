import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const WEBSITE_NAME = import.meta.env.VITE_WEBSITE_NAME || "BloodConnect";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "", role: "Staff" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (error) setError(""); // clear error on typing
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!formData.email || !formData.password) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}
		try {
			// Clear any stale session before attempting new login
			localStorage.removeItem("auth_token");
			localStorage.removeItem("user");
			localStorage.removeItem("role");

			const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/login`;
			let res;
			try {
				res = await axios.post(apiUrl, formData, { withCredentials: true });
			} catch (error) {
				const errorMessage =
					error.response?.data?.message ||
					(error.request ? "No response from server. Check your network." : "Login failed");
				throw new Error(errorMessage);
			}

			const { token, user } = res.data;
			const role = user?.role || "unknown";

			// Persist session
			localStorage.setItem("auth_token", token);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("role", role.toLowerCase());

			const endpoints = {
				Donor: "/donor",
				Staff: "/staff",
				Patient: "/patient",
				Admin: "/admin",
				unknown: "/login",
			};

			navigate(endpoints[role] || "/login", { replace: true });
		} catch (err) {
			console.error("Login error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};


	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			{/* Logo / Brand — same as Header.jsx */}
			<Link to="/" className="flex items-center gap-3 group mb-8">
				<div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
						<path d="M12 2C12 2 6 8 6 12a6 6 0 0012 0c0-4-6-10-6-10z" />
					</svg>
				</div>
				<div className="flex flex-col">
					<span className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
						{WEBSITE_NAME}
					</span>
					<span className="text-xs text-gray-500 -mt-0.5 font-medium">Blood Management System</span>
				</div>
			</Link>

			<div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
				<h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
					Login to Blood Bank
				</h2>
				<p className="text-center text-gray-500 mb-6">
					Access your donor, hospital, or lab dashboard
				</p>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
						<span className="mr-2">⚠</span>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-800 mb-1">
							Email
						</label>
						<input
							type="email"
							name="email"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							required
							disabled={loading}
							className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:opacity-50"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-800 mb-1">
							Password
						</label>
						<input
							type="password"
							name="password"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							required
							disabled={loading}
							className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:opacity-50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-800 mb-1">
							Select Role
						</label>
						<select
							value={formData.role}
							onChange={handleChange}
							name="role"
							className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white"
						>
							<option value="Donor">Donor</option>
							<option value="Patient">Patient</option>
							<option value="Staff">Staff</option>
						</select>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
					>
						{loading ? (
							<>
								<div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
								Logging in...
							</>
						) : (
							"Login"
						)}
					</button>
				</form>

				<p className="mt-6 text-center text-gray-600 text-sm">
					Don't have an account?{" "}
					<Link to="/" className="text-red-600 font-medium hover:underline">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
