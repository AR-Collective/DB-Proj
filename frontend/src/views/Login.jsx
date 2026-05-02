"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Header from "../components/Header";
import Footer from "../components/Footer";

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

			let res;
			try {

				const apiUrl = `${import.meta.env.VITE_API_URL || ""}/auth/login`;
				res = await axios.post(apiUrl, formData, {
					withCredentials: true
				});

			} catch (error) {
				let errorMessage = "Login failed";

				if (error.response) {
					// The server responded with an error status (e.g., 401, 404, 500)
					// Even if it returned HTML, error.response.data will safely contain it
					// Safely try to grab the JSON message, fallback to the status code
					errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
					throw new Error(errorMessage || "Login failed");
				} else if (error.request) {
					errorMessage = "No response from server. Check your network.";
				}

				throw new Error(errorMessage);
			}
			let data = res.data.user


			const role = data?.role || "unknown";
			localStorage.setItem("role", role);
			const endpoints = {
				'Donor': '/donor',
				'Staff': '/staff',
				'Patient': '/patient',
				'Admin': '/admin',
				'unknown': '/login'
			}

			navigate(endpoints[role], { replace: true });
		} catch (err) {
			console.error("Login error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Header />
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
					<a href="/" className="text-red-600 font-medium hover:underline">
						Register
					</a>
				</p>
			</div>
		</div>
	);
}
