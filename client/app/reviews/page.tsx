"use client";

import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useJobsContext } from "@/context/jobsContext";
import ReviewCard from "@/Components/JobItem/ReviewCard";
import { EnrichedJob } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquareQuote, 
  Inbox, 
  Sparkles, 
  BarChart3, 
  Filter 
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";

export default function Page() {
    const { userJobs, loading } = useJobsContext();
    const jobsData = (userJobs || []) as EnrichedJob[];

    // Розрахунок статистики для дизайну
    const totalReviews = jobsData.reduce((acc, job) =>  acc + (job.applicants?.length  || 0) + 0, 0);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full"
                    />
                    <p className="mt-4 text-slate-500 font-medium animate-pulse">
                        Аналізуємо відгуки та талантів...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Header />
            
            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Hero Header Section */}
                <div className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-emerald-100 text-[#166434] hover:bg-emerald-100 border-none px-3">
                                    <Sparkles size={12} className="mr-1 fill-[#166434]" />
                                    Talent Acquisition
                                </Badge>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                Центр <span className="text-[#166434] italic">відгуків</span>
                            </h2>
                            <p className="text-slate-500 mt-2 text-lg">
                                Керуйте кандидатами та аналізуйте активність на ваших вакансіях.
                            </p>
                        </div>

                        {/* Quick Stats Bento-style */}
                        <div className="flex gap-4">
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#166434]">
                                    <MessageSquareQuote size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900">{totalReviews}</div>
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Всього відгуків</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filter Sidebar (Placeholder for design) */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Filter size={18} /> Фільтрація
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                    Усі вакансії
                                </div>
                                <div className="p-3 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed">
                                    Тільки нові (Coming soon)
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#166434] rounded-[2rem] p-6 text-white overflow-hidden relative group">
                            <BarChart3 className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold mb-2">Порада</h4>
                            <p className="text-sm text-emerald-100/80 leading-relaxed">
                                Швидка відповідь протягом 24 годин підвищує лояльність кандидата на 40%.
                            </p>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence>
                            {jobsData.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-6"
                                >
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <Inbox size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Поки що тихо</h3>
                                    <p className="text-slate-500 max-w-sm mt-2">
                                        На ваші вакансії ще ніхто не відгукнувся. Спробуйте оновити опис або поділитися посиланням у соцмережах.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col gap-6"
                                >
                                    {jobsData.map((job, index) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="hover:translate-x-1 transition-transform"
                                        >
                                            <ReviewCard job={job} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}