import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    Droplets, User, History, Search, LogOut,
    Activity, Star, Heart, ChevronRight,
    AlertCircle, Loader2, CheckCircle2, Calendar,
    Beaker, Award
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const WEBSITE_NAME = import.meta.env.VITE_WEBSITE_NAME || "BloodConnect";

const authHeaders = () => {
    const token = localStorage.getItem("auth_token");
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
};

const STAR_COLORS = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-emerald-500"];

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= rating ? STAR_COLORS[rating] + " fill-current" : "text-gray-300"}`} />
            ))}
            <span className="ml-1.5 text-sm text-gray-500 font-medium">{rating ? `${rating}/5` : "Unrated"}</span>
        </div>
    );
}

export default function DonorDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [bloodGroups, setBloodGroups] = useState([]);
    const [searchBT, setSearchBT] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { fetchProfile(); fetchBloodGroups(); }, []);
    useEffect(() => { if (activeTab === "history") fetchHistory(); }, [activeTab]);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await axios.get(`${API}/donor/me`, authHeaders());
            setProfile(res.data.data);
        } catch {
            setError("Failed to load profile. Please log in again.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await axios.get(`${API}/donor/my-history`, authHeaders());
            setHistory(res.data.data || []);
        } catch {
            setError("Failed to load donation history.");
        } finally {
            setLoadingHistory(false);
        }
    };

    const fetchBloodGroups = async () => {
        try {
            const res = await axios.get(`${API}/donor/blood-groups`);
            setBloodGroups(res.data.data || []);
        } catch {}
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchBT) return;
        setLoadingSearch(true); setError("");
        try {
            const res = await axios.post(`${API}/donor/search`, { bloodtype: searchBT }, authHeaders());
            setSearchResults(Array.from(res.data.data || []));
        } catch {
            setError("Search failed.");
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleLogout = () => { localStorage.clear(); navigate("/login", { replace: true }); };

    const tabs = [
        { id: "overview", label: "Overview",         icon: Activity },
        { id: "history",  label: "Donation History", icon: History },
        { id: "search",   label: "Search Donors",    icon: Search },
    ];

    const totalDonations = history.length;
    const totalUnits = history.reduce((s, d) => s + (Number(d.quantity) || 0), 0);
    const lastDonation = history[0]?.donationdate
        ? new Date(history[0].donationdate).toLocaleDateString() : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Nav */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M12 2C12 2 6 8 6 12a6 6 0 0012 0c0-4-6-10-6-10z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors">
                                {WEBSITE_NAME}
                            </span>
                            <span className="text-xs text-gray-400 leading-tight">Donor Portal</span>
                        </div>
                    </Link>
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
                            <button key={id} onClick={() => { setActiveTab(id); setError(""); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-l-4
                                    ${activeTab === id
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </button>
                        ))}
                    </nav>

                    {/* Blood type badge */}
                    {profile && (
                        <div className="mt-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 text-white text-center shadow-md">
                            <Droplets className="w-6 h-6 mx-auto mb-1 opacity-80" />
                            <p className="text-3xl font-bold">{profile.bloodtype?.trim()}</p>
                            <p className="text-xs text-red-100 mt-0.5">Your Blood Type</p>
                        </div>
                    )}
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {loadingProfile ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                                </div>
                            ) : profile ? (
                                <>
                                    {/* Profile card */}
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
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                                                            Blood Type: {profile.bloodtype?.trim()}
                                                        </span>
                                                        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                                                            <Heart className="w-3 h-3" /> Donor
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { label: "Contact",  value: profile.contact },
                                                { label: "Gender",   value: profile.gender === "M" ? "Male" : "Female" },
                                                { label: "Age",      value: `${profile.age} years` },
                                            ].map(({ label, value }) => (
                                                <div key={label}>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                                                    <p className="text-sm text-gray-800 font-semibold mt-0.5">{value || "—"}</p>
                                                </div>
                                            ))}
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Rating</p>
                                                <div className="mt-1"><StarRating rating={profile.rating} /></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "Total Donations", value: totalDonations || "—", icon: History,  color: "blue" },
                                            { label: "Units Donated",   value: totalUnits || "—",     icon: Droplets, color: "red" },
                                            { label: "Last Donation",   value: lastDonation || "None",icon: Calendar, color: "green", small: true },
                                        ].map(({ label, value, icon: Icon, color, small }) => (
                                            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-50`}>
                                                    <Icon className={`w-5 h-5 text-${color}-500`} />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-gray-900 ${small ? "text-base" : "text-2xl"}`}>{value}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick actions */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { label: "View Donation History", icon: History, tab: "history", color: "blue" },
                                                { label: "Search Donors by Blood Type", icon: Search, tab: "search", color: "green" },
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

                                    {/* Impact banner */}
                                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
                                        <Award className="w-10 h-10 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-red-900">Thank you for saving lives!</p>
                                            <p className="text-sm text-red-700 mt-0.5">
                                                Each donation can save up to <strong>3 lives</strong>. You've potentially saved up to <strong>{totalUnits * 3}</strong> people.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-12">No profile data found.</p>
                            )}
                        </div>
                    )}

                    {/* DONATION HISTORY */}
                    {activeTab === "history" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900 text-lg">Donation History</h2>
                                <button onClick={fetchHistory} className="text-sm text-red-600 hover:text-red-700 font-medium">Refresh</button>
                            </div>
                            {loadingHistory ? (
                                <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-red-500" /></div>
                            ) : history.length === 0 ? (
                                <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
                                    <History className="w-12 h-12" />
                                    <p className="text-sm font-medium">No donations recorded yet</p>
                                    <p className="text-xs text-gray-400">Your donation records will appear here</p>
                                </div>
                            ) : (
                                <>
                                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-4 gap-4">
                                        {["Date", "Quantity", "Blood Type", "Donation ID"].map(h => (
                                            <p key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</p>
                                        ))}
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {history.map((d, i) => (
                                            <div key={i} className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-800 font-medium">
                                                        {d.donationdate ? new Date(d.donationdate).toLocaleDateString() : "—"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Droplets className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-800 font-medium">{d.quantity} unit{d.quantity !== 1 ? "s" : ""}</span>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 w-fit">
                                                    {d.bloodtype?.trim()}
                                                </span>
                                                <span className="text-xs text-gray-400">#{d.donationid}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                                        <span>{history.length} donation{history.length !== 1 ? "s" : ""}</span>
                                        <span className="font-semibold text-red-600">{totalUnits} total units donated</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* SEARCH DONORS */}
                    {activeTab === "search" && (
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-semibold text-gray-900 text-lg mb-1">Search Donors by Blood Type</h2>
                                <p className="text-sm text-gray-500 mb-5">Find other registered donors matching a specific blood type</p>
                                <form onSubmit={handleSearch} className="flex gap-3">
                                    <select value={searchBT} onChange={e => setSearchBT(e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white outline-none transition">
                                        <option value="">— Select blood type —</option>
                                        {bloodGroups.map((bg, i) => (
                                            <option key={i} value={bg.bloodtype?.trim()}>{bg.bloodtype?.trim()}</option>
                                        ))}
                                    </select>
                                    <button type="submit" disabled={loadingSearch || !searchBT}
                                        className="px-5 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold text-sm hover:from-red-600 hover:to-rose-700 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        {loadingSearch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                        Search
                                    </button>
                                </form>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Results</h3>
                                        <span className="text-sm text-gray-500">{searchResults.length} donor{searchResults.length !== 1 ? "s" : ""} found</span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {searchResults.map((d, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {d.gender === "M" ? "Male" : "Female"} · Age {d.age} · {d.contact}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                        {d.bloodtype?.trim()}
                                                    </span>
                                                    <div className="mt-1"><StarRating rating={d.rating} /></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
