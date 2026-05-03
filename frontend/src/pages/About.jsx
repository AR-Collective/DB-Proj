import React from "react";
import {
    Heart,
    Users,
    Zap,
    Shield,
    Target,
    Lightbulb,
    Globe,
    Award,
    CheckCircle,
    ArrowRight,
    Droplets,
    Clock,
    MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
    const missionValues = [
        {
            icon: Heart,
            title: "Compassion",
            description:
                "We believe in the power of human compassion to save lives and build a healthier community.",
        },
        {
            icon: Target,
            title: "Excellence",
            description:
                "We strive for the highest standards in blood bank management and donor care.",
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description:
                "We leverage cutting-edge technology to make blood donation and distribution more efficient.",
        },
        {
            icon: Globe,
            title: "Inclusivity",
            description:
                "We work to ensure that blood donation is accessible to everyone willing to help.",
        },
    ];

    const achievements = [
        { number: "50,000+", label: "Blood Units Collected", icon: Droplets },
        { number: "10,000+", label: "Lives Saved", icon: Heart },
        { number: "150+", label: "Partner Hospitals", icon: MapPin },
        { number: "2.5M+", label: "Registered Donors", icon: Users },
    ];

    const teamRoles = [
        {
            role: "Medical Director",
            description:
                "Oversees blood safety, quality standards, and medical protocols",
        },
        {
            role: "Technology Lead",
            description:
                "Manages platform development and digital infrastructure",
        },
        {
            role: "Operations Manager",
            description:
                "Coordinates blood collection drives and distribution logistics",
        },
        {
            role: "Community Outreach",
            description:
                "Builds relationships with donors and healthcare facilities",
        },
    ];

    const timeline = [
        {
            year: "2018",
            title: "Foundation",
            description: "BloodConnect was founded with a mission to revolutionize blood banking",
        },
        {
            year: "2019",
            title: "First Partnership",
            description: "Established partnership with 10 major hospitals across the region",
        },
        {
            year: "2021",
            title: "Major Milestone",
            description: "Reached 1 million registered donors and saved 5,000 lives",
        },
        {
            year: "2023",
            title: "Expansion",
            description: "Expanded to 50 cities with 150+ partner hospitals",
        },
        {
            year: "2024",
            title: "Technology Upgrade",
            description: "Launched advanced inventory tracking and real-time matching system",
        },
        {
            year: "2025",
            title: "National Network",
            description: "Became the leading blood bank management platform nationwide",
        },
    ];

    const stats = [
        {
            stat: "24/7",
            label: "Emergency Response",
            description: "Round-the-clock support for critical blood requests",
        },
        {
            stat: "< 30min",
            label: "Average Response Time",
            description: "We deliver urgent blood supplies within minutes",
        },
        {
            stat: "99.8%",
            label: "Blood Safety",
            description: "Industry-leading screening and testing standards",
        },
        {
            stat: "5,000+",
            label: "Daily Transactions",
            description: "Managing thousands of donations and requests daily",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-red-50 mt-10">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-900 text-white py-20">
                <div className="absolute inset-0 opacity-20"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            About BloodConnect
                        </h1>
                        <p className="text-lg md:text-xl text-red-100">
                            Connecting compassionate donors with those in need through
                            innovative blood bank management technology.
                        </p>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-16"
                        viewBox="0 0 1200 150"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V150H0V90.83C36.67,85.19,76.33,76,112,69.33C160.67,59.67,224.67,47.33,321.39,56.44Z"
                            className="fill-slate-50"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                                    BloodConnect is dedicated to transforming blood banking
                                    through innovative technology and compassionate service. We
                                    believe that every person deserves access to safe, quality
                                    blood when they need it most.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Our platform connects donors, hospitals, and blood banks to
                                    create an efficient, transparent, and life-saving ecosystem
                                    that ensures blood is available 24/7 for those in critical
                                    need.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-12 flex items-center justify-center h-96">
                                <div className="text-center">
                                    <Heart className="w-24 h-24 text-red-600 mx-auto mb-4" />
                                    <p className="text-red-700 font-semibold text-lg">
                                        Saving Lives Through Technology
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Statement */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 flex items-center justify-center h-96 md:order-2">
                                <div className="text-center">
                                    <Globe className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                                    <p className="text-blue-700 font-semibold text-lg">
                                        A Healthier, Connected World
                                    </p>
                                </div>
                            </div>
                            <div className="md:order-1">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                                    Our Vision
                                </h2>
                                <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                                    We envision a world where blood is never in short supply,
                                    where every donation is managed safely and efficiently, and
                                    where patients receive the care they need without delay.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Through technology, dedication, and community engagement, we
                                    aim to build a global blood donation network that saves
                                    millions of lives and strengthens our collective commitment
                                    to healthcare equity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-slate-600">
                            These principles guide everything we do at BloodConnect
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {missionValues.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-slate-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-red-500 text-center"
                                >
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-slate-800">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Key Achievements */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Our Impact
                        </h2>
                        <p className="text-lg text-red-100">
                            Through hard work and innovation, we've achieved remarkable milestones
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {achievement.number}
                                    </div>
                                    <p className="text-red-100 font-medium">{achievement.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                            Our Journey
                        </h2>
                        <p className="text-lg text-slate-600">
                            From a startup idea to becoming the leading blood bank management platform
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-red-200"></div>

                            {/* Timeline items */}
                            <div className="space-y-12">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative">
                                        <div
                                            className={`flex gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                                }`}
                                        >
                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ml-0 md:ml-4">
                                                    <div className="text-red-600 font-bold text-lg mb-2">
                                                        {item.year}
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-slate-600">{item.description}</p>
                                                </div>
                                            </div>

                                            {/* Circle marker */}
                                            <div className="flex justify-center">
                                                <div className="w-5 h-5 rounded-full bg-red-600 border-4 border-white shadow-lg"></div>
                                            </div>

                                            {/* Empty space for alternating layout */}
                                            <div className="flex-1"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team & Organization */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                            Our Team
                        </h2>
                        <p className="text-lg text-slate-600">
                            Dedicated professionals committed to saving lives
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {teamRoles.map((team, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    {team.role}
                                </h3>
                                <p className="text-slate-600 text-sm">{team.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 max-w-3xl mx-auto text-center bg-red-50 rounded-2xl p-8">
                        <p className="text-slate-700 mb-4">
                            We're looking for passionate individuals to join our mission. If you're
                            interested in making a difference in healthcare, we'd love to hear from you.
                        </p>
                        <Link to="/careers" className="inline-block">
                            <button className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-300">
                                Join Our Team
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                            Why We Excel
                        </h2>
                        <p className="text-lg text-slate-600">
                            Our commitment to excellence is reflected in our performance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border-l-4 border-red-500"
                            >
                                <div className="text-4xl font-bold text-red-600 mb-2">
                                    {item.stat}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-slate-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Responsibility */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-6">
                                        Social Responsibility
                                    </h2>
                                    <ul className="space-y-4">
                                        {[
                                            "Free blood screening for all donors",
                                            "Community education programs",
                                            "Support for underserved hospitals",
                                            "Environmental sustainability initiatives",
                                            "Diversity and inclusion programs",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                                <span className="text-slate-700 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white rounded-2xl p-8 shadow-lg">
                                    <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                    <p className="text-center text-slate-600">
                                        We're committed to giving back to the community and ensuring
                                        that blood donation is accessible to everyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-red-700 to-red-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Be Part of Our Story
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of donors and healthcare professionals saving lives every day
                    </p>
                    <Link to="/register/donor">
                        <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl bg-white text-red-700 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Become a Donor <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
