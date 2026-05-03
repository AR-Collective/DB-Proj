import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Droplets, User, ClipboardList, PlusCircle, LogOut,
    Hospital, Activity, Clock, CheckCircle2, XCircle,
    ChevronRight, AlertCircle, Loader2, Beaker
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authHeaders = () => {
    const token = localStorage.getItem("auth_token");
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
};

const STATUS_STYLES = {
    Pending:   "bg-amber-100 text-amber-700 border border-amber-200",
    Fulfilled: "bg-green-100 text-green-700 border border-green-200",
    Rejected:  "bg-red-100 text-red-700 border border-red-200",
};

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [compatibleUnits, setCompatibleUnits] = useState([]);
    const [bloodGroups, setBloodGroups] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [newReq, setNewReq] = useState({
        bloodgroupid: "", quantity: 1, patientdisease: "", hospitalid: ""
    });

    // Load profile + dropdowns on mount
    useEffect(() => {
        fetchProfile();
        fetchDropdowns();
    }, []);

    // Load requests & compatible units when tab changes
    useEffect(() => {
        if (activeTab === "requests") fetchRequests();
        if (activeTab === "available") fetchCompatibleUnits();
    }, [activeTab]);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await axios.get(`${API}/patient/me`, authHeaders());
            setProfile(res.data.data);
        } catch {
            setError("Failed to load profile. Please log in again.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await axios.get(`${API}/patient/my-requests`, authHeaders());
            setRequests(res.data.data || []);
        } catch {
            setError("Failed to load requests.");
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchCompatibleUnits = async () => {
        setLoadingUnits(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await axios.post(`${API}/patient/compatible-blood`,
                { patientid: user.userid }, authHeaders());
            setCompatibleUnits(Array.from(res.data.data || []));
        } catch {
            setError("Failed to load compatible blood units.");
        } finally {
            setLoadingUnits(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const [bgRes, hRes] = await Promise.allSettled([
                axios.get(`${API}/patient/blood-groups`),
                axios.get(`${API}/patient/hospitals`),
            ]);
            if (bgRes.status === "fulfilled") setBloodGroups(bgRes.value.data.data || []);
            if (hRes.status === "fulfilled") setHospitals(Array.isArray(hRes.value.data.data) ? hRes.value.data.data : []);
        } catch {}
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!newReq.bloodgroupid || !newReq.quantity || !newReq.patientdisease || !newReq.hospitalid) {
            setError("Please fill all fields."); return;
        }
        setSubmitLoading(true);
        try {
            await axios.post(`${API}/patient/request`, {
                ...newReq,
                bloodgroupid: parseInt(newReq.bloodgroupid),
                quantity: parseInt(newReq.quantity),
                hospitalid: parseInt(newReq.hospitalid),
            }, authHeaders());
            setSuccess("Blood request submitted successfully!");
            setNewReq({ bloodgroupid: "", quantity: 1, patientdisease: "", hospitalid: "" });
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            setError(err.response?.data?.message || "Submission failed.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const tabs = [
        { id: "overview",  label: "Overview",        icon: Activity },
        { id: "requests",  label: "My Requests",     icon: ClipboardList },
        { id: "new",       label: "New Request",     icon: PlusCircle },
        { id: "available", label: "Available Blood", icon: Beaker },
    ];

    const pendingCount = requests.filter(r => r.fulfillmentstatus === "Pending").length;
    const fulfilledCount = requests.filter(r => r.fulfillmentstatus === "Fulfilled").length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Nav */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">
                            Blood<span className="text-red-600">Bank</span>
                        </span>
                        <span className="hidden sm:block text-gray-300 ml-2">|</span>
                        <span className="hidden sm:block text-sm text-gray-500 font-medium">Patient Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {profile && (
                            <span className="text-sm text-gray-700 font-medium hidden sm:block">
                                {profile.firstname} {profile.lastname}
                            </span>
                        )}
                        <button onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <aside className="lg:w-56 flex-shrink-0">
                    <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => { setActiveTab(id); setError(""); setSuccess(""); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-l-4
                                    ${activeTab === id
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                                {id === "requests" && requests.length > 0 && (
                                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                        {requests.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Alerts */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {loadingProfile ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                                </div>
                            ) : profile ? (
                                <>
                                    {/* Profile Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <h1 className="text-2xl font-bold text-white">
                                                        {profile.firstname} {profile.lastname}
                                                    </h1>
                                                    <p className="text-red-100 text-sm mt-0.5">{profile.email}</p>
                                                    <span className="inline-block mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                                                        Blood Type: {profile.bloodtype?.trim()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { label: "Contact", value: profile.contact },
                                                { label: "Gender", value: profile.gender === "M" ? "Male" : "Female" },
                                                { label: "Age", value: `${profile.age} years` },
                                                { label: "Disease / Condition", value: profile.disease },
                                                { label: "Hospital", value: profile.hospitalname },
                                                { label: "Hospital Location", value: profile.hospitallocation },
                                            ].map(({ label, value }) => (
                                                <div key={label}>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                                                    <p className="text-sm text-gray-800 font-semibold mt-0.5">{value || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "Total Requests", value: requests.length || "—", icon: ClipboardList, color: "blue" },
                                            { label: "Pending",   value: pendingCount || "—",   icon: Clock,         color: "amber" },
                                            { label: "Fulfilled", value: fulfilledCount || "—", icon: CheckCircle2,  color: "green" },
                                        ].map(({ label, value, icon: Icon, color }) => (
                                            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-50`}>
                                                    <Icon className={`w-5 h-5 text-${color}-500`} />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { label: "Submit a Blood Request", icon: PlusCircle, tab: "new", color: "red" },
                                                { label: "View My Requests",       icon: ClipboardList, tab: "requests", color: "blue" },
                                                { label: "Find Compatible Blood",  icon: Beaker,       tab: "available", color: "green" },
                                            ].map(({ label, icon: Icon, tab, color }) => (
                                                <button key={tab} onClick={() => setActiveTab(tab)}
                                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border border-${color}-100 bg-${color}-50 text-${color}-700 hover:bg-${color}-100 transition-colors font-medium text-sm`}>
                                                    <Icon className="w-4 h-4" />
                                                    {label}
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-12">No profile data found.</p>
                            )}
                        </div>
                    )}

                    {/* MY REQUESTS TAB */}
                    {activeTab === "requests" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900 text-lg">My Blood Requests</h2>
                                <button onClick={fetchRequests}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium">Refresh</button>
                            </div>
                            {loadingRequests ? (
                                <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-red-500" /></div>
                            ) : requests.length === 0 ? (
                                <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
                                    <ClipboardList className="w-12 h-12" />
                                    <p className="text-sm font-medium">No blood requests yet</p>
                                    <button onClick={() => setActiveTab("new")}
                                        className="text-red-600 text-sm font-semibold hover:underline">Submit your first request →</button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {requests.map((r) => (
                                        <div key={r.requestid} className="px-6 py-4 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {r.bloodtype?.trim()} — {r.quantity} unit{r.quantity !== 1 ? "s" : ""}
                                                    </span>
                                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.fulfillmentstatus] || "bg-gray-100 text-gray-600"}`}>
                                                        {r.fulfillmentstatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    <Hospital className="w-3 h-3 inline mr-1" />
                                                    {r.hospitalname} &nbsp;·&nbsp; {r.patientdisease}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-400">
                                                    {r.requestdate ? new Date(r.requestdate).toLocaleDateString() : "—"}
                                                </p>
                                                <p className="text-xs text-gray-400">ID #{r.requestid}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* NEW REQUEST TAB */}
                    {activeTab === "new" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-900 text-lg">New Blood Request</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Submit a request for blood units at your hospital</p>
                            </div>
                            <form onSubmit={handleSubmitRequest} className="px-6 py-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Blood Group Required <span className="text-red-500">*</span>
                                        </label>
                                        <select value={newReq.bloodgroupid}
                                            onChange={e => setNewReq({ ...newReq, bloodgroupid: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white outline-none transition">
                                            <option value="">— Select blood group —</option>
                                            {bloodGroups.map((bg, i) => (
                                                <option key={i} value={bg.bloodgroupid}>{bg.bloodtype?.trim()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Quantity (units) <span className="text-red-500">*</span>
                                        </label>
                                        <input type="number" min="1" max="20"
                                            value={newReq.quantity}
                                            onChange={e => setNewReq({ ...newReq, quantity: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Disease / Condition <span className="text-red-500">*</span>
                                    </label>
                                    <input type="text"
                                        placeholder="e.g. Thalassemia, post-surgery"
                                        value={newReq.patientdisease}
                                        onChange={e => setNewReq({ ...newReq, patientdisease: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Hospital <span className="text-red-500">*</span>
                                    </label>
                                    <select value={newReq.hospitalid}
                                        onChange={e => setNewReq({ ...newReq, hospitalid: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white outline-none transition">
                                        <option value="">— Select hospital —</option>
                                        {hospitals.map((h, i) => (
                                            <option key={i} value={h.hospitalid}>{h.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
                                    <strong>Note:</strong> Requests are reviewed by hospital staff. You'll be notified when fulfilled.
                                </div>
                                <button type="submit" disabled={submitLoading}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {submitLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><PlusCircle className="w-4 h-4" /> Submit Request</>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* AVAILABLE BLOOD TAB */}
                    {activeTab === "available" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-gray-900 text-lg">Compatible Blood Units</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Available units matching your blood type</p>
                                </div>
                                <button onClick={fetchCompatibleUnits}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium">Refresh</button>
                            </div>
                            {loadingUnits ? (
                                <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-red-500" /></div>
                            ) : compatibleUnits.length === 0 ? (
                                <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
                                    <Beaker className="w-12 h-12" />
                                    <p className="text-sm font-medium">No compatible units currently available</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {compatibleUnits.map((u, i) => (
                                        <div key={i} className="px-6 py-4 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <Droplets className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {u.bloodtype?.trim()} — {u.quantity} unit{u.quantity !== 1 ? "s" : ""}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {u.locationname} &nbsp;·&nbsp;
                                                    Expires: {u.expirydate ? new Date(u.expirydate).toLocaleDateString() : "—"}
                                                </p>
                                            </div>
                                            <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700 border border-green-200">
                                                {u.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
