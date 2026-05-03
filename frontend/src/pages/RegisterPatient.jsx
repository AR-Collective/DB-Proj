import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, AlertCircle, CheckCircle, Hospital } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterPatient() {
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
        disease: "",
        hospitalId: "",
    });
    const [bloodGroups, setBloodGroups] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loadingHospitals, setLoadingHospitals] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            setLoadingHospitals(true);
            try {
                const [bgRes, hospRes] = await Promise.allSettled([
                    axios.get(`${baseUrl}/patient/blood-groups`),
                    axios.get(`${baseUrl}/patient/hospitals`),
                ]);
                if (bgRes.status === "fulfilled") {
                    setBloodGroups(bgRes.value.data.data || []);
                }
                if (hospRes.status === "fulfilled") {
                    const hospData = hospRes.value.data.data || hospRes.value.data || [];
                    console.log("Hospitals loaded:", hospData);
                    setHospitals(Array.isArray(hospData) ? hospData : []);
                } else if (hospRes.status === "rejected") {
                    console.error("Hospitals fetch failed:", hospRes.reason?.message);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoadingHospitals(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
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
        if (!formData.age || formData.age < 1 || formData.age > 120) {
            setError("Please enter a valid age (1–120)");
            return false;
        }
        if (!formData.disease.trim()) {
            setError("Disease / medical condition is required");
            return false;
        }
        if (!formData.hospitalId) {
            setError("Please select a hospital");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/register/patient`;

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
                    disease: formData.disease,
                    hospitalId: parseInt(formData.hospitalId),
                },
                { withCredentials: true }
            );

            setSuccess(true);
            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", "Patient");

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
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Patient Registration
                        </h2>
                        <p className="text-gray-600">
                            Register to request blood and get connected with donors
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Used for urgent blood request notifications
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:opacity-50 disabled:bg-gray-100"
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
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    min="1"
                                    max="120"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">1–120 years</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Blood Group Required <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:opacity-50 disabled:bg-gray-100"
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
                                            <option value="A- ">A-</option>
                                            <option value="B+ ">B+</option>
                                            <option value="B- ">B-</option>
                                            <option value="AB+ ">AB+</option>
                                            <option value="AB- ">AB-</option>
                                            <option value="O+ ">O+</option>
                                            <option value="O- ">O-</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Disease */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Disease / Medical Condition <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="disease"
                                placeholder="e.g. Thalassemia, Anemia, Surgery"
                                value={formData.disease}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Helps match you with the right donors faster
                            </p>
                        </div>

                        {/* Hospital */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Hospital <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="hospitalId"
                                value={formData.hospitalId}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:opacity-50 disabled:bg-gray-100"
                            >
                                <option value="">-- Select your hospital --</option>
                                {loadingHospitals ? (
                                    <option disabled>Loading hospitals...</option>
                                ) : hospitals.length > 0 ? (
                                    hospitals.map((h, idx) => (
                                        <option key={idx} value={h.hospitalid}>
                                            {h.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No hospitals available</option>
                                )}
                            </select>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Hospital className="w-3 h-3" />
                                The hospital where you are currently admitted or receiving treatment
                            </p>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Note:</span> Your medical information
                                is kept strictly confidential and shared only with matched donors and
                                the assigned hospital staff.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Register as Patient
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
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