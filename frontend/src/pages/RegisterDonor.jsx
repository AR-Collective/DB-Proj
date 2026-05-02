import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, AlertCircle, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterDonor() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact: "",
        gender: "M",
        age: "",
        bloodGroup: "A+ ",
    });
    const [bloodGroups, setBloodGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBloodGroups = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/donor/blood-groups`);
                setBloodGroups(res.data.data || []);
            } catch (err) {
                console.log("Could not fetch blood groups");
            }
        };
        fetchBloodGroups();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(""); // Clear error on input change
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError("First name is required");
            return false;
        }
        if (!formData.lastName.trim()) {
            setError("Last name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!formData.password || formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (!formData.contact.trim()) {
            setError("Phone number is required");
            return false;
        }
        if (!/^\d{10,}$/.test(formData.contact.replace(/\D/g, ""))) {
            setError("Please enter a valid phone number (at least 10 digits)");
            return false;
        }
        if (!formData.age || formData.age < 16 || formData.age > 79) {
            setError("Age must be between 16 and 79");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/register/donor`;

            const response = await axios.post(
                apiUrl,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    contact: formData.contact,
                    gender: formData.gender,
                    age: parseInt(formData.age),
                    bloodGroup: formData.bloodGroup,
                },
                {
                    withCredentials: true,
                }
            );

            setSuccess(true);
            const token = response.data.token;
            const user = response.data.user;

            // Store auth data
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", "Donor");

            // Redirect to home after 2 seconds
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);
        } catch (err) {
            console.error("Registration error:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-grow flex items-center justify-center px-4 py-12 mt-20">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Become a Life Saver
                        </h2>
                        <p className="text-gray-600">
                            Join our blood donor community and save lives today
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-800">
                                    Registration Successful!
                                </p>
                                <p className="text-sm text-green-700">
                                    Redirecting you to your dashboard...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Asjad"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Raza"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="asjad@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="contact"
                                placeholder="+92 123 4567890"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                We'll use this for emergency notifications
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white disabled:opacity-50 disabled:bg-gray-100"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>

                        {/* Age & Blood Group Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="19"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    min="16"
                                    max="79"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">16-79 years</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Blood Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white disabled:opacity-50 disabled:bg-gray-100"
                                >
                                    {bloodGroups.length > 0 ? (
                                        bloodGroups.map((bg, idx) => {
                                            const btType = bg.bloodtype || bg.BloodType;
                                            return (
                                                <option key={idx} value={btType}>
                                                    {btType.trim()}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <option value="A+ ">A+</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    At least 8 characters
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Note:</span> Your information will be
                                securely stored and used only for blood donation coordination and
                                emergency notifications.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5" />
                                    Register as Donor
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                            >
                                Sign in here
                            </a>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
